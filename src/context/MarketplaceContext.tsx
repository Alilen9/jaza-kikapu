import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  BasketItem,
  Boost,
  Category,
  Conversation,
  Delivery,
  DeliveryStatus,
  LiveSession,
  Location,
  MarketplacePricingConfig,
  Notification,
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
  Post,
  Product,
  Review,
  Rider,
  RiderApprovalStatus,
  Seller,
  SellerStatus,
  Store,
  Subscription,
  User,
  UserRole,
} from '../types/marketplace';
import {
  adminService,
  authService,
  basketService,
  categoryService,
  liveService,
  locationService,
  messageService,
  notificationService,
  orderService,
  paymentService,
  postService,
  productService,
  reviewService,
  riderService,
  sellerService,
  storeService,
  subscriptionService,
} from '../services/marketplaceService';
import { ASSETS } from '../data/initialData';

export type AppRoute =
  | 'home'
  | 'explore'
  | 'stores'
  | 'store-detail'
  | 'product-detail'
  | 'live'
  | 'live-session'
  | 'deals'
  | 'kikapu'
  | 'messages'
  | 'notifications'
  | 'login'
  | 'dashboard'
  | 'seller-dashboard'
  | 'seller-onboarding'
  | 'rider-dashboard'
  | 'rider-onboarding'
  | 'admin';

export type AuthModalTab =
  | 'ROLE_SELECT_LOGIN'
  | 'ROLE_SELECT_SIGNUP'
  | 'BUYER_SIGNUP'
  | 'BUYER_LOGIN'
  | 'SELLER_LOGIN'
  | 'RIDER_LOGIN'
  | 'ADMIN_LOGIN';

export interface PrivateAdminAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleTitle: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone?: 'success' | 'info' | 'warning';
}

interface MarketplaceContextValue {
  // Navigation
  route: AppRoute;
  activeStoreSlug: string | null;
  activeProductId: string | null;
  activeLiveId: string | null;
  navigate: (
    nextRoute: AppRoute,
    params?: { storeSlug?: string; productId?: string; liveId?: string; categoryId?: string }
  ) => void;

  // Authentication & Role Flows
  user: User;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  authModalTab: AuthModalTab;
  authReason: string | null;
  lastRegisteredBuyerIdentifier: string;
  openAuthModal: (tab?: AuthModalTab, reason?: string) => void;
  closeAuthModal: () => void;
  signUpBuyer: (data: {
    name: string;
    phone: string;
    email: string;
    town: string;
    landmark: string;
    password?: string;
  }) => void;
  loginBuyer: (identifier: string, password?: string) => { ok: boolean; error?: string };
  loginSeller: (
    identifier: string,
    password?: string
  ) => { ok: boolean; error?: string; requiresSubscription?: boolean };
  loginRider: (identifier: string, password?: string) => { ok: boolean; error?: string };
  loginAdmin: (identifier: string, secretCode?: string) => { ok: boolean; error?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  toggleFollowSeller: (sellerId: string) => void;
  toggleSaveStore: (storeId: string) => void;

  // Active Seller & Rider Context
  activeSeller: Seller;
  activeSellerStore: Store;
  activeRider: Rider;
  privateAdmins: PrivateAdminAccount[];
  adminCreatePrivateAdmin: (name: string, email: string, phone: string, roleTitle: string) => void;

  // Global Filters & Search
  selectedLocationId: string | 'ALL';
  setSelectedLocationId: (locId: string | 'ALL') => void;
  selectedCategoryId: string | 'ALL';
  setSelectedCategoryId: (catId: string | 'ALL') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentLocationName: string;

  // Entities
  locations: Location[];
  categories: Category[];
  stores: Store[];
  products: Product[];
  sellers: Seller[];
  liveSessions: LiveSession[];
  posts: Post[];
  orders: Order[];
  deliveries: Delivery[];
  riders: Rider[];
  subscriptions: Subscription[];
  boosts: Boost[];
  payments: Payment[];
  conversations: Conversation[];
  notifications: Notification[];
  reviews: Review[];
  pricingConfig: MarketplacePricingConfig;

  // Kikapu (Multi-Seller Basket)
  basket: BasketItem[];
  savedForLater: BasketItem[];
  isKikapuDrawerOpen: boolean;
  setIsKikapuDrawerOpen: (open: boolean) => void;
  addToKikapu: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  updateKikapuQuantity: (productId: string, quantity: number) => void;
  removeFromKikapu: (productId: string) => void;
  saveItemForLater: (productId: string) => void;
  moveSavedToKikapu: (productId: string) => void;
  clearKikapu: () => void;
  kikapuSubtotal: number;
  kikapuDeliveryFee: number;
  kikapuTotal: number;
  kikapuItemCount: number;
  groupedKikapuByStore: {
    storeId: string;
    storeName: string;
    storeLocation: string;
    items: BasketItem[];
    storeSubtotal: number;
  }[];

  // Checkout & M-Pesa Payment
  checkoutKikapu: (params: {
    town: string;
    landmark: string;
    phone: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Promise<Order>;

  // Seller & Rider Applications + Operations
  applyToBecomeSeller: (data: {
    personalName: string;
    businessName: string;
    email?: string;
    categoryId: string;
    locationId: string;
    businessLocation?: string;
    description: string;
    idVerification?: string;
    supportingDocumentName?: string;
    additionalInfo?: string;
    phone: string;
    whatsapp: string;
  }) => Seller;
  applyToBecomeRider: (data: {
    name: string;
    phone: string;
    email?: string;
    nationalId: string;
    vehicleType: Rider['vehicleType'];
    plateNumber: string;
    locationId: string;
    deliveryAreas?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    supportingDocumentName?: string;
  }) => Rider;
  registerNewSellerAndStore: (data: {
    personalName: string;
    businessName: string;
    categoryId: string;
    locationId: string;
    description: string;
    phone: string;
    whatsapp: string;
    planId: string;
  }) => Promise<Store>;
  addOrUpdateProduct: (
    productData: Partial<Product> & { name: string; price: number; categoryId: string }
  ) => void;
  deleteProduct: (productId: string) => void;
  purchaseStoreSubscription: (planId: string, phone: string) => Promise<void>;
  purchaseGoLivePackage: (
    planId: string,
    phone: string,
    sessionTitle: string,
    sessionSubtitle: string,
    pinnedProductIds: string[]
  ) => Promise<LiveSession>;
  purchaseProductBoost: (productId: string, boostPlanId: string, phone: string) => Promise<void>;

  // Social Feed & Live Interactions
  toggleLikePost: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  createSellerPost: (data: {
    title: string;
    content: string;
    badgeLabel: string;
    linkedProductId?: string;
  }) => void;
  sendLiveComment: (liveId: string, text: string) => void;
  likeLiveSession: (liveId: string) => void;

  // Messaging & Notifications
  sendMessageToConversation: (
    conversationId: string,
    text: string,
    referencedProductName?: string
  ) => void;
  startConversationWithStore: (store: Store, product?: Product) => string;
  markAllNotificationsRead: () => void;
  addProductReview: (
    storeId: string,
    productId: string | undefined,
    rating: number,
    comment: string
  ) => void;

  // Rider Operations
  acceptDelivery: (deliveryId: string) => void;
  advanceDeliveryStage: (deliveryId: string) => void;

  // Admin Operations
  adminUpdatePricingConfig: (nextConfig: MarketplacePricingConfig) => void;
  adminSetSellerStatus: (sellerId: string, status: SellerStatus, adminNotes?: string) => void;
  adminRequestSellerInfo: (sellerId: string, note: string) => void;
  adminSetStoreStatus: (storeId: string, status: Store['status']) => void;
  adminSetProductStatus: (productId: string, status: Product['status']) => void;
  adminSetRiderApprovalStatus: (
    riderId: string,
    status: RiderApprovalStatus,
    adminNotes?: string
  ) => void;
  adminAddLocation: (loc: Omit<Location, 'id'>) => void;
  adminAddCategory: (name: string, description: string) => void;

  // Toasts
  toasts: ToastMessage[];
  pushToast: (title: string, description?: string, tone?: ToastMessage['tone']) => void;
  dismissToast: (id: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<AppRoute>('home');
  const [activeStoreSlug, setActiveStoreSlug] = useState<string | null>('mama-asha-boutique');
  const [activeProductId, setActiveProductId] = useState<string | null>('prod-1');
  const [activeLiveId, setActiveLiveId] = useState<string | null>('live-session-1');

  const [user, setUser] = useState<User>(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    authService.getIsAuthenticated()
  );
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('ROLE_SELECT_LOGIN');
  const [authReason, setAuthReason] = useState<string | null>(null);
  const [lastRegisteredBuyerIdentifier, setLastRegisteredBuyerIdentifier] = useState<string>('');
  const [pendingKikapuAction, setPendingKikapuAction] = useState<{
    product: Product;
    quantity: number;
    openDrawer: boolean;
  } | null>(null);
  const [activeSellerId, setActiveSellerId] = useState<string>('seller-1');
  const [activeRiderId, setActiveRiderId] = useState<string>('rider-1');
  const [privateAdmins, setPrivateAdmins] = useState<PrivateAdminAccount[]>([
    {
      id: 'admin-1',
      name: 'Taita-Taveta County Marketplace Director',
      email: 'admin@jazakikapu.co.ke',
      phone: '+254 700 000 001',
      roleTitle: 'Super Admin (Voi HQ)',
      createdAt: '2026-01-15',
    },
    {
      id: 'admin-2',
      name: 'Alice Mkangoma (Operations Lead)',
      email: 'mkangomaalice@gmail.com',
      phone: '+254 711 222 333',
      roleTitle: 'Regional Marketplace Admin',
      createdAt: '2026-03-10',
    },
  ]);

  const [selectedLocationId, setSelectedLocationId] = useState<string | 'ALL'>('ALL');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [locations, setLocations] = useState<Location[]>(() => locationService.getLocations());
  const [categories, setCategories] = useState<Category[]>(() => categoryService.getCategories());
  const [stores, setStores] = useState<Store[]>(() => storeService.getStores());
  const [products, setProducts] = useState<Product[]>(() => productService.getProducts());
  const [sellers, setSellers] = useState<Seller[]>(() => sellerService.getSellers());
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(() => liveService.getLiveSessions());
  const [posts, setPosts] = useState<Post[]>(() => postService.getPosts());
  const [orders, setOrders] = useState<Order[]>(() => orderService.getOrders());
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => riderService.getDeliveries());
  const [riders, setRiders] = useState<Rider[]>(() => riderService.getRiders());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() =>
    subscriptionService.getSubscriptions()
  );
  const [boosts, setBoosts] = useState<Boost[]>(() => subscriptionService.getBoosts());
  const [payments, setPayments] = useState<Payment[]>(() => paymentService.getPayments());
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    messageService.getConversations()
  );
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    notificationService.getNotifications()
  );
  const [reviews, setReviews] = useState<Review[]>(() => reviewService.getReviews());
  const [pricingConfig, setPricingConfig] = useState<MarketplacePricingConfig>(() =>
    subscriptionService.getPricingConfig()
  );

