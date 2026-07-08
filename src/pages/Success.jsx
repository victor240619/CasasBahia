import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Clock, Home, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Success() {
  const sessionId = useMemo(() => new URLSearchParams(window.location.search).get("session_id"), []);
  const [stripeStatus, setStripeStatus] = useState(() =>
    sessionId ? { state: "loading", message: "Confirmando pagamento Stripe..." } : { state: "idle" }
  );

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;

    fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Nao foi possivel confirmar a sessao Stripe.");
        }
        return data;
      })
      .then((data) => {
        if (cancelled) {
          return;
        }

        const fulfilled = data?.fulfillment?.fulfilled;
        const alreadyFulfilled = data?.fulfillment?.alreadyFulfilled;
        const label =
          data?.fulfillment?.subscriptionId ||
          data?.fulfillment?.orderId ||
          data?.session?.id ||
          "registro Stripe";

        setStripeStatus({
          state: fulfilled ? "success" : "pending",
          message: fulfilled
            ? `${alreadyFulfilled ? "Registro ja confirmado" : "Registro confirmado"}: ${label}.`
            : "Sessao Stripe encontrada, mas o pagamento ainda nao esta concluido.",
        });
      })
      .catch((error) => {
        if (!cancelled) {
          setStripeStatus({
            state: "error",
            message: error.message || "Falha ao confirmar pagamento Stripe.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const isCheckingStripe = stripeStatus.state === "loading";
  const isStripeError = stripeStatus.state === "error";
  const StatusIcon = isCheckingStripe ? Loader2 : isStripeError ? AlertCircle : CheckCircle;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isStripeError ? "bg-red-100" : isCheckingStripe ? "bg-blue-100" : "bg-green-100"
          }`}
        >
          <StatusIcon
            className={`w-12 h-12 ${
              isStripeError ? "text-red-600" : isCheckingStripe ? "animate-spin text-blue-600" : "text-green-600"
            }`}
          />
        </div>

        <h1 className="text-2xl font-black text-gray-800 mb-2">
          {isStripeError ? "Confirmacao pendente" : isCheckingStripe ? "Verificando pagamento" : "Pedido Confirmado!"}
        </h1>
        <p className="text-gray-500 mb-6">
          {stripeStatus.message || "Seu pagamento foi processado com sucesso."}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-amber-700">Prazo de Entrega</span>
          </div>
          <p className="text-sm text-amber-600">
            Seu pedido será entregue em até <strong>30 dias corridos</strong> após a confirmação do pagamento. Você receberá atualizações por e-mail.
          </p>
        </div>

        <div className="text-3xl font-black mb-2">
          <span className="text-blue-700">CASAS</span>
          <span className="text-red-600"> BAHIAS</span>
        </div>
        <p className="text-sm text-gray-400 mb-6">Obrigado por comprar conosco!</p>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-xl font-bold transition-colors"
        >
          <Home className="w-5 h-5" />
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
}
