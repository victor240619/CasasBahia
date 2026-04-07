import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WHATSAPP_NUMBER = "5500000000000"; // substitua pelo número real

const categoryItems = [
  {
    id: null,
    label: "Ofertas",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=80&h=80&fit=crop",
    whatsapp: false,
  },
  {
    id: null,
    label: "Assistente",
    img: null, // WhatsApp icon
    whatsapp: true,
  },
  {
    id: "smartphones",
    label: "IPhone",
    img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=80&h=80&fit=crop",
    whatsapp: false,
  },
  {
    id: "eletrodomesticos",
    label: "Eletrodomésticos",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop",
    whatsapp: false,
  },
  {
    id: "tvs",
    label: "TV's",
    img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=80&h=80&fit=crop",
    whatsapp: false,
  },
  {
    id: "smartphones",
    label: "Smartphones",
    img: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=80&h=80&fit=crop",
    whatsapp: false,
  },
  {
    id: "moveis",
    label: "Móveis",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop",
    whatsapp: false,
  },
  {
    id: "ar",
    label: "Ar",
    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=80&h=80&fit=crop",
    whatsapp: false,
  },
  {
    id: "notebooks",
    label: "Portáteis",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop",
    whatsapp: false,
  },
  {
    id: "audio",
    label: "Áudio",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
    whatsapp: false,
  },
  {
    id: "games",
    label: "Games",
    img: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=80&h=80&fit=crop",
    whatsapp: false,
  },
];

export default function CategoryIcons({ onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  const handleClick = (item) => {
    if (item.whatsapp) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de falar com o assistente virtual da Casas Bahia.`, "_blank");
    } else {
      onSelect(item.id);
    }
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
            onClick={() => handleClick(item)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm border border-gray-200 bg-black">
              {item.whatsapp ? (
                /* WhatsApp SVG icon */
                <svg viewBox="0 0 48 48" width="42" height="42" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#25D366" />
                  <path
                    d="M34.6 13.4A14.9 14.9 0 0 0 24 9C16.3 9 10 15.3 10 23c0 2.5.6 4.9 1.9 7L10 38l8.3-1.9a15 15 0 0 0 5.7 1.1c7.7 0 14-6.3 14-14 0-3.7-1.5-7.2-3.4-9.8zM24 35.6a12.4 12.4 0 0 1-5.3-1.2l-.4-.2-4.9 1.1 1.2-4.7-.3-.4A12.3 12.3 0 0 1 12.6 23c0-6.3 5.1-11.4 11.4-11.4 3 0 5.9 1.2 8 3.4a11.3 11.3 0 0 1 3.3 8c0 6.3-5.1 11.6-11.3 11.6zm6.2-8.6c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.5-.5.3-.5v-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.9 1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.2 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.2-.3-.3-.6-.4z"
                    fill="white"
                  />
                </svg>
              ) : (
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover"
                />
              )}
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