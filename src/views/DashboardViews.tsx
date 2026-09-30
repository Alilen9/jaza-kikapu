import React, { useState } from 'react';
import {
  ShoppingBag,
  Package,
  Store as StoreIcon,
  Radio,
  Sparkles,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Bike,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  CreditCard,
  Users,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { DeliveryStatus, SellerStatus } from '../types/marketplace';
import { SmartImage } from '../components/SmartImage';

const DELIVERY_STEPS: { key: DeliveryStatus; label: string }[] = [
  { key: 'ORDER_CONFIRMED', label: 'Order Confirmed' },
  { key: 'SELLER_PREPARING', label: 'Seller Preparing' },
  { key: 'RIDER_ASSIGNED', label: 'Rider Assigned' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

export const BuyerDashboardView: React.FC = () => {
  const {
    user,
    isAuthenticated,
    openAuthModal,
    orders,
    stores,
    payments,
    reviews,
    basket,
    navigate,
    setIsKikapuDrawerOpen,
  } = useMarketplace();

  const [tab, setTab] = useState<
    | 'Orders'
    | 'My Kikapu'
    | 'Saved Stores'
    | 'Following'
    | 'Addresses'
    | 'Payments'
    | 'Reviews'
    | 'Profile'
  >('Orders');

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 pb-24">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Buyer Account Required
            </p>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              Sign Up & Log In to View Your Buyer Account
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Anyone can browse Jaza Kikapu without an account. To build your Kikapu, checkout via
              M-Pesa, and track Jaza Rider deliveries, please Sign Up and Log In.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal('BUYER_SIGNUP')}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              1. Buyer Sign Up
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('BUYER_LOGIN')}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              2. Buyer Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const savedStores = stores.filter((s) => user.savedStoreIds.includes(s.id));
  const followedStores = stores.filter((s) => user.followingSellerIds.includes(s.sellerId));

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-emerald-900">Free Buyer Account</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Jambo, {user.name}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {user.phone} · Default Market: Voi, Taita-Taveta
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('messages')}
            className="px-3.5 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            Messages
          </button>
          <button
            type="button"
            onClick={() => navigate('notifications')}
            className="px-3.5 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            Notifications
          </button>
          <button
            type="button"
            onClick={() => navigate('seller-onboarding')}
            className="px-4 py-2 rounded-lg bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
          >
            Open a Seller Stall
          </button>
        </div>
      </div>

      {/* Buyer Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
        {(
          [
            'Orders',
            'My Kikapu',
            'Saved Stores',
            'Following',
            'Addresses',
            'Payments',
            'Reviews',
            'Profile',
          ] as const
        ).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              tab === t ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Orders' && (
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStepIdx = DELIVERY_STEPS.findIndex(
              (s) => s.key === order.deliveryStatus
            );
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-stone-200 p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-mono-tabular text-sm font-bold text-stone-900">
                      ORDER #{order.id}
                    </span>
                    <span className="text-xs text-stone-500 ml-2">
                      · M-Pesa Ref: <strong className="font-mono-tabular">{order.mpesaReceipt}</strong>
                    </span>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Delivering to: {order.address.landmark}, {order.address.town} · Rider:{' '}
                      <strong className="text-stone-800">{order.riderName}</strong> ({order.riderPhone})
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-tabular text-base font-bold text-emerald-900">
                      KSh {order.total.toLocaleString()}
                    </div>
                    <div className="text-xs font-semibold text-amber-800">
                      Status: {order.deliveryStatus.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>

                {/* 6-Stage Delivery Pipeline */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
                  {DELIVERY_STEPS.map((st, idx) => {
                    const done = idx <= currentStepIdx;
                    return (
                      <div
                        key={st.key}
                        className={`p-2.5 rounded-lg border text-xs ${
                          done
                            ? 'bg-emerald-50 border-emerald-800/40 text-emerald-950 font-semibold'
                            : 'bg-stone-50 border-stone-200 text-stone-400'
                        }`}
                      >
                        <div className="font-mono-tabular text-[10px]">0{idx + 1}</div>
                        <div className="truncate mt-0.5">{st.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Multi-Seller Split Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {order.sellerOrders.map((so) => (
                    <div
                      key={so.id}
                      className="p-3 rounded-lg bg-[#FAF9F5] border border-stone-200/80 text-xs space-y-1"
                    >
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>
                          {so.storeName} ({so.locationName})
                        </span>
                        <span className="font-mono-tabular">KSh {so.subtotal.toLocaleString()}</span>
                      </div>
                      {so.items.map((it) => (
                        <p key={it.productId} className="text-stone-600">
                          {it.quantity}× {it.productName}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'My Kikapu' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900">
              Active Kikapu ({basket.length} product lines)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Open your Kikapu drawer or full page to adjust quantities or checkout via M-Pesa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsKikapuDrawerOpen(true)}
            className="px-4 py-2 bg-emerald-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Open My Kikapu
          </button>
        </div>
      )}

      {(tab === 'Saved Stores' || tab === 'Following') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(tab === 'Saved Stores' ? savedStores : followedStores).map((st) => (
            <div
              key={st.id}
              className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-stone-900">{st.businessName}</h3>
                <p className="text-xs text-stone-500">
                  {st.categoryName} · {st.locationName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('store-detail', { storeSlug: st.slug })}
                className="px-3.5 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Visit Stall
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'Addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white p-4 rounded-xl border border-stone-200 space-y-1 text-xs"
            >
              <div className="font-bold text-stone-900">{addr.label}</div>
              <p className="text-stone-600">
                {addr.landmark}, {addr.town}
              </p>
              <p className="font-mono-tabular text-stone-500">{addr.phone}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'Payments' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="p-3">M-Pesa Receipt</th>
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {payments.map((pay) => (
                <tr key={pay.id}>
                  <td className="p-3 font-mono-tabular font-semibold text-emerald-900">
                    {pay.mpesaReceiptNumber}
                  </td>
                  <td className="p-3 text-stone-800">{pay.description}</td>
                  <td className="p-3 font-mono-tabular font-bold">
                    KSh {pay.amountKsh.toLocaleString()}
                  </td>
                  <td className="p-3 text-stone-500">{pay.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Reviews' && (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-xl border border-stone-200 text-xs">
              <div className="font-bold text-stone-900">
                {r.authorName} · {'★'.repeat(r.rating)}
              </div>
              <p className="text-stone-600 mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'Profile' && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 max-w-md space-y-2 text-xs">
          <p>
            <strong>Full Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> <span className="font-mono-tabular">{user.phone}</span>
          </p>
          <p>
            <strong>Account Role:</strong> {user.role}
          </p>
        </div>
      )}
    </div>
  );
};

export const SellerOnboardingView: React.FC = () => {
  const {
    categories,
    locations,
    applyToBecomeSeller,
    openAuthModal,
    sellers,
    stores,
  } = useMarketplace();

  // Personal details
  const [personalName, setPersonalName] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Business details
  const [businessName, setBusinessName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-boutiques');
  const [locationId, setLocationId] = useState(locations[0]?.id || 'loc-voi');
  const [businessType, setBusinessType] = useState<'Physical Shop' | 'Online Business' | 'Hybrid'>(
    'Physical Shop'
  );
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('2547');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // Verification details
  const [nationalIdOrRegNumber, setNationalIdOrRegNumber] = useState('');
  const [mpesaPayoutPhone, setMpesaPayoutPhone] = useState('+254 7');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittedSellerId, setSubmittedSellerId] = useState<string | null>(null);

  const submittedSeller = sellers.find((s) => s.id === submittedSellerId);
  const submittedStore = stores.find((st) => st.id === submittedSeller?.storeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!businessName.trim() || !personalName.trim()) {
      setError('Please enter your full name and business/store name.');
      return;
    }
    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAgreed) {
      setError('Please agree to the Jaza Kikapu Seller Terms.');
      return;
    }
    const created = applyToBecomeSeller({
      personalName,
      businessName,
      email: email || `${businessName.toLowerCase().replace(/[^a-z0-9]+/g, '')}@jazakikapu.co.ke`,
      categoryId,
      locationId,
      businessType,
      description:
        description ||
        `Quality ${categories.find((c) => c.id === categoryId)?.name} digital stall in Taita-Taveta.`,
      phone,
      whatsapp,
      nationalIdOrRegNumber: nationalIdOrRegNumber || 'ID-PENDING',
      mpesaPayoutPhone: mpesaPayoutPhone || phone,
      logoUrl: logoUrl || undefined,
      bannerUrl: bannerUrl || undefined,
    });
    setSubmittedSellerId(created.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-3">
        <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
          Jaza Kikapu Seller Application · /seller/apply
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">
          Apply to Become a Seller on Jaza Kikapu
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Apply → Admin Review → Approved → Seller Login → Choose Store Subscription → Pay → Store Activated
        </p>

        {/* 4-Step Pipeline Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
          {[
            { step: '01', title: 'Apply as Seller', desc: 'status = PENDING' },
            { step: '02', title: 'Admin Review', desc: 'status = APPROVED' },
            { step: '03', title: 'Seller Login', desc: 'Sign in at /login' },
            { step: '04', title: 'Activate Store', desc: 'storeStatus = ACTIVE' },
          ].map((item, i) => (
            <div
              key={item.step}
              className={`p-3 rounded-xl border ${
                i === 0
                  ? 'bg-emerald-900/60 border-emerald-500 text-white'
                  : 'bg-stone-800/80 border-stone-700 text-stone-300'
              }`}
            >
              <div className="font-mono-tabular text-[11px] text-amber-400 font-bold">
                STEP {item.step}
              </div>
              <div className="font-bold mt-0.5">{item.title}</div>
              <div className="text-[11px] opacity-80">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {submittedSeller ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono-tabular font-bold text-amber-800 uppercase">
                status = {submittedSeller.status} · storeStatus = {submittedStore?.status || 'INACTIVE'}
              </span>
              <h2 className="font-display text-2xl font-bold text-stone-900 mt-1">
                Your seller application has been submitted. Our admin team will review your application.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Application for <strong>"{submittedSeller.businessName}"</strong> is now in the{' '}
                <strong>Admin Marketplace Control Center</strong> queue. Once approved, sign in via{' '}
                <strong>Seller Login</strong> to choose your Store Subscription Plan and activate your store.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-stone-500">Applicant:</span>
              <p className="font-bold text-stone-900">{submittedSeller.personalName}</p>
            </div>
            <div>
              <span className="text-stone-500">Business / Store:</span>
              <p className="font-bold text-stone-900">{submittedSeller.businessName}</p>
            </div>
            <div>
              <span className="text-stone-500">Seller Status:</span>
              <p className="font-mono-tabular font-bold text-amber-800">{submittedSeller.status}</p>
            </div>
            <div>
              <span className="text-stone-500">Store Status:</span>
              <p className="font-mono-tabular font-bold text-stone-700">
                {submittedStore?.status || 'INACTIVE'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal('SELLER_LOGIN')}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Return to Seller Login
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('ADMIN_LOGIN')}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Open Admin Portal to Review Application
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900">
              {error}
            </div>
          )}

          {/* 1. Personal Details */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="pb-2 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-stone-900">
                1. Personal Details
              </h2>
              <button
                type="button"
                onClick={() => openAuthModal('SELLER_LOGIN')}
                className="text-xs font-semibold text-emerald-900 hover:underline cursor-pointer"
              >
                Already Approved? Seller Sign In →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={personalName}
                  onChange={(e) => setPersonalName(e.target.value)}
                  placeholder="e.g., Juma Mkangoma"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@jazakikapu.co.ke"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* 2. Business Details */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="pb-2 border-b border-stone-100">
              <h2 className="font-display text-lg font-bold text-stone-900">
                2. Business Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Business / Store Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., Voi Coastal Spices & Grains"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Business Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Location (Voi / Wundanyi / Mwatate / Taveta / Other)
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.county})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Physical Shop or Online Business
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="Physical Shop">Physical Shop / Market Stall</option>
                  <option value="Online Business">Online Business</option>
                  <option value="Hybrid">Both Physical & Online</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Business Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your products and where your shop or stall is located..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Store Logo URL (Optional)
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Store Banner URL (Optional)
                </label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* 3. Verification Details */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="pb-2 border-b border-stone-100">
              <h2 className="font-display text-lg font-bold text-stone-900">
                3. Verification Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  National ID or Business Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={nationalIdOrRegNumber}
                  onChange={(e) => setNationalIdOrRegNumber(e.target.value)}
                  placeholder="e.g., ID-29481023 or BN-V8821"
                  className="w-full px-3 py-2 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  M-Pesa Payout Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={mpesaPayoutPhone}
                  onChange={(e) => setMpesaPayoutPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="rounded border-stone-300 text-emerald-900 mt-0.5"
              />
              <span>
                I agree to the <strong>Jaza Kikapu Seller Terms & Verification Policy</strong>. I
                understand my account begins with <code>status = PENDING</code> and{' '}
                <code>storeStatus = INACTIVE</code> until Admin approval and Store Subscription
                payment.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl cursor-pointer uppercase tracking-wider"
          >
            SUBMIT SELLER APPLICATION
          </button>
        </form>
      )}
    </div>
  );
};

export const SellerDashboardView: React.FC = () => {
  const {
    user,
    isAuthenticated,
    openAuthModal,
    activeSeller,
    activeSellerStore,
    products,
    orders,
    categories,
    pricingConfig,
    boosts,
    conversations,
    addOrUpdateProduct,
    deleteProduct,
    createSellerPost,
    purchaseStoreSubscription,
    purchaseProductBoost,
    purchaseGoLivePackage,
    navigate,
  } = useMarketplace();

  const [section, setSection] = useState<
    | 'Overview'
    | 'My Store'
    | 'Products'
    | 'Orders'
    | 'Posts'
    | 'Go Live'
    | 'Subscriptions'
    | 'Boost Products'
    | 'Messages'
    | 'Analytics'
    | 'Wallet'
    | 'Settings'
  >('Overview');

  const activeStore = activeSellerStore;
  const myProducts = products.filter((p) => p.storeId === activeStore.id);

  // New Product Form State
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(500);
  const [prodCompare, setProdCompare] = useState(650);
  const [prodStock, setProdStock] = useState(20);
  const [prodUnit, setProdUnit] = useState('1 Piece');
  const [prodCatId, setProdCatId] = useState(activeStore.categoryId);
  const [prodDesc, setProdDesc] = useState('');

  // Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postBadge, setPostBadge] = useState('New Stock');
  const [postLinkedProd, setPostLinkedProd] = useState(myProducts[0]?.id || '');

  // Boost Form State
  const [boostProdId, setBoostProdId] = useState(myProducts[0]?.id || products[0]?.id);
  const [boostPlanId, setBoostPlanId] = useState(pricingConfig.boostPlans[0]?.id);
  const [phone, setPhone] = useState(activeSeller.phone);
  const [selectedActivationPlanId, setSelectedActivationPlanId] = useState(
    pricingConfig.storePlans[3]?.id || pricingConfig.storePlans[0]?.id
  );
  const [activationPaymentMethod, setActivationPaymentMethod] = useState<
    'MPESA_STK' | 'CARD' | 'PAY_LATER'
  >('MPESA_STK');
  const [activatingSub, setActivatingSub] = useState(false);

  // Go Live Form State
  const [livePlanId, setLivePlanId] = useState(pricingConfig.goLivePlans[0]?.id);
  const [liveTitle, setLiveTitle] = useState('');

  if (!isAuthenticated || user.role !== 'SELLER') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 pb-24">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
            <StoreIcon className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Verified Seller Portal
            </p>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              Seller Application & Login Required
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Sellers cannot sign up directly. Required workflow:
              <br />
              <strong>
                Apply → Admin Review → Approved → Seller Login → Choose Store Subscription → Pay →
                Store Activated
              </strong>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('seller-onboarding')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl cursor-pointer"
            >
              APPLY TO BECOME A SELLER
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('SELLER_LOGIN')}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              SELLER SIGN IN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Section 7: SELLER STORE ACTIVATION FLOW (if storeStatus !== 'ACTIVE' or seller status is APPROVED / APPROVED_UNPAID)
  const isStoreInactive =
    activeStore.status !== 'ACTIVE' ||
    activeSeller.status === 'APPROVED' ||
    activeSeller.status === 'APPROVED_UNPAID';

  if (isStoreInactive) {
    const activePlans = pricingConfig.storePlans.filter((p) => p.active !== false);
    const chosenPlan =
      activePlans.find((p) => p.id === selectedActivationPlanId) || activePlans[0];

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-24 space-y-6">
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-3">
          <span className="text-xs font-mono-tabular font-bold text-emerald-400 uppercase">
            ✓ Seller Approved ({activeSeller.status}) · Store Status: {activeStore.status}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Welcome to Jaza Kikapu Seller Center
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Your seller account for <strong>"{activeSeller.businessName}"</strong> has been approved!
            Complete the 3-step Store Activation below to unlock product listings, posts, Jaza Live,
            and customer Kikapu orders.
          </p>
        </div>

        {/* Step 1: Choose Store Subscription Plan */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <div>
            <span className="text-xs font-mono-tabular font-bold text-emerald-900 uppercase">
              Step 1 of 3
            </span>
            <h2 className="font-display text-xl font-bold text-stone-900">
              Step 1: Choose Store Subscription Plan
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Prices are dynamically loaded from Admin Marketplace Settings (Hourly, Daily, Weekly,
              Monthly, Yearly).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {activePlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedActivationPlanId(plan.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedActivationPlanId === plan.id
                    ? 'border-emerald-900 bg-emerald-50/60 ring-2 ring-emerald-900/15'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                    {plan.durationLabel}
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 mt-0.5">{plan.name}</h3>
                  <div className="font-mono-tabular text-xl font-bold text-stone-950 mt-1">
                    KSh {plan.priceKsh.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Max {plan.maxProducts} Products
                  </div>
                  <ul className="mt-2.5 space-y-1 text-[11px] text-stone-600">
                    {plan.features.map((f, i) => (
                      <li key={i}>✓ {f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 & Step 3: Complete Payment -> Store Activated */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <div>
            <span className="text-xs font-mono-tabular font-bold text-emerald-900 uppercase">
              Step 2 & Step 3
            </span>
            <h2 className="font-display text-xl font-bold text-stone-900">
              Step 2: Complete Payment → Step 3: Store Activated
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'MPESA_STK', label: 'M-Pesa STK Push', sub: 'Instant M-Pesa prompt on your phone' },
              { id: 'CARD', label: 'Card (Visa / Mastercard)', sub: 'Debit or credit card payment' },
              { id: 'PAY_LATER', label: 'Pay Later (Starter Credit)', sub: 'Deducted from first stall sales' },
            ].map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setActivationPaymentMethod(pm.id as any)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer ${
                  activationPaymentMethod === pm.id
                    ? 'border-emerald-900 bg-emerald-50/50'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="text-xs font-bold text-stone-900">{pm.label}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{pm.sub}</div>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="w-full sm:w-80">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {activationPaymentMethod === 'MPESA_STK'
                  ? 'M-Pesa STK Push Phone Number'
                  : 'Contact Phone for Receipt'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <button
              type="button"
              disabled={activatingSub}
              onClick={async () => {
                setActivatingSub(true);
                try {
                  await purchaseStoreSubscription(chosenPlan.id, phone);
                } finally {
                  setActivatingSub(false);
                }
              }}
              className="px-6 py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer uppercase tracking-wider"
            >
              {activatingSub
                ? 'Activating Store...'
                : `Pay KSh ${chosenPlan.priceKsh.toLocaleString()} & Activate Store Now`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    addOrUpdateProduct({
      name: prodName,
      price: Number(prodPrice),
      compareAtPrice: Number(prodCompare) || undefined,
      stock: Number(prodStock),
      unit: prodUnit,
      categoryId: prodCatId,
      description: prodDesc,
      featured: true,
    });
    setProdName('');
    setProdDesc('');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
      <div className="bg-stone-900 text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-amber-400 font-semibold">
            Jaza Kikapu Seller Center · {activeStore.locationName}, Taita-Taveta
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mt-0.5">
            {activeStore.businessName}
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Seller Status: <strong className="text-emerald-400">{activeSeller.status}</strong> ·
            Store Status: <strong className="text-emerald-400">{activeStore.status}</strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('store-detail', { storeSlug: activeStore.slug })}
            className="px-4 py-2 bg-white text-stone-900 text-xs font-bold rounded-lg cursor-pointer"
          >
            View My Public Stall
          </button>
          <button
            type="button"
            onClick={() => setSection('Go Live')}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            🔴 Go Live
          </button>
        </div>
      </div>

      {/* Seller Navigation Bar (All 12 Required Sections) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
        {(
          [
            'Overview',
            'My Store',
            'Products',
            'Orders',
            'Posts',
            'Go Live',
            'Subscriptions',
            'Boost Products',
            'Messages',
            'Analytics',
            'Wallet',
            'Settings',
          ] as const
        ).map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => setSection(sec)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              section === sec
                ? 'bg-emerald-900 text-white'
                : 'bg-white border border-stone-200 text-stone-700'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {section === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Stall Sales',
                value: `KSh ${activeSeller.totalSalesKsh.toLocaleString()}`,
              },
              {
                label: 'Wallet Balance',
                value: `KSh ${activeSeller.walletBalanceKsh.toLocaleString()}`,
              },
              { label: 'Active Products', value: `${myProducts.length} Listed` },
              { label: 'Stall Followers', value: `${activeStore.followersCount} Followers` },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-500">{stat.label}</div>
                <div className="font-mono-tabular text-xl font-bold text-stone-950 mt-1">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <h3 className="text-sm font-bold text-stone-900">1. Add New Stock</h3>
              <p className="text-xs text-stone-500">
                List new products with prices and stock counts into your digital stall.
              </p>
              <button
                type="button"
                onClick={() => setSection('Products')}
                className="px-3.5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Manage Products
              </button>
            </div>
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <h3 className="text-sm font-bold text-stone-900">2. Boost Product Visibility</h3>
              <p className="text-xs text-stone-500">
                Feature your product on the Homepage and Today’s Deals in {activeStore.locationName}.
              </p>
              <button
                type="button"
                onClick={() => setSection('Boost')}
                className="px-3.5 py-2 bg-amber-400 text-stone-950 text-xs font-bold rounded-lg cursor-pointer"
              >
                Boost Product
              </button>
            </div>
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <h3 className="text-sm font-bold text-stone-900">3. Broadcast on Jaza Live</h3>
              <p className="text-xs text-stone-500">
                Showcase items live and let customers add directly to their Kikapu.
              </p>
              <button
                type="button"
                onClick={() => setSection('Go Live')}
                className="px-3.5 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Start Live Session
              </button>
            </div>
          </div>
        </div>
      )}

      {section === 'Products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleAddProduct}
            className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 space-y-4 h-fit"
          >
            <h2 className="font-display text-lg font-bold text-stone-900">
              Add New Product to {activeStore.businessName}
            </h2>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="e.g., Coastal Cotton Dera Set"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Price (KSh)
                </label>
                <input
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Compare Price (KSh)
                </label>
                <input
                  type="number"
                  value={prodCompare}
                  onChange={(e) => setProdCompare(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Stock Count
                </label>
                <input
                  type="number"
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Unit</label>
                <input
                  type="text"
                  value={prodUnit}
                  onChange={(e) => setProdUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={prodCatId}
                onChange={(e) => setProdCatId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-900 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 cursor-pointer"
            >
              + Publish Product to Marketplace
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            <h2 className="font-display text-lg font-bold text-stone-900">
              Stall Inventory ({products.length} Total Marketplace Products)
            </h2>
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    <SmartImage src={p.images[0]} alt={p.name} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-900 truncate">{p.name}</p>
                    <p className="text-xs text-stone-500 font-mono-tabular">
                      KSh {p.price.toLocaleString()} · Stock: {p.stock} · {p.storeName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      addOrUpdateProduct({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        categoryId: p.categoryId,
                        stock: p.stock + 10,
                      })
                    }
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-xs font-semibold rounded cursor-pointer"
                  >
                    +10 Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(p.id)}
                    className="p-1.5 text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'Posts' && (
        <div className="max-w-xl bg-white p-6 rounded-xl border border-stone-200 space-y-4">
          <h2 className="font-display text-lg font-bold text-stone-900">
            Publish to Taita-Taveta Market Feed
          </h2>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Post Type</label>
            <select
              value={postBadge}
              onChange={(e) => setPostBadge(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
            >
              <option value="New Stock">🔥 New Stock</option>
              <option value="Flash Discount">⚡ Flash Discount</option>
              <option value="Harvest Announcement">🌿 Fresh Harvest</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Headline</label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g., Fresh weekend stock now at Stall B14!"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Post Content</label>
            <textarea
              rows={3}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Describe the offer or new arrivals..."
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tag Product for Direct Add-to-Kikapu
            </label>
            <select
              value={postLinkedProd}
              onChange={(e) => setPostLinkedProd(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (KSh {p.price})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!postTitle.trim()) return;
              createSellerPost({
                title: postTitle,
                content: postContent,
                badgeLabel: postBadge,
                linkedProductId: postLinkedProd,
              });
              setPostTitle('');
              setPostContent('');
            }}
            className="w-full py-2.5 bg-emerald-900 text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            Publish Post to Market Feed
          </button>
        </div>
      )}

      {section === 'Boost' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h2 className="font-display text-xl font-bold text-stone-900">
              Boost a Product Across Taita-Taveta
            </h2>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Select Product to Promote
              </label>
              <select
                value={boostProdId}
                onChange={(e) => setBoostProdId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — KSh {p.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                Select Boost Package
              </label>
              {pricingConfig.boostPlans.map((bp) => (
                <div
                  key={bp.id}
                  onClick={() => setBoostPlanId(bp.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer ${
                    boostPlanId === bp.id
                      ? 'border-emerald-900 bg-emerald-50/50'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex justify-between text-xs font-bold text-stone-900">
                    <span>
                      {bp.name} ({bp.durationLabel})
                    </span>
                    <span className="font-mono-tabular text-emerald-900">
                      KSh {bp.priceKsh.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Placements: {bp.placements.join(' · ')}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => purchaseProductBoost(boostProdId, boostPlanId, phone)}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl cursor-pointer"
            >
              Pay with M-Pesa & Boost Product Now
            </button>
          </div>

          <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-stone-200 space-y-3">
            <h3 className="text-sm font-bold text-stone-900">
              Active Product Boosts ({boosts.length})
            </h3>
            {boosts.map((b) => (
              <div key={b.id} className="p-3.5 rounded-lg bg-[#FAF9F5] border border-stone-200 text-xs">
                <div className="font-bold text-stone-900">{b.productName}</div>
                <p className="text-stone-500">
                  {b.planName} · KSh {b.priceKsh} · Expires {b.expiresAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'Go Live' && (
        <div className="max-w-xl bg-white p-6 rounded-xl border border-stone-200 space-y-4">
          <h2 className="font-display text-xl font-bold text-stone-900">
            🔴 Launch Jaza Live Session
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {pricingConfig.goLivePlans.map((pl) => (
              <button
                key={pl.id}
                type="button"
                onClick={() => setLivePlanId(pl.id)}
                className={`p-3 rounded-lg border text-left cursor-pointer ${
                  livePlanId === pl.id ? 'border-rose-600 bg-rose-50/40' : 'border-stone-200'
                }`}
              >
                <div className="text-xs font-bold">{pl.durationLabel}</div>
                <div className="font-mono-tabular text-xs font-semibold text-rose-700">
                  KSh {pl.priceKsh}
                </div>
              </button>
            ))}
          </div>
          <input
            type="text"
            value={liveTitle}
            onChange={(e) => setLiveTitle(e.target.value)}
            placeholder="Live session title (e.g. Unpacking new Voi Boutique dresses)"
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
          />
          <button
            type="button"
            onClick={async () => {
              const s = await purchaseGoLivePackage(
                livePlanId,
                phone,
                liveTitle || `${activeStore.businessName} Live Showcase`,
                'Ask questions in chat and add items straight to your Kikapu!',
                [products[0]?.id]
              );
              navigate('live-session', { liveId: s.id });
            }}
            className="w-full py-3 bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Pay via M-Pesa & Start Live Broadcast
          </button>
        </div>
      )}

      {section === 'Subscriptions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricingConfig.storePlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-xs font-bold text-emerald-900">{plan.durationLabel}</span>
                <h3 className="font-display text-lg font-bold text-stone-900">{plan.name}</h3>
                <div className="font-mono-tabular text-2xl font-bold mt-1">
                  KSh {plan.priceKsh.toLocaleString()}
                </div>
                <ul className="mt-3 space-y-1 text-xs text-stone-600">
                  {plan.features.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => purchaseStoreSubscription(plan.id, phone)}
                className="w-full py-2 bg-emerald-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Activate {plan.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {(section === 'Orders' || section === 'My Store' || section === 'Wallet') && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
          <h2 className="font-display text-lg font-bold text-stone-900">{section}</h2>
          {orders.map((o) => (
            <div key={o.id} className="p-4 rounded-lg bg-[#FAF9F5] border border-stone-200 text-xs">
              <div className="flex justify-between font-bold">
                <span>
                  Order #{o.id} · Buyer: {o.buyerName}
                </span>
                <span className="font-mono-tabular text-emerald-900">
                  KSh {o.total.toLocaleString()} ({o.mpesaReceipt})
                </span>
              </div>
              <p className="text-stone-500 mt-1">
                Delivery Status: {o.deliveryStatus.replace(/_/g, ' ')} · Dropoff: {o.address.landmark}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const RiderOnboardingView: React.FC = () => {
  const { locations, applyToBecomeRider, openAuthModal, riders } = useMarketplace();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [nationalId, setNationalId] = useState('');
  const [vehicleType, setVehicleType] = useState<
    'Boda Boda Motorcycle' | 'TukTuk Three-Wheeler' | 'Cargo Van'
  >('Boda Boda Motorcycle');
  const [plateNumber, setPlateNumber] = useState('');
  const [locationId, setLocationId] = useState(locations[0]?.id || 'loc-voi');
  const [submittedRiderId, setSubmittedRiderId] = useState<string | null>(null);

  const submittedRider = riders.find((r) => r.id === submittedRiderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !plateNumber.trim()) return;
    const created = applyToBecomeRider({
      name,
      phone,
      nationalId,
      vehicleType,
      plateNumber,
      locationId,
    });
    setSubmittedRiderId(created.id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 space-y-3">
        <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
          Jaza Riders Logistics Network
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">
          Apply to Become a Verified Jaza Rider
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          Riders cannot directly sign up. Submit your vehicle and ID details below. Once approved by
          Marketplace Admin, you can log in to the Jaza Rider Dispatch Console and accept multi-stall
          deliveries.
        </p>
      </div>

      {submittedRider ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-mono-tabular font-bold text-amber-800 uppercase">
                Status: {submittedRider.approvalStatus}
              </span>
              <h2 className="font-display text-xl font-bold text-stone-900 mt-0.5">
                Rider Application Submitted for {submittedRider.name} ({submittedRider.plateNumber})
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Your application is awaiting <strong>Admin Approval</strong>. Once approved, sign in
                via <strong>Rider Login</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openAuthModal('RIDER_LOGIN')}
              className="px-5 py-2.5 bg-emerald-900 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Go to Step 3: Rider Login
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('ADMIN_LOGIN')}
              className="px-4 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Open Admin Portal to Approve Rider
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="font-display text-lg font-bold text-stone-900">
              Step 1: Jaza Rider Application Form
            </h2>
            <button
              type="button"
              onClick={() => openAuthModal('RIDER_LOGIN')}
              className="text-xs font-semibold text-emerald-900 hover:underline cursor-pointer"
            >
              Already Approved? Rider Login →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Patrick Mwakima"
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                National ID / License Number
              </label>
              <input
                type="text"
                required
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="e.g., 33491820"
                className="w-full px-3 py-2 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
              >
                <option value="Boda Boda Motorcycle">Boda Boda Motorcycle</option>
                <option value="TukTuk Three-Wheeler">TukTuk Three-Wheeler</option>
                <option value="Cargo Van">Cargo Van</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Registration Number Plate
              </label>
              <input
                type="text"
                required
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="e.g., KMFG 109T"
                className="w-full px-3 py-2 text-sm font-mono-tabular uppercase bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Base Town in Taita-Taveta
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.county})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl cursor-pointer"
          >
            Submit Jaza Rider Application for Admin Approval
          </button>
        </form>
      )}
    </div>
  );
};

export const RiderDashboardView: React.FC = () => {
  const {
    user,
    isAuthenticated,
    openAuthModal,
    navigate,
    activeRider,
    deliveries,
    acceptDelivery,
    advanceDeliveryStage,
  } = useMarketplace();

  if (!isAuthenticated || user.role !== 'RIDER') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 pb-24">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
            <Bike className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Jaza Rider Dispatch Access
            </p>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              Rider Application & Approval Required
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Required Rider Flow: <strong>Apply as Rider → Admin Approval → Rider Login</strong>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('rider-onboarding')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl cursor-pointer"
            >
              1. Apply as a Rider
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('RIDER_LOGIN')}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              2. Approved Rider Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
      <div className="bg-emerald-950 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-emerald-300 font-semibold">
            JAZA RIDERS · LOCAL DISPATCH CONSOLE
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mt-0.5">
            {activeRider.name} ({activeRider.plateNumber})
          </h1>
          <p className="text-xs text-emerald-100 mt-0.5">
            {activeRider.vehicleType} · Base Town: {activeRider.locationName} · Rating: ⭐{' '}
            {activeRider.rating}
          </p>
        </div>

        <div className="bg-emerald-900/80 px-5 py-3 rounded-xl border border-emerald-700 text-right">
          <div className="text-xs text-emerald-200">Rider M-Pesa Wallet</div>
          <div className="font-mono-tabular text-xl font-bold text-white">
            KSh {activeRider.walletBalanceKsh.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deliveries.map((del) => (
          <div
            key={del.id}
            className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-tabular font-bold text-stone-900">
                  {del.id} · Order #{del.orderId}
                </span>
                <span className="font-mono-tabular font-bold text-emerald-900">
                  Payout: KSh {del.payoutKsh}
                </span>
              </div>

              <div className="text-xs text-stone-600 space-y-1">
                <p>
                  <strong className="text-stone-900">Pickup Stalls:</strong>{' '}
                  {del.pickupStores.join(' + ')}
                </p>
                <p>
                  <strong className="text-stone-900">Dropoff:</strong> {del.dropoffLandmark},{' '}
                  {del.dropoffTown} ({del.distanceKm} km)
                </p>
                <p>
                  <strong className="text-stone-900">Customer:</strong> {del.customerName} (
                  {del.customerPhone})
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200 text-xs">
                Current Stage:{' '}
                <strong className="text-emerald-900">{del.status.replace(/_/g, ' ')}</strong>
              </div>
            </div>

            {!del.assignedRiderId ? (
              <button
                type="button"
                onClick={() => acceptDelivery(del.id)}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg cursor-pointer"
              >
                Accept Multi-Stall Delivery
              </button>
            ) : del.status !== 'DELIVERED' ? (
              <button
                type="button"
                onClick={() => advanceDeliveryStage(del.id)}
                className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Advance Stage → Next Step
              </button>
            ) : (
              <div className="w-full py-2 text-center text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg">
                ✓ Delivered & Paid
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminDashboardView: React.FC = () => {
  const {
    user,
    isAuthenticated,
    openAuthModal,
    sellers,
    stores,
    products,
    orders,
    riders,
    liveSessions,
    subscriptions,
    payments,
    locations,
    pricingConfig,
    privateAdmins,
    adminCreatePrivateAdmin,
    adminUpdatePricingConfig,
    adminSetSellerStatus,
    adminSetStoreStatus,
    adminSetProductStatus,
    adminSetRiderApprovalStatus,
    adminAddLocation,
    adminAddCategory,
  } = useMarketplace();

  const [tab, setTab] = useState<
    | 'Overview'
    | 'Sellers'
    | 'Riders'
    | 'Stores'
    | 'Products'
    | 'Subscriptions & Pricing'
    | 'Locations'
    | 'Payments'
    | 'Private Admins'
  >('Overview');

  const [newTownName, setNewTownName] = useState('');
  const [newCountyName, setNewCountyName] = useState('Taita-Taveta');
  const [newFee, setNewFee] = useState(120);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('+254 7');
  const [newAdminRoleTitle, setNewAdminRoleTitle] = useState('County Marketplace Moderator');

  if (!isAuthenticated || user.role !== 'ADMIN') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 pb-24">
        <div className="bg-stone-900 text-white rounded-2xl border border-stone-800 p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Private Governance Portal
            </p>
            <h1 className="font-display text-2xl font-bold">
              Admin Accounts Are Created & Managed Privately
            </h1>
            <p className="text-xs sm:text-sm text-stone-300">
              There is no public signup for Marketplace Admins. Sign in with your privately
              provisioned Admin credentials to approve Sellers, Riders, and configure pricing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('ADMIN_LOGIN')}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl cursor-pointer"
          >
            Authenticate Private Admin Session
          </button>
        </div>
      </div>
    );
  }

  const totalRevenue = payments.reduce((sum, p) => sum + p.amountKsh, 0);

  const handlePriceChange = (
    group: 'storePlans' | 'goLivePlans' | 'boostPlans',
    id: string,
    nextPrice: number
  ) => {
    const updatedGroup = pricingConfig[group].map((item: any) =>
      item.id === id ? { ...item, priceKsh: Math.max(0, nextPrice) } : item
    );
    adminUpdatePricingConfig({
      ...pricingConfig,
      [group]: updatedGroup as any,
    });
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
      <div className="bg-stone-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-amber-400 font-semibold">
            JAZA KIKAPU MARKETPLACE GOVERNANCE
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mt-0.5">
            Admin Marketplace Control Center
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Manage Voi, Wundanyi, Mwatate & Taveta sellers, configurable store rental plans, Go Live
            pricing, and regional expansion.
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
        {(
          [
            'Overview',
            'Sellers',
            'Riders',
            'Stores',
            'Products',
            'Subscriptions & Pricing',
            'Locations',
            'Payments',
            'Private Admins',
          ] as const
        ).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              tab === t ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL USERS', value: '1,420' },
            { label: 'TOTAL SELLERS', value: sellers.length.toString() },
            {
              label: 'ACTIVE STORES',
              value: stores.filter((s) => s.status === 'ACTIVE').length.toString(),
            },
            { label: 'TOTAL ORDERS', value: orders.length.toString() },
            { label: 'TOTAL REVENUE', value: `KSh ${totalRevenue.toLocaleString()}` },
            { label: 'ACTIVE RIDERS', value: riders.length.toString() },
            { label: 'LIVE SELLERS', value: liveSessions.length.toString() },
            { label: 'ACTIVE SUBSCRIPTIONS', value: subscriptions.length.toString() },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-stone-200">
              <div className="text-[11px] font-semibold text-stone-500">{kpi.label}</div>
              <div className="font-mono-tabular text-2xl font-bold text-stone-950 mt-1">
                {kpi.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Sellers' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs text-stone-600">
            <strong>Seller Pipeline:</strong> Apply to Become a Seller (<code>PENDING</code>) →
            Admin Approval (<code>APPROVED_UNPAID</code>) → Seller Login → Choose & Pay Store
            Subscription → Store Activated (<code>ACTIVE</code>).
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="p-3.5">Seller / Business</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Sales</th>
                <th className="p-3.5">Pipeline Status</th>
                <th className="p-3.5">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sellers.map((s) => (
                <tr key={s.id}>
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900">{s.businessName}</div>
                    <div className="text-stone-500">{s.personalName}</div>
                  </td>
                  <td className="p-3.5 font-mono-tabular">{s.phone}</td>
                  <td className="p-3.5 font-mono-tabular font-bold">
                    KSh {s.totalSalesKsh.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-semibold">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-900'
                          : s.status === 'APPROVED_UNPAID'
                          ? 'bg-amber-100 text-amber-900'
                          : s.status === 'PENDING'
                          ? 'bg-stone-200 text-stone-800'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3.5 space-x-2">
                    <button
                      type="button"
                      onClick={() => adminSetSellerStatus(s.id, 'ACTIVE')}
                      className="px-2.5 py-1 bg-emerald-900 text-white rounded cursor-pointer font-semibold"
                    >
                      {s.status === 'PENDING' ? 'Approve Application' : 'Set Active'}
                    </button>
                    <button
                      type="button"
                      onClick={() => adminSetSellerStatus(s.id, 'SUSPENDED')}
                      className="px-2.5 py-1 bg-rose-700 text-white rounded cursor-pointer"
                    >
                      Suspend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Riders' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs text-stone-600">
            <strong>Rider Pipeline:</strong> Apply as Jaza Rider (<code>PENDING</code>) → Admin
            Approval (<code>APPROVED</code>) → Rider Login.
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="p-3.5">Rider Name</th>
                <th className="p-3.5">Vehicle & Plate</th>
                <th className="p-3.5">Town</th>
                <th className="p-3.5">Approval Status</th>
                <th className="p-3.5">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {riders.map((r) => (
                <tr key={r.id}>
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900">{r.name}</div>
                    <div className="text-stone-500 font-mono-tabular">{r.phone}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-800">{r.vehicleType}</div>
                    <div className="font-mono-tabular text-stone-500">{r.plateNumber}</div>
                  </td>
                  <td className="p-3.5">{r.locationName}</td>
                  <td className="p-3.5 font-semibold">{r.approvalStatus || 'APPROVED'}</td>
                  <td className="p-3.5 space-x-2">
                    <button
                      type="button"
                      onClick={() => adminSetRiderApprovalStatus(r.id, 'APPROVED')}
                      className="px-2.5 py-1 bg-emerald-900 text-white rounded cursor-pointer font-semibold"
                    >
                      Approve Rider
                    </button>
                    <button
                      type="button"
                      onClick={() => adminSetRiderApprovalStatus(r.id, 'SUSPENDED')}
                      className="px-2.5 py-1 bg-rose-700 text-white rounded cursor-pointer"
                    >
                      Suspend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Private Admins' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h2 className="font-display text-lg font-bold text-stone-900">
              Privately Provision New Admin Account
            </h2>
            <p className="text-xs text-stone-500">
              Admin accounts have no public signup and can only be created privately here.
            </p>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="e.g., Peter Mwandawiro"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="peter@jazakikapu.co.ke"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone</label>
              <input
                type="tel"
                value={newAdminPhone}
                onChange={(e) => setNewAdminPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Governance Role Title
              </label>
              <input
                type="text"
                value={newAdminRoleTitle}
                onChange={(e) => setNewAdminRoleTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!newAdminName.trim() || !newAdminEmail.trim()) return;
                adminCreatePrivateAdmin(
                  newAdminName,
                  newAdminEmail,
                  newAdminPhone,
                  newAdminRoleTitle
                );
                setNewAdminName('');
                setNewAdminEmail('');
              }}
              className="w-full py-2.5 bg-stone-900 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              + Create Private Admin Account
            </button>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {privateAdmins.map((adm) => (
              <div
                key={adm.id}
                className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="text-sm font-bold text-stone-900">{adm.name}</div>
                  <div className="text-stone-500">
                    {adm.email} · {adm.phone} · {adm.roleTitle}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-stone-900 text-amber-400 font-semibold">
                  PRIVATE ADMIN
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Stores' && (
        <div className="space-y-3">
          {stores.map((st) => (
            <div
              key={st.id}
              className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-bold text-stone-900">
                  {st.businessName} ({st.locationName})
                </div>
                <div className="text-xs text-stone-500">
                  Category: {st.categoryName} · Status: {st.status}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => adminSetStoreStatus(st.id, 'ACTIVE')}
                  className="px-3 py-1.5 bg-emerald-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Approve Store
                </button>
                <button
                  type="button"
                  onClick={() => adminSetStoreStatus(st.id, 'SUSPENDED')}
                  className="px-3 py-1.5 bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Products' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                New Category Name
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g., Solar & Irrigation"
                className="px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category Description
              </label>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Pumps, panels, and batteries"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!newCatName.trim()) return;
                adminAddCategory(newCatName, newCatDesc);
                setNewCatName('');
                setNewCatDesc('');
              }}
              className="px-4 py-2 bg-emerald-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              + Add Category
            </button>
          </div>

          <div className="space-y-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-stone-900">{p.name}</span> · {p.storeName} · KSh{' '}
                  {p.price} · Status: <strong>{p.status}</strong>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => adminSetProductStatus(p.id, 'ACTIVE')}
                    className="px-2.5 py-1 bg-emerald-900 text-white rounded cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => adminSetProductStatus(p.id, 'HIDDEN')}
                    className="px-2.5 py-1 bg-stone-200 text-stone-800 rounded cursor-pointer"
                  >
                    Hide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Subscriptions & Pricing' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h2 className="font-display text-lg font-bold text-stone-900">
              1. Store Rental Plans (Configurable KSh Prices)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingConfig.storePlans.map((pl) => (
                <div key={pl.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-900">{pl.durationLabel}</div>
                  <div className="text-sm font-bold text-stone-900">{pl.name}</div>
                  <label className="block text-xs text-stone-500">Price (KSh):</label>
                  <input
                    type="number"
                    value={pl.priceKsh}
                    onChange={(e) =>
                      handlePriceChange('storePlans', pl.id, Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 text-sm font-mono-tabular font-bold bg-white border border-stone-300 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h2 className="font-display text-lg font-bold text-stone-900">
              2. Jaza Live Temporary Access Packages (Configurable KSh Prices)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingConfig.goLivePlans.map((pl) => (
                <div key={pl.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 space-y-2">
                  <div className="text-xs font-bold text-rose-700">{pl.durationLabel}</div>
                  <div className="text-sm font-bold text-stone-900">{pl.name}</div>
                  <label className="block text-xs text-stone-500">Price (KSh):</label>
                  <input
                    type="number"
                    value={pl.priceKsh}
                    onChange={(e) =>
                      handlePriceChange('goLivePlans', pl.id, Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 text-sm font-mono-tabular font-bold bg-white border border-stone-300 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h2 className="font-display text-lg font-bold text-stone-900">
              3. Product Boost Packages (Configurable KSh Prices)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingConfig.boostPlans.map((pl) => (
                <div key={pl.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 space-y-2">
                  <div className="text-xs font-bold text-amber-800">{pl.durationLabel}</div>
                  <div className="text-sm font-bold text-stone-900">{pl.name}</div>
                  <label className="block text-xs text-stone-500">Price (KSh):</label>
                  <input
                    type="number"
                    value={pl.priceKsh}
                    onChange={(e) =>
                      handlePriceChange('boostPlans', pl.id, Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 text-sm font-mono-tabular font-bold bg-white border border-stone-300 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Locations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h2 className="font-display text-lg font-bold text-stone-900">
              Expand Jaza Kikapu to New Town / County
            </h2>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Town Name</label>
              <input
                type="text"
                value={newTownName}
                onChange={(e) => setNewTownName(e.target.value)}
                placeholder="e.g., Maungu or Mariakani"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">County</label>
              <input
                type="text"
                value={newCountyName}
                onChange={(e) => setNewCountyName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Base Rider Delivery Fee (KSh)
              </label>
              <input
                type="number"
                value={newFee}
                onChange={(e) => setNewFee(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!newTownName.trim()) return;
                adminAddLocation({
                  name: newTownName,
                  county: newCountyName,
                  status: 'ACTIVE',
                  deliveryBaseFee: newFee,
                  activeStoresCount: 5,
                  activeRidersCount: 3,
                });
                setNewTownName('');
              }}
              className="w-full py-2.5 bg-emerald-900 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              + Add Marketplace Location
            </button>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {locations.map((l) => (
              <div
                key={l.id}
                className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="text-sm font-bold text-stone-900">{l.name}</span> ({l.county} County)
                  <p className="text-stone-500 mt-0.5">
                    {l.activeStoresCount} Stalls · {l.activeRidersCount} Riders · Base Delivery KSh{' '}
                    {l.deliveryBaseFee}
                  </p>
                </div>
                <span className="font-semibold text-emerald-900">{l.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Payments' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="p-3.5">M-Pesa Code</th>
                <th className="p-3.5">Payer</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {payments.map((pay) => (
                <tr key={pay.id}>
                  <td className="p-3.5 font-mono-tabular font-bold text-emerald-900">
                    {pay.mpesaReceiptNumber}
                  </td>
                  <td className="p-3.5">{pay.payerName}</td>
                  <td className="p-3.5">{pay.type}</td>
                  <td className="p-3.5 text-stone-600">{pay.description}</td>
                  <td className="p-3.5 font-mono-tabular font-bold">
                    KSh {pay.amountKsh.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
