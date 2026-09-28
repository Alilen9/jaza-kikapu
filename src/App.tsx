import React, { useState, useEffect } from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroMarket } from './components/HeroMarket';
import { LiveMarketStrip } from './components/LiveMarketStrip';
import { MarketSections } from './components/MarketSections';
import { DigitalStallCard } from './components/DigitalStallCard';
import { ProductCard } from './components/ProductCard';
import { DigitalStallModal } from './components/DigitalStallModal';
import { LiveStudioModal } from './components/LiveStudioModal';
import { ShowMeModal } from './components/ShowMeModal';
import { KikapuDrawer } from './components/KikapuDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { JazaAIAssistantModal } from './components/JazaAIAssistantModal';
import { ProductRequestsView } from './components/ProductRequestsView';
import { SupermarketQuickBasket } from './components/SupermarketQuickBasket';
import { GroupBuyingView } from './components/GroupBuyingView';
import { SellerAuthModal } from './components/SellerAuthModal';
import { RiderAuthModal } from './components/RiderAuthModal';
import { SellerDashboard } from './components/dashboards/SellerDashboard';
import { RiderDashboard } from './components/dashboards/RiderDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { Store, Product, LiveSession } from './types';
import { api } from './services/api';
import { Search, SlidersHorizontal, MapPin, Truck, Sparkles, ShieldCheck } from 'lucide-react';

