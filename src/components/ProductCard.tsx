import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types/marketplace';
import { useMarketplace } from '../context/MarketplaceContext';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToKikapu } = useMarketplace();

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-xl border border-stone-200/80 overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md">
      {/* 4:3 Imagery Container (65%-75% of visual weight) */}
      <div
        onClick={() => navigate('product-detail', { productId: product.id })}
        className="relative aspect-4/3 w-full bg-[#F5F4F0] overflow-hidden cursor-pointer"
      >
        <SmartImage
          src={product.images[0]}
          alt={product.name}
          fallbackLabel={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
        />
        {discountPercent && (
          <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded text-xs font-mono-tabular font-medium">
            Save {discountPercent}%
          </div>
        )}
      </div>

      {/* Contiguous Card Content — Zero Static Pill Spam */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Unboxed Metadata with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 truncate">
            <button
              type="button"
              onClick={() => navigate('store-detail', { storeSlug: product.storeSlug })}
              className="hover:text-emerald-900 hover:underline font-medium text-stone-600 truncate cursor-pointer"
            >
              {product.storeName}
            </button>
            <span aria-hidden="true">·</span>
            <span className="shrink-0">{product.location}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-0.5 shrink-0 text-stone-600">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="font-mono-tabular">{product.rating.toFixed(1)}</span>
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => navigate('product-detail', { productId: product.id })}
            className="text-base font-semibold text-stone-900 group-hover:text-emerald-900 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-1">
            {product.unit} · {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>

        {/* Price & Direct Add to Kikapu Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="font-mono-tabular text-[15px] font-semibold text-stone-950">
              KSh {product.price.toLocaleString()}
            </div>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <div className="font-mono-tabular text-xs text-stone-400 line-through">
                KSh {product.compareAtPrice.toLocaleString()}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToKikapu(product, 1)}
            disabled={product.stock <= 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-900 text-white hover:bg-emerald-800 disabled:bg-stone-200 disabled:text-stone-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>Add to Kikapu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
