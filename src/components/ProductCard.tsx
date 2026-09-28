import React from 'react';
import { Product } from '../types';
import { useMarket } from '../context/MarketContext';
import { Eye, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onShowMe?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onShowMe }) => {
  const { addToKikapu, kikapu, setSelectedProductForShowMe } = useMarket();

  const inKikapu = kikapu.find(item => item.product.id === product.id);

  return (
    <div className="group bg-white rounded-2xl border border-[#E6E0D4] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Product Image Area (Takes 65% of height) */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Local / Stock Indicators */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.isTaitaLocal && (
            <span className="px-2 py-0.5 rounded-md bg-[#1B4332] text-white text-[10px] font-bold tracking-tight">
              Taita-Taveta Local
            </span>
          )}
          {product.stockQuantity < 5 && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold">
              Only {product.stockQuantity} left
            </span>
          )}
        </div>

        {/* "Show Me" Quick Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onShowMe) {
              onShowMe(product);
            } else {
              setSelectedProductForShowMe(product);
            }
          }}
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black text-white text-[11px] font-medium backdrop-blur-md transition-colors cursor-pointer"
          title="Ask seller to show this product live/photo"
        >
          <Eye className="w-3.5 h-3.5 text-[#F4A261]" />
          <span>Show Me</span>
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Stall Name */}
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 truncate">
            {product.storeName}
          </div>

          {/* Product Name */}
          <h4 className="font-semibold text-stone-900 text-sm sm:text-base line-clamp-2 mb-2 leading-snug">
            {product.name}
          </h4>

          {/* Price & Unit */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">
              KES {product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                KES {product.compareAtPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-stone-500 font-normal">
              / {product.unit}
            </span>
          </div>
        </div>

        {/* Add to Kikapu Button */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
          <button
            onClick={() => addToKikapu(product, 1)}
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              inKikapu
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-[#1B4332] text-white hover:bg-[#143225] shadow-sm'
            }`}
          >
            {inKikapu ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Kikapu ({inKikapu.quantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-[#F4A261]" />
                <span>Add to Kikapu</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
