import React, { useState } from 'react';
import { Product } from '../types';
import { useMarket } from '../context/MarketContext';
import { api } from '../services/api';
import { Eye, X, Send, Sparkles, Video, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface ShowMeModalProps {
  product: Product;
  onClose: () => void;
}

export const ShowMeModal: React.FC<ShowMeModalProps> = ({ product, onClose }) => {
  const { showToast } = useMarket();
  const [buyerName, setBuyerName] = useState('Lucy M.');
  const [question, setQuestion] = useState('Can you show me the red color variant and the fabric texture up close?');
  const [status, setStatus] = useState<'IDLE' | 'SENT' | 'REPLIED'>('IDLE');
  const [sellerReplyText, setSellerReplyText] = useState('');
  const [sellerReplyMedia, setSellerReplyMedia] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setStatus('SENT');
      await api.createShowMeRequest({
        storeId: product.storeId,
        productName: product.name,
        buyerName,
        question,
      });

      showToast('Show Me request sent to seller stall!');

      // Simulate seller responding with live photo demonstration after 2.5 seconds
      setTimeout(() => {
        setStatus('REPLIED');
        setSellerReplyText(`Hujambo ${buyerName}! Here is the close-up shot taken right now on the counter at ${product.storeName}. The red variant has matching gold stitching!`);
        setSellerReplyMedia('https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=600&q=80');
      }, 2500);
    } catch {
      showToast('Failed to send request');
      setStatus('IDLE');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-stone-900">
                Ask Seller "Show Me"
              </h3>
              <p className="text-[11px] text-stone-500">
                Get a photo, video clip, or live demo from the digital stall
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Product Card Summary */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FBF9F5] border border-stone-200 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-14 h-14 rounded-xl object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
              {product.storeName}
            </div>
            <h4 className="font-semibold text-xs text-stone-900 line-clamp-1">
              {product.name}
            </h4>
            <div className="font-mono text-xs font-bold text-[#1B4332] mt-0.5">
              KES {product.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Status Views */}
        {status === 'REPLIED' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Seller responded with live photo demonstration!</span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-stone-200 bg-black">
              <img
                src={sellerReplyMedia}
                alt="Seller proof demo"
                className="w-full h-56 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 leading-relaxed border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">{product.storeName}:</span>
              "{sellerReplyText}"
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#1B4332] text-white font-semibold text-xs hover:bg-[#143225] cursor-pointer"
            >
              Great! Back to Stall
            </button>
          </div>
        ) : status === 'SENT' ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <h4 className="font-semibold text-sm text-stone-900">
              Notification Sent to Seller Stall
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              The stall owner in Voi is preparing a real image/video demonstration for you right now...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#1B4332]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                What would you like the seller to demonstrate?
              </label>
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Can you show me the red one? Or show how the dress flows when walking?"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#1B4332]"
                required
              />
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-500 space-y-1">
              <div className="font-semibold text-stone-700">How sellers respond:</div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Photo of variant</span>
                <span className="flex items-center gap-1"><Video className="w-3 h-3" /> Quick video clip</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-500 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#D95D39] text-white font-semibold rounded-xl hover:bg-[#C24E2C] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send "Show Me" Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
