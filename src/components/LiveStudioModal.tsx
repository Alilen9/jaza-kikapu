import React, { useState, useEffect, useRef } from 'react';
import { LiveSession, Product } from '../types';
import { useMarket } from '../context/MarketContext';
import { api } from '../services/api';
import { X, Users, Heart, Send, Plus, Check, Eye, HelpCircle } from 'lucide-react';

interface LiveStudioModalProps {
  session: LiveSession;
  products: Product[];
  onClose: () => void;
  onOpenShowMe: (product: Product) => void;
}

export const LiveStudioModal: React.FC<LiveStudioModalProps> = ({
  session,
  products,
  onClose,
  onOpenShowMe,
}) => {
  const { addToKikapu, kikapu, showToast } = useMarket();
  const [comments, setComments] = useState(session.comments || []);
  const [message, setMessage] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const [heartsCount, setHeartsCount] = useState(148);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const pinnedProducts = products.filter(p => session.pinnedProductIds.includes(p.id));

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const newComment = await api.addLiveComment(session.id, 'Shopper in Voi', message.trim(), isQuestion);
      setComments(prev => [...prev, newComment]);
      setMessage('');
      setIsQuestion(false);
      showToast(isQuestion ? 'Question sent to seller!' : 'Comment posted!');
    } catch {
      showToast('Error sending message');
    }
  };

  const handleSendHeart = () => {
    setHeartsCount(prev => prev + 1);
    const newHeart = {
      id: Date.now(),
      left: Math.random() * 60 + 20, // percentage
    };
    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
      <div className="relative w-full max-w-5xl h-[92vh] bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col md:flex-row">
        {/* Left Side: Video Stage */}
        <div className="relative flex-1 bg-black flex flex-col justify-between overflow-hidden">
          {/* Real video stream playback */}
          <video
            src={session.streamVideoUrl}
            autoPlay
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

          {/* Floating Hearts Animation */}
          {floatingHearts.map(h => (
            <div
              key={h.id}
              style={{ left: `${h.left}%` }}
              className="absolute bottom-24 pointer-events-none animate-float-heart z-30"
            >
              <Heart className="w-8 h-8 fill-rose-500 text-rose-500 drop-shadow-lg" />
            </div>
          ))}

          {/* Top Video Header */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={session.storeLogo}
                alt={session.storeName}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">
                    {session.storeName}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#E63946] text-white text-[10px] font-bold tracking-wider">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <span className="flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5 text-[#F4A261]" />
                    {session.viewerCount} watching
                  </span>
                  <span>·</span>
                  <span className="line-clamp-1 max-w-[200px] text-stone-300">
                    {session.title}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Area on Video: Pinned Products Carousel */}
          <div className="relative z-10 p-4">
            {pinnedProducts.length > 0 && (
              <div className="mb-2">
                <div className="text-[11px] font-semibold text-[#F4A261] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Currently Showing in Live Stream</span>
                  <span className="text-stone-300 font-normal">Add straight to Kikapu</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {pinnedProducts.map(p => {
                    const inKikapu = kikapu.find(item => item.product.id === p.id);
                    return (
                      <div
                        key={p.id}
                        className="bg-stone-900/90 backdrop-blur-md border border-stone-700 rounded-2xl p-2.5 min-w-[240px] max-w-[260px] flex items-center gap-3 shrink-0 shadow-lg"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {p.name}
                          </h4>
                          <div className="text-xs font-bold text-[#F4A261] tabular-nums mt-0.5">
                            KES {p.price.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <button
                              onClick={() => addToKikapu(p, 1)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                                inKikapu
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#D95D39] hover:bg-[#C24E2C] text-white'
                              }`}
                            >
                              {inKikapu ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>In Kikapu ({inKikapu.quantity})</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>+ Kikapu</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => onOpenShowMe(p)}
                              className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-medium flex items-center gap-0.5 cursor-pointer"
                              title="Ask seller to show this item right now"
                            >
                              <Eye className="w-2.5 h-2.5" />
                              <span>Show Me</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Chat & Comments Stream */}
        <div className="w-full md:w-80 lg:w-96 bg-stone-900 border-t md:border-t-0 md:border-l border-stone-800 flex flex-col justify-between h-72 md:h-auto">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-stone-800 flex items-center justify-between text-white">
            <div className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
              <span>Live Stall Chat & Questions</span>
            </div>
            <button
              onClick={handleSendHeart}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{heartsCount}</span>
            </button>
          </div>

          {/* Comments Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
            {comments.map(c => (
              <div
                key={c.id}
                className={`p-2.5 rounded-xl text-xs ${
                  c.isQuestion
                    ? 'bg-amber-950/60 border border-amber-600/40 text-amber-200'
                    : 'bg-stone-800/80 text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-stone-300 flex items-center gap-1">
                    {c.userName}
                    {c.isQuestion && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-600 text-white text-[9px] font-bold">
                        QUESTION
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-stone-400">{c.timestamp}</span>
                </div>
                <p className="leading-relaxed">{c.message}</p>
              </div>
            ))}
            <div ref={commentsEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-800 bg-stone-950">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-[11px] text-stone-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isQuestion}
                  onChange={(e) => setIsQuestion(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <HelpCircle className="w-3 h-3 text-amber-400" />
                <span>Mark as Question for Seller</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isQuestion ? 'Ask seller about sizes, price, colors...' : 'Say something in the market stall...'}
                className="flex-1 bg-stone-800 border border-stone-700 text-white placeholder-stone-400 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#D95D39]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#D95D39] hover:bg-[#C24E2C] text-white cursor-pointer transition-colors"
                title="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
