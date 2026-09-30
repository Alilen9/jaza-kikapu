import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Store as StoreIcon,
  Bike,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  MapPin,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { UserRole } from '../types/marketplace';
import { ASSETS } from '../data/initialData';
import { SmartImage } from './SmartImage';

type AuthStep =
  | 'ROLE_SELECT'
  | 'BUYER_LOGIN'
  | 'BUYER_SIGNUP'
  | 'SELLER_LOGIN'
  | 'RIDER_LOGIN'
  | 'ADMIN_LOGIN'
  | 'ADMIN_NO_SIGNUP';

export const UnifiedAuthView: React.FC = () => {
  const {
    authModalTab,
    authReason,
    lastRegisteredBuyerIdentifier,
    signUpBuyer,
    loginBuyer,
    loginSeller,
    loginRider,
    loginAdmin,
    locations,
    sellers,
    stores,
    riders,
    privateAdmins,
    navigate,
    pushToast,
  } = useMarketplace();

  const [intentMode, setIntentMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [selectedRoleCard, setSelectedRoleCard] = useState<UserRole | null>(null);
  const [step, setStep] = useState<AuthStep>('ROLE_SELECT');

  // Show/hide password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Buyer Login State
  const [buyerLoginId, setBuyerLoginId] = useState('mkangomaalice@gmail.com');
  const [buyerLoginPass, setBuyerLoginPass] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Buyer Sign Up State
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('+254 7');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerTown, setBuyerTown] = useState(locations[0]?.name || 'Voi');
  const [buyerPassword, setBuyerPassword] = useState('');
  const [buyerConfirmPassword, setBuyerConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Seller Login State
  const [sellerLoginId, setSellerLoginId] = useState('Mama Asha Boutique');
  const [sellerLoginPass, setSellerLoginPass] = useState('••••••••');
  const [sellerApprovedNeedsSubscription, setSellerApprovedNeedsSubscription] = useState(false);

  // Rider Login State
  const [riderLoginId, setRiderLoginId] = useState('benson.rider@jazakikapu.co.ke');
  const [riderLoginPass, setRiderLoginPass] = useState('••••••••');

  // Admin Login State
  const [adminLoginEmail, setAdminLoginEmail] = useState(
    privateAdmins[0]?.email || 'admin@jazakikapu.co.ke'
  );
  const [adminPassword, setAdminPassword] = useState('JAZA-ADMIN-2026');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  useEffect(() => {
    setErrorMsg(null);
    setInfoMsg(null);
    setSellerApprovedNeedsSubscription(false);

    if (authModalTab === 'ROLE_SELECT_SIGNUP') {
      setIntentMode('SIGNUP');
      setStep('ROLE_SELECT');
      setSelectedRoleCard(null);
    } else if (authModalTab === 'ROLE_SELECT_LOGIN') {
      setIntentMode('LOGIN');
      setStep('ROLE_SELECT');
      setSelectedRoleCard(null);
    } else if (authModalTab === 'BUYER_SIGNUP') {
      setIntentMode('SIGNUP');
      setSelectedRoleCard('BUYER');
      setStep('BUYER_SIGNUP');
    } else if (authModalTab === 'BUYER_LOGIN') {
      setIntentMode('LOGIN');
      setSelectedRoleCard('BUYER');
      setStep('BUYER_LOGIN');
    } else if (authModalTab === 'SELLER_LOGIN') {
      setIntentMode('LOGIN');
      setSelectedRoleCard('SELLER');
      setStep('SELLER_LOGIN');
    } else if (authModalTab === 'RIDER_LOGIN') {
      setIntentMode('LOGIN');
      setSelectedRoleCard('RIDER');
      setStep('RIDER_LOGIN');
    } else if (authModalTab === 'ADMIN_LOGIN') {
      setIntentMode('LOGIN');
      setSelectedRoleCard('ADMIN');
      setStep('ADMIN_LOGIN');
    }
  }, [authModalTab]);

  useEffect(() => {
    if (lastRegisteredBuyerIdentifier) {
      setBuyerLoginId(lastRegisteredBuyerIdentifier);
    }
  }, [lastRegisteredBuyerIdentifier]);

  const handleSelectRoleCard = (role: UserRole) => {
    setErrorMsg(null);
    setInfoMsg(null);
    setSellerApprovedNeedsSubscription(false);
    setSelectedRoleCard(role);

    if (intentMode === 'SIGNUP') {
      if (role === 'BUYER') {
        setStep('BUYER_SIGNUP');
      } else if (role === 'SELLER') {
        navigate('seller-onboarding');
      } else if (role === 'RIDER') {
        navigate('rider-onboarding');
      } else if (role === 'ADMIN') {
        setStep('ADMIN_NO_SIGNUP');
      }
    } else {
      if (role === 'BUYER') setStep('BUYER_LOGIN');
      else if (role === 'SELLER') setStep('SELLER_LOGIN');
      else if (role === 'RIDER') setStep('RIDER_LOGIN');
      else if (role === 'ADMIN') setStep('ADMIN_LOGIN');
    }
  };

  const handleReturnToRoleSelect = () => {
    setErrorMsg(null);
    setInfoMsg(null);
    setSellerApprovedNeedsSubscription(false);
    setStep('ROLE_SELECT');
  };

  const handleForgotPassword = (roleLabel: string, identifier: string) => {
    const target = identifier.trim() || 'your registered phone/email';
    setInfoMsg(
      `Password reset instructions and an M-Pesa/SMS verification code have been sent to ${target} (${roleLabel} account).`
    );
    pushToast(
      'Password Recovery Sent',
      `Verification code sent to ${target}.`,
      'info'
    );
  };

  const handleBuyerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginBuyer(buyerLoginId, buyerLoginPass);
    if (!res.ok && res.error) setErrorMsg(res.error);
  };

  const handleBuyerSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!buyerName.trim() || !buyerPhone.trim() || !buyerEmail.trim()) {
      setErrorMsg('Please fill in your full name, phone number, and email address.');
      return;
    }
    if (buyerPassword.length < 4) {
      setErrorMsg('Please choose a password with at least 4 characters.');
      return;
    }
    if (buyerPassword !== buyerConfirmPassword) {
      setErrorMsg('Passwords do not match. Please confirm your password.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please agree to the Jaza Kikapu Terms and Privacy Policy to create an account.');
      return;
    }

    signUpBuyer({
      name: buyerName,
      phone: buyerPhone,
      email: buyerEmail,
      town: buyerTown,
      landmark: `${buyerTown} Town Market Stage`,
      password: buyerPassword,
    });
    setStep('BUYER_LOGIN');
  };

  const handleSellerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSellerApprovedNeedsSubscription(false);
    const res = loginSeller(sellerLoginId, sellerLoginPass);
    if (!res.ok && res.error) {
      setErrorMsg(res.error);
      return;
    }
    if (res.ok && res.requiresSubscription) {
      setSellerApprovedNeedsSubscription(true);
    }
  };

  const handleRiderLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginRider(riderLoginId, riderLoginPass);
    if (!res.ok && res.error) setErrorMsg(res.error);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginAdmin(adminLoginEmail, adminPassword);
    if (!res.ok && res.error) setErrorMsg(res.error);
  };

  const roleCards: {
    role: UserRole;
    emoji: string;
    title: string;
    subtitle: string;
    description: string;
    signupActionLabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      role: 'BUYER',
      emoji: '🛒',
      title: 'BUYER',
      subtitle: 'Shop from local businesses.',
      description: 'Shop products, fill your Kikapu, follow stores and place orders.',
      signupActionLabel: 'Create buyer account →',
      icon: <ShoppingBag className="w-5 h-5 text-emerald-900" />,
    },
    {
      role: 'SELLER',
      emoji: '🏪',
      title: 'SELLER',
      subtitle: 'Run your digital store.',
      description: 'Manage your digital store, products, orders, posts and live selling.',
      signupActionLabel: 'Seller application →',
      icon: <StoreIcon className="w-5 h-5 text-amber-800" />,
    },
    {
      role: 'RIDER',
      emoji: '🚚',
      title: 'RIDER',
      subtitle: 'Deliver orders and earn.',
      description: 'Accept deliveries and manage delivery earnings.',
      signupActionLabel: 'Rider application →',
      icon: <Bike className="w-5 h-5 text-emerald-800" />,
    },
    {
      role: 'ADMIN',
      emoji: '🛡️',
      title: 'ADMIN',
      subtitle: 'Manage the marketplace.',
      description: 'Manage and control the Jaza Kikapu marketplace.',
      signupActionLabel: 'No public signup',
      icon: <ShieldCheck className="w-5 h-5 text-stone-800" />,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF9F5] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm">
        {/* Left Column: Desktop Kenyan Local Marketplace Showcase */}
        <div className="lg:col-span-5 relative bg-stone-900 text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <SmartImage
              src={ASSETS.heroMarketImg}
              alt="Jaza Kikapu Taita-Taveta Marketplace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-900/60" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>Voi · Wundanyi · Mwatate · Taveta</span>
            </div>

            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                JAZA KIKAPU
              </h1>
              <p className="text-base sm:text-lg font-medium text-amber-300 mt-1">
                Your market. Your sellers. Your basket.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Experience the digital version of our local Taita-Taveta markets. Browse stalls freely
              without an account, combine items from multiple sellers into one Kikapu, and get
              same-day Jaza Rider delivery.
            </p>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-stone-800 space-y-4 text-xs">
            <div className="space-y-2">
              <div className="font-semibold text-amber-400">How Role Access Works</div>
              <p className="text-stone-300">
                <strong className="text-white">Buyer:</strong> Browse → Product → Add to Kikapu /
                Buy Now → Sign Up or Sign In → Checkout → Order
              </p>
              <p className="text-stone-300">
                <strong className="text-white">Seller:</strong> Apply → Admin Review → Approved →
                Seller Login → Store Subscription → Pay → Store ACTIVE
              </p>
              <p className="text-stone-300">
                <strong className="text-white">Rider:</strong> Apply → Admin Review → Approved →
                Rider Login → Dispatch Dashboard
              </p>
              <p className="text-stone-300">
                <strong className="text-white">Admin:</strong> Privately provisioned governance
                accounts only (no public signup).
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-stone-400">
              <span>{stores.filter((s) => s.status === 'ACTIVE').length} Active Stalls</span>
              <span>·</span>
              <span>M-Pesa Daraja Verified</span>
              <span>·</span>
              <button
                type="button"
                onClick={() => navigate('explore')}
                className="text-amber-300 hover:underline font-semibold cursor-pointer"
              >
                Continue Browsing →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Unified Role Selection & Authentication Forms */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          {/* Top Branding & Intent Toggle */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <div className="text-xs font-semibold text-emerald-900">
                  JAZA KIKAPU · Unified Account Portal
                </div>
                <h2 className="font-display text-2xl font-bold text-stone-900 mt-0.5">
                  {step === 'ROLE_SELECT'
                    ? 'Choose how you use Jaza Kikapu'
                    : step === 'BUYER_LOGIN'
                    ? 'Buyer Login'
                    : step === 'BUYER_SIGNUP'
                    ? 'Create a Buyer Account'
                    : step === 'SELLER_LOGIN'
                    ? 'Seller Login'
                    : step === 'RIDER_LOGIN'
                    ? 'Rider Login'
                    : step === 'ADMIN_LOGIN'
                    ? 'Admin Login'
                    : 'Private Admin Access'}
                </h2>
              </div>

              {/* Login vs Sign Up Mode Switcher */}
              {step === 'ROLE_SELECT' && (
                <div className="inline-flex p-1 rounded-lg bg-stone-100 border border-stone-200 self-start">
                  <button
                    type="button"
                    onClick={() => setIntentMode('LOGIN')}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      intentMode === 'LOGIN'
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    LOGIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntentMode('SIGNUP')}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      intentMode === 'SIGNUP'
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    SIGN UP
                  </button>
                </div>
              )}
            </div>

            {/* Back to Role Selection Button */}
            {step !== 'ROLE_SELECT' && (
              <button
                type="button"
                onClick={handleReturnToRoleSelect}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:text-emerald-700 cursor-pointer py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Change account type</span>
              </button>
            )}

            {/* Contextual Reason Banner (e.g. when redirected from Add to Kikapu / Buy Now / Protected Route) */}
            {authReason && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-800/30 flex items-start gap-2.5 text-xs text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold">{authReason}</p>
                  <p className="text-[11px] text-emerald-800">
                    Browse → Product → Add to Kikapu / Buy Now → Sign Up or Sign In → Checkout →
                    Payment → Order
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-2.5 text-xs text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {infoMsg && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5 text-xs text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>{infoMsg}</span>
              </div>
            )}

            {/* STEP 1: FOUR LARGE CLICKABLE ROLE-SELECTION CARDS (NO DROPDOWN) */}
            {step === 'ROLE_SELECT' && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-stone-600">
                  {intentMode === 'LOGIN'
                    ? 'Select your account type below to sign in to Jaza Kikapu:'
                    : 'Select how you want to join Jaza Kikapu (Buyers register directly; Sellers & Riders apply for approval):'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {roleCards.map((card) => {
                    const isSelected = selectedRoleCard === card.role;
                    return (
                      <button
                        key={card.role}
                        type="button"
                        onClick={() => handleSelectRoleCard(card.role)}
                        className={`group text-left p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[148px] focus-visible:outline-2 focus-visible:outline-emerald-800 ${
                          isSelected
                            ? 'border-emerald-900 bg-emerald-50/60 shadow-xs'
                            : 'border-stone-200 hover:border-emerald-800 hover:bg-stone-50/80'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-2 font-display text-base font-bold text-stone-900">
                              <span aria-hidden="true">{card.emoji}</span>
                              <span>{card.title}</span>
                            </span>
                            <div className="p-2 rounded-lg bg-[#FAF9F5] border border-stone-200/80 group-hover:border-emerald-800/30">
                              {card.icon}
                            </div>
                          </div>
                          <p className="text-xs font-semibold text-stone-800">{card.subtitle}</p>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {card.description}
                          </p>
                        </div>

                        <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-900">
                          <span>
                            {intentMode === 'LOGIN'
                              ? `Continue to ${card.title} Login`
                              : card.signupActionLabel}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2A: BUYER LOGIN */}
            {step === 'BUYER_LOGIN' && (
              <div className="space-y-5">
                {lastRegisteredBuyerIdentifier && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-800/30 space-y-2 text-xs text-emerald-950">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                      <span>Buyer account created → Sign in / continue to checkout</span>
                    </div>
                    <p className="text-emerald-900">
                      Your Buyer account (<strong className="font-mono-tabular">{lastRegisteredBuyerIdentifier}</strong>) is ready with <code>role = BUYER</code>.
                    </p>
                    <button
                      type="button"
                      onClick={() => loginBuyer(lastRegisteredBuyerIdentifier)}
                      className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Continue to Checkout / Sign In Now →
                    </button>
                  </div>
                )}

                <form onSubmit={handleBuyerLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone number or email
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerLoginId}
                      onChange={(e) => setBuyerLoginId(e.target.value)}
                      placeholder="+254 711 222 333 or mkangomaalice@gmail.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={buyerLoginPass}
                        onChange={(e) => setBuyerLoginPass(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-3.5 py-2.5 pr-20 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        {showPassword ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Show</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="inline-flex items-center gap-2 text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-emerald-900 rounded"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleForgotPassword('Buyer', buyerLoginId)}
                      className="font-semibold text-emerald-900 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    SIGN IN
                  </button>
                </form>

                <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                  <span className="text-stone-600">Don't have a buyer account?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setStep('BUYER_SIGNUP');
                    }}
                    className="font-bold text-emerald-900 hover:underline cursor-pointer"
                  >
                    Create an account →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2B: BUYER SIGN UP */}
            {step === 'BUYER_SIGNUP' && (
              <div className="space-y-5">
                <form onSubmit={handleBuyerSignUpSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Full name
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="e.g., Grace Mwakio"
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="+254 712 345 678"
                        className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Email address
                      </label>
                      <input
                        type="email"
                        required
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Default Town
                      </label>
                      <select
                        value={buyerTown}
                        onChange={(e) => setBuyerTown(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                      >
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.name}>
                            {loc.name} ({loc.county})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={buyerPassword}
                          onChange={(e) => setBuyerPassword(e.target.value)}
                          placeholder="Create password"
                          className="w-full px-3.5 py-2.5 pr-16 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-600 cursor-pointer"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={buyerConfirmPassword}
                          onChange={(e) => setBuyerConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="w-full px-3.5 py-2.5 pr-16 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-600 cursor-pointer"
                        >
                          {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="accent-emerald-900 mt-0.5 rounded"
                    />
                    <span>
                      I agree to the <strong>Jaza Kikapu Terms of Service</strong> and{' '}
                      <strong>Privacy Policy</strong>. Account role assigned: <code>BUYER</code>.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    CREATE ACCOUNT
                  </button>
                </form>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-600">Already have a buyer account?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setStep('BUYER_LOGIN');
                    }}
                    className="font-bold text-emerald-900 hover:underline cursor-pointer"
                  >
                    Sign in to Buyer account →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2C: SELLER LOGIN */}
            {step === 'SELLER_LOGIN' && (
              <div className="space-y-5">
                {sellerApprovedNeedsSubscription ? (
                  <div className="p-5 rounded-xl bg-amber-50 border border-amber-300 space-y-4">
                    <div className="flex items-start gap-3">
                      <StoreIcon className="w-5 h-5 text-amber-900 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-stone-900">
                          Your seller account has been approved. Activate a store subscription to
                          start selling.
                        </h3>
                        <p className="text-xs text-stone-700">
                          Admin approval is complete. Choose an Hourly, Weekly, Monthly, or Yearly
                          store subscription plan and complete M-Pesa payment to set your store
                          status to <code>ACTIVE</code>.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('seller-dashboard')}
                      className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer"
                    >
                      ACTIVATE STORE
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200 text-xs space-y-1.5">
                      <div className="font-semibold text-stone-900">
                        Quick Demo Seller Accounts (Test All Seller Statuses):
                      </div>
                      <select
                        value={sellerLoginId}
                        onChange={(e) => {
                          setErrorMsg(null);
                          setSellerLoginId(e.target.value);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                      >
                        {sellers.map((s) => {
                          const st = stores.find((store) => store.id === s.storeId);
                          return (
                            <option key={s.id} value={s.businessName}>
                              {s.businessName} ({s.personalName}) — Seller: {s.status} · Store:{' '}
                              {st?.status || 'INACTIVE'}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <form onSubmit={handleSellerLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Phone/email or Business Name
                        </label>
                        <input
                          type="text"
                          required
                          value={sellerLoginId}
                          onChange={(e) => setSellerLoginId(e.target.value)}
                          placeholder="+254 712 345 678 or Mama Asha Boutique"
                          className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={sellerLoginPass}
                            onChange={(e) => setSellerLoginPass(e.target.value)}
                            placeholder="Enter seller password"
                            className="w-full px-3.5 py-2.5 pr-20 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-stone-600 cursor-pointer"
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end text-xs">
                        <button
                          type="button"
                          onClick={() => handleForgotPassword('Seller', sellerLoginId)}
                          className="font-semibold text-emerald-900 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition-colors"
                      >
                        SELLER SIGN IN
                      </button>
                    </form>
                  </>
                )}

                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <p className="text-xs text-stone-600">
                    Don't have an approved seller account?
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('seller-onboarding')}
                    className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    APPLY TO BECOME A SELLER
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2D: RIDER LOGIN */}
            {step === 'RIDER_LOGIN' && (
              <div className="space-y-5">
                <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200 text-xs space-y-1.5">
                  <div className="font-semibold text-stone-900">
                    Quick Demo Rider Accounts (Test Approved vs Pending Rider):
                  </div>
                  <select
                    value={riderLoginId}
                    onChange={(e) => {
                      setErrorMsg(null);
                      setRiderLoginId(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                  >
                    {riders.map((r) => (
                      <option key={r.id} value={r.email || r.phone}>
                        {r.name} ({r.plateNumber} · {r.locationName}) — Status:{' '}
                        {r.approvalStatus || 'APPROVED'}
                      </option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleRiderLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone/email
                    </label>
                    <input
                      type="text"
                      required
                      value={riderLoginId}
                      onChange={(e) => setRiderLoginId(e.target.value)}
                      placeholder="+254 715 900 111 or benson.rider@jazakikapu.co.ke"
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={riderLoginPass}
                        onChange={(e) => setRiderLoginPass(e.target.value)}
                        placeholder="Enter rider password"
                        className="w-full px-3.5 py-2.5 pr-20 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-stone-600 cursor-pointer"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end text-xs">
                    <button
                      type="button"
                      onClick={() => handleForgotPassword('Rider', riderLoginId)}
                      className="font-semibold text-emerald-900 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    RIDER SIGN IN
                  </button>
                </form>

                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <p className="text-xs text-stone-600">Not registered as a rider?</p>
                  <button
                    type="button"
                    onClick={() => navigate('rider-onboarding')}
                    className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    APPLY TO BECOME A RIDER
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2E: ADMIN LOGIN */}
            {step === 'ADMIN_LOGIN' && (
              <div className="space-y-5">
                <div className="p-3.5 rounded-xl bg-stone-900 text-stone-200 text-xs space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Private Marketplace Administration — No Public Signup</span>
                  </div>
                  <p className="text-stone-300">
                    Admin accounts are privately created and managed. Successful sign-in redirects
                    to <code>/admin</code>.
                  </p>
                </div>

                <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email/username
                    </label>
                    <select
                      value={adminLoginEmail}
                      onChange={(e) => setAdminLoginEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-300 rounded-lg mb-2"
                    >
                      {privateAdmins.map((adm) => (
                        <option key={adm.id} value={adm.email}>
                          {adm.name} ({adm.email})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      value={adminLoginEmail}
                      onChange={(e) => setAdminLoginEmail(e.target.value)}
                      placeholder="admin@jazakikapu.co.ke"
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter private admin password"
                        className="w-full px-3.5 py-2.5 pr-20 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-stone-600 cursor-pointer"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end text-xs">
                    <button
                      type="button"
                      onClick={() => handleForgotPassword('Admin', adminLoginEmail)}
                      className="font-semibold text-stone-700 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    ADMIN SIGN IN
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2F: ADMIN NO PUBLIC SIGNUP NOTICE */}
            {step === 'ADMIN_NO_SIGNUP' && (
              <div className="p-6 rounded-2xl bg-stone-900 text-white space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>No Public Admin Signup</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Admin accounts cannot be registered publicly. They are privately created and
                  managed by Jaza Kikapu Marketplace HQ. If you already hold private Admin
                  credentials, proceed to Admin Login.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('ADMIN_LOGIN')}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Go to Admin Login →
                  </button>
                  <button
                    type="button"
                    onClick={handleReturnToRoleSelect}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    ← Choose Another Account Type
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Security & Role Footnote */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500">
            <span>Unified Jaza Kikapu Role-Based Authentication</span>
            <span>Protected Routes · M-Pesa Checkout Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuthModal: React.FC = () => null;
