import React, { useState } from "react";
import { ShoppingCart, Search, User, Heart, MapPin, Menu, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ cartCount, onSearch, onCartClick }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Red line on TOP */}
      <div className="h-1 bg-red-600" />
      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
        {/* Logo - exatamente como Casas Bahia */}
        <Link to="/" className="flex-shrink-0 mr-3">
          <div className="text-2xl font-black tracking-tight leading-none select-none">
            <span className="text-blue-700">CASAS</span>
            <span className="text-red-600">BAHIA</span>
          </div>
        </Link>

        {/* Accessibility icon */}
        <button className="hidden md:flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="28" height="28">
            <circle cx="30" cy="30" r="29" fill="#0057B8" />
            <circle cx="30" cy="14" r="5" fill="white" />
            <path d="M30 22 c-7 0-12 4-12 4 l2 3 c0 0 4-3 10-3 s10 3 10 3 l2-3 c0 0-5-4-12-4z" fill="white" />
            <path d="M22 28 l-4 14 h4 l4-10 4 10 h4 l-4-14 z" fill="white" />
            <path d="M18 29 l2 7 c2 5 5 8 10 8 s8-3 10-8 l2-7" fill="none" stroke="white" strokeWidth="2.5" />
          </svg>
        </button>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-2">
          <div className="flex border border-gray-300 rounded-md overflow-hidden hover:border-blue-500 transition-colors">
            <input
              type="text"
              placeholder="O que você tá procurando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-sm outline-none bg-white text-gray-700 placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-white px-4 py-2 text-gray-400 hover:text-blue-700 border-l border-gray-200 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Delivery location */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-gray-600 flex-shrink-0">
          <Truck className="w-5 h-5 text-blue-700 flex-shrink-0" />
          <div className="leading-tight">
            <div className="text-gray-400 text-xs">Entregar em:</div>
            <div className="font-bold text-gray-700 text-xs">74474-378 - Goiânia</div>
          </div>
        </div>

        {/* Account */}
        <button className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-blue-700 border border-gray-200 hover:border-blue-400 rounded-full px-3 py-1.5 text-xs transition-colors flex-shrink-0">
          <User className="w-4 h-4" />
          <span>Acesse sua conta</span>
        </button>

        {/* Wishlist */}
        <button className="hidden md:block text-gray-500 hover:text-red-500 transition-colors flex-shrink-0">
          <Heart className="w-5 h-5" />
        </button>

        {/* Cart */}
        <button
          onClick={onCartClick}
          className="relative text-gray-600 hover:text-blue-700 transition-colors flex-shrink-0"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>



      {/* Navigation bar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-5 py-2 text-sm text-gray-700 overflow-x-auto whitespace-nowrap">
            {/* Left nav items */}
            <button className="flex items-center gap-1.5 font-semibold hover:text-blue-700 flex-shrink-0">
              <Menu className="w-4 h-4" />
              <span>Departamentos</span>
            </button>
            <Link to="/?cat=smartphones" className="hover:text-blue-700 flex-shrink-0 text-sm">Telefonia</Link>
            <Link to="/?cat=eletrodomesticos" className="hover:text-blue-700 flex-shrink-0 text-sm">Eletrodomésticos</Link>
            <Link to="/?cat=tvs" className="hover:text-blue-700 flex-shrink-0 text-sm">Tvs e Vídeo</Link>
            <Link to="/?cat=moveis" className="hover:text-blue-700 flex-shrink-0 text-sm">Móveis</Link>
            <Link to="/?cat=ar" className="hover:text-blue-700 flex-shrink-0 text-sm">Eletroporáteis</Link>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-semibold flex-shrink-0">Cupom</span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right nav items */}
            <span className="hover:text-blue-700 cursor-pointer flex-shrink-0 text-sm hidden md:block">Carnê Digital</span>
            <span className="hover:text-blue-700 cursor-pointer flex-shrink-0 text-sm hidden md:block">Cartão Casas Bahia</span>
            <span className="hover:text-blue-700 cursor-pointer flex-shrink-0 text-sm hidden md:block">Serviços e Proteções</span>
            <span className="hover:text-blue-700 cursor-pointer flex-shrink-0 text-sm hidden md:block">Soluções Financeiras</span>
          </div>
        </div>
      </nav>
    </header>
  );
}