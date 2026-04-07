import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Header from "../components/store/Header";
import HeroBanner from "../components/store/HeroBanner";
import CategoryBar from "../components/store/CategoryBar";
import ProductCard from "../components/store/ProductCard";
import CartSidebar from "../components/store/CartSidebar";
import ProductModal from "../components/store/ProductModal";
import { products, getDiscountedPrice } from "../data/products";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Read category from URL
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
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    toast({ title: "Produto adicionado!", description: product.name, duration: 2000 });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const handleCheckout = async () => {
    // Check if in iframe
    if (window.self !== window.top) {
      alert("O checkout só funciona a partir do app publicado. Por favor, abra o app em uma nova aba.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const items = cart.map((item) => ({
        name: item.name,
        image: item.image,
        discountedPrice: getDiscountedPrice(item.originalPrice),
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
      toast({
        title: "Erro no checkout",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        onSearch={(q) => { setSearchQuery(q); setSelectedCategory(null); }}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero */}
        {!searchQuery && (
          <HeroBanner onCategorySelect={(cat) => { setSelectedCategory(cat); setSearchQuery(""); }} />
        )}

        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-2xl font-black">🔥 PROMOÇÃO ESPECIAL — 60% OFF</span>
            <p className="text-sm text-red-100 mt-1">Válido no Crédito, Débito, PIX ou Boleto</p>
          </div>
          <div className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold text-sm">
            ⏰ Entrega em até 30 dias
          </div>
        </div>

        {/* Categories */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelect={(cat) => { setSelectedCategory(cat); setSearchQuery(""); }}
        />

        {/* Results info */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory ? `Categoria selecionada` : "Todos os Produtos"}
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
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
              className="mt-4 text-blue-700 hover:underline"
            >
              Ver todos os produtos
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-3xl font-black mb-2">
            <span className="text-white">ASAS</span>
            <span className="text-red-400"> GUIAS</span>
          </div>
          <p className="text-blue-200 text-sm mb-4">Os melhores produtos com 60% de desconto</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-blue-300 mb-4">
            <span>💳 Crédito</span>
            <span>💳 Débito</span>
            <span>📱 PIX</span>
            <span>📄 Boleto</span>
          </div>
          <p className="text-xs text-blue-400">⚠️ Promoção especial: entrega em até 30 dias após confirmação do pagamento</p>
          <p className="text-xs text-blue-500 mt-2">© 2024 Asas Guias. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Cart */}
      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
          isCheckingOut={isCheckingOut}
        />
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => { addToCart(p); setSelectedProduct(null); }}
        />
      )}

      <Toaster />
    </div>
  );
}