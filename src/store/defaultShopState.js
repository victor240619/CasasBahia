import { products } from "../data/products.js";

function normalizeProducts(items) {
  return items.map((product) => ({
    ...product,
    stock: Number.isFinite(product.stock) ? product.stock : 999,
    active: product.active ?? true,
  }));
}

export function createDefaultShopState() {
  return {
    version: 2,
    products: normalizeProducts(products),
    orders: [],
    payments: [],
    subscriptions: [],
    stripeSessions: [],
    gatewayCards: [],
    gatewaySettings: {
      mode: "own",
      own: {
        status: "production",
        processor: "stripe",
        statementDescriptor: "CASAS BAHIA",
        vaultPolicy: "processor_token_only",
        captureMode: "automatic",
      },
      stripe: {
        status: "needs_secret_key",
        publishableKey: "",
        webhookConfigured: false,
      },
    },
    audit: [
      {
        id: "audit-initial",
        at: new Date().toISOString(),
        actor: "system",
        action: "Loja inicializada com SQLite local.",
      },
    ],
  };
}

export function normalizeShopState(state) {
  const fallback = createDefaultShopState();

  return {
    ...fallback,
    ...state,
    version: 2,
    products: normalizeProducts(state?.products?.length ? state.products : fallback.products),
    orders: Array.isArray(state?.orders) ? state.orders : [],
    payments: Array.isArray(state?.payments) ? state.payments : [],
    subscriptions: Array.isArray(state?.subscriptions) ? state.subscriptions : [],
    stripeSessions: Array.isArray(state?.stripeSessions) ? state.stripeSessions : [],
    gatewayCards: Array.isArray(state?.gatewayCards) ? state.gatewayCards : [],
    audit: Array.isArray(state?.audit) ? state.audit : fallback.audit,
    gatewaySettings: {
      ...fallback.gatewaySettings,
      ...(state?.gatewaySettings || {}),
      own: {
        ...fallback.gatewaySettings.own,
        ...(state?.gatewaySettings?.own || {}),
      },
      stripe: {
        ...fallback.gatewaySettings.stripe,
        ...(state?.gatewaySettings?.stripe || {}),
      },
    },
  };
}
