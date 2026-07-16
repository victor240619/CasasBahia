const DEFAULT_STATE = __DEFAULT_STATE_JSON__;
let runtimeState;

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId(prefix) {
  const random = crypto.randomUUID().replaceAll("-", "").slice(0, 18);
  return `${prefix}-${Date.now()}-${random}`;
}

function sendJson(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: jsonHeaders });
}

async function readJson(request) {
  const text = await request.text();
  return text ? JSON.parse(text) : {};
}

function getObjectId(value) {
  return typeof value === "string" ? value : value?.id || null;
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

function getState(env = {}) {
  if (!runtimeState) {
    runtimeState = clone(DEFAULT_STATE);
  }

  const hasStripeSecret = Boolean(env.STRIPE_SECRET_KEY);
  runtimeState.gatewaySettings = {
    ...runtimeState.gatewaySettings,
    own: {
      ...runtimeState.gatewaySettings.own,
      status: hasStripeSecret ? runtimeState.gatewaySettings.own.status : "needs_secret_key",
    },
    stripe: {
      ...runtimeState.gatewaySettings.stripe,
      status: hasStripeSecret ? runtimeState.gatewaySettings.stripe.status : "needs_secret_key",
      publishableKey: env.STRIPE_PUBLISHABLE_KEY ? "configured" : "",
    },
  };

  return runtimeState;
}

function saveState(state) {
  runtimeState = {
    ...clone(DEFAULT_STATE),
    ...clone(state),
    version: 2,
    orders: Array.isArray(state.orders) ? state.orders : [],
    payments: Array.isArray(state.payments) ? state.payments : [],
    subscriptions: Array.isArray(state.subscriptions) ? state.subscriptions : [],
    stripeSessions: Array.isArray(state.stripeSessions) ? state.stripeSessions : [],
    gatewayCards: Array.isArray(state.gatewayCards) ? state.gatewayCards : [],
    audit: Array.isArray(state.audit) ? state.audit : [],
  };
  return runtimeState;
}

function normalizeCustomer(customer = {}) {
  return {
    name: String(customer.name || "Cliente").trim() || "Cliente",
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

function appendCheckoutSessionId(rawUrl, extraParams = {}) {
  const url = new URL(rawUrl || "/sucesso", "https://casasbahia-store.chatgpt.site");

  for (const [key, value] of Object.entries(extraParams)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  url.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
  return url.toString().replace("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}");
}

function stripeErrorMessage(data, fallback, gatewayMode) {
  const message = data?.error?.message || fallback;
  if (/api key|invalid api key|expired api key/i.test(message)) {
    return gatewayMode === "own"
      ? "Gateway proprio ativo, mas o processador real recusou a credencial configurada. Atualize STRIPE_SECRET_KEY no ambiente do servidor."
      : "Stripe recusou a chave configurada. Revise STRIPE_SECRET_KEY no ambiente do servidor.";
  }
  return message;
}

function markProcessorFailure(env, gatewayMode, error) {
  if (!/STRIPE_SECRET_KEY|api key|credencial configurada/i.test(error || "")) {
    return;
  }

  const state = getState(env);
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
    audit: addAudit(state, gatewayMode === "own" ? "gateway-proprio" : "stripe", "Processador real recusou a credencial de pagamento configurada."),
  });
}

async function parseStripeResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

async function createStripeCheckout(env, payload, mode, gatewayMode) {
  const secretKey = env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return {
      configured: false,
      code: "processor_missing_secret",
      gatewayMode,
      processor: "stripe",
      error: "Gateway proprio ativo, mas STRIPE_SECRET_KEY nao esta configurada no ambiente do Sites.",
    };
  }

  const safeCustomer = normalizeCustomer(payload.customer);
  const normalizedItems = mode === "payment" ? normalizeStripeItems(payload.items) : [];
  const normalizedPlan = mode === "subscription" ? normalizeStripePlan(payload.plan) : null;

  if (mode === "payment" && normalizedItems.length === 0) {
    return { configured: true, error: "Carrinho invalido para checkout.", gatewayMode, processor: "stripe" };
  }

  if (mode === "subscription" && !normalizedPlan?.amountCents) {
    return { configured: true, error: "Plano invalido para assinatura.", gatewayMode, processor: "stripe" };
  }

  const body = new URLSearchParams();
  body.set("mode", mode);
  body.set("payment_method_types[0]", "card");
  body.set("success_url", appendCheckoutSessionId(payload.successUrl, { gateway: gatewayMode, mode }));
  body.set("cancel_url", payload.cancelUrl || "/");
  body.set("locale", "pt-BR");
  body.set("client_reference_id", createId(mode === "subscription" ? `${gatewayMode}-sub` : `${gatewayMode}-order`));
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

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await parseStripeResponse(response);

  if (!response.ok) {
    const error = stripeErrorMessage(data, "Processador recusou a criacao do checkout.", gatewayMode);
    markProcessorFailure(env, gatewayMode, error);
    return {
      configured: true,
      code: "processor_auth_failed",
      gatewayMode,
      processor: "stripe",
      error,
    };
  }

  const state = getState(env);
  const amountCents =
    mode === "subscription"
      ? normalizedPlan.amountCents
      : normalizedItems.reduce((sum, item) => sum + item.totalCents, 0);
  saveState({
    ...state,
    stripeSessions: [
      {
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
      },
      ...(state.stripeSessions || []).filter((item) => item.sessionId !== data.id),
    ].slice(0, 250),
    audit: addAudit(state, gatewayMode === "own" ? "gateway-proprio" : "stripe", `Sessao Stripe ${data.id} criada para ${mode}.`),
  });

  return { configured: true, url: data.url, sessionId: data.id, gatewayMode, processor: "stripe" };
}

async function retrieveStripeSession(env, sessionId) {
  const secretKey = env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return { configured: false, error: "STRIPE_SECRET_KEY nao configurada no ambiente do Sites." };
  }

  const url = new URL(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`);
  url.searchParams.append("expand[]", "line_items");
  url.searchParams.append("expand[]", "payment_intent.payment_method");
  url.searchParams.append("expand[]", "payment_intent.latest_charge");
  url.searchParams.append("expand[]", "subscription.default_payment_method");
  url.searchParams.append("expand[]", "subscription.latest_invoice.payment_intent.payment_method");

  const response = await fetch(url, { headers: { Authorization: `Bearer ${secretKey}` } });
  const data = await parseStripeResponse(response);

  if (!response.ok) {
    return { configured: true, error: stripeErrorMessage(data, "Nao foi possivel consultar a sessao Stripe.", "stripe") };
  }

  return { configured: true, session: data };
}

function extractGatewayCard(session, customer, gatewayMode) {
  const paymentIntent = typeof session.payment_intent === "object" ? session.payment_intent : null;
  const subscription = typeof session.subscription === "object" ? session.subscription : null;
  const latestInvoice = typeof subscription?.latest_invoice === "object" ? subscription.latest_invoice : null;
  const invoicePaymentIntent = typeof latestInvoice?.payment_intent === "object" ? latestInvoice.payment_intent : null;
  const paymentMethod =
    (typeof paymentIntent?.payment_method === "object" && paymentIntent.payment_method) ||
    (typeof subscription?.default_payment_method === "object" && subscription.default_payment_method) ||
    (typeof invoicePaymentIntent?.payment_method === "object" && invoicePaymentIntent.payment_method) ||
    null;
  const latestCharge = typeof paymentIntent?.latest_charge === "object" ? paymentIntent.latest_charge : null;
  const card = paymentMethod?.card || latestCharge?.payment_method_details?.card || null;
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
    wallet: card?.wallet?.type || "",
    sourceSessionId: session.id,
    paymentIntentId: getObjectId(session.payment_intent),
    subscriptionId: getObjectId(session.subscription),
    livemode: Boolean(session.livemode),
    createdAt: new Date().toISOString(),
  };
}

function fulfillStripeSession(env, session) {
  const state = getState(env);
  const gatewayMode = session.metadata?.gateway_mode || "stripe";
  const isComplete = session.status === "complete";
  const isPaid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  const status = isComplete && isPaid ? "succeeded" : session.payment_status || session.status || "open";
  const customer = normalizeCustomer({
    name: session.customer_details?.name,
    email: session.customer_details?.email || session.customer_email,
  });

  if (!isComplete || !isPaid) {
    return { fulfilled: false, status, mode: session.mode, gatewayMode };
  }

  const existingPayment = state.payments.find((payment) => payment.processorReference === session.id);
  if (existingPayment) {
    return { fulfilled: true, alreadyFulfilled: true, mode: session.mode, paymentId: existingPayment.id };
  }

  const amountCents = Math.max(0, Number(session.amount_total || 0));
  const gatewayCard = extractGatewayCard(session, customer, gatewayMode);
  const payment = {
    id: createId("pay"),
    mode: gatewayMode,
    status: "succeeded",
    amountCents,
    customerEmail: customer.email,
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
    createdAt: new Date().toISOString(),
  };

  const nextState = {
    ...state,
    gatewayCards: gatewayCard ? [gatewayCard, ...state.gatewayCards].slice(0, 500) : state.gatewayCards,
    payments: [payment, ...state.payments],
  };

  if (session.mode === "subscription") {
    const subscription = {
      id: createId("sub"),
      status: "active",
      mode: gatewayMode,
      planId: session.metadata?.plan_id || "stripe-plan",
      planName: "Assinatura mensal",
      amountCents,
      interval: "month",
      customer,
      cardTokens: gatewayCard ? [payment.cardToken] : [],
      billingStrategy: gatewayMode === "own" ? "own_gateway_processor_recurring" : "stripe_recurring",
      lastPaymentId: payment.id,
      processorReference: getObjectId(session.subscription) || session.id,
      stripeSessionId: session.id,
      createdAt: new Date().toISOString(),
    };
    saveState({ ...nextState, subscriptions: [subscription, ...state.subscriptions] });
    return { fulfilled: true, mode: "subscription", subscriptionId: subscription.id, paymentId: payment.id };
  }

  saveState(nextState);
  return { fulfilled: true, mode: "payment", paymentId: payment.id };
}

async function handleApi(request, env, pathname) {
  if (pathname === "/api/health") {
    return sendJson(200, { ok: true, runtime: "sites-worker", payments: Boolean(env.STRIPE_SECRET_KEY) });
  }

  if (pathname === "/api/state" && request.method === "GET") {
    return sendJson(200, getState(env));
  }

  if (pathname === "/api/state" && (request.method === "PUT" || request.method === "POST")) {
    return sendJson(200, saveState(await readJson(request)));
  }

  if (pathname === "/api/gateway/cards" && request.method === "GET") {
    return sendJson(200, { cards: getState(env).gatewayCards || [] });
  }

  if (pathname === "/api/gateway/checkout" && request.method === "POST") {
    const result = await createStripeCheckout(env, await readJson(request), "payment", "own");
    return sendJson(200, result);
  }

  if (pathname === "/api/gateway/subscription" && request.method === "POST") {
    const result = await createStripeCheckout(env, await readJson(request), "subscription", "own");
    return sendJson(200, result);
  }

  if (pathname === "/api/stripe/checkout" && request.method === "POST") {
    const result = await createStripeCheckout(env, await readJson(request), "payment", "stripe");
    return sendJson(200, result);
  }

  if (pathname === "/api/stripe/subscription" && request.method === "POST") {
    const result = await createStripeCheckout(env, await readJson(request), "subscription", "stripe");
    return sendJson(200, result);
  }

  if ((pathname === "/api/stripe/session" || pathname === "/api/gateway/session") && request.method === "GET") {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId || !sessionId.startsWith("cs_")) {
      return sendJson(400, { error: "session_id Stripe invalido." });
    }

    const result = await retrieveStripeSession(env, sessionId);
    if (!result.session) {
      return sendJson(result.configured ? 502 : 503, result);
    }

    return sendJson(200, {
      session: {
        id: result.session.id,
        mode: result.session.mode,
        status: result.session.status,
        paymentStatus: result.session.payment_status,
        amountTotal: result.session.amount_total,
        currency: result.session.currency,
        customerEmail: result.session.customer_details?.email || result.session.customer_email || "",
      },
      fulfillment: fulfillStripeSession(env, result.session),
    });
  }

  return sendJson(404, { error: "API nao encontrada." });
}

async function serveAsset(request, env) {
  if (!env.ASSETS?.fetch) {
    return new Response("Assets binding unavailable.", { status: 500 });
  }

  const url = new URL(request.url);
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404 || /\.[a-z0-9]+$/i.test(url.pathname)) {
    return response;
  }

  return env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/api/")) {
        return await handleApi(request, env, url.pathname);
      }
      return await serveAsset(request, env);
    } catch (error) {
      return sendJson(500, { error: error.message || "Erro interno." });
    }
  },
};
