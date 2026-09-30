export type UserRole = 'BUYER' | 'SELLER' | 'RIDER' | 'ADMIN';

export type SellerStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'APPROVED_UNPAID'
  | 'ACTIVE'
  | 'EXPIRED';

export type StoreStatus = 'INACTIVE' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'PENDING';

export type RiderApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type DeliveryStatus =
  | 'ORDER_CONFIRMED'
  | 'SELLER_PREPARING'
  | 'RIDER_ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export type BillingPeriod = 'HOURLY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type PaymentType =
  | 'STORE_SUBSCRIPTION'
  | 'GO_LIVE'
  | 'BOOST'
  | 'PRODUCT_ORDER'
  | 'DELIVERY_FEE';

export type PaymentMethod = 'MPESA_STK' | 'MPESA_TILL' | 'CASH_ON_DELIVERY' | 'WALLET';

export interface Location {
  id: string;
  name: string;
  county: string;
  status: 'ACTIVE' | 'COMING_SOON';
  deliveryBaseFee: number;
  activeStoresCount: number;
  activeRidersCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar: string;
  defaultLocationId: string;
  savedStoreIds: string[];
  followingSellerIds: string[];
  addresses: {
    id: string;
    label: string;
    town: string;
    landmark: string;
    phone: string;
    isDefault: boolean;
  }[];
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'STARTER' | 'BUSINESS' | 'GROWTH' | 'YEARLY' | 'POPUP_HOURLY';
  billingPeriod: BillingPeriod;
  priceKsh: number;
  durationLabel: string;
  maxProducts: number;
  features: string[];
  popular?: boolean;
  active?: boolean;
}

export interface GoLivePlan {
  id: string;
  name: string;
  durationHours: number;
  durationLabel: string;
  priceKsh: number;
  features: string[];
  popular?: boolean;
}

export interface BoostPlan {
  id: string;
  name: string;
  durationDays: number;
  durationLabel: string;
  priceKsh: number;
  placements: string[];
}

export interface Subscription {
  id: string;
  sellerId: string;
  storeId: string;
  planId: string;
  planName: string;
  billingPeriod: BillingPeriod;
  priceKsh: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  expiresAt: string;
}

export interface Seller {
  id: string;
  userId: string;
  personalName: string;
  businessName: string;
  email?: string;
  categoryId: string;
  locationId: string;
  town?: string;
  businessLocation?: string;
  description?: string;
  idVerification?: string;
  supportingDocumentName?: string;
  additionalInfo?: string;
  adminNotes?: string;
  history?: { date: string; action: string }[];
  phone: string;
  whatsapp: string;
  status: SellerStatus;
  storeId: string;
  subscriptionId?: string;
  goLiveAccessExpiresAt?: string;
  walletBalanceKsh: number;
  totalSalesKsh: number;
  joinedAt: string;
}

export interface Store {
  id: string;
  slug: string;
  sellerId: string;
  businessName: string;
  tagline: string;
  description: string;
  categoryId: string;
  categoryName: string;
  locationId: string;
  locationName: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  followersCount: number;
  openingHours: string;
  deliveryInfo: string;
  deliveryTimeEstimate: string;
  contactPhone: string;
  whatsappNumber: string;
  verified: boolean;
  status: StoreStatus;
  isLiveNow?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  categoryId: string;
  sellerId: string;
  storeId: string;
  storeName: string;
  storeSlug: string;
  location: string;
  locationId: string;
  unit: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  isDeal?: boolean;
  boostedUntil?: string;
  essentialTag?: 'STAPLE' | 'FRESH_PRODUCE' | 'HOUSEHOLD' | 'PROTEIN';
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK' | 'FLAGGED' | 'HIDDEN';
  createdAt: string;
  updatedAt: string;
}

export interface BasketItem {
  productId: string;
  product: Product;
  quantity: number;
  storeId: string;
  storeName: string;
  storeLocation: string;
  addedAt: string;
}

