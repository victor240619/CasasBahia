import React from "react";
import { X, Trash2, ShoppingBag, AlertCircle } from "lucide-react";
import { getDiscountedPrice } from "../../data/products";

export default function CartSidebar({ cart, onClose, onRemove, onCheckout, isCheckingOut }) {
  const total = cart.reduce((sum, item) => sum + getDiscountedPrice(item) * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="bg-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-bold text-lg">Meu Carrinho</h2>
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{cart.length}</span>
          </div>
          <button onClick={onClose} className="hover:bg-blue-800 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice - only show if cart has promo30dias items */}
        {cart.some(item => item.promo30dias) && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-medium">
              ⚠️ Alguns itens serão entregues em até 30 dias corridos após a confirmação do pagamento.
            </p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                  <div className="mt-1">
                    <span className="text-xs text-gray-400 line-through">R$ {item.originalPrice.toFixed(2).replace(".", ",")}</span>
                    <p className="text-blue-700 font-bold">
                      R$ {getDiscountedPrice(item).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">Qtd: {item.qty}</p>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total com 60% OFF:</span>
              <span className="text-2xl font-bold text-blue-700">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Pagamento via Crédito, Débito, PIX ou Boleto
            </p>
            <button
              onClick={onCheckout}
              disabled={isCheckingOut}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-lg transition-colors"
            >
              {isCheckingOut ? "Processando..." : "Finalizar Compra"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}