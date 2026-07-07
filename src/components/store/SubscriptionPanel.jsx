import React, { useState } from "react";
import { CreditCard, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";
import { formatBRL, formatDate } from "@/lib/money";
import { createSubscription, subscriptionPlans } from "@/payments/gateway";
import { useShopState } from "@/store/shopStore";

function emptyCard(holderName = "") {
  return {
    holderName,
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  };
}

export default function SubscriptionPanel() {
  const [shop, setShop] = useShopState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    planId: "sub-10",
    name: "",
    email: "",
    cards: [emptyCard()],
  });

  const selectedPlan = subscriptionPlans.find((plan) => plan.id === form.planId);
  const isOwnGateway = shop.gatewaySettings.mode === "own";

  const updateCard = (index, field, value) => {
    setForm((current) => ({
      ...current,
      cards: current.cards.map((card, cardIndex) =>
        cardIndex === index ? { ...card, [field]: value } : card
      ),
    }));
  };

  const addCard = () => {
    setForm((current) => {
      if (current.cards.length >= 20) {
        return current;
      }
      return {
        ...current,
        cards: [...current.cards, emptyCard(current.name)],
      };
    });
  };

  const removeCard = (index) => {
    setForm((current) => ({
      ...current,
      cards: current.cards.filter((_, cardIndex) => cardIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (isOwnGateway) {
        const { subscription, payment } = createSubscription({
          mode: "own",
          planId: form.planId,
          customer: { name: form.name, email: form.email },
          cards: form.cards,
          gatewaySettings: shop.gatewaySettings,
        });

        setShop((draft) => ({
          ...draft,
          subscriptions: [subscription, ...draft.subscriptions],
          payments: [payment, ...draft.payments],
          audit: [
            {
              id: `audit-${Date.now()}`,
              at: new Date().toISOString(),
              actor: "subscriptions",
              action: `Assinatura ${subscription.id} criada no gateway proprio.`,
            },
            ...draft.audit,
          ],
        }));

        setForm({ planId: "sub-10", name: "", email: "", cards: [emptyCard()] });
        toast({
          title: "Assinatura ativa",
          description: `Proxima cobranca em ${formatDate(subscription.nextBillingAt)}.`,
        });
        return;
      }

      const response = await base44.functions.invoke("createSubscriptionCheckout", {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amountCents: selectedPlan.amountCents,
        customer: { name: form.name, email: form.email },
        successUrl: `${window.location.origin}/sucesso?subscription=1`,
        cancelUrl: `${window.location.origin}/`,
      });

      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error(response?.data?.error || "URL de assinatura Stripe nao recebida");
      }
    } catch (error) {
      toast({
        title: "Erro na assinatura",
        description: error.message || "Nao foi possivel criar a assinatura.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
            Clube de ofertas
          </p>
          <h2 className="text-xl font-black text-gray-800">Assinatura mensal</h2>
          <p className="text-sm text-gray-500">
            Escolha R$ 10, R$ 25 ou R$ 40 e cobre todo mes com fallback de ate 20 cartoes.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
          {isOwnGateway ? <ShieldCheck className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
          {isOwnGateway ? "Gateway proprio sandbox" : "Stripe recorrente"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          {subscriptionPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setForm((current) => ({ ...current, planId: plan.id }))}
              className={`rounded-xl border p-4 text-left transition-colors ${
                form.planId === plan.id
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-gray-200 bg-white hover:border-blue-400"
              }`}
            >
              <span className="text-sm font-semibold opacity-90">{plan.name}</span>
              <strong className="block mt-1 text-2xl">{formatBRL(plan.amountCents)}</strong>
              <span className="text-xs opacity-80">cobranca mensal</span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Nome do assinante"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="email@cliente.com"
            type="email"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {isOwnGateway ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-gray-500">
                O sistema salva apenas token, bandeira, final 4 e validade. Numero completo e CVV
                nao ficam guardados.
              </p>
              <button
                type="button"
                onClick={addCard}
                disabled={form.cards.length >= 20}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 hover:border-blue-500 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Cartao {form.cards.length}/20
              </button>
            </div>

            {form.cards.map((card, index) => (
              <div key={index} className="grid gap-2 rounded-xl bg-gray-50 p-3 md:grid-cols-12">
                <input
                  value={card.holderName}
                  onChange={(event) => updateCard(index, "holderName", event.target.value)}
                  placeholder="Nome impresso"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-3"
                />
                <input
                  value={card.number}
                  onChange={(event) => updateCard(index, "number", event.target.value)}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-4"
                />
                <input
                  value={card.expMonth}
                  onChange={(event) => updateCard(index, "expMonth", event.target.value)}
                  placeholder="MM"
                  inputMode="numeric"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-1"
                />
                <input
                  value={card.expYear}
                  onChange={(event) => updateCard(index, "expYear", event.target.value)}
                  placeholder="AAAA"
                  inputMode="numeric"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-2"
                />
                <input
                  value={card.cvc}
                  onChange={(event) => updateCard(index, "cvc", event.target.value)}
                  placeholder="CVV"
                  inputMode="numeric"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-1"
                />
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  disabled={form.cards.length === 1}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:text-red-600 disabled:opacity-40 md:col-span-1"
                  aria-label="Remover cartao"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            A versao Stripe envia a assinatura para o Stripe Checkout recorrente. Os dados de cartao
            ficam no Stripe.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-red-600 px-4 py-3 font-black text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {isSubmitting ? "Processando..." : `Assinar ${formatBRL(selectedPlan.amountCents)} por mes`}
        </button>
      </form>
    </section>
  );
}
