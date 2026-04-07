import React, { useState, useEffect } from "react";

const banners = [
  {
    title: "60% OFF em tudo!",
    subtitle: "Crédito, Débito, PIX ou Boleto",
    desc: "Os melhores produtos com o maior desconto do Brasil",
    bg: "from-blue-700 to-blue-900",
    emoji: "🎉",
    cat: null,
  },
  {
    title: "Smartphones Top",
    subtitle: "iPhone, Samsung, Xiaomi e mais",
    desc: "Pague menos, leve mais tecnologia para sua vida",
    bg: "from-red-600 to-red-800",
    emoji: "📱",
    cat: "smartphones",
  },
  {
    title: "TVs 4K Incríveis",
    subtitle: "QLED, OLED e Google TV",
    desc: "A melhor experiência de imagem com 60% de desconto",
    bg: "from-indigo-700 to-purple-900",
    emoji: "📺",
    cat: "tvs",
  },
];

export default function HeroBanner({ onCategorySelect }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = banners[current];

  return (
    <div className={`bg-gradient-to-r ${b.bg} text-white rounded-2xl p-8 md:p-12 mb-6 transition-all duration-500`}>
      <div className="max-w-2xl">
        <div className="text-6xl mb-4">{b.emoji}</div>
        <h1 className="text-3xl md:text-5xl font-black mb-2">{b.title}</h1>
        <p className="text-xl md:text-2xl font-semibold text-yellow-300 mb-2">{b.subtitle}</p>
        <p className="text-base text-white/80 mb-6">{b.desc}</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => b.cat && onCategorySelect(b.cat)}
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black px-6 py-3 rounded-xl text-lg transition-colors"
          >
            Ver Ofertas
          </button>
          <div className="bg-white/20 px-4 py-3 rounded-xl text-sm font-semibold">
            ⚠️ Entrega em até 30 dias
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-6">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-white w-8" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}