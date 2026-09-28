import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { ShoppingCart, Plus, Minus, Search, Check, Sparkles } from 'lucide-react';

export const SupermarketQuickBasket: React.FC = () => {
  const { addToKikapu, kikapu, showToast } = useMarket();
  const [searchTerm, setSearchTerm] = useState('');

  // Daily essential grocery staples
  const groceryStaples = [
    {
      id: 'quick-1',
      name: 'Taifa Maize Flour (Unga ya Ugali 2kg)',
      category: 'Pantry & Grains',
      price: 185,
      unit: '2kg packet',
      storeName: 'Taita Greens & General Supermarket',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'quick-2',
      name: 'Fresh Farm Cow Milk (1 Litre Pouch)',
      category: 'Dairy',
      price: 75,
      unit: '1L pouch',
      storeName: 'Taita Greens & Taveta Bananas',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'quick-3',
      name: 'Rina Salad Pure Vegetable Cooking Oil (1L)',
      category: 'Oils & Fats',
      price: 290,
      unit: '1L bottle',
      storeName: 'Voi Supermarket & Wholesalers',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'quick-4',
      name: 'Tray of Fresh Kienyeji Eggs (30 Pieces)',
      category: 'Poultry & Eggs',
      price: 450,
      unit: 'tray (30 pcs)',
      storeName: 'Taita Greens & Taveta Bananas',
      image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'quick-5',
      name: 'Taveta Ripe Sweet Bananas (Fresh Bunch)',
      category: 'Fresh Produce',
      price: 250,
      unit: 'bunch',
      storeName: 'Taita Greens & Taveta Bananas',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'quick-6',
      name: 'Crisp Farm Sukuma Wiki (Collard Greens)',
      category: 'Fresh Produce',
      price: 50,
      unit: 'bundle',
      storeName: 'Taita Greens & Taveta Bananas',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'quick-7',
      name: 'Afa Brown Bread 400g (Fresh Sliced)',
      category: 'Bakery',
      price: 65,
      unit: 'loaf',
      storeName: 'Voi Supermarket & Wholesalers',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'quick-8',
      name: 'Kabras Pure White Sugar (1kg)',
      category: 'Pantry',
      price: 160,
      unit: '1kg bag',
      storeName: 'Voi Supermarket & Wholesalers',
      image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const filtered = groceryStaples.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-semibold mb-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Fast Daily Market Run</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-stone-900 tracking-tight">
            Supermarket Quick Basket
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Rapidly add essential household staples into your Kikapu with 1-tap quick counters.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search unga, milk, eggs..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#1B4332]"
          />
        </div>
      </div>

      {/* Grid of Quick Items */}
      <div className="bg-white rounded-3xl border border-[#E6E0D4] overflow-hidden shadow-sm divide-y divide-stone-100">
        {filtered.map(item => {
          const inCart = kikapu.find(c => c.product.id === item.id);
          const currentQty = inCart?.quantity || 0;

          return (
            <div key={item.id} className="p-4 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    {item.storeName}
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm tabular-nums">
                      KES {item.price.toLocaleString()}
                    </span>
                    <span className="text-stone-400 text-xs">/ {item.unit}</span>
                  </div>
                </div>
              </div>

              {/* Quick Add / Stepper */}
              <div className="shrink-0 flex items-center gap-2">
                {currentQty > 0 ? (
                  <div className="flex items-center gap-1.5 bg-[#1B4332] text-white rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => addToKikapu({
                        id: item.id,
                        storeId: 'store-2',
                        storeName: item.storeName,
                        category: item.category,
                        name: item.name,
                        description: '',
                        price: item.price,
                        stockQuantity: 50,
                        unit: item.unit,
                        image: item.image,
                        isAvailable: true,
                        isTaitaLocal: true
                      }, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold px-1.5">{currentQty}</span>
                    <button
                      onClick={() => addToKikapu({
                        id: item.id,
                        storeId: 'store-2',
                        storeName: item.storeName,
                        category: item.category,
                        name: item.name,
                        description: '',
                        price: item.price,
                        stockQuantity: 50,
                        unit: item.unit,
                        image: item.image,
                        isAvailable: true,
                        isTaitaLocal: true
                      }, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToKikapu({
                      id: item.id,
                      storeId: 'store-2',
                      storeName: item.storeName,
                      category: item.category,
                      name: item.name,
                      description: '',
                      price: item.price,
                      stockQuantity: 50,
                      unit: item.unit,
                      image: item.image,
                      isAvailable: true,
                      isTaitaLocal: true
                    }, 1)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-[#1B4332] text-stone-800 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
