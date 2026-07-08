import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formatBRL } from "@/lib/money";
import { subscriptionPlans } from "@/payments/gateway";

export default function SubscriptionPanel() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    planId: "sub-10",
    name: "",
    email: "",
  });

  const selectedPlan = subscriptionPlans.find((plan) => plan.id === form.planId);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/stripe/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          customer: { name: form.name, email: form.email },
          successUrl: `${window.location.origin}/sucesso?subscription=1`,
          cancelUrl: `${window.location.origin}/`,
        }),
      });
      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data?.error || "URL de assinatura Stripe nao recebida");
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
            Escolha R$ 10, R$ 25 ou R$ 40 e cobre todo mes pela Stripe em producao.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
          <CreditCard className="w-4 h-4" />
          Stripe recorrente
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

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          A assinatura e criada no Stripe Checkout recorrente. Os dados de cartao ficam no Stripe.
        </div>

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
