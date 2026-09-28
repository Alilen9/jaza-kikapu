import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location, Product, Store, CartItem, ParentOrder, LiveSession, AppUserRole, Rider } from '../types';
import { api } from '../services/api';

interface MarketContextType {
  locations: Location[];
  activeLocation: Location | null;
  setActiveLocation: (loc: Location) => void;
  kikapu: CartItem[];
  addToKikapu: (product: Product, quantity?: number) => void;
  removeFromKikapu: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearKikapu: () => void;
  totalKikapuItems: number;
  kikapuSubtotal: number;
  activeRole: AppUserRole;
  setActiveRole: (role: AppUserRole) => void;
  isKikapuOpen: boolean;
  setIsKikapuOpen: (open: boolean) => void;
  selectedLiveSession: LiveSession | null;
  setSelectedLiveSession: (session: LiveSession | null) => void;
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
  selectedProductForShowMe: Product | null;
  setSelectedProductForShowMe: (prod: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  activeOrder: ParentOrder | null;
  setActiveOrder: (order: ParentOrder | null) => void;
  followedStoreIds: string[];
  toggleFollowStore: (storeId: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Seller Authentication State
  currentSellerStore: Store | null;
  setCurrentSellerStore: (store: Store | null) => void;
  isSellerAuthOpen: boolean;
  setIsSellerAuthOpen: (open: boolean) => void;
  sellerAuthMode: 'login' | 'register';
  setSellerAuthMode: (mode: 'login' | 'register') => void;
  sellerLoginSuccess: (store: Store) => void;
  sellerLogout: () => void;
  // Rider Authentication State
  currentRider: Rider | null;
  setCurrentRider: (rider: Rider | null) => void;
  isRiderAuthOpen: boolean;
  setIsRiderAuthOpen: (open: boolean) => void;
  riderAuthMode: 'login' | 'register';
  setRiderAuthMode: (mode: 'login' | 'register') => void;
  riderLoginSuccess: (rider: Rider) => void;
  riderLogout: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [kikapu, setKikapu] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jaza_kikapu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeRole, setActiveRole] = useState<AppUserRole>('BUYER');
  const [isKikapuOpen, setIsKikapuOpen] = useState(false);
  const [selectedLiveSession, setSelectedLiveSession] = useState<LiveSession | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProductForShowMe, setSelectedProductForShowMe] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<ParentOrder | null>(null);
  const [followedStoreIds, setFollowedStoreIds] = useState<string[]>(['store-1']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentSellerStore, setCurrentSellerStore] = useState<Store | null>(null);
  const [isSellerAuthOpen, setIsSellerAuthOpen] = useState(false);
  const [sellerAuthMode, setSellerAuthMode] = useState<'login' | 'register'>('login');
  const [currentRider, setCurrentRider] = useState<Rider | null>(null);
  const [isRiderAuthOpen, setIsRiderAuthOpen] = useState(false);
  const [riderAuthMode, setRiderAuthMode] = useState<'login' | 'register'>('login');

  const sellerLoginSuccess = (store: Store) => {
    setCurrentSellerStore(store);
    setActiveRole('SELLER');
    setIsSellerAuthOpen(false);
    showToast(`Karibu ${store.name}! Entering your stall dashboard...`);
  };

  const sellerLogout = () => {
    setCurrentSellerStore(null);
    setActiveRole('BUYER');
    showToast('Logged out of seller stall');
  };

  const riderLoginSuccess = (rider: Rider) => {
    setCurrentRider(rider);
    setActiveRole('RIDER');
    setIsRiderAuthOpen(false);
    showToast(`Karibu Rider ${rider.name}! Entering Rider Console...`);
  };

  const riderLogout = () => {
    setCurrentRider(null);
    setActiveRole('BUYER');
    showToast('Logged out of rider fleet console');
  };

  useEffect(() => {
    api.getLocations().then(locs => {
      setLocations(locs);
      if (locs.length > 0 && !activeLocation) {
        setActiveLocation(locs[0]); // default to Voi Main Market
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('jaza_kikapu_cart', JSON.stringify(kikapu));
    } catch {
      // ignore
    }
  }, [kikapu]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToKikapu = (product: Product, quantity = 1) => {
    setKikapu(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to Kikapu!`);
  };

  const removeFromKikapu = (productId: string) => {
    setKikapu(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromKikapu(productId);
      return;
    }
    setKikapu(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearKikapu = () => {
    setKikapu([]);
  };

  const toggleFollowStore = (storeId: string) => {
    setFollowedStoreIds(prev => {
      const isFollowing = prev.includes(storeId);
      if (isFollowing) {
        showToast('Unfollowed stall updates');
        return prev.filter(id => id !== storeId);
      } else {
        showToast('Following stall! You will get live stream & stock alerts');
        return [...prev, storeId];
      }
    });
  };

  const totalKikapuItems = kikapu.reduce((acc, curr) => acc + curr.quantity, 0);
  const kikapuSubtotal = kikapu.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

  return (
    <MarketContext.Provider
      value={{
        locations,
        activeLocation,
        setActiveLocation,
        kikapu,
        addToKikapu,
        removeFromKikapu,
        updateQuantity,
        clearKikapu,
        totalKikapuItems,
        kikapuSubtotal,
        activeRole,
        setActiveRole,
        isKikapuOpen,
        setIsKikapuOpen,
        selectedLiveSession,
        setSelectedLiveSession,
        selectedStore,
        setSelectedStore,
        selectedProductForShowMe,
        setSelectedProductForShowMe,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        activeOrder,
        setActiveOrder,
        followedStoreIds,
        toggleFollowStore,
        toastMessage,
        showToast,
        currentSellerStore,
        setCurrentSellerStore,
        isSellerAuthOpen,
        setIsSellerAuthOpen,
        sellerAuthMode,
        setSellerAuthMode,
        sellerLoginSuccess,
        sellerLogout,
        currentRider,
        setCurrentRider,
        isRiderAuthOpen,
        setIsRiderAuthOpen,
        riderAuthMode,
        setRiderAuthMode,
        riderLoginSuccess,
        riderLogout,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
