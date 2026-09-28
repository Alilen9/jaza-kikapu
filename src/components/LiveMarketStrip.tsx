import React, { useEffect, useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { LiveSession } from '../types';
import { api } from '../services/api';
import { Users, Pin, ArrowRight } from 'lucide-react';

interface LiveMarketStripProps {
  onSelectSession: (session: LiveSession) => void;
}

export const LiveMarketStrip: React.FC<LiveMarketStripProps> = ({ onSelectSession }) => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getLiveSessions()
      .then(res => {
        setSessions(res);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="py-6 animate-pulse">
        <div className="h-6 w-48 bg-stone-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44 bg-stone-200 rounded-2xl"></div>
          <div className="h-44 bg-stone-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63946] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E63946]"></span>
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 tracking-tight">
            Live Market Broadcasts
          </h2>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            · Watch sellers demonstrate fresh stock right now
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map(session => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session)}
            className="group relative overflow-hidden rounded-2xl bg-stone-900 text-white cursor-pointer shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between p-5 min-h-[190px]"
          >
            {/* Background Stream Simulation Preview */}
            <div className="absolute inset-0 z-0">
              <video
                src={session.streamVideoUrl}
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />
            </div>

            {/* Top Bar with LIVE Badge and Viewers */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#E63946] text-white text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  LIVE
                </span>
                <span className="flex items-center gap-1 text-xs font-mono font-medium text-stone-200 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
                  <Users className="w-3 h-3 text-[#F4A261]" />
                  {session.viewerCount} in stall
                </span>
              </div>

              {session.pinnedProductIds && session.pinnedProductIds.length > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  <Pin className="w-3 h-3" />
                  {session.pinnedProductIds.length} Pinned
                </span>
              )}
            </div>

            {/* Bottom Content with Seller Info */}
            <div className="relative z-10 pt-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <img
                  src={session.storeLogo}
                  alt={session.storeName}
                  className="w-7 h-7 rounded-full object-cover border border-white/30"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-semibold text-[#F4A261]">
                  {session.storeName}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-1 group-hover:text-[#F4A261] transition-colors">
                {session.title}
              </h3>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-xs text-stone-300">
                <span>Click to enter live stall</span>
                <span className="flex items-center gap-1 text-[#F4A261] font-semibold group-hover:translate-x-1 transition-transform">
                  Enter Stream <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
