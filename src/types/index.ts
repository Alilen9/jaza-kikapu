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
  responseRate: number;
  followersCount: number;
  phone: string;
  subscriptionPlanId?: string;
  subscriptionStatus?: 'ACTIVE' | 'EXPIRED' | 'PENDING_PAYMENT';
  subscriptionCadence?: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  subscriptionExpiresAt?: string;
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
  product: Product;
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

export interface LiveSession {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  title: string;
  isLive: boolean;
  viewerCount: number;
  pinnedProductIds: string[];
  pinnedProducts?: Product[];
  streamVideoUrl: string;
  startedAt: string;
  comments?: LiveComment[];
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
  idNumber?: string;
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

export interface AdminAnalytics {
  totalUsers: number;
  totalStores: number;
  activeSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalGMV: number;
  platformCommission: number;
  liveStreamsActive: number;
  onlineRiders: number;
  openRequests: number;
  completedDeliveries: number;
}

export interface SellerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  storeId: string;
  role: 'SELLER';
}

export interface AuthResponse {
  user: SellerUser;
  store: Store;
  token?: string;
}

export type AppUserRole = 'BUYER' | 'SELLER' | 'RIDER' | 'ADMIN';
