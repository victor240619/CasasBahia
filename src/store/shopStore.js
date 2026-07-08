import { useEffect, useState } from "react";
import { createDefaultShopState, normalizeShopState } from "./defaultShopState.js";

export const STORAGE_KEY = "casas-bahia-store:v1";

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
    if (!parsed?.version) {
      return createDefaultShopState();
    }

    return normalizeShopState(parsed);
  } catch {
    return createDefaultShopState();
  }
}

export async function fetchShopState() {
  const response = await fetch("/api/state");
  if (!response.ok) {
    throw new Error("Nao foi possivel carregar o banco SQL.");
  }
  return normalizeShopState(await response.json());
}

export function saveShopState(state) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeShopState(state);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

  fetch("/api/state", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalized),
  }).catch(() => {
    // Static preview fallback keeps the storefront usable without the API.
  });
}

export function resetShopState() {
  const state = createDefaultShopState();
  saveShopState(state);
  return state;
}

export function useShopState() {
  const [shopState, setShopState] = useState(() => loadShopState());

  useEffect(() => {
    let cancelled = false;

    fetchShopState()
      .then((state) => {
        if (!cancelled) {
          setShopState(state);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true;
    };
  }, []);

  function updateShopState(updater) {
    setShopState((current) => {
      const draft = clone(current);
      const next = typeof updater === "function" ? updater(draft) : updater;

      const nextState = {
        ...next,
        updatedAt: new Date().toISOString(),
      };

      saveShopState(nextState);
      return nextState;
    });
  }

  return [shopState, updateShopState];
}
