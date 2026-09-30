import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Radio,
  Store as StoreIcon,
  ShoppingBag,
  Heart,
  MessageCircle,
  Share2,
  Star,
  ArrowRight,
  Phone,
  Clock,
  Truck,
  CheckCircle2,
  Bike,
  Filter,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/ProductCard';
import { FillMyKikapuSection } from '../components/FillMyKikapuSection';
import { SmartImage } from '../components/SmartImage';
import { ASSETS } from '../data/initialData';

export const HomeView: React.FC = () => {
  const {
    navigate,
    locations,
    selectedLocationId,
    setSelectedLocationId,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    currentLocationName,
    categories,
    liveSessions,
    products,
    stores,
    posts,
    addToKikapu,
    toggleLikePost,
    addPostComment,
  } = useMarketplace();

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.status !== 'ACTIVE') return false;
      if (selectedLocationId !== 'ALL' && p.locationId !== selectedLocationId) return false;
      if (selectedCategoryId !== 'ALL' && p.categoryId !== selectedCategoryId) return false;
      if (
        searchQuery.trim() &&
        !`${p.name} ${p.description} ${p.storeName} ${p.category} ${p.location}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [products, selectedLocationId, selectedCategoryId, searchQuery]);

  const filteredStores = useMemo(() => {
    return stores.filter((st) => {
      if (st.status !== 'ACTIVE') return false;
      if (selectedLocationId !== 'ALL' && st.locationId !== selectedLocationId) return false;
      return true;
    });
  }, [stores, selectedLocationId]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('explore');
  };

  return (
    <div className="space-y-14 pb-20">
      {/* 1. HERO SECTION — Storefront Discovery Focal Point */}
      <section className="relative bg-stone-900 text-white overflow-hidden border-b border-stone-800">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Copy + Search + Location Switcher */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium tracking-wide">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Taita-Taveta Digital Marketplace · Shopping in {currentLocationName}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12]">
                Your market. Your sellers. Your basket.
              </h1>

              <p className="text-stone-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Step inside the digital stalls of Voi, Wundanyi, Mwatate, and Taveta. Watch live
                sellers, combine groceries and fashion from multiple shops into one{' '}
                <strong className="text-white font-semibold">Kikapu</strong>, and get same-hour
                Jaza Rider delivery.
              </p>

              {/* Search & Town Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="bg-white p-2 rounded-xl shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl"
              >
                <div className="flex items-center gap-2.5 px-3 py-2 flex-1">
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for? (e.g. Kitenge, Pishori Rice, Tomatoes...)"
                    className="w-full text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-stone-200 pt-2 sm:pt-0 sm:pl-2">
                  <select
                    aria-label="Select Town Location"
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Towns (Taita-Taveta)</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        Shopping in {loc.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Interactive Town Quick Filter Buttons + CTAs */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-stone-400 mr-1">Town Stalls:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedLocationId('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      selectedLocationId === 'ALL'
                        ? 'bg-amber-400 text-stone-950 font-semibold'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    All Taita-Taveta
                  </button>
                  {locations.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setSelectedLocationId(loc.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        selectedLocationId === loc.id
                          ? 'bg-amber-400 text-stone-950 font-semibold'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('explore')}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    START SHOPPING
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('seller-onboarding')}
                    className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    OPEN A STORE
                  </button>
                </div>
              </div>
            </div>

            {/* Right 16:9 Hero Showcase */}
            <div className="lg:col-span-5">
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-stone-700/80 shadow-2xl">
                <SmartImage
                  src={ASSETS.heroMarketImg}
                  alt="Vibrant Voi and Taita-Taveta local marketplace with woven kikapu baskets"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5">
                  <p className="text-xs text-amber-300 font-medium">
                    138 Active Local Stalls · 65 Verified Jaza Riders
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-white mt-0.5">
                    Combine items from Mama Asha Boutique, Voi Supermarket & Wundanyi Farms in one
                    Kikapu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* 2. JAZA LIVE — Active Live Seller Streams */}
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>JAZA LIVE STREAMING NOW</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Watch Local Sellers Live
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('live')}
              className="text-xs sm:text-sm font-semibold text-emerald-900 hover:underline inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>View All Live Sessions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => navigate('live-session', { liveId: session.id })}
                className="group relative aspect-16/10 rounded-xl overflow-hidden bg-stone-900 border border-stone-200 cursor-pointer shadow-xs hover:shadow-md transition-all"
              >
                <SmartImage
                  src={session.coverImage}
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 p-5 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-semibold">
                      <Radio className="w-3.5 h-3.5" />
                      <span>LIVE · {session.locationName}</span>
                    </span>
                    <span className="font-mono-tabular text-xs font-medium bg-black/60 px-2.5 py-1 rounded">
                      {session.viewerCount} viewers
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-amber-300 font-medium">{session.storeName}</p>
                    <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 mt-0.5">
                      {session.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-stone-300">
                        {session.pinnedProductIds.length} products showcased
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-white text-stone-950 text-xs font-bold group-hover:bg-amber-400 transition-colors">
                        JOIN LIVE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. EXPLORE THE MARKET — Dynamic Categories + Popular Near You */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-emerald-900">14 Marketplace Departments</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
                Popular Near You in {currentLocationName}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate('explore')}
              className="text-xs sm:text-sm font-semibold text-emerald-900 hover:underline inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>Browse All {products.length} Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Category Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedCategoryId('ALL')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategoryId === 'ALL'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* 3-Column Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
              <p className="text-base font-semibold text-stone-900">
                No products found in this category or town yet.
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Try switching to All Towns or clearing your category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryId('ALL');
                  setSelectedLocationId('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-emerald-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 4. FILL MY KIKAPU — Signature Budget Basket Builder */}
        <FillMyKikapuSection />

        {/* 5. LOCAL DIGITAL STORES & SOCIAL MARKET FEED */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Featured Digital Stalls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-900">Verified Local Businesses</p>
                <h2 className="font-display text-2xl font-bold text-stone-900 mt-0.5">
                  Digital Stalls in Taita-Taveta
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('stores')}
                className="text-xs font-semibold text-emerald-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>All Stores ({stores.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {filteredStores.slice(0, 4).map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      <SmartImage src={store.logo} alt={store.businessName} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span>{store.categoryName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{store.locationName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-0.5 font-mono-tabular text-stone-700 font-medium">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {store.rating.toFixed(1)}
                        </span>
                        {store.isLiveNow && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-rose-600 font-semibold">🔴 Live Now</span>
                          </>
                        )}
                      </div>
                      <h3
                        onClick={() => navigate('store-detail', { storeSlug: store.slug })}
                        className="text-base font-bold text-stone-900 hover:text-emerald-900 cursor-pointer mt-0.5"
                      >
                        {store.businessName}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">{store.tagline}</p>
                      <p className="text-[11px] text-stone-400 mt-1">
                        {store.deliveryInfo} · {store.followersCount} followers
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('store-detail', { storeSlug: store.slug })}
                    className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-emerald-900 hover:text-white text-stone-900 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Enter Stall
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Social Market Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="text-xs font-semibold text-emerald-900">Social Commerce Updates</p>
              <h2 className="font-display text-2xl font-bold text-stone-900 mt-0.5">
                Market Feed
              </h2>
            </div>

            <div className="space-y-4">
              {posts.slice(0, 2).map((post) => {
                const linkedProduct = products.find((p) => p.id === post.linkedProductId);
                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl border border-stone-200/90 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => navigate('store-detail', { storeSlug: post.storeSlug })}
                        className="text-left cursor-pointer"
                      >
                        <p className="text-sm font-bold text-stone-900 hover:text-emerald-900">
                          {post.storeName}
                        </p>
                        <p className="text-xs text-stone-500">
                          {post.locationName} · {post.badgeLabel} · {post.createdAt}
                        </p>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {post.content}
                    </p>

                    {linkedProduct && (
                      <div className="p-3 rounded-lg bg-[#FAF9F5] border border-stone-200/80 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-stone-900 truncate">
                            {linkedProduct.name}
                          </p>
                          <p className="font-mono-tabular text-xs font-bold text-emerald-900">
                            KSh {linkedProduct.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToKikapu(linkedProduct, 1)}
                          className="px-3 py-1.5 bg-emerald-900 text-white text-xs font-semibold rounded-md hover:bg-emerald-800 whitespace-nowrap cursor-pointer"
                        >
                          Add to Kikapu
                        </button>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => toggleLikePost(post.id)}
                          className={`inline-flex items-center gap-1 font-medium cursor-pointer ${
                            post.likedByMe ? 'text-rose-600 font-semibold' : 'hover:text-stone-900'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${post.likedByMe ? 'fill-rose-600' : ''}`}
                          />
                          <span className="font-mono-tabular">{post.likesCount}</span>
                        </button>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="font-mono-tabular">{post.comments.length}</span>
                        </span>
                      </div>

                      {linkedProduct && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate('product-detail', { productId: linkedProduct.id })
                          }
                          className="text-emerald-900 font-semibold hover:underline cursor-pointer"
                        >
                          View Product
                        </button>
                      )}
                    </div>

                    {/* Quick Comment Box */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        placeholder="Ask seller a question..."
                        className="flex-1 px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-emerald-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addPostComment(post.id, commentInputs[post.id] || '');
                          setCommentInputs((prev) => ({ ...prev, [post.id]: '' }));
                        }}
                        className="px-3 py-1.5 bg-stone-900 text-white text-xs font-medium rounded-md hover:bg-stone-800 cursor-pointer"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. BECOME A SELLER & JAZA RIDERS BANNER */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <p className="text-xs text-amber-400 font-semibold">For Local Business Owners</p>
              <h3 className="font-display text-2xl font-bold">
                Rent Your Digital Stall on Jaza Kikapu
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Whether you run a boutique in Voi, a farm crate stall in Wundanyi, or an
                electronics shop in Taveta—rent a stall hourly, weekly, or monthly, go live, and
                receive M-Pesa orders directly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('seller-onboarding')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Open Digital Store
              </button>
              <button
                type="button"
                onClick={() => navigate('seller-dashboard')}
                className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Seller Dashboard
              </button>
            </div>
          </div>

          <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <p className="text-xs text-emerald-300 font-semibold">Coordinated Local Logistics</p>
              <h3 className="font-display text-2xl font-bold">
                Jaza Riders — Multi-Stall Boda & TukTuk Delivery
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Our verified local riders collect items from multiple stalls in one trip and
                deliver straight to your estate or stage across Voi, Wundanyi, Mwatate, and Taveta.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('rider-dashboard')}
                className="px-5 py-2.5 bg-white hover:bg-stone-100 text-emerald-950 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Bike className="w-4 h-4" />
                <span>Open Jaza Rider Console</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const ExploreView: React.FC = () => {
  const {
    products,
    categories,
    locations,
    selectedLocationId,
    setSelectedLocationId,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
  } = useMarketplace();

  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [onlyDeals, setOnlyDeals] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC'>('POPULAR');

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (p.status !== 'ACTIVE') return false;
      if (selectedLocationId !== 'ALL' && p.locationId !== selectedLocationId) return false;
      if (selectedCategoryId !== 'ALL' && p.categoryId !== selectedCategoryId) return false;
      if (p.price > maxPrice) return false;
      if (onlyDeals && !p.isDeal) return false;
      if (
        searchQuery.trim() &&
        !`${p.name} ${p.description} ${p.storeName} ${p.category} ${p.location}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.price - b.price;
      if (sortBy === 'PRICE_DESC') return b.price - a.price;
      return b.rating - a.rating;
    });
  }, [products, selectedLocationId, selectedCategoryId, maxPrice, onlyDeals, searchQuery, sortBy]);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <p className="text-xs font-semibold text-emerald-900">Global Marketplace Search</p>
          <h1 className="font-display text-3xl font-bold text-stone-900 mt-0.5">
            Explore Taita-Taveta Market
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, stores, towns..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
            />
          </div>

          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-stone-300 rounded-lg cursor-pointer"
          >
            <option value="ALL">All Towns</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-stone-300 rounded-lg cursor-pointer"
          >
            <option value="POPULAR">Sort: Top Rated</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="PRICE_DESC">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-xl border border-stone-200/90 p-5 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900 inline-flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Market Filters
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId('ALL');
                setSelectedLocationId('ALL');
                setMaxPrice(10000);
                setOnlyDeals(false);
                setSearchQuery('');
              }}
              className="text-xs text-emerald-900 hover:underline font-medium cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-stone-600 mb-2">Categories</p>
            <button
              type="button"
              onClick={() => setSelectedCategoryId('ALL')}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                selectedCategoryId === 'ALL'
                  ? 'bg-emerald-900 text-white font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategoryId(c.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategoryId === c.id
                    ? 'bg-emerald-900 text-white font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-stone-700">Max Price</span>
              <span className="font-mono-tabular font-semibold text-stone-900">
                KSh {maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-900 cursor-pointer"
            />
          </div>

          {/* Only Deals Checkbox */}
          <label className="flex items-center gap-2 pt-3 border-t border-stone-100 text-xs font-medium text-stone-800 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyDeals}
              onChange={(e) => setOnlyDeals(e.target.checked)}
              className="accent-emerald-900 rounded"
            />
            <span>Only Discounted Deals & Boosts</span>
          </label>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-9 space-y-4">
          <div className="text-xs text-stone-500">
            Showing <strong className="text-stone-900">{filtered.length}</strong> products ready
            for your Kikapu
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
              <p className="text-base font-semibold text-stone-900">
                No products match your current filter criteria.
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Try increasing the price range or switching town filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const StoresDirectoryView: React.FC = () => {
  const { stores, locations, selectedLocationId, setSelectedLocationId, navigate } =
    useMarketplace();

  const visibleStores = stores.filter(
    (s) =>
      s.status === 'ACTIVE' &&
      (selectedLocationId === 'ALL' || s.locationId === selectedLocationId)
  );

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <p className="text-xs font-semibold text-emerald-900">Digital Market Stalls</p>
          <h1 className="font-display text-3xl font-bold text-stone-900 mt-0.5">
            Local Stores in Taita-Taveta
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedLocationId('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              selectedLocationId === 'ALL'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-700'
            }`}
          >
            All Towns
          </button>
          {locations.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => setSelectedLocationId(loc.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedLocationId === loc.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-700'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {visibleStores.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-base font-semibold text-stone-900">
            No stores are available in this location yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-xl border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="relative h-44 bg-stone-900">
                <SmartImage
                  src={store.coverImage}
                  alt={store.businessName}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex items-end justify-between">
                  <div className="text-white">
                    <p className="text-xs text-amber-300 font-medium">
                      {store.categoryName} · {store.locationName}
                    </p>
                    <h2 className="font-display text-xl font-bold mt-0.5">{store.businessName}</h2>
                  </div>
                  <div className="text-right text-white font-mono-tabular text-xs">
                    <div className="inline-flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{store.rating.toFixed(1)}</span>
                      <span>({store.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs sm:text-sm text-stone-600 line-clamp-2">
                  {store.description}
                </p>
                <div className="text-xs text-stone-500 space-y-1">
                  <p>
                    <strong className="text-stone-700">Hours:</strong> {store.openingHours}
                  </p>
                  <p>
                    <strong className="text-stone-700">Delivery:</strong> {store.deliveryInfo} (
                    {store.deliveryTimeEstimate})
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-mono-tabular">
                    {store.followersCount} market followers
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('store-detail', { storeSlug: store.slug })}
                    className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Visit Digital Stall
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const StoreDetailView: React.FC = () => {
  const {
    activeStoreSlug,
    stores,
    products,
    posts,
    liveSessions,
    reviews,
    user,
    toggleFollowSeller,
    toggleSaveStore,
    startConversationWithStore,
    navigate,
    addProductReview,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<
    'Products' | 'Deals' | 'Posts' | 'Live' | 'About' | 'Reviews'
  >('Products');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const store = stores.find((s) => s.slug === activeStoreSlug) || stores[0];
  const storeProducts = products.filter((p) => p.storeId === store.id && p.status === 'ACTIVE');
  const storeDeals = storeProducts.filter((p) => p.isDeal);
  const storePosts = posts.filter((p) => p.storeId === store.id);
  const storeLives = liveSessions.filter((l) => l.storeId === store.id);
  const storeReviews = reviews.filter((r) => r.storeId === store.id);

  const isFollowing = user.followingSellerIds.includes(store.sellerId);
  const isSaved = user.savedStoreIds.includes(store.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addProductReview(store.id, undefined, reviewRating, reviewComment);
    setReviewComment('');
  };

  return (
    <div className="pb-24">
      {/* Store Cover Banner */}
      <div className="relative h-60 sm:h-72 bg-stone-900 border-b border-stone-200">
        <SmartImage
          src={store.coverImage}
          alt={store.businessName}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-6 relative z-10 text-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white bg-stone-800 shrink-0">
                <SmartImage src={store.logo} alt={store.businessName} />
              </div>
              <div>
                <p className="text-xs text-amber-300 font-medium">
                  {store.categoryName} · {store.locationName} · Verified Stall
                </p>
                <h1 className="font-display text-2xl sm:text-4xl font-bold mt-0.5">
                  {store.businessName}
                </h1>
                <p className="text-xs sm:text-sm text-stone-200 mt-1">
                  ⭐ {store.rating.toFixed(1)} ({store.reviewCount} reviews) ·{' '}
                  {store.followersCount} followers · {store.openingHours}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => toggleFollowSeller(store.sellerId)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isFollowing
                    ? 'bg-white text-stone-900'
                    : 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold'
                }`}
              >
                {isFollowing ? 'Following Stall' : '+ Follow Stall'}
              </button>
              <button
                type="button"
                onClick={() => toggleSaveStore(store.id)}
                className="px-3.5 py-2 rounded-lg bg-stone-800/90 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-600 cursor-pointer"
              >
                {isSaved ? 'Saved' : 'Save Stall'}
              </button>
              <button
                type="button"
                onClick={() => {
                  startConversationWithStore(store);
                  navigate('messages');
                }}
                className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
              >
                Message Seller
              </button>
              <a
                href={`https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(
                  `Habari ${store.businessName}, I am shopping on your Jaza Kikapu digital stall.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-emerald-300 border border-emerald-700/60 text-xs font-semibold"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Store Tabs & Content */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-3">
          {(['Products', 'Deals', 'Posts', 'Live', 'About', 'Reviews'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {activeTab === 'Deals' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeDeals.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-xl border border-stone-200 text-center text-sm text-stone-500">
                No active flash deals for this stall right now. Check the Products tab!
              </div>
            ) : (
              storeDeals.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        )}

        {activeTab === 'Posts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storePosts.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-xl border border-stone-200 text-center text-sm text-stone-500">
                No social posts published yet.
              </div>
            ) : (
              storePosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-5 rounded-xl border border-stone-200 space-y-3"
                >
                  <p className="text-xs text-emerald-900 font-semibold">
                    {post.badgeLabel} · {post.createdAt}
                  </p>
                  <h3 className="text-base font-bold text-stone-900">{post.title}</h3>
                  <p className="text-sm text-stone-600">{post.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'Live' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storeLives.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-xl border border-stone-200 text-center text-sm text-stone-500">
                This seller is not live at the moment. Follow the stall to get notified when they go
                live!
              </div>
            ) : (
              storeLives.map((s) => (
                <div
                  key={s.id}
                  className="bg-white p-5 rounded-xl border border-stone-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-rose-600">🔴 LIVE NOW</span>
                    <h3 className="text-base font-bold text-stone-900 mt-1">{s.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">{s.viewerCount} watching</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('live-session', { liveId: s.id })}
                    className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Join Stream
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'About' && (
          <div className="bg-white p-6 rounded-xl border border-stone-200 max-w-2xl space-y-4">
            <h3 className="font-display text-xl font-bold text-stone-900">
              About {store.businessName}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">{store.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-100 text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <MapPin className="w-4 h-4 text-emerald-900" />
                <span>Location: {store.locationName}, Taita-Taveta</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Clock className="w-4 h-4 text-emerald-900" />
                <span>{store.openingHours}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Truck className="w-4 h-4 text-emerald-900" />
                <span>{store.deliveryInfo}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Phone className="w-4 h-4 text-emerald-900" />
                <span className="font-mono-tabular">{store.contactPhone}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              {storeReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-900">{rev.authorName}</span>
                    <span className="text-stone-400">{rev.createdAt}</span>
                  </div>
                  <div className="text-amber-500 text-xs">{'★'.repeat(rev.rating)}</div>
                  <p className="text-sm text-stone-700">{rev.comment}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleReviewSubmit}
              className="lg:col-span-5 bg-white p-5 rounded-xl border border-stone-200 space-y-3 h-fit"
            >
              <h3 className="text-sm font-bold text-stone-900">Write a Customer Review</h3>
              <div>
                <label className="block text-xs text-stone-600 mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value={5}>5 Stars — Excellent Local Stall</option>
                  <option value={4}>4 Stars — Good Quality & Fast</option>
                  <option value={3}>3 Stars — Average</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-600 mb-1">Your Experience</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share how your product or delivery was..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-900 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProductDetailView: React.FC = () => {
  const {
    activeProductId,
    products,
    stores,
    reviews,
    addToKikapu,
    navigate,
    startConversationWithStore,
    pushToast,
  } = useMarketplace();

  const [qty, setQty] = useState(1);
  const product = products.find((p) => p.id === activeProductId) || products[0];
  const store = stores.find((s) => s.id === product.storeId) || stores[0];
  const productReviews = reviews.filter(
    (r) => r.productId === product.id || r.storeId === store.id
  );

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <button
          type="button"
          onClick={() => navigate('explore')}
          className="hover:text-stone-900 cursor-pointer"
        >
          Market
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => navigate('store-detail', { storeSlug: store.slug })}
          className="hover:text-stone-900 cursor-pointer"
        >
          {store.businessName}
        </button>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate">{product.name}</span>
      </div>

      {/* Contiguous Purchase Module (Sticky Gallery Left, Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="aspect-4/3 w-full bg-[#F5F4F0]">
            <SmartImage
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>{product.category}</span>
              <span>·</span>
              <span>{product.location}</span>
              <span>·</span>
              <span className="text-emerald-800 font-semibold">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-mono-tabular text-2xl sm:text-3xl font-bold text-stone-950">
                KSh {product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="font-mono-tabular text-sm text-stone-400 line-through">
                  KSh {product.compareAtPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-stone-500">per {product.unit}</span>
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>

          {/* Quantity & Primary Actions */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-stone-700">Quantity:</span>
              <div className="inline-flex items-center border border-stone-300 rounded-lg bg-stone-50">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-stone-700 cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-mono-tabular font-semibold text-stone-900">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-1.5 text-sm font-bold text-stone-700 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => addToKikapu(product, qty, false)}
                className="py-3 px-5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO KIKAPU</span>
              </button>
              <button
                type="button"
                onClick={() => addToKikapu(product, qty, true)}
                className="py-3 px-5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>BUY NOW (M-PESA)</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('store-detail', { storeSlug: store.slug })}
                className="px-3.5 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <StoreIcon className="w-3.5 h-3.5" />
                <span>VIEW STORE ({store.businessName})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  startConversationWithStore(store, product);
                  navigate('messages');
                }}
                className="px-3.5 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>MESSAGE SELLER</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  pushToast('Product link copied to clipboard!');
                }}
                className="px-3.5 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>SHARE</span>
              </button>
            </div>
          </div>

          {/* Seller Assurance Box */}
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/80 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-stone-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-800" />
              <span>Sold by {store.businessName} ({store.locationName})</span>
            </div>
            <p className="text-stone-600">{store.deliveryInfo}</p>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-display text-xl font-bold text-stone-900">
          Verified Buyer Reviews ({productReviews.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productReviews.map((r) => (
            <div key={r.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/70">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{r.authorName}</span>
                <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 mt-1.5">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DealsView: React.FC = () => {
  const { products, pricingConfig, navigate } = useMarketplace();
  const dealProducts = products.filter((p) => p.status === 'ACTIVE' && (p.isDeal || p.featured));

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-10">
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <p className="text-xs font-semibold text-amber-400">
            Today’s Deals · Flash Promotions · Boosted Stalls
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Taita-Taveta Market Deals & Flash Savings
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Shop verified price drops from local supermarkets, fashion boutiques, and farm stalls.
            Are you a seller? Boost your product starting at KSh{' '}
            {pricingConfig.boostPlans[0]?.priceKsh || 200}/day.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('seller-dashboard')}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer"
        >
          Boost a Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
