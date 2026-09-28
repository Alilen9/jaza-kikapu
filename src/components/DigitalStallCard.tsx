import React, { useState } from 'react';
import { Store, Product } from '../types';
import { useMarket } from '../context/MarketContext';
import { CheckCircle2, Star, MapPin, ArrowRight, UserPlus, Info } from 'lucide-react';

interface DigitalStallCardProps {
  store: Store;
  products: Product[];
  onEnterStore: (store: Store) => void;
}

export const DigitalStallCard: React.FC<DigitalStallCardProps> = ({
  store,
  products,
  onEnterStore,
}) => {
  const { followedStoreIds, toggleFollowStore } = useMarket();
  const [showScoreModal, setShowScoreModal] = useState(false);

  const isFollowing = followedStoreIds.includes(store.id);
  const stallProducts = products.filter(p => p.storeId === store.id).slice(0, 3);

  return (
    <div className="bg-white rounded-3xl border border-[#E6E0D4] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Cover Image & Open Status */}
      <div className="relative h-36 sm:h-40 overflow-hidden bg-stone-100">
        <img
          src={store.coverImage}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white">
            <span className={`w-2 h-2 rounded-full ${store.isOpen ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            {store.isOpen ? 'OPEN NOW' : 'CLOSED'}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFollowStore(store.id);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors backdrop-blur-md ${
              isFollowing
                ? 'bg-[#1B4332] text-white'
                : 'bg-white/80 hover:bg-white text-stone-900'
            }`}
          >
            <UserPlus className="w-3 h-3" />
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
          </button>
        </div>

        {/* Stall Location Marker */}
        <div className="absolute bottom-2.5 left-3 text-white text-xs font-medium flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#F4A261]" />
          <span>{store.stallNumber} · {store.marketName}</span>
        </div>
      </div>

      {/* Stall Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header with Logo, Name & Verified Badge */}
          <div className="flex items-start gap-3 mb-2.5">
            <img
              src={store.logoImage}
              alt={store.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0 -mt-8 relative z-10 bg-white"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-display font-bold text-base text-stone-900 truncate">
                  {store.name}
                </h3>
                {store.status === 'VERIFIED' && (
                  <span title="Verified Voi Business">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0" />
                  </span>
                )}
              </div>
              <div className="text-xs text-stone-500 font-medium">
                {store.category}
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
            {store.description}
          </p>

          {/* Jaza Score & Performance Indicators */}
          <div className="flex items-center justify-between py-2 border-y border-stone-100 text-xs mb-3">
            <button
              onClick={() => setShowScoreModal(true)}
              className="flex items-center gap-1.5 font-medium text-stone-700 hover:text-[#D95D39] cursor-pointer"
              title="Click to view Jaza Score breakdown"
            >
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{store.jazaScore.toFixed(1)}</span>
              </div>
              <span className="text-stone-500 text-[11px] underline">Jaza Score</span>
              <Info className="w-3 h-3 text-stone-400" />
            </button>

            <div className="text-[11px] text-stone-500 font-medium">
              <span>{store.ordersCompleted} orders</span>
              <span className="mx-1.5">·</span>
              <span>{store.responseRate}% response</span>
            </div>
          </div>

          {/* Product Thumbnails from this Stall */}
          {stallProducts.length > 0 && (
            <div className="mb-4">
              <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-2">
                Stall Catalog Highlights
              </div>
              <div className="grid grid-cols-3 gap-2">
                {stallProducts.map(p => (
                  <div key={p.id} className="group/item relative rounded-xl overflow-hidden bg-stone-50 border border-stone-100 p-1">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-16 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="mt-1 text-[11px] font-bold text-stone-800 tabular-nums">
                      KES {p.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enter Stall CTA Button */}
        <button
          onClick={() => onEnterStore(store)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-[#1B4332] text-stone-800 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <span>Enter Digital Stall</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Jaza Score Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-lg text-stone-900">
                Jaza Reputation Score
              </h4>
              <button
                onClick={() => setShowScoreModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl">
                {store.jazaScore.toFixed(1)}
              </div>
              <div>
                <div className="font-semibold text-sm text-stone-900">{store.name}</div>
                <div className="text-xs text-amber-800 font-medium">Top Verified Voi Seller</div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-stone-700">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Successful Orders Fulfilled</span>
                <span className="font-bold text-stone-900">{store.ordersCompleted} orders</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Customer Chat Response Rate</span>
                <span className="font-bold text-emerald-700">{store.responseRate}% (Avg &lt; 5 mins)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Physical Stall Verification</span>
                <span className="font-bold text-[#1B4332]">Verified at {store.stallNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Community Followers</span>
                <span className="font-bold text-stone-900">{store.followersCount} buyers</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 mt-4 leading-relaxed">
              Jaza Score is transparently computed from real order completion records, verified market registration in Taita-Taveta, and verified buyer reviews.
            </p>

            <button
              onClick={() => setShowScoreModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
