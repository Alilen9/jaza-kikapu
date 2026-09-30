import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  MessageSquare,
  Bell,
  Store as StoreIcon,
  Bike,
  ShieldCheck,
  Home,
  Compass,
  Radio,
  LogOut,
  Search,
} from 'lucide-react';
import { useMarketplace, AppRoute } from '../context/MarketplaceContext';

export const Navbar: React.FC = () => {
  const {
    route,
    navigate,
    user,
    isAuthenticated,
    openAuthModal,
    logout,
    kikapuItemCount,
    setIsKikapuDrawerOpen,
    notifications,
    conversations,
    searchQuery,
    setSearchQuery,
  } = useMarketplace();

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: AppRoute; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'stores', label: 'Stores' },
    { id: 'live', label: 'Live' },
    { id: 'deals', label: 'Deals' },
  ];

  const handleNavbarSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('explore');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900 hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
            >
              JAZA KIKAPU
            </button>

            {/* Primary Navigation Links */}
            <nav
              aria-label="Primary Marketplace Navigation"
              className="hidden lg:flex items-center gap-5 text-sm font-medium text-stone-600"
            >
              {navItems.map((item) => {
                const isActive =
                  route === item.id ||
                  (item.id === 'stores' && route === 'store-detail') ||
                  (item.id === 'live' && route === 'live-session') ||
                  (item.id === 'explore' && route === 'product-detail');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                      isActive
                        ? 'text-stone-950 font-semibold border-emerald-800'
                        : 'border-transparent hover:text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search Input */}
          <form
            onSubmit={handleNavbarSearch}
            className="hidden md:flex items-center flex-1 max-w-xs relative"
          >
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (route !== 'explore' && e.target.value.trim().length > 1) {
                  navigate('explore');
                }
              }}
              placeholder="Search products, stores..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-800"
            />
          </form>

          {/* Right Actions: Become a Seller / Rider + LOGIN / SIGN UP + Kikapu */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate('seller-onboarding')}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-emerald-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              <StoreIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>BECOME A SELLER</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('rider-onboarding')}
              className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Bike className="w-3.5 h-3.5 text-emerald-800" />
              <span>BECOME A RIDER</span>
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('ROLE_SELECT_LOGIN')}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    route === 'login'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-800 bg-stone-100 hover:bg-stone-200/80'
                  }`}
                >
                  LOGIN
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('ROLE_SELECT_SIGNUP')}
                  className="px-3 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  SIGN UP
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/75 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-stone-600 shrink-0" />
                  <span className="hidden sm:inline">
                    {user.name.split(' ')[0]} ({user.role})
                  </span>
                  {(unreadNotifications > 0 || unreadMessages > 0) && (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-600 shrink-0"
                      aria-label="Unread updates"
                    />
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200/90 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-sm font-semibold text-stone-900 truncate">{user.name}</p>
                      <p className="text-xs text-stone-500 truncate">
                        {user.phone} · Role: <strong className="text-emerald-900">{user.role}</strong>
                      </p>
                    </div>

                    <div className="py-1 border-b border-stone-100">
                      {user.role === 'BUYER' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            navigate('dashboard');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                        >
                          <span>Buyer Dashboard (/dashboard)</span>
                          <span className="text-emerald-800">Open</span>
                        </button>
                      )}

                      {user.role === 'SELLER' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            navigate('seller-dashboard');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <StoreIcon className="w-3.5 h-3.5 text-emerald-800" />
                            Seller Dashboard (/seller/dashboard)
                          </span>
                          <span className="text-emerald-800">Open</span>
                        </button>
                      )}

                      {user.role === 'RIDER' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            navigate('rider-dashboard');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Bike className="w-3.5 h-3.5 text-amber-700" />
                            Rider Dashboard (/rider/dashboard)
                          </span>
                          <span className="text-emerald-800">Open</span>
                        </button>
                      )}

                      {user.role === 'ADMIN' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            navigate('admin');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-stone-800" />
                            Admin Console (/admin)
                          </span>
                          <span className="text-emerald-800">Manage</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          openAuthModal('ROLE_SELECT_LOGIN');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-stone-600 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>Switch Account / Role Login</span>
                        <span className="text-stone-400">/login</span>
                      </button>
                    </div>

                    {/* Messages & Notifications */}
                    <div className="py-1 border-b border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          navigate('messages');
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                          Market Messages
                        </span>
                        {unreadMessages > 0 && (
                          <span className="font-mono-tabular text-xs font-semibold text-emerald-800">
                            {unreadMessages} new
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate('notifications');
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Bell className="w-3.5 h-3.5 text-stone-500" />
                          Notifications
                        </span>
                        {unreadNotifications > 0 && (
                          <span className="font-mono-tabular text-xs font-semibold text-amber-700">
                            {unreadNotifications} unread
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="px-3 pt-2 pb-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Primary CTA: My Kikapu Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsKikapuDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Kikapu</span>
              <span className="font-mono-tabular ml-0.5 text-emerald-200">
                ({kikapuItemCount})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-white/95 backdrop-blur-md border-t border-stone-200 flex items-center justify-around px-2"
      >
        <button
          type="button"
          onClick={() => navigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium whitespace-nowrap cursor-pointer ${
            route === 'home' ? 'text-emerald-900 font-semibold' : 'text-stone-500'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('explore')}
          className={`flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium whitespace-nowrap cursor-pointer ${
            route === 'explore' || route === 'stores' ? 'text-emerald-900 font-semibold' : 'text-stone-500'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span>Explore</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('live')}
          className={`flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium whitespace-nowrap cursor-pointer ${
            route === 'live' || route === 'live-session'
              ? 'text-rose-700 font-semibold'
              : 'text-stone-500'
          }`}
        >
          <Radio className="w-4 h-4 mb-0.5 text-rose-600" />
          <span>Live</span>
        </button>
        <button
          type="button"
          onClick={() => setIsKikapuDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium whitespace-nowrap cursor-pointer ${
            route === 'kikapu' ? 'text-emerald-900 font-semibold' : 'text-stone-500'
          }`}
        >
          <ShoppingBag className="w-4 h-4 mb-0.5" />
          <span>Kikapu ({kikapuItemCount})</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              openAuthModal('ROLE_SELECT_LOGIN');
              return;
            }
            if (user.role === 'SELLER') navigate('seller-dashboard');
            else if (user.role === 'RIDER') navigate('rider-dashboard');
            else if (user.role === 'ADMIN') navigate('admin');
            else navigate('dashboard');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium whitespace-nowrap cursor-pointer ${
            ['login', 'dashboard', 'seller-dashboard', 'rider-dashboard', 'admin'].includes(route)
              ? 'text-emerald-900 font-semibold'
              : 'text-stone-500'
          }`}
        >
          <UserIcon className="w-4 h-4 mb-0.5" />
          <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
        </button>
      </nav>
    </>
  );
};
