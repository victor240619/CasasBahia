import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categoryItems = [
  { id: "ofertas", label: "Ofertas Liberadas", bg: "bg-blue-700", emoji: "🏷️", special: true },
  { id: "assistente", label: "Assistente Virtual", bg: "bg-green-500", emoji: "💬" },
  { id: "smartphones", label: "IPhone", bg: "bg-gray-100", emoji: "📱", border: true },
  { id: "eletrodomesticos", label: "Eletrodomésticos", bg: "bg-blue-100", emoji: "🏠", border: true },
  { id: "tvs", label: "TV's", bg: "bg-blue-900", emoji: "📺" },
  { id: "smartphones", label: "Smartphones", bg: "bg-blue-600", emoji: "📱" },
  { id: "moveis", label: "Móveis", bg: "bg-amber-100", emoji: "🛋️", border: true },
  { id: "ar", label: "Ar", bg: "bg-cyan-100", emoji: "❄️", border: true },
  { id: "notebooks", label: "Portáteis", bg: "bg-gray-700", emoji: "💻" },
  { id: "audio", label: "Áudio", bg: "bg-purple-600", emoji: "🎵" },
  { id: "games", label: "Games", bg: "bg-red-600", emoji: "🎮" },
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
        className="flex gap-4 overflow-x-auto scroll-smooth mx-10 py-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categoryItems.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item.id === "ofertas" || item.id === "assistente" ? null : item.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-105 ${item.bg} ${item.border ? "border-2 border-gray-200" : ""}`}
            >
              {item.emoji}
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