import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { api } from '../services/api';
import { Store, UserPlus, LogIn, X, Phone, Lock, Store as StoreIcon, MapPin, Tag, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2, ArrowLeft, Zap, Check, Loader2 } from 'lucide-react';

interface SellerAuthModalProps {
  onSuccessRedirectToDashboard: () => void;
}

export const SellerAuthModal: React.FC<SellerAuthModalProps> = ({ onSuccessRedirectToDashboard }) => {
  const {
    isSellerAuthOpen,
    setIsSellerAuthOpen,
    sellerAuthMode,
    setSellerAuthMode,
    locations,
    sellerLoginSuccess,
    showToast,
  } = useMarket();

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register Form
  const [registerStep, setRegisterStep] = useState<'details' | 'subscribe'>('details');
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerCategory, setRegisterCategory] = useState('Fashion & Apparel');
  const [registerLocationId, setRegisterLocationId] = useState(locations[0]?.id || 'loc-1');
  const [stallNumber, setStallNumber] = useState('');
  const [description, setDescription] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Subscription state
  const [selectedPlanId, setSelectedPlanId] = useState<'plan-weekly' | 'plan-monthly' | 'plan-yearly'>('plan-monthly');
  const [mpesaPaymentPhone, setMpesaPaymentPhone] = useState('');

  const plans = [
    {
      id: 'plan-weekly',
      name: 'Weekly Stall Booster',
      cadence: 'WEEKLY',
      periodLabel: 'per week',
      price: 650,
      description: 'Ideal for pop-ups, market-day traders & short trial runs in Voi.',
      features: ['7 days active stall', 'Up to 40 items', 'Live stream broadcasts', 'Boda Boda dispatch'],
    },
    {
      id: 'plan-monthly',
      name: 'Digital Stall Premium (Monthly)',
      cadence: 'MONTHLY',
      periodLabel: 'per month',
      price: 2200,
      badge: 'Most Popular in Voi',
      description: 'Full monthly operation with boosted search placement & direct M-Pesa payouts.',
      features: ['30 days uninterrupted access', 'Up to 150 items', 'Unlimited live streams & chat', 'Priority rider dispatch'],
    },
    {
      id: 'plan-yearly',
      name: 'Annual Merchant Enterprise (Yearly)',
      cadence: 'YEARLY',
      periodLabel: 'per year',
      price: 20000,
      badge: 'Save KES 6,400 · 2 Mos Free',
      description: 'Top placement for main market wholesalers & established stores.',
      features: ['365 days full access', 'Up to 500 items', 'Verified Gold Stall badge', 'Top placement on Voi marketplace'],
    },
  ];

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[1];

  if (!isSellerAuthOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      showToast('Please enter your phone number / stall name and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.sellerLogin({
        identifier: loginIdentifier,
        password: loginPassword,
      });

      sellerLoginSuccess(res.store);
      onSuccessRedirectToDashboard();
    } catch (err: any) {
      showToast(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !registerPhone.trim() || !registerPassword.trim()) {
      showToast('Please provide your business name, phone number, and password');
      return;
    }
    if (!mpesaPaymentPhone) {
      setMpesaPaymentPhone(registerPhone);
    }
    setRegisterStep('subscribe');
  };

  const handleRegisterAndSubscribe = async () => {
    if (!mpesaPaymentPhone.trim()) {
      showToast('Please enter your Safaricom M-Pesa phone number for payment');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.sellerRegister({
        businessName,
        ownerName,
        phone: registerPhone,
        email: registerEmail,
        category: registerCategory,
        locationId: registerLocationId,
        stallNumber,
        description,
        password: registerPassword,
        planId: selectedPlanId,
      });

      // Complete payment record on server
      await api.purchaseSubscription(res.store.id, selectedPlanId, mpesaPaymentPhone);

      const activatedStore: Store = {
        ...res.store,
        subscriptionPlanId: selectedPlanId,
        subscriptionStatus: 'ACTIVE',
        subscriptionCadence: currentPlan.cadence as any,
        status: 'ACTIVE',
        isOpen: true,
      };

      sellerLoginSuccess(activatedStore);
      onSuccessRedirectToDashboard();
    } catch (err: any) {
      showToast(err.message || 'Registration and subscription failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 my-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-[#F4A261] flex items-center justify-center font-bold text-lg shadow-sm">
              <StoreIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-stone-900 leading-tight">
                Seller & Merchant Portal
              </h3>
              <p className="text-xs text-stone-500">
                Manage your digital stall in Voi & Taita-Taveta markets
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSellerAuthOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Login vs Sign Up) */}
        <div className="flex items-center p-1 bg-stone-100 rounded-2xl my-4">
          <button
            type="button"
            onClick={() => setSellerAuthMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              sellerAuthMode === 'login'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Seller Log In</span>
          </button>

          <button
            type="button"
            onClick={() => setSellerAuthMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              sellerAuthMode === 'register'
                ? 'bg-white text-[#1B4332] shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Open Digital Stall (Register)</span>
          </button>
        </div>

        {/* MODE 1: LOGIN */}
        {sellerAuthMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Phone Number, Stall Name, or Email</span>
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. 0712345001 or Mama Asha"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#1B4332]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#1B4332]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md active:scale-98 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Logging into Stall...' : 'Log In to Seller Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-3 border-t border-stone-100 text-center">
              <span className="text-xs text-stone-500">Don't have a digital stall yet? </span>
              <button
                type="button"
                onClick={() => setSellerAuthMode('register')}
                className="text-xs font-bold text-[#D95D39] hover:underline cursor-pointer ml-1"
              >
                Register Your Stall Now
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: REGISTER (OPEN A DIGITAL STALL) */}
        {sellerAuthMode === 'register' && (
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {registerStep === 'details' ? (
              <form onSubmit={handleProceedToSubscription} className="space-y-3.5 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 1 of 2:</strong> Fill in your stall details below, then choose a weekly, monthly, or yearly plan to activate your digital store.
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Business / Stall Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Mama Wanja Fresh Spices & Honey"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Owner Full Name
                    </label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Wanja Mkabili"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-700" />
                      <span>M-Pesa Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      placeholder="0712345678"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D95D39]" />
                      <span>Market Location in Taita-Taveta</span>
                    </label>
                    <select
                      value={registerLocationId}
                      onChange={(e) => setRegisterLocationId(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                    >
                      {locations.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.marketName} ({l.subCounty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Physical Stall / Shed Number
                    </label>
                    <input
                      type="text"
                      value={stallNumber}
                      onChange={(e) => setStallNumber(e.target.value)}
                      placeholder="e.g. Stall C-12, Shed 4"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-stone-400" />
                      <span>Primary Category</span>
                    </label>
                    <select
                      value={registerCategory}
                      onChange={(e) => setRegisterCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                    >
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Fresh Produce">Fresh Produce & Fruits</option>
                      <option value="Electronics & Phones">Electronics & Phones</option>
                      <option value="Hardware & Tools">Hardware & Tools</option>
                      <option value="Local Crafts & Living">Local Crafts & Sisal</option>
                      <option value="General Supermarket">Groceries & Supermarket</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-stone-400" />
                      <span>Password *</span>
                    </label>
                    <input
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Stall Description / Specialties
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What products do you specialize in selling in Voi?"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md active:scale-98 mt-2"
                >
                  <span>Continue to Step 2: Choose Subscription Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-stone-900">
                      Step 2: Choose Subscription Plan for "{businessName}"
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Subscribe to unlock store access, catalog listings & live streaming
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegisterStep('details')}
                    disabled={isSubmitting}
                    className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back</span>
                  </button>
                </div>

                {/* Plans Selection */}
                <div className="space-y-2.5">
                  {plans.map(p => {
                    const isSelected = selectedPlanId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlanId(p.id as any)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#1B4332] bg-emerald-50/60 ring-2 ring-[#1B4332]'
                            : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900">{p.name}</span>
                            {p.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-[#D95D39] text-white text-[9px] font-bold">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-600 mt-0.5">{p.description}</p>
                        </div>

                        <div className="text-right shrink-0 ml-3">
                          <div className="font-mono font-bold text-sm text-stone-900">
                            KES {p.price.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-stone-400">{p.periodLabel}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* M-Pesa Phone */}
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800">M-Pesa STK Push Payment</span>
                    <span className="font-mono font-bold text-emerald-800">KES {currentPlan.price.toLocaleString()}</span>
                  </div>
                  <input
                    type="tel"
                    value={mpesaPaymentPhone}
                    onChange={(e) => setMpesaPaymentPhone(e.target.value)}
                    placeholder="0712345678"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono text-xs focus:outline-none focus:border-[#1B4332]"
                  />
                  <p className="text-[10px] text-stone-500">
                    Payment prompt will be sent to this number to activate your stall.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRegisterAndSubscribe}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#D95D39] hover:bg-[#C24E2C] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Activating Stall Subscription...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>Pay KES {currentPlan.price.toLocaleString()} & Access Store Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
