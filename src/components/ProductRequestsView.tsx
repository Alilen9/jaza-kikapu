import React, { useState, useEffect } from 'react';
import { ProductRequest } from '../types';
import { api } from '../services/api';
import { useMarket } from '../context/MarketContext';
import { MessageSquare, Plus, CheckCircle, Tag, MapPin, Send, Store } from 'lucide-react';

export const ProductRequestsView: React.FC = () => {
  const { showToast, activeRole } = useMarket();
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Request Form
  const [buyerName, setBuyerName] = useState('Faith M.');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [marketArea, setMarketArea] = useState('Voi Town');
  const [maxBudget, setMaxBudget] = useState(5000);

  // Response Form State
  const [respondingToId, setRespondingToId] = useState<string | null>(null);
  const [responseOfferPrice, setResponseOfferPrice] = useState(4500);
  const [responseMessage, setResponseMessage] = useState('Niko nayo dukani Voi!');

  const loadRequests = () => {
    setIsLoading(true);
    api.getProductRequests()
      .then(res => {
        setRequests(res);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please enter what you are looking for');
      return;
    }

    try {
      await api.createProductRequest({
        buyerName,
        title,
        description,
        marketArea,
        maxBudget: Number(maxBudget),
      });
      showToast('Product request broadcasted to Voi sellers!');
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      loadRequests();
    } catch {
      showToast('Failed to post request');
    }
  };

  const handleSendResponse = async (requestId: string) => {
    try {
      await api.respondToProductRequest(requestId, {
        storeId: 'store-1',
        offeredPrice: responseOfferPrice,
        message: responseMessage,
      });
      showToast('Offer sent to buyer! They can now contact your stall.');
      setRespondingToId(null);
      loadRequests();
    } catch {
      showToast('Failed to send offer');
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-semibold mb-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Sourcing in Taita-Taveta</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-stone-900 tracking-tight">
            Request a Product
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Can’t find what you need? Post it here and local sellers in Voi will reply: <strong>"I HAVE IT"</strong>
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D95D39] text-white font-semibold text-xs hover:bg-[#C24E2C] transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Request</span>
        </button>
      </div>

      {/* Requests Feed */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-32 bg-stone-200 rounded-2xl animate-pulse"></div>
          <div className="h-32 bg-stone-200 rounded-2xl animate-pulse"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6">
          <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-stone-700">No open requests right now</p>
          <p className="text-xs text-stone-500 mt-1">Be the first to ask local sellers for an item!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-[#E6E0D4] p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-stone-500">{req.buyerName}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D95D39]" />
                      {req.marketArea}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-[11px] text-stone-400">{req.createdAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900">{req.title}</h3>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-xl self-start">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Max Budget: KES {req.maxBudget.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 mb-4 leading-relaxed bg-stone-50 p-3 rounded-xl">
                "{req.description}"
              </p>

              {/* Seller Responses ("I HAVE IT") */}
              {req.responses && req.responses.length > 0 && (
                <div className="space-y-2 mb-3">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Seller Offers ({req.responses.length})
                  </div>
                  {req.responses.map(res => (
                    <div key={res.id} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-stone-900">
                          <Store className="w-3.5 h-3.5 text-[#1B4332]" />
                          <span>{res.storeName}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[9px] font-bold">
                            I HAVE IT!
                          </span>
                        </div>
                        <p className="text-stone-700 text-[11px] mt-0.5">{res.message}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          KES {res.offeredPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Seller Response Action */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Are you a local vendor in Voi with this item in stock?
                </span>

                {respondingToId === req.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={responseOfferPrice}
                      onChange={(e) => setResponseOfferPrice(Number(e.target.value))}
                      placeholder="KES Price"
                      className="w-24 px-2 py-1 text-xs border border-stone-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="e.g. Niko nayo Stall B-14!"
                      className="w-48 px-2 py-1 text-xs border border-stone-300 rounded-lg"
                    />
                    <button
                      onClick={() => handleSendResponse(req.id)}
                      className="px-3 py-1 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#143225] cursor-pointer"
                    >
                      Send Offer
                    </button>
                    <button
                      onClick={() => setRespondingToId(null)}
                      className="text-stone-400 hover:text-stone-600 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setRespondingToId(req.id);
                      setResponseOfferPrice(req.maxBudget);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Respond "I HAVE IT"</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-display font-bold text-lg text-stone-900 mb-1">
              Ask Voi Sellers for a Product
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Local market stalls will receive an alert and respond with their stock & prices.
            </p>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  What item are you looking for?
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Samsung Galaxy A15 256GB Black"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Details / Specifications / Preferred Location
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Looking for a brand new sealed phone with warranty, need delivery in Voi town center."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Max Budget (KES)
                  </label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Area in Taita-Taveta
                  </label>
                  <select
                    value={marketArea}
                    onChange={(e) => setMarketArea(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="Voi Town">Voi Town</option>
                    <option value="Sofia Market">Sofia</option>
                    <option value="Tsavo Plaza">Tsavo Junction</option>
                    <option value="Taveta">Taveta</option>
                    <option value="Wundanyi">Wundanyi</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D95D39] text-white font-semibold rounded-xl hover:bg-[#C24E2C]"
                >
                  Broadcast Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
