import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categoryItems = [
  {
    id: null,
    label: "Ofertas",
    // foto real: etiqueta de desconto / sale tag em loja
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=160&h=160&fit=crop",
  },
  {
    id: null,
    label: "Assistente",
    // foto real: pessoa usando smartphone com assistente virtual
    img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=160&h=160&fit=crop",
  },
  {
    id: "smartphones",
    label: "iPhone",
    // foto real: iPhone 15 Pro titanium em close
    img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=160&h=160&fit=crop",
  },
  {
    id: "eletrodomesticos",
    label: "Eletrodomésticos",
    // foto real: geladeira inox em cozinha moderna
    img: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=160&h=160&fit=crop",
  },
  {
    id: "tvs",
    label: "TV's",
    // foto real: Smart TV Samsung na sala
    img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=160&h=160&fit=crop",
  },
  {
    id: "smartphones",
    label: "Smartphones",
    // foto real: Samsung Galaxy S series em mão
    img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=160&h=160&fit=crop",
  },
  {
    id: "moveis",
    label: "Móveis",
    // foto real: sofá cinza em sala clean
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&h=160&fit=crop",
  },
  {
    id: "ar",
    label: "Ar",
    // foto real: ar-condicionado split branco fixado na parede
    img: "https://images.unsplash.com/photo-1599839619487-5cbba0a1bc45?w=160&h=160&fit=crop",
  },
  {
    id: "notebooks",
    label: "Portáteis",
    // foto real: MacBook Air aberto em mesa
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=160&h=160&fit=crop",
  },
  {
    id: "audio",
    label: "Áudio",
    // foto real: fone Sony WH-1000XM5 sobre fundo branco
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&h=160&fit=crop",
  },
  {
    id: "games",
    label: "Games",
    // foto real: PlayStation 5 branco vertical
    img: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=160&h=160&fit=crop",
  },
];

export default function CategoryIcons({ onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center mb-6">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 z-10 bg-white border border-gray-200 shadow rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth mx-10 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categoryItems.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden transition-transform group-hover:scale-105 shadow-sm border border-gray-200">
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&h=160&fit=crop"; }}
              />
            </div>
            <span className="text-xs text-gray-600 text-center w-16 leading-tight font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        className="absolute right-0 z-10 bg-white border border-gray-200 shadow rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}