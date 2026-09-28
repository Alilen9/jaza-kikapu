import React, { useState, useEffect } from 'react';
import { GroupBuyCampaign } from '../types';
import { api } from '../services/api';
import { useMarket } from '../context/MarketContext';
import { Users, Clock, Flame, Check, Tag } from 'lucide-react';

export const GroupBuyingView: React.FC = () => {
  const { showToast } = useMarket();
  const [campaigns, setCampaigns] = useState<GroupBuyCampaign[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);

  useEffect(() => {
    api.getGroupBuy().then(setCampaigns).catch(console.error);
  }, []);

  const handleJoin = async (c: GroupBuyCampaign) => {
    try {
      const res = await api.joinGroupBuy(c.id);
      setCampaigns(prev =>
        prev.map(item =>
          item.id === c.id ? { ...item, currentParticipants: res.currentParticipants } : item
        )
      );
      setJoinedIds(prev => [...prev, c.id]);
      showToast(`Joined group deal for ${c.productName}! You will unlock the lowest discount tier.`);
    } catch {
      showToast('Error joining campaign');
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D95D39]/10 text-[#D95D39] text-xs font-semibold mb-1.5">
          <Flame className="w-3.5 h-3.5" />
          <span>Voi Wholesale & Community Deals</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-stone-900 tracking-tight">
          Group Buying Campaigns
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          Join with fellow community shoppers in Voi to hit volume thresholds and unlock massive wholesale discounts!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map(c => {
          const isJoined = joinedIds.includes(c.id);
          const progressToTier1 = Math.min(100, Math.round((c.currentParticipants / c.tier1Target) * 100));
          const isTier1Unlocked = c.currentParticipants >= c.tier1Target;
          const isTier2Unlocked = c.currentParticipants >= c.tier2Target;

          return (
            <div key={c.id} className="bg-white rounded-3xl border border-[#E6E0D4] overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="relative h-48 bg-stone-100">
                <img
                  src={c.image}
                  alt={c.productName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#1B4332] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Clock className="w-3 h-3" />
                  <span>Ends in {c.expiresInHours} hrs</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    {c.storeName}
                  </div>
                  <h3 className="font-display font-bold text-base text-stone-900 mb-3">
                    {c.productName}
                  </h3>

                  {/* Price Comparison Tiers */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-stone-50 rounded-2xl border border-stone-200 text-center mb-4">
                    <div className="p-1">
                      <div className="text-[10px] text-stone-400 font-semibold">Standard</div>
                      <div className="font-mono text-xs font-bold text-stone-600 line-through">
                        KES {c.standardPrice.toLocaleString()}
                      </div>
                    </div>

                    <div className={`p-1 rounded-xl ${isTier1Unlocked ? 'bg-amber-100 text-amber-900' : ''}`}>
                      <div className="text-[10px] text-stone-600 font-semibold">{c.tier1Target}+ Buyers</div>
                      <div className="font-mono text-xs font-bold text-stone-900">
                        KES {c.tier1Price.toLocaleString()}
                      </div>
                    </div>

                    <div className={`p-1 rounded-xl ${isTier2Unlocked ? 'bg-emerald-100 text-emerald-900 font-bold' : ''}`}>
                      <div className="text-[10px] text-emerald-700 font-semibold">{c.tier2Target}+ Goal</div>
                      <div className="font-mono text-xs font-bold text-emerald-800">
                        KES {c.tier2Price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1 text-stone-700">
                        <Users className="w-3.5 h-3.5 text-[#1B4332]" />
                        <strong>{c.currentParticipants}</strong> Joined so far
                      </span>
                      <span className="text-[#D95D39] font-bold">
                        {c.tier2Target - c.currentParticipants > 0
                          ? `${c.tier2Target - c.currentParticipants} more needed for KES ${c.tier2Price.toLocaleString()}`
                          : 'Maximum Discount Unlocked!'}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, (c.currentParticipants / c.tier2Target) * 100)}%` }}
                        className="h-full bg-gradient-to-r from-[#D95D39] to-[#1B4332] rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleJoin(c)}
                  disabled={isJoined}
                  className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    isJoined
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-[#1B4332] hover:bg-[#143225] text-white shadow-sm'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>You have joined this deal!</span>
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4 text-[#F4A261]" />
                      <span>Join Group Buy Campaign</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
