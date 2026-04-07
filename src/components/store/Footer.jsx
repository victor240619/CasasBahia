import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      {/* Formas de Pagamento */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h3 className="text-blue-700 font-bold text-sm mb-4">FORMAS DE PAGAMENTOS</h3>
        <div className="flex flex-wrap gap-10">
          {/* Cartões do Grupo */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Cartões do Grupo</p>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <img
                  src="https://www.casasbahia-imagens.com.br/html/footer/cartao-casas-bahia.png"
                  alt="Casas Bahia"
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="hidden w-12 h-10 bg-blue-700 rounded-md items-center justify-center"
                >
                  <span className="text-white text-[9px] font-bold text-center leading-tight">Casas Bahia</span>
                </div>
                <span className="text-[10px] text-gray-500">Casas Bahia</span>
              </div>
            </div>
          </div>

          {/* Outras Formas */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Outras formas</p>
            <div className="flex items-end gap-3">
              <div className="flex flex-col items-center gap-1">
                <img src="https://www.casasbahia-imagens.com.br/html/footer/banqi.png" alt="BanQi" className="h-10 w-auto"
                  onError={(e) => { e.target.src = "https://imgs.via.com.br/images/CasasBahia/mosaicos/b9bee7a0-ff26-45b0-a5cf-a0362a3bc689.png?imwidth=96"; }} />
                <span className="text-[10px] text-gray-500">BanQi</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <img src="https://www.casasbahia-imagens.com.br/html/footer/carne-digital.png" alt="Carnê Digital" className="h-10 w-auto"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/40x40/e53e3e/fff?text=CD"; }} />
                <span className="text-[10px] text-gray-500">Carnê Digital</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                {/* Pix icon */}
                <div className="w-10 h-10 rounded-md bg-teal-500 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L6.5 7.5L9 10L7 12L9 14L6.5 16.5L12 22L17.5 16.5L15 14L17 12L15 10L17.5 7.5L12 2Z"/>
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500">Pix</span>
              </div>
            </div>
          </div>

          {/* Crédito */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Crédito</p>
            <div className="flex items-center gap-2 flex-wrap">
              <img src="https://www.casasbahia-imagens.com.br/html/footer/visa.png" alt="Visa" className="h-6 w-auto"
                onError={(e) => { e.target.outerHTML = '<span class="text-xs font-bold text-blue-900 border border-gray-300 rounded px-1">VISA</span>'; }} />
              <img src="https://www.casasbahia-imagens.com.br/html/footer/mastercard.png" alt="Mastercard" className="h-6 w-auto"
                onError={(e) => { e.target.outerHTML = '<span class="text-xs font-bold text-red-600 border border-gray-300 rounded px-1">MC</span>'; }} />
              {/* Bandeiras de cartão como texto estilizado quando imagens falham */}
              {["Visa", "Mastercard", "Elo", "Amex", "Diners", "Hipercard", "Banrisul", "JCB"].map((flag) => (
                <span key={flag} className="text-[10px] font-bold text-gray-600 border border-gray-300 rounded px-1 py-0.5">{flag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Redes Sociais + App */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-6">
        {/* Redes Sociais */}
        <div>
          <h3 className="text-blue-700 font-bold text-sm mb-3">ACOMPANHE NAS REDES SOCIAIS</h3>
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a href="https://www.facebook.com/CasasBahia" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center hover:opacity-80">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* X (Twitter) */}
            <a href="https://twitter.com/CasasBahia" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:opacity-80">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/casasbahia" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center hover:opacity-80">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="white"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2"/></svg>
            </a>
            {/* YouTube */}
            <a href="https://www.youtube.com/CasasBahia" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center hover:opacity-80">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="black"/></svg>
            </a>
          </div>
        </div>

        {/* App Downloads */}
        <div>
          <h3 className="text-blue-700 font-bold text-sm mb-3">BAIXE O APP DAS CASAS BAHIA</h3>
          <div className="flex items-center gap-3">
            <a href="https://play.google.com/store/apps/details?id=br.com.casasbahia" target="_blank" rel="noopener noreferrer">
              <img
                src="https://www.casasbahia-imagens.com.br/html/footer/google-play.png"
                alt="Google Play"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.outerHTML = `<div class="h-10 bg-black rounded-lg px-3 flex items-center gap-2 cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3 20.5v-17c0-.83 1-1.3 1.7-.8l14 8.5c.67.4.67 1.4 0 1.8l-14 8.5C4 22.3 3 21.83 3 20.5z"/></svg><div><div style="font-size:9px;color:#aaa">DISPONÍVEL NO</div><div style="font-size:12px;color:white;font-weight:bold">Google Play</div></div></div>`;
                }}
              />
            </a>
            <a href="https://apps.apple.com/br/app/casas-bahia/id479693107" target="_blank" rel="noopener noreferrer">
              <img
                src="https://www.casasbahia-imagens.com.br/html/footer/app-store.png"
                alt="App Store"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.outerHTML = `<div class="h-10 bg-black rounded-lg px-3 flex items-center gap-2 cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg><div><div style="font-size:9px;color:#aaa">Baixar na</div><div style="font-size:12px;color:white;font-weight:bold">App Store</div></div></div>`;
                }}
              />
            </a>
          </div>
        </div>

        {/* Selos */}
        <div className="flex items-center gap-3">
          <div className="border border-gray-300 rounded-lg p-2 text-center w-20">
            <div className="bg-blue-700 text-white text-[9px] font-bold rounded px-1 py-0.5 mb-1">Confi</div>
            <div className="text-[9px] text-gray-600 leading-tight font-semibold">LOJA CONFIÁVEL</div>
            <div className="text-[8px] text-gray-500">GRUPO CASAS BAHIA</div>
            <div className="text-[8px] text-gray-400 mt-1">05-04-2026</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-green-600 font-semibold">🌿 consumidor</span>
            <span className="text-[9px] text-green-700 font-bold">gov.br</span>
          </div>
        </div>
      </div>

      {/* Barra azul inferior */}
      <div className="bg-blue-700 text-white text-xs px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-100 mb-1">
            Preços e condições exclusivos para o site www.casasbahia.com.br, podendo sofrer alterações sem prévia notificação.
          </p>
          <p className="font-semibold">
            Grupo Casas Bahia S.A. | Rua Florida, 1970 | São Paulo – SP | CEP: 04565-001 | CNPJ: 33.041.260/0652-90 | Inscrição Estadual: 133.091.229.115
          </p>
        </div>
      </div>
    </footer>
  );
}