  const [basket, setBasket] = useState<BasketItem[]>(() => basketService.getBasket());
  const [savedForLater, setSavedForLater] = useState<BasketItem[]>(() =>
    basketService.getSavedForLater()
  );
  const [isKikapuDrawerOpen, setIsKikapuDrawerOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (
    title: string,
    description?: string,
    tone: ToastMessage['tone'] = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-2), { id, title, description, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const routeToPath = (r: AppRoute): string => {
    switch (r) {
      case 'home':
        return '/';
      case 'login':
        return '/login';
      case 'explore':
        return '/explore';
      case 'stores':
        return '/stores';
      case 'store-detail':
        return `/stores/${activeStoreSlug || 'mama-asha-boutique'}`;
      case 'product-detail':
        return `/products/${activeProductId || 'prod-1'}`;
      case 'live':
        return '/live';
      case 'live-session':
        return `/live/${activeLiveId || 'live-session-1'}`;
      case 'deals':
        return '/deals';
      case 'kikapu':
        return '/kikapu';
      case 'messages':
        return '/messages';
      case 'notifications':
        return '/notifications';
      case 'dashboard':
        return '/dashboard';
      case 'seller-onboarding':
        return '/seller/apply';
      case 'seller-dashboard':
        return '/seller/dashboard';
      case 'rider-onboarding':
        return '/rider/apply';
      case 'rider-dashboard':
        return '/rider/dashboard';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  const navigate = (
    nextRoute: AppRoute,
    params?: { storeSlug?: string; productId?: string; liveId?: string; categoryId?: string }
  ) => {
    if (params?.storeSlug) setActiveStoreSlug(params.storeSlug);
    if (params?.productId) setActiveProductId(params.productId);
    if (params?.liveId) setActiveLiveId(params.liveId);
    if (params?.categoryId !== undefined) setSelectedCategoryId(params.categoryId);

    // Role-based route protection for dashboard routes
    if (nextRoute === 'admin') {
      if (!isAuthenticated) {
        setAuthModalTab('ADMIN_LOGIN');
        setAuthReason('Please sign in with your private Admin credentials to access /admin.');
        setRoute('login');
        try {
          window.history.pushState({}, '', '/admin/login');
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (user.role !== 'ADMIN') {
        pushToast(
          'Access Denied: Admin Only',
          `Your ${user.role} account cannot access /admin. Redirected to your ${user.role} dashboard.`,
          'warning'
        );
        const fallbackRoute: AppRoute =
          user.role === 'SELLER'
            ? 'seller-dashboard'
            : user.role === 'RIDER'
            ? 'rider-dashboard'
            : 'dashboard';
        setRoute(fallbackRoute);
        try {
          window.history.pushState({}, '', routeToPath(fallbackRoute));
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (nextRoute === 'seller-dashboard') {
      if (!isAuthenticated) {
        setAuthModalTab('SELLER_LOGIN');
        setAuthReason('Please sign in with your approved Seller account to access /seller/dashboard.');
        setRoute('login');
        try {
          window.history.pushState({}, '', '/login');
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (user.role !== 'SELLER') {
        pushToast(
          'Access Denied: Seller Portal Only',
          `Your ${user.role} account cannot access /seller/dashboard.`,
          'warning'
        );
        const fallbackRoute: AppRoute =
          user.role === 'ADMIN'
            ? 'admin'
            : user.role === 'RIDER'
            ? 'rider-dashboard'
            : 'dashboard';
        setRoute(fallbackRoute);
        try {
          window.history.pushState({}, '', routeToPath(fallbackRoute));
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (nextRoute === 'rider-dashboard') {
      if (!isAuthenticated) {
        setAuthModalTab('RIDER_LOGIN');
        setAuthReason('Please sign in with your approved Jaza Rider account to access /rider/dashboard.');
        setRoute('login');
        try {
          window.history.pushState({}, '', '/login');
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (user.role !== 'RIDER') {
        pushToast(
          'Access Denied: Jaza Rider Portal Only',
          `Your ${user.role} account cannot access /rider/dashboard.`,
          'warning'
        );
        const fallbackRoute: AppRoute =
          user.role === 'ADMIN'
            ? 'admin'
            : user.role === 'SELLER'
            ? 'seller-dashboard'
            : 'dashboard';
        setRoute(fallbackRoute);
        try {
          window.history.pushState({}, '', routeToPath(fallbackRoute));
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (nextRoute === 'dashboard') {
      if (!isAuthenticated) {
        setAuthModalTab('BUYER_LOGIN');
        setAuthReason('Please sign in or create a Buyer account to access your Buyer dashboard.');
        setRoute('login');
        try {
          window.history.pushState({}, '', '/login');
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (user.role !== 'BUYER') {
        const fallbackRoute: AppRoute =
          user.role === 'SELLER'
            ? 'seller-dashboard'
            : user.role === 'RIDER'
            ? 'rider-dashboard'
            : 'admin';
        setRoute(fallbackRoute);
        try {
          window.history.pushState({}, '', routeToPath(fallbackRoute));
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setRoute(nextRoute);
    try {
      window.history.pushState({}, '', routeToPath(nextRoute));
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const syncFromLocation = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/login') {
        setAuthModalTab('ROLE_SELECT_LOGIN');
        setRoute('login');
      } else if (path === '/signup') {
        setAuthModalTab('ROLE_SELECT_SIGNUP');
        setRoute('login');
      } else if (path === '/admin/login') {
        setAuthModalTab('ADMIN_LOGIN');
        setRoute('login');
      } else if (path === '/seller/apply') {
        setRoute('seller-onboarding');
      } else if (path === '/seller/dashboard') {
        navigate('seller-dashboard');
      } else if (path === '/rider/apply') {
        setRoute('rider-onboarding');
      } else if (path === '/rider/dashboard') {
        navigate('rider-dashboard');
      } else if (path.startsWith('/admin')) {
        navigate('admin');
      } else if (path === '/dashboard') {
        navigate('dashboard');
      } else if (path === '/explore') {
        setRoute('explore');
      } else if (path === '/stores') {
        setRoute('stores');
      } else if (path === '/live') {
        setRoute('live');
      } else if (path === '/deals') {
        setRoute('deals');
      } else if (path === '/kikapu') {
        setRoute('kikapu');
      }
    };
    syncFromLocation();
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, [isAuthenticated, user.role]);

  const activeSeller = useMemo(
    () => sellers.find((s) => s.id === activeSellerId) || sellers[0],
    [sellers, activeSellerId]
  );

  const activeSellerStore = useMemo(
    () => stores.find((st) => st.id === activeSeller?.storeId) || stores[0],
    [stores, activeSeller]
  );

  const activeRider = useMemo(
    () => riders.find((r) => r.id === activeRiderId) || riders[0],
    [riders, activeRiderId]
  );

  const openAuthModal = (tab: AuthModalTab = 'ROLE_SELECT_LOGIN', reason?: string) => {
    setAuthModalTab(tab);
    setAuthReason(reason || null);
    setAuthModalOpen(false);
    setRoute('login');
    try {
      const targetPath =
        tab === 'ROLE_SELECT_SIGNUP' || tab === 'BUYER_SIGNUP'
          ? '/signup'
          : tab === 'ADMIN_LOGIN'
          ? '/admin/login'
          : '/login';
      window.history.pushState({}, '', targetPath);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthReason(null);
  };

  const executeAddToKikapu = (product: Product, quantity = 1, openDrawer = false) => {
    setBasket((prev) => {
      const idx = prev.findIndex((item) => item.productId === product.id);
      let next: BasketItem[];
      if (idx > -1) {
        next = prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        next = [
          ...prev,
          {
            productId: product.id,
            product,
            quantity,
            storeId: product.storeId,
            storeName: product.storeName,
            storeLocation: product.location,
            addedAt: new Date().toISOString(),
          },
        ];
      }
      return basketService.saveBasket(next);
    });
    pushToast(
      `Added ${product.name} to Kikapu`,
      `From ${product.storeName} · KSh ${(product.price * quantity).toLocaleString()}`
    );
    if (openDrawer) setIsKikapuDrawerOpen(true);
  };

  const signUpBuyer = (data: {
    name: string;
    phone: string;
    email: string;
    town: string;
    landmark: string;
    password?: string;
  }) => {
    const newUser: User = {
      id: `user-buyer-${Date.now()}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      role: 'BUYER',
      avatar: ASSETS.kitengeDressImg,
      defaultLocationId: 'loc-voi',
      savedStoreIds: [],
      followingSellerIds: [],
      addresses: [
        {
          id: `addr-${Date.now()}`,
          label: `Home — ${data.town}`,
          town: data.town,
          landmark: data.landmark || `${data.town} Town Stage`,
          phone: data.phone.trim(),
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const existing = authService.getRegisteredUsers();
    authService.saveRegisteredUsers([newUser, ...existing]);
    authService.updateUser(newUser);
    setUser(newUser);
    setLastRegisteredBuyerIdentifier(newUser.phone || newUser.email);
    setAuthModalTab('BUYER_LOGIN');
    setAuthReason('Buyer account created → Sign in / continue to checkout');
    pushToast(
      'Buyer Account Created!',
      'Sign in below or click Continue to Checkout to complete your order.'
    );
  };

  const loginBuyer = (identifier: string): { ok: boolean; error?: string } => {
    const clean = identifier.trim().toLowerCase();
    if (!clean) {
      return { ok: false, error: 'Please enter your registered phone number or email.' };
    }
    const registered = authService.getRegisteredUsers();
    const matched =
      registered.find(
        (u) =>
          u.phone.toLowerCase().includes(clean) ||
          u.email.toLowerCase().includes(clean) ||
          u.name.toLowerCase().includes(clean)
      ) || user;

    const loggedInUser: User = { ...matched, role: 'BUYER' };
    authService.updateUser(loggedInUser);
    authService.setIsAuthenticated(true);
    setUser(loggedInUser);
    setIsAuthenticated(true);
    closeAuthModal();

    if (pendingKikapuAction) {
      const { product, quantity, openDrawer } = pendingKikapuAction;
      setPendingKikapuAction(null);
      executeAddToKikapu(product, quantity, openDrawer);
      setRoute('home');
      try {
        window.history.pushState({}, '', '/');
      } catch {}
    } else {
      pushToast(`Welcome back, ${loggedInUser.name}!`, 'Redirected to your Buyer Dashboard.');
      setRoute('dashboard');
      try {
        window.history.pushState({}, '', '/dashboard');
      } catch {}
    }
    return { ok: true };
  };

  const loginSeller = (
    identifier: string
  ): { ok: boolean; error?: string; requiresSubscription?: boolean } => {
    const clean = identifier.trim().toLowerCase();
    if (!clean) {
      return { ok: false, error: 'Enter your registered Seller phone number, email, or business name.' };
    }
    const matchedSeller = sellers.find(
      (s) =>
        s.phone.toLowerCase().includes(clean) ||
        (s.email && s.email.toLowerCase().includes(clean)) ||
        s.businessName.toLowerCase().includes(clean) ||
        s.personalName.toLowerCase().includes(clean)
    );
    if (!matchedSeller) {
      return {
        ok: false,
        error:
          'No approved seller account found for these details. Please apply to become a seller first.',
      };
    }
    if (matchedSeller.status === 'PENDING') {
      return {
        ok: false,
        error: 'Your seller application is still under review.',
      };
    }
    if (matchedSeller.status === 'REJECTED') {
      return {
        ok: false,
        error: 'Your seller application was not approved.',
      };
    }
    if (matchedSeller.status === 'SUSPENDED') {
      return {
        ok: false,
        error: 'Your seller account has been suspended by marketplace administration.',
      };
    }

    setActiveSellerId(matchedSeller.id);
    const sellerStore = stores.find((st) => st.id === matchedSeller.storeId);
    if (sellerStore) setActiveStoreSlug(sellerStore.slug);

    const updatedUser: User = {
      ...user,
      name: matchedSeller.personalName,
      phone: matchedSeller.phone,
      email: matchedSeller.email || user.email,
      role: 'SELLER',
    };
    authService.updateUser(updatedUser);
    authService.setIsAuthenticated(true);
    setUser(updatedUser);
    setIsAuthenticated(true);
    closeAuthModal();

    const hasActiveStore =
      sellerStore?.status === 'ACTIVE' &&
      subscriptions.some((sub) => sub.sellerId === matchedSeller.id && sub.status === 'ACTIVE');

    if (!hasActiveStore) {
      pushToast(
        'Your seller account has been approved.',
        'Activate a store subscription to start selling.'
      );
      return { ok: true, requiresSubscription: true };
    }

    setRoute('seller-dashboard');
    try {
      window.history.pushState({}, '', '/seller/dashboard');
    } catch {}
    pushToast(`Logged in to ${matchedSeller.businessName}`, 'Redirected to /seller/dashboard');
    return { ok: true, requiresSubscription: false };
  };

  const loginRider = (identifier: string): { ok: boolean; error?: string } => {
    const clean = identifier.trim().toLowerCase();
    if (!clean) {
      return { ok: false, error: 'Enter your registered Rider phone number, email, or number plate.' };
    }
    const matchedRider = riders.find(
      (r) =>
        r.phone.toLowerCase().includes(clean) ||
        (r.email && r.email.toLowerCase().includes(clean)) ||
        r.plateNumber.toLowerCase().includes(clean) ||
        r.name.toLowerCase().includes(clean)
    );
    if (!matchedRider) {
      return {
        ok: false,
        error:
          'No Jaza Rider account found. Riders must apply first and receive Admin approval before logging in.',
      };
    }
    if (matchedRider.approvalStatus === 'PENDING') {
      return {
        ok: false,
        error: 'Your rider application is still under review.',
      };
    }
    if (matchedRider.approvalStatus === 'REJECTED') {
      return {
        ok: false,
        error: 'Your rider application was not approved.',
      };
    }
    if (matchedRider.approvalStatus === 'SUSPENDED') {
      return {
        ok: false,
        error: 'Your rider account has been suspended.',
      };
    }

    setActiveRiderId(matchedRider.id);
    const updatedUser: User = {
      ...user,
      name: matchedRider.name,
      phone: matchedRider.phone,
      email: matchedRider.email || user.email,
      role: 'RIDER',
    };
    authService.updateUser(updatedUser);
    authService.setIsAuthenticated(true);
    setUser(updatedUser);
    setIsAuthenticated(true);
    closeAuthModal();
    setRoute('rider-dashboard');
    try {
      window.history.pushState({}, '', '/rider/dashboard');
    } catch {}
    pushToast(`Jambo ${matchedRider.name}!`, 'Redirected to /rider/dashboard');
    return { ok: true };
  };

  const loginAdmin = (identifier: string, secretCode?: string): { ok: boolean; error?: string } => {
    const clean = identifier.trim().toLowerCase();
    const matchedAdmin = privateAdmins.find(
      (a) =>
        a.email.toLowerCase() === clean ||
        a.phone.toLowerCase().includes(clean) ||
        a.name.toLowerCase().includes(clean)
    );
    if (!matchedAdmin || (secretCode && secretCode !== 'JAZA-ADMIN-2026' && secretCode.length < 4)) {
      return {
        ok: false,
        error:
          'Invalid private Admin credentials. Admin accounts have no public signup and are managed privately.',
      };
    }
    const adminProfile = matchedAdmin;
    const updatedUser: User = {
      ...user,
      name: adminProfile.name,
      email: adminProfile.email,
      phone: adminProfile.phone,
      role: 'ADMIN',
    };
    authService.updateUser(updatedUser);
    authService.setIsAuthenticated(true);
    setUser(updatedUser);
    setIsAuthenticated(true);
    closeAuthModal();
    setRoute('admin');
    try {
      window.history.pushState({}, '', '/admin');
    } catch {}
    pushToast('Admin Governance Session Active', `Redirected to /admin (${adminProfile.name})`);
    return { ok: true };
  };

  const logout = () => {
    authService.setIsAuthenticated(false);
    setIsAuthenticated(false);
    const guestUser = authService.switchRole('BUYER');
    setUser(guestUser);
    navigate('home');
    pushToast('Signed Out', 'You are now browsing the marketplace as a guest.', 'info');
  };

  const adminCreatePrivateAdmin = (
    name: string,
    email: string,
    phone: string,
    roleTitle: string
  ) => {
    const nextAdmin: PrivateAdminAccount = {
      id: `admin-${Date.now()}`,
      name,
      email,
      phone,
      roleTitle,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPrivateAdmins((prev) => [nextAdmin, ...prev]);
    pushToast(`Private Admin Provisioned: ${name}`, `${email} can now sign in via Admin Login.`);
  };

  const switchRole = (role: UserRole) => {
    const updated = authService.switchRole(role);
    authService.setIsAuthenticated(true);
    setIsAuthenticated(true);
    setUser(updated);
    pushToast(`Switched active account role to ${role}`, 'Access permissions updated immediately.');
    if (role === 'SELLER') navigate('seller-dashboard');
    else if (role === 'RIDER') navigate('rider-dashboard');
    else if (role === 'ADMIN') navigate('admin');
    else navigate('dashboard');
  };

  const toggleFollowSeller = (sellerId: string) => {
    if (!isAuthenticated) {
      openAuthModal('BUYER_SIGNUP', 'Sign Up & Log In to follow your favourite local market stalls.');
      return;
    }
    const exists = user.followingSellerIds.includes(sellerId);
    const nextIds = exists
      ? user.followingSellerIds.filter((id) => id !== sellerId)
      : [...user.followingSellerIds, sellerId];
    const updatedUser = authService.updateUser({ ...user, followingSellerIds: nextIds });
    setUser(updatedUser);

    const updatedStores = stores.map((st) =>
      st.sellerId === sellerId
        ? { ...st, followersCount: st.followersCount + (exists ? -1 : 1) }
        : st
    );
    setStores(storeService.saveStores(updatedStores));
    pushToast(exists ? 'Unfollowed seller' : 'Following seller', 'Store updates synced to your feed.');
  };

  const toggleSaveStore = (storeId: string) => {
    if (!isAuthenticated) {
      openAuthModal('BUYER_SIGNUP', 'Sign Up & Log In to save stalls to your Buyer account.');
      return;
    }
    const exists = user.savedStoreIds.includes(storeId);
    const nextIds = exists
      ? user.savedStoreIds.filter((id) => id !== storeId)
      : [...user.savedStoreIds, storeId];
    const updatedUser = authService.updateUser({ ...user, savedStoreIds: nextIds });
    setUser(updatedUser);
    pushToast(exists ? 'Removed store from saved' : 'Store saved to your account');
  };

  const currentLocationName = useMemo(() => {
    if (selectedLocationId === 'ALL') return 'Taita-Taveta (All Towns)';
    const found = locations.find((l) => l.id === selectedLocationId);
    return found ? found.name : 'Voi';
  }, [selectedLocationId, locations]);

  // Kikapu Operations — Enforces: Browse → Select Product → Add to Kikapu / Buy Now → Sign Up → Login → Checkout
  const addToKikapu = (product: Product, quantity = 1, openDrawer = false) => {
    if (!isAuthenticated) {
      setPendingKikapuAction({ product, quantity, openDrawer: true });
      openAuthModal(
        'BUYER_SIGNUP',
        `To add "${product.name}" (KSh ${product.price.toLocaleString()}) to your Kikapu or Buy Now, please Sign Up for a Buyer account, then Log In.`
      );
      return;
    }
    executeAddToKikapu(product, quantity, openDrawer);
  };

  const updateKikapuQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromKikapu(productId);
      return;
    }
    setBasket((prev) => {
      const next = prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      return basketService.saveBasket(next);
    });
  };

  const removeFromKikapu = (productId: string) => {
    setBasket((prev) => {
      const next = prev.filter((item) => item.productId !== productId);
      return basketService.saveBasket(next);
    });
    pushToast('Removed item from Kikapu', undefined, 'info');
  };

  const saveItemForLater = (productId: string) => {
    const target = basket.find((i) => i.productId === productId);
    if (!target) return;
    setBasket((prev) => basketService.saveBasket(prev.filter((i) => i.productId !== productId)));
    setSavedForLater((prev) => {
      const filtered = prev.filter((i) => i.productId !== productId);
      return basketService.saveSavedForLater([...filtered, target]);
    });
    pushToast('Saved item for later', `${target.product.name} moved to Saved list.`);
  };

  const moveSavedToKikapu = (productId: string) => {
    const target = savedForLater.find((i) => i.productId === productId);
    if (!target) return;
    setSavedForLater((prev) =>
      basketService.saveSavedForLater(prev.filter((i) => i.productId !== productId))
    );
    addToKikapu(target.product, target.quantity);
  };

  const clearKikapu = () => {
    setBasket(basketService.saveBasket([]));
    pushToast('Kikapu cleared', 'All items removed from your basket.', 'info');
  };

  const groupedKikapuByStore = useMemo(() => {
    const map = new Map<
      string,
      {
        storeId: string;
        storeName: string;
        storeLocation: string;
        items: BasketItem[];
        storeSubtotal: number;
      }
    >();
    for (const item of basket) {
      const existing = map.get(item.storeId);
      const lineTotal = item.product.price * item.quantity;
      if (existing) {
        existing.items.push(item);
        existing.storeSubtotal += lineTotal;
      } else {
        map.set(item.storeId, {
          storeId: item.storeId,
          storeName: item.storeName,
          storeLocation: item.storeLocation,
          items: [item],
          storeSubtotal: lineTotal,
        });
      }
    }
    return Array.from(map.values());
  }, [basket]);

  const kikapuSubtotal = useMemo(
    () => basket.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [basket]
  );

  const kikapuDeliveryFee = useMemo(() => {
    if (basket.length === 0) return 0;
    const storeCount = groupedKikapuByStore.length;
    // Base rider fee 100 KSh + 30 KSh per additional stall pickup
    return 100 + Math.max(0, storeCount - 1) * 30;
  }, [basket.length, groupedKikapuByStore.length]);

  const kikapuTotal = kikapuSubtotal + kikapuDeliveryFee;

  const kikapuItemCount = useMemo(
    () => basket.reduce((sum, item) => sum + item.quantity, 0),
    [basket]
  );

  const checkoutKikapu = async (params: {
    town: string;
    landmark: string;
    phone: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Promise<Order> => {
    const orderNumber = `JK${Math.floor(1030 + Math.random() * 8900)}`;
    const payment = await paymentService.initiateMpesaStkPush({
      payerName: user.name,
      phone: params.phone,
      amountKsh: kikapuTotal,
      type: 'PRODUCT_ORDER',
      method: params.paymentMethod,
      description: `Multi-seller Kikapu Order #${orderNumber} (${groupedKikapuByStore.length} stalls)`,
      reference: orderNumber,
    });
    setPayments(paymentService.getPayments());

    const orderItems = basket.map((b) => ({
      productId: b.productId,
      productName: b.product.name,
      price: b.product.price,
      quantity: b.quantity,
      unit: b.product.unit,
      image: b.product.images[0] || ASSETS.freshBasketImg,
      storeId: b.storeId,
      storeName: b.storeName,
    }));

    const sellerOrders = groupedKikapuByStore.map((group, idx) => ({
      id: `SO-${orderNumber}-${idx + 1}`,
      storeId: group.storeId,
      storeName: group.storeName,
      sellerId: group.items[0]?.product.sellerId || 'seller-1',
      locationName: group.storeLocation,
      items: group.items.map((b) => ({
        productId: b.productId,
        productName: b.product.name,
        price: b.product.price,
        quantity: b.quantity,
        unit: b.product.unit,
        image: b.product.images[0] || ASSETS.freshBasketImg,
        storeId: b.storeId,
        storeName: b.storeName,
      })),
      subtotal: group.storeSubtotal,
      status: 'CONFIRMED' as OrderStatus,
    }));

    const newOrder: Order = {
      id: orderNumber,
      buyerId: user.id,
      buyerName: user.name,
      buyerPhone: params.phone,
      items: orderItems,
      sellerOrders,
      subtotal: kikapuSubtotal,
      deliveryFee: kikapuDeliveryFee,
      total: kikapuTotal,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      mpesaReceipt: payment.mpesaReceiptNumber,
      orderStatus: 'CONFIRMED',
      deliveryStatus: 'ORDER_CONFIRMED',
      riderId: 'rider-1',
      riderName: 'Benson Mwandawiro',
      riderPhone: '+254 715 900 111',
      address: {
        town: params.town,
        landmark: params.landmark,
        notes: params.notes,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(orderService.saveOrders(nextOrders));

    const newDelivery: Delivery = {
      id: `DEL-${Math.floor(910 + Math.random() * 900)}`,
      orderId: orderNumber,
      pickupStores: groupedKikapuByStore.map((g) => `${g.storeName} (${g.storeLocation})`),
      pickupTown: groupedKikapuByStore[0]?.storeLocation || params.town,
      dropoffLandmark: params.landmark,
      dropoffTown: params.town,
      customerName: user.name,
      customerPhone: params.phone,
      payoutKsh: kikapuDeliveryFee,
      distanceKm: 3.4,
      status: 'ORDER_CONFIRMED',
      updatedAt: 'Just now',
    };
    const nextDeliveries = [newDelivery, ...deliveries];
    setDeliveries(riderService.saveDeliveries(nextDeliveries));

    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type: 'NEW_ORDER',
      title: `Order #${orderNumber} Confirmed`,
      body: `M-Pesa Ref ${payment.mpesaReceiptNumber} · ${groupedKikapuByStore.length} local store(s) notified for Jaza Rider pickup.`,
      read: false,
      createdAt: 'Just now',
      actionRoute: 'dashboard',
    };
    setNotifications(notificationService.saveNotifications([newNotif, ...notifications]));

    setBasket(basketService.saveBasket([]));
    setIsKikapuDrawerOpen(false);
    pushToast(
      `Order #${orderNumber} Placed!`,
      `Receipt ${payment.mpesaReceiptNumber} · Track your Jaza Rider live.`
    );
    return newOrder;
  };

  const applyToBecomeSeller = (data: {
    personalName: string;
    businessName: string;
    email?: string;
    categoryId: string;
    locationId: string;
    businessLocation?: string;
    description: string;
    idVerification?: string;
    supportingDocumentName?: string;
    additionalInfo?: string;
    phone: string;
    whatsapp: string;
  }): Seller => {
    const loc = locations.find((l) => l.id === data.locationId) || locations[0];
    const cat = categories.find((c) => c.id === data.categoryId) || categories[0];
    const sellerId = `seller-${Date.now()}`;
    const storeId = `store-${Date.now()}`;
    const slug = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const pendingStore: Store = {
      id: storeId,
      slug,
      sellerId,
      businessName: data.businessName,
      tagline: `${cat.name} Stall in ${loc.name}, Taita-Taveta`,
      description: data.description,
      categoryId: cat.id,
      categoryName: cat.name,
      locationId: loc.id,
      locationName: loc.name,
      logo: ASSETS.storeSupermarketImg,
      coverImage: ASSETS.heroMarketImg,
      rating: 5.0,
      reviewCount: 0,
      followersCount: 1,
      openingHours: 'Mon–Sat: 8:00 AM – 7:00 PM',
      deliveryInfo: `Fast Jaza Rider delivery in ${loc.name}`,
      deliveryTimeEstimate: '30–45 mins',
      contactPhone: data.phone,
      whatsappNumber: data.whatsapp.replace(/[^0-9]/g, ''),
      verified: false,
      status: 'INACTIVE',
    };

    const today = new Date().toISOString().slice(0, 10);
    const pendingSeller: Seller = {
      id: sellerId,
      userId: `user-${sellerId}`,
      personalName: data.personalName,
      businessName: data.businessName,
      email: data.email || `${slug}@jazakikapu.co.ke`,
      categoryId: cat.id,
      locationId: loc.id,
      town: loc.name,
      businessLocation: data.businessLocation || `${loc.name} Municipal Market`,
      description: data.description,
      idVerification: data.idVerification || 'National ID & Business Permit Submitted',
      supportingDocumentName: data.supportingDocumentName || 'Business_Verification_Docs.pdf',
      additionalInfo: data.additionalInfo || '',
      history: [{ date: today, action: 'Seller application submitted (Status: PENDING)' }],
      phone: data.phone,
      whatsapp: data.whatsapp,
      status: 'PENDING',
      storeId,
      walletBalanceKsh: 0,
      totalSalesKsh: 0,
      joinedAt: today,
    };

    setStores(storeService.saveStores([pendingStore, ...stores]));
    setSellers(sellerService.saveSellers([pendingSeller, ...sellers]));
    setActiveSellerId(sellerId);
    pushToast(
      `Application Submitted for "${data.businessName}"`,
      'Your seller application has been received and is waiting for admin review (Status: PENDING).'
    );
    return pendingSeller;
  };

  const applyToBecomeRider = (data: {
    name: string;
    phone: string;
    email?: string;
    nationalId: string;
    vehicleType: Rider['vehicleType'];
    plateNumber: string;
    locationId: string;
    deliveryAreas?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    supportingDocumentName?: string;
  }): Rider => {
    const loc = locations.find((l) => l.id === data.locationId) || locations[0];
    const newRider: Rider = {
      id: `rider-${Date.now()}`,
      userId: `user-rider-${Date.now()}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || `${data.name.toLowerCase().replace(/\s+/g, '.')}@jazakikapu.co.ke`,
      nationalId: data.nationalId.trim(),
      vehicleType: data.vehicleType,
      plateNumber: data.plateNumber.trim().toUpperCase(),
      locationId: loc.id,
      locationName: loc.name,
      deliveryAreas: data.deliveryAreas || `${loc.name} Town & Surrounding Estates`,
      emergencyContactName: data.emergencyContactName || 'Next of Kin',
      emergencyContactPhone: data.emergencyContactPhone || data.phone.trim(),
      supportingDocumentName: data.supportingDocumentName || 'Rider_ID_and_License.pdf',
      approvalStatus: 'PENDING',
      status: 'OFFLINE',
      rating: 5.0,
      completedDeliveries: 0,
      walletBalanceKsh: 0,
    };
    setRiders(riderService.saveRiders([newRider, ...riders]));
    setActiveRiderId(newRider.id);
    pushToast(
      `Rider Application Submitted (${newRider.plateNumber})`,
      'Your rider application has been received and is waiting for admin review (Status: PENDING).'
    );
    return newRider;
  };

  const registerNewSellerAndStore = async (data: {
    personalName: string;
    businessName: string;
    categoryId: string;
    locationId: string;
    description: string;
    phone: string;
    whatsapp: string;
    planId: string;
  }): Promise<Store> => {
    const createdSeller = applyToBecomeSeller(data);
    const createdStore = stores.find((s) => s.id === createdSeller.storeId) || stores[0];
    return createdStore;
  };

  const addOrUpdateProduct = (
    productData: Partial<Product> & { name: string; price: number; categoryId: string }
  ) => {
    const activeStore = stores[0];
    const cat = categories.find((c) => c.id === productData.categoryId) || categories[0];

    if (productData.id) {
      const updated = products.map((p) =>
        p.id === productData.id
          ? {
              ...p,
              ...productData,
              category: cat.name,
              updatedAt: new Date().toISOString(),
            }
          : p
      );
      setProducts(productService.saveProducts(updated));
      pushToast(`Updated ${productData.name}`, 'Product changes are live in the market.');
      return;
    }

    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name,
      slug,
      description:
        productData.description ||
        `Freshly stocked at ${activeStore.businessName} in ${activeStore.locationName}.`,
      price: productData.price,
      compareAtPrice: productData.compareAtPrice,
      images:
        productData.images && productData.images.length > 0
          ? productData.images
          : [ASSETS.freshBasketImg],
      category: cat.name,
      categoryId: cat.id,
      sellerId: activeStore.sellerId,
      storeId: activeStore.id,
      storeName: activeStore.businessName,
      storeSlug: activeStore.slug,
      location: activeStore.locationName,
      locationId: activeStore.locationId,
      unit: productData.unit || '1 Unit',
      stock: productData.stock ?? 25,
      rating: 5.0,
      reviewCount: 1,
      featured: Boolean(productData.featured),
      isDeal: Boolean(productData.compareAtPrice && productData.compareAtPrice > productData.price),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(productService.saveProducts([newProduct, ...products]));
    pushToast(`Added "${newProduct.name}"`, `Listed in ${activeStore.businessName} stall.`);
  };

  const deleteProduct = (productId: string) => {
    setProducts(productService.saveProducts(products.filter((p) => p.id !== productId)));
    pushToast('Product deleted from stall', undefined, 'info');
  };

  const purchaseStoreSubscription = async (planId: string, phone: string) => {
    const plan = pricingConfig.storePlans.find((p) => p.id === planId);
    if (!plan) return;
    const payment = await paymentService.initiateMpesaStkPush({
      payerName: activeSeller.businessName,
      phone,
      amountKsh: plan.priceKsh,
      type: 'STORE_SUBSCRIPTION',
      method: 'MPESA_STK',
      description: `Store Subscription Activation: ${plan.name} (${plan.durationLabel})`,
      reference: `SUB-${Date.now().toString().slice(-4)}`,
    });
    setPayments(paymentService.getPayments());

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      sellerId: activeSeller.id,
      storeId: activeSeller.storeId,
      planId: plan.id,
      planName: plan.name,
      billingPeriod: plan.billingPeriod,
      priceKsh: plan.priceKsh,
      status: 'ACTIVE',
      startDate: new Date().toISOString().slice(0, 10),
      expiresAt: '2026-11-28',
    };
    setSubscriptions(subscriptionService.saveSubscriptions([newSub, ...subscriptions]));

    // Activate Seller and Store upon subscription payment
    const today = new Date().toISOString().slice(0, 10);
    const nextSellers = sellers.map((s) =>
      s.id === activeSeller.id
        ? {
            ...s,
            status: 'APPROVED' as SellerStatus,
            subscriptionId: newSub.id,
            history: [
              ...(s.history || []),
              {
                date: today,
                action: `Paid KSh ${plan.priceKsh.toLocaleString()} for ${plan.name} (${plan.billingPeriod}) — Store ACTIVE`,
              },
            ],
          }
        : s
    );
    setSellers(sellerService.saveSellers(nextSellers));

    const nextStores = stores.map((st) =>
      st.id === activeSeller.storeId ? { ...st, status: 'ACTIVE' as const, verified: true } : st
    );
    setStores(storeService.saveStores(nextStores));

    pushToast(
      `Store Activated! (${plan.name})`,
      `M-Pesa Receipt ${payment.mpesaReceiptNumber} · ${activeSeller.businessName} is now ACTIVE on Jaza Kikapu!`
    );
  };

  const purchaseGoLivePackage = async (
    planId: string,
    phone: string,
    sessionTitle: string,
    sessionSubtitle: string,
    pinnedProductIds: string[]
  ): Promise<LiveSession> => {
    const plan =
      pricingConfig.goLivePlans.find((p) => p.id === planId) || pricingConfig.goLivePlans[0];
    const activeStore = stores[0];
    const payment = await paymentService.initiateMpesaStkPush({
      payerName: activeStore.businessName,
      phone,
      amountKsh: plan.priceKsh,
      type: 'GO_LIVE',
      method: 'MPESA_STK',
      description: `Jaza Live Access: ${plan.name} (${plan.durationLabel})`,
      reference: `LIVE-${Date.now().toString().slice(-4)}`,
    });
    setPayments(paymentService.getPayments());

    const now = new Date();
    const ends = new Date(now.getTime() + plan.durationHours * 3600 * 1000);
    const newSession: LiveSession = {
      id: `live-${Date.now()}`,
      sellerId: activeStore.sellerId,
      storeId: activeStore.id,
      storeName: activeStore.businessName,
      storeSlug: activeStore.slug,
      sellerAvatar: activeStore.logo,
      locationName: activeStore.locationName,
      title: sessionTitle || `${activeStore.businessName} Live Showcase`,
      subtitle: sessionSubtitle || `Live from ${activeStore.locationName} — ask questions & shop now!`,
      status: 'LIVE',
      viewerCount: 42,
      likesCount: 110,
      coverImage: activeStore.coverImage,
      pinnedProductIds:
        pinnedProductIds.length > 0 ? pinnedProductIds : [products[0]?.id || 'prod-1'],
      startedAt: now.toISOString(),
      endsAt: ends.toISOString(),
      comments: [
        {
          id: `lc-${Date.now()}`,
          userName: 'Jaza Kikapu Bot',
          text: `🔴 ${activeStore.businessName} is now LIVE in ${activeStore.locationName} (${plan.durationLabel} pass active).`,
          timestamp: 'Just now',
        },
      ],
    };

    const nextSessions = [newSession, ...liveSessions];
    setLiveSessions(liveService.saveLiveSessions(nextSessions));
    setActiveLiveId(newSession.id);
    pushToast(
      `🔴 You are now LIVE on Jaza Kikapu!`,
      `${plan.name} paid (${payment.mpesaReceiptNumber}). Broadcasting to ${activeStore.locationName}.`
    );
    return newSession;
  };

  const purchaseProductBoost = async (productId: string, boostPlanId: string, phone: string) => {
    const prod = products.find((p) => p.id === productId);
    const plan = pricingConfig.boostPlans.find((b) => b.id === boostPlanId);
    if (!prod || !plan) return;

    const payment = await paymentService.initiateMpesaStkPush({
      payerName: prod.storeName,
      phone,
      amountKsh: plan.priceKsh,
      type: 'BOOST',
      method: 'MPESA_STK',
      description: `${plan.name} for "${prod.name}"`,
      reference: `BST-${Date.now().toString().slice(-4)}`,
    });
    setPayments(paymentService.getPayments());

    const expiresDate = new Date(Date.now() + plan.durationDays * 86400 * 1000)
      .toISOString()
      .slice(0, 10);

    const newBoost: Boost = {
      id: `boost-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      storeId: prod.storeId,
      storeName: prod.storeName,
      planId: plan.id,
      planName: plan.name,
      priceKsh: plan.priceKsh,
      status: 'ACTIVE',
      startsAt: new Date().toISOString().slice(0, 10),
      expiresAt: expiresDate,
    };

    setBoosts(subscriptionService.saveBoosts([newBoost, ...boosts]));
    const updatedProducts = products.map((p) =>
      p.id === prod.id ? { ...p, featured: true, isDeal: true, boostedUntil: expiresDate } : p
    );
    setProducts(productService.saveProducts(updatedProducts));
    pushToast(
      `Boost Activated for "${prod.name}"!`,
      `${plan.durationLabel} spotlight active (${payment.mpesaReceiptNumber}).`
    );
  };

  // Social Feed & Live
  const toggleLikePost = (postId: string) => {
    const updated = posts.map((post) => {
      if (post.id !== postId) return post;
      const liked = !post.likedByMe;
      return {
        ...post,
        likedByMe: liked,
        likesCount: post.likesCount + (liked ? 1 : -1),
      };
    });
    setPosts(postService.savePosts(updated));
  };

  const addPostComment = (postId: string, text: string) => {
    if (!isAuthenticated) {
      openAuthModal('BUYER_LOGIN', 'Sign in or create a Buyer account to comment on market posts.');
      return;
    }
    if (!text.trim()) return;
    const updated = posts.map((post) => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comments: [
          ...post.comments,
          {
            id: `pc-${Date.now()}`,
            userName: user.name,
            text: text.trim(),
            createdAt: 'Just now',
          },
        ],
      };
    });
    setPosts(postService.savePosts(updated));
    pushToast('Comment posted to Market Feed');
  };

  const createSellerPost = (data: {
    title: string;
    content: string;
    badgeLabel: string;
    linkedProductId?: string;
  }) => {
    const activeStore = activeSellerStore || stores[0];
    const linkedProd = products.find((p) => p.id === data.linkedProductId);
    const newPost: Post = {
      id: `post-${Date.now()}`,
      sellerId: activeStore.sellerId,
      storeId: activeStore.id,
      storeName: activeStore.businessName,
      storeSlug: activeStore.slug,
      storeLogo: activeStore.logo,
      locationName: activeStore.locationName,
      type: 'PROMOTION',
      badgeLabel: data.badgeLabel || 'Market Update',
      title: data.title,
      content: data.content,
      mediaUrl: linkedProd?.images[0] || activeStore.coverImage,
      linkedProductId: data.linkedProductId,
      likesCount: 1,
      likedByMe: true,
      comments: [],
      createdAt: 'Just now',
    };
    setPosts(postService.savePosts([newPost, ...posts]));
    pushToast('Published post to Taita-Taveta Market Feed!');
  };

  const sendLiveComment = (liveId: string, text: string) => {
    if (!isAuthenticated) {
      openAuthModal('BUYER_LOGIN', 'Sign in or create a Buyer account to chat during Jaza Live.');
      return;
    }
    if (!text.trim()) return;
    const updated = liveSessions.map((s) =>
      s.id === liveId
        ? {
            ...s,
            comments: [
              ...s.comments,
              {
                id: `lc-${Date.now()}`,
                userName: user.name,
                text: text.trim(),
                timestamp: 'Just now',
              },
            ],
          }
        : s
    );
    setLiveSessions(liveService.saveLiveSessions(updated));
  };

  const likeLiveSession = (liveId: string) => {
    const updated = liveSessions.map((s) =>
      s.id === liveId ? { ...s, likesCount: s.likesCount + 1 } : s
    );
    setLiveSessions(liveService.saveLiveSessions(updated));
  };

  const sendMessageToConversation = (
    conversationId: string,
    text: string,
    referencedProductName?: string
  ) => {
    if (!isAuthenticated) {
      openAuthModal('BUYER_LOGIN', 'Sign in or create a Buyer account to message sellers.');
      return;
    }
    if (!text.trim()) return;
    const updated = conversations.map((c) => {
      if (c.id !== conversationId) return c;
      return {
        ...c,
        lastMessage: text.trim(),
        updatedAt: 'Just now',
        unreadCount: 0,
        messages: [
          ...c.messages,
          {
            id: `msg-${Date.now()}`,
            senderId: user.id,
            senderName: user.name,
            senderRole: user.role,
            text: text.trim(),
            referencedProductName,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
    });
    setConversations(messageService.saveConversations(updated));
  };

  const startConversationWithStore = (store: Store, product?: Product): string => {
    if (!isAuthenticated) {
      openAuthModal(
        'BUYER_LOGIN',
        `Sign in or create a Buyer account to message ${store.businessName}.`
      );
      return '';
    }
    const existing = conversations.find((c) => c.storeId === store.id);
    if (existing) {
      if (product) {
        sendMessageToConversation(
          existing.id,
          `Habari ${store.businessName}, I am inquiring about "${product.name}" (KSh ${product.price.toLocaleString()}). Is it available right now?`,
          product.name
        );
      }
      return existing.id;
    }

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participantName: store.businessName,
      participantRole: 'SELLER',
      storeId: store.id,
      storeSlug: store.slug,
      locationName: store.locationName,
      unreadCount: 0,
      lastMessage: product
        ? `Inquiry about ${product.name}`
        : `Started conversation with ${store.businessName}`,
      updatedAt: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: user.id,
          senderName: user.name,
          senderRole: user.role,
          text: product
            ? `Habari ${store.businessName}, I am interested in "${product.name}" (KSh ${product.price.toLocaleString()}).`
            : `Habari ${store.businessName}! I found your digital stall on Jaza Kikapu.`,
          referencedProductName: product?.name,
          createdAt: 'Just now',
        },
      ],
    };
    setConversations(messageService.saveConversations([newConv, ...conversations]));
    return newConv.id;
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(notificationService.saveNotifications(updated));
    pushToast('All notifications marked as read');
  };

  const addProductReview = (
    storeId: string,
    productId: string | undefined,
    rating: number,
    comment: string
  ) => {
    if (!isAuthenticated) {
      openAuthModal('BUYER_LOGIN', 'Sign in or create a Buyer account to review products and stores.');
      return;
    }
    if (!comment.trim()) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      storeId,
      productId,
      authorName: user.name,
      rating,
      comment: comment.trim(),
      verifiedPurchase: true,
      createdAt: 'Just now',
    };
    setReviews(reviewService.saveReviews([newRev, ...reviews]));
    pushToast('Asante! Your review has been posted.');
  };

  // Rider Operations
  const acceptDelivery = (deliveryId: string) => {
    const activeRider = riders[0];
    const target = deliveries.find((d) => d.id === deliveryId);
    if (!target) return;
    const result = adminService.updateOrderDeliveryStage(
      orders,
      deliveries.map((d) =>
        d.id === deliveryId
          ? {
              ...d,
              assignedRiderId: activeRider.id,
              assignedRiderName: activeRider.name,
            }
          : d
      ),
      target.orderId,
      'RIDER_ASSIGNED',
      'PROCESSING'
    );
    setOrders(result.orders);
    setDeliveries(result.deliveries);
    pushToast(
      `Assigned Delivery #${deliveryId}`,
      `Proceed to ${target.pickupStores.join(' & ')} for pickup.`
    );
  };

  const advanceDeliveryStage = (deliveryId: string) => {
    const target = deliveries.find((d) => d.id === deliveryId);
    if (!target) return;
    const pipeline: DeliveryStatus[] = [
      'ORDER_CONFIRMED',
      'SELLER_PREPARING',
      'RIDER_ASSIGNED',
      'PICKED_UP',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
    ];
    const idx = pipeline.indexOf(target.status);
    const nextStage = pipeline[Math.min(idx + 1, pipeline.length - 1)];
    const mappedOrderStatus: OrderStatus =
      nextStage === 'DELIVERED'
        ? 'DELIVERED'
        : nextStage === 'OUT_FOR_DELIVERY' || nextStage === 'PICKED_UP'
        ? 'OUT_FOR_DELIVERY'
        : 'PROCESSING';

    const result = adminService.updateOrderDeliveryStage(
      orders,
      deliveries,
      target.orderId,
      nextStage,
      mappedOrderStatus
    );
    setOrders(result.orders);
    setDeliveries(result.deliveries);
    pushToast(
      `Delivery #${target.orderId} → ${nextStage.replace(/_/g, ' ')}`,
      nextStage === 'DELIVERED'
        ? `KSh ${target.payoutKsh} credited to Rider Wallet.`
        : 'Buyer notified in real time.'
    );
  };

  // Admin Operations
  const adminUpdatePricingConfig = (nextConfig: MarketplacePricingConfig) => {
    const saved = subscriptionService.savePricingConfig(nextConfig);
    setPricingConfig(saved);
    pushToast(
      'Marketplace Pricing Updated',
      'New Store, Go Live, and Boost rates are now live across all sellers.'
    );
  };

  const adminSetSellerStatus = (sellerId: string, status: SellerStatus, adminNotes?: string) => {
    const target = sellers.find((s) => s.id === sellerId);
    const today = new Date().toISOString().slice(0, 10);
    // Important Rule: Admin approval sets seller status to APPROVED, and does NOT activate the store until seller subscribes
    const resolvedStatus: SellerStatus = status === 'ACTIVE' ? 'APPROVED' : status;
    const updatedSellers = sellers.map((s) =>
      s.id === sellerId
        ? {
            ...s,
            status: resolvedStatus,
            adminNotes: adminNotes !== undefined ? adminNotes : s.adminNotes,
            history: [
              ...(s.history || []),
              {
                date: today,
                action: `Admin updated seller status to ${resolvedStatus}${
                  adminNotes ? ` (${adminNotes})` : ''
                }`,
              },
            ],
          }
        : s
    );
    setSellers(sellerService.saveSellers(updatedSellers));

    if (resolvedStatus === 'SUSPENDED' && target) {
      const nextStores = adminService.updateStoreStatus(stores, target.storeId, 'SUSPENDED');
      setStores(nextStores);
    }

    if (resolvedStatus === 'APPROVED') {
      pushToast(
        `Seller Approved: ${target?.businessName}`,
        'Seller status is now APPROVED. Seller can now log in and pay for a Store Subscription to activate their store.'
      );
    } else if (resolvedStatus === 'REJECTED') {
      pushToast(`Seller Application Rejected: ${target?.businessName}`, undefined, 'warning');
    } else {
      pushToast(`Seller status updated to ${resolvedStatus}`);
    }
  };

  const adminRequestSellerInfo = (sellerId: string, note: string) => {
    const target = sellers.find((s) => s.id === sellerId);
    const today = new Date().toISOString().slice(0, 10);
    const updatedSellers = sellers.map((s) =>
      s.id === sellerId
        ? {
            ...s,
            adminNotes: note,
            history: [
              ...(s.history || []),
              { date: today, action: `Admin requested more information: "${note}"` },
            ],
          }
        : s
    );
    setSellers(sellerService.saveSellers(updatedSellers));
    pushToast(
      `Requested Additional Info from ${target?.personalName || 'Seller'}`,
      note,
      'info'
    );
  };

  const adminSetStoreStatus = (storeId: string, status: Store['status']) => {
    const next = adminService.updateStoreStatus(stores, storeId, status);
    setStores(next);
    pushToast(`Store status updated to ${status}`);
  };

  const adminSetProductStatus = (productId: string, status: Product['status']) => {
    const next = products.map((p) => (p.id === productId ? { ...p, status } : p));
    setProducts(productService.saveProducts(next));
    pushToast(`Product moderation status set to ${status}`);
  };

  const adminSetRiderApprovalStatus = (
    riderId: string,
    status: RiderApprovalStatus,
    adminNotes?: string
  ) => {
    const target = riders.find((r) => r.id === riderId);
    const next = adminService.updateRiderApprovalStatus(riders, riderId, status, adminNotes);
    setRiders(next);
    pushToast(
      `Rider ${target?.name || ''} status set to ${status}`,
      status === 'APPROVED' ? 'Rider can now log in to /rider/dashboard.' : undefined
    );
  };

  const adminAddLocation = (loc: Omit<Location, 'id'>) => {
    const next = locationService.addLocation(loc);
    setLocations(next);
    pushToast(`Added ${loc.name} (${loc.county}) to Jaza Kikapu locations!`);
  };

  const adminAddCategory = (name: string, description: string) => {
    const next = categoryService.addCategory(name, description);
    setCategories(next);
    pushToast(`Category "${name}" added to marketplace!`);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        route,
        activeStoreSlug,
        activeProductId,
        activeLiveId,
        navigate,
        user,
        isAuthenticated,
        authModalOpen,
        authModalTab,
        authReason,
        lastRegisteredBuyerIdentifier,
        openAuthModal,
        closeAuthModal,
        signUpBuyer,
        loginBuyer,
        loginSeller,
        loginRider,
        loginAdmin,
        logout,
        switchRole,
        toggleFollowSeller,
        toggleSaveStore,
        activeSeller,
        activeSellerStore,
        activeRider,
        privateAdmins,
        adminCreatePrivateAdmin,
        selectedLocationId,
        setSelectedLocationId,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        currentLocationName,
        locations,
        categories,
        stores,
        products,
        sellers,
        liveSessions,
        posts,
        orders,
        deliveries,
        riders,
        subscriptions,
        boosts,
        payments,
        conversations,
        notifications,
        reviews,
        pricingConfig,
        basket,
        savedForLater,
        isKikapuDrawerOpen,
        setIsKikapuDrawerOpen,
        addToKikapu,
        updateKikapuQuantity,
        removeFromKikapu,
        saveItemForLater,
        moveSavedToKikapu,
        clearKikapu,
        kikapuSubtotal,
        kikapuDeliveryFee,
        kikapuTotal,
        kikapuItemCount,
        groupedKikapuByStore,
        checkoutKikapu,
        applyToBecomeSeller,
        applyToBecomeRider,
        registerNewSellerAndStore,
        addOrUpdateProduct,
        deleteProduct,
        purchaseStoreSubscription,
        purchaseGoLivePackage,
        purchaseProductBoost,
        toggleLikePost,
        addPostComment,
        createSellerPost,
        sendLiveComment,
        likeLiveSession,
        sendMessageToConversation,
        startConversationWithStore,
        markAllNotificationsRead,
        addProductReview,
        acceptDelivery,
        advanceDeliveryStage,
        adminUpdatePricingConfig,
        adminSetSellerStatus,
        adminRequestSellerInfo,
        adminSetStoreStatus,
        adminSetProductStatus,
        adminSetRiderApprovalStatus,
        adminAddLocation,
        adminAddCategory,
        toasts,
        pushToast,
        dismissToast,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used inside MarketplaceProvider');
  return ctx;
};
