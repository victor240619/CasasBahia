import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createDefaultShopState } from "../src/store/defaultShopState.js";
import { PAYMENT_MODES, subscriptionPlans } from "../src/payments/gateway.js";

describe("pagamentos de producao", () => {
  it("mantem a vitrine publica no gateway proprio de producao por padrao", () => {
    const state = createDefaultShopState();

    assert.equal(state.gatewaySettings.mode, PAYMENT_MODES.OWN);
    assert.equal(state.gatewaySettings.own.status, "production");
    assert.equal(state.gatewaySettings.own.processor, "stripe");
    assert.deepEqual(state.gatewayCards, []);
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

  it("exporta somente configuracao de gateway usada pela vitrine", async () => {
    const payments = await import("../src/payments/gateway.js");

    assert.deepEqual(Object.keys(payments).sort(), ["PAYMENT_MODES", "subscriptionPlans"]);
    assert.deepEqual(payments.PAYMENT_MODES, { OWN: "own", STRIPE: "stripe" });
  });
});
