import {
  Location,
  Store,
  Product,
  ParentOrder,
  SellerOrder,
  LiveSession,
  LiveComment,
  ProductRequest,
  ShowMeRequest,
  Rider,
  DeliveryJob,
  SubscriptionPlan,
  GroupBuyCampaign,
  AdminAnalytics,
} from '../types';

const BASE_URL = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errMessage = 'Request failed';
    try {
      const err = await res.json();
      errMessage = err.error || err.message || errMessage;
    } catch {
      // ignore
    }
    throw new Error(errMessage);
  }

  return res.json();
}

export const api = {
  // Locations
  getLocations: () => fetchJson<{ results: Location[] }>('/locations').then(r => r.results),

  // Stores
  getStores: (params?: { locationId?: string; category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.locationId) q.append('locationId', params.locationId);
    if (params?.category) q.append('category', params.category);
    if (params?.search) q.append('search', params.search);
    return fetchJson<{ results: Store[] }>(`/stores?${q.toString()}`).then(r => r.results);
  },

  getStoreBySlug: (slug: string) =>
    fetchJson<{ store: Store; products: Product[] }>(`/stores/${slug}`),

  toggleStoreOpen: (storeId: string) =>
    fetchJson<{ success: boolean; isOpen: boolean }>(`/stores/${storeId}/toggle-open`, { method: 'POST' }),

  // Products
  getProducts: (params?: { storeId?: string; category?: string; search?: string; localOnly?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.storeId) q.append('storeId', params.storeId);
    if (params?.category) q.append('category', params.category);
    if (params?.search) q.append('search', params.search);
    if (params?.localOnly) q.append('localOnly', 'true');
    return fetchJson<{ results: Product[] }>(`/products?${q.toString()}`).then(r => r.results);
  },

  addProduct: (productData: Partial<Product>) =>
    fetchJson<Product>('/products', { method: 'POST', body: JSON.stringify(productData) }),

  // Live Sessions
  getLiveSessions: () =>
    fetchJson<{ results: LiveSession[] }>('/live').then(r => r.results),

  addLiveComment: (sessionId: string, userName: string, message: string, isQuestion: boolean) =>
    fetchJson<LiveComment>(`/live/${sessionId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ userName, message, isQuestion }),
    }),

  // Multi-seller Checkout & Orders
  checkout: (data: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryArea: string;
    items: { productId: string; quantity: number }[];
  }) => fetchJson<{ order: ParentOrder }>('/orders/checkout', { method: 'POST', body: JSON.stringify(data) }),

  getOrders: (params?: { phone?: string; storeId?: string }) => {
    const q = new URLSearchParams();
    if (params?.phone) q.append('phone', params.phone);
    if (params?.storeId) q.append('storeId', params.storeId);
    return fetchJson<{ results: ParentOrder[] }>(`/orders?${q.toString()}`).then(r => r.results);
  },

  getOrderById: (id: string) =>
    fetchJson<ParentOrder>(`/orders/${id}`),

  updateSellerOrderStatus: (sellerOrderId: string, status: string) =>
    fetchJson<{ success: boolean; sellerOrder: SellerOrder }>(`/orders/seller-orders/${sellerOrderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Safaricom M-Pesa STK Push
  initiateMpesaSTK: (data: { orderId: string; phone: string; amount: number }) =>
    fetchJson<{
      ResponseCode: string;
      ResponseDescription: string;
      MerchantRequestID: string;
      CheckoutRequestID: string;
      CustomerMessage: string;
      pollUrl: string;
    }>('/payments/mpesa/stk-push', { method: 'POST', body: JSON.stringify(data) }),

  pollMpesaStatus: (checkoutRequestId: string) =>
    fetchJson<{
      status: 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED';
      receiptNumber?: string;
      phone: string;
      amount: number;
      orderStatus: string;
    }>(`/payments/mpesa/status/${checkoutRequestId}`),

  // Product Requests
  getProductRequests: () =>
    fetchJson<{ results: ProductRequest[] }>('/requests').then(r => r.results),

  createProductRequest: (data: { buyerName: string; title: string; description: string; marketArea: string; maxBudget: number }) =>
    fetchJson<ProductRequest>('/requests', { method: 'POST', body: JSON.stringify(data) }),

  respondToProductRequest: (requestId: string, data: { storeId: string; offeredPrice: number; message: string; productId?: string }) =>
    fetchJson<{ id: string; storeName: string; offeredPrice: number; message: string }>(`/requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Show Me
  getShowMeRequests: () =>
    fetchJson<{ results: ShowMeRequest[] }>('/show-me').then(r => r.results),

  createShowMeRequest: (data: { storeId: string; productName: string; buyerName: string; question: string }) =>
    fetchJson<ShowMeRequest>('/show-me', { method: 'POST', body: JSON.stringify(data) }),

  replyShowMeRequest: (id: string, data: { responseMedia?: string; responseText: string }) =>
    fetchJson<ShowMeRequest>(`/show-me/${id}/reply`, { method: 'POST', body: JSON.stringify(data) }),

  // Riders & Deliveries
  getRiders: () => fetchJson<{ results: Rider[] }>('/riders').then(r => r.results),
  getDeliveries: () => fetchJson<{ results: DeliveryJob[] }>('/deliveries').then(r => r.results),
  acceptDelivery: (deliveryId: string, riderId: string) =>
    fetchJson<{ success: boolean; delivery: DeliveryJob }>(`/deliveries/${deliveryId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ riderId }),
    }),
  updateDeliveryStatus: (deliveryId: string, status: string) =>
    fetchJson<{ success: boolean; delivery: DeliveryJob }>(`/deliveries/${deliveryId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  // Seller Authentication
  sellerLogin: (data: { identifier: string; password?: string }) =>
    fetchJson<{ message: string; user: any; store: Store }>('/auth/seller/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sellerRegister: (data: {
    businessName: string;
    ownerName: string;
    phone: string;
    email?: string;
    category: string;
    locationId: string;
    stallNumber: string;
    description: string;
    password?: string;
    planId?: string;
  }) =>
    fetchJson<{ message: string; user: any; store: Store }>('/auth/seller/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Rider Authentication
  riderLogin: (data: { identifier: string; password?: string }) =>
    fetchJson<{ message: string; rider: Rider }>('/auth/rider/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  riderRegister: (data: {
    name: string;
    phone: string;
    vehicle: string;
    plate: string;
    idNumber?: string;
    currentZone?: string;
    password?: string;
  }) =>
    fetchJson<{ message: string; rider: Rider }>('/auth/rider/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Subscriptions & Plans
  getSubscriptions: () => fetchJson<{ results: SubscriptionPlan[] }>('/subscriptions').then(r => r.results),
  purchaseSubscription: (storeId: string, planId: string, mpesaPhone?: string) =>
    fetchJson<{ success: boolean; message: string; store: Store }>('/subscriptions/purchase', {
      method: 'POST',
      body: JSON.stringify({ storeId, planId, mpesaPhone }),
    }),

  // Group Buying
  getGroupBuy: () => fetchJson<{ results: GroupBuyCampaign[] }>('/group-buy').then(r => r.results),
  joinGroupBuy: (campaignId: string) =>
    fetchJson<{ success: boolean; currentParticipants: number }>(`/group-buy/${campaignId}/join`, { method: 'POST' }),

  // Admin Analytics
  getAdminAnalytics: () => fetchJson<AdminAnalytics>('/admin/analytics'),

  // Jaza AI Assistant
  askAIAssistant: (query: string, marketArea?: string, maxPrice?: number) =>
    fetchJson<{
      query: string;
      count: number;
      matchedProducts: Product[];
      matchedStores: Store[];
      aiSuggestion: string;
    }>('/ai/assistant', { method: 'POST', body: JSON.stringify({ query, marketArea, maxPrice }) }),
};
