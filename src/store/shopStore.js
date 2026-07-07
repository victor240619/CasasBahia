import { useEffect, useState } from "react";
import { products } from "../data/products.js";

export const STORAGE_KEY = "casas-bahia-store:v1";

function normalizeProducts(items) {
  return items.map((product) => ({
    ...product,
    stock: Number.isFinite(product.stock) ? product.stock : 999,
    active: product.active ?? true,
  }));
}

export function createDefaultShopState() {
  return {
    version: 1,
    products: normalizeProducts(products),
    orders: [],
    payments: [],
    subscriptions: [],
    gatewaySettings: {
      mode: "own",
      own: {
        status: "sandbox",
        statementDescriptor: "CASAS BAHIA",
        vaultPolicy: "tokenize_only",
        captureMode: "automatic",
      },
      stripe: {
        status: "base44_function",
        publishableKey: "",
        webhookConfigured: false,
      },
    },
    audit: [
      {
        id: "audit-initial",
        at: new Date().toISOString(),
        actor: "system",
        action: "Loja inicializada em modo sandbox seguro.",
      },
    ],
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function loadShopState() {
  if (typeof window === "undefined") {
    return createDefaultShopState();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createDefaultShopState();
    }

    const parsed = JSON.parse(stored);
    if (parsed?.version !== 1) {
      return createDefaultShopState();
    }

    return {
      ...parsed,
      products: normalizeProducts(parsed.products || products),
    };
  } catch {
    return createDefaultShopState();
  }
}

export function saveShopState(state) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetShopState() {
  const state = createDefaultShopState();
  saveShopState(state);
  return state;
}

export function useShopState() {
  const [shopState, setShopState] = useState(() => loadShopState());

  useEffect(() => {
    saveShopState(shopState);
  }, [shopState]);

  function updateShopState(updater) {
    setShopState((current) => {
      const draft = clone(current);
      const next = typeof updater === "function" ? updater(draft) : updater;

      return {
        ...next,
        updatedAt: new Date().toISOString(),
      };
    });
  }

  return [shopState, updateShopState];
}
