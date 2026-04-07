import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Banners reais extraídos do site oficial Casas Bahia
const banners = [
  {
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/6781e57d-45e2-4b2e-9e26-0ece4308bf9e.png?imwidth=1440",
    alt: "Pagoday - Ofertas Liberadas",
    category: null,
  },
  {
    img: "https://imgs.via.com.br/banners/CasasBahia/e1c3e19d-e157-4fc5-8985-f9bf84c8692a.png?imwidth=1440",
    alt: "Pode Tudo - até 70% OFF + Frete Grátis",
    category: null,
  },
  {
    img: "https://imgs.via.com.br/banners/CasasBahia/5d59de24-6518-4da6-8965-b28db65641cf.gif?imwidth=1440",
    alt: "Festival de Móveis",
    category: "moveis",
  },
  {
    img: "https://imgs.via.com.br/banners/CasasBahia/537d62d9-80dc-4d5f-8ff1-9cfc3f7d1a6b.gif?imwidth=1440",
    alt: "4.4 TVs",
    category: "tvs",
  },
  {
    img: "https://imgs.via.com.br/banners/CasasBahia/f81fe694-55aa-455a-9ce3-2d0601ae1f1e.gif?imwidth=1440",
    alt: "4.4 Ar e Ventilação",
    category: "ar",
  },
];

export default function HeroBanner({ onCategorySelect }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  return (
    <div className="relative w-full rounded-xl overflow-hidden mb-4 bg-blue-900" style={{ height: "280px" }}>
      {banners.map((banner, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
          onClick={() => banner.category && onCategorySelect(banner.category)}
          style={{ cursor: banner.category ? "pointer" : "default" }}
        >
          <img
            src={banner.img}
            alt={banner.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}