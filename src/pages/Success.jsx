import React from "react";
import { CheckCircle, Clock, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-2xl font-black text-gray-800 mb-2">Pedido Confirmado!</h1>
        <p className="text-gray-500 mb-6">Seu pagamento foi processado com sucesso.</p>

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
          <span className="text-blue-700">ASAS</span>
          <span className="text-red-600"> GUIAS</span>
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