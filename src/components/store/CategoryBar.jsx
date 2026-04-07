import React from "react";

const categoryImages = {
  smartphones: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=80&h=80&fit=crop",
  tvs: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=80&h=80&fit=crop",
  eletrodomesticos: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=80&h=80&fit=crop",
  notebooks: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop",
  moveis: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
  games: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=80&h=80&fit=crop",
  ar: "https://images.unsplash.com/photo-1599839619487-5cbba0a1bc45?w=80&h=80&fit=crop",
};

const categoryNames = {
  smartphones: "Smartphones",
  tvs: "TVs",
  eletrodomesticos: "Eletrodomésticos",
  notebooks: "Notebooks",
  moveis: "Móveis",
  audio: "Áudio",
  games: "Games",
  ar: "Ar-Condicionado",
};

const allImg = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=80&h=80&fit=crop";

export default function CategoryBar({ selectedCategory, onSelect }) {
  const cats = Object.keys(categoryImages);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: "none" }}>
      {/* Todos */}
      <button
        onClick={() => onSelect(null)}
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 whitespace-nowrap transition-all flex-shrink-0 ${
          !selectedCategory
            ? "border-blue-700 bg-blue-700 text-white"
            : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
        }`}
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden">
          <img src={allImg} alt="Todos" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-semibold">Todos</span>
      </button>

      {cats.map((id) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 whitespace-nowrap transition-all flex-shrink-0 ${
            selectedCategory === id
              ? "border-blue-700 bg-blue-700 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
          }`}
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img
              src={categoryImages[id]}
              alt={categoryNames[id]}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = allImg; }}
            />
          </div>
          <span className="text-xs font-semibold">{categoryNames[id]}</span>
        </button>
      ))}
    </div>
  );
}