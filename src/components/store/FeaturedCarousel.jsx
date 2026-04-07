import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const featuredItems = [
  {
    id: "eletrodomesticos",
    label: "Mixer Philips 3 em 1",
    price: "R$142,40",
    priceNote: "no pix",
    img: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=200&h=160&fit=crop",
    badge: null,
  },
  {
    id: "smartphones",
    label: "iPhone 15 128GB",
    price: "R$198,40",
    priceNote: "com o Cartão Casas Bahia",
    img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=160&fit=crop",
    badge: "FRETE GRÁTIS",
  },
  {
    id: "eletrodomesticos",
    label: "Lavadora Brastemp 11kg",
    price: "R$2.298",
    priceNote: "no pix",
    img: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&h=160&fit=crop",
    badge: null,
  },
  {
    id: "tvs",
    label: "Smart TV 65\" 4K",
    price: "R$2.999",
    priceNote: "no pix",
    img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=200&h=160&fit=crop",
    badge: null,
  },
  {
    id: "ar",
    label: "Ar-condicionado LG 18.000 BTU",
    price: "R$2.999",
    priceNote: "no pix",
    img: "https://images.unsplash.com/photo-1599839619487-5cbba0a1bc45?w=200&h=160&fit=crop",
    badge: null,
  },
  {
    id: "games",
    label: "Jogo de canetas 10 peças Tromontina",
    price: "R$29,90",
    priceNote: "no pix",
    img: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=200&h=160&fit=crop",
    badge: null,
  },
  {
    id: "notebooks",
    label: "Notebook Dell i7 16GB 512GB",
    price: "R$4.079",
    priceNote: "no pix",
    img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=160&fit=crop",
    badge: null,
  },
  {
    id: "audio",
    label: "Fone Sony WH-1000XM5",
    price: "R$839,60",
    priceNote: "no pix",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=160&fit=crop",
    badge: null,
  },
];

export default function FeaturedCarousel({ onCategorySelect }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="mb-6">
      <div className="relative flex items-center">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 z-10 bg-white border border-gray-300 shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-50 flex-shrink-0 -translate-x-3"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth mx-4 py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredItems.map((item, i) => (
            <button
              key={i}
              onClick={() => onCategorySelect(item.id)}
              className="flex-shrink-0 w-40 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group text-left"
            >
              <div className="relative w-full h-28 bg-gray-50 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=160&fit=crop"; }}
                />
                {item.badge && (
                  <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 leading-tight line-clamp-2 mb-1 min-h-[32px]">{item.label}</p>
                <p className="text-sm font-bold text-blue-700">{item.price}</p>
                <p className="text-[10px] text-gray-400">{item.priceNote}</p>
                <p className="text-[10px] text-blue-600 mt-1 font-medium">mais ofertas →</p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-0 z-10 bg-white border border-gray-300 shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-50 flex-shrink-0 translate-x-3"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}