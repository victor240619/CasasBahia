import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { products } from "../src/data/products.js"
import { validateLuhn, tokenizeCard } from "../src/payments/card.js"
import {
  createRetailOrder,
  createSubscription,
  MAX_SUBSCRIPTION_CARDS,
  simulateSubscriptionCycle,
} from "../src/payments/gateway.js"

const now = new Date("2026-07-07T12:00:00.000Z")
const gatewaySettings = {
  mode: "own",
  own: {
    status: "sandbox",
    statementDescriptor: "SPEED DEALS",
    vaultPolicy: "tokenize_only",
    captureMode: "automatic",
  },
  stripe: {
    status: "not_connected",
    publishableKey: "",
    webhookConfigured: false,
  },
}

function validCard() {
  return {
    holderName: "Cliente Teste",
    number: "4242424242424242",
    expMonth: "12",
    expYear: "2030",
    cvc: "123",
  }
}

describe("cartao", () => {
  it("valida Luhn e tokeniza sem retornar PAN nem CVV", () => {
    assert.equal(validateLuhn("4242424242424242"), true)

    const token = tokenizeCard(validCard(), now)

    assert.equal(token.brand, "Visa")
    assert.equal(token.last4, "4242")
    assert.equal(token.storage, "token_only")
    assert.equal("number" in token, false)
    assert.equal("cvc" in token, false)
  })

  it("rejeita numero invalido", () => {
    assert.throws(
      () => tokenizeCard({ ...validCard(), number: "4242424242424241" }, now),
      /Numero do cartao invalido/
    )
  })
})

describe("checkout", () => {
  it("cria pedido aprovado no gateway proprio", () => {
    const { order, payment } = createRetailOrder({
      mode: "own",
      cart: [{ ...products[0], qty: 1 }],
      products,
      customer: { name: "Cliente Teste", email: "cliente@example.com" },
      card: validCard(),
      gatewaySettings,
      now,
    })

    assert.equal(order.status, "paid")
    assert.equal(payment.status, "succeeded")
    assert.equal(order.totals.totalCents > 0, true)
    assert.equal(payment.cardToken.last4, "4242")
  })

  it("mantem Stripe em pending_provider sem coletar cartao local", () => {
    const { order, payment } = createRetailOrder({
      mode: "stripe",
      cart: [{ ...products[0], qty: 1 }],
      products,
      customer: { name: "Cliente Teste", email: "cliente@example.com" },
      card: {},
      gatewaySettings,
      now,
    })

    assert.equal(order.status, "pending_payment")
    assert.equal(payment.status, "pending_provider")
    assert.equal(payment.cardToken, null)
  })
})

describe("assinaturas", () => {
  it("aceita ate 20 cartoes tokenizados com fallback", () => {
    const cards = Array.from({ length: MAX_SUBSCRIPTION_CARDS }, (_, index) => ({
      ...validCard(),
      holderName: `Cliente ${index + 1}`,
    }))

    const { subscription, payment } = createSubscription({
      mode: "own",
      planId: "sub-25",
      customer: { name: "Cliente Teste", email: "cliente@example.com" },
      cards,
      gatewaySettings,
      now,
    })

    assert.equal(payment.status, "succeeded")
    assert.equal(subscription.status, "active")
    assert.equal(subscription.amountCents, 2500)
    assert.equal(subscription.cardTokens.length, 20)
    assert.equal(subscription.cardTokens.every((token) => !("cvc" in token)), true)
  })

  it("bloqueia mais de 20 cartoes", () => {
    const cards = Array.from({ length: MAX_SUBSCRIPTION_CARDS + 1 }, () => validCard())

    assert.throws(
      () =>
        createSubscription({
          mode: "own",
          planId: "sub-10",
          customer: { name: "Cliente Teste", email: "cliente@example.com" },
          cards,
          gatewaySettings,
          now,
        }),
      /maximo 20 cartoes/
    )
  })

  it("cobra no maximo um token por ciclo", () => {
    const { subscription } = createSubscription({
      mode: "own",
      planId: "sub-40",
      customer: { name: "Cliente Teste", email: "cliente@example.com" },
      cards: [validCard(), validCard(), validCard()],
      gatewaySettings,
      now,
    })

    const invoice = simulateSubscriptionCycle(subscription, now)

    assert.equal(invoice.status, "succeeded")
    assert.equal(invoice.amountCents, 4000)
    assert.equal(invoice.attemptedTokens.length, 1)
  })
})
