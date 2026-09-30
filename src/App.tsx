/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { KikapuDrawer } from './components/KikapuDrawer';
import { AuthModal } from './components/AuthModal';
import {
  HomeView,
  ExploreView,
  StoresDirectoryView,
  StoreDetailView,
  ProductDetailView,
  DealsView,
} from './views/MarketplaceViews';
import {
  LiveDirectoryView,
  LiveSessionRoomView,
  FullKikapuView,
  MessagesView,
  NotificationsView,
} from './views/LiveAndSocialViews';
import {
  BuyerDashboardView,
  SellerOnboardingView,
  SellerDashboardView,
  RiderOnboardingView,
  RiderDashboardView,
  AdminDashboardView,
} from './views/DashboardViews';
import { CheckCircle2, X } from 'lucide-react';

const MarketplaceShell: React.FC = () => {
  const {
    route,
    navigate,
    toasts,
    dismissToast,
    locations,
    setSelectedLocationId,
    openAuthModal,
  } = useMarketplace();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900">
      <Navbar />
      <KikapuDrawer />
      <AuthModal />

      {/* Main Route Viewport */}
      <main className="flex-1">
        {route === 'home' && <HomeView />}
        {route === 'explore' && <ExploreView />}
        {route === 'stores' && <StoresDirectoryView />}
        {route === 'store-detail' && <StoreDetailView />}
        {route === 'product-detail' && <ProductDetailView />}
        {route === 'deals' && <DealsView />}
        {route === 'live' && <LiveDirectoryView />}
        {route === 'live-session' && <LiveSessionRoomView />}
        {route === 'kikapu' && <FullKikapuView />}
        {route === 'messages' && <MessagesView />}
        {route === 'notifications' && <NotificationsView />}
        {route === 'dashboard' && <BuyerDashboardView />}
        {route === 'seller-onboarding' && <SellerOnboardingView />}
        {route === 'seller-dashboard' && <SellerDashboardView />}
        {route === 'rider-onboarding' && <RiderOnboardingView />}
        {route === 'rider-dashboard' && <RiderDashboardView />}
        {route === 'admin' && <AdminDashboardView />}
      </main>

      {/* Clean Marketplace Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pb-20 md:pb-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="font-display text-xl font-bold text-white">Jaza Kikapu</div>
            <p className="text-stone-400 leading-relaxed">
              Your market. Your sellers. Your basket. Serving local businesses, households, and
              riders across Voi, Wundanyi, Mwatate, Taveta, and the wider Taita-Taveta region.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-white">Taita-Taveta Towns</div>
            <ul className="space-y-1.5 text-stone-400">
              {locations.map((loc) => (
                <li key={loc.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocationId(loc.id);
                      navigate('explore');
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    {loc.name} Market ({loc.activeStoresCount} Stalls)
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-white">Marketplace & Onboarding</div>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('seller-onboarding')}
                  className="hover:text-white cursor-pointer"
                >
                  Apply to Become a Seller
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('rider-onboarding')}
                  className="hover:text-white cursor-pointer"
                >
                  Apply to Become a Jaza Rider
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('live')}
                  className="hover:text-white cursor-pointer"
                >
                  Jaza Live Selling
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('deals')}
                  className="hover:text-white cursor-pointer"
                >
                  Today’s Deals & Boosts
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-white">Role Portals & Logins</div>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => openAuthModal('BUYER_SIGNUP')}
                  className="hover:text-white cursor-pointer"
                >
                  Buyer Sign Up / Log In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAuthModal('SELLER_LOGIN')}
                  className="hover:text-white cursor-pointer"
                >
                  Seller Portal Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAuthModal('RIDER_LOGIN')}
                  className="hover:text-white cursor-pointer"
                >
                  Jaza Rider Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAuthModal('ADMIN_LOGIN')}
                  className="hover:text-white cursor-pointer"
                >
                  Private Admin Console
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <span>© 2026 Jaza Kikapu Marketplace · Taita-Taveta County, Kenya</span>
          <span>M-Pesa Daraja Ready · Multi-Stall Kikapu Architecture</span>
        </div>
      </footer>

      {/* Toast Notification Stack */}
      {toasts.length > 0 && (
        <div className="fixed bottom-16 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto bg-stone-950 text-white p-3.5 rounded-xl shadow-xl border border-stone-800 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold">{t.title}</p>
                  {t.description && (
                    <p className="text-[11px] text-stone-300 mt-0.5">{t.description}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceShell />
    </MarketplaceProvider>
  );
}
