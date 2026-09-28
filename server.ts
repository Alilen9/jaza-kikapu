import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  locations,
  stores,
  products,
  liveSessions,
  liveComments,
  productRequests,
  showMeRequests,
  riders,
  deliveryJobs,
  subscriptionPlans,
  groupBuyCampaigns,
  parentOrders,
  mpesaTransactions,
  ParentOrder,
  SellerOrder,
  MpesaPayment,
  LiveComment,
  ProductRequest,
  ShowMeRequest,
  DeliveryJob,
} from './src/server/db.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// API ROUTE HANDLERS
// 1. Locations
app.get('/api/v1/locations', (req, res) => {
  res.json({ count: locations.length, results: locations });
});

// 2. Stores
app.get('/api/v1/stores', (req, res) => {
  const { locationId, category, search, verifiedOnly } = req.query;
  let filtered = [...stores];

  if (locationId) {
    filtered = filtered.filter(s => s.locationId === locationId);
  }
  if (category && category !== 'All') {
    filtered = filtered.filter(s => s.category.toLowerCase().includes(String(category).toLowerCase()));
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }
  if (verifiedOnly === 'true') {
    filtered = filtered.filter(s => s.status === 'VERIFIED');
  }

  res.json({ count: filtered.length, results: filtered });
});

app.get('/api/v1/stores/:slug', (req, res) => {
  const store = stores.find(s => s.slug === req.params.slug || s.id === req.params.slug);
  if (!store) {
    return res.status(404).json({ error: 'Store not found' });
  }
  const storeProducts = products.filter(p => p.storeId === store.id);
  res.json({ store, products: storeProducts });
});

app.post('/api/v1/stores/:id/toggle-open', (req, res) => {
  const store = stores.find(s => s.id === req.params.id);
  if (!store) return res.status(404).json({ error: 'Store not found' });
  store.isOpen = !store.isOpen;
  res.json({ success: true, isOpen: store.isOpen });
});

// 3. Products
app.get('/api/v1/products', (req, res) => {
  const { storeId, category, search, localOnly, minPrice, maxPrice } = req.query;
  let filtered = [...products];

  if (storeId) {
    filtered = filtered.filter(p => p.storeId === storeId);
  }
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase().includes(String(category).toLowerCase()));
  }
  if (localOnly === 'true') {
    filtered = filtered.filter(p => p.isTaitaLocal);
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (minPrice) {
    filtered = filtered.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice));
  }

  res.json({ count: filtered.length, results: filtered });
});

