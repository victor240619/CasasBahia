import React, { useState } from "react";
import { ShoppingCart, Search, User, Heart, MapPin, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ cartCount, onSearch, onCartClick }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 mr-2">
          <div className="text-2xl font-black tracking-tight leading-none">
            <span className="text-blue-700">ASAS</span>
            <span className="text-red-600">GUIAS</span>
          </div>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="flex border border-gray-300 rounded-md overflow-hidden hover:border-blue-500 transition-colors">
            <input
              type="text"
              placeholder="O que você tá procurando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-sm outline-none bg-white"
            />
            <button type="submit" className="bg-white px-4 py-2 text-gray-500 hover:text-blue-700 border-l border-gray-200 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-4 ml-auto flex-shrink-0">
          {/* Delivery location */}
          <div className="hidden lg:flex flex-col text-xs text-gray-500 leading-tight cursor-pointer hover:text-blue-700">
            <span className="text-gray-400">Entregar em:</span>
            <div className="flex items-center gap-1 font-semibold text-gray-700">
              <MapPin className="w-3 h-3" />
              <span>Goiânia, GO</span>
            </div>
          </div>

          {/* Account */}
          <button className="hidden md:flex items-center gap-2 text-gray-600 hover:text-blue-700 border border-gray-200 hover:border-blue-400 rounded-full px-3 py-1.5 text-sm transition-colors">
            <User className="w-4 h-4" />
            <span>Acesse sua conta</span>
          </button>

          {/* Wishlist */}
          <button className="hidden md:block text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="w-6 h-6" />
          </button>

          {/* Cart */}
          <button onClick={onCartClick} className="relative text-gray-600 hover:text-blue-700 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-2 text-sm text-gray-700 overflow-x-auto whitespace-nowrap">
            <button className="flex items-center gap-1.5 font-semibold hover:text-blue-700 flex-shrink-0">
              <Menu className="w-4 h-4" />
              <span>Departamentos</span>
            </button>
            <Link to="/?cat=smartphones" className="hover:text-blue-700 flex-shrink-0">Telefonia</Link>
            <Link to="/?cat=eletrodomesticos" className="hover:text-blue-700 flex-shrink-0">Eletrodomésticos</Link>
            <Link to="/?cat=tvs" className="hover:text-blue-700 flex-shrink-0">Tvs e Vídeo</Link>
            <Link to="/?cat=moveis" className="hover:text-blue-700 flex-shrink-0">Móveis</Link>
            <Link to="/?cat=ar" className="hover:text-blue-700 flex-shrink-0">Eletroporáteis</Link>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0">Cupom</span>
            <div className="hidden md:flex items-center gap-6 ml-6 border-l border-gray-200 pl-6">
              <span className="hover:text-blue-700 cursor-pointer flex-shrink-0">Carnê Digital</span>
              <span className="hover:text-blue-700 cursor-pointer flex-shrink-0">Cartão Asas Guias</span>
              <span className="hover:text-blue-700 cursor-pointer flex-shrink-0">Serviços e Proteções</span>
              <span className="hover:text-blue-700 cursor-pointer flex-shrink-0">Soluções Financeiras</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}