function MarketplaceApp() {
  const {
    activeLocation,
    selectedStore,
    setSelectedStore,
    selectedLiveSession,
    setSelectedLiveSession,
    selectedProductForShowMe,
    setSelectedProductForShowMe,
    activeRole,
    toastMessage,
    setIsSellerAuthOpen,
    setSellerAuthMode,
    setIsRiderAuthOpen,
    setRiderAuthMode,
    setIsAIAssistantOpen,
  } = useMarket();

  const [activeTab, setActiveTab] = useState<string>('market');
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [taitaLocalOnly, setTaitaLocalOnly] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load Marketplace Data
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.getStores(),
      api.getProducts(),
      api.getLiveSessions(),
    ])
      .then(([storesData, prodsData, liveData]) => {
        setStores(storesData);
        setProducts(prodsData);
        setLiveSessions(liveData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // Filter products & stores
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesLocal = !taitaLocalOnly || p.isTaitaLocal;
    return matchesSearch && matchesCategory && matchesLocal;
  });

  const filteredStores = stores.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      s.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesOpen = !openNowOnly || s.isOpen;
    return matchesSearch && matchesCategory && matchesOpen;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1E1B18] flex flex-col font-sans pb-20 md:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-stone-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main Top Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* VIEW 1: DISCOVER MARKETPLACE ("ENTER THE MARKET") */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            {/* Visual Hero Anchor */}
            <HeroMarket
              onEnterMarket={() => {
                const el = document.getElementById('market-stalls-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onWatchLive={() => {
                if (liveSessions.length > 0) {
                  setSelectedLiveSession(liveSessions[0]);
                } else {
                  setActiveTab('live');
                }
              }}
            />

            {/* Active Live Broadcasts Strip */}
            <LiveMarketStrip
              onSelectSession={(session) => setSelectedLiveSession(session)}
            />

            {/* Market Sections (Categories) */}
            <MarketSections
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onOpenQuickBasket={() => setActiveTab('quick-basket')}
            />

            {/* Search & Marketplace Filters */}
            <div id="market-stalls-section" className="pt-2">
              <div className="bg-white p-4 rounded-2xl border border-[#E6E0D4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Ankara dresses, Taveta bananas, phone chargers, cement..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenNowOnly(!openNowOnly)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors border ${
                      openNowOnly
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    Open Stalls Only
                  </button>

                  <button
                    onClick={() => setTaitaLocalOnly(!taitaLocalOnly)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors border ${
                      taitaLocalOnly
                        ? 'bg-[#1B4332] text-white border-[#1B4332] font-semibold'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    Taita-Taveta Local Only
                  </button>
                </div>
              </div>
            </div>

            {/* Digital Seller Stalls Section */}
            <section className="py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 tracking-tight">
                    Digital Stalls in {activeLocation?.marketName || 'Voi Market'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Step inside verified local shops, talk to owners, and view live inventory
                  </p>
                </div>
              </div>

              {filteredStores.length === 0 ? (
                <div className="py-12 text-center bg-white rounded-3xl border border-stone-200 p-6">
                  <p className="text-sm font-semibold text-stone-700">No stalls found matching your filter</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setOpenNowOnly(false);
                      setTaitaLocalOnly(false);
                    }}
                    className="mt-2 text-xs text-[#1B4332] underline font-semibold"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStores.map(store => (
                    <DigitalStallCard
                      key={store.id}
                      store={store}
                      products={products}
                      onEnterStore={(s) => setSelectedStore(s)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Fill My Kikapu Value Callout */}
            <section className="my-8 rounded-3xl bg-[#E8F0EC] border border-[#C8DFD2] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4332] uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>The Jaza Kikapu Experience</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
                  Shop from 3 different sellers. Checkout once.
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Put shoes from Seller A, fresh bananas from Seller B, and a phone charger from Seller C into <strong>My Kikapu</strong>. Our backend automatically creates separate seller orders, and a dedicated Boda Boda rider in Voi collects all items for a single consolidated delivery!
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-center sm:items-end gap-2 text-right">
                <div className="text-xs font-bold text-[#1B4332] bg-white px-3 py-1.5 rounded-xl border border-[#C8DFD2] shadow-xs">
                  KES 100 Base Consolidated Delivery
                </div>
                <span className="text-[11px] text-stone-500">
                  Save on multiple delivery fees across town
                </span>
              </div>
            </section>

            {/* Marketplace Products Grid */}
            <section className="py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 tracking-tight">
                    Available Products in Market ({filteredProducts.length})
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Click "Show Me" to ask a seller for live proof, or add straight to your Kikapu
                  </p>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center bg-white rounded-3xl border border-stone-200 p-6">
                  <p className="text-sm font-semibold text-stone-700">No products found</p>
                  <p className="text-xs text-stone-500 mt-1">Try searching for something else or ask sellers with "Request a Product".</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onShowMe={(prod) => setSelectedProductForShowMe(prod)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Seller Portal Callout Banner */}
            <section className="my-8 rounded-3xl bg-gradient-to-r from-stone-900 to-[#1B4332] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#F4A261] text-xs font-semibold">
                  <span>🏪 For Local Business Owners</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Have a Shop or Stall in Voi, Taveta, Wundanyi or Mwatate?
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Put your stall online, broadcast live demonstrations to buyers across Taita-Taveta, receive consolidated orders, and get paid directly to your M-Pesa.
                </p>
              </div>

              <div className="shrink-0 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setSellerAuthMode('login');
                    setIsSellerAuthOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 cursor-pointer transition-colors"
                >
                  Seller Log In
                </button>
                <button
                  onClick={() => {
                    setSellerAuthMode('register');
                    setIsSellerAuthOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#D95D39] hover:bg-[#C24E2C] text-white font-semibold text-xs shadow-md cursor-pointer transition-colors"
                >
                  Open a Digital Stall
                </button>
              </div>
            </section>

            {/* Boda Boda Delivery Fleet Banner */}
            <section className="my-8 rounded-3xl bg-white border border-[#E6E0D4] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold">
                  <span>🏍️ Boda Boda & Tuk-Tuk Delivery Fleet</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
                  Deliver Orders in Voi & Earn Direct M-Pesa Payouts
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Join the official Jaza Kikapu delivery fleet. Collect consolidated packages from multiple market stalls and deliver them to customers across Voi, Sofia, Tsavo Junction, and Taveta.
                </p>
              </div>

              <div className="shrink-0 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setRiderAuthMode('login');
                    setIsRiderAuthOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs border border-stone-200 cursor-pointer transition-colors"
                >
                  Rider Log In
                </button>
                <button
                  onClick={() => {
                    setRiderAuthMode('register');
                    setIsRiderAuthOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-semibold text-xs shadow-md cursor-pointer transition-colors"
                >
                  Join Rider Fleet
                </button>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: WATCH LIVE STREAMS */}
        {activeTab === 'live' && (
          <div className="py-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E63946]/10 text-[#E63946] text-xs font-bold mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E63946] animate-ping"></span>
                <span>Live Streaming Market</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-stone-900 tracking-tight">
                Live Sellers in Voi & Taita-Taveta
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Watch shopkeepers demonstrate fresh stock, ask questions in real-time, and add pinned items to your Kikapu without leaving the video.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveSessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => setSelectedLiveSession(session)}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-64 bg-stone-900">
                    <video
                      src={session.streamVideoUrl}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute top-4 left-4 bg-[#E63946] text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      LIVE NOW
                    </div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-mono px-2.5 py-1 rounded-md">
                      {session.viewerCount} in stall
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={session.storeLogo}
                          alt={session.storeName}
                          className="w-8 h-8 rounded-full border border-white"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-semibold text-xs text-[#F4A261]">{session.storeName}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white line-clamp-1">{session.title}</h4>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 flex items-center justify-between text-xs font-semibold text-[#1B4332]">
                    <span>Enter Live Room & Chat</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: REQUEST A PRODUCT */}
        {activeTab === 'requests' && <ProductRequestsView />}

        {/* VIEW 4: SUPERMARKET QUICK BASKET */}
        {activeTab === 'quick-basket' && <SupermarketQuickBasket />}

        {/* VIEW 5: GROUP BUYING DEALS */}
        {activeTab === 'group-buy' && <GroupBuyingView />}

        {/* VIEW 6: ROLE-BASED CONSOLE (SELLER, RIDER, ADMIN) */}
        {activeTab === 'dashboard' && (
          <div>
            {activeRole === 'SELLER' && <SellerDashboard />}
            {activeRole === 'RIDER' && <RiderDashboard />}
            {activeRole === 'ADMIN' && <AdminDashboard />}
            {activeRole === 'BUYER' && (
              <div className="py-8 max-w-3xl mx-auto space-y-4">
                <h3 className="font-display font-bold text-2xl text-stone-900">
                  Buyer Account & Order History
                </h3>
                <p className="text-xs text-stone-500">
                  Track orders, view receipts, and switch to Seller/Rider/Admin persona using the header selector to test all features.
                </p>

                <div className="bg-white rounded-3xl border border-stone-200 p-6">
                  <div className="text-xs font-semibold text-stone-800 mb-2">Order #JK-VOI-2026-0881</div>
                  <div className="text-xs text-stone-600 space-y-1">
                    <div>Status: <strong className="text-emerald-700">OUT FOR DELIVERY</strong></div>
                    <div>M-Pesa Receipt: <strong>QHK987123A</strong></div>
                    <div>Rider Assigned: Juma Mwasi (Boda Boda Boxer 150)</div>
                    <div>Destination: Moi High School Voi Gate B</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#E6E0D4] bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="font-display font-bold text-lg text-[#1B4332]">
              Jaza Kikapu
            </div>
            <p className="text-stone-500 text-xs leading-relaxed">
              Your Market. Your Businesses. Your Community. Digital marketplace engineered for Voi and the wider Taita-Taveta County.
            </p>
            <div className="text-[11px] text-stone-400">
              Voi Main Market · Tsavo Plaza · Taveta · Wundanyi
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-stone-900">Signature Features</div>
            <div>• Multi-Seller Kikapu Split Orders</div>
            <div>• Real-time Live Market Broadcasts</div>
            <div>• Ask Seller "Show Me" Media Proof</div>
            <div>• Request a Product Community Feed</div>
            <div>• Supermarket Quick Basket</div>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-stone-900">Payments & Logistics</div>
            <div>• Safaricom Daraja M-Pesa STK Push</div>
            <div>• Consolidated Boda Boda Dispatch</div>
            <div>• Instant Seller Wallet Payouts</div>
            <div>• Verified Local Voi Merchants</div>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-stone-900">Architecture & Technical Specs</div>
            <div>• Django REST Framework & Channels</div>
            <div>• Next.js 16+ App Router Specification</div>
            <div>• PostgreSQL Normalized ACID Database</div>
            <div>• Dockerfile & Docker-Compose Ready</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
          <div>© 2026 Jaza Kikapu. All rights reserved. Taita-Taveta, Kenya.</div>
          <div>See it. Ask about it. Buy it. Get it delivered.</div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Interactive Modals */}
      {selectedStore && (
        <DigitalStallModal
          store={selectedStore}
          products={products}
          onClose={() => setSelectedStore(null)}
          onOpenShowMe={(prod) => {
            setSelectedStore(null);
            setSelectedProductForShowMe(prod);
          }}
        />
      )}

      {selectedLiveSession && (
        <LiveStudioModal
          session={selectedLiveSession}
          products={products}
          onClose={() => setSelectedLiveSession(null)}
          onOpenShowMe={(prod) => {
            setSelectedLiveSession(null);
            setSelectedProductForShowMe(prod);
          }}
        />
      )}

      {selectedProductForShowMe && (
        <ShowMeModal
          product={selectedProductForShowMe}
          onClose={() => setSelectedProductForShowMe(null)}
        />
      )}

      <KikapuDrawer />
      <CheckoutModal />
      <LocationSelectorModal />
      <JazaAIAssistantModal />
      <SellerAuthModal onSuccessRedirectToDashboard={() => setActiveTab('dashboard')} />
      <RiderAuthModal onSuccessRedirectToDashboard={() => setActiveTab('dashboard')} />

      {/* Floating Jaza AI Launcher Button */}
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#1B4332] text-white hover:bg-[#143225] shadow-xl hover:shadow-2xl border border-emerald-800 transition-all cursor-pointer active:scale-95 group"
        title="Ask Jaza AI Concierge"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-[#F4A261] animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <span className="font-display font-bold text-xs tracking-wide">
          Ask Jaza AI
        </span>
      </button>
    </div>
  );
}

export default function App() {
  return (
    <MarketProvider>
      <MarketplaceApp />
    </MarketProvider>
  );
}
