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
  PaymentType,
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
  INITIAL_BOOSTS,
  INITIAL_CATEGORIES,
  INITIAL_CONVERSATIONS,
  INITIAL_DELIVERIES,
  INITIAL_LIVE_SESSIONS,
  INITIAL_LOCATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_POSTS,
  INITIAL_PRICING_CONFIG,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_RIDERS,
  INITIAL_SELLERS,
  INITIAL_STORES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_USER,
} from '../data/initialData';

const STORAGE_PREFIX = 'jaza_kikapu_v1_';

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveState<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {
    // Ignore storage quota issues in restricted browsers
  }
}

export const authService = {
  getCurrentUser: (): User => loadState<User>('user', INITIAL_USER),
  getIsAuthenticated: (): boolean => loadState<boolean>('is_authenticated', false),
  setIsAuthenticated: (isAuth: boolean): boolean => {
    saveState('is_authenticated', isAuth);
    return isAuth;
  },
  getRegisteredUsers: (): User[] => loadState<User[]>('registered_users', [INITIAL_USER]),
  saveRegisteredUsers: (users: User[]): User[] => {
    saveState('registered_users', users);
    return users;
  },
  updateUser: (user: User): User => {
    saveState('user', user);
    return user;
  },
  switchRole: (role: UserRole): User => {
    const current = authService.getCurrentUser();
    const updated: User = { ...current, role };
    saveState('user', updated);
    return updated;
  },
};

export const locationService = {
  getLocations: (): Location[] => loadState<Location[]>('locations', INITIAL_LOCATIONS),
  addLocation: (loc: Omit<Location, 'id'>): Location[] => {
    const current = locationService.getLocations();
    const next: Location = { ...loc, id: `loc-${Date.now()}` };
    const updated = [...current, next];
    saveState('locations', updated);
    return updated;
  },
  toggleLocationStatus: (id: string): Location[] => {
    const current = locationService.getLocations();
    const updated = current.map((l) =>
      l.id === id
        ? { ...l, status: (l.status === 'ACTIVE' ? 'COMING_SOON' : 'ACTIVE') as Location['status'] }
        : l
    );
    saveState('locations', updated);
    return updated;
  },
};

export const categoryService = {
  getCategories: (): Category[] => loadState<Category[]>('categories', INITIAL_CATEGORIES),
  addCategory: (name: string, description: string): Category[] => {
    const current = categoryService.getCategories();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updated = [
      ...current,
      { id: `cat-${Date.now()}`, name, slug, description, productCount: 0 },
    ];
    saveState('categories', updated);
    return updated;
  },
};

export const productService = {
  getProducts: (): Product[] => loadState<Product[]>('products', INITIAL_PRODUCTS),
  saveProducts: (products: Product[]): Product[] => {
    saveState('products', products);
    return products;
  },
  suggestFillMyKikapu: (
    budgetKsh: number,
    familySize: number,
    focus: 'BALANCED' | 'FRESH_PRODUCE' | 'PANTRY_STAPLES',
    allProducts: Product[]
  ): { items: { product: Product; quantity: number }[]; total: number } => {
    const active = allProducts.filter((p) => p.status === 'ACTIVE' && p.stock > 0);
    // Prioritize essentials & affordable local staples
    const sorted = [...active].sort((a, b) => {
      const aEssential = a.essentialTag ? 1 : 0;
      const bEssential = b.essentialTag ? 1 : 0;
      if (focus === 'FRESH_PRODUCE') {
        const aFresh = a.categoryId === 'cat-fresh' ? 2 : aEssential;
        const bFresh = b.categoryId === 'cat-fresh' ? 2 : bEssential;
        if (bFresh !== aFresh) return bFresh - aFresh;
      } else if (focus === 'PANTRY_STAPLES') {
        const aStaple = a.essentialTag === 'STAPLE' ? 2 : aEssential;
        const bStaple = b.essentialTag === 'STAPLE' ? 2 : bEssential;
        if (bStaple !== aStaple) return bStaple - aStaple;
      } else {
        if (bEssential !== aEssential) return bEssential - aEssential;
      }
      return a.price - b.price;
    });

    const scaleQty = familySize >= 5 ? 2 : 1;
    const picked: { product: Product; quantity: number }[] = [];
    let runningTotal = 0;

    for (const prod of sorted) {
      if (prod.price > budgetKsh * 0.65 && prod.essentialTag === undefined) continue;
      const desiredQty = prod.price <= 160 ? scaleQty : 1;
      const lineCost = prod.price * desiredQty;
      if (runningTotal + lineCost <= budgetKsh) {
        picked.push({ product: prod, quantity: desiredQty });
        runningTotal += lineCost;
      } else if (runningTotal + prod.price <= budgetKsh) {
        picked.push({ product: prod, quantity: 1 });
        runningTotal += prod.price;
      }
    }

    return { items: picked, total: runningTotal };
  },
};

