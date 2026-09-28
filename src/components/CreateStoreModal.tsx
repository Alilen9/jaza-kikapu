import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { api } from '../services/api';
import { Store, SubscriptionPlan } from '../types';
import {
  Store as StoreIcon,
  X,
  Phone,
  Lock,
  Tag,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Calendar,
  Check,
  Zap,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (store: Store) => void;
}

export const CreateStoreModal: React.FC<CreateStoreModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { locations, showToast, sellerLoginSuccess } = useMarket();

  // Step state: 'details' -> 'subscribe' -> 'activating'
  const [step, setStep] = useState<'details' | 'subscribe' | 'activating'>('details');

  // Form Details
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [locationId, setLocationId] = useState(locations[0]?.id || 'loc-1');
  const [stallNumber, setStallNumber] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');

  // Selected Subscription Plan (Default: Monthly)
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-monthly');
  const [mpesaPaymentPhone, setMpesaPaymentPhone] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'plan-weekly',
      name: 'Weekly Stall Booster',
      cadence: 'WEEKLY',
      periodLabel: 'per week',
      price: 650,
      badge: null,
      description: 'Ideal for pop-up traders, market-day sales, and short trial runs in Voi.',
      features: [
        '7 days active digital stall',
        'Up to 40 catalog items',
        'Live stream broadcasts enabled',
        'Consolidated Boda Boda dispatch',
      ],
    },
    {
      id: 'plan-monthly',
      name: 'Digital Stall Premium (Monthly)',
      cadence: 'MONTHLY',
      periodLabel: 'per month',
      price: 2200,
      badge: 'Most Popular in Voi',
      description: 'Full monthly operation with boosted search placement and instant M-Pesa payouts.',
      features: [
        '30 days uninterrupted stall access',
        'Up to 150 catalog items',
        'Unlimited live streaming & buyer chat',
        'Customer "Show Me" photo requests',
        'Priority rider dispatch in Voi',
      ],
    },
    {
      id: 'plan-yearly',
      name: 'Annual Merchant Enterprise (Yearly)',
      cadence: 'YEARLY',
      periodLabel: 'per year',
      price: 20000,
      badge: 'Save KES 6,400 · 2 Months Free',
      description: 'The ultimate plan for established Taita-Taveta wholesalers and main market stores.',
      features: [
        '365 days full stall access',
        'Up to 500 catalog items',
        'Verified Gold Stall badge',
        'Top placement in Voi marketplace',
        'Zero listing commission on group buys',
      ],
    },
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[1];

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim() || !password.trim()) {
      showToast('Please enter your Business Name, Phone Number, and Password');
      return;
    }
    // Set default payment phone to store phone if not already set
    if (!mpesaPaymentPhone) {
      setMpesaPaymentPhone(phone);
    }
    setStep('subscribe');
  };

  const handleSubscribeAndActivate = async () => {
    if (!mpesaPaymentPhone.trim()) {
      showToast('Please enter your Safaricom M-Pesa phone number for payment');
      return;
    }

    setIsProcessingPayment(true);
    setStep('activating');

    try {
      // Register store on the backend with chosen subscription plan
      const res = await api.sellerRegister({
        businessName,
        ownerName,
        phone,
        email,
        category,
        locationId,
        stallNumber,
        description,
        password,
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

      showToast(`Subscription successful! ${currentPlan.name} is now ACTIVE.`);
      sellerLoginSuccess(activatedStore);
      onSuccess(activatedStore);
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Subscription failed. Please check M-Pesa phone number.');
      setStep('subscribe');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 my-auto flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-[#F4A261] flex items-center justify-center font-bold text-lg shadow-sm">
              <StoreIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-stone-900 leading-tight">
                Create a Digital Store
              </h3>
              <p className="text-xs text-stone-500">
                Step {step === 'details' ? '1 of 2: Store Information' : '2 of 2: Stall Subscription & Activation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2 py-3 px-1 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 'details'
                  ? 'bg-[#1B4332] text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {step !== 'details' ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <span
              className={`text-xs font-semibold ${
                step === 'details' ? 'text-stone-900' : 'text-emerald-700'
              }`}
            >
              Store Details
            </span>
          </div>

          <div className="w-8 h-0.5 bg-stone-200"></div>

          <div className="flex items-center gap-2 flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 'subscribe' || step === 'activating'
                  ? 'bg-[#1B4332] text-white'
                  : 'bg-stone-200 text-stone-600'
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-semibold ${
                step === 'subscribe' || step === 'activating'
                  ? 'text-stone-900'
                  : 'text-stone-400'
              }`}
            >
              Subscribe (Weekly / Monthly / Yearly)
            </span>
          </div>
        </div>

        {/* STEP 1: STORE FORM DETAILS */}
        {step === 'details' && (
          <form
            onSubmit={handleDetailsSubmit}
            className="space-y-3.5 text-xs overflow-y-auto py-4 pr-1 flex-1"
          >
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Business / Stall Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Voi Spices & Taveta Fruits"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] text-xs"
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
                  placeholder="e.g. Asha Mwavita"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>M-Pesa Phone Number *</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Market Location in Taita-Taveta</span>
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] text-xs"
                >
                  {locations.map((l) => (
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
                  placeholder="e.g. Stall B-12, Shed 3"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] text-xs"
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
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Password *</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create store password"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] text-xs"
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
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md active:scale-98"
              >
                <span>Continue to Subscription Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CHOOSE SUBSCRIPTION (WEEKLY, MONTHLY, YEARLY) & PAY */}
        {(step === 'subscribe' || step === 'activating') && (
          <div className="space-y-4 overflow-y-auto py-4 pr-1 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-base text-stone-900">
                  Select Subscription Plan for "{businessName}"
                </h4>
                <p className="text-xs text-stone-500">
                  Subscribe to unlock store access, catalog listings, and live broadcasting
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep('details')}
                disabled={step === 'activating'}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            </div>

            {/* Plan Cards Grid: Weekly, Monthly, Yearly */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      if (step !== 'activating') setSelectedPlanId(plan.id);
                    }}
                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#1B4332] bg-emerald-50/50 shadow-md ring-2 ring-[#1B4332]'
                        : 'border-stone-200 hover:border-stone-400 bg-white'
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#D95D39] text-white text-[10px] font-bold shadow-xs">
                        {plan.badge}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-stone-900">{plan.name}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      <div className="mt-2 mb-2">
                        <span className="font-mono text-xl font-bold text-stone-900">
                          KES {plan.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-stone-500 ml-1">/{plan.periodLabel}</span>
                      </div>

                      <p className="text-[11px] text-stone-600 mb-3">{plan.description}</p>

                      <ul className="space-y-1.5 border-t border-stone-200/60 pt-2.5">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[10px] text-stone-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-2">
                      <div
                        className={`w-full py-1.5 text-center text-xs font-semibold rounded-lg ${
                          isSelected
                            ? 'bg-[#1B4332] text-white'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {isSelected ? 'Selected Plan' : 'Select'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* M-Pesa Payment Box */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-stone-900">
                      M-Pesa STK Push Payment
                    </h5>
                    <p className="text-[10px] text-stone-500">
                      Prompt will be sent immediately to complete stall subscription
                    </p>
                  </div>
                </div>

                <div className="font-mono text-sm font-bold text-emerald-800">
                  KES {currentPlan.price.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  M-Pesa Mobile Number
                </label>
                <input
                  type="tel"
                  value={mpesaPaymentPhone}
                  onChange={(e) => setMpesaPaymentPhone(e.target.value)}
                  placeholder="0712345678"
                  disabled={step === 'activating'}
                  className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:border-[#1B4332]"
                />
              </div>

              <div className="text-[11px] text-stone-500 bg-white p-2.5 rounded-xl border border-stone-200/80">
                🔒 Once approved, <strong>{businessName}</strong> will immediately activate with {currentPlan.name}. You can manage products, start live streaming, and receive customer orders instantly.
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleSubscribeAndActivate}
              disabled={step === 'activating'}
              className="w-full py-3.5 px-4 rounded-xl bg-[#D95D39] hover:bg-[#C24E2C] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md active:scale-98 disabled:opacity-50"
            >
              {step === 'activating' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming M-Pesa & Activating Store...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>
                    Pay KES {currentPlan.price.toLocaleString()} & Access Store Dashboard
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
