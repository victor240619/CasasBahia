import React from "react";
import { categories } from "../../data/products";

export default function CategoryBar({ selectedCategory, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 whitespace-nowrap transition-all flex-shrink-0 ${
          !selectedCategory
            ? "border-blue-700 bg-blue-700 text-white"
            : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
        }`}
      >
        <span className="text-2xl">🏪</span>
        <span className="text-xs font-semibold">Todos</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 whitespace-nowrap transition-all flex-shrink-0 ${
            selectedCategory === cat.id
              ? "border-blue-700 bg-blue-700 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
          }`}
        >
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-xs font-semibold">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}