export const storeService = {
  getStores: (): Store[] => loadState<Store[]>('stores', INITIAL_STORES),
  saveStores: (stores: Store[]): Store[] => {
    saveState('stores', stores);
    return stores;
  },
};

export const sellerService = {
  getSellers: (): Seller[] => loadState<Seller[]>('sellers', INITIAL_SELLERS),
  saveSellers: (sellers: Seller[]): Seller[] => {
    saveState('sellers', sellers);
    return sellers;
  },
};

export const basketService = {
  getBasket: (): BasketItem[] => {
    const initialItems: BasketItem[] = [
      {
        productId: INITIAL_PRODUCTS[0].id,
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        storeId: INITIAL_PRODUCTS[0].storeId,
        storeName: INITIAL_PRODUCTS[0].storeName,
        storeLocation: INITIAL_PRODUCTS[0].location,
        addedAt: new Date().toISOString(),
      },
      {
        productId: INITIAL_PRODUCTS[6].id,
        product: INITIAL_PRODUCTS[6],
        quantity: 1,
        storeId: INITIAL_PRODUCTS[6].storeId,
        storeName: INITIAL_PRODUCTS[6].storeName,
        storeLocation: INITIAL_PRODUCTS[6].location,
        addedAt: new Date().toISOString(),
      },
      {
        productId: INITIAL_PRODUCTS[7].id,
        product: INITIAL_PRODUCTS[7],
        quantity: 1,
        storeId: INITIAL_PRODUCTS[7].storeId,
        storeName: INITIAL_PRODUCTS[7].storeName,
        storeLocation: INITIAL_PRODUCTS[7].location,
        addedAt: new Date().toISOString(),
      },
      {
        productId: INITIAL_PRODUCTS[10].id,
        product: INITIAL_PRODUCTS[10],
        quantity: 1,
        storeId: INITIAL_PRODUCTS[10].storeId,
        storeName: INITIAL_PRODUCTS[10].storeName,
        storeLocation: INITIAL_PRODUCTS[10].location,
        addedAt: new Date().toISOString(),
      },
    ];
    return loadState<BasketItem[]>('basket', initialItems);
  },
  saveBasket: (items: BasketItem[]): BasketItem[] => {
    saveState('basket', items);
    return items;
  },
  getSavedForLater: (): BasketItem[] => loadState<BasketItem[]>('saved_basket', []),
  saveSavedForLater: (items: BasketItem[]): BasketItem[] => {
    saveState('saved_basket', items);
    return items;
  },
};

export const paymentService = {
  getPayments: (): Payment[] => loadState<Payment[]>('payments', INITIAL_PAYMENTS),
  savePayments: (payments: Payment[]): Payment[] => {
    saveState('payments', payments);
    return payments;
  },
  initiateMpesaStkPush: async (params: {
    payerName: string;
    phone: string;
    amountKsh: number;
    type: PaymentType;
    method: PaymentMethod;
    description: string;
    reference: string;
  }): Promise<Payment> => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'SJ8';
    for (let i = 0; i < 7; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const payment: Payment = {
      id: `pay-${Date.now()}`,
      reference: params.reference,
      mpesaReceiptNumber: params.method === 'CASH_ON_DELIVERY' ? `COD-${code.slice(0, 6)}` : code,
      payerName: params.payerName,
      payerPhone: params.phone,
      amountKsh: params.amountKsh,
      type: params.type,
      method: params.method,
      status: 'COMPLETED',
      description: params.description,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
    };
    const existing = paymentService.getPayments();
    paymentService.savePayments([payment, ...existing]);
    return payment;
  },
};

