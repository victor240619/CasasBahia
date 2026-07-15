import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDatabasePath, getState, resetState, saveState } from "./database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

for (const envFile of [".env", ".env.local"]) {
  loadEnvFile(path.join(rootDir, envFile));
}

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

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator <= 0) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function appendCheckoutSessionId(rawUrl, extraParams = {}) {
  const fallback = rawUrl || "http://127.0.0.1:8787/sucesso";
  const url = new URL(fallback, "http://127.0.0.1:8787");

  for (const [key, value] of Object.entries(extraParams)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  url.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
  const output = rawUrl?.startsWith("/") ? `${url.pathname}${url.search}${url.hash}` : url.toString();

  return output.replace("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}");
}

function normalizeCustomer(customer = {}) {
  return {
    name: String(customer.name || "Cliente Stripe").trim() || "Cliente Stripe",
    email: String(customer.email || "").trim().toLowerCase(),
  };
}

function normalizeStripeItems(items = []) {
  return items
    .map((item) => {
      const quantity = Math.max(1, Number(item.qty || item.quantity || 1));
      const unitPriceCents = Number.isFinite(item.unitPriceCents)
        ? Math.max(50, Math.round(item.unitPriceCents))
        : Math.max(50, Math.round(Number(item.discountedPrice || item.price || 0) * 100));

      return {
        productId: item.productId || item.id || null,
        name: String(item.name || "Produto").trim() || "Produto",
        image: item.image || "",
        unitPriceCents,
        quantity,
        totalCents: unitPriceCents * quantity,
      };
    })
    .filter((item) => item.totalCents > 0);
}

function normalizeStripePlan(plan = {}) {
  const amountCents = Math.max(50, Math.round(Number(plan.amountCents || 0)));

  return {
    id: plan.id || createId("stripe-plan"),
    name: plan.planName || plan.name || "Assinatura mensal",
    amountCents,
    interval: plan.interval || "month",
  };
}

function addAudit(state, actor, action) {
  return [
    {
      id: createId("audit"),
      at: new Date().toISOString(),
      actor,
      action,
    },
    ...(Array.isArray(state.audit) ? state.audit : []),
  ];
}

function upsertStripeSession(state, sessionRecord) {
  const current = Array.isArray(state.stripeSessions) ? state.stripeSessions : [];
  const next = [sessionRecord, ...current.filter((item) => item.sessionId !== sessionRecord.sessionId)];

  return next.slice(0, 250);
}

function getPendingStripeSession(state, sessionId) {
  return (Array.isArray(state.stripeSessions) ? state.stripeSessions : []).find(
    (item) => item.sessionId === sessionId
  );
}

function getObjectId(value) {
  return typeof value === "string" ? value : value?.id || null;
}

function upsertGatewayCard(state, cardRecord) {
  const current = Array.isArray(state.gatewayCards) ? state.gatewayCards : [];
  const matchKey =
    cardRecord.paymentMethodId ||
    cardRecord.token ||
    `${cardRecord.customerEmail}:${cardRecord.brand}:${cardRecord.last4}:${cardRecord.expMonth}:${cardRecord.expYear}`;
  const existing = current.find((card) => {
    const key =
      card.paymentMethodId ||
      card.token ||
      `${card.customerEmail}:${card.brand}:${card.last4}:${card.expMonth}:${card.expYear}`;
    return key === matchKey;
  });
  const nextCard = {
    ...(existing || {}),
    ...cardRecord,
    id: existing?.id || cardRecord.id,
    createdAt: existing?.createdAt || cardRecord.createdAt,
    updatedAt: new Date().toISOString(),
  };

  return [nextCard, ...current.filter((card) => card.id !== nextCard.id)].slice(0, 500);
}

function getCardFromPaymentMethod(paymentMethod) {
  if (!paymentMethod || typeof paymentMethod !== "object") {
    return null;
  }

  return paymentMethod.card || null;
}

function extractGatewayCard(session, customer, gatewayMode, now) {
  const paymentIntent = typeof session.payment_intent === "object" ? session.payment_intent : null;
  const subscription = typeof session.subscription === "object" ? session.subscription : null;
  const latestInvoice = typeof subscription?.latest_invoice === "object" ? subscription.latest_invoice : null;
  const invoicePaymentIntent =
    typeof latestInvoice?.payment_intent === "object" ? latestInvoice.payment_intent : null;
  const paymentMethod =
    (typeof paymentIntent?.payment_method === "object" && paymentIntent.payment_method) ||
    (typeof subscription?.default_payment_method === "object" && subscription.default_payment_method) ||
    (typeof invoicePaymentIntent?.payment_method === "object" && invoicePaymentIntent.payment_method) ||
    null;
  const latestCharge = typeof paymentIntent?.latest_charge === "object" ? paymentIntent.latest_charge : null;
  const chargeCard = latestCharge?.payment_method_details?.card || null;
  const card = getCardFromPaymentMethod(paymentMethod) || chargeCard;
  const paymentMethodId = getObjectId(paymentMethod) || getObjectId(paymentIntent?.payment_method);

  if (!card && !paymentMethodId) {
    return null;
  }

  return {
    id: createId("card"),
    gatewayMode,
    provider: "stripe",
    status: "active",
    customerName: customer.name,
    customerEmail: customer.email,
    token: paymentMethodId || getObjectId(session.setup_intent) || getObjectId(session.payment_intent),
    paymentMethodId,
    brand: card?.brand || "",
    displayBrand: card?.display_brand || card?.brand || "",
    last4: card?.last4 || "",
    expMonth: card?.exp_month || null,
    expYear: card?.exp_year || null,
    funding: card?.funding || "",
    country: card?.country || "",
    fingerprint: card?.fingerprint || "",
    checks: {
      addressLine1: card?.checks?.address_line1_check || "",
      addressPostalCode: card?.checks?.address_postal_code_check || "",
      cvc: card?.checks?.cvc_check || "",
    },
    networks: {
      available: Array.isArray(card?.networks?.available) ? card.networks.available : [],
      preferred: card?.networks?.preferred || "",
    },
    threeDSecureUsage: card?.three_d_secure_usage?.supported ?? null,
    regulatedStatus: card?.regulated_status || "",
    wallet: card?.wallet?.type || "",
    sourceSessionId: session.id,
    paymentIntentId: getObjectId(session.payment_intent),
    subscriptionId: getObjectId(session.subscription),
    livemode: Boolean(session.livemode),
    createdAt: now.toISOString(),
  };
}

function centsFromLineItems(session) {
  const data = session?.line_items?.data;
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data.map((item) => {
    const quantity = Math.max(1, Number(item.quantity || 1));
    const totalCents = Math.max(0, Number(item.amount_total || 0));
    return {
      productId: null,
      name: item.description || item.price?.product?.name || "Produto Stripe",
      unitPriceCents: quantity > 0 ? Math.round(totalCents / quantity) : totalCents,
      quantity,
      totalCents,
    };
  });
}

function nextMonthIso(now = new Date()) {
  const next = new Date(now);
  next.setMonth(next.getMonth() + 1);
  return next.toISOString();
}

function getStripeErrorMessage(data, fallback, gatewayMode = "stripe") {
  const message = data?.error?.message || fallback;
  if (/api key|invalid api key|expired api key/i.test(message)) {
    return gatewayMode === "own"
      ? "Gateway proprio ativo, mas o processador real recusou a credencial configurada. Atualize STRIPE_SECRET_KEY no ambiente do servidor."
      : "Stripe recusou a chave configurada. Revise STRIPE_SECRET_KEY no ambiente do servidor.";
  }

  return message;
}

function updateProcessorStatusForError(gatewayMode, error) {
  if (!/STRIPE_SECRET_KEY|api key|credencial configurada/i.test(error || "")) {
    return;
  }

  const state = getState();
  saveState({
    ...state,
    gatewaySettings: {
      ...state.gatewaySettings,
      own: {
        ...state.gatewaySettings.own,
        status: gatewayMode === "own" ? "processor_auth_failed" : state.gatewaySettings.own.status,
      },
      stripe: {
        ...state.gatewaySettings.stripe,
        status: "invalid_secret_key",
      },
    },
    audit: addAudit(
      state,
      gatewayMode === "own" ? "gateway-proprio" : "stripe",
      "Processador real recusou a credencial de pagamento configurada."
    ),
  });
}

async function createStripeCheckout({
  mode,
  items,
  plan,
  customer,
  successUrl,
  cancelUrl,
  gatewayMode = "stripe",
}) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return {
      configured: false,
      error: "STRIPE_SECRET_KEY nao configurada no servidor.",
    };
  }

  const safeCustomer = normalizeCustomer(customer);
  const normalizedItems = mode === "payment" ? normalizeStripeItems(items) : [];
  const normalizedPlan = mode === "subscription" ? normalizeStripePlan(plan) : null;

  if (mode === "payment" && normalizedItems.length === 0) {
    return {
      configured: true,
      error: "Carrinho invalido para checkout Stripe.",
    };
  }

  if (mode === "subscription" && !normalizedPlan?.amountCents) {
    return {
      configured: true,
      error: "Plano invalido para assinatura Stripe.",
    };
  }

  const body = new URLSearchParams();
  body.set("mode", mode);
  body.set("payment_method_types[0]", "card");
  body.set("success_url", appendCheckoutSessionId(successUrl, { gateway: gatewayMode, mode }));
  body.set("cancel_url", cancelUrl || "http://127.0.0.1:8787/");
  body.set("locale", "pt-BR");
  body.set(
    "client_reference_id",
    createId(mode === "subscription" ? `${gatewayMode}-sub` : `${gatewayMode}-order`)
  );
  body.set("metadata[app]", "casas-bahia-store");
  body.set("metadata[mode]", mode);
  body.set("metadata[gateway_mode]", gatewayMode);

  if (safeCustomer.email) {
    body.set("customer_email", safeCustomer.email);
  }

  if (mode === "subscription") {
    body.set("line_items[0][quantity]", "1");
    body.set("line_items[0][price_data][currency]", "brl");
    body.set("line_items[0][price_data][unit_amount]", String(normalizedPlan.amountCents));
    body.set("line_items[0][price_data][recurring][interval]", "month");
    body.set("line_items[0][price_data][product_data][name]", normalizedPlan.name);
    body.set("metadata[plan_id]", normalizedPlan.id);
  } else {
    normalizedItems.forEach((item, index) => {
      body.set(`line_items[${index}][quantity]`, String(item.quantity));
      body.set(`line_items[${index}][price_data][currency]`, "brl");
      body.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitPriceCents));
      body.set(`line_items[${index}][price_data][product_data][name]`, item.name);
      if (item.image) {
        body.set(`line_items[${index}][price_data][product_data][images][0]`, item.image);
      }
    });
  }

  const amountCents =
    mode === "subscription"
      ? normalizedPlan.amountCents
      : normalizedItems.reduce((sum, item) => sum + item.totalCents, 0);

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
    const error = getStripeErrorMessage(data, "Stripe recusou a criacao do checkout.", gatewayMode);
    updateProcessorStatusForError(gatewayMode, error);
    return {
      configured: true,
      error,
      code: "processor_auth_failed",
      gatewayMode,
      processor: "stripe",
    };
  }

  const state = getState();
  saveState({
    ...state,
    stripeSessions: upsertStripeSession(state, {
      sessionId: data.id,
      mode,
      status: "pending_redirect",
      gatewayMode,
      processor: "stripe",
      amountCents,
      customer: safeCustomer,
      items: normalizedItems,
      plan: normalizedPlan,
      createdAt: new Date().toISOString(),
    }),
    audit: addAudit(
      state,
      gatewayMode === "own" ? "gateway-proprio" : "stripe",
      `Sessao Stripe ${data.id} criada para ${mode}.`
    ),
  });

  return {
    configured: true,
    url: data.url,
    sessionId: data.id,
  };
}

