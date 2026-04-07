import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    left: {
      bg: "from-blue-700 to-blue-800",
      title: "60% OFF",
      subtitle: "QUANDO CAI",
      highlight: "O PAGAMENTO",
      tag: "PROMOÇÃO",
      tagBg: "bg-red-500",
    },
    right: {
      bg: "from-blue-800 to-blue-900",
      title: "CASAS BAHIAS",
      subtitle: "QUANDO CAI",
      highlight: "O PAGAMENTO",
    },
  },
  {
    left: {
      bg: "from-red-700 to-red-800",
      title: "SMARTPHONES",
      subtitle: "ATÉ",
      highlight: "60% OFF",
      tag: "OFERTA",
      tagBg: "bg-yellow-400",
    },
    right: {
      bg: "from-red-800 to-red-900",
      title: "iPhone • Samsung",
      subtitle: "OS MELHORES",
      highlight: "PREÇOS",
    },
  },
  {
    left: {
      bg: "from-indigo-700 to-indigo-800",
      title: "SMART TVs",
      subtitle: "4K QLED & OLED",
      highlight: "60% OFF",
      tag: "DESTAQUE",
      tagBg: "bg-green-500",
    },
    right: {
      bg: "from-indigo-800 to-indigo-900",
      title: "CASAS BAHIAS",
      subtitle: "ENTREGA EM ATÉ",
      highlight: "30 DIAS",
    },
  },
];

export default function HeroBanner({ onCategorySelect }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);

  const b = banners[current];

  return (
    <div className="relative mb-6 rounded-xl overflow-hidden">
      <div className="flex h-64 md:h-80">
        {/* Left panel */}
        <div className={`flex-1 bg-gradient-to-br ${b.left.bg} text-white p-8 flex flex-col justify-center relative overflow-hidden`}>
          {/* Background circle decoration */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-12 w-52 h-52 rounded-full bg-white/5" />
          
          {b.left.tag && (
            <span className={`${b.left.tagBg} text-white text-xs font-black px-3 py-1 rounded-full self-start mb-3`}>
              {b.left.tag}
            </span>
          )}
          <p className="text-lg font-semibold text-white/80">{b.left.subtitle}</p>
          <h2 className="text-4xl md:text-6xl font-black leading-none">{b.left.highlight}</h2>
          <h3 className="text-2xl font-black mt-1 text-yellow-300">{b.left.title}</h3>
          <button
            onClick={() => onCategorySelect(null)}
            className="mt-4 bg-white text-blue-800 font-black px-5 py-2 rounded-lg text-sm hover:bg-yellow-300 transition-colors self-start"
          >
            Ver Ofertas →
          </button>
        </div>

        {/* Right panel */}
        <div className={`flex-1 bg-gradient-to-br ${b.right.bg} text-white p-8 flex flex-col justify-center items-end relative overflow-hidden`}>
          <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="text-right">
            <p className="text-lg font-semibold text-white/70">{b.right.subtitle}</p>
            <h2 className="text-4xl md:text-6xl font-black leading-none">{b.right.highlight}</h2>
            <p className="text-xl font-black mt-2 text-yellow-300">{b.right.title}</p>
          </div>
          <div className="mt-4 bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-sm font-semibold">
            ⚠️ Entrega em até 30 dias
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % banners.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}