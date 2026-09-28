import React, { useState, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import { api } from '../services/api';
import { ParentOrder } from '../types';
import { X, CheckCircle2, Phone, MapPin, Truck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    kikapu,
    kikapuSubtotal,
    clearKikapu,
    showToast,
    setActiveOrder,
  } = useMarket();

  const [customerName, setCustomerName] = useState('Sarah Mwakio');
  const [customerPhone, setCustomerPhone] = useState('0712345678');
  const [deliveryArea, setDeliveryArea] = useState('Voi Town');
  const [deliveryAddress, setDeliveryAddress] = useState('Next to KCB Bank, Voi Main Street');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stkStatus, setStkStatus] = useState<'IDLE' | 'PROMPT_SENT' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [pollRequestId, setPollRequestId] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<ParentOrder | null>(null);
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);

  // Group items by stall
  const sellerGroups = new Map<string, typeof kikapu>();
  for (const item of kikapu) {
    const sName = item.product.storeName;
    if (!sellerGroups.has(sName)) {
      sellerGroups.set(sName, []);
    }
    sellerGroups.get(sName)!.push(item);
  }

  const numSellers = sellerGroups.size;
  const deliveryFee = numSellers > 0 ? 100 + (numSellers > 1 ? (numSellers - 1) * 50 : 0) : 0;
  const platformFee = 50;
  const totalAmount = kikapuSubtotal + deliveryFee + platformFee;

  // Poll M-Pesa Status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pollRequestId && stkStatus === 'PROMPT_SENT') {
      interval = setInterval(async () => {
        try {
          const res = await api.pollMpesaStatus(pollRequestId);
          if (res.status === 'SUCCESS') {
            setStkStatus('SUCCESS');
            setReceiptNumber(res.receiptNumber || 'QHK88912A');
            clearInterval(interval);
            clearKikapu();
          } else if (res.status === 'FAILED') {
            setStkStatus('FAILED');
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Polling error', err);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pollRequestId, stkStatus]);

  if (!isCheckoutOpen) return null;

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || !deliveryAddress) {
      showToast('Please provide your phone number and delivery location');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Parent Order + Split Seller Orders on real backend
      const checkoutRes = await api.checkout({
        customerName,
        customerPhone,
        deliveryAddress,
        deliveryArea,
        items: kikapu.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      const order = checkoutRes.order;
      setCreatedOrder(order);
      setActiveOrder(order);

      // 2. Initiate M-Pesa STK Push
      const stkRes = await api.initiateMpesaSTK({
        orderId: order.id,
        phone: customerPhone,
        amount: order.totalAmount,
      });

      setPollRequestId(stkRes.CheckoutRequestID);
      setStkStatus('PROMPT_SENT');
      setIsSubmitting(false);
      showToast('STK Push sent to your Safaricom phone!');
    } catch (err: any) {
      setIsSubmitting(false);
      showToast(err.message || 'Payment initiation failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h3 className="font-display font-bold text-xl text-stone-900">
              {stkStatus === 'SUCCESS' ? 'Order Confirmed!' : 'Fill My Kikapu Checkout'}
            </h3>
            <p className="text-xs text-stone-500">
              {stkStatus === 'SUCCESS'
                ? 'Your order has been split and routed to local sellers'
                : 'Consolidated multi-seller checkout with M-Pesa'}
            </p>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setStkStatus('IDLE');
            }}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP A: Success Screen */}
        {stkStatus === 'SUCCESS' ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="font-display font-bold text-lg text-stone-900">
                Payment Received: KES {totalAmount.toLocaleString()}
              </h4>
              <p className="text-xs text-stone-600 font-mono mt-1">
                M-Pesa Receipt: <strong className="text-emerald-700">{receiptNumber}</strong>
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Order Number: <strong>{createdOrder?.orderNumber}</strong>
              </p>
            </div>

            {/* Split Orders Explanation */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-3">
              <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#1B4332]" />
                <span>Parent Order Created & Split to {numSellers} Sellers:</span>
              </div>
              <div className="space-y-2 text-xs">
                {createdOrder?.sellerOrders.map(so => (
                  <div key={so.id} className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-stone-900">{so.storeName}</div>
                      <div className="text-stone-500 text-[11px]">{so.items.length} item(s)</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-stone-900">KES {so.subtotal.toLocaleString()}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                        Preparing
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                A Boda Boda rider in Voi has been notified to pick up your packages from each stall and deliver to {deliveryAddress}.
              </span>
            </div>

            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setStkStatus('IDLE');
              }}
              className="w-full py-3 rounded-xl bg-[#1B4332] text-white font-semibold text-xs cursor-pointer hover:bg-[#143225]"
            >
              Back to Marketplace
            </button>
          </div>
        ) : stkStatus === 'PROMPT_SENT' ? (
          /* STEP B: STK Push Waiting Screen */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h4 className="font-display font-bold text-lg text-stone-900">
                Waiting for M-Pesa PIN
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1">
                Safaricom STK push prompt has been sent to <strong>{customerPhone}</strong>.
              </p>
            </div>

            {/* Simulated Phone Prompt Preview */}
            <div className="p-4 bg-emerald-900 text-white rounded-2xl max-w-xs mx-auto shadow-md text-left font-mono text-xs space-y-2 border border-emerald-700">
              <div className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider">
                Safaricom SIM Prompt
              </div>
              <p className="text-[12px] leading-relaxed">
                Do you want to pay <strong>KES {totalAmount.toLocaleString()}</strong> to <strong>JAZA KIKAPU</strong>?
              </p>
              <div className="pt-2 text-stone-300 text-[10px]">
                Enter M-Pesa PIN: • • • •
              </div>
            </div>

            <p className="text-xs text-stone-500">
              Checking real-time payment status from Safaricom callback...
            </p>
          </div>
        ) : (
          /* STEP C: Delivery Details & Payment Trigger */
          <form onSubmit={handleInitiatePayment} className="py-4 space-y-4">
            {/* Split Summary Preview */}
            <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-stone-200">
              <div className="text-xs font-semibold text-stone-800 mb-2 flex items-center justify-between">
                <span>Stalls in this Kikapu ({numSellers})</span>
                <span className="text-stone-500 font-normal">Consolidated Delivery</span>
              </div>
              <div className="space-y-1.5 text-xs text-stone-600">
                {Array.from(sellerGroups.entries()).map(([sName, items]) => (
                  <div key={sName} className="flex justify-between">
                    <span className="truncate max-w-[240px] font-medium text-stone-900">• {sName}</span>
                    <span className="font-mono tabular-nums">
                      KES {items.reduce((s, i) => s + i.product.price * i.quantity, 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B4332]"
                  placeholder="e.g. Sarah Mwakio"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Safaricom M-Pesa Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B4332] font-mono"
                  placeholder="0712345678"
                />
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  You will receive an instant STK prompt to enter your M-Pesa PIN.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D95D39]" />
                    <span>Taita-Taveta Area</span>
                  </label>
                  <select
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B4332] bg-white"
                  >
                    <option value="Voi Town">Voi Town Center</option>
                    <option value="Sofia Market">Sofia / Sofia Center</option>
                    <option value="Tsavo Junction">Tsavo Plaza Junction</option>
                    <option value="Moi High School Area">Moi High School Area</option>
                    <option value="Taveta">Taveta Town</option>
                    <option value="Wundanyi">Wundanyi Hills</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Exact Dropoff Landmark
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B4332]"
                    placeholder="e.g. Near KCB Bank / Gate B"
                  />
                </div>
              </div>
            </div>

            {/* Total Cost Review */}
            <div className="pt-2 border-t border-stone-200 text-xs space-y-1">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal:</span>
                <span className="font-mono">KES {kikapuSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Consolidated Delivery ({numSellers} stalls):</span>
                <span className="font-mono">KES {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Marketplace Fee:</span>
                <span className="font-mono">KES {platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-100">
                <span>Total M-Pesa Payment:</span>
                <span className="text-[#1B4332] font-mono text-base">KES {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isSubmitting || kikapu.length === 0}
              className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Safaricom Daraja...</span>
                </>
              ) : (
                <>
                  <span>Pay KES {totalAmount.toLocaleString()} with M-Pesa STK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
