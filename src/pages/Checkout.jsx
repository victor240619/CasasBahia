import React, { useState, useEffect } from "react";
import { Heart, Share2, Star, CreditCard, Truck, Shield } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Header from "../components/store/Header";
import Footer from "../components/store/Footer";
import { getDiscountedPrice } from "../data/products";

export default function Checkout() {
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = sessionStorage.getItem("checkout_cart");
      if (storedCart) {
        return JSON.parse(storedCart);
      }
      const stored = localStorage.getItem("checkout_product");
      return stored ? [JSON.parse(stored)] : [];
    } catch {
      return [];
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [cep, setCep] = useState("74474-378");
  const [customer, setCustomer] = useState({ name: "", email: "" });

  useEffect(() => {
    const product = JSON.parse(sessionStorage.getItem("checkout_product") || "null");
    if (product) {
      setCart([{ ...product, qty: 1 }]);
      sessionStorage.removeItem("checkout_product");
    }
  }, []);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={0} onSearch={() => {}} onCartClick={() => {}} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Carrinho vazio. Volte e selecione um produto.</p>
          <a href="/" className="mt-4 inline-block text-blue-700 hover:underline">
            ← Voltar à loja
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const product = cart[0];
  const total = getDiscountedPrice(product) * product.qty;

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("O checkout só funciona a partir do app publicado.");
      return;
    }

    setIsProcessing(true);
    try {
      const items = [{
        name: product.name,
        image: product.image,
        discountedPrice: Math.max(getDiscountedPrice(product), 0.01),
        qty: product.qty,
      }];

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer,
          successUrl: `${window.location.origin}/sucesso?checkout=1`,
          cancelUrl: `${window.location.origin}/checkout`,
        }),
      });
      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data?.error || "URL de checkout Stripe nao recebida");
      }
    } catch (error) {
      toast({
        title: "Erro no checkout",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={1} onSearch={() => {}} onCartClick={() => {}} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left - Product Details */}
          <div className="col-span-2 space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex gap-4">
                <div className="w-72 h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {[product.image, product.image, product.image, product.image].map((img, i) => (
                    <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <button className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    +1
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Heart className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Smartphone</p>
                  <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-blue-700">12 avaliações</p>
                  <p className="text-sm text-gray-600">325 perguntas</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold text-green-700">Disponível a entrega via Casas Bahia</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-semibold">Frete grátis:</span> Parcele em até 12x de R$ {(total / 12).toFixed(2).replace(".", ",")}
                </p>
                <p>
                  <span className="font-semibold">Entrega:</span> Até 29 de abril
                </p>
              </div>
            </div>

            {/* More Products */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Características do produto</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold">Memória total:</span> 256GB</p>
                <p><span className="font-semibold">Tecnologia:</span> 4G</p>
                <p><span className="font-semibold">Cor:</span> Cinzento</p>
                <p><span className="font-semibold">Tamanho da tela:</span> 6.5 polegadas</p>
              </div>
            </div>
          </div>

          {/* Right - Checkout Sidebar */}
          <div className="col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-lg p-6 mb-4 sticky top-4">
              <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                Checkout Stripe producao
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm text-gray-400 line-through">
                    R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <p className="text-4xl font-bold text-blue-700">
                  R$ {total.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-sm text-green-600 font-semibold mt-1">
                  No PIX com 15% de desconto
                </p>
              </div>

              <div className="space-y-3 mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <input
                  value={customer.name}
                  onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Nome do comprador"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  value={customer.email}
                  onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))}
                  placeholder="email@cliente.com"
                  type="email"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-lg font-bold mb-2 transition-colors"
              >
                {isProcessing ? "Processando..." : "Comprar"}
              </button>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors">
                Retira Rápido
              </button>

              <a href="#" className="block text-center text-blue-700 text-sm font-semibold mt-3 hover:underline">
                Ver mais opções de pagamento ›
              </a>
            </div>

            {/* Card Offer */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
              <div className="flex items-start gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Cartão Casas Bahia</p>
                  <p className="text-xs text-gray-600 mt-1">Primeira compra ou há mais de 60 dias</p>
                </div>
              </div>
              <a href="#" className="text-xs text-blue-700 hover:underline">
                Conhecer oferta ›
              </a>
            </div>

            {/* Guaranteed */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Garantias e Proteções</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>Garantia do Produto</strong><br />
                    O Smartphone Motorola Moto G15 TelA6.7" 256GB 4G Câmera 50MP Grafite tem 12 meses de garantia.
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-lg p-4 mt-4 border border-gray-200">
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">Calcular frete e prazo de entrega</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="74474-378"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold text-sm">
                    Consultar
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Receba em 2h</p>
                    <p className="text-xs text-gray-600">Normal</p>
                  </div>
                  <span className="text-green-600 text-sm ml-auto">Grátis</span>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Receba em 3h</p>
                    <p className="text-xs text-gray-600">Recebera em 2h</p>
                  </div>
                  <span className="text-green-600 text-sm ml-auto">Grátis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
