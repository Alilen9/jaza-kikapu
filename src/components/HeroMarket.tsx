import React from 'react';
import { useMarket } from '../context/MarketContext';
import { ArrowRight, Radio, Sparkles, MapPin } from 'lucide-react';

interface HeroMarketProps {
  onEnterMarket: () => void;
  onWatchLive: () => void;
}

export const HeroMarket: React.FC<HeroMarketProps> = ({ onEnterMarket, onWatchLive }) => {
  const { activeLocation, setIsLocationModalOpen, setIsAIAssistantOpen } = useMarket();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#1B4332] text-white my-4 shadow-xl">
      {/* Background Hero Photography with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/jaza_voi_market_hero_1790521921384.jpg"
          alt="Voi open air market atmosphere"
          className="w-full h-full object-cover object-center brightness-75 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332]/95 via-[#1B4332]/85 to-[#1B4332]/40" />
      </div>

      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-12 lg:py-16 max-w-4xl">
        {/* Market Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-[#F4A261] mb-6">
          <MapPin className="w-3.5 h-3.5 text-[#F4A261]" />
          <span>Currently browsing: <strong>{activeLocation?.marketName || 'Voi Main Market'}</strong>, {activeLocation?.subCounty || 'Voi'}</span>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-white underline text-[11px] ml-1 hover:text-[#F4A261] cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* Large Statement */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight mb-4 text-balance">
          ENTER THE MARKET
        </h1>

        <p className="text-base sm:text-lg text-stone-200 max-w-2xl font-normal leading-relaxed mb-8 text-balance">
          Discover local businesses, watch sellers live, talk to shop owners, fill your Kikapu from multiple stalls, and get consolidated rider delivery right to your door.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
          <button
            onClick={onEnterMarket}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D95D39] text-white font-semibold text-sm hover:bg-[#C24E2C] transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>ENTER MARKET</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onWatchLive}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 font-semibold text-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63946] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E63946]"></span>
            </span>
            <span>WATCH LIVE NOW</span>
          </button>

          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-[#F4A261]/20 hover:bg-[#F4A261]/30 text-[#F4A261] border border-[#F4A261]/30 font-medium text-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Search with Jaza AI</span>
          </button>
        </div>

        {/* Clean Typographic Trust Proofs (Zero Pills) */}
        <div className="flex flex-wrap items-center gap-y-2 text-xs sm:text-sm text-stone-300 font-medium border-t border-white/15 pt-6">
          <span>Voi Central & Tsavo Hub</span>
          <span className="mx-3 text-stone-400" aria-hidden="true">·</span>
          <span>100% Real Local Inventory</span>
          <span className="mx-3 text-stone-400" aria-hidden="true">·</span>
          <span>Consolidated Boda Boda Delivery</span>
          <span className="mx-3 text-stone-400" aria-hidden="true">·</span>
          <span>Safaricom M-Pesa Verified</span>
        </div>
      </div>
    </section>
  );
};
