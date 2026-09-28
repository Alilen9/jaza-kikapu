import React, { useState, useRef, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import { api } from '../services/api';
import { Product, Store } from '../types';
import { Sparkles, X, Send, Store as StoreIcon, Plus, Check, Loader2, ArrowRight, ShoppingBag } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  matchedProducts?: Product[];
  matchedStores?: Store[];
  timestamp: string;
}

export const JazaAIAssistantModal: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    addToKikapu,
    kikapu,
    setSelectedStore,
    setIsKikapuOpen,
  } = useMarket();

  const [inputQuery, setInputQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Hujambo! I am Jaza AI, your personal shopping concierge for Voi and Taita-Taveta County. Tell me what you are looking for, your budget, or which market stall you want to explore, and I will find real in-stock items with direct delivery!',
      timestamp: 'Just now',
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSearching]);

  if (!isAIAssistantOpen) return null;

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsSearching(true);

    try {
      const res = await api.askAIAssistant(q);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: res.aiSuggestion,
        matchedProducts: res.matchedProducts,
        matchedStores: res.matchedStores,
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "Samahani, I had a momentary issue querying the Voi marketplace database. Please try again or browse stalls directly!",
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSearching(false);
    }
  };

  const samplePrompts = [
    'Ankara maxi dress under KES 2,500',
    'Fresh sweet bananas and avocados in Voi',
    'Heavy duty power bank for Tsavo safari',
    'Traditional Kasigau handwoven Kikapu',
    'How does multi-seller consolidated delivery work?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[88vh] shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FBF9F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-[#F4A261] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-stone-900">
                  Jaza AI Shopping Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Connected to real catalog inventory in Voi & Taita-Taveta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsAIAssistantOpen(false);
                setIsKikapuOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
              title="Open Kikapu"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D95D39]" />
              <span className="hidden sm:inline">My Kikapu</span>
            </button>

            <button
              onClick={() => setIsAIAssistantOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#1B4332] text-white rounded-tr-none'
                    : 'bg-[#F8F6F0] text-stone-900 border border-[#E8E2D5] rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    msg.sender === 'user' ? 'text-stone-300' : 'text-[#D95D39]'
                  }`}>
                    {msg.sender === 'user' ? 'You' : 'Jaza AI'}
                  </span>
                  <span className="text-[10px] opacity-60 font-mono">{msg.timestamp}</span>
                </div>

                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Embedded Matched Products */}
                {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-200 space-y-2">
                    <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                      Recommended From Real Stalls:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.matchedProducts.map(p => {
                        const inKikapu = kikapu.find(item => item.product.id === p.id);
                        return (
                          <div
                            key={p.id}
                            className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center gap-2.5 shadow-2xs"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-[9px] font-semibold text-stone-400 uppercase truncate">
                                {p.storeName}
                              </div>
                              <h5 className="font-semibold text-xs text-stone-900 truncate">
                                {p.name}
                              </h5>
                              <div className="font-mono text-xs font-bold text-stone-900 mt-0.5">
                                KES {p.price.toLocaleString()}
                              </div>
                              <button
                                onClick={() => addToKikapu(p, 1)}
                                className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                                  inKikapu
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-[#D95D39] text-white hover:bg-[#C24E2C]'
                                }`}
                              >
                                {inKikapu ? (
                                  <>
                                    <Check className="w-2.5 h-2.5" />
                                    <span>In Kikapu ({inKikapu.quantity})</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-2.5 h-2.5" />
                                    <span>+ Kikapu</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Embedded Matched Stores */}
                {msg.matchedStores && msg.matchedStores.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-stone-200 flex flex-wrap gap-2">
                    {msg.matchedStores.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedStore(s);
                          setIsAIAssistantOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <StoreIcon className="w-3 h-3 text-[#1B4332]" />
                        <span>Visit {s.name} ({s.stallNumber})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Searching Loader Indicator */}
          {isSearching && (
            <div className="flex items-center gap-2 text-stone-500 text-xs p-3 bg-stone-50 rounded-2xl max-w-xs animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-[#1B4332]" />
              <span>Jaza AI is searching Voi market stalls...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips & Input */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-[#FBF9F5] space-y-2.5">
          {/* Quick Questions Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {samplePrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isSearching}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-[#1B4332] text-stone-700 text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                "{prompt}"
              </button>
            ))}
          </div>

          {/* Text Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything: item name, budget, or question about Voi market..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#1B4332] shadow-2xs"
            />
            <button
              type="submit"
              disabled={isSearching || !inputQuery.trim()}
              className="px-4 py-2.5 bg-[#1B4332] hover:bg-[#143225] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
