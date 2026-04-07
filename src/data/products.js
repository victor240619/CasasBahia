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
  // Smartphones
  { id: 1, name: "Samsung Galaxy S24 Ultra 256GB", category: "smartphones", originalPrice: 7999.99, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop", rating: 4.8, reviews: 1243 },
  { id: 2, name: "iPhone 15 Pro Max 256GB", category: "smartphones", originalPrice: 9499.99, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop", rating: 4.9, reviews: 2187 },
  { id: 3, name: "Motorola Edge 50 Pro 256GB", category: "smartphones", originalPrice: 3299.99, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop", rating: 4.5, reviews: 876 },
  { id: 4, name: "Xiaomi Redmi Note 13 Pro 256GB", category: "smartphones", originalPrice: 2199.99, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop", rating: 4.4, reviews: 654 },
  
  // TVs
  { id: 5, name: "Smart TV Samsung 65\" QLED 4K", category: "tvs", originalPrice: 6499.99, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop", rating: 4.7, reviews: 934 },
  { id: 6, name: "Smart TV LG 55\" OLED 4K", category: "tvs", originalPrice: 5799.99, image: "https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=400&h=400&fit=crop", rating: 4.8, reviews: 712 },
  { id: 7, name: "Smart TV Sony 50\" 4K Google TV", category: "tvs", originalPrice: 3999.99, image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop", rating: 4.6, reviews: 543 },
  { id: 8, name: "Smart TV TCL 43\" 4K QLED", category: "tvs", originalPrice: 1799.99, image: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop", rating: 4.3, reviews: 421 },

  // Eletrodomésticos
  { id: 9, name: "Geladeira Samsung Frost Free 460L", category: "eletrodomesticos", originalPrice: 4299.99, image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop", rating: 4.6, reviews: 876 },
  { id: 10, name: "Lavadora Electrolux 15kg Essential", category: "eletrodomesticos", originalPrice: 2899.99, image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop", rating: 4.5, reviews: 654 },
  { id: 11, name: "Air Fryer Philips Walita 5.7L Digital", category: "eletrodomesticos", originalPrice: 799.99, image: "https://images.unsplash.com/photo-1648711674751-9e1f1e08cac8?w=400&h=400&fit=crop", rating: 4.7, reviews: 2341 },
  { id: 12, name: "Micro-ondas Panasonic 32L Inverter", category: "eletrodomesticos", originalPrice: 1299.99, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop", rating: 4.4, reviews: 432 },
  { id: 13, name: "Fogão Brastemp 5 Bocas Inox", category: "eletrodomesticos", originalPrice: 2199.99, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", rating: 4.5, reviews: 765 },
  { id: 14, name: "Lava-louças Brastemp 14 Serviços", category: "eletrodomesticos", originalPrice: 3499.99, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", rating: 4.3, reviews: 321 },

  // Notebooks
  { id: 15, name: "Notebook Dell Inspiron 15 i7 16GB 512GB", category: "notebooks", originalPrice: 4999.99, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop", rating: 4.6, reviews: 543 },
  { id: 16, name: "MacBook Air M2 256GB 8GB", category: "notebooks", originalPrice: 9499.99, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", rating: 4.9, reviews: 1876 },
  { id: 17, name: "Notebook Lenovo IdeaPad 3 Ryzen 5 512GB", category: "notebooks", originalPrice: 2999.99, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop", rating: 4.4, reviews: 432 },
  { id: 18, name: "Notebook Acer Aspire 5 i5 16GB 512GB", category: "notebooks", originalPrice: 3499.99, image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop", rating: 4.5, reviews: 321 },

  // Móveis
  { id: 19, name: "Sofá Retrátil 3 Lugares Veludo", category: "moveis", originalPrice: 2499.99, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop", rating: 4.5, reviews: 654 },
  { id: 20, name: "Cama Box Casal Mola Ensacada", category: "moveis", originalPrice: 1899.99, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop", rating: 4.4, reviews: 432 },
  { id: 21, name: "Guarda-Roupa 6 Portas com Espelho", category: "moveis", originalPrice: 2299.99, image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&h=400&fit=crop", rating: 4.3, reviews: 321 },
  { id: 22, name: "Mesa de Jantar 6 Lugares Madeira", category: "moveis", originalPrice: 1699.99, image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=400&fit=crop", rating: 4.5, reviews: 213 },

  // Áudio
  { id: 23, name: "Fone Sony WH-1000XM5 Bluetooth", category: "audio", originalPrice: 2299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", rating: 4.9, reviews: 1543 },
  { id: 24, name: "Caixa de Som JBL Charge 5 Bluetooth", category: "audio", originalPrice: 999.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop", rating: 4.7, reviews: 876 },
  { id: 25, name: "Soundbar Samsung 2.1 Dolby Atmos", category: "audio", originalPrice: 1799.99, image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop", rating: 4.6, reviews: 432 },

  // Games
  { id: 26, name: "PlayStation 5 Sony 825GB", category: "games", originalPrice: 4499.99, image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=400&fit=crop", rating: 4.9, reviews: 3421 },
  { id: 27, name: "Xbox Series X 1TB Microsoft", category: "games", originalPrice: 4299.99, image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop", rating: 4.8, reviews: 2187 },
  { id: 28, name: "Nintendo Switch OLED 64GB", category: "games", originalPrice: 2799.99, image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop", rating: 4.8, reviews: 1876 },

  // Ar-Condicionado
  { id: 29, name: "Ar-Condicionado Split LG 12000 BTU Dual Inverter", category: "ar", originalPrice: 2899.99, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop", rating: 4.6, reviews: 543 },
  { id: 30, name: "Ar-Condicionado Split Samsung 9000 BTU Wind-Free", category: "ar", originalPrice: 2499.99, image: "https://images.unsplash.com/photo-1599839619487-5cbba0a1bc45?w=400&h=400&fit=crop", rating: 4.5, reviews: 432 },
];

export const getDiscountedPrice = (originalPrice) => {
  return originalPrice * 0.40; // 60% de desconto
};

export const getDiscountPercent = () => 60;