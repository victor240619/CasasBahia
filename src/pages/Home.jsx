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
import SubscriptionPanel from "../components/store/SubscriptionPanel";
import { getDiscountedPrice } from "../data/products";
import Footer from "../components/store/Footer";
import { useShopState } from "../store/shopStore";

export default function Home() {
  const [shop] = useShopState();
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

  const products = shop.products.filter((product) => product.active ?? true);

  const filteredProducts = products.filter((p) => {
    const matchCat = !selectedCategory || p.category === selectedCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleProductClick = (product) => {
    const checkoutProduct = { ...product, qty: 1 };
    setCart([checkoutProduct]);
    sessionStorage.setItem("checkout_product", JSON.stringify(checkoutProduct));
    window.location.href = "/checkout";
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("O checkout só funciona a partir do app publicado. Por favor, abra o app em uma nova aba.");
      return;
    }
    
    // Validar carrinho
    if (!cart || cart.length === 0) {
      toast({ title: "Carrinho vazio", description: "Adicione produtos antes de finalizar.", variant: "destructive" });
      return;
    }

    setIsCheckingOut(true);
    try {
      const items = cart.map((item) => {
        const discountedPrice = getDiscountedPrice(item);
        return {
          name: item.name || "Produto sem nome",
          image: item.image || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop",
          discountedPrice: Math.max(discountedPrice, 0.01), // Mínimo 0.01
          qty: Math.max(item.qty || 1, 1),
        };
      });

      const payload = {
        items,
        successUrl: `${window.location.origin}/sucesso`,
        cancelUrl: `${window.location.origin}/`,
      };

      const response = await base44.functions.invoke("createCheckout", payload);
      
      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error(response?.data?.error || "URL de checkout não recebida");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      const errorMsg = error?.response?.data?.error || error.message || "Erro desconhecido";
      toast({ 
        title: "Erro no checkout", 
        description: errorMsg, 
        variant: "destructive" 
      });
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

        {!searchQuery && <SubscriptionPanel />}

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
              <div key={product.id} onClick={() => handleProductClick(product)} className="cursor-pointer">
                <ProductCard
                  product={product}
                  onAddToCart={() => {}}
                  onViewProduct={() => {}}
                />
              </div>
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