export interface Basket {
  items: BasketItem[];
  savedForLater: BasketItem[];
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  storeId: string;
  storeName: string;
}

export interface SellerOrder {
  id: string;
  storeId: string;
  storeName: string;
  sellerId: string;
  locationName: string;
  items: OrderItem[];
  subtotal: number;
  status: OrderStatus;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  items: OrderItem[];
  sellerOrders: SellerOrder[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  mpesaReceipt?: string;
  orderStatus: OrderStatus;
  deliveryStatus: DeliveryStatus;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  address: {
    town: string;
    landmark: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LiveComment {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface LiveSession {
  id: string;
  sellerId: string;
  storeId: string;
  storeName: string;
  storeSlug: string;
  sellerAvatar: string;
  locationName: string;
  title: string;
  subtitle: string;
  status: 'LIVE' | 'SCHEDULED' | 'ENDED';
  viewerCount: number;
  likesCount: number;
  coverImage: string;
  pinnedProductIds: string[];
  startedAt: string;
  endsAt: string;
  comments: LiveComment[];
}

export type PostType =
  | 'PRODUCT'
  | 'PROMOTION'
  | 'NEW_STOCK'
  | 'DISCOUNT'
  | 'ANNOUNCEMENT'
  | 'VIDEO'
  | 'IMAGE';

export interface Post {
  id: string;
  sellerId: string;
  storeId: string;
  storeName: string;
  storeSlug: string;
  storeLogo: string;
  locationName: string;
  type: PostType;
  badgeLabel: string;
  title: string;
  content: string;
  mediaUrl: string;
  linkedProductId?: string;
  likesCount: number;
  likedByMe?: boolean;
  comments: {
    id: string;
    userName: string;
    text: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface Rider {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  nationalId?: string;
  vehicleType: 'Boda Boda Motorcycle' | 'TukTuk Three-Wheeler' | 'Cargo Van';
  plateNumber: string;
  locationId: string;
  locationName: string;
  deliveryAreas?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  supportingDocumentName?: string;
  adminNotes?: string;
  approvalStatus?: RiderApprovalStatus;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
  rating: number;
  completedDeliveries: number;
  walletBalanceKsh: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  pickupStores: string[];
  pickupTown: string;
  dropoffLandmark: string;
  dropoffTown: string;
  customerName: string;
  customerPhone: string;
  payoutKsh: number;
  distanceKm: number;
  status: DeliveryStatus;
  assignedRiderId?: string;
  assignedRiderName?: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  reference: string;
  mpesaReceiptNumber: string;
  payerName: string;
  payerPhone: string;
  amountKsh: number;
  type: PaymentType;
  method: PaymentMethod;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  description: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  referencedProductName?: string;
  referencedOrderId?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: 'SELLER' | 'BUYER' | 'RIDER';
  storeId?: string;
  storeSlug?: string;
  locationName: string;
  unreadCount: number;
  lastMessage: string;
  updatedAt: string;
  messages: Message[];
}

export interface Notification {
  id: string;
  type:
    | 'NEW_ORDER'
    | 'ORDER_UPDATE'
    | 'NEW_MESSAGE'
    | 'SELLER_FOLLOWED'
    | 'LIVE_STARTED'
    | 'PROMOTION'
    | 'COMMENT'
    | 'SUBSCRIPTION_EXPIRY'
    | 'PAYMENT'
    | 'DELIVERY_UPDATE';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actionRoute?: string;
}

export interface Review {
  id: string;
  storeId: string;
  productId?: string;
  authorName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  discountPercent: number;
  storeId: string;
  storeName: string;
  locationName: string;
  validUntil: string;
  code?: string;
}

export interface Boost {
  id: string;
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  planId: string;
  planName: string;
  priceKsh: number;
  status: 'ACTIVE' | 'EXPIRED';
  startsAt: string;
  expiresAt: string;
}

export interface MarketplacePricingConfig {
  storePlans: SubscriptionPlan[];
  goLivePlans: GoLivePlan[];
  boostPlans: BoostPlan[];
  updatedAt: string;
}
