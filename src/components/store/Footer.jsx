import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  meusPedidos: [
    "Acompanhar meu pedido",
    "Falar cadastro",
    "Lista de Presentes",
  ],
  casasBahia: [
    "Quem somos",
    "Serviços",
    "Trabalhe conosco",
    "Vende seus produtos",
    "Para empresas",
    "Blog Casas Bahia",
    "Black Friday",
    "Devolução Brasil",
  ],
  ajuda: [
    "Mapa do Site",
    "Atendimento on-line",
    "Prazo e formas de entrega",
    "Política de Trocas e Devolução",
    "Quantidade de itens por pedido",
    "Política de Privacidade",
    "Termos e Condições de Uso",
    "Segurança Digital",
  ],
  cartaoMais: [
    "Cartão Casas Bahia",
  ],
};

const productLinks = [
  "Air fryer", "Ar condicionado", "Armário de cozinha", "Bicicleta", "Cama", "Celular", "Celular Motorola", "Celular Samsung",
  "Cooktop", "Computador", "Notebook", "Fogão & louças", "Poltrona", "Rack", "iPhone", "Liquidificador",
  "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 15 Pro", "iPhone 16", "Smartphone",
  "Máquina de lavar", "Monitor", "Notebook", "Pneu", "Pneu art 13", "TV", "Smartwatch", "Sofa",
  "Smartwatch", "S25", "Tablet", "Televisão", "Tênis", "TV 4K", "TV 32 polegadas", "Umidificador de ar",
  "Ar condicionado portátil", "Tablet", "Calçados", "Galaxy S24",
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">

      {/* Samsung Week Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-black">Samsung Week</div>
            <div className="text-lg font-semibold">Seu novo Galaxy com</div>
            <div className="text-xl font-black text-yellow-300">ofertas imperdíveis</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="bg-yellow-400 text-blue-900 text-sm font-black px-2 py-0.5 rounded">12x</span>
              <span className="text-sm">sem juros</span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {[
              "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=80&h=80&fit=crop",
            ].map((src, i) => (
              <img key={i} src={src} alt="Samsung" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
            ))}
          </div>
          <button className="bg-yellow-400 text-blue-900 font-black px-5 py-2 rounded-lg hover:bg-yellow-300 transition-colors flex-shrink-0">
            Compre agora
          </button>
        </div>
      </div>

      {/* Central de vendas / atendimento */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="py-4 px-6 text-center">
            <div className="font-black text-gray-800 text-sm">CENTRAL DE VENDAS</div>
            <div className="text-xs text-gray-500">Converse pelo WhatsApp</div>
          </div>
          <div className="py-4 px-6 text-center">
            <div className="font-black text-gray-800 text-sm">CENTRAL DE ATENDIMENTO</div>
            <div className="text-xs text-gray-500">4003-4236 Fale pelo WhatsApp</div>
          </div>
          <div className="py-4 px-6 text-center">
            <div className="font-black text-gray-800 text-sm">PARA SUA REGIÃO</div>
            <div className="text-xs text-gray-500">0800-200-6236</div>
          </div>
        </div>
      </div>

      {/* Produtos mais buscados */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b border-gray-200">
        <h3 className="font-black text-gray-800 mb-3 text-sm">PRODUTOS MAIS BUSCADOS</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {productLinks.map((item, i) => (
            <span key={i} className="text-xs text-blue-700 hover:underline cursor-pointer">{item}</span>
          ))}
        </div>
      </div>

      {/* Glossário */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-b border-gray-200">
        <h3 className="font-black text-gray-800 mb-2 text-sm">GLOSSÁRIO</h3>
        <div className="flex flex-wrap gap-2">
          {alphabet.map((letter) => (
            <span key={letter} className="text-xs text-blue-700 hover:underline cursor-pointer font-semibold">{letter}</span>
          ))}
        </div>
        <button className="mt-3 border border-gray-300 text-xs px-4 py-1.5 rounded text-gray-600 hover:bg-gray-50">
          MAIS INFORMAÇÕES ▼
        </button>
      </div>

      {/* Main footer links */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Meus Pedidos */}
          <div>
            <h4 className="font-black text-gray-800 mb-3 text-sm">MEUS PEDIDOS</h4>
            <ul className="space-y-1.5">
              {footerLinks.meusPedidos.map((item, i) => (
                <li key={i}><span className="text-xs text-gray-600 hover:text-blue-700 cursor-pointer">{item}</span></li>
              ))}
            </ul>
            <h4 className="font-black text-gray-800 mb-3 mt-5 text-sm">MARKETPLACE</h4>
            <ul className="space-y-1.5">
              <li><span className="text-xs text-gray-600 hover:text-blue-700 cursor-pointer">Cadastro</span></li>
              <li><span className="text-xs text-gray-600 hover:text-blue-700 cursor-pointer">Venda seus produtos</span></li>
              <li><span className="text-xs text-gray-600 hover:text-blue-700 cursor-pointer">Serviços</span></li>
            </ul>
          </div>

          {/* Casas Bahia */}
          <div>
            <h4 className="font-black text-gray-800 mb-3 text-sm">CASAS BAHIA</h4>
            <ul className="space-y-1.5">
              {footerLinks.casasBahia.map((item, i) => (
                <li key={i}><span className="text-xs text-gray-600 hover:text-blue-700 cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h4 className="font-black text-gray-800 mb-3 text-sm">AJUDA</h4>
            <ul className="space-y-1.5">
              {footerLinks.ajuda.map((item, i) => (
                <li key={i}><span className="text-xs text-gray-600 hover:text-blue-700 cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>

          {/* Cartão + Formas de pagamento */}
          <div>
            <h4 className="font-black text-gray-800 mb-3 text-sm">CARTÃO CASAS BAHIA</h4>
            <p className="text-xs text-gray-600 mb-3">Parcele suas compras em até 30x</p>
            <button className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 mb-4">
              💳 Peça já o seu!
            </button>

            <h4 className="font-black text-gray-800 mb-2 text-sm">FORMAS DE PAGAMENTOS</h4>
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Cartão de Crédito</div>
              <div className="flex flex-wrap gap-1">
                {["VISA", "MC", "ELO", "AMEX", "HIPER", "DINERS"].map((card) => (
                  <span key={card} className="bg-gray-100 border border-gray-200 text-xs px-2 py-0.5 rounded font-bold text-gray-700">{card}</span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Outras formas</div>
              <div className="flex flex-wrap gap-1">
                {["PIX", "Boleto", "Carnê Digital"].map((m) => (
                  <span key={m} className="bg-gray-100 border border-gray-200 text-xs px-2 py-0.5 rounded font-bold text-gray-700">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social + Apps */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h4 className="font-black text-gray-800 mb-2 text-sm">ACOMPANHE NAS REDES SOCIAIS</h4>
            <div className="flex gap-3">
              <Facebook className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-500 hover:text-pink-600 cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-500 hover:text-blue-400 cursor-pointer" />
              <Youtube className="w-5 h-5 text-gray-500 hover:text-red-600 cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="font-black text-gray-800 mb-2 text-sm">BAIXE O APLICATIVO CASAS BAHIA</h4>
            <div className="flex gap-3">
              <div className="bg-black text-white rounded-lg px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-gray-800">
                <span className="text-lg">🍎</span>
                <div>
                  <div className="text-xs leading-none">Disponível na</div>
                  <div className="text-sm font-bold leading-none">App Store</div>
                </div>
              </div>
              <div className="bg-black text-white rounded-lg px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-gray-800">
                <span className="text-lg">▶</span>
                <div>
                  <div className="text-xs leading-none">Disponível no</div>
                  <div className="text-sm font-bold leading-none">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-50 border-t border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-gray-500 text-center mb-1">
            Preços e condições exclusivos para o site www.casasbahia.com.br, podendo sofrer alterações sem prévia notificação.
          </p>
          <p className="text-xs text-gray-400 text-center">
            Casas Bahia S.A. | Rua Florida, 1970 | São Paulo – SP | CNPJ 08.948-001 | CNPJ 33.041.260/0001-46 | Inscrição Estadual: 135.001.220.115
          </p>
        </div>
      </div>
    </footer>
  );
}