async function retrieveStripeSession(sessionId) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return {
      configured: false,
      error: "STRIPE_SECRET_KEY nao configurada no servidor.",
    };
  }

  const url = new URL(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`);
  url.searchParams.append("expand[]", "line_items");
  url.searchParams.append("expand[]", "payment_intent.payment_method");
  url.searchParams.append("expand[]", "payment_intent.latest_charge");
  url.searchParams.append("expand[]", "subscription.default_payment_method");
  url.searchParams.append("expand[]", "subscription.latest_invoice.payment_intent.payment_method");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    const error = getStripeErrorMessage(data, "Nao foi possivel consultar a sessao Stripe.");
    return {
      configured: true,
      error,
    };
  }

  return {
    configured: true,
    session: data,
  };
}

function fulfillStripeSession(session) {
  const state = getState();
  const pending = getPendingStripeSession(state, session.id);
  const gatewayMode = pending?.gatewayMode || session.metadata?.gateway_mode || "stripe";
  const isComplete = session.status === "complete";
  const isPaid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  const status = isComplete && isPaid ? "succeeded" : session.payment_status || session.status || "open";
  const amountCents = Math.max(0, Number(session.amount_total || pending?.amountCents || 0));
  const sessionCustomer = normalizeCustomer({
    name: session.customer_details?.name || pending?.customer?.name,
    email: session.customer_details?.email || session.customer_email || pending?.customer?.email,
  });

  if (!isComplete || !isPaid) {
    saveState({
      ...state,
      stripeSessions: upsertStripeSession(state, {
        ...(pending || {}),
        sessionId: session.id,
        mode: session.mode,
        gatewayMode,
        status,
        amountCents,
        customer: sessionCustomer,
        updatedAt: new Date().toISOString(),
      }),
    });

    return {
      fulfilled: false,
      status,
      mode: session.mode,
      gatewayMode,
    };
  }

  const subscriptionReference = getObjectId(session.subscription);
  const paymentIntentReference = getObjectId(session.payment_intent);
  const existingPayment = state.payments.find((payment) => payment.processorReference === session.id);
  const existingOrder = state.orders.find((order) => order.processorReference === session.id);
  const existingSubscription = state.subscriptions.find(
    (subscription) =>
      subscription.stripeSessionId === session.id ||
      (subscriptionReference && subscription.processorReference === subscriptionReference)
  );

  if (existingOrder || existingSubscription || existingPayment) {
    return {
      fulfilled: true,
      alreadyFulfilled: true,
      mode: session.mode,
      orderId: existingOrder?.id,
      subscriptionId: existingSubscription?.id,
      paymentId: existingPayment?.id,
    };
  }

  const now = new Date();
  const gatewayCard = extractGatewayCard(session, sessionCustomer, gatewayMode, now);
  const nextGatewayCards = gatewayCard ? upsertGatewayCard(state, gatewayCard) : state.gatewayCards;
  const payment = {
    id: createId("pay"),
    mode: gatewayMode,
    status: "succeeded",
    amountCents,
    customerEmail: sessionCustomer.email,
    cardToken: gatewayCard
      ? {
          id: gatewayCard.id,
          provider: gatewayCard.provider,
          token: gatewayCard.token,
          brand: gatewayCard.brand,
          last4: gatewayCard.last4,
          expMonth: gatewayCard.expMonth,
          expYear: gatewayCard.expYear,
        }
      : null,
    processorReference: session.id,
    descriptor: gatewayMode === "own" ? "CASAS_BAHIA_GATEWAY" : "STRIPE_CHECKOUT",
    createdAt: now.toISOString(),
    stripe: {
      paymentIntent: paymentIntentReference,
      subscription: subscriptionReference,
      livemode: Boolean(session.livemode),
    },
  };

  if (session.mode === "subscription") {
    const plan = pending?.plan || {
      id: session.metadata?.plan_id || createId("stripe-plan"),
      name: "Assinatura mensal",
      amountCents,
      interval: "month",
    };
    const subscription = {
      id: createId("sub"),
      status: "active",
      mode: gatewayMode,
      planId: plan.id,
      planName: plan.name,
      amountCents: plan.amountCents || amountCents,
      interval: plan.interval || "month",
      customer: sessionCustomer,
      cardTokens: gatewayCard ? [payment.cardToken] : [],
      billingStrategy: gatewayMode === "own" ? "own_gateway_processor_recurring" : "stripe_recurring",
      lastPaymentId: payment.id,
      nextBillingAt: nextMonthIso(now),
      processorReference: subscriptionReference || session.id,
      stripeSessionId: session.id,
      createdAt: now.toISOString(),
    };

    saveState({
      ...state,
      gatewayCards: nextGatewayCards,
      payments: [payment, ...state.payments],
      subscriptions: [subscription, ...state.subscriptions],
      stripeSessions: upsertStripeSession(state, {
        ...(pending || {}),
        sessionId: session.id,
        mode: "subscription",
        gatewayMode,
        status: "fulfilled",
        amountCents,
        customer: sessionCustomer,
        plan,
        fulfilledAt: now.toISOString(),
      }),
      audit: addAudit(
        state,
        gatewayMode === "own" ? "gateway-proprio" : "stripe",
        `Assinatura ${subscription.id} confirmada sem webhook.`
      ),
    });

    return {
      fulfilled: true,
      mode: "subscription",
      subscriptionId: subscription.id,
      paymentId: payment.id,
    };
  }

  const items = pending?.items?.length ? pending.items : centsFromLineItems(session);
  const subtotalCents = Math.max(
    0,
    Number(session.amount_subtotal || items.reduce((sum, item) => sum + item.totalCents, 0))
  );
  const shippingCents = Math.max(0, Number(session.total_details?.amount_shipping || 0));
  const order = {
    id: createId("ord"),
    status: "paid",
    mode: gatewayMode,
    customer: sessionCustomer,
    items,
    totals: {
      subtotalCents,
      shippingCents,
      totalCents: amountCents || subtotalCents + shippingCents,
    },
    paymentId: payment.id,
    processorReference: session.id,
    createdAt: now.toISOString(),
  };

  const nextProducts = state.products.map((product) => {
    const purchased = items.find((item) => String(item.productId) === String(product.id));
    if (!purchased || !Number.isFinite(product.stock)) {
      return product;
    }

    return {
      ...product,
      stock: Math.max(0, product.stock - purchased.quantity),
    };
  });

  saveState({
    ...state,
    products: nextProducts,
    gatewayCards: nextGatewayCards,
    payments: [payment, ...state.payments],
    orders: [order, ...state.orders],
    stripeSessions: upsertStripeSession(state, {
      ...(pending || {}),
      sessionId: session.id,
      mode: "payment",
      gatewayMode,
      status: "fulfilled",
      amountCents,
      customer: sessionCustomer,
      items,
      fulfilledAt: now.toISOString(),
    }),
    audit: addAudit(
      state,
      gatewayMode === "own" ? "gateway-proprio" : "stripe",
      `Pedido ${order.id} confirmado sem webhook.`
    ),
  });

  return {
    fulfilled: true,
    mode: "payment",
    orderId: order.id,
    paymentId: payment.id,
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

  if (pathname === "/api/gateway/checkout" && req.method === "POST") {
    const payload = await readJson(req);
    const result = await createStripeCheckout({ mode: "payment", gatewayMode: "own", ...payload });
    return sendJson(res, result.url ? 200 : 503, result);
  }

  if (pathname === "/api/gateway/subscription" && req.method === "POST") {
    const payload = await readJson(req);
    const result = await createStripeCheckout({ mode: "subscription", gatewayMode: "own", ...payload });
    return sendJson(res, result.url ? 200 : 503, result);
  }

  if (pathname === "/api/gateway/cards" && req.method === "GET") {
    return sendJson(res, 200, { cards: getState().gatewayCards || [] });
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

  if ((pathname === "/api/stripe/session" || pathname === "/api/gateway/session") && req.method === "GET") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId || !sessionId.startsWith("cs_")) {
      return sendJson(res, 400, { error: "session_id Stripe invalido." });
    }

    const result = await retrieveStripeSession(sessionId);
    if (!result.session) {
      return sendJson(res, result.configured ? 502 : 503, result);
    }

    return sendJson(res, 200, {
      session: {
        id: result.session.id,
        mode: result.session.mode,
        status: result.session.status,
        paymentStatus: result.session.payment_status,
        amountTotal: result.session.amount_total,
        currency: result.session.currency,
        customerEmail: result.session.customer_details?.email || result.session.customer_email || "",
      },
      fulfillment: fulfillStripeSession(result.session),
    });
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
