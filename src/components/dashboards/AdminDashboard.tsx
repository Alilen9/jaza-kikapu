import React, { useState, useEffect } from 'react';
import { useMarket } from '../../context/MarketContext';
import { api } from '../../services/api';
import { AdminAnalytics, Store, ParentOrder } from '../../types';
import {
  Users,
  Store as StoreIcon,
  ShoppingBag,
  DollarSign,
  Radio,
  Bike,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useMarket();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [orders, setOrders] = useState<ParentOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'stores' | 'orders'>('analytics');

  const loadData = async () => {
    try {
      const stats = await api.getAdminAnalytics();
      setAnalytics(stats);

      const storeList = await api.getStores();
      setStores(storeList);

      const orderList = await api.getOrders();
      setOrders(orderList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStoreStatus = (storeId: string, newStatus: Store['status']) => {
    setStores(prev =>
      prev.map(s => (s.id === storeId ? { ...s, status: newStatus } : s))
    );
    showToast(`Store status updated to ${newStatus}`);
  };

  if (!analytics) {
    return <div className="p-8 text-center text-xs text-stone-500">Loading Admin Platform Controls...</div>;
  }

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-6">
      {/* Admin Header */}
      <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-stone-900">
              Platform Administration
            </h2>
            <div className="text-xs text-stone-500">
              Jaza Kikapu · Voi & Taita-Taveta County Operations Hub
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['analytics', 'stores', 'orders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize cursor-pointer transition-colors ${
                activeTab === tab
                  ? 'bg-[#1B4332] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Analytics (All numbers computed from real database state) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>Total Gross Merchandise</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-mono text-2xl font-bold text-stone-900">
                KES {analytics.totalGMV.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">Real-time marketplace transactions</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>Platform Commission</span>
                <DollarSign className="w-4 h-4 text-[#1B4332]" />
              </div>
              <div className="font-mono text-2xl font-bold text-[#1B4332]">
                KES {analytics.platformCommission.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">10% seller fee + KES 50 base</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>Active Digital Stalls</span>
                <StoreIcon className="w-4 h-4 text-amber-600" />
              </div>
              <div className="font-mono text-2xl font-bold text-stone-900">
                {analytics.activeSellers}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">{analytics.totalStores} registered businesses</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>Active Live Sessions</span>
                <Radio className="w-4 h-4 text-rose-600" />
              </div>
              <div className="font-mono text-2xl font-bold text-rose-600">
                {analytics.liveStreamsActive}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">{analytics.onlineRiders} delivery riders online</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 space-y-3">
            <h3 className="font-display font-bold text-base text-stone-900">
              Audit & Platform Integrity Check
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every marketplace calculation is validated against PostgreSQL ACID rules. Multi-seller parent orders are automatically partitioned into isolated seller orders. Commissions, rider fee shares, and Safaricom Daraja callbacks are tracked with immutable merchant request IDs.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Stores Management */}
      {activeTab === 'stores' && (
        <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-stone-900">
            Digital Stalls & Business Verification ({stores.length})
          </h3>

          <div className="divide-y divide-stone-100">
            {stores.map(s => (
              <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={s.logoImage}
                    alt={s.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                      <span>{s.name}</span>
                      <span className="font-normal text-stone-400 text-xs">({s.stallNumber})</span>
                    </div>
                    <div className="text-stone-500 mt-0.5">
                      {s.category} · {s.marketName} · Jaza Score: {s.jazaScore.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {s.status}
                  </span>

                  <button
                    onClick={() => handleUpdateStoreStatus(s.id, 'VERIFIED')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-[11px] hover:bg-emerald-100 cursor-pointer"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleUpdateStoreStatus(s.id, 'SUSPENDED')}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 font-semibold text-[11px] hover:bg-rose-100 cursor-pointer"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Orders & M-Pesa Log */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-stone-900">
            Orders & M-Pesa Transactions Log
          </h3>

          <div className="divide-y divide-stone-100">
            {orders.map(o => (
              <div key={o.id} className="py-3 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-stone-900">{o.orderNumber}</span>
                  <span className="font-mono font-bold text-stone-900">KES {o.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Customer: {o.customerName} ({o.customerPhone})</span>
                  <span>M-Pesa: {o.mpesaReceiptNumber || 'PENDING'}</span>
                </div>
                <div className="text-stone-400 text-[10px]">
                  Split: {o.sellerOrders.length} stall(s) · Delivery: KES {o.deliveryFee} · Platform Fee: KES {o.platformFee}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
