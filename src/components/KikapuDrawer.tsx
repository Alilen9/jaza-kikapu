import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Bookmark,
  CheckCircle2,
  Smartphone,
  Truck,
  ArrowRight,
  Store as StoreIcon,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { PaymentMethod } from '../types/marketplace';
import { SmartImage } from './SmartImage';

export const KikapuDrawer: React.FC = () => {
  const {
    isKikapuDrawerOpen,
    setIsKikapuDrawerOpen,
    basket,
    savedForLater,
    groupedKikapuByStore,
    updateKikapuQuantity,
    removeFromKikapu,
    saveItemForLater,
    moveSavedToKikapu,
    clearKikapu,
    kikapuSubtotal,
    kikapuDeliveryFee,
    kikapuTotal,
    checkoutKikapu,
    locations,
    user,
    isAuthenticated,
    openAuthModal,
    navigate,
  } = useMarketplace();

  const [step, setStep] = useState<'BASKET' | 'CHECKOUT' | 'SUCCESS'>('BASKET');
  const [town, setTown] = useState(user.addresses[0]?.town || 'Voi');
  const [landmark, setLandmark] = useState(
    user.addresses[0]?.landmark || 'Sofia Estate, Near Voi Primary Gate B'
  );
  const [phone, setPhone] = useState(user.phone || '+254 711 222 333');
  const [notes, setNotes] = useState('Call on arrival at the gate');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MPESA_STK');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [confirmedReceipt, setConfirmedReceipt] = useState<string | null>(null);

  if (!isKikapuDrawerOpen) return null;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landmark.trim() || !phone.trim()) return;
    setIsProcessing(true);
    try {
      const order = await checkoutKikapu({
        town,
        landmark,
        phone,
        paymentMethod,
        notes,
      });
      setConfirmedOrderId(order.id);
      setConfirmedReceipt(order.mpesaReceipt || 'CONFIRMED');
      setStep('SUCCESS');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeAndReset = () => {
    setIsKikapuDrawerOpen(false);
    setTimeout(() => setStep('BASKET'), 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={closeAndReset}
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#FAF9F5] shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-emerald-900" />
              <div>
                <h2 className="font-display text-lg font-bold text-stone-900">
                  {step === 'BASKET'
                    ? 'My Multi-Seller Kikapu'
                    : step === 'CHECKOUT'
                    ? 'Checkout & M-Pesa Payment'
                    : 'Order Confirmed'}
                </h2>
                <p className="text-xs text-stone-500">
                  {groupedKikapuByStore.length} local store(s) · Unified Jaza Rider delivery
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeAndReset}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
              aria-label="Close Kikapu drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {step === 'BASKET' && (
              <>
                {basket.length === 0 ? (
                  <div className="text-center py-14 px-4 bg-white rounded-xl border border-stone-200/80">
                    <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                    <h3 className="font-display text-lg font-semibold text-stone-900">
                      Your Kikapu is empty
                    </h3>
                    <p className="text-sm text-stone-500 mt-1 max-w-xs mx-auto">
                      Start exploring local stalls in Voi, Wundanyi, Mwatate, and Taveta or use Fill
                      My Kikapu to build a budget basket.
                    </p>
                    <div className="mt-5 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          closeAndReset();
                          navigate('explore');
                        }}
                        className="px-4 py-2 bg-emerald-900 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 cursor-pointer"
                      >
                        Explore the Market
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>
                        Items grouped automatically by seller stall for coordinated pickup
                      </span>
                      <button
                        type="button"
                        onClick={clearKikapu}
                        className="text-rose-700 hover:underline font-medium cursor-pointer whitespace-nowrap"
                      >
                        Clear Kikapu
                      </button>
                    </div>

                    {groupedKikapuByStore.map((group) => (
                      <div
                        key={group.storeId}
                        className="bg-white rounded-xl border border-stone-200/90 overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-stone-100/80 border-b border-stone-200/70 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StoreIcon className="w-4 h-4 text-emerald-900" />
                            <span className="text-sm font-semibold text-stone-900">
                              {group.storeName}
                            </span>
                            <span className="text-xs text-stone-500">· {group.storeLocation}</span>
                          </div>
                          <span className="font-mono-tabular text-xs font-semibold text-stone-700">
                            KSh {group.storeSubtotal.toLocaleString()}
                          </span>
                        </div>

                        <div className="divide-y divide-stone-100">
                          {group.items.map((item) => (
                            <div key={item.productId} className="p-4 flex gap-3.5 items-center">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                                <SmartImage
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-stone-900 truncate">
                                  {item.product.name}
                                </h4>
                                <p className="text-xs text-stone-500 mt-0.5 font-mono-tabular">
                                  KSh {item.product.price.toLocaleString()} × {item.quantity} = KSh{' '}
                                  {(item.product.price * item.quantity).toLocaleString()}
                                </p>
                                <div className="mt-2 flex items-center gap-3">
                                  <div className="inline-flex items-center border border-stone-200 rounded-md bg-stone-50">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateKikapuQuantity(item.productId, item.quantity - 1)
                                      }
                                      className="p-1 text-stone-600 hover:text-stone-950 cursor-pointer"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="px-2.5 text-xs font-mono-tabular font-semibold text-stone-900">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateKikapuQuantity(item.productId, item.quantity + 1)
                                      }
                                      className="p-1 text-stone-600 hover:text-stone-950 cursor-pointer"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => saveItemForLater(item.productId)}
                                    className="text-xs text-stone-500 hover:text-stone-800 inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Bookmark className="w-3 h-3" />
                                    <span>Save</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => removeFromKikapu(item.productId)}
                                    className="text-xs text-rose-700 hover:text-rose-900 inline-flex items-center gap-1 cursor-pointer ml-auto"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Saved For Later List */}
                {savedForLater.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-xs font-semibold text-stone-600 mb-2">
                      Saved for Later ({savedForLater.length})
                    </h3>
                    <div className="space-y-2">
                      {savedForLater.map((item) => (
                        <div
                          key={item.productId}
                          className="p-3 bg-white rounded-lg border border-stone-200 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-stone-900 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-stone-500 font-mono-tabular">
                              {item.storeName} · KSh {item.product.price.toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => moveSavedToKikapu(item.productId)}
                            className="px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-md hover:bg-stone-800 whitespace-nowrap cursor-pointer"
                          >
                            Move to Kikapu
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 'CHECKOUT' && (
              <form id="kikapu-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                    <Truck className="w-4 h-4 text-emerald-800" />
                    <span>Jaza Rider Delivery Destination</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Select Town in Taita-Taveta
                    </label>
                    <select
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                    >
                      {locations.map((l) => (
                        <option key={l.id} value={l.name}>
                          {l.name} ({l.county})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Estate, Stage, or Landmark
                    </label>
                    <input
                      type="text"
                      required
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g., Sofia Estate, Near Voi Primary Gate B"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Rider Delivery Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Gate code or boda instructions"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                    <Smartphone className="w-4 h-4 text-emerald-800" />
                    <span>Payment Gateway (M-Pesa / Cash on Delivery)</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        id: 'MPESA_STK' as PaymentMethod,
                        title: 'M-Pesa Express (STK Push)',
                        desc: 'Instant prompt sent to your Safaricom phone',
                      },
                      {
                        id: 'MPESA_TILL' as PaymentMethod,
                        title: 'M-Pesa Buy Goods Till (419820)',
                        desc: 'Pay via Lipa na M-Pesa Till & verify automatically',
                      },
                      {
                        id: 'CASH_ON_DELIVERY' as PaymentMethod,
                        title: 'Pay Jaza Rider on Delivery',
                        desc: 'Inspect your Kikapu at your doorstep & pay via M-Pesa or Cash',
                      },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          paymentMethod === opt.id
                            ? 'border-emerald-800 bg-emerald-50/50'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === opt.id}
                          onChange={() => setPaymentMethod(opt.id)}
                          className="mt-1 accent-emerald-900"
                        />
                        <div>
                          <div className="text-xs font-semibold text-stone-900">{opt.title}</div>
                          <div className="text-[11px] text-stone-500">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      M-Pesa / Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3 py-2 text-sm font-mono-tabular bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
                    />
                  </div>
                </div>
              </form>
            )}

            {step === 'SUCCESS' && (
              <div className="bg-white p-6 rounded-xl border border-stone-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-mono-tabular text-emerald-800 font-semibold">
                    ORDER #{confirmedOrderId} · RECEIPT {confirmedReceipt}
                  </p>
                  <h3 className="font-display text-xl font-bold text-stone-900 mt-1">
                    Asante! Your Kikapu is Being Prepared
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Each seller stall has received their split order and Jaza Rider{' '}
                    <strong>Benson Mwandawiro (KMFD 482V)</strong> has been assigned.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-lg text-left text-xs space-y-1 border border-stone-200/70">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Delivery Town:</span>
                    <span className="font-semibold text-stone-900">{town}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Dropoff Landmark:</span>
                    <span className="font-semibold text-stone-900">{landmark}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Verification Code:</span>
                    <span className="font-mono-tabular font-semibold text-emerald-900">
                      {confirmedReceipt}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeAndReset();
                      navigate('dashboard');
                    }}
                    className="w-full py-2.5 bg-emerald-900 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 cursor-pointer"
                  >
                    Track Live Delivery in Buyer Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={closeAndReset}
                    className="w-full py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Kikapu Summary Footer */}
          {basket.length > 0 && step !== 'SUCCESS' && (
            <div className="p-5 bg-white border-t border-stone-200 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>
                    Subtotal ({groupedKikapuByStore.length} store
                    {groupedKikapuByStore.length > 1 ? 's' : ''})
                  </span>
                  <span className="font-mono-tabular font-medium text-stone-900">
                    KSh {kikapuSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Jaza Rider Multi-Stall Delivery</span>
                  <span className="font-mono-tabular font-medium text-stone-900">
                    KSh {kikapuDeliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                  <span>TOTAL</span>
                  <span className="font-mono-tabular text-base text-emerald-900">
                    KSh {kikapuTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {step === 'BASKET' ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsKikapuDrawerOpen(false);
                      navigate('kikapu');
                    }}
                    className="px-3.5 py-2.5 border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg hover:bg-stone-100 whitespace-nowrap cursor-pointer"
                  >
                    Full View
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        setIsKikapuDrawerOpen(false);
                        openAuthModal(
                          'BUYER_SIGNUP',
                          'Please Sign Up and Log In to proceed to Checkout & M-Pesa Payment.'
                        );
                        return;
                      }
                      setStep('CHECKOUT');
                    }}
                    className="flex-1 py-2.5 px-4 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isAuthenticated ? 'CHECKOUT MY KIKAPU' : 'SIGN UP / LOG IN TO CHECKOUT'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('BASKET')}
                    className="px-4 py-2.5 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-100 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="kikapu-checkout-form"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 px-4 bg-emerald-900 hover:bg-emerald-800 disabled:bg-stone-400 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    {isProcessing
                      ? 'Sending M-Pesa STK Prompt...'
                      : `Pay KSh ${kikapuTotal.toLocaleString()} Now`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
