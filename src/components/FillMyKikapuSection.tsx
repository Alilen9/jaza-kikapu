import React, { useState, useMemo } from 'react';
import { ShoppingBag, Check, Plus, SlidersHorizontal } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { productService } from '../services/marketplaceService';
import { SmartImage } from './SmartImage';

export const FillMyKikapuSection: React.FC = () => {
  const { products, addToKikapu, setIsKikapuDrawerOpen, pushToast } = useMarketplace();

  const [budget, setBudget] = useState<number>(2000);
  const [familySize, setFamilySize] = useState<number>(4);
  const [focus, setFocus] = useState<'BALANCED' | 'FRESH_PRODUCE' | 'PANTRY_STAPLES'>('BALANCED');
  const [addedAll, setAddedAll] = useState(false);

  const suggestion = useMemo(() => {
    return productService.suggestFillMyKikapu(budget, familySize, focus, products);
  }, [budget, familySize, focus, products]);

  const handleAddAllSuggested = () => {
    if (suggestion.items.length === 0) return;
    suggestion.items.forEach((entry) => {
      addToKikapu(entry.product, entry.quantity, false);
    });
    setAddedAll(true);
    pushToast(
      `Added ${suggestion.items.length} suggested items to your Kikapu`,
      `Total KSh ${suggestion.total.toLocaleString()} across local Taita-Taveta stalls.`
    );
    setTimeout(() => setAddedAll(false), 2500);
  };

  const quickBudgets = [1000, 2000, 3500, 5000];

  return (
    <section className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-emerald-900 tracking-wide">
              Signature Jaza Kikapu Assistant
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Fill My Kikapu
            </h2>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Enter your household budget and family size. We automatically assemble a balanced
              multi-seller Kikapu from Voi supermarkets and Wundanyi fresh farms within your budget.
            </p>
          </div>

          {/* Budget Input & Quick Selectors */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="kikapu-budget-input" className="text-xs font-semibold text-stone-700">
                My Budget (KSh)
              </label>
              <span className="font-mono-tabular text-sm font-bold text-emerald-900">
                KSh {budget.toLocaleString()}
              </span>
            </div>
            <input
              id="kikapu-budget-input"
              type="number"
              min={300}
              max={25000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Math.max(200, Number(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 text-sm font-mono-tabular font-semibold bg-[#FAF9F5] border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-800"
            />
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {quickBudgets.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBudget(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-tabular font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    budget === amt
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  KSh {amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Household Size Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">
              I need groceries for:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { size: 1, label: 'Single / 1–2' },
                { size: 4, label: 'Family of 4' },
                { size: 6, label: 'Large Family (6+)' },
              ].map((opt) => (
                <button
                  key={opt.size}
                  type="button"
                  onClick={() => setFamilySize(opt.size)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    familySize === opt.size
                      ? 'bg-emerald-900 text-white font-semibold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Focus */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">
              Basket Priority:
            </label>
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              {[
                { id: 'BALANCED' as const, label: 'All-Rounder' },
                { id: 'PANTRY_STAPLES' as const, label: 'Pantry Staples' },
                { id: 'FRESH_PRODUCE' as const, label: 'Farm Fresh' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFocus(tab.id)}
                  className={`flex-1 py-1.5 px-2.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    focus === tab.id
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Suggested Basket Preview */}
        <div className="lg:col-span-7 bg-[#FAF9F5] rounded-xl border border-stone-200/90 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-900" />
                <h3 className="text-sm font-semibold text-stone-900">
                  Suggested Multi-Seller Kikapu ({suggestion.items.length} items)
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-mono-tabular">
                Remaining: KSh {Math.max(0, budget - suggestion.total).toLocaleString()}
              </span>
            </div>

            {suggestion.items.length === 0 ? (
              <div className="py-10 text-center text-sm text-stone-500">
                Increase your budget above KSh 300 to see suggested local staples.
              </div>
            ) : (
              <div className="divide-y divide-stone-200/70 max-h-80 overflow-y-auto my-2 pr-1">
                {suggestion.items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="py-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                        <SmartImage src={product.images[0]} alt={product.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-stone-500 truncate">
                          {product.storeName} · {product.location} · Qty {quantity} ({product.unit})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono-tabular text-sm font-semibold text-stone-900">
                        KSh {(product.price * quantity).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => addToKikapu(product, quantity)}
                        className="p-1.5 rounded-md bg-white border border-stone-200 text-stone-700 hover:bg-emerald-900 hover:text-white transition-colors cursor-pointer"
                        title="Add single item"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-2 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-stone-500">Suggested Basket Total</div>
              <div className="font-mono-tabular text-xl font-bold text-stone-950">
                KSh {suggestion.total.toLocaleString()}{' '}
                <span className="text-xs font-normal text-stone-500">
                  / KSh {budget.toLocaleString()} budget
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleAddAllSuggested}
                disabled={suggestion.items.length === 0}
                className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-900 hover:bg-emerald-800 text-white transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {addedAll ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Kikapu!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD SUGGESTED ITEMS</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsKikapuDrawerOpen(true)}
                className="px-3.5 py-2.5 rounded-lg text-xs font-semibold border border-stone-300 text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                Open Kikapu
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
