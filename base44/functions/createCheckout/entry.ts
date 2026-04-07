import Stripe from "npm:stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const { items, successUrl, cancelUrl } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.name,
          images: [item.image],
          description: `⚠️ Entrega em até 30 dias corridos após confirmação do pagamento. 60% de desconto aplicado.`,
        },
        unit_amount: Math.round(item.discountedPrice * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${req.headers.get("origin")}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/`,
      locale: "pt-BR",
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        delivery_notice: "Entrega em ate 30 dias corridos",
      },
      payment_intent_data: {
        metadata: {
          base44_app_id: Deno.env.get("BASE44_APP_ID"),
        },
      },
      custom_text: {
        submit: {
          message: "⚠️ Atenção: Esta é uma promoção especial. Os produtos serão entregues em até 30 dias corridos após a confirmação do pagamento.",
        },
      },
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});