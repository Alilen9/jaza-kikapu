import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { MapPin, ShoppingBag, Radio, Sparkles, User, ChevronDown, Store, Bike, ShieldCheck } from 'lucide-react';
import { AppUserRole } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    activeLocation,
    setIsLocationModalOpen,
    totalKikapuItems,
    setIsKikapuOpen,
    activeRole,
    setActiveRole,
    setIsAIAssistantOpen,
    setIsSellerAuthOpen,
    setSellerAuthMode,
    currentSellerStore,
    setIsRiderAuthOpen,
    setRiderAuthMode,
    currentRider,
  } = useMarket();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roles: { role: AppUserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'BUYER', label: 'Buyer (Shopper)', icon: <User className="w-3.5 h-3.5" />, color: 'text-stone-700' },
    { role: 'SELLER', label: 'Mama Asha (Seller)', icon: <Store className="w-3.5 h-3.5" />, color: 'text-amber-700' },
    { role: 'RIDER', label: 'Juma Mwasi (Rider)', icon: <Bike className="w-3.5 h-3.5" />, color: 'text-emerald-700' },
    { role: 'ADMIN', label: 'Platform Admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'text-rose-700' },
  ];

  const currentRoleConfig = roles.find(r => r.role === activeRole) || roles[0];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E6E0D4] px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & Location */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('market')}
            className="text-left group flex items-center gap-2 cursor-pointer focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              JK
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#1B4332] group-hover:text-[#D95D39] transition-colors">
                Jaza Kikapu
              </span>
            </div>
          </button>

          {/* Location Trigger */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-700 bg-white border border-[#E6E0D4] rounded-lg hover:border-[#D95D39] transition-colors cursor-pointer"
            title="Change market location"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D95D39]" />
            <span className="truncate max-w-[130px]">
              {activeLocation ? activeLocation.marketName : 'Voi Main Market'}
            </span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean Unboxed Typography) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('market')}
            className={`cursor-pointer transition-colors hover:text-[#1B4332] ${
              activeTab === 'market' ? 'text-[#1B4332] font-semibold underline underline-offset-8 decoration-[#D95D39] decoration-2' : ''
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`cursor-pointer transition-colors hover:text-[#1B4332] flex items-center gap-1.5 ${
              activeTab === 'live' ? 'text-[#1B4332] font-semibold underline underline-offset-8 decoration-[#E63946] decoration-2' : ''
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63946] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E63946]"></span>
            </span>
            Watch Live
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`cursor-pointer transition-colors hover:text-[#1B4332] ${
              activeTab === 'requests' ? 'text-[#1B4332] font-semibold underline underline-offset-8 decoration-[#D95D39] decoration-2' : ''
            }`}
          >
            Request a Product
          </button>
          <button
            onClick={() => setActiveTab('quick-basket')}
            className={`cursor-pointer transition-colors hover:text-[#1B4332] ${
              activeTab === 'quick-basket' ? 'text-[#1B4332] font-semibold underline underline-offset-8 decoration-[#D95D39] decoration-2' : ''
            }`}
          >
            Quick Basket
          </button>
          <button
            onClick={() => setActiveTab('group-buy')}
            className={`cursor-pointer transition-colors hover:text-[#1B4332] ${
              activeTab === 'group-buy' ? 'text-[#1B4332] font-semibold underline underline-offset-8 decoration-[#D95D39] decoration-2' : ''
            }`}
          >
            Group Deals
          </button>
          {activeRole !== 'BUYER' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`cursor-pointer transition-colors font-semibold ${
                activeTab === 'dashboard' ? 'text-[#1B4332] underline underline-offset-8 decoration-[#1B4332] decoration-2' : 'text-[#D95D39]'
              }`}
            >
              {activeRole === 'SELLER' ? 'Stall Console' : activeRole === 'RIDER' ? 'Rider Console' : 'Admin Panel'}
            </button>
          )}
        </nav>

        {/* Zone 3: Actions (AI Assistant + Seller Portal + Role Switcher + Kikapu) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Jaza AI Trigger */}
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1B4332] bg-[#E8F0EC] hover:bg-[#D5E5DC] rounded-xl transition-colors cursor-pointer border border-[#C8DFD2]"
            title="Ask Jaza AI to search Voi market stalls"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1B4332] animate-pulse" />
            <span className="hidden sm:inline font-bold">Jaza AI</span>
          </button>

          {/* Seller Portal Trigger (Sign In / Register Stall) */}
          <button
            onClick={() => {
              if (currentSellerStore) {
                setActiveRole('SELLER');
                setActiveTab('dashboard');
              } else {
                setSellerAuthMode('login');
                setIsSellerAuthOpen(true);
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer"
            title={currentSellerStore ? `Logged in as ${currentSellerStore.name}` : 'Seller Sign In / Open a Stall'}
          >
            <Store className="w-3.5 h-3.5 text-amber-700" />
            <span>{currentSellerStore ? 'My Stall' : 'Seller Portal'}</span>
          </button>

          {/* Rider Portal Trigger (Sign In / Register Rider) */}
          <button
            onClick={() => {
              if (currentRider) {
                setActiveRole('RIDER');
                setActiveTab('dashboard');
              } else {
                setRiderAuthMode('login');
                setIsRiderAuthOpen(true);
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
            title={currentRider ? `Logged in as Rider ${currentRider.name}` : 'Boda Rider Sign In / Sign Up'}
          >
            <Bike className="w-3.5 h-3.5 text-emerald-700" />
            <span>{currentRider ? 'Rider Console' : 'Rider Fleet'}</span>
          </button>

          {/* Role Switcher (Allows testing all personas seamlessly) */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-white border border-[#E6E0D4] rounded-xl hover:border-stone-400 transition-colors cursor-pointer"
              title="Switch user role for testing"
            >
              {currentRoleConfig.icon}
              <span className="hidden sm:inline font-semibold text-stone-800">{currentRoleConfig.label.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E6E0D4] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wider border-b border-stone-100">
                  Switch Active Persona
                </div>
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setActiveRole(r.role);
                      setIsRoleDropdownOpen(false);
                      if (r.role !== 'BUYER') {
                        setActiveTab('dashboard');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left cursor-pointer hover:bg-stone-50 transition-colors ${
                      activeRole === r.role ? 'bg-stone-100 font-semibold text-stone-900' : 'text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {r.icon}
                      <span>{r.label}</span>
                    </div>
                    {activeRole === r.role && <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kikapu Basket Trigger */}
          <button
            onClick={() => setIsKikapuOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1B4332] text-white hover:bg-[#143225] transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Open Kikapu"
          >
            <ShoppingBag className="w-4 h-4 text-[#F4A261]" />
            <span className="font-semibold text-xs tracking-wide">Kikapu</span>
            {totalKikapuItems > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#D95D39] text-white font-mono text-[11px] font-bold">
                {totalKikapuItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
