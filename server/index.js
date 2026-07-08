import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDatabasePath, getState, resetState, saveState } from "./database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const port = Number(process.env.PORT || 8787);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function createStripeCheckout({ mode, items, plan, customer, successUrl, cancelUrl }) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return {
      configured: false,
      error: "STRIPE_SECRET_KEY nao configurada no servidor.",
    };
  }

  const body = new URLSearchParams();
  body.set("mode", mode);
  body.set("payment_method_types[0]", "card");
  body.set("success_url", successUrl);
  body.set("cancel_url", cancelUrl);
  body.set("locale", "pt-BR");

  if (customer?.email) {
    body.set("customer_email", customer.email);
  }

  if (mode === "subscription") {
    body.set("line_items[0][quantity]", "1");
    body.set("line_items[0][price_data][currency]", "brl");
    body.set("line_items[0][price_data][unit_amount]", String(plan.amountCents));
    body.set("line_items[0][price_data][recurring][interval]", "month");
    body.set("line_items[0][price_data][product_data][name]", plan.planName || plan.name);
  } else {
    items.forEach((item, index) => {
      body.set(`line_items[${index}][quantity]`, String(item.qty));
      body.set(`line_items[${index}][price_data][currency]`, "brl");
      body.set(
        `line_items[${index}][price_data][unit_amount]`,
        String(Math.max(50, Math.round(item.discountedPrice * 100)))
      );
      body.set(`line_items[${index}][price_data][product_data][name]`, item.name);
      if (item.image) {
        body.set(`line_items[${index}][price_data][product_data][images][0]`, item.image);
      }
    });
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await response.json();

  if (!response.ok) {
    return {
      configured: true,
      error: data?.error?.message || "Stripe recusou a criacao do checkout.",
    };
  }

  return {
    configured: true,
    url: data.url,
    sessionId: data.id,
  };
}

async function handleApi(req, res, pathname) {
  if (pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, database: getDatabasePath() });
  }

  if (pathname === "/api/state" && req.method === "GET") {
    return sendJson(res, 200, getState());
  }

  if (pathname === "/api/state" && (req.method === "PUT" || req.method === "POST")) {
    return sendJson(res, 200, saveState(await readJson(req)));
  }

  if (pathname === "/api/state/reset" && req.method === "POST") {
    return sendJson(res, 200, resetState());
  }

  if (pathname === "/api/stripe/checkout" && req.method === "POST") {
    const payload = await readJson(req);
    const result = await createStripeCheckout({ mode: "payment", ...payload });
    return sendJson(res, result.url ? 200 : 503, result);
  }

  if (pathname === "/api/stripe/subscription" && req.method === "POST") {
    const payload = await readJson(req);
    const result = await createStripeCheckout({ mode: "subscription", ...payload });
    return sendJson(res, result.url ? 200 : 503, result);
  }

  return sendJson(res, 404, { error: "API nao encontrada." });
}

function serveStatic(req, res, pathname) {
  const safePath = decodeURIComponent(pathname).replace(/^[/\\]+/, "");
  let filePath = path.resolve(distDir, safePath);

  if (!filePath.startsWith(distDir) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, "index.html");
  }

  if (!existsSync(filePath)) {
    return sendJson(res, 404, {
      error: "Build nao encontrado. Rode npm run build antes de npm start.",
    });
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url.pathname);
      return;
    }

    serveStatic(req, res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Erro interno." });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Casas Bahia server listening on http://127.0.0.1:${port}`);
  console.log(`SQLite database: ${getDatabasePath()}`);
});
