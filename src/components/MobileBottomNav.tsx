import React from 'react';
import { useMarket } from '../context/MarketContext';
import { Store, Radio, ShoppingBag, MessageSquare, LayoutDashboard } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { totalKikapuItems, setIsKikapuOpen, activeRole } = useMarket();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6E0D4] px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        {/* Market */}
        <button
          onClick={() => setActiveTab('market')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition-colors ${
            activeTab === 'market' ? 'text-[#1B4332]' : 'text-stone-500'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5 tracking-tight">Market</span>
        </button>

        {/* Live */}
        <button
          onClick={() => setActiveTab('live')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition-colors ${
            activeTab === 'live' ? 'text-[#E63946]' : 'text-stone-500'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5 tracking-tight">Live</span>
          <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-[#E63946] animate-pulse"></span>
        </button>

        {/* Kikapu (Central Action) */}
        <button
          onClick={() => setIsKikapuOpen(true)}
          className="relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 text-[#1B4332] cursor-pointer"
        >
          <div className="relative p-1.5 rounded-full bg-[#1B4332] text-[#F4A261] shadow-md">
            <ShoppingBag className="w-5 h-5" />
            {totalKikapuItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D95D39] text-white font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalKikapuItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-[#1B4332] mt-0.5 tracking-tight">Kikapu</span>
        </button>

        {/* Requests */}
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition-colors ${
            activeTab === 'requests' ? 'text-[#1B4332]' : 'text-stone-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5 tracking-tight">Requests</span>
        </button>

        {/* Console / Role */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition-colors ${
            activeTab === 'dashboard' ? 'text-[#1B4332]' : 'text-stone-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5 tracking-tight">
            {activeRole === 'BUYER' ? 'Orders' : 'Console'}
          </span>
        </button>
      </div>
    </nav>
  );
};
