const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// دالة لإنشاء slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

const seedDatabase = async () => {
  try {
    console.log('🔄 Starting database seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing products and orders');

    // Create or get users
    let adminUser = await User.findOne({ email: 'admin@store.com' });
    let johnUser = await User.findOne({ email: 'john@example.com' });

    if (!adminUser) {
      adminUser = new User({
        name: "Admin User",
        email: "admin@store.com",
        password: "admin123",
        role: "admin",
        phone: "+1234567890",
        address: {
          street: "123 Admin Street",
          city: "Tech City",
          country: "USA",
          zipCode: "10001"
        }
      });
      await adminUser.save();
      console.log('👤 Created admin user');
    }

    if (!johnUser) {
      johnUser = new User({
        name: "John Customer",
        email: "john@example.com",
        password: "customer123",
        role: "user",
        phone: "+1234567891",
        address: {
          street: "456 Customer Ave",
          city: "New York",
          country: "USA",
          zipCode: "10002"
        }
      });
      await johnUser.save();
      console.log('👤 Created John user');
    }

    console.log('💻 Creating sample products...');

    // Sample products - 40 منتج
    const sampleProducts = [
      {
        name: "MacBook Pro 16-inch",
        slug: generateSlug("MacBook Pro 16-inch"),
        description: "Powerful laptop with M3 Max chip for professionals. Features a stunning Liquid Retina XDR display and all-day battery life.",
        price: 3499.99,
        comparePrice: 3799.99,
        category: "electronics",
        subcategory: "computers",
        brand: "Apple",
        sku: "MBP16-M3MAX-001",
        featuredImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
        inventory: { quantity: 15, trackQuantity: true },
        attributes: [
          { name: "Processor", value: "M3 Max" },
          { name: "Memory", value: "36GB" },
          { name: "Storage", value: "1TB SSD" },
          { name: "Display", value: "16.2-inch Liquid Retina XDR" }
        ],
        tags: ["macbook", "laptop", "professional", "apple"],
        averageRating: 4.9,
        reviewCount: 256
      },
      {
        name: "Apple Watch Ultra 2",
        slug: generateSlug("Apple Watch Ultra 2"),
        description: "Rugged smartwatch for extreme adventures with advanced fitness tracking and cellular connectivity.",
        price: 799.99,
        comparePrice: 899.99,
        category: "electronics",
        subcategory: "wearables",
        brand: "Apple",
        sku: "WATCH-ULTRA2-002",
        featuredImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        inventory: { quantity: 25, trackQuantity: true },
        attributes: [
          { name: "Size", value: "49mm" },
          { name: "Material", value: "Titanium" },
          { name: "Features", value: "GPS, Cellular, Water Resistance" },
          { name: "Battery", value: "36 hours" }
        ],
        tags: ["apple", "smartwatch", "fitness", "adventure"],
        averageRating: 4.8,
        reviewCount: 189
      },
      {
        name: "Robot Vacuum Cleaner",
        slug: generateSlug("Robot Vacuum Cleaner"),
        description: "AI-powered vacuum with smart mapping, scheduling, and app control for effortless cleaning.",
        price: 499.99,
        comparePrice: 599.99,
        category: "home",
        subcategory: "appliances",
        brand: "CleanBot",
        sku: "ROBOT-VAC-PRO-003",
        featuredImage: "https://iotecheg.com/wp-content/uploads/2022/09/smart-vacuum-3.png",
        inventory: { quantity: 30, trackQuantity: true },
        attributes: [
          { name: "Features", value: "Mapping, Scheduling, App Control" },
          { name: "Battery", value: "120 minutes" },
          { name: "Suction", value: "2700 Pa" },
          { name: "Connectivity", value: "Wi-Fi, Bluetooth" }
        ],
        tags: ["vacuum", "robot", "smart-home", "cleaning"],
        averageRating: 4.6,
        reviewCount: 312
      },
      {
        name: "Adjustable Dumbbells Set",
        slug: generateSlug("Adjustable Dumbbells Set"),
        description: "Space-saving adjustable dumbbells with quick-change system for complete home workouts.",
        price: 299.99,
        comparePrice: 399.99,
        category: "sports",
        subcategory: "fitness",
        brand: "FitFlex",
        sku: "ADJ-DUMBBELL-SET-004",
        featuredImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop",
        inventory: { quantity: 20, trackQuantity: true },
        attributes: [
          { name: "Weight Range", value: "5-50 lbs per dumbbell" },
          { name: "Material", value: "Chrome-plated steel" },
          { name: "Space Saving", value: "Replaces 15+ dumbbells" },
          { name: "Warranty", value: "2 years" }
        ],
        tags: ["dumbbells", "fitness", "home-gym", "weights"],
        averageRating: 4.7,
        reviewCount: 167
      },
      {
        name: "The Psychology of Money",
        slug: generateSlug("The Psychology of Money"),
        description: "Timeless lessons on wealth, greed, and happiness from renowned financial expert Morgan Housel.",
        price: 16.99,
        comparePrice: 19.99,
        category: "media",
        subcategory: "books",
        brand: "Morgan Housel",
        sku: "PSYCHOLOGY-MONEY-005",
        featuredImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
        inventory: { quantity: 100, trackQuantity: true },
        attributes: [
          { name: "Format", value: "Hardcover" },
          { name: "Pages", value: "256" },
          { name: "Publisher", value: "Harriman House" },
          { name: "Language", value: "English" }
        ],
        tags: ["finance", "psychology", "self-help", "money"],
        averageRating: 4.7,
        reviewCount: 423
      },
      // المنتجات الجديدة من 6 إلى 40
      {
        name: "Samsung Galaxy S24 Ultra",
        slug: generateSlug("Samsung Galaxy S24 Ultra"),
        description: "Flagship smartphone with advanced camera system, S Pen, and powerful Snapdragon processor.",
        price: 1199.99,
        comparePrice: 1299.99,
        category: "electronics",
        subcategory: "phones",
        brand: "Samsung",
        sku: "SGS24-ULTRA-006",
        featuredImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
        inventory: { quantity: 45, trackQuantity: true },
        attributes: [
          { name: "Storage", value: "512GB" },
          { name: "RAM", value: "12GB" },
          { name: "Display", value: "6.8-inch Dynamic AMOLED" },
          { name: "Camera", value: "200MP Main Camera" }
        ],
        tags: ["smartphone", "android", "flagship", "samsung"],
        averageRating: 4.8,
        reviewCount: 289
      },
      {
        name: "Sony WH-1000XM5 Headphones",
        slug: generateSlug("Sony WH-1000XM5 Headphones"),
        description: "Industry-leading noise canceling headphones with exceptional sound quality and battery life.",
        price: 399.99,
        comparePrice: 449.99,
        category: "electronics",
        subcategory: "audio",
        brand: "Sony",
        sku: "SONY-XM5-007",
        featuredImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        inventory: { quantity: 35, trackQuantity: true },
        attributes: [
          { name: "Battery Life", value: "30 hours" },
          { name: "Noise Canceling", value: "Industry Leading" },
          { name: "Connectivity", value: "Bluetooth 5.2" },
          { name: "Weight", value: "250g" }
        ],
        tags: ["headphones", "wireless", "noise-canceling", "audio"],
        averageRating: 4.9,
        reviewCount: 512
      },
      {
        name: "Nintendo Switch OLED",
        slug: generateSlug("Nintendo Switch OLED"),
        description: "Gaming console with vibrant OLED screen, hybrid design for home and portable play.",
        price: 349.99,
        comparePrice: 399.99,
        category: "electronics",
        subcategory: "gaming",
        brand: "Nintendo",
        sku: "NSW-OLED-008",
        featuredImage: "https://images.unsplash.com/photo-1556009114-f6f6d3ad67d8?w=500&h=500&fit=crop",
        inventory: { quantity: 28, trackQuantity: true },
        attributes: [
          { name: "Screen", value: "7-inch OLED" },
          { name: "Storage", value: "64GB" },
          { name: "Battery Life", value: "4.5-9 hours" },
          { name: "Resolution", value: "720p Handheld, 1080p Docked" }
        ],
        tags: ["gaming", "console", "nintendo", "portable"],
        averageRating: 4.7,
        reviewCount: 423
      },
      {
        name: "Dell XPS 13 Laptop",
        slug: generateSlug("Dell XPS 13 Laptop"),
        description: "Ultra-thin laptop with InfinityEdge display, Intel Core i7 processor, and premium build quality.",
        price: 1299.99,
        comparePrice: 1499.99,
        category: "electronics",
        subcategory: "computers",
        brand: "Dell",
        sku: "DLL-XPS13-009",
        featuredImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
        inventory: { quantity: 22, trackQuantity: true },
        attributes: [
          { name: "Processor", value: "Intel Core i7" },
          { name: "RAM", value: "16GB" },
          { name: "Storage", value: "512GB SSD" },
          { name: "Display", value: "13.4-inch FHD+" }
        ],
        tags: ["laptop", "ultrabook", "dell", "premium"],
        averageRating: 4.6,
        reviewCount: 198
      },
      {
        name: "iPad Air 5th Generation",
        slug: generateSlug("iPad Air 5th Generation"),
        description: "Powerful tablet with M1 chip, Liquid Retina display, and support for Apple Pencil 2.",
        price: 599.99,
        comparePrice: 649.99,
        category: "electronics",
        subcategory: "tablets",
        brand: "Apple",
        sku: "IPAD-AIR5-010",
        featuredImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
        inventory: { quantity: 40, trackQuantity: true },
        attributes: [
          { name: "Chip", value: "Apple M1" },
          { name: "Storage", value: "64GB" },
          { name: "Display", value: "10.9-inch Liquid Retina" },
          { name: "Camera", value: "12MP Wide" }
        ],
        tags: ["tablet", "ipad", "apple", "creative"],
        averageRating: 4.8,
        reviewCount: 267
      },
      {
        name: "Canon EOS R5 Camera",
        slug: generateSlug("Canon EOS R5 Camera"),
        description: "Professional mirrorless camera with 45MP sensor, 8K video, and advanced autofocus.",
        price: 3899.99,
        comparePrice: 4299.99,
        category: "electronics",
        subcategory: "cameras",
        brand: "Canon",
        sku: "CANON-R5-011",
        featuredImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop",
        inventory: { quantity: 12, trackQuantity: true },
        attributes: [
          { name: "Sensor", value: "45MP Full Frame" },
          { name: "Video", value: "8K 30fps" },
          { name: "Autofocus", value: "Dual Pixel CMOS AF II" },
          { name: "Stabilization", value: "5-axis IBIS" }
        ],
        tags: ["camera", "mirrorless", "professional", "photography"],
        averageRating: 4.9,
        reviewCount: 89
      },
      {
        name: "PlayStation 5 Console",
        slug: generateSlug("PlayStation 5 Console"),
        description: "Next-gen gaming console with ultra-high speed SSD and immersive 4K gaming.",
        price: 499.99,
        comparePrice: 549.99,
        category: "electronics",
        subcategory: "gaming",
        brand: "Sony",
        sku: "PS5-CONSOLE-012",
        featuredImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
        inventory: { quantity: 18, trackQuantity: true },
        attributes: [
          { name: "Storage", value: "825GB SSD" },
          { name: "Resolution", value: "4K 120fps" },
          { name: "Ray Tracing", value: "Supported" },
          { name: "Controller", value: "DualSense Wireless" }
        ],
        tags: ["gaming", "console", "playstation", "4k"],
        averageRating: 4.8,
        reviewCount: 645
      },
      {
        name: "Bose QuietComfort Earbuds",
        slug: generateSlug("Bose QuietComfort Earbuds"),
        description: "True wireless earbuds with world-class noise cancellation and premium sound.",
        price: 279.99,
        comparePrice: 299.99,
        category: "electronics",
        subcategory: "audio",
        brand: "Bose",
        sku: "BOSE-QC-EAR-013",
        featuredImage: "https://i5.walmartimages.com/seo/Bose-QuietComfort-Earbuds-II-Noise-Cancelling-True-Wireless-Bluetooth-Headphones-Black_4a4b2e3c-73e4-4c61-b5f3-5862730f3afc.62cc75b31029c6237346aba6193ae2ac.jpeg",
        inventory: { quantity: 50, trackQuantity: true },
        attributes: [
          { name: "Battery Life", value: "6 hours" },
          { name: "Noise Canceling", value: "Advanced" },
          { name: "Water Resistance", value: "IPX4" },
          { name: "Connectivity", value: "Bluetooth 5.1" }
        ],
        tags: ["earbuds", "wireless", "noise-canceling", "bose"],
        averageRating: 4.7,
        reviewCount: 324
      },
      {
        name: "LG OLED C3 TV 65-inch",
        slug: generateSlug("LG OLED C3 TV 65-inch"),
        description: "Stunning OLED TV with perfect blacks, infinite contrast, and α9 Gen6 AI processor.",
        price: 1899.99,
        comparePrice: 2199.99,
        category: "electronics",
        subcategory: "tvs",
        brand: "LG",
        sku: "LG-OLED-C3-014",
        featuredImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop",
        inventory: { quantity: 15, trackQuantity: true },
        attributes: [
          { name: "Screen Size", value: "65-inch" },
          { name: "Resolution", value: "4K Ultra HD" },
          { name: "Refresh Rate", value: "120Hz" },
          { name: "Smart TV", value: "webOS 23" }
        ],
        tags: ["tv", "oled", "4k", "smart-tv"],
        averageRating: 4.9,
        reviewCount: 178
      },
      {
        name: "GoPro HERO12 Black",
        slug: generateSlug("GoPro HERO12 Black"),
        description: "Action camera with 5.3K video, HyperSmooth 6.0 stabilization, and waterproof design.",
        price: 399.99,
        comparePrice: 449.99,
        category: "electronics",
        subcategory: "cameras",
        brand: "GoPro",
        sku: "GOPRO-H12-015",
        featuredImage: "https://m.media-amazon.com/images/I/81RrX9Y+faL.jpg",
        inventory: { quantity: 35, trackQuantity: true },
        attributes: [
          { name: "Video Resolution", value: "5.3K60" },
          { name: "Stabilization", value: "HyperSmooth 6.0" },
          { name: "Waterproof", value: "33ft (10m)" },
          { name: "Battery Life", value: "2+ hours" }
        ],
        tags: ["action-camera", "sports", "waterproof", "gopro"],
        averageRating: 4.6,
        reviewCount: 267
      },
      {
        name: "Nike Air Force 1 '07",
        slug: generateSlug("Nike Air Force 1 '07"),
        description: "Classic basketball sneakers with durable leather construction and Air cushioning.",
        price: 110.00,
        comparePrice: 130.00,
        category: "fashion",
        subcategory: "shoes",
        brand: "Nike",
        sku: "NIKE-AF1-016",
        featuredImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        inventory: { quantity: 75, trackQuantity: true },
        attributes: [
          { name: "Material", value: "Leather" },
          { name: "Color", value: "White" },
          { name: "Size Range", value: "US 6-13" },
          { name: "Style", value: "Low Top" }
        ],
        tags: ["sneakers", "nike", "basketball", "casual"],
        averageRating: 4.5,
        reviewCount: 892
      },
      {
        name: "Adidas Ultraboost 22",
        slug: generateSlug("Adidas Ultraboost 22"),
        description: "Running shoes with Boost midsole technology and responsive cushioning for maximum energy return.",
        price: 180.00,
        comparePrice: 200.00,
        category: "sports",
        subcategory: "running",
        brand: "Adidas",
        sku: "ADIDAS-UB22-017",
        featuredImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
        inventory: { quantity: 60, trackQuantity: true },
        attributes: [
          { name: "Technology", value: "Boost Midsole" },
          { name: "Weight", value: "310g" },
          { name: "Drop", value: "10mm" },
          { name: "Best For", value: "Road Running" }
        ],
        tags: ["running", "sneakers", "adidas", "boost"],
        averageRating: 4.7,
        reviewCount: 456
      },
      {
        name: "Levi's 501 Original Jeans",
        slug: generateSlug("Levi's 501 Original Jeans"),
        description: "Iconic straight-fit jeans with button fly and timeless denim style.",
        price: 89.99,
        comparePrice: 99.99,
        category: "fashion",
        subcategory: "clothing",
        brand: "Levi's",
        sku: "LEVIS-501-018",
        featuredImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
        inventory: { quantity: 120, trackQuantity: true },
        attributes: [
          { name: "Fit", value: "Straight" },
          { name: "Material", value: "100% Cotton" },
          { name: "Closure", value: "Button Fly" },
          { name: "Wash", value: "Dark Stone" }
        ],
        tags: ["jeans", "denim", "levis", "casual"],
        averageRating: 4.4,
        reviewCount: 723
      },
      {
        name: "The North Face Jacket",
        slug: generateSlug("The North Face Jacket"),
        description: "Waterproof and breathable jacket with advanced thermal insulation for extreme conditions.",
        price: 299.99,
        comparePrice: 349.99,
        category: "fashion",
        subcategory: "outerwear",
        brand: "The North Face",
        sku: "TNF-JACKET-019",
        featuredImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
        inventory: { quantity: 40, trackQuantity: true },
        attributes: [
          { name: "Waterproof", value: "Yes" },
          { name: "Insulation", value: "ThermoBall Eco" },
          { name: "Hood", value: "Adjustable" },
          { name: "Pockets", value: "4" }
        ],
        tags: ["jacket", "waterproof", "outdoor", "winter"],
        averageRating: 4.8,
        reviewCount: 189
      },
      {
        name: "Rolex Submariner Watch",
        slug: generateSlug("Rolex Submariner Watch"),
        description: "Luxury diving watch with Oystersteel case, Cerachrom bezel, and automatic movement.",
        price: 8999.99,
        comparePrice: 9500.00,
        category: "fashion",
        subcategory: "watches",
        brand: "Rolex",
        sku: "ROLEX-SUB-020",
        featuredImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop",
        inventory: { quantity: 5, trackQuantity: true },
        attributes: [
          { name: "Material", value: "Oystersteel" },
          { name: "Water Resistance", value: "300m" },
          { name: "Movement", value: "Automatic" },
          { name: "Crystal", value: "Sapphire" }
        ],
        tags: ["luxury", "watch", "diving", "rolex"],
        averageRating: 4.9,
        reviewCount: 67
      },
      {
        name: "KitchenAid Stand Mixer",
        slug: generateSlug("KitchenAid Stand Mixer"),
        description: "Professional-grade stand mixer with 10-speed settings and multiple attachments.",
        price: 429.99,
        comparePrice: 499.99,
        category: "home",
        subcategory: "kitchen",
        brand: "KitchenAid",
        sku: "KITCHENAID-MIXER-021",
        featuredImage: "https://i5.walmartimages.com/seo/KitchenAid-Artisan-Series-Tilt-Head-5-qt-Stand-Mixer-Passion-Red-with-Flat-Beater-Dough-Hook-Whip_c15efb95-251c-408e-abef-41d00c82f5e5.1755c4c5eade3c80fb7c3aa39f2d6151.jpeg",
        inventory: { quantity: 25, trackQuantity: true },
        attributes: [
          { name: "Capacity", value: "5 Quart" },
          { name: "Power", value: "500W" },
          { name: "Speeds", value: "10" },
          { name: "Color", value: "Empire Red" }
        ],
        tags: ["mixer", "kitchen", "baking", "appliance"],
        averageRating: 4.8,
        reviewCount: 423
      },
      {
        name: "Dyson V15 Vacuum",
        slug: generateSlug("Dyson V15 Vacuum"),
        description: "Cordless vacuum with laser dust detection, powerful suction, and HEPA filtration.",
        price: 749.99,
        comparePrice: 799.99,
        category: "home",
        subcategory: "cleaning",
        brand: "Dyson",
        sku: "DYSON-V15-022",
        featuredImage: "https://m.media-amazon.com/images/I/61p+FdEl5UL.jpg",
        inventory: { quantity: 30, trackQuantity: true },
        attributes: [
          { name: "Suction Power", value: "230 AW" },
          { name: "Battery Life", value: "60 minutes" },
          { name: "Filtration", value: "Whole Machine HEPA" },
          { name: "Weight", value: "3kg" }
        ],
        tags: ["vacuum", "cordless", "dyson", "cleaning"],
        averageRating: 4.7,
        reviewCount: 289
      },
      {
        name: "Instant Pot Duo Plus",
        slug: generateSlug("Instant Pot Duo Plus"),
        description: "9-in-1 multi-use programmable pressure cooker with 48 safety features.",
        price: 129.99,
        comparePrice: 149.99,
        category: "home",
        subcategory: "kitchen",
        brand: "Instant Pot",
        sku: "INSTANT-POT-023",
        featuredImage: "https://images.unsplash.com/photo-1565402170291-8491f14678db?w=500&h=500&fit=crop",
        inventory: { quantity: 55, trackQuantity: true },
        attributes: [
          { name: "Capacity", value: "6 Quart" },
          { name: "Functions", value: "9-in-1" },
          { name: "Programs", value: "13 Smart Programs" },
          { name: "Material", value: "Stainless Steel" }
        ],
        tags: ["pressure-cooker", "kitchen", "cooking", "instant-pot"],
        averageRating: 4.6,
        reviewCount: 567
      },
      {
        name: "Vitamix 5200 Blender",
        slug: generateSlug("Vitamix 5200 Blender"),
        description: "Professional-grade blender with 2.2 HP motor and variable speed control.",
        price: 449.99,
        comparePrice: 499.99,
        category: "home",
        subcategory: "kitchen",
        brand: "Vitamix",
        sku: "VITAMIX-5200-024",
        featuredImage: "https://m.media-amazon.com/images/I/71LFQWt5nEL.jpg",
        inventory: { quantity: 20, trackQuantity: true },
        attributes: [
          { name: "Motor Power", value: "2.2 HP" },
          { name: "Capacity", value: "64 oz" },
          { name: "Speeds", value: "Variable 1-10" },
          { name: "Warranty", value: "7 years" }
        ],
        tags: ["blender", "kitchen", "smoothie", "vitamix"],
        averageRating: 4.9,
        reviewCount: 345
      },
      {
        name: "Nespresso VertuoPlus",
        slug: generateSlug("Nespresso VertuoPlus"),
        description: "Coffee machine with centrifusion technology for barista-quality coffee at home.",
        price: 199.99,
        comparePrice: 229.99,
        category: "home",
        subcategory: "kitchen",
        brand: "Nespresso",
        sku: "NESPRESSO-VP-025",
        featuredImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop",
        inventory: { quantity: 35, trackQuantity: true },
        attributes: [
          { name: "Technology", value: "Centrifusion" },
          { name: "Capsule System", value: "VertuoLine" },
          { name: "Water Tank", value: "54 oz" },
          { name: "Heat Up Time", value: "15 seconds" }
        ],
        tags: ["coffee", "machine", "nespresso", "espresso"],
        averageRating: 4.7,
        reviewCount: 278
      },
      {
        name: "Yoga Mat Premium",
        slug: generateSlug("Yoga Mat Premium"),
        description: "Non-slip yoga mat with extra cushioning and alignment lines for perfect poses.",
        price: 79.99,
        comparePrice: 99.99,
        category: "sports",
        subcategory: "yoga",
        brand: "Manduka",
        sku: "YOGA-MAT-026",
        featuredImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
        inventory: { quantity: 80, trackQuantity: true },
        attributes: [
          { name: "Thickness", value: "6mm" },
          { name: "Material", value: "PVC-free" },
          { name: "Size", value: "72 x 24 inches" },
          { name: "Weight", value: "2.2 kg" }
        ],
        tags: ["yoga", "fitness", "mat", "exercise"],
        averageRating: 4.5,
        reviewCount: 189
      },
      {
        name: "Wilson Pro Staff Tennis Racket",
        slug: generateSlug("Wilson Pro Staff Tennis Racket"),
        description: "Professional tennis racket used by champions, perfect for advanced players.",
        price: 249.99,
        comparePrice: 279.99,
        category: "sports",
        subcategory: "tennis",
        brand: "Wilson",
        sku: "WILSON-PS-027",
        featuredImage: "https://www.proracket.net/cdn/shop/files/W1siZiIsIjE2MDI0L3Byb2R1Y3RzLzM5NjgyMDk1LzE2NzY4ODU2MjlfM2RiN2IzOGRjNDhiYTFlMTFiMmEucG5nIl0sWyJwIiwidGh1bWIiLCI2MDB4NjAwIl1d_29ff9770-0e8f-4a50-acf4-b6af0288ea59.png?v=1683530708",
        inventory: { quantity: 25, trackQuantity: true },
        attributes: [
          { name: "Head Size", value: "97 sq in" },
          { name: "Weight", value: "315g" },
          { name: "Balance", value: "6 pts HL" },
          { name: "String Pattern", value: "16x19" }
        ],
        tags: ["tennis", "racket", "wilson", "sports"],
        averageRating: 4.8,
        reviewCount: 134
      },
      {
        name: "Basketball Spalding NBA",
        slug: generateSlug("Basketball Spalding NBA"),
        description: "Official NBA game basketball with premium leather and perfect grip.",
        price: 69.99,
        comparePrice: 79.99,
        category: "sports",
        subcategory: "basketball",
        brand: "Spalding",
        sku: "SPALDING-NBA-028",
        featuredImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=500&fit=crop",
        inventory: { quantity: 60, trackQuantity: true },
        attributes: [
          { name: "Size", value: "Official Size 7" },
          { name: "Material", value: "Composite Leather" },
          { name: "Weight", value: "22 oz" },
          { name: "Circumference", value: "29.5 inches" }
        ],
        tags: ["basketball", "nba", "sports", "spalding"],
        averageRating: 4.6,
        reviewCount: 267
      },
      {
        name: "Garmin Forerunner 955",
        slug: generateSlug("Garmin Forerunner 955"),
        description: "Advanced GPS running watch with training readiness and recovery monitoring.",
        price: 499.99,
        comparePrice: 549.99,
        category: "sports",
        subcategory: "fitness",
        brand: "Garmin",
        sku: "GARMIN-955-029",
        featuredImage: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop",
        inventory: { quantity: 30, trackQuantity: true },
        attributes: [
          { name: "Battery Life", value: "20 days" },
          { name: "GPS", value: "Multi-band" },
          { name: "Water Rating", value: "5 ATM" },
          { name: "Display", value: "1.3-inch Solar Charging" }
        ],
        tags: ["smartwatch", "fitness", "gps", "garmin"],
        averageRating: 4.7,
        reviewCount: 189
      },
      {
        name: "Harry Potter Book Set",
        slug: generateSlug("Harry Potter Book Set"),
        description: "Complete 7-book collection of the Harry Potter series in hardcover edition.",
        price: 129.99,
        comparePrice: 149.99,
        category: "media",
        subcategory: "books",
        brand: "Bloomsbury",
        sku: "HARRY-POTTER-030",
        featuredImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=500&h=500&fit=crop",
        inventory: { quantity: 45, trackQuantity: true },
        attributes: [
          { name: "Format", value: "Hardcover" },
          { name: "Books", value: "7 volumes" },
          { name: "Pages", value: "4100+ total" },
          { name: "Language", value: "English" }
        ],
        tags: ["books", "fantasy", "harry-potter", "collection"],
        averageRating: 4.9,
        reviewCount: 678
      },
      {
        name: "Sony PlayStation 5 Games Bundle",
        slug: generateSlug("Sony PlayStation 5 Games Bundle"),
        description: "Bundle of 5 popular PS5 games including Spider-Man 2 and God of War Ragnarok.",
        price: 299.99,
        comparePrice: 349.99,
        category: "media",
        subcategory: "games",
        brand: "Sony",
        sku: "PS5-BUNDLE-031",
        featuredImage: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=500&h=500&fit=crop",
        inventory: { quantity: 25, trackQuantity: true },
        attributes: [
          { name: "Games Included", value: "5" },
          { name: "Platform", value: "PlayStation 5" },
          { name: "Rating", value: "Mature" },
          { name: "Format", value: "Physical Discs" }
        ],
        tags: ["games", "ps5", "bundle", "entertainment"],
        averageRating: 4.8,
        reviewCount: 156
      },
      {
        name: "Apple AirPods Pro 2",
        slug: generateSlug("Apple AirPods Pro 2"),
        description: "Wireless earbuds with active noise cancellation and personalized spatial audio.",
        price: 249.99,
        comparePrice: 279.99,
        category: "electronics",
        subcategory: "audio",
        brand: "Apple",
        sku: "AIRPODS-PRO2-032",
        featuredImage: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop",
        inventory: { quantity: 65, trackQuantity: true },
        attributes: [
          { name: "Battery Life", value: "6 hours" },
          { name: "Noise Cancellation", value: "Active" },
          { name: "Connectivity", value: "Bluetooth 5.3" },
          { name: "Case", value: "MagSafe Charging" }
        ],
        tags: ["earbuds", "wireless", "apple", "noise-canceling"],
        averageRating: 4.8,
        reviewCount: 423
      },
      {
        name: "Samsung 49-inch Odyssey Monitor",
        slug: generateSlug("Samsung 49-inch Odyssey Monitor"),
        description: "Super ultrawide gaming monitor with 240Hz refresh rate and QLED technology.",
        price: 1299.99,
        comparePrice: 1499.99,
        category: "electronics",
        subcategory: "computers",
        brand: "Samsung",
        sku: "SAMSUNG-ODYSSEY-033",
        featuredImage: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop",
        inventory: { quantity: 15, trackQuantity: true },
        attributes: [
          { name: "Screen Size", value: "49-inch" },
          { name: "Resolution", value: "5120x1440" },
          { name: "Refresh Rate", value: "240Hz" },
          { name: "Panel", value: "QLED" }
        ],
        tags: ["monitor", "gaming", "ultrawide", "samsung"],
        averageRating: 4.7,
        reviewCount: 89
      },
      {
        name: "Microsoft Surface Laptop 5",
        slug: generateSlug("Microsoft Surface Laptop 5"),
        description: "Sleek laptop with touchscreen, Intel Evo platform, and premium aluminum build.",
        price: 1299.99,
        comparePrice: 1399.99,
        category: "electronics",
        subcategory: "computers",
        brand: "Microsoft",
        sku: "SURFACE-LAP5-034",
        featuredImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
        inventory: { quantity: 28, trackQuantity: true },
        attributes: [
          { name: "Processor", value: "Intel Core i7" },
          { name: "RAM", value: "16GB" },
          { name: "Storage", value: "512GB SSD" },
          { name: "Display", value: "13.5-inch PixelSense" }
        ],
        tags: ["laptop", "surface", "microsoft", "touchscreen"],
        averageRating: 4.6,
        reviewCount: 167
      },
      {
        name: "DJI Mavic 3 Drone",
        slug: generateSlug("DJI Mavic 3 Drone"),
        description: "Professional drone with Hasselblad camera, 46-minute flight time, and omnidirectional obstacle sensing.",
        price: 2199.99,
        comparePrice: 2499.99,
        category: "electronics",
        subcategory: "drones",
        brand: "DJI",
        sku: "DJI-MAVIC3-035",
        featuredImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop",
        inventory: { quantity: 12, trackQuantity: true },
        attributes: [
          { name: "Camera", value: "Hasselblad 4/3 CMOS" },
          { name: "Flight Time", value: "46 minutes" },
          { name: "Range", value: "15 km" },
          { name: "Obstacle Sensing", value: "Omnidirectional" }
        ],
        tags: ["drone", "camera", "dji", "photography"],
        averageRating: 4.9,
        reviewCount: 78
      },
      {
        name: "Amazon Echo Studio",
        slug: generateSlug("Amazon Echo Studio"),
        description: "Premium smart speaker with 3D audio and built-in Alexa voice assistant.",
        price: 199.99,
        comparePrice: 229.99,
        category: "electronics",
        subcategory: "smart-home",
        brand: "Amazon",
        sku: "ECHO-STUDIO-036",
        featuredImage: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=500&fit=crop",
        inventory: { quantity: 40, trackQuantity: true },
        attributes: [
          { name: "Audio", value: "3D Dolby Atmos" },
          { name: "Voice Assistant", value: "Alexa" },
          { name: "Connectivity", value: "Wi-Fi, Bluetooth" },
          { name: "Microphones", value: "6" }
        ],
        tags: ["smart-speaker", "alexa", "audio", "amazon"],
        averageRating: 4.5,
        reviewCount: 234
      },
      {
        name: "Razer BlackWidow Keyboard",
        slug: generateSlug("Razer BlackWidow Keyboard"),
        description: "Mechanical gaming keyboard with Razer Green switches and RGB Chroma lighting.",
        price: 149.99,
        comparePrice: 169.99,
        category: "electronics",
        subcategory: "gaming",
        brand: "Razer",
        sku: "RAZER-BW-037",
        featuredImage: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop",
        inventory: { quantity: 35, trackQuantity: true },
        attributes: [
          { name: "Switch Type", value: "Razer Green Mechanical" },
          { name: "Backlight", value: "RGB Chroma" },
          { name: "Anti-Ghosting", value: "N-Key Rollover" },
          { name: "Construction", value: "Aluminum" }
        ],
        tags: ["keyboard", "gaming", "mechanical", "razer"],
        averageRating: 4.7,
        reviewCount: 189
      },
      {
        name: "Logitech MX Master 3S",
        slug: generateSlug("Logitech MX Master 3S"),
        description: "Advanced wireless mouse with MagSpeed scrolling and multi-computer flow.",
        price: 99.99,
        comparePrice: 119.99,
        category: "electronics",
        subcategory: "computers",
        brand: "Logitech",
        sku: "LOGITECH-MX3S-038",
        featuredImage: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
        inventory: { quantity: 50, trackQuantity: true },
        attributes: [
          { name: "DPI", value: "8000" },
          { name: "Connectivity", value: "Bluetooth, USB" },
          { name: "Battery Life", value: "70 days" },
          { name: "Buttons", value: "7 programmable" }
        ],
        tags: ["mouse", "wireless", "logitech", "productivity"],
        averageRating: 4.8,
        reviewCount: 267
      },
      {
        name: "Apple iPad Pro 12.9-inch",
        slug: generateSlug("Apple iPad Pro 12.9-inch"),
        description: "Professional tablet with M2 chip, Liquid Retina XDR display, and ProMotion technology.",
        price: 1099.99,
        comparePrice: 1199.99,
        category: "electronics",
        subcategory: "tablets",
        brand: "Apple",
        sku: "IPAD-PRO-039",
        featuredImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
        inventory: { quantity: 22, trackQuantity: true },
        attributes: [
          { name: "Chip", value: "Apple M2" },
          { name: "Storage", value: "128GB" },
          { name: "Display", value: "12.9-inch Liquid Retina XDR" },
          { name: "Camera", value: "12MP Wide + 10MP Ultra Wide" }
        ],
        tags: ["tablet", "ipad", "pro", "creative"],
        averageRating: 4.9,
        reviewCount: 156
      },
      {
        name: "Bose SoundLink Speaker",
        slug: generateSlug("Bose SoundLink Speaker"),
        description: "Portable Bluetooth speaker with deep, loud sound and water-resistant design.",
        price: 129.99,
        comparePrice: 149.99,
        category: "electronics",
        subcategory: "audio",
        brand: "Bose",
        sku: "BOSE-SOUNDLINK-040",
        featuredImage: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
        inventory: { quantity: 45, trackQuantity: true },
        attributes: [
          { name: "Battery Life", value: "12 hours" },
          { name: "Water Resistance", value: "IP67" },
          { name: "Connectivity", value: "Bluetooth 4.2" },
          { name: "Weight", value: "1.2 lbs" }
        ],
        tags: ["speaker", "portable", "bluetooth", "bose"],
        averageRating: 4.6,
        reviewCount: 289
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`📦 Created ${createdProducts.length} products`);

    // Create sample order - مصحح نهائياً
    if (createdProducts.length >= 2) {
      // إنشاء order number يدوياً
      const timestamp = Date.now();
      const random = Math.random().toString(36).substr(2, 9).toUpperCase();
      const orderNumber = `ORD-${timestamp}-${random}`;

      const orderData = {
        orderNumber: orderNumber, // أضفنا order number يدوياً
        user: johnUser._id,
        items: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            price: createdProducts[0].price,
            quantity: 1,
            image: createdProducts[0].featuredImage
          },
          {
            product: createdProducts[1]._id,
            name: createdProducts[1].name,
            price: createdProducts[1].price,
            quantity: 2,
            image: createdProducts[1].featuredImage
          }
        ],
        totalAmount: createdProducts[0].price + (createdProducts[1].price * 2),
        shippingAddress: {
          name: johnUser.name,
          street: johnUser.address.street,
          city: johnUser.address.city,
          country: johnUser.address.country,
          zipCode: johnUser.address.zipCode,
          phone: johnUser.phone
        },
        billingAddress: {
          name: johnUser.name,
          street: johnUser.address.street,
          city: johnUser.address.city,
          country: johnUser.address.country,
          zipCode: johnUser.address.zipCode
        },
        paymentMethod: "credit_card",
        paymentStatus: "paid",
        orderStatus: "delivered",
        shippingMethod: "express",
        shippingCost: 12.99,
        taxAmount: 45.60,
        notes: "Sample order for testing"
      };

      const order = new Order(orderData);
      await order.save();

      console.log(`📋 Created sample order: ${order.orderNumber}`);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📝 Sample Login Credentials:');
    console.log('   Admin: admin@store.com / admin123');
    console.log('   User:  john@example.com / customer123');
    console.log('\n🌐 Test URLs:');
    console.log('   Health Check: http://localhost:5003/api/health');
    console.log('   Products:     http://localhost:5003/api/products');
    console.log('   Test Data:    http://localhost:5003/api/test-data');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('Error details:', error);
  }
};

module.exports = seedDatabase;