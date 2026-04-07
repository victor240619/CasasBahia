import React from "react";
import { Star, ShoppingCart, Clock } from "lucide-react";
import { getDiscountedPrice } from "../../data/products";

export default function ProductCard({ product, onAddToCart, onViewProduct }) {
  const discountedPrice = getDiscountedPrice(product);

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
      {/* Discount badge */}
      <div className="relative">
        <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{product.discount}%
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer bg-gray-100"
          onClick={() => onViewProduct(product)}
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"; }}
        />
      </div>

      <div className="p-3">
        {/* Name */}
        <h3
          className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 cursor-pointer hover:text-blue-700 min-h-[40px]"
          onClick={() => onViewProduct(product)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
          <span className="text-xs text-gray-500">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="mb-2">
          <span className="text-xs text-gray-400 line-through">
            R$ {product.originalPrice.toFixed(2).replace(".", ",")}
          </span>
          <div className="text-xl font-bold text-blue-700">
            R$ {discountedPrice.toFixed(2).replace(".", ",")}
          </div>
          <div className="text-xs text-green-600 font-semibold">
            no PIX, Débito ou Crédito à vista
          </div>
        </div>

        {/* Delivery notice - only for promo30dias products */}
        {product.promo30dias && (
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded p-1.5 mb-3">
            <Clock className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span className="text-xs text-amber-700 font-medium">⚠️ Promoção: entrega em 30 dias</span>
          </div>
        )}

        {/* Add to cart */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors mt-auto"
        >
          <ShoppingCart className="w-4 h-4" />
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}