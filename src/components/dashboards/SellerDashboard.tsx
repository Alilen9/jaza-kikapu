import React, { useState, useEffect } from 'react';
import { useMarket } from '../../context/MarketContext';
import { api } from '../../services/api';
import { Store, Product, SellerOrder, SubscriptionPlan } from '../../types';
import {
  Package,
  TrendingUp,
  DollarSign,
  Radio,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { showToast, setSelectedLiveSession, currentSellerStore, sellerLogout } = useMarket();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'subscriptions'>('overview');

  // Add Product Form
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(1200);
  const [newProductCategory, setNewProductCategory] = useState('Fashion & Apparel');
  const [newProductStock, setNewProductStock] = useState(10);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const loadData = async () => {
    try {
      const stores = await api.getStores();
      const targetStore = currentSellerStore || stores[0];
      setStore(targetStore);

      const prods = await api.getProducts({ storeId: targetStore.id });
      setProducts(prods);

      const ordersRes = await api.getOrders({ storeId: targetStore.id });
      setSellerOrders(ordersRes);

      const subPlans = await api.getSubscriptions();
      setPlans(subPlans);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentSellerStore]);

  const handleToggleOpen = async () => {
    if (!store) return;
    try {
      const res = await api.toggleStoreOpen(store.id);
      setStore(prev => prev ? { ...prev, isOpen: res.isOpen } : null);
      showToast(res.isOpen ? 'Your digital stall is now OPEN!' : 'Your stall is marked CLOSED');
    } catch {
      showToast('Error updating status');
    }
  };

  const handleUpdateOrderStatus = async (sellerOrderId: string, newStatus: string) => {
    try {
      await api.updateSellerOrderStatus(sellerOrderId, newStatus);
      showToast(`Order updated to ${newStatus}`);
      loadData();
    } catch {
      showToast('Failed to update order');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store || !newProductName.trim()) return;

    try {
      await api.addProduct({
        storeId: store.id,
        name: newProductName,
        price: Number(newProductPrice),
        category: newProductCategory,
        stockQuantity: Number(newProductStock),
        unit: 'item',
        isTaitaLocal: true,
      });
      showToast(`Added ${newProductName} to your stall catalog!`);
      setIsAddingProduct(false);
      setNewProductName('');
      loadData();
    } catch {
      showToast('Failed to add product');
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!store) return;
    try {
      await api.purchaseSubscription(store.id, planId);
      showToast('Subscribed to plan! Features unlocked.');
      loadData();
    } catch {
      showToast('Subscription error');
    }
  };

  if (!store) {
    return <div className="p-8 text-center text-xs text-stone-500">Loading Seller Stall Console...</div>;
  }

  // Calculate earnings
  const totalRevenue = sellerOrders.reduce((sum, o) => sum + (o.sellerNetEarnings || 0), 0);

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-6">
      {/* Stall Hero Header */}
      <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={store.logoImage}
            alt={store.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-stone-900">
                {store.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                {store.status}
              </span>
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              {store.stallNumber} · {store.marketName} · Jaza Score: <strong>{store.jazaScore.toFixed(1)}</strong>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleOpen}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
              store.isOpen
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-stone-100 text-stone-600 border-stone-300'
            }`}
          >
            {store.isOpen ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-stone-400" />}
            <span>{store.isOpen ? 'Stall is OPEN' : 'Stall is CLOSED'}</span>
          </button>

          <button
            onClick={() => {
              setSelectedLiveSession({
                id: `live-${store.id}-${Date.now()}`,
                storeId: store.id,
                storeName: store.name,
                storeLogo: store.logoImage,
                title: `Live Broadcast from ${store.name}`,
                isLive: true,
                viewerCount: 1,
                pinnedProductIds: products.slice(0, 2).map(p => p.id),
                streamVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-colorful-clothes-39906-large.mp4',
                startedAt: new Date().toISOString()
              });
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E63946] hover:bg-[#D62839] text-white text-xs font-bold cursor-pointer shadow-sm"
          >
            <Radio className="w-4 h-4" />
            <span>Go Live Studio</span>
          </button>

          <button
            onClick={sellerLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-semibold cursor-pointer border border-stone-200 transition-colors"
            title="Log out of stall"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold">
        {(['overview', 'orders', 'products', 'subscriptions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl capitalize cursor-pointer transition-colors ${
              activeTab === tab
                ? 'bg-[#1B4332] text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200">
              <div className="text-xs text-stone-500 font-medium">Net Payouts (Wallet)</div>
              <div className="font-mono text-xl font-bold text-stone-900 mt-1">
                KES {totalRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">Ready for M-Pesa withdrawal</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200">
              <div className="text-xs text-stone-500 font-medium">Stall Split Orders</div>
              <div className="font-mono text-xl font-bold text-stone-900 mt-1">
                {sellerOrders.length}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">{store.ordersCompleted} all-time fulfilled</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200">
              <div className="text-xs text-stone-500 font-medium">Active Products</div>
              <div className="font-mono text-xl font-bold text-stone-900 mt-1">
                {products.length}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">100% listed in Voi Market</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200">
              <div className="text-xs text-stone-500 font-medium">Community Followers</div>
              <div className="font-mono text-xl font-bold text-stone-900 mt-1">
                {store.followersCount}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">Receive live notifications</div>
            </div>
          </div>

          {/* Recent Split Orders */}
          <div className="bg-white rounded-3xl border border-[#E6E0D4] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-stone-900">
                Recent Orders for Your Stall
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-[#1B4332] font-semibold underline"
              >
                View All Orders
              </button>
            </div>

            {sellerOrders.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400">
                No orders for your stall yet. Keep your stall open!
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {sellerOrders.map(o => (
                  <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-stone-900">
                        Order #{o.orderNumber || o.id} · <span className="font-normal text-stone-500">{o.customerName}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Items: {o.items?.map((i: any) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="font-mono font-bold text-stone-900">
                          KES {o.subtotal?.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Net: KES {o.sellerNetEarnings?.toLocaleString()}
                        </div>
                      </div>

                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-xl border border-stone-300 bg-white font-semibold"
                      >
                        <option value="PAID">PAID</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                        <option value="PICKED_UP">PICKED UP</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-stone-900">
            Stall Split Orders Management
          </h3>
          <p className="text-xs text-stone-500">
            When a customer fills their Kikapu from multiple sellers, only items belonging to your stall appear here.
          </p>

          <div className="space-y-3">
            {sellerOrders.map(o => (
              <div key={o.id} className="p-4 rounded-2xl border border-stone-200 bg-[#FBF9F5] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900">{o.orderNumber || o.id}</span>
                    <span className="text-stone-400 mx-2">·</span>
                    <span className="text-stone-600">Buyer: {o.customerName} ({o.customerPhone})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-[11px]">
                    Status: {o.status}
                  </span>
                </div>

                <div className="divide-y divide-stone-200 bg-white rounded-xl p-3">
                  {o.items?.map((item: any) => (
                    <div key={item.productId} className="py-1.5 flex justify-between text-xs">
                      <span>{item.quantity} × {item.productName}</span>
                      <span className="font-mono font-semibold">KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200 text-xs">
                  <div className="text-stone-600">
                    Subtotal: <strong>KES {o.subtotal?.toLocaleString()}</strong> · Commission (10%): -KES {o.commission?.toLocaleString()} · Net Stall Earnings: <strong className="text-emerald-700">KES {o.sellerNetEarnings?.toLocaleString()}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateOrderStatus(o.id, 'PREPARING')}
                      className="px-3 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 font-semibold text-[11px]"
                    >
                      Set Preparing
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(o.id, 'READY_FOR_PICKUP')}
                      className="px-3 py-1 rounded-lg bg-[#1B4332] text-white hover:bg-[#143225] font-semibold text-[11px]"
                    >
                      Ready for Rider
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Products */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                Stall Catalog ({products.length} Products)
              </h3>
              <p className="text-xs text-stone-500">Manage real stock available in your physical stall</p>
            </div>
            <button
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D95D39] text-white text-xs font-semibold cursor-pointer hover:bg-[#C24E2C]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Add Product Inline Form */}
          {isAddingProduct && (
            <form onSubmit={handleAddProduct} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3 text-xs">
              <div className="font-semibold text-stone-800">Add Item to Stall Catalog</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="e.g. Handmade Sisal Tote Bag"
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Price (KES)</label>
                  <input
                    type="number"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Category</label>
                  <input
                    type="text"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-3 py-1.5 text-stone-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1B4332] text-white font-semibold rounded-xl"
                >
                  Save Item
                </button>
              </div>
            </form>
          )}

          {/* Product Items Table */}
          <div className="divide-y divide-stone-100">
            {products.map(p => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-semibold text-stone-900">{p.name}</h5>
                    <div className="text-[11px] text-stone-500">{p.category} · Stock: {p.stockQuantity} {p.unit}s</div>
                  </div>
                </div>

                <div className="font-mono font-bold text-stone-900 text-sm">
                  KES {p.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Subscriptions */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-900">
              Stall Subscription Plans
            </h3>
            <p className="text-xs text-stone-500">
              Flexible vendor plans configured by the administrator for market day traders and permanent shops.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map(p => {
              const isActive = store.subscriptionPlanId === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    isActive ? 'border-[#1B4332] bg-[#E8F0EC]/40 shadow-sm' : 'border-stone-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-xs text-stone-900">{p.name}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-100 font-bold">
                        {p.cadence}
                      </span>
                    </div>

                    <div className="font-mono font-extrabold text-2xl text-stone-900 mb-2">
                      KES {p.price.toLocaleString()}
                    </div>

                    <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-stone-700">
                      <div>✓ Up to <strong>{p.productLimit}</strong> products</div>
                      <div>✓ Live Selling: <strong>{p.canLiveStream ? 'Enabled' : 'Disabled'}</strong></div>
                      <div>✓ Featured Placement: <strong>{p.featuredPlacement ? 'Yes' : 'No'}</strong></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribe(p.id)}
                    disabled={isActive}
                    className={`w-full mt-6 py-2.5 rounded-xl font-semibold text-xs cursor-pointer ${
                      isActive
                        ? 'bg-[#1B4332] text-white cursor-default'
                        : 'bg-stone-900 hover:bg-black text-white'
                    }`}
                  >
                    {isActive ? 'Current Plan' : 'Subscribe Now'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
