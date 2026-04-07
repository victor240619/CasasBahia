import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Header from "../components/store/Header";
import HeroBanner from "../components/store/HeroBanner";
import CategoryIcons from "../components/store/CategoryIcons";
import FeaturedCarousel from "../components/store/FeaturedCarousel";
import CategoryBar from "../components/store/CategoryBar";
import ProductCard from "../components/store/ProductCard";
import CartSidebar from "../components/store/CartSidebar";
import ProductModal from "../components/store/ProductModal";
import { products, getDiscountedPrice } from "../data/products";
import Footer from "../components/store/Footer";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat) setSelectedCategory(cat);
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchCat = !selectedCategory || p.category === selectedCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    toast({ title: "Produto adicionado!", description: product.name, duration: 2000 });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("O checkout só funciona a partir do app publicado. Por favor, abra o app em uma nova aba.");
      return;
    }
    setIsCheckingOut(true);
    try {
      const items = cart.map((item) => ({
        name: item.name,
        image: item.image,
        discountedPrice: getDiscountedPrice(item),
        qty: item.qty,
      }));
      const response = await base44.functions.invoke("createCheckout", {
        items,
        successUrl: `${window.location.origin}/sucesso`,
        cancelUrl: `${window.location.origin}/`,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Erro no checkout", description: "Não foi possível processar. Tente novamente.", variant: "destructive" });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        onSearch={(q) => { setSearchQuery(q); setSelectedCategory(null); }}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Category icons row (like Casas Bahia) */}
        {!searchQuery && (
          <CategoryIcons onSelect={(cat) => { setSelectedCategory(cat); setSearchQuery(""); }} />
        )}

        {/* Hero Banner */}
        {!searchQuery && (
          <HeroBanner onCategorySelect={(cat) => { setSelectedCategory(cat); setSearchQuery(""); }} />
        )}

        {/* Featured products carousel (like Casas Bahia highlights row) */}
        {!searchQuery && (
          <FeaturedCarousel onCategorySelect={(cat) => { setSelectedCategory(cat); setSearchQuery(""); }} />
        )}

        {/* Promo strip */}
        <div className="bg-blue-700 text-white rounded-lg px-4 py-2 mb-5 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-bold">🔥 PROMOÇÃO ESPECIAL — até 60% OFF em produtos selecionados</span>
          <div className="flex items-center gap-4 text-xs text-blue-100">
            <span>💳 Crédito</span>
            <span>💳 Débito</span>
            <span>📱 PIX</span>
            <span>📄 Boleto</span>
            <span className="text-yellow-300 font-semibold">📦 Frete grátis</span>
          </div>
        </div>

        {/* Category filter tabs */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelect={(cat) => { setSelectedCategory(cat); setSearchQuery(""); }}
        />

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory ? "Produtos da categoria" : "Todos os Produtos"}
          </h2>
          <span className="text-sm text-gray-500">{filteredProducts.length} produtos</span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onViewProduct={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-semibold">Nenhum produto encontrado</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory(null); }} className="mt-4 text-blue-700 hover:underline">
              Ver todos os produtos
            </button>
          </div>
        )}
      </main>

      <Footer />

      {cartOpen && (
        <CartSidebar cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onCheckout={handleCheckout} isCheckingOut={isCheckingOut} />
      )}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={(p) => { addToCart(p); setSelectedProduct(null); }} />
      )}
      <Toaster />
    </div>
  );
}