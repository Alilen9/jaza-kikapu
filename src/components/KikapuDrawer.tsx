import React from 'react';
import { useMarket } from '../context/MarketContext';
import { X, Trash2, Plus, Minus, ArrowRight, Store, ShieldCheck, Truck } from 'lucide-react';

export const KikapuDrawer: React.FC = () => {
  const {
    isKikapuOpen,
    setIsKikapuOpen,
    kikapu,
    updateQuantity,
    removeFromKikapu,
    clearKikapu,
    kikapuSubtotal,
    totalKikapuItems,
    setIsCheckoutOpen,
  } = useMarket();

  if (!isKikapuOpen) return null;

  // Group items by stall/seller
  const sellerGroups = new Map<string, typeof kikapu>();
  for (const item of kikapu) {
    const sName = item.product.storeName;
    if (!sellerGroups.has(sName)) {
      sellerGroups.set(sName, []);
    }
    sellerGroups.get(sName)!.push(item);
  }

  const numSellers = sellerGroups.size;
  // Multi-seller consolidated delivery formula: KES 100 base + KES 50 per extra seller
  const deliveryFee = numSellers > 0 ? 100 + (numSellers > 1 ? (numSellers - 1) * 50 : 0) : 0;
  const platformFee = numSellers > 0 ? 50 : 0;
  const totalAmount = kikapuSubtotal + deliveryFee + platformFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FBF9F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1B4332] text-[#F4A261] flex items-center justify-center font-bold">
                🧺
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900 leading-tight">
                  My Kikapu
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  {totalKikapuItems} items from {numSellers} market {numSellers === 1 ? 'stall' : 'stalls'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {kikapu.length > 0 && (
                <button
                  onClick={clearKikapu}
                  className="text-xs text-stone-400 hover:text-rose-600 font-medium cursor-pointer"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsKikapuOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {kikapu.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                  🧺
                </div>
                <h4 className="font-display font-semibold text-stone-800 text-base mb-1">
                  Your Kikapu is Empty
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                  Walk through the digital market, discover stalls, and add products from multiple local sellers into your basket!
                </p>
                <button
                  onClick={() => setIsKikapuOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-white font-semibold text-xs cursor-pointer hover:bg-[#143225]"
                >
                  Explore Voi Market
                </button>
              </div>
            ) : (
              Array.from(sellerGroups.entries()).map(([storeName, items]) => {
                const stallSubtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

                return (
                  <div key={storeName} className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                    {/* Stall Group Header */}
                    <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-stone-800">
                        <Store className="w-3.5 h-3.5 text-[#1B4332]" />
                        <span>{storeName}</span>
                      </div>
                      <span className="font-mono font-semibold text-stone-700">
                        Subtotal: KES {stallSubtotal.toLocaleString()}
                      </span>
                    </div>

                    {/* Stall Items */}
                    <div className="p-3 divide-y divide-stone-100">
                      {items.map(item => (
                        <div key={item.product.id} className="py-3 first:pt-1 last:pb-1 flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-xs text-stone-900 line-clamp-1">
                              {item.product.name}
                            </h5>
                            <div className="text-xs font-bold text-stone-800 tabular-nums mt-0.5">
                              KES {item.product.price.toLocaleString()}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-md bg-white hover:bg-stone-200 text-stone-700 cursor-pointer shadow-xs"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-mono text-xs font-bold px-2">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-md bg-white hover:bg-stone-200 text-stone-700 cursor-pointer shadow-xs"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromKikapu(item.product.id)}
                                className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {kikapu.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-[#FBF9F5] space-y-3">
              {/* Multi-Seller Split Explanation */}
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 text-[11px] text-emerald-900 border border-emerald-200">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Consolidated Delivery:</strong> You are shopping from {numSellers} different stalls. A single Boda/Tuk-Tuk rider will collect all items and deliver them together!
                </span>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Products Subtotal</span>
                  <span className="font-mono font-medium text-stone-900">
                    KES {kikapuSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Consolidated Rider Delivery</span>
                  <span className="font-mono font-medium text-stone-900">
                    KES {deliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Marketplace Service Fee</span>
                  <span className="font-mono font-medium text-stone-900">
                    KES {platformFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                  <span>Total (M-Pesa)</span>
                  <span className="font-mono text-base text-[#1B4332]">
                    KES {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsKikapuOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#D95D39] hover:bg-[#C24E2C] text-white font-semibold text-sm transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
