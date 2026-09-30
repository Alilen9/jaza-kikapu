import React, { useState } from 'react';
import {
  Radio,
  Heart,
  Send,
  ShoppingBag,
  Users,
  MessageSquare,
  Bell,
  Check,
  Store as StoreIcon,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SmartImage } from '../components/SmartImage';

export const LiveDirectoryView: React.FC = () => {
  const {
    liveSessions,
    products,
    pricingConfig,
    navigate,
    purchaseGoLivePackage,
    user,
  } = useMarketplace();

  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(
    pricingConfig.goLivePlans[1]?.id || pricingConfig.goLivePlans[0]?.id
  );
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionSubtitle, setSessionSubtitle] = useState('');
  const [phone, setPhone] = useState(user.phone || '+254 712 345 678');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([
    products[0]?.id || 'prod-1',
  ]);
  const [isPaying, setIsPaying] = useState(false);

  const selectedPlan =
    pricingConfig.goLivePlans.find((p) => p.id === selectedPlanId) || pricingConfig.goLivePlans[0];

  const handleStartLive = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    try {
      const session = await purchaseGoLivePackage(
        selectedPlan.id,
        phone,
        sessionTitle,
        sessionSubtitle,
        selectedProducts
      );
      setShowGoLiveModal(false);
      navigate('live-session', { liveId: session.id });
    } finally {
      setIsPaying(false);
    }
  };

  const togglePinProduct = (prodId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId]
    );
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-10">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-400">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>🔴 JAZA LIVE — REAL-TIME MARKET SHOWCASE</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Watch Local Sellers Live & Shop Instantly
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Interact with boutique owners in Voi, farmers in Wundanyi, and electronics dealers in
            Taveta. Ask questions in real time and add showcased items straight to your Kikapu.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowGoLiveModal(true)}
            className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>GO LIVE NOW</span>
          </button>
        </div>
      </div>

      {/* Active Live Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {liveSessions.map((session) => {
          const showcased = products.filter((p) => session.pinnedProductIds.includes(p.id));
          return (
            <div
              key={session.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div
                onClick={() => navigate('live-session', { liveId: session.id })}
                className="relative aspect-16/10 bg-stone-900 cursor-pointer group overflow-hidden"
              >
                <SmartImage
                  src={session.coverImage}
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-rose-600 text-xs font-bold">
                      🔴 LIVE · {session.locationName}
                    </span>
                    <span className="font-mono-tabular text-xs bg-black/60 px-2.5 py-1 rounded">
                      {session.viewerCount} viewers
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-amber-300 font-semibold">{session.storeName}</p>
                    <h2 className="text-base font-bold line-clamp-1">{session.title}</h2>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-stone-600 line-clamp-2">{session.subtitle}</p>
                {showcased[0] && (
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80 flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-stone-800 truncate">
                      Showcasing: {showcased[0].name}
                    </span>
                    <span className="font-mono-tabular font-bold text-emerald-900 shrink-0">
                      KSh {showcased[0].price.toLocaleString()}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate('live-session', { liveId: session.id })}
                  className="w-full py-2.5 bg-stone-900 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  JOIN LIVE STREAM
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Go Live Monetization & Package Selection Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-900">
              Flexible Seller Live Monetization
            </p>
            <h2 className="font-display text-2xl font-bold text-stone-900 mt-0.5">
              Go Live Packages (No Full Store Subscription Required)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Rent a full digital stall OR purchase temporary Go Live passes via M-Pesa whenever
              new stock arrives.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingConfig.goLivePlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 ${
                plan.popular
                  ? 'border-emerald-800 bg-emerald-50/30'
                  : 'border-stone-200 bg-[#FAF9F5]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {plan.durationLabel}
                  </span>
                  {plan.popular && (
                    <span className="text-xs font-semibold text-emerald-900">Most Popular</span>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-stone-900">{plan.name}</h3>
                <div className="font-mono-tabular text-2xl font-bold text-stone-950">
                  KSh {plan.priceKsh.toLocaleString()}
                </div>
                <ul className="space-y-1.5 pt-2 text-xs text-stone-600">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  setShowGoLiveModal(true);
                }}
                className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Select {plan.durationLabel} Package
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Go Live Activation Modal */}
      {showGoLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-xs font-bold text-rose-600">🔴 START JAZA LIVE</span>
                <h3 className="font-display text-xl font-bold text-stone-900">
                  Activate Live Selling Session
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoLiveModal(false)}
                className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleStartLive} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  1. Select Duration Package
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {pricingConfig.goLivePlans.map((pl) => (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => setSelectedPlanId(pl.id)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer ${
                        selectedPlanId === pl.id
                          ? 'border-emerald-900 bg-emerald-50/60'
                          : 'border-stone-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-stone-900">{pl.durationLabel}</div>
                      <div className="font-mono-tabular text-xs text-emerald-900 font-semibold">
                        KSh {pl.priceKsh}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  2. Live Stream Title
                </label>
                <input
                  type="text"
                  required
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g., Fresh Friday Dresses & Handbags Unpacking!"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  3. Stream Description / Offer
                </label>
                <input
                  type="text"
                  value={sessionSubtitle}
                  onChange={(e) => setSessionSubtitle(e.target.value)}
                  placeholder="e.g., Free Voi town delivery on orders placed during the live"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  4. Pin Products for Instant Buyer Kikapu Add
                </label>
                <div className="max-h-32 overflow-y-auto border border-stone-200 rounded-lg divide-y divide-stone-100">
                  {products.slice(0, 6).map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center justify-between px-3 py-2 text-xs cursor-pointer hover:bg-stone-50"
                    >
                      <span className="truncate">{p.name}</span>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(p.id)}
                        onChange={() => togglePinProduct(p.id)}
                        className="accent-emerald-900"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  5. M-Pesa Phone Number for Instant Activation
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={isPaying}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer"
              >
                {isPaying
                  ? 'Verifying M-Pesa STK Push...'
                  : `Confirm KSh ${selectedPlan.priceKsh} & Go Live Now`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const LiveSessionRoomView: React.FC = () => {
  const {
    activeLiveId,
    liveSessions,
    products,
    stores,
    user,
    toggleFollowSeller,
    addToKikapu,
    sendLiveComment,
    likeLiveSession,
    startConversationWithStore,
    navigate,
  } = useMarketplace();

  const [chatText, setChatText] = useState('');
  const session = liveSessions.find((s) => s.id === activeLiveId) || liveSessions[0];
  const store = stores.find((st) => st.id === session.storeId) || stores[0];
  const pinnedProducts = products.filter((p) => session.pinnedProductIds.includes(p.id));
  const isFollowing = user.followingSellerIds.includes(session.sellerId);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    sendLiveComment(session.id, chatText);
    setChatText('');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('live')}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          ← Back to All Jaza Live Streams
        </button>
        <span className="text-xs font-mono-tabular text-rose-600 font-bold">
          🔴 LIVE · {session.viewerCount} Viewers · {session.likesCount} Likes
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Video Showcase + Pinned Products (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-lg">
            <SmartImage
              src={session.coverImage}
              alt={session.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 p-5 flex flex-col justify-between text-white">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                    <SmartImage src={session.sellerAvatar} alt={session.storeName} />
                  </div>
                  <div>
                    <h1 className="text-sm sm:text-base font-bold">{session.storeName}</h1>
                    <p className="text-xs text-amber-300">
                      📍 {session.locationName} · Live Market Stream
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFollowSeller(session.sellerId)}
                    className="ml-2 px-3 py-1 rounded-md bg-white text-stone-900 text-xs font-bold cursor-pointer"
                  >
                    {isFollowing ? 'Following' : '+ Follow'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => likeLiveSession(session.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span className="font-mono-tabular">{session.likesCount}</span>
                  </button>
                </div>
              </div>

              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold">{session.title}</h2>
                <p className="text-xs sm:text-sm text-stone-200 mt-1">{session.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Showcased Products Tray */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Showcased Products in This Live ({pinnedProducts.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  startConversationWithStore(store);
                  navigate('messages');
                }}
                className="text-xs font-semibold text-emerald-900 hover:underline cursor-pointer"
              >
                Message {session.storeName} Directly
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pinnedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                      <SmartImage src={prod.images[0]} alt={prod.name} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{prod.name}</p>
                      <p className="font-mono-tabular text-xs font-semibold text-emerald-900">
                        KSh {prod.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToKikapu(prod, 1, false)}
                    className="px-3 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer"
                  >
                    + Kikapu
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Interactive Chat (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 flex flex-col h-[500px]">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <span className="text-sm font-bold text-stone-900">Live Market Chat</span>
            <span className="text-xs text-stone-500 font-mono-tabular">
              {session.comments.length} comments
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {session.comments.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-100 text-xs">
                <div className="flex justify-between font-semibold text-stone-900">
                  <span>{c.userName}</span>
                  <span className="text-stone-400 font-normal">{c.timestamp}</span>
                </div>
                <p className="text-stone-700 mt-1">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-stone-200 flex gap-2">
            <input
              type="text"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Ask about sizes, price, or delivery..."
              className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-emerald-900 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const FullKikapuView: React.FC = () => {
  const {
    basket,
    groupedKikapuByStore,
    updateKikapuQuantity,
    removeFromKikapu,
    clearKikapu,
    kikapuSubtotal,
    kikapuDeliveryFee,
    kikapuTotal,
    setIsKikapuDrawerOpen,
    navigate,
  } = useMarketplace();

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <p className="text-xs font-semibold text-emerald-900">Unified Multi-Stall Basket</p>
          <h1 className="font-display text-3xl font-bold text-stone-900">My Jaza Kikapu</h1>
        </div>
        {basket.length > 0 && (
          <button
            type="button"
            onClick={clearKikapu}
            className="text-xs text-rose-700 font-semibold hover:underline cursor-pointer"
          >
            Clear Entire Kikapu
          </button>
        )}
      </div>

      {basket.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
          <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
          <h2 className="font-display text-xl font-bold text-stone-900">Your Kikapu is empty</h2>
          <p className="text-sm text-stone-500">Start exploring the Taita-Taveta market.</p>
          <button
            type="button"
            onClick={() => navigate('explore')}
            className="px-5 py-2.5 bg-emerald-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Browse Market Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-5">
            {groupedKikapuByStore.map((group) => (
              <div
                key={group.storeId}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden"
              >
                <div className="px-5 py-3.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StoreIcon className="w-4 h-4 text-emerald-900" />
                    <span className="text-sm font-bold text-stone-900">{group.storeName}</span>
                    <span className="text-xs text-stone-500">· {group.storeLocation}</span>
                  </div>
                  <span className="font-mono-tabular text-xs font-bold text-stone-800">
                    Stall Subtotal: KSh {group.storeSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="divide-y divide-stone-100">
                  {group.items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          <SmartImage src={item.product.images[0]} alt={item.product.name} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-stone-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-stone-500 font-mono-tabular">
                            KSh {item.product.price.toLocaleString()} per {item.product.unit}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="inline-flex items-center border border-stone-300 rounded-lg bg-stone-50">
                          <button
                            type="button"
                            onClick={() =>
                              updateKikapuQuantity(item.productId, item.quantity - 1)
                            }
                            className="p-1.5 text-stone-700 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-mono-tabular font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateKikapuQuantity(item.productId, item.quantity + 1)
                            }
                            className="p-1.5 text-stone-700 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="font-mono-tabular text-sm font-bold text-stone-900 w-24 text-right">
                          KSh {(item.product.price * item.quantity).toLocaleString()}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromKikapu(item.productId)}
                          className="text-rose-700 hover:text-rose-900 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-6 space-y-4 sticky top-24">
            <h2 className="font-display text-lg font-bold text-stone-900">Kikapu Order Summary</h2>
            <div className="space-y-2 text-xs border-b border-stone-200 pb-4">
              <div className="flex justify-between text-stone-600">
                <span>Stalls Combined</span>
                <span className="font-mono-tabular font-semibold text-stone-900">
                  {groupedKikapuByStore.length} local store(s)
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-mono-tabular font-semibold text-stone-900">
                  KSh {kikapuSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Jaza Rider Delivery</span>
                <span className="font-mono-tabular font-semibold text-stone-900">
                  KSh {kikapuDeliveryFee.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-stone-900">TOTAL</span>
              <span className="font-mono-tabular text-xl font-bold text-emerald-900">
                KSh {kikapuTotal.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsKikapuDrawerOpen(true)}
              className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer"
            >
              PROCEED TO M-PESA CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const MessagesView: React.FC = () => {
  const { conversations, sendMessageToConversation, navigate } = useMarketplace();
  const [selectedConvId, setSelectedConvId] = useState(conversations[0]?.id || '');
  const [text, setText] = useState('');

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !text.trim()) return;
    sendMessageToConversation(activeConv.id, text);
    setText('');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
        {/* Left Conversation List */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-stone-200 flex flex-col">
          <div className="p-4 border-b border-stone-200 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-900" />
            <h1 className="font-display text-lg font-bold text-stone-900">
              Market Messages ({conversations.length})
            </h1>
          </div>
          <div className="divide-y divide-stone-100 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full p-4 text-left transition-colors cursor-pointer ${
                  activeConv?.id === conv.id ? 'bg-stone-100' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">{conv.participantName}</span>
                  <span className="text-stone-400">{conv.updatedAt}</span>
                </div>
                <p className="text-[11px] text-emerald-900 font-medium mt-0.5">
                  {conv.participantRole} · {conv.locationName}
                </p>
                <p className="text-xs text-stone-600 truncate mt-1">{conv.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Thread */}
        {activeConv && (
          <div className="md:col-span-8 flex flex-col justify-between">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F5]">
              <div>
                <h2 className="text-sm font-bold text-stone-900">{activeConv.participantName}</h2>
                <p className="text-xs text-stone-500">
                  {activeConv.participantRole} · {activeConv.locationName}
                </p>
              </div>
              {activeConv.storeSlug && (
                <button
                  type="button"
                  onClick={() => navigate('store-detail', { storeSlug: activeConv.storeSlug })}
                  className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100 cursor-pointer"
                >
                  Visit Stall
                </button>
              )}
            </div>

            <div className="flex-1 p-5 space-y-3 overflow-y-auto max-h-[380px]">
              {activeConv.messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-md p-3.5 rounded-xl text-xs sm:text-sm space-y-1 ${
                    m.senderRole === 'BUYER'
                      ? 'ml-auto bg-emerald-900 text-white'
                      : 'bg-stone-100 text-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] opacity-80">
                    <span className="font-semibold">{m.senderName}</span>
                    <span>{m.createdAt}</span>
                  </div>
                  {m.referencedProductName && (
                    <div className="text-[11px] px-2 py-1 rounded bg-black/15 font-medium">
                      Product: {m.referencedProductName}
                    </div>
                  )}
                  {m.referencedOrderId && (
                    <div className="text-[11px] px-2 py-1 rounded bg-black/15 font-mono-tabular">
                      Order #{m.referencedOrderId}
                    </div>
                  )}
                  <p>{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-stone-200 flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Write a message to ${activeConv.participantName}...`}
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const NotificationsView: React.FC = () => {
  const { notifications, markAllNotificationsRead, navigate } = useMarketplace();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-emerald-900" />
          <h1 className="font-display text-2xl font-bold text-stone-900">Notifications Center</h1>
        </div>
        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="text-xs font-semibold text-emerald-900 hover:underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => n.actionRoute && navigate(n.actionRoute as any)}
            className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
              n.read ? 'bg-white border-stone-200' : 'bg-emerald-50/40 border-emerald-800/40'
            }`}
          >
            <div>
              <p className="text-sm font-bold text-stone-900">{n.title}</p>
              <p className="text-xs text-stone-600 mt-1">{n.body}</p>
            </div>
            <span className="text-xs text-stone-400 whitespace-nowrap shrink-0">{n.createdAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
