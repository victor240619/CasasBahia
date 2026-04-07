import Stripe from "npm:stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

// Validação e sanitização de items
const validateLineItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items deve ser um array não vazio");
  }

  return items.map((item) => {
    if (!item.name || typeof item.name !== "string") {
      throw new Error("Campo 'name' é obrigatório e deve ser string");
    }
    if (!item.image || typeof item.image !== "string") {
      throw new Error("Campo 'image' é obrigatório e deve ser string");
    }
    if (typeof item.discountedPrice !== "number" || item.discountedPrice <= 0) {
      throw new Error("Campo 'discountedPrice' deve ser um número maior que 0");
    }
    if (typeof item.qty !== "number" || item.qty < 1) {
      throw new Error("Campo 'qty' deve ser um número >= 1");
    }

    const unitAmount = Math.round(item.discountedPrice * 100);
    if (unitAmount < 50) {
      throw new Error("Valor mínimo por item é R$ 0.50");
    }

    return {
      price_data: {
        currency: "brl",
        product_data: {
          name: item.name.substring(0, 255),
          images: [item.image],
          description: "Produto com desconto especial",
        },
        unit_amount: unitAmount,
      },
      quantity: item.qty,
    };
  });
};

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Método não permitido" }, { status: 405 });
    }

    const body = await req.json();
    const { items, successUrl, cancelUrl } = body;

    // Validar items
    const lineItems = validateLineItems(items);

    // Validar URLs
    const originUrl = req.headers.get("origin") || "https://example.com";
    const finalSuccessUrl = successUrl || `${originUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || originUrl;

    console.log("Creating checkout session with", lineItems.length, "items");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      locale: "pt-BR",
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID") || "unknown",
      },
    });

    console.log("Checkout session created:", session.id);
    return Response.json({ url: session.url, sessionId: session.id }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", errorMessage);
    console.error("Error details:", error);

    if (errorMessage.includes("Invalid request")) {
      return Response.json(
        { error: "Dados inválidos. Verifique os valores dos produtos." },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "Erro ao processar checkout. Tente novamente." },
      { status: 500 }
    );
  }
});