import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categoryItems = [
  {
    id: null,
    label: "Ofertas",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=80&h=80&fit=crop",
    bg: "bg-blue-600",
  },
  {
    id: null,
    label: "Assistente",
    img: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=80&h=80&fit=crop",
    bg: "bg-green-500",
  },
  {
    id: "smartphones",
    label: "IPhone",
    img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&h=80&fit=crop&crop=center",
    bg: "bg-gray-100",
  },
  {
    id: "eletrodomesticos",
    label: "Eletrodomésticos",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop",
    bg: "bg-blue-100",
  },
  {
    id: "tvs",
    label: "TV's",
    img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=80&h=80&fit=crop",
    bg: "bg-blue-900",
  },
  {
    id: "smartphones",
    label: "Smartphones",
    img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=80&h=80&fit=crop",
    bg: "bg-blue-600",
  },
  {
    id: "moveis",
    label: "Móveis",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop",
    bg: "bg-amber-100",
  },
  {
    id: "ar",
    label: "Ar",
    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=80&h=80&fit=crop",
    bg: "bg-cyan-100",
  },
  {
    id: "notebooks",
    label: "Portáteis",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop",
    bg: "bg-gray-800",
  },
  {
    id: "audio",
    label: "Áudio",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
    bg: "bg-purple-600",
  },
  {
    id: "games",
    label: "Games",
    img: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=80&h=80&fit=crop",
    bg: "bg-red-600",
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
            <div className={`w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm border border-gray-200`}>
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover"
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