export const subscriptionService = {
  getPricingConfig: (): MarketplacePricingConfig =>
    loadState<MarketplacePricingConfig>('pricing_config', INITIAL_PRICING_CONFIG),
  savePricingConfig: (config: MarketplacePricingConfig): MarketplacePricingConfig => {
    const updated = { ...config, updatedAt: new Date().toISOString() };
    saveState('pricing_config', updated);
    return updated;
  },
  getSubscriptions: (): Subscription[] =>
    loadState<Subscription[]>('subscriptions', INITIAL_SUBSCRIPTIONS),
  saveSubscriptions: (subs: Subscription[]): Subscription[] => {
    saveState('subscriptions', subs);
    return subs;
  },
  getBoosts: (): Boost[] => loadState<Boost[]>('boosts', INITIAL_BOOSTS),
  saveBoosts: (boosts: Boost[]): Boost[] => {
    saveState('boosts', boosts);
    return boosts;
  },
};

export const orderService = {
  getOrders: (): Order[] => loadState<Order[]>('orders', INITIAL_ORDERS),
  saveOrders: (orders: Order[]): Order[] => {
    saveState('orders', orders);
    return orders;
  },
};

export const liveService = {
  getLiveSessions: (): LiveSession[] =>
    loadState<LiveSession[]>('live_sessions', INITIAL_LIVE_SESSIONS),
  saveLiveSessions: (sessions: LiveSession[]): LiveSession[] => {
    saveState('live_sessions', sessions);
    return sessions;
  },
};

export const postService = {
  getPosts: (): Post[] => loadState<Post[]>('posts', INITIAL_POSTS),
  savePosts: (posts: Post[]): Post[] => {
    saveState('posts', posts);
    return posts;
  },
};

export const messageService = {
  getConversations: (): Conversation[] =>
    loadState<Conversation[]>('conversations', INITIAL_CONVERSATIONS),
  saveConversations: (convs: Conversation[]): Conversation[] => {
    saveState('conversations', convs);
    return convs;
  },
};

export const notificationService = {
  getNotifications: (): Notification[] =>
    loadState<Notification[]>('notifications', INITIAL_NOTIFICATIONS),
  saveNotifications: (notifs: Notification[]): Notification[] => {
    saveState('notifications', notifs);
    return notifs;
  },
};

export const riderService = {
  getRiders: (): Rider[] => loadState<Rider[]>('riders', INITIAL_RIDERS),
  saveRiders: (riders: Rider[]): Rider[] => {
    saveState('riders', riders);
    return riders;
  },
  getDeliveries: (): Delivery[] => loadState<Delivery[]>('deliveries', INITIAL_DELIVERIES),
  saveDeliveries: (deliveries: Delivery[]): Delivery[] => {
    saveState('deliveries', deliveries);
    return deliveries;
  },
};

export const reviewService = {
  getReviews: (): Review[] => loadState<Review[]>('reviews', INITIAL_REVIEWS),
  saveReviews: (reviews: Review[]): Review[] => {
    saveState('reviews', reviews);
    return reviews;
  },
};

export const adminService = {
  updateSellerStatus: (sellers: Seller[], sellerId: string, status: SellerStatus): Seller[] => {
    const updated = sellers.map((s) => (s.id === sellerId ? { ...s, status } : s));
    return sellerService.saveSellers(updated);
  },
  updateStoreStatus: (stores: Store[], storeId: string, status: Store['status']): Store[] => {
    const updated = stores.map((st) => (st.id === storeId ? { ...st, status } : st));
    return storeService.saveStores(updated);
  },
  updateRiderApprovalStatus: (
    riders: Rider[],
    riderId: string,
    approvalStatus: RiderApprovalStatus,
    adminNotes?: string
  ): Rider[] => {
    const updated = riders.map((r) =>
      r.id === riderId
        ? {
            ...r,
            approvalStatus,
            adminNotes: adminNotes !== undefined ? adminNotes : r.adminNotes,
            status: approvalStatus === 'APPROVED' ? ('ONLINE' as const) : ('OFFLINE' as const),
          }
        : r
    );
    return riderService.saveRiders(updated);
  },
  updateOrderDeliveryStage: (
    orders: Order[],
    deliveries: Delivery[],
    orderId: string,
    deliveryStatus: DeliveryStatus,
    orderStatus: OrderStatus
  ): { orders: Order[]; deliveries: Delivery[] } => {
    const nextOrders = orders.map((o) =>
      o.id === orderId ? { ...o, deliveryStatus, orderStatus, updatedAt: new Date().toISOString() } : o
    );
    const nextDeliveries = deliveries.map((d) =>
      d.orderId === orderId ? { ...d, status: deliveryStatus, updatedAt: 'Just now' } : d
    );
    orderService.saveOrders(nextOrders);
    riderService.saveDeliveries(nextDeliveries);
    return { orders: nextOrders, deliveries: nextDeliveries };
  },
};
