import React from "react";
import { X, Star, ShoppingCart, Clock, Truck, Shield } from "lucide-react";
import { getDiscountedPrice } from "../../data/products";

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;
  const discountedPrice = getDiscountedPrice(product.originalPrice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute top-3 left-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
                -60% OFF
              </div>
              <img src={product.image} alt={product.name} className="w-full h-72 object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
            </div>
          </div>

          <div className="md:w-1/2 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">{product.name}</h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews.toLocaleString()} avaliações)</span>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500 line-through">De: R$ {product.originalPrice.toFixed(2).replace(".", ",")}</p>
              <p className="text-3xl font-black text-blue-700">R$ {discountedPrice.toFixed(2).replace(".", ",")}</p>
              <p className="text-sm text-green-600 font-semibold">60% de desconto no PIX, Débito ou Crédito</p>
              <p className="text-xs text-gray-500 mt-1">ou em até 12x no cartão de crédito</p>
            </div>

            {/* Delivery warning */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-bold text-amber-700">⚠️ Aviso de Entrega</span>
              </div>
              <p className="text-xs text-amber-600">
                Esta é uma promoção especial. Os produtos serão entregues em até <strong>30 dias corridos</strong> após a confirmação do pagamento.
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-blue-700" />
                <span>Frete grátis para sua região</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-blue-700" />
                <span>Garantia de 12 meses</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => { onAddToCart(product); onClose(); }}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}