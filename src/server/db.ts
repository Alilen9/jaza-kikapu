/**
 * JAZA KIKAPU - Relational In-Memory Database Engine
 * Implements real normalized tables, relations, and operations for Voi & Taita-Taveta marketplace.
 */

export interface Location {
  id: string;
  county: string;
  subCounty: string;
  town: string;
  area: string;
  marketName: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string;
  logoImage: string;
  locationId: string;
  marketName: string;
  stallNumber: string;
  isOpen: boolean;
  status: 'PENDING' | 'VERIFIED' | 'ACTIVE' | 'SUSPENDED';
  jazaScore: number;
  ordersCompleted: number;
  responseRate: number; // percentage
  followersCount: number;
  phone: string;
  subscriptionPlanId?: string;
}

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  category: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  unit: string;
  image: string;
  isAvailable: boolean;
  isTaitaLocal: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ParentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryArea: string;
  notes?: string;
  totalAmount: number;
  itemsSubtotal: number;
  deliveryFee: number;
  platformFee: number;
  status: 'PENDING' | 'PAYMENT_PENDING' | 'PAID' | 'SELLER_CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'RIDER_ASSIGNED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  mpesaReceiptNumber?: string;
  createdAt: string;
  sellerOrders: SellerOrder[];
}

export interface SellerOrder {
  id: string;
  parentOrderId: string;
  storeId: string;
  storeName: string;
  status: 'PENDING' | 'PAID' | 'PREPARING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'DELIVERED';
  subtotal: number;
  deliveryShare: number;
  commission: number;
  sellerNetEarnings: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

export interface MpesaPayment {
  checkoutRequestId: string;
  merchantRequestId: string;
  orderId: string;
  phone: string;
  amount: number;
  status: 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED';
  receiptNumber?: string;
  createdAt: string;
}

export interface LiveSession {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  title: string;
  isLive: boolean;
  viewerCount: number;
  pinnedProductIds: string[];
  streamVideoUrl: string;
  startedAt: string;
}

export interface LiveComment {
  id: string;
  liveSessionId: string;
  userName: string;
  message: string;
  isQuestion: boolean;
  timestamp: string;
}

export interface ProductRequest {
  id: string;
  buyerName: string;
  title: string;
  description: string;
  marketArea: string;
  maxBudget: number;
  status: 'OPEN' | 'FULFILLED';
  createdAt: string;
  responses: {
    id: string;
    storeId: string;
    storeName: string;
    offeredPrice: number;
    message: string;
    productId?: string;
    createdAt: string;
  }[];
}

export interface ShowMeRequest {
  id: string;
  storeId: string;
  storeName: string;
  productName: string;
  buyerName: string;
  question: string;
  status: 'PENDING' | 'ANSWERED';
  responseMedia?: string;
  responseText?: string;
  createdAt: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  isOnline: boolean;
  rating: number;
  totalDeliveries: number;
  walletBalance: number;
  currentZone: string;
}

export interface DeliveryJob {
  id: string;
  orderId: string;
  riderId?: string;
  riderName?: string;
  pickupStalls: string[];
  dropoffAddress: string;
  deliveryFee: number;
  riderEarnings: number;
  status: 'PENDING' | 'ASSIGNED' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  cadence: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  price: number;
  productLimit: number;
  canLiveStream: boolean;
  featuredPlacement: boolean;
  description: string;
}

export interface GroupBuyCampaign {
  id: string;
  productId: string;
  productName: string;
  storeName: string;
  image: string;
  standardPrice: number;
  tier1Price: number;
  tier1Target: number;
  tier2Price: number;
  tier2Target: number;
  currentParticipants: number;
  expiresInHours: number;
}

// Initial Database State with Authentic Voi & Taita-Taveta Data
export const locations: Location[] = [
  { id: 'loc-1', county: 'Taita-Taveta', subCounty: 'Voi', town: 'Voi Town', area: 'Central Business District', marketName: 'Voi Main Market' },
  { id: 'loc-2', county: 'Taita-Taveta', subCounty: 'Voi', town: 'Voi Town', area: 'Tsavo Junction', marketName: 'Tsavo Commercial Plaza' },
  { id: 'loc-3', county: 'Taita-Taveta', subCounty: 'Voi', town: 'Sofia', area: 'Sofia Market Center', marketName: 'Sofia Fresh Market' },
  { id: 'loc-4', county: 'Taita-Taveta', subCounty: 'Taveta', town: 'Taveta Town', area: 'Border Highway', marketName: 'Taveta Cross-Border Market' },
  { id: 'loc-5', county: 'Taita-Taveta', subCounty: 'Wundanyi', town: 'Wundanyi', area: 'Taita Hills', marketName: 'Wundanyi Farmers Market' },
  { id: 'loc-6', county: 'Taita-Taveta', subCounty: 'Mwatate', town: 'Mwatate', area: 'County HQ Road', marketName: 'Mwatate Central Market' },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  { id: 'plan-weekly', name: 'Weekly Market Pass', cadence: 'WEEKLY', price: 650, productLimit: 40, canLiveStream: true, featuredPlacement: false, description: 'Flexible 7-day stall access for Voi market days and pop-up sellers' },
  { id: 'plan-monthly', name: 'Digital Stall Premium (Monthly)', cadence: 'MONTHLY', price: 2200, productLimit: 150, canLiveStream: true, featuredPlacement: true, description: 'Full catalog, live broadcasts, priority Boda Boda pickup & customer Show Me requests' },
  { id: 'plan-yearly', name: 'Annual Merchant Enterprise (Yearly)', cadence: 'YEARLY', price: 20000, productLimit: 500, canLiveStream: true, featuredPlacement: true, description: 'Full 12 months access (Save KES 6,400 / 2 months free), top search ranking & verified badge' },
];

export const stores: Store[] = [
  {
    id: 'store-1',
    name: 'Mama Asha Boutique & Ankara',
    slug: 'mama-asha-boutique',
    category: 'Fashion & Apparel',
    description: 'Authentic Kenyan Ankara maxi dresses, kikoy wraps, Maasai beaded jewellery, and hand-tailored shirts in Voi Main Market.',
    coverImage: '/src/assets/images/stall_mama_asha_boutique_1790521933909.jpg',
    logoImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    locationId: 'loc-1',
    marketName: 'Voi Main Market',
    stallNumber: 'Stall B-14',
    isOpen: true,
    status: 'VERIFIED',
    jazaScore: 4.9,
    ordersCompleted: 248,
    responseRate: 98,
    followersCount: 1420,
    phone: '0712345001',
    subscriptionPlanId: 'plan-monthly',
  },
  {
    id: 'store-2',
    name: 'Taita Greens & Taveta Bananas',
    slug: 'taita-greens-taveta-bananas',
    category: 'Fresh Produce',
    description: 'Farm-fresh green bananas from Taveta, organic avocados, sweet passion fruits from Taita Hills, and crisp sukuma wiki harvested daily.',
    coverImage: '/src/assets/images/stall_taita_fresh_produce_1790521945401.jpg',
    logoImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    locationId: 'loc-1',
    marketName: 'Voi Main Market',
    stallNumber: 'Produce Shed 4',
    isOpen: true,
    status: 'VERIFIED',
    jazaScore: 4.8,
    ordersCompleted: 432,
    responseRate: 99,
    followersCount: 2180,
    phone: '0712345002',
    subscriptionPlanId: 'plan-monthly',
  },
  {
    id: 'store-3',
    name: 'Tsavo Tech & Mobile Accessories',
    slug: 'tsavo-tech-mobile',
    category: 'Electronics & Phones',
    description: 'Original smartphones (Samsung, Infinix, Tecno), fast chargers, heavy-duty power banks for Tsavo safaris, Bluetooth speakers & earphones.',
    coverImage: '/src/assets/images/stall_tsavo_electronics_1790521956567.jpg',
    logoImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    locationId: 'loc-2',
    marketName: 'Tsavo Commercial Plaza',
    stallNumber: 'Shop G-03',
    isOpen: true,
    status: 'VERIFIED',
    jazaScore: 4.7,
    ordersCompleted: 189,
    responseRate: 94,
    followersCount: 890,
    phone: '0712345003',
    subscriptionPlanId: 'plan-weekly',
  },
  {
    id: 'store-4',
    name: 'Kasigau Heritage Crafts & Sisal',
    slug: 'kasigau-heritage-crafts',
    category: 'Local Crafts & Living',
    description: 'Authentic Taita handwoven Kikapu sisal baskets, Tsavo raw organic honey, and wild-harvested herbal tea infusions.',
    coverImage: '/src/assets/images/jaza_voi_market_hero_1790521921384.jpg',
    logoImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    locationId: 'loc-5',
    marketName: 'Wundanyi Farmers Market',
    stallNumber: 'Heritage Stall 2',
    isOpen: true,
    status: 'VERIFIED',
    jazaScore: 5.0,
    ordersCompleted: 115,
    responseRate: 97,
    followersCount: 1650,
    phone: '0712345004',
    subscriptionPlanId: 'plan-yearly',
  },
  {
    id: 'store-5',
    name: 'Voi Hardware & General Store',
    slug: 'voi-hardware-store',
    category: 'Hardware & Tools',
    description: 'Cement, corrugated iron sheets, electrical wiring, solar floodlights, plumbing pipes, and heavy-duty hand tools.',
    coverImage: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80',
    logoImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    locationId: 'loc-1',
    marketName: 'Voi Main Market',
    stallNumber: 'Stall D-01',
    isOpen: true,
    status: 'ACTIVE',
    jazaScore: 4.6,
    ordersCompleted: 94,
    responseRate: 91,
    followersCount: 540,
    phone: '0712345005',
    subscriptionPlanId: 'plan-monthly',
  }
];

export const products: Product[] = [
  // Mama Asha Boutique
  {
    id: 'prod-1',
    storeId: 'store-1',
    storeName: 'Mama Asha Boutique & Ankara',
    category: 'Fashion & Apparel',
    name: 'Handcrafted Ankara Maxi Flare Dress',
    description: 'Vibrant yellow and terracotta floral print Ankara dress with breathable cotton lining, pocket inserts, and adjustable sash belt.',
    price: 2400,
    compareAtPrice: 2800,
    stockQuantity: 12,
    unit: 'dress',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: true,
  },
  {
    id: 'prod-2',
    storeId: 'store-1',
    storeName: 'Mama Asha Boutique & Ankara',
    category: 'Fashion & Apparel',
    name: 'Taita Handcrafted Beaded Brass Necklace',
    description: 'Authentic layered beadwork on pure hammered Kenyan brass wire, made by local artisan women in Voi.',
    price: 1200,
    compareAtPrice: 1500,
    stockQuantity: 20,
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: true,
  },
  {
    id: 'prod-3',
    storeId: 'store-1',
    storeName: 'Mama Asha Boutique & Ankara',
    category: 'Fashion & Apparel',
    name: 'Men’s Kitenge Collar Linen Shirt',
    description: 'Crisp navy linen casual short-sleeve shirt with an authentic Kitenge fabric collar accent. Tailored in Voi.',
    price: 1850,
    compareAtPrice: 2200,
    stockQuantity: 15,
    unit: 'shirt',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: true,
  },

  // Taita Greens
  {
    id: 'prod-4',
    storeId: 'store-2',
    storeName: 'Taita Greens & Taveta Bananas',
    category: 'Fresh Produce',
    name: 'Taveta Ripe Sweet Bananas (Fresh Bunch)',
    description: 'Naturally ripened, sun-drenched bananas straight from Taveta orchards. Sweet, rich in potassium, picked this morning.',
    price: 250,
    compareAtPrice: 300,
    stockQuantity: 45,
    unit: 'bunch',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: true,
  },
  {
    id: 'prod-5',
    storeId: 'store-2',
    storeName: 'Taita Greens & Taveta Bananas',
    category: 'Fresh Produce',
    name: 'Wundanyi Mountain Hass Avocados (5 Large)',
    description: 'Creamy, rich Hass avocados grown in the cool mountain climate of Wundanyi. Extra buttery texture.',
    price: 200,
    compareAtPrice: 250,
    stockQuantity: 60,
    unit: 'pack (5 pcs)',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: true,
  },
  {
    id: 'prod-6',
    storeId: 'store-2',
    storeName: 'Taita Greens & Taveta Bananas',
    category: 'Fresh Produce',
    name: 'Crisp Farm Sukuma Wiki (Collard Greens)',
    description: 'Freshly cut tender sukuma wiki leaves, washed and bundled ready for cooking the tastiest Kenyan dinner.',
    price: 50,
    stockQuantity: 100,
    unit: 'bundle',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: true,
  },

  // Tsavo Tech
  {
    id: 'prod-7',
    storeId: 'store-3',
    storeName: 'Tsavo Tech & Mobile Accessories',
    category: 'Electronics & Phones',
    name: 'Oraimo 20,000mAh Dual-Output Heavy Duty Power Bank',
    description: 'High capacity portable fast-charge power bank with LED battery display, ideal for long safari trips and power outages.',
    price: 2600,
    compareAtPrice: 3100,
    stockQuantity: 18,
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1609592426868-b7eb71887e5b?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: false,
  },
  {
    id: 'prod-8',
    storeId: 'store-3',
    storeName: 'Tsavo Tech & Mobile Accessories',
    category: 'Electronics & Phones',
    name: 'Type-C 65W Braided Fast-Charging Cable (2m)',
    description: 'Reinforced nylon-braided fast charging cable with tangle-free design and zinc alloy connectors.',
    price: 450,
    compareAtPrice: 600,
    stockQuantity: 40,
    unit: 'cable',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: false,
  },
  {
    id: 'prod-9',
    storeId: 'store-3',
    storeName: 'Tsavo Tech & Mobile Accessories',
    category: 'Electronics & Phones',
    name: 'Wireless Bluetooth Deep Bass Neckband Earphones',
    description: 'Magnetic earbuds with 28-hour playtime, sweatproof coating, and clear mic for mobile calls on the go.',
    price: 1350,
    compareAtPrice: 1700,
    stockQuantity: 22,
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: false,
  },

  // Kasigau Heritage
  {
    id: 'prod-10',
    storeId: 'store-4',
    storeName: 'Kasigau Heritage Crafts & Sisal',
    category: 'Local Crafts & Living',
    name: 'Signature Taita Handwoven Kikapu Sisal Tote',
    description: 'The iconic traditional Kikapu hand-plaited by artisan weavers of Kasigau. Natural sisal fibers with genuine leather shoulder handles.',
    price: 1650,
    compareAtPrice: 1950,
    stockQuantity: 25,
    unit: 'basket',
    image: '/src/assets/images/jaza_voi_market_hero_1790521921384.jpg',
    isAvailable: true,
    isTaitaLocal: true,
  },
  {
    id: 'prod-11',
    storeId: 'store-4',
    storeName: 'Kasigau Heritage Crafts & Sisal',
    category: 'Local Crafts & Living',
    name: 'Pure Tsavo Acacia Wild Blossom Honey (500g)',
    description: 'Raw, unpasteurized honey harvested from traditional hives bordering Tsavo National Park. Rich floral notes.',
    price: 750,
    stockQuantity: 34,
    unit: 'jar (500g)',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: true,
  },

  // Voi Hardware
  {
    id: 'prod-12',
    storeId: 'store-5',
    storeName: 'Voi Hardware & General Store',
    category: 'Hardware & Tools',
    name: 'Solar Security Floodlight 100W with Motion Sensor',
    description: 'Outdoor weatherproof solar LED security light with remote control and solar panel. Perfect for homes and farms in Voi.',
    price: 3200,
    compareAtPrice: 3800,
    stockQuantity: 14,
    unit: 'unit',
    image: 'https://images.unsplash.com/photo-1558441719-8b489c63f77a?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: false,
  }
];

export const liveSessions: LiveSession[] = [
  {
    id: 'live-1',
    storeId: 'store-1',
    storeName: 'Mama Asha Boutique & Ankara',
    storeLogo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    title: 'Showcasing New Ankara Maxi Cut Arrivals + Custom Sizing Q&A!',
    isLive: true,
    viewerCount: 68,
    pinnedProductIds: ['prod-1', 'prod-2'],
    streamVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-colorful-clothes-39906-large.mp4',
    startedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'live-2',
    storeId: 'store-2',
    storeName: 'Taita Greens & Taveta Bananas',
    storeLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'Morning Harvest from Taveta! Bananas & Avocados ready for today’s Kikapus',
    isLive: true,
    viewerCount: 42,
    pinnedProductIds: ['prod-4', 'prod-5'],
    streamVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-farmer-harvesting-fresh-produce-41584-large.mp4',
    startedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  }
];

export const liveComments: LiveComment[] = [
  { id: 'c-1', liveSessionId: 'live-1', userName: 'Faith Mwamburi', message: 'Hujambo Mama Asha! Can you show the waistline stitching on the yellow maxi?', isQuestion: true, timestamp: '2m ago' },
  { id: 'c-2', liveSessionId: 'live-1', userName: 'John Mghalu', message: 'Does the brass necklace come with matching earrings?', isQuestion: true, timestamp: '1m ago' },
  { id: 'c-3', liveSessionId: 'live-1', userName: 'Stacy Wanjiku', message: 'Just added the yellow maxi to my Kikapu! Cant wait for delivery in Voi town 🔥', isQuestion: false, timestamp: 'Just now' },
];

export const productRequests: ProductRequest[] = [
  {
    id: 'req-1',
    buyerName: 'Kevin Mwachofi',
    title: 'Samsung Galaxy A15 256GB Black or Navy',
    description: 'Looking for a brand new sealed Samsung A15 256GB with 1 year warranty. Need delivery near Voi Wildlife Lodge road today.',
    marketArea: 'Voi Town',
    maxBudget: 22000,
    status: 'OPEN',
    createdAt: '1 hour ago',
    responses: [
      {
        id: 'res-1',
        storeId: 'store-3',
        storeName: 'Tsavo Tech & Mobile Accessories',
        offeredPrice: 20500,
        message: 'Niko nayo dukani Tsavo Commercial Plaza! Sealed unit with 12 months official warranty. Can send with rider right now.',
        createdAt: '40m ago'
      }
    ]
  },
  {
    id: 'req-2',
    buyerName: 'Mercy Mkabili',
    title: '5 Bags of Bamburi Tembo Cement (50kg)',
    description: 'Building in Sofia area, need 5 bags delivered by noon with Boda/Tuk-Tuk.',
    marketArea: 'Sofia, Voi',
    maxBudget: 4200,
    status: 'OPEN',
    createdAt: '3 hours ago',
    responses: [
      {
        id: 'res-2',
        storeId: 'store-5',
        storeName: 'Voi Hardware & General Store',
        offeredPrice: 3950,
        message: 'Fresh stock available at Stall D-01! We have a dedicated Tuk-Tuk ready for Sofia delivery for KES 250 fee.',
        createdAt: '2 hours ago'
      }
    ]
  }
];

export const showMeRequests: ShowMeRequest[] = [
  {
    id: 'sm-1',
    storeId: 'store-1',
    storeName: 'Mama Asha Boutique & Ankara',
    productName: 'Handcrafted Ankara Maxi Flare Dress',
    buyerName: 'Lucy M.',
    question: 'Can you show me the red floral variant up close in natural light?',
    status: 'ANSWERED',
    responseMedia: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=600&q=80',
    responseText: 'Here is the red variant recorded right now on the mannequin! The sash matches the sleeve trim.',
    createdAt: '25m ago'
  }
];

export const riders: Rider[] = [
  { id: 'rider-1', name: 'Juma Mwasi', phone: '0722114455', vehicle: 'Boda Boda (Boxer 150)', plate: 'KMDH 432B', isOnline: true, rating: 4.9, totalDeliveries: 342, walletBalance: 4650, currentZone: 'Voi Market Hub' },
  { id: 'rider-2', name: 'Brian Mwashighadi', phone: '0733889922', vehicle: 'Tuk-Tuk Piaggio', plate: 'KTC 198X', isOnline: true, rating: 4.8, totalDeliveries: 512, walletBalance: 8200, currentZone: 'Sofia / Voi Central' },
  { id: 'rider-3', name: 'Sammy Chari', phone: '0711993344', vehicle: 'Boda Boda (TVS HLX)', plate: 'KMDF 871Z', isOnline: true, rating: 4.9, totalDeliveries: 198, walletBalance: 2900, currentZone: 'Tsavo Junction' },
];

export const deliveryJobs: DeliveryJob[] = [
  {
    id: 'del-101',
    orderId: 'ord-881',
    riderId: 'rider-1',
    riderName: 'Juma Mwasi',
    pickupStalls: ['Mama Asha Boutique (Stall B-14)', 'Taita Greens (Shed 4)'],
    dropoffAddress: 'Moi High School Voi Gate B, Voi',
    deliveryFee: 200,
    riderEarnings: 160,
    status: 'IN_TRANSIT',
    createdAt: '15m ago'
  }
];

export const groupBuyCampaigns: GroupBuyCampaign[] = [
  {
    id: 'gb-1',
    productId: 'prod-10',
    productName: 'Signature Taita Handwoven Kikapu Sisal Tote',
    storeName: 'Kasigau Heritage Crafts & Sisal',
    image: '/src/assets/images/jaza_voi_market_hero_1790521921384.jpg',
    standardPrice: 1650,
    tier1Price: 1400,
    tier1Target: 10,
    tier2Price: 1200,
    tier2Target: 25,
    currentParticipants: 18,
    expiresInHours: 6,
  },
  {
    id: 'gb-2',
    productId: 'prod-4',
    productName: 'Taveta Ripe Sweet Bananas (Fresh 5-Bunch Bulk Pack)',
    storeName: 'Taita Greens & Taveta Bananas',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    standardPrice: 1250,
    tier1Price: 1000,
    tier1Target: 8,
    tier2Price: 850,
    tier2Target: 20,
    currentParticipants: 12,
    expiresInHours: 4,
  }
];

// Active Orders storage
export const parentOrders: ParentOrder[] = [
  {
    id: 'ord-881',
    orderNumber: 'JK-VOI-2026-0881',
    customerName: 'Sarah Mwakio',
    customerPhone: '0712345678',
    deliveryAddress: 'Moi High School Voi Gate B',
    deliveryArea: 'Voi Town',
    totalAmount: 2850,
    itemsSubtotal: 2650,
    deliveryFee: 150,
    platformFee: 50,
    status: 'OUT_FOR_DELIVERY',
    mpesaReceiptNumber: 'QHK987123A',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    sellerOrders: [
      {
        id: 'so-1',
        parentOrderId: 'ord-881',
        storeId: 'store-1',
        storeName: 'Mama Asha Boutique & Ankara',
        status: 'PICKED_UP',
        subtotal: 2400,
        deliveryShare: 100,
        commission: 240,
        sellerNetEarnings: 2160,
        items: [
          {
            productId: 'prod-1',
            productName: 'Handcrafted Ankara Maxi Flare Dress',
            quantity: 1,
            price: 2400,
            image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80'
          }
        ]
      },
      {
        id: 'so-2',
        parentOrderId: 'ord-881',
        storeId: 'store-2',
        storeName: 'Taita Greens & Taveta Bananas',
        status: 'PICKED_UP',
        subtotal: 250,
        deliveryShare: 50,
        commission: 25,
        sellerNetEarnings: 225,
        items: [
          {
            productId: 'prod-4',
            productName: 'Taveta Ripe Sweet Bananas (Fresh Bunch)',
            quantity: 1,
            price: 250,
            image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80'
          }
        ]
      }
    ]
  }
];

export const mpesaTransactions: MpesaPayment[] = [
  {
    checkoutRequestId: 'ws_CO_27092026_881920',
    merchantRequestId: 'MR_881920_VOI',
    orderId: 'ord-881',
    phone: '254712345678',
    amount: 2850,
    status: 'SUCCESS',
    receiptNumber: 'QHK987123A',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  }
];
