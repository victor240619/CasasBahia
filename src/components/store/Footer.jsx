import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      {/* FORMAS DE PAGAMENTO */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b border-gray-100">
        <h3 className="text-blue-700 font-bold text-sm mb-4">FORMAS DE PAGAMENTOS</h3>

        <div className="flex flex-wrap gap-10">
          {/* Cartões do Grupo */}
          <div>
            <p className="text-xs text-gray-500 mb-2 font-semibold">Cartões do Grupo</p>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-[8px] font-bold text-center">CASAS<br/>BAHIA</span>
              </div>
              <span className="text-[10px] text-gray-500">Casas Bahia</span>
            </div>
          </div>

          {/* Outras formas */}
          <div>
            <p className="text-xs text-gray-500 mb-2 font-semibold">Outras formas</p>
            <div className="flex items-end gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">BQ</span>
                </div>
                <span className="text-[10px] text-gray-500">BanQi</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">CD</span>
                </div>
                <span className="text-[10px] text-gray-500">Carnê Digital</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">PIX</span>
                </div>
                <span className="text-[10px] text-gray-500">Pix</span>
              </div>
            </div>
          </div>

          {/* Crédito */}
          <div>
            <p className="text-xs text-gray-500 mb-2 font-semibold">Crédito</p>
            <div className="flex items-center gap-2 flex-wrap">
              {/* VISA */}
              <div className="bg-blue-800 text-white text-xs font-bold px-2 py-1 rounded">VISA</div>
              {/* Mastercard */}
              <div className="flex">
                <div className="w-5 h-5 bg-red-500 rounded-full opacity-90 -mr-2"></div>
                <div className="w-5 h-5 bg-yellow-400 rounded-full opacity-90"></div>
              </div>
              {/* ELO */}
              <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">elo</div>
              {/* Amex */}
              <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">AMEX</div>
              {/* Diners */}
              <div className="bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded">DINERS</div>
              {/* Hipercard */}
              <div className="bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded">hiper</div>
              {/* BanesCard */}
              <div className="bg-blue-900 text-white text-[10px] font-bold px-2 py-1 rounded">BANES</div>
              {/* JCB */}
              <div className="bg-green-700 text-white text-[10px] font-bold px-2 py-1 rounded">JCB</div>
            </div>
          </div>
        </div>
      </div>

      {/* CENTRAL DE VENDAS + ATENDIMENTO */}
      <div className="max-w-7xl mx-auto px-4 py-5 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-sm">
          {/* Central de Vendas */}
          <div>
            <h4 className="font-bold text-blue-700 text-xs mb-1">CENTRAL DE VENDAS</h4>
            <p className="text-xs text-gray-600">Compre pelo Whatsapp</p>
          </div>

          {/* Central de Atendimento */}
          <div>
            <h4 className="font-bold text-blue-700 text-xs mb-1">CENTRAL DE ATENDIMENTO</h4>
            <p className="text-xs text-gray-600">4003-4336 Fale pelo Whatsapp</p>
          </div>

          {/* Para RJ */}
          <div>
            <h4 className="font-bold text-blue-700 text-xs mb-1">PARA RJ E REGIÃO</h4>
            <p className="text-xs text-gray-600">0800-200-4336</p>
          </div>
        </div>
      </div>

      {/* PRODUTOS MAIS BUSCADOS */}
      <div className="max-w-7xl mx-auto px-4 py-5 border-b border-gray-100">
        <h3 className="text-blue-700 font-bold text-sm mb-3">PRODUTOS MAIS BUSCADOS</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {[
            "Air fryer", "Ar condicionado", "Armário de cozinha", "Bicicleta", "Cama", "Celular",
            "Celular Motorola", "Celular Samsung", "Colchão", "Computador", "Cooktop", "Fogão 4 bocas",
            "Fralda", "Geladeira", "Guarda roupa", "iPhone", "iPhone 11", "iPhone 12", "iPhone 13",
            "iPhone 14", "iPhone 15", "iPhone 15 Pro", "iPhone 16", "Liquidificador", "Máquina de lavar",
            "Microondas", "Notebook", "Pneu", "Pneu aro 13", "Rack", "Smart TV", "Smartphone",
            "Smartwatch", "Sofá", "Tanquinho", "Tênis", "TV", "Ventilador", "Xiaomi", "PS5", "Xbox",
            "S25", "Cafeteira", "Galaxy S24", "TV 50 4K", "TV 32 polegadas", "Umidificador de ar",
            "Bicicleta ergométrica", "Ar condicionado portátil", "Tablet"
          ].map((item, idx) => (
            <a key={idx} href="#" className="text-xs text-blue-700 hover:underline">
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* REDES SOCIAIS + APP + SELOS */}
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-6 border-b border-gray-100">
        {/* Redes Sociais */}
        <div>
          <h3 className="text-blue-700 font-bold text-sm mb-3">ACOMPANHE NAS REDES SOCIAIS</h3>
          <div className="flex gap-3">
            {/* Facebook */}
            <a href="#" className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-blue-700 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* X (Twitter) */}
            <a href="#" className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-gray-800 hover:bg-gray-50">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-pink-600 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.688.267 1.339.716 1.856 1.233.517.517.966 1.168 1.233 1.856.248.638.415 1.363.465 2.428.05 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.217 1.79-.465 2.428-.267.688-.716 1.339-1.233 1.856-.517.517-1.168.966-1.856 1.233-.638.248-1.363.415-2.428.465-1.066.05-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.217-2.428-.465-.688-.267-1.339-.716-1.856-1.233-.517-.517-.966-1.168-1.233-1.856-.248-.638-.415-1.363-.465-2.428-.05-1.066-.06-1.405-.06-4.122 0-2.717.01-3.056.06-4.122.05-1.065.217-1.79.465-2.428.267-.688.716-1.339 1.233-1.856.517-.517 1.168-.966 1.856-1.233.638-.248 1.363-.415 2.428-.465 1.066-.05 1.405-.06 4.122-.06zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>
            </a>
            {/* YouTube */}
            <a href="#" className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-red-600 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
            </a>
          </div>
        </div>

        {/* App Downloads */}
        <div>
          <h3 className="text-blue-700 font-bold text-sm mb-3">BAIXE O APP DAS CASAS BAHIA</h3>
          <div className="flex gap-3">
            <a href="#" className="block">
              <div className="bg-black text-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-900 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.24.99.2l12.5-12.5L13.2 8l-10 10c-.4.4-.6.96-.6 1.52v2.72c0 .58.22 1.12.58 1.52zM20.4 10.26l-2.26-1.3-3.22 3.22 3.22 3.22 2.28-1.32c.65-.38 1.04-1.06 1.04-1.82 0-.76-.41-1.42-1.06-1.8zM1.5.56C1.2.88 1 1.38 1 1.96v20.08c0 .58.2 1.08.5 1.4l.08.08L13.12 12 1.58.48 1.5.56zm11.7 10.72L1.68.76l12.5 12.5-1.98-1.98z"/></svg>
                <div>
                  <div className="text-[8px] text-gray-300 leading-none">DISPONÍVEL NO</div>
                  <div className="text-sm font-semibold leading-tight">Google Play</div>
                </div>
              </div>
            </a>
            <a href="#" className="block">
              <div className="bg-black text-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-900 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div>
                  <div className="text-[8px] text-gray-300 leading-none">Baixar na</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Selos */}
        <div className="flex items-center gap-3">
          <div className="border border-gray-200 rounded-lg p-2 text-center w-20">
            <div className="text-[8px] text-gray-400 font-semibold">CONFI</div>
            <div className="text-[10px] font-bold text-blue-700 leading-tight">LOJA CONFIÁVEL</div>
            <div className="text-[8px] text-gray-500 leading-tight">GRUPO CASAS BAHIA</div>
          </div>
          <div className="text-center border border-green-600 rounded-lg p-2">
            <div className="text-[10px] text-green-700 font-bold">consumidor</div>
            <div className="text-[8px] text-green-600">gov.br</div>
          </div>
        </div>
      </div>

      {/* LINKS INFORMATIVOS */}
      <div className="max-w-7xl mx-auto px-4 py-5 border-b border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-xs">
          {/* Meus Pedidos */}
          <div>
            <h4 className="font-bold text-blue-700 text-xs mb-2">MEUS PEDIDOS</h4>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:text-blue-700">Acompanhe seus pedidos</a></li>
              <li><a href="#" className="hover:text-blue-700">Editar cadastro</a></li>
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-bold text-blue-700 text-xs mb-2">MARKETPLACE</h4>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:text-blue-700">Cadastro</a></li>
              <li><a href="#" className="hover:text-blue-700">Venda seus produtos</a></li>
              <li><a href="#" className="hover:text-blue-700">Serviços</a></li>
            </ul>
          </div>

          {/* Casas Bahia */}
          <div>
            <h4 className="font-bold text-blue-700 text-xs mb-2">CASAS BAHIA</h4>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:text-blue-700">Quem somos</a></li>
              <li><a href="#" className="hover:text-blue-700">Serviços</a></li>
              <li><a href="#" className="hover:text-blue-700">Lista de Presentes</a></li>
              <li><a href="#" className="hover:text-blue-700">Trabalhe conosco</a></li>
              <li><a href="#" className="hover:text-blue-700">Blog Casas Bahia</a></li>
              <li><a href="#" className="hover:text-blue-700">Black Friday</a></li>
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h4 className="font-bold text-blue-700 text-xs mb-2">AJUDA</h4>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:text-blue-700">Mapa do Site</a></li>
              <li><a href="#" className="hover:text-blue-700">Atendimento em libras</a></li>
              <li><a href="#" className="hover:text-blue-700">Prazos e locais de entrega</a></li>
              <li><a href="#" className="hover:text-blue-700">Política de Troca e Devolução</a></li>
              <li><a href="#" className="hover:text-blue-700">Termos e Condições de Uso</a></li>
            </ul>
          </div>

          {/* Cartão */}
          <div>
            <h4 className="font-bold text-blue-700 text-xs mb-2">CARTÃO CASAS BAHIA</h4>
            <p className="text-gray-600 mb-2">Parcele suas compras em até 30x</p>
            <a href="#" className="text-blue-700 hover:underline font-semibold">Peça já o seu!</a>
          </div>
        </div>
      </div>

      {/* Bottom bar azul */}
      <div className="bg-blue-700 text-white px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-blue-100 mb-1">
            Preços e condições exclusivos para o site www.casasbahia.com.br, podendo sofrer alterações sem prévia notificação.
          </p>
          <p className="text-xs font-bold">
            Grupo Casas Bahia S.A. | Rua Florida, 1970 | São Paulo – SP | CEP: 04565-001 | CNPJ: 33.041.260/0652-90 | Inscrição Estadual: 133.091.229.115
          </p>
        </div>
      </div>
    </footer>
  );
}