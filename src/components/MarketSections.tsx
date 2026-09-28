import React from 'react';
import { Apple, Shirt, Smartphone, Wrench, Sparkles, ShoppingCart, Sparkle } from 'lucide-react';

interface MarketSectionsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenQuickBasket: () => void;
}

export const MarketSections: React.FC<MarketSectionsProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenQuickBasket,
}) => {
  const sections = [
    { id: 'All', name: 'All Stalls', icon: Sparkle, count: '12 stalls' },
    { id: 'Fresh Produce', name: 'Fresh Farm Produce', icon: Apple, count: 'Taveta & Wundanyi' },
    { id: 'Fashion & Apparel', name: 'Fashion & Ankara', icon: Shirt, count: 'Voi Market B-Line' },
    { id: 'Electronics & Phones', name: 'Electronics & Phones', icon: Smartphone, count: 'Tsavo Plaza' },
    { id: 'Hardware & Tools', name: 'Hardware & Solar', icon: Wrench, count: 'Industrial Sheds' },
    { id: 'Local Crafts & Living', name: 'Taita Crafts & Honey', icon: Sparkles, count: 'Kasigau Heritage' },
  ];

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 tracking-tight">
            Market Sections
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Walk between different sections of the digital market
          </p>
        </div>

        <button
          onClick={onOpenQuickBasket}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F0EC] text-[#1B4332] hover:bg-[#D5E5DC] text-xs font-semibold transition-colors cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Supermarket Quick List</span>
        </button>
      </div>

      {/* Horizontal Scrollable or Wrap Grid of Market Category Sections */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {sections.map(sec => {
          const Icon = sec.icon;
          const isSelected = selectedCategory === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => onSelectCategory(sec.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm'
                  : 'bg-white text-stone-700 border-[#E6E0D4] hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F4A261]' : 'text-stone-500'}`} />
              <div className="text-left">
                <div className="font-semibold">{sec.name}</div>
                <div className={`text-[10px] ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                  {sec.count}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
