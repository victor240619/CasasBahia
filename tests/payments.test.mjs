import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createDefaultShopState } from "../src/store/defaultShopState.js";
import { PAYMENT_MODES, subscriptionPlans } from "../src/payments/gateway.js";

describe("pagamentos de producao", () => {
  it("mantem a vitrine publica em Stripe por padrao", () => {
    const state = createDefaultShopState();

    assert.equal(state.gatewaySettings.mode, PAYMENT_MODES.STRIPE);
    assert.equal(state.gatewaySettings.own.status, "disabled_production");
  });

  it("oferece apenas os planos recorrentes reais enviados para Stripe Checkout", () => {
    assert.deepEqual(
      subscriptionPlans.map((plan) => ({
        id: plan.id,
        amountCents: plan.amountCents,
        interval: plan.interval,
      })),
      [
        { id: "sub-10", amountCents: 1000, interval: "month" },
        { id: "sub-25", amountCents: 2500, interval: "month" },
        { id: "sub-40", amountCents: 4000, interval: "month" },
      ]
    );
  });

  it("exporta somente configuracao Stripe usada pela vitrine", async () => {
    const payments = await import("../src/payments/gateway.js");

    assert.deepEqual(Object.keys(payments).sort(), ["PAYMENT_MODES", "subscriptionPlans"]);
  });
});
