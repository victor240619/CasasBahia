import Stripe from "npm:stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

const ALLOWED_PLANS = new Map([
  ["sub-10", { name: "Plano Essencial", amountCents: 1000 }],
  ["sub-25", { name: "Plano Plus", amountCents: 2500 }],
  ["sub-40", { name: "Plano Premium", amountCents: 4000 }],
]);

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Metodo nao permitido" }, { status: 405 });
    }

    const body = await req.json();
    const { planId, customer, successUrl, cancelUrl } = body;
    const plan = ALLOWED_PLANS.get(planId);

    if (!plan) {
      return Response.json({ error: "Plano invalido" }, { status: 400 });
    }

    const email = String(customer?.email || "").trim().toLowerCase();
    const name = String(customer?.name || "").trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Cliente invalido" }, { status: 400 });
    }

    const originUrl = req.headers.get("origin") || "https://example.com";
    const finalSuccessUrl = successUrl || `${originUrl}/sucesso?subscription=1&session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || originUrl;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            recurring: { interval: "month" },
            product_data: {
              name: plan.name,
              description: "Assinatura mensal da loja",
            },
            unit_amount: plan.amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      locale: "pt-BR",
      metadata: {
        planId,
        customerName: name.substring(0, 120),
        base44_app_id: Deno.env.get("BASE44_APP_ID") || "unknown",
      },
    });

    return Response.json({ url: session.url, sessionId: session.id }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Subscription checkout error:", errorMessage);
    return Response.json(
      { error: "Erro ao processar assinatura. Tente novamente." },
      { status: 500 }
    );
  }
});
