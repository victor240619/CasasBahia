import React, { useState } from "react";
import { ShoppingCart, Search, User, Heart, MapPin, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ cartCount, onSearch, onCartClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-blue-700 text-white text-xs py-1 text-center">
        🚚 Entrega em até 30 dias | Frete Grátis acima de R$ 299
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="text-2xl font-black tracking-tight">
              <span className="text-blue-700">ASAS</span>
              <span className="text-red-600"> GUIAS</span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="flex border-2 border-blue-700 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="O que você tá procurando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-1 text-gray-600 text-xs cursor-pointer hover:text-blue-700">
              <MapPin className="w-4 h-4" />
              <span>Goiânia, GO</span>
            </div>
            <button className="hidden md:flex flex-col items-center text-gray-600 hover:text-blue-700 text-xs">
              <User className="w-5 h-5" />
              <span>Conta</span>
            </button>
            <button className="hidden md:flex flex-col items-center text-gray-600 hover:text-blue-700 text-xs">
              <Heart className="w-5 h-5" />
              <span>Favoritos</span>
            </button>
            <button
              onClick={onCartClick}
              className="flex flex-col items-center text-gray-600 hover:text-blue-700 text-xs relative"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Carrinho</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-2 text-sm overflow-x-auto">
            <button className="flex items-center gap-1 hover:text-yellow-300 whitespace-nowrap">
              <Menu className="w-4 h-4" /> Departamentos
            </button>
            <Link to="/?cat=smartphones" className="hover:text-yellow-300 whitespace-nowrap">Telefonia</Link>
            <Link to="/?cat=eletrodomesticos" className="hover:text-yellow-300 whitespace-nowrap">Eletrodomésticos</Link>
            <Link to="/?cat=tvs" className="hover:text-yellow-300 whitespace-nowrap">TVs e Vídeo</Link>
            <Link to="/?cat=moveis" className="hover:text-yellow-300 whitespace-nowrap">Móveis</Link>
            <Link to="/?cat=notebooks" className="hover:text-yellow-300 whitespace-nowrap">Informática</Link>
            <Link to="/?cat=games" className="hover:text-yellow-300 whitespace-nowrap">Games</Link>
            <Link to="/?cat=audio" className="hover:text-yellow-300 whitespace-nowrap">Áudio</Link>
            <span className="bg-yellow-400 text-blue-900 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">60% OFF</span>
          </div>
        </div>
      </nav>
    </header>
  );
}