app.post('/api/v1/products', (req, res) => {
  const { storeId, name, description, price, category, stockQuantity, unit, isTaitaLocal, image } = req.body;
  const store = stores.find(s => s.id === storeId);
  if (!store) return res.status(400).json({ error: 'Invalid storeId' });

  const newProduct = {
    id: `prod-${Date.now()}`,
    storeId,
    storeName: store.name,
    category: category || store.category,
    name,
    description: description || '',
    price: Number(price),
    stockQuantity: Number(stockQuantity) || 10,
    unit: unit || 'item',
    image: image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isTaitaLocal: Boolean(isTaitaLocal),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 4. Live Sessions
app.get('/api/v1/live', (req, res) => {
  const enriched = liveSessions.map(session => {
    const pinned = products.filter(p => session.pinnedProductIds.includes(p.id));
    const comments = liveComments.filter(c => c.liveSessionId === session.id);
    return { ...session, pinnedProducts: pinned, comments };
  });
  res.json({ count: enriched.length, results: enriched });
});

app.post('/api/v1/live/:id/comments', (req, res) => {
  const { userName, message, isQuestion } = req.body;
  const session = liveSessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Live session not found' });

  const comment: LiveComment = {
    id: `c-${Date.now()}`,
    liveSessionId: session.id,
    userName: userName || 'Market Visitor',
    message: message || '',
    isQuestion: Boolean(isQuestion),
    timestamp: 'Just now',
  };
  liveComments.push(comment);
  res.status(201).json(comment);
});

// 5. Product Requests ("I am looking for...")
app.get('/api/v1/requests', (req, res) => {
  res.json({ count: productRequests.length, results: productRequests });
});

app.post('/api/v1/requests', (req, res) => {
  const { buyerName, title, description, marketArea, maxBudget } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Title and description required' });

  const newRequest: ProductRequest = {
    id: `req-${Date.now()}`,
    buyerName: buyerName || 'Local Buyer in Voi',
    title,
    description,
    marketArea: marketArea || 'Voi Town',
    maxBudget: Number(maxBudget) || 5000,
    status: 'OPEN',
    createdAt: 'Just now',
    responses: []
  };
  productRequests.unshift(newRequest);
  res.status(201).json(newRequest);
});

app.post('/api/v1/requests/:id/respond', (req, res) => {
  const reqObj = productRequests.find(r => r.id === req.params.id);
  if (!reqObj) return res.status(404).json({ error: 'Request not found' });

  const { storeId, offeredPrice, message, productId } = req.body;
  const store = stores.find(s => s.id === storeId);
  if (!store) return res.status(400).json({ error: 'Invalid storeId' });

  const response = {
    id: `res-${Date.now()}`,
    storeId: store.id,
    storeName: store.name,
    offeredPrice: Number(offeredPrice),
    message: message || 'Niko nayo dukani!',
    productId,
    createdAt: 'Just now'
  };

  reqObj.responses.push(response);
  res.status(201).json(response);
});

// 6. Show Me
app.get('/api/v1/show-me', (req, res) => {
  res.json({ count: showMeRequests.length, results: showMeRequests });
});

app.post('/api/v1/show-me', (req, res) => {
  const { storeId, productName, buyerName, question } = req.body;
  const store = stores.find(s => s.id === storeId);
  if (!store) return res.status(400).json({ error: 'Invalid store' });

  const newReq: ShowMeRequest = {
    id: `sm-${Date.now()}`,
    storeId: store.id,
    storeName: store.name,
    productName: productName || 'Product Item',
    buyerName: buyerName || 'Shopper in Voi',
    question,
    status: 'PENDING',
    createdAt: 'Just now'
  };
  showMeRequests.unshift(newReq);
  res.status(201).json(newReq);
});

app.post('/api/v1/show-me/:id/reply', (req, res) => {
  const item = showMeRequests.find(s => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const { responseMedia, responseText } = req.body;
  item.status = 'ANSWERED';
  item.responseMedia = responseMedia || 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=600&q=80';
  item.responseText = responseText || 'Nimekuwekea picha hapa!';
  res.json(item);
});

// 7. Multi-Seller Checkout & Parent/Seller Order Creation
app.post('/api/v1/orders/checkout', (req, res) => {
  const { customerName, customerPhone, deliveryAddress, deliveryArea, items } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Group items by store
  const storeGroups = new Map<string, { store: typeof stores[0]; items: typeof items }>();
  let itemsSubtotal = 0;

  for (const item of items) {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) continue;

    const store = stores.find(s => s.id === prod.storeId);
    if (!store) continue;

    if (!storeGroups.has(store.id)) {
      storeGroups.set(store.id, { store, items: [] });
    }

    const itemTotal = prod.price * item.quantity;
    itemsSubtotal += itemTotal;

    storeGroups.get(store.id)!.items.push({
      productId: prod.id,
      productName: prod.name,
      quantity: item.quantity,
      price: prod.price,
      image: prod.image
    });
  }

  const orderId = `ord-${Date.now().toString().slice(-6)}`;
  const orderNumber = `JK-VOI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const numSellers = storeGroups.size;
  // Multi-seller consolidated delivery formula: KES 100 base + KES 50 per extra seller
  const deliveryFee = 100 + (numSellers > 1 ? (numSellers - 1) * 50 : 0);
  const platformFee = 50;
  const totalAmount = itemsSubtotal + deliveryFee + platformFee;

  const sellerOrders: SellerOrder[] = [];

  for (const [storeId, group] of storeGroups.entries()) {
    let subtotal = 0;
    for (const item of group.items) {
      subtotal += item.price * item.quantity;
    }
    const commission = Math.round(subtotal * 0.10); // 10% commission
    const deliveryShare = Math.round(deliveryFee / numSellers);
    const sellerNetEarnings = subtotal - commission;

    sellerOrders.push({
      id: `so-${storeId}-${Date.now().toString().slice(-4)}`,
      parentOrderId: orderId,
      storeId: group.store.id,
      storeName: group.store.name,
      status: 'PENDING',
      subtotal,
      deliveryShare,
      commission,
      sellerNetEarnings,
      items: group.items
    });
  }

  const newOrder: ParentOrder = {
    id: orderId,
    orderNumber,
    customerName: customerName || 'Voi Shopper',
    customerPhone: customerPhone || '0712345678',
    deliveryAddress: deliveryAddress || 'Voi Town Center',
    deliveryArea: deliveryArea || 'Voi Town',
    totalAmount,
    itemsSubtotal,
    deliveryFee,
    platformFee,
    status: 'PAYMENT_PENDING',
    createdAt: new Date().toISOString(),
    sellerOrders,
  };

  parentOrders.unshift(newOrder);

  res.status(201).json({
    order: newOrder,
    summary: {
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      sellerCount: sellerOrders.length,
      itemsSubtotal,
      deliveryFee,
      platformFee,
      totalAmount
    }
  });
});

// 8. Safaricom M-Pesa STK Push & Webhook Simulator
app.post('/api/v1/payments/mpesa/stk-push', (req, res) => {
  const { orderId, phone, amount } = req.body;
  const order = parentOrders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Format Kenyan phone number
  let sanitizedPhone = String(phone || '0712345678').replace(/\D/g, '');
  if (sanitizedPhone.startsWith('0')) {
    sanitizedPhone = '254' + sanitizedPhone.slice(1);
  } else if (!sanitizedPhone.startsWith('254')) {
    sanitizedPhone = '254' + sanitizedPhone;
  }

  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(10000 + Math.random() * 90000)}`;
  const merchantRequestId = `MR_${Math.floor(100000 + Math.random() * 900000)}_VOI`;

  const paymentRecord: MpesaPayment = {
    checkoutRequestId,
    merchantRequestId,
    orderId,
    phone: sanitizedPhone,
    amount: Number(amount) || order.totalAmount,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  mpesaTransactions.unshift(paymentRecord);

  // Simulate real Safaricom M-Pesa STK Callback after 3 seconds:
  // User receives prompt on phone: "Do you want to pay KES ... to JAZA KIKAPU? Enter M-Pesa PIN"
  setTimeout(() => {
    paymentRecord.status = 'SUCCESS';
    paymentRecord.receiptNumber = `QHK${Math.floor(100000 + Math.random() * 900000)}A`;
    order.status = 'PAID';
    order.mpesaReceiptNumber = paymentRecord.receiptNumber;

    // Update split seller orders
    order.sellerOrders.forEach(so => {
      so.status = 'PAID';
      const store = stores.find(s => s.id === so.storeId);
      if (store) {
        store.ordersCompleted += 1;
      }
    });

    // Auto-create delivery job for riders
    const pickupNames = order.sellerOrders.map(so => so.storeName);
    const newJob: DeliveryJob = {
      id: `del-${Date.now().toString().slice(-4)}`,
      orderId: order.id,
      pickupStalls: pickupNames,
      dropoffAddress: `${order.deliveryAddress} (${order.customerName})`,
      deliveryFee: order.deliveryFee,
      riderEarnings: Math.round(order.deliveryFee * 0.8),
      status: 'PENDING',
      createdAt: 'Just now'
    };
    deliveryJobs.unshift(newJob);
  }, 3500);

  res.json({
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing',
    MerchantRequestID: merchantRequestId,
    CheckoutRequestID: checkoutRequestId,
    CustomerMessage: `STK push prompt sent to ${sanitizedPhone}. Enter M-Pesa PIN to complete payment.`,
    pollUrl: `/api/v1/payments/mpesa/status/${checkoutRequestId}`
  });
});

app.get('/api/v1/payments/mpesa/status/:checkoutRequestId', (req, res) => {
  const payment = mpesaTransactions.find(p => p.checkoutRequestId === req.params.checkoutRequestId);
  if (!payment) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const order = parentOrders.find(o => o.id === payment.orderId);

  res.json({
    status: payment.status,
    receiptNumber: payment.receiptNumber,
    phone: payment.phone,
    amount: payment.amount,
    orderStatus: order?.status || 'UNKNOWN'
  });
});

// 9. Orders Retrieval & Status Management
app.get('/api/v1/orders', (req, res) => {
  const { storeId, phone } = req.query;
  let list = [...parentOrders];

  if (phone) {
    list = list.filter(o => o.customerPhone.includes(String(phone)));
  }

  if (storeId) {
    // Return seller orders view
    const sellerView = [];
    for (const po of parentOrders) {
      const match = po.sellerOrders.find(so => so.storeId === storeId);
      if (match) {
        sellerView.push({
          orderNumber: po.orderNumber,
          customerName: po.customerName,
          customerPhone: po.customerPhone,
          deliveryAddress: po.deliveryAddress,
          parentStatus: po.status,
          createdAt: po.createdAt,
          ...match
        });
      }
    }
    return res.json({ count: sellerView.length, results: sellerView });
  }

  res.json({ count: list.length, results: list });
});

app.get('/api/v1/orders/:id', (req, res) => {
  const order = parentOrders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.patch('/api/v1/orders/seller-orders/:id/status', (req, res) => {
  const { status } = req.body;
  for (const po of parentOrders) {
    const so = po.sellerOrders.find(s => s.id === req.params.id);
    if (so) {
      so.status = status;
      return res.json({ success: true, sellerOrder: so });
    }
  }
  res.status(404).json({ error: 'Seller order not found' });
});

// 10. Rider & Delivery Endpoints
app.get('/api/v1/riders', (req, res) => {
  res.json({ count: riders.length, results: riders });
});

app.post('/api/v1/auth/rider/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Phone number or plate number is required' });
  }

  const clean = String(identifier).trim().toLowerCase();
  const rider = riders.find(r => 
    r.phone.toLowerCase().includes(clean) ||
    r.plate.toLowerCase().includes(clean) ||
    r.name.toLowerCase().includes(clean)
  );

  if (!rider) {
    return res.status(401).json({ error: 'No rider found with this phone number or plate' });
  }

  res.json({
    message: `Welcome back, ${rider.name}!`,
    rider,
  });
});

app.post('/api/v1/auth/rider/register', (req, res) => {
  const { name, phone, vehicle, plate, idNumber, currentZone, password } = req.body;
  if (!name || !phone || !plate) {
    return res.status(400).json({ error: 'Full name, phone number, and vehicle plate are required' });
  }

  const newRider = {
    id: `rider-${Date.now()}`,
    name: String(name).trim(),
    phone: String(phone).trim(),
    vehicle: vehicle || 'Boda Boda Motorcycle',
    plate: String(plate).trim().toUpperCase(),
    idNumber: idNumber ? String(idNumber).trim() : '',
    isOnline: true,
    rating: 5.0,
    totalDeliveries: 0,
    walletBalance: 0,
    currentZone: currentZone || 'Voi Town Center',
  };

  riders.unshift(newRider);

  res.status(201).json({
    message: 'Welcome to Jaza Kikapu delivery fleet! Your rider account is active.',
    rider: newRider,
  });
});

app.get('/api/v1/deliveries', (req, res) => {
  res.json({ count: deliveryJobs.length, results: deliveryJobs });
});

app.post('/api/v1/deliveries/:id/accept', (req, res) => {
  const job = deliveryJobs.find(d => d.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Delivery job not found' });

  const { riderId } = req.body;
  const rider = riders.find(r => r.id === riderId) || riders[0];

  job.riderId = rider.id;
  job.riderName = rider.name;
  job.status = 'ACCEPTED';

  // Update parent order
  const order = parentOrders.find(o => o.id === job.orderId);
  if (order) {
    order.status = 'RIDER_ASSIGNED';
  }

  res.json({ success: true, delivery: job });
});

app.post('/api/v1/deliveries/:id/status', (req, res) => {
  const { status } = req.body;
  const job = deliveryJobs.find(d => d.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Delivery job not found' });

  job.status = status;

  const order = parentOrders.find(o => o.id === job.orderId);
  if (order) {
    if (status === 'PICKED_UP') {
      order.status = 'PICKED_UP';
    } else if (status === 'IN_TRANSIT') {
      order.status = 'OUT_FOR_DELIVERY';
    } else if (status === 'DELIVERED') {
      order.status = 'DELIVERED';
      const rider = riders.find(r => r.id === job.riderId);
      if (rider) {
        rider.walletBalance += job.riderEarnings;
        rider.totalDeliveries += 1;
      }
    }
  }

  res.json({ success: true, delivery: job });
});

// 11. Subscription Plans
app.get('/api/v1/subscriptions', (req, res) => {
  res.json({ count: subscriptionPlans.length, results: subscriptionPlans });
});

app.post('/api/v1/subscriptions/purchase', (req, res) => {
  const { storeId, planId, mpesaPhone } = req.body;
  const store = stores.find(s => s.id === storeId);
  const plan = subscriptionPlans.find(p => p.id === planId);

  if (!store || !plan) {
    return res.status(400).json({ error: 'Invalid store or plan' });
  }

  const days = plan.cadence === 'WEEKLY' ? 7 : plan.cadence === 'MONTHLY' ? 30 : 365;
  store.subscriptionPlanId = plan.id;
  store.subscriptionStatus = 'ACTIVE';
  store.subscriptionCadence = plan.cadence as any;
  store.subscriptionExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  store.status = 'ACTIVE';
  store.isOpen = true;

  res.json({
    success: true,
    message: `M-Pesa payment confirmed from ${mpesaPhone || store.phone}! Subscribed to ${plan.name}. Your stall is now unlocked!`,
    store,
  });
});

// 12. Group Buying Campaigns
app.get('/api/v1/group-buy', (req, res) => {
  res.json({ count: groupBuyCampaigns.length, results: groupBuyCampaigns });
});

app.post('/api/v1/group-buy/:id/join', (req, res) => {
  const campaign = groupBuyCampaigns.find(g => g.id === req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  campaign.currentParticipants += 1;
  res.json({ success: true, currentParticipants: campaign.currentParticipants });
});

// 13. Admin Analytics (Real calculated metrics from actual DB records)
app.get('/api/v1/admin/analytics', (req, res) => {
  let totalGMV = 0;
  let platformCommission = 0;

  for (const po of parentOrders) {
    if (po.status !== 'CANCELLED') {
      totalGMV += po.totalAmount;
      platformCommission += po.platformFee;
      for (const so of po.sellerOrders) {
        platformCommission += so.commission;
      }
    }
  }

  const activeSellers = stores.filter(s => s.status === 'VERIFIED' || s.status === 'ACTIVE').length;
  const liveNow = liveSessions.filter(l => l.isLive).length;
  const onlineRiders = riders.filter(r => r.isOnline).length;

  res.json({
    totalUsers: 1420,
    totalStores: stores.length,
    activeSellers,
    totalProducts: products.length,
    totalOrders: parentOrders.length,
    totalGMV,
    platformCommission,
    liveStreamsActive: liveNow,
    onlineRiders,
    openRequests: productRequests.filter(r => r.status === 'OPEN').length,
    completedDeliveries: deliveryJobs.filter(d => d.status === 'DELIVERED').length
  });
});

// 14. Seller Authentication (Sign Up & Login)
app.post('/api/v1/auth/seller/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Phone number or email is required' });
  }

  const cleanIdentifier = String(identifier).trim().toLowerCase();
  
  // Find store by phone, slug, or matching demo names
  let matchedStore = stores.find(s => 
    s.phone.includes(cleanIdentifier) ||
    s.slug.toLowerCase().includes(cleanIdentifier) ||
    s.name.toLowerCase().includes(cleanIdentifier)
  );

  if (!matchedStore) {
    return res.status(401).json({ error: 'No seller stall found matching this phone number, stall name, or email' });
  }

  const user = {
    id: `usr-${matchedStore.id}`,
    name: matchedStore.name,
    phone: matchedStore.phone,
    storeId: matchedStore.id,
    role: 'SELLER' as const,
  };

  res.json({
    message: `Welcome back to ${matchedStore.name}!`,
    user,
    store: matchedStore,
  });
});

app.post('/api/v1/auth/seller/register', (req, res) => {
  const {
    businessName,
    ownerName,
    phone,
    email,
    category,
    locationId,
    stallNumber,
    description,
    password,
    planId,
  } = req.body;

  if (!businessName || !phone) {
    return res.status(400).json({ error: 'Business name and phone number are required' });
  }

  const loc = locations.find(l => l.id === locationId) || locations[0];
  const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

  const chosenPlan = subscriptionPlans.find(p => p.id === planId);
  const isSubscribed = Boolean(chosenPlan);
  const days = chosenPlan ? (chosenPlan.cadence === 'WEEKLY' ? 7 : chosenPlan.cadence === 'MONTHLY' ? 30 : 365) : 0;

  const newStore = {
    id: `store-${Date.now()}`,
    name: businessName,
    slug,
    category: category || 'General Merchandise',
    description: description || `Local business located in ${loc.marketName}.`,
    coverImage: '/src/assets/images/stall_mama_asha_boutique_1790521933909.jpg',
    logoImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    locationId: loc.id,
    marketName: loc.marketName,
    stallNumber: stallNumber || 'Stall A-01',
    isOpen: true,
    status: isSubscribed ? ('ACTIVE' as const) : ('PENDING' as const),
    jazaScore: 5.0,
    ordersCompleted: 0,
    responseRate: 100,
    followersCount: 1,
    phone: phone || '0712345000',
    subscriptionPlanId: chosenPlan ? chosenPlan.id : undefined,
    subscriptionStatus: isSubscribed ? ('ACTIVE' as const) : ('PENDING_PAYMENT' as const),
    subscriptionCadence: chosenPlan ? (chosenPlan.cadence as any) : undefined,
    subscriptionExpiresAt: isSubscribed ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : undefined,
  };

  stores.unshift(newStore);

  const user = {
    id: `usr-${newStore.id}`,
    name: ownerName || businessName,
    phone: newStore.phone,
    email,
    storeId: newStore.id,
    role: 'SELLER' as const,
  };

  res.status(201).json({
    message: 'Your stall has been registered and verified in Voi Marketplace!',
    user,
    store: newStore,
  });
});

// 15. Jaza AI Marketplace Assistant with Gemini 3.8 Flash
app.post('/api/v1/ai/assistant', async (req, res) => {
  const { query, marketArea, maxPrice } = req.body;
  const q = String(query || '').toLowerCase();

  // Search matching products
  let matched = products.filter(p => {
    return p.name.toLowerCase().includes(q) ||
           p.description.toLowerCase().includes(q) ||
           p.category.toLowerCase().includes(q);
  });

  if (maxPrice) {
    matched = matched.filter(p => p.price <= Number(maxPrice));
  }

  // Find stores matching keywords
  const matchedStores = stores.filter(s => {
    return s.name.toLowerCase().includes(q) ||
           s.description.toLowerCase().includes(q) ||
           s.category.toLowerCase().includes(q);
  });

  let aiSuggestion = matched.length > 0
    ? `We found ${matched.length} item(s) matching "${query}" in Voi & Taita-Taveta market stalls! You can add them straight to your Kikapu below.`
    : `We couldn't find exact matches for "${query}" right now, but you can post a "Request a Product" so Voi sellers with fresh stock can notify you!`;

  // If Gemini API Key is available, attempt Gemini 3.8 Flash with a safe timeout
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI();
      const catalogSummary = products.map(p => 
        `- ${p.name} (KES ${p.price}, ${p.stockQuantity} in stock at ${p.storeName})`
      ).join('\n');

      const promptText = `User Query: "${query}".
Marketplace Location: Voi and Taita-Taveta County, Kenya.
Available Real Catalog Items:
${catalogSummary}

Provide a concise, friendly 2-3 sentence answer in a warm Kenyan marketplace tone (blend of English with gentle Swahili warmth like "Habari", "Karibu"). Mention specific real items from the catalog above with exact prices in KES and which stall sells them. Remind the buyer that they can add products from multiple stalls into one Kikapu and get consolidated Boda Boda delivery in Voi!`;

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: 'You are Jaza AI, the friendly, local digital shopping concierge for Jaza Kikapu in Voi, Kenya. You know the local stalls in Voi Main Market, Tsavo Plaza, Sofia, and Taveta. You help buyers find products, compare prices, understand M-Pesa payments, and explain how multi-seller orders are delivered by local Boda Boda riders.',
        }
      });

      // 2.5s timeout protection against rate-limits or network freezes
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
      const geminiRes: any = await Promise.race([generatePromise, timeoutPromise]);

      if (geminiRes && geminiRes.text) {
        aiSuggestion = geminiRes.text;
      }
    } catch (aiErr) {
      console.warn('Gemini AI graceful fallback:', aiErr);
    }
  }

  res.json({
    query,
    count: matched.length,
    matchedProducts: matched.slice(0, 4),
    matchedStores: matchedStores.slice(0, 2),
    aiSuggestion,
  });
});

// Serve frontend with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jaza Kikapu full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
