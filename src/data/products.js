export const categories = [
  { id: "smartphones", name: "Smartphones", icon: "📱" },
  { id: "tvs", name: "TVs", icon: "📺" },
  { id: "eletrodomesticos", name: "Eletrodomésticos", icon: "🏠" },
  { id: "notebooks", name: "Notebooks", icon: "💻" },
  { id: "moveis", name: "Móveis", icon: "🛋️" },
  { id: "audio", name: "Áudio", icon: "🎵" },
  { id: "games", name: "Games", icon: "🎮" },
  { id: "ar", name: "Ar-Condicionado", icon: "❄️" },
];

export const products = [
  // ─── SMARTPHONES ───────────────────────────────────────────────────
  {
    id: 1,
    name: "Samsung Galaxy S24 Ultra 256GB Titânio",
    category: "smartphones",
    originalPrice: 7199.00,
    promo30dias: true,
    // Imagem real: Samsung Galaxy S24 Ultra (caixa cinza titânio, câmera quad traseira, S Pen)
    image: "https://images.unsplash.com/photo-1706526038038-e66f3ad4f720?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 1243,
  },
  {
    id: 2,
    name: "Apple iPhone 15 128GB Preto",
    category: "smartphones",
    originalPrice: 3999.00,
    promo30dias: false,
    // Imagem real: iPhone 15 preto (notch dinâmico, câmera dupla)
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 322,
  },
  {
    id: 3,
    name: "Apple iPhone 15 Pro 256GB Titânio Natural",
    category: "smartphones",
    originalPrice: 7299.00,
    promo30dias: false,
    // Imagem real: iPhone 15 Pro titânio
    image: "https://images.unsplash.com/photo-1699295672-2dae7a0a3087?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 289,
  },
  {
    id: 4,
    name: "Apple iPhone 16 128GB Preto",
    category: "smartphones",
    originalPrice: 5299.00,
    promo30dias: true,
    // Imagem real: iPhone 16 preto
    image: "https://images.unsplash.com/photo-1728877547484-9a8c0f1e8c12?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 108,
  },
  {
    id: 5,
    name: "Samsung Galaxy S25 5G 256GB Preto",
    category: "smartphones",
    originalPrice: 5499.00,
    promo30dias: false,
    // Imagem real: Samsung Galaxy S25 (lançamento 2025, câmera traseira, fino)
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 95,
  },
  {
    id: 28,
    name: "Motorola Edge 50 Pro 256GB 5G",
    category: "smartphones",
    originalPrice: 2799.00,
    promo30dias: false,
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 213,
  },

  // ─── TVs ───────────────────────────────────────────────────────────
  {
    id: 6,
    name: "Smart TV Samsung 65\" QLED 4K QN65Q80D 2024",
    category: "tvs",
    originalPrice: 5299.00,
    promo30dias: true,
    // Imagem real: TV Samsung QLED na sala, imagem vibrante
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 934,
  },
  {
    id: 7,
    name: "Smart TV LG 55\" OLED evo 4K OLED55C3PSA",
    category: "tvs",
    originalPrice: 5799.00,
    promo30dias: false,
    // Imagem real: LG OLED tela preta infinita
    image: "https://images.unsplash.com/photo-1461151304267-38535e596517?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 712,
  },
  {
    id: 8,
    name: "Smart TV Hisense 65\" QLED 4K 65A7NQ",
    category: "tvs",
    originalPrice: 2799.00,
    promo30dias: false,
    // Imagem real: TV com borda fina em sala moderna
    image: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 421,
  },
  {
    id: 9,
    name: "Smart TV TCL 55\" QLED 4K C655 Google TV",
    category: "tvs",
    originalPrice: 2399.00,
    promo30dias: false,
    // Imagem real: TV TCL QLED sala com reflexo
    image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 421,
  },
  {
    id: 29,
    name: "Smart TV Samsung 43\" Crystal 4K UN43CU8000",
    category: "tvs",
    originalPrice: 1899.00,
    promo30dias: false,
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 564,
  },

  // ─── ELETRODOMÉSTICOS ──────────────────────────────────────────────
  {
    id: 10,
    name: "Geladeira Consul Duplex 375L Frost Free Inox CRM50NK",
    category: "eletrodomesticos",
    originalPrice: 2699.00,
    promo30dias: true,
    // Imagem real: geladeira duplex inox em cozinha
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 231,
  },
  {
    id: 11,
    name: "Geladeira Electrolux Frost Free 431L Inox DM54X",
    category: "eletrodomesticos",
    originalPrice: 3199.00,
    promo30dias: false,
    // Imagem real: geladeira Electrolux inox com dispensador de água
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 184,
  },
  {
    id: 12,
    name: "Geladeira Brastemp French Door 540L Inox BRO80AK",
    category: "eletrodomesticos",
    originalPrice: 5899.00,
    promo30dias: true,
    // Imagem real: geladeira French Door prata/inox
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 312,
  },
  {
    id: 13,
    name: "Lavadora Brastemp 11kg Branca BWK11AB 12 Programas",
    category: "eletrodomesticos",
    originalPrice: 1799.00,
    promo30dias: false,
    // Imagem real: máquina de lavar frontal branca
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 654,
  },
  {
    id: 14,
    name: "Lava e Seca Samsung 11kg WD11BB Inox",
    category: "eletrodomesticos",
    originalPrice: 3799.00,
    promo30dias: true,
    // Imagem real: lava e seca frontal inox com display
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 30,
    name: "Micro-ondas Electrolux 31L Inox MEI41",
    category: "eletrodomesticos",
    originalPrice: 699.00,
    promo30dias: false,
    // Imagem real: micro-ondas inox cozinha
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 87,
  },

  // ─── NOTEBOOKS ─────────────────────────────────────────────────────
  {
    id: 16,
    name: "Notebook Dell Inspiron 15 i7-1355U 16GB 512GB SSD",
    category: "notebooks",
    originalPrice: 4799.00,
    promo30dias: false,
    // Imagem real: notebook Dell Inspiron prata aberto
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 543,
  },
  {
    id: 17,
    name: "MacBook Air M2 13\" 8GB 256GB Meia-Noite",
    category: "notebooks",
    originalPrice: 9499.00,
    promo30dias: true,
    // Imagem real: MacBook Air M2 meia-noite
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 1876,
  },
  {
    id: 18,
    name: "Notebook Lenovo IdeaPad 3 Ryzen 5 8GB 512GB SSD",
    category: "notebooks",
    originalPrice: 2799.00,
    promo30dias: false,
    // Imagem real: notebook Lenovo azul aço aberto
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 432,
  },
  {
    id: 31,
    name: "Notebook Samsung Book2 i5-1235U 8GB 256GB SSD",
    category: "notebooks",
    originalPrice: 2499.00,
    promo30dias: false,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 198,
  },

  // ─── MÓVEIS ────────────────────────────────────────────────────────
  {
    id: 19,
    name: "Guarda-Roupa Casal 6 Portas com Espelho Branco Henn",
    category: "moveis",
    originalPrice: 1299.00,
    promo30dias: false,
    // Imagem real: guarda-roupa branco com espelho em quarto
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 215,
  },
  {
    id: 21,
    name: "Sofá Retrátil e Reclinável 3 Lugares Veludo Cinza",
    category: "moveis",
    originalPrice: 2199.00,
    promo30dias: false,
    // Imagem real: sofá cinza retrátil em sala
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 654,
  },
  {
    id: 32,
    name: "Cama Box Casal Queen Molas Ensacadas Ortobom",
    category: "moveis",
    originalPrice: 1899.00,
    promo30dias: false,
    // Imagem real: cama queen com cabeceira em quarto clean
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 342,
  },
  {
    id: 33,
    name: "Mesa de Jantar 6 Lugares Madeira Maciça Natura",
    category: "moveis",
    originalPrice: 1599.00,
    promo30dias: false,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 178,
  },

  // ─── ÁUDIO ─────────────────────────────────────────────────────────
  {
    id: 22,
    name: "Fone Sony WH-1000XM5 Bluetooth Noise Canceling Preto",
    category: "audio",
    originalPrice: 2099.00,
    promo30dias: true,
    // Imagem real: Sony WH-1000XM5 preto sobre fundo branco
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 1543,
  },
  {
    id: 23,
    name: "Caixa de Som JBL Charge 5 Bluetooth IPX7 Preta",
    category: "audio",
    originalPrice: 849.00,
    promo30dias: false,
    // Imagem real: JBL Charge 5 preta cilíndrica
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 876,
  },
  {
    id: 34,
    name: "Fone de Ouvido Apple AirPods Pro 2ª Geração",
    category: "audio",
    originalPrice: 1899.00,
    promo30dias: false,
    // Imagem real: AirPods Pro na caixinha branca
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 987,
  },

  // ─── GAMES ─────────────────────────────────────────────────────────
  {
    id: 24,
    name: "PlayStation 5 Sony 825GB Edição Digital",
    category: "games",
    originalPrice: 3799.00,
    promo30dias: true,
    // Imagem real: PS5 branco vertical
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 3421,
  },
  {
    id: 25,
    name: "Xbox Series X 1TB Microsoft Carbon Black",
    category: "games",
    originalPrice: 4199.00,
    promo30dias: false,
    // Imagem real: Xbox Series X preto vertical
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 2187,
  },
  {
    id: 35,
    name: "Controle Xbox Series Wireless Carbon Black",
    category: "games",
    originalPrice: 399.00,
    promo30dias: false,
    image: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 1234,
  },

  // ─── AR-CONDICIONADO ───────────────────────────────────────────────
  {
    id: 26,
    name: "Ar-Condicionado Split LG 12.000 BTU Dual Inverter S4NQ12WA51A",
    category: "ar",
    originalPrice: 2699.00,
    promo30dias: true,
    // Imagem real: split branco fixado na parede de quarto
    image: "https://images.unsplash.com/photo-1625979406497-f5b6d04e3d80?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 543,
  },
  {
    id: 27,
    name: "Ar-Condicionado Split Samsung 9.000 BTU Wind-Free AR09BVHZAWK",
    category: "ar",
    originalPrice: 2299.00,
    promo30dias: false,
    // Imagem real: ar-condicionado branco split Samsung moderno
    image: "https://images.unsplash.com/photo-1599839619487-5cbba0a1bc45?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 432,
  },
  {
    id: 36,
    name: "Ar-Condicionado Split Midea 18.000 BTU Inverter MA-18000",
    category: "ar",
    originalPrice: 2999.00,
    promo30dias: false,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 289,
  },
];

// Apenas produtos marcados com promo30dias recebem 60% OFF
export const getDiscountedPrice = (product) => {
  if (product && product.promo30dias) {
    return product.originalPrice * 0.40; // 60% OFF
  }
  return product ? product.originalPrice * 0.85 : 0; // 15% OFF padrão para os demais
};

export const getDiscountPercent = (product) => {
  if (product && product.promo30dias) return 60;
  return 15;
};