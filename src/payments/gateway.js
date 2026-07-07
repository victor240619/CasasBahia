import { getDiscountedPrice } from "../data/products.js";
import { createId, tokenizeCard } from "./card.js";

export const PAYMENT_MODES = {
  OWN: "own",
  STRIPE: "stripe",
};

export const MAX_SUBSCRIPTION_CARDS = 20;
export const SHIPPING_CENTS = 0;

export const subscriptionPlans = [
  {
    id: "sub-10",
    name: "Plano Essencial",
    amountCents: 1000,
    interval: "month",
  },
  {
    id: "sub-25",
    name: "Plano Plus",
    amountCents: 2500,
    interval: "month",
  },
  {
    id: "sub-40",
    name: "Plano Premium",
    amountCents: 4000,
    interval: "month",
  },
];

export function productPriceCents(product) {
  if (Number.isFinite(product?.priceCents)) {
    return Math.max(0, Math.round(product.priceCents));
  }

  return Math.max(0, Math.round(getDiscountedPrice(product) * 100));
}

export function getCartItems(cart, products) {
  if (Array.isArray(cart)) {
    return cart
      .map((item) => {
        const product = products.find((candidate) => String(candidate.id) === String(item.id)) || item;
        const quantity = Math.max(1, Number(item.qty || item.quantity || 1));
        const unitPriceCents = productPriceCents(product);

        return {
          productId: product.id,
          name: product.name,
          unitPriceCents,
          quantity,
          totalCents: unitPriceCents * quantity,
        };
      })
      .filter((item) => item.productId && item.totalCents > 0);
  }

  return Object.entries(cart || {})
    .map(([productId, quantity]) => {
      const product = products.find((item) => String(item.id) === String(productId));
      if (!product || quantity <= 0) {
        return null;
      }

      const unitPriceCents = productPriceCents(product);
      return {
        productId,
        name: product.name,
        unitPriceCents,
        quantity,
        totalCents: unitPriceCents * quantity,
      };
    })
    .filter(Boolean);
}

export function getCartTotals(cartItems) {
  const subtotalCents = cartItems.reduce((total, item) => total + item.totalCents, 0);

  return {
    subtotalCents,
    shippingCents: SHIPPING_CENTS,
    totalCents: subtotalCents + SHIPPING_CENTS,
  };
}

function validateCustomer(customer) {
  const name = String(customer.name || "").trim();
  const email = String(customer.email || "").trim().toLowerCase();

  if (name.length < 3) {
    throw new Error("Informe o nome do cliente.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Informe um email valido.");
  }

  return { name, email };
}

function createPaymentForMode({ mode, amountCents, customer, card, gatewaySettings, now }) {
  if (mode === PAYMENT_MODES.OWN) {
    const token = tokenizeCard(card, now);

    return {
      payment: {
        id: createId("pay"),
        mode,
        status: "succeeded",
        amountCents,
        customerEmail: customer.email,
        cardToken: token,
        processorReference: createId("ownauth"),
        descriptor: gatewaySettings.own.statementDescriptor,
        createdAt: now.toISOString(),
      },
      cardToken: token,
    };
  }

  if (mode === PAYMENT_MODES.STRIPE) {
    return {
      payment: {
        id: createId("pay"),
        mode,
        status: "pending_provider",
        amountCents,
        customerEmail: customer.email,
        cardToken: null,
        processorReference: null,
        descriptor: "STRIPE_CHECKOUT",
        createdAt: now.toISOString(),
      },
      cardToken: null,
    };
  }

  throw new Error("Modo de pagamento invalido.");
}

export function createRetailOrder({
  mode,
  cart,
  products,
  customer,
  card,
  gatewaySettings,
  now = new Date(),
}) {
  const safeCustomer = validateCustomer(customer);
  const items = getCartItems(cart, products);

  if (items.length === 0) {
    throw new Error("Adicione pelo menos um produto ao carrinho.");
  }

  for (const item of items) {
    const product = products.find((candidate) => String(candidate.id) === String(item.productId));
    const stock = Number.isFinite(product?.stock) ? product.stock : 999;
    const active = product?.active ?? true;
    if (!product || !active || stock < item.quantity) {
      throw new Error(`Estoque indisponivel para ${item.name}.`);
    }
  }

  const totals = getCartTotals(items);
  const { payment } = createPaymentForMode({
    mode,
    amountCents: totals.totalCents,
    customer: safeCustomer,
    card,
    gatewaySettings,
    now,
  });

  return {
    order: {
      id: createId("ord"),
      status: payment.status === "succeeded" ? "paid" : "pending_payment",
      mode,
      customer: safeCustomer,
      items,
      totals,
      paymentId: payment.id,
      createdAt: now.toISOString(),
    },
    payment,
  };
}

function getNextBillingDate(now) {
  const next = new Date(now);
  next.setMonth(next.getMonth() + 1);
  return next.toISOString();
}

export function createSubscription({
  mode,
  planId,
  customer,
  cards,
  gatewaySettings,
  now = new Date(),
}) {
  const safeCustomer = validateCustomer(customer);
  const plan = subscriptionPlans.find((item) => item.id === planId);

  if (!plan) {
    throw new Error("Plano de assinatura invalido.");
  }

  if (!Array.isArray(cards) || cards.length < 1) {
    throw new Error("Informe pelo menos um cartao.");
  }

  if (cards.length > MAX_SUBSCRIPTION_CARDS) {
    throw new Error(`A assinatura aceita no maximo ${MAX_SUBSCRIPTION_CARDS} cartoes.`);
  }

  const cardTokens = mode === PAYMENT_MODES.OWN ? cards.map((card) => tokenizeCard(card, now)) : [];
  const { payment } = createPaymentForMode({
    mode,
    amountCents: plan.amountCents,
    customer: safeCustomer,
    card: mode === PAYMENT_MODES.OWN ? cards[0] : {},
    gatewaySettings,
    now,
  });

  return {
    subscription: {
      id: createId("sub"),
      status: payment.status === "succeeded" ? "active" : "pending_provider",
      mode,
      planId: plan.id,
      planName: plan.name,
      amountCents: plan.amountCents,
      interval: plan.interval,
      customer: safeCustomer,
      cardTokens,
      billingStrategy: "primary_then_fallback",
      lastPaymentId: payment.id,
      nextBillingAt: getNextBillingDate(now),
      createdAt: now.toISOString(),
    },
    payment,
  };
}

export function simulateSubscriptionCycle(subscription, now = new Date()) {
  if (!subscription?.cardTokens?.length) {
    return {
      status: "failed",
      reason: "no_payment_method",
      chargedTokenId: null,
      attemptedTokens: [],
      billedAt: now.toISOString(),
    };
  }

  const attemptedTokens = [];
  const approvedToken = subscription.cardTokens.find((token) => {
    attemptedTokens.push(token.id);
    return token.last4 !== "0000";
  });

  return {
    status: approvedToken ? "succeeded" : "failed",
    reason: approvedToken ? null : "all_cards_declined",
    chargedTokenId: approvedToken?.id || null,
    attemptedTokens,
    amountCents: approvedToken ? subscription.amountCents : 0,
    billedAt: now.toISOString(),
  };
}
