import React, { useState } from 'react';
import { Store, Product } from '../types';
import { useMarket } from '../context/MarketContext';
import { ProductCard } from './ProductCard';
import { CheckCircle2, Star, MapPin, Phone, UserPlus, X, MessageSquare, Sparkles } from 'lucide-react';

interface DigitalStallModalProps {
  store: Store;
  products: Product[];
  onClose: () => void;
  onOpenShowMe: (product: Product) => void;
}

export const DigitalStallModal: React.FC<DigitalStallModalProps> = ({
  store,
  products,
  onClose,
  onOpenShowMe,
}) => {
  const { followedStoreIds, toggleFollowStore, setSelectedProductForShowMe } = useMarket();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const storeProducts = products.filter(p => p.storeId === store.id);
  const isFollowing = followedStoreIds.includes(store.id);

  const categories = ['All', ...Array.from(new Set(storeProducts.map(p => p.category)))];

  const displayedProducts = selectedCategory === 'All'
    ? storeProducts
    : storeProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Cover & Header */}
        <div className="relative h-48 sm:h-64 shrink-0 bg-stone-900">
          <img
            src={store.coverImage}
            alt={store.name}
            className="w-full h-full object-cover brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stall Header Details */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div className="flex items-center gap-3.5">
              <img
                src={store.logoImage}
                alt={store.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg bg-white"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                    {store.name}
                  </h2>
                  {store.status === 'VERIFIED' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F4A261]" />
                    {store.stallNumber} · {store.marketName}
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">
                    {store.isOpen ? 'OPEN NOW' : 'CLOSED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFollowStore(store.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  isFollowing
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-white text-stone-900 hover:bg-stone-100'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isFollowing ? 'Following' : 'Follow Stall'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reputation & Info Bar */}
        <div className="p-5 border-b border-stone-100 bg-[#FBF9F5] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-stone-700">
            <div className="flex items-center gap-1.5 font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{store.jazaScore.toFixed(1)} Jaza Score</span>
            </div>
            <span><strong>{store.ordersCompleted}</strong> Completed Orders</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline"><strong>{store.responseRate}%</strong> Response Rate</span>
            <span>·</span>
            <span><strong>{store.followersCount}</strong> Followers</span>
          </div>

          <div className="flex items-center gap-2 text-stone-600">
            <Phone className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Official Stall Line: <strong>{store.phone}</strong></span>
          </div>
        </div>

        {/* Description & Show Me Callout */}
        <div className="p-6">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-[#1B4332] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Shopping Feature</span>
              </div>
              <p className="text-xs text-stone-600">
                Want to see how an item looks, check sizes, or see different colors before buying?
              </p>
            </div>
            <button
              onClick={() => {
                if (storeProducts.length > 0) {
                  onOpenShowMe(storeProducts[0]);
                }
              }}
              className="px-4 py-2 rounded-xl bg-[#D95D39] text-white hover:bg-[#C24E2C] text-xs font-semibold whitespace-nowrap cursor-pointer"
            >
              Ask Seller "Show Me"
            </button>
          </div>

          {/* Stall Products Catalog */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-stone-900">
              Stall Catalog ({storeProducts.length} Items)
            </h3>

            {categories.length > 2 && (
              <div className="flex items-center gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#1B4332] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onShowMe={(prod) => {
                  setSelectedProductForShowMe(prod);
                  onOpenShowMe(prod);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
