import React, { useState } from 'react';
import { Heart, ShoppingBag, ArrowRight, Trash2, Check, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../data/products';
import { ActivePage, Product } from '../types';

interface WishlistViewProps {
  onNavigate: (page: ActivePage) => void;
  onViewProduct: (product: Product) => void;
  products: Product[];
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  onNavigate,
  onViewProduct,
  products
}) => {
  const { wishlist, toggleWishlist, addToCart, showToast } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter store products that are in the user's wishlist
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleMoveToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast('This item is currently out of stock.');
      return;
    }
    const chosenSize = selectedSizes[product.id] || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const chosenColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
    
    addToCart(product, 1, chosenSize, chosenColor);
  };

  const handleShareWishlist = () => {
    const text = `Take a look at my curated modest fashion wishlist from Ridhal Ventures! Featuring ${wishlistedProducts.length} premium pieces.`;
    if (navigator.share) {
      navigator.share({
        title: 'My Ridhal Ventures Wishlist',
        text,
        url: window.location.href
      }).catch(() => {
        // user cancelled or share failed
      });
    } else {
      navigator.clipboard.writeText(`${text}\n${window.location.origin}`);
      setCopiedLink(true);
      showToast('Wishlist link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#FAF2DC] border-2 border-[#DFC377] flex items-center justify-center mx-auto text-[#9E7422]">
          <Heart className="w-10 h-10 opacity-70" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2DC] border border-[#DFC377] text-xs font-semibold tracking-widest uppercase text-[#9E7422]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saved Favorites</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-extrabold text-[#111]">
            Your Wishlist is Empty
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Save the Jalabs, Abayas, Islamic essentials, and English wear you adore by tapping the heart icon on any product.
          </p>
        </div>
        <div>
          <button
            id="wishlist-start-shopping-btn"
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 bg-[#9E7422] hover:bg-[#85611B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Boutique</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E8DFC8]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2DC] border border-[#DFC377] text-xs font-semibold tracking-widest uppercase text-[#9E7422] mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Curated Collection</span>
          </div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111]">
            My Wishlist ({wishlistedProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Items saved to your private collection. Move them to your shopping bag anytime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareWishlist}
            className="px-4 py-2.5 rounded-xl border border-[#DFC377] bg-white hover:bg-[#FAF6EE] text-[#9E7422] text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Wishlist</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              wishlistedProducts.forEach((p) => {
                if (p.stock > 0) handleMoveToCart(p);
              });
              showToast('Added available items to your shopping bag!');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#9E7422] hover:bg-[#85611B] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add All to Bag</span>
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistedProducts.map((product) => {
          const isOutOfStock = product.stock <= 0;
          const currentChosenSize =
            selectedSizes[product.id] ||
            (product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Quick View Link */}
              <div className="relative aspect-square bg-[#FAF6EE] overflow-hidden group cursor-pointer" onClick={() => onViewProduct(product)}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Stock Badge */}
                {isOutOfStock ? (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Out of Stock</span>
                  </div>
                ) : product.stock <= 3 ? (
                  <div className="absolute top-3 left-3 bg-[#C59A45] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide shadow-sm">
                    Only {product.stock} left
                  </div>
                ) : null}

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-red-600 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                  title="Remove from wishlist"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info & Actions */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span className="uppercase tracking-wider font-semibold text-[#9E7422]">
                      {product.category}
                    </span>
                    <span>{product.subcategory}</span>
                  </div>

                  <h3
                    onClick={() => onViewProduct(product)}
                    className="font-serif-luxury text-base font-bold text-[#111] hover:text-[#9E7422] transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-sm text-[#111]">
                      {formatNaira(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatNaira(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Size Selector if applicable */}
                {product.sizes && product.sizes.length > 0 && !isOutOfStock && (
                  <div className="space-y-1.5 pt-1 border-t border-[#F2ECE0]">
                    <div className="text-[11px] font-semibold text-gray-600">Select Size:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleSizeSelect(product.id, sz)}
                          className={`px-2 py-1 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                            currentChosenSize === sz
                              ? 'bg-[#121212] text-[#F5E4B5] border-[#121212]'
                              : 'bg-white text-gray-700 border-[#DDD3BF] hover:border-[#9E7422]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Move to Bag Button */}
                <div className="pt-2">
                  <button
                    disabled={isOutOfStock}
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#121212] hover:bg-[#2C2416] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C59A45]" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
