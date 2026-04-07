import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Imagens reais extraídas do site oficial Casas Bahia
const categoryItems = [
  {
    id: null,
    label: "Ofertas Liberadas",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/d38460b5-22a4-41c9-aeea-eb82b962049c.png?imwidth=256",
  },
  {
    id: null,
    label: "Assistente Virtual",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/b9bee7a0-ff26-45b0-a5cf-a0362a3bc689.png?imwidth=256",
  },
  {
    id: "smartphones",
    label: "iPhone",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/1935efe5-2357-471c-b0ca-7be4f6ff68ea.png?imwidth=256",
  },
  {
    id: "eletrodomesticos",
    label: "Eletrodomésticos",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/a115be8c-381d-4043-9051-fe71b2afaaba.png?imwidth=256",
  },
  {
    id: "tvs",
    label: "TV's",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/33d1cc0e-280c-4c7c-9f11-fc26d7ffda22.png?imwidth=256",
  },
  {
    id: "smartphones",
    label: "Smartphones",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/11414c9a-5d2f-412d-9e77-ad859c7c793a.png?imwidth=256",
  },
  {
    id: "moveis",
    label: "Móveis",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/6cc9f024-e160-41d0-babc-ccb7afaa18f5.png?imwidth=256",
  },
  {
    id: "ar",
    label: "Ar e Ventilação",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/35b18e42-b78c-49db-bf42-c47a80c75fb3.png?imwidth=256",
  },
  {
    id: "notebooks",
    label: "Portáteis",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/c4699ad2-6ea2-4de2-bde6-7f8e4dce7614.png?imwidth=256",
  },
  {
    id: "audio",
    label: "Áudio",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/b4b3e9c6-0779-44ec-8892-abfcd3c0e46d.png?imwidth=256",
  },
  {
    id: "games",
    label: "Games",
    img: "https://imgs.via.com.br/images/CasasBahia/mosaicos/9ab18eed-bd29-4ccb-b48b-5b3eb9bc3de2.png?imwidth=256",
  },
];

export default function CategoryIcons({ onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center mb-4">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 z-10 bg-white border border-gray-200 shadow rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth mx-8 py-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categoryItems.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item.id)}
            className="flex flex-col items-center gap-1 flex-shrink-0 group"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden transition-transform group-hover:scale-105 bg-gray-50">
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[11px] text-gray-600 text-center w-16 leading-tight">{item.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        className="absolute right-0 z-10 bg-white border border-gray-200 shadow rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}