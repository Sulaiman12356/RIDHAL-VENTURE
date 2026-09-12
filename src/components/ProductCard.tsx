import React from 'react';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { formatNaira } from '../data/products';
import { useCart } from '../context/CartContext';
import { getProductImage, handleImageError } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const [justAdded, setJustAdded] = React.useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first available size and color
    const defaultSize = product.sizes.length > 0 ? product.sizes[0] : undefined;
    const defaultColor = product.colors.length > 0 ? product.colors[0] : undefined;
    const success = addToCart(product, 1, defaultSize, defaultColor);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-xl border border-[#E8DFC8] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-[#F6F2EA] overflow-hidden">
        <img
          src={getProductImage(product)}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onError={(e) => handleImageError(e, product.category)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          id={`wishlist-btn-${product.id}`}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
            isWishlisted
              ? 'bg-white text-red-600'
              : 'bg-white/80 text-gray-700 hover:text-red-500 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Stock status badge if low stock */}
        {product.stock <= 4 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-[#111111]/85 backdrop-blur-xs text-[#E7CF9B] text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-sm">
            Only {product.stock} left
          </span>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-[#121212] text-white text-xs font-semibold px-3 py-1 rounded-sm uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Overlay on Hover (Desktop) */}
        <div className="hidden md:flex absolute inset-x-0 bottom-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="bg-[#121212]/80 backdrop-blur-xs text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9E7422]">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif-luxury text-base font-bold text-[#121212] group-hover:text-[#9E7422] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Add to Cart Section */}
        <div className="pt-4 border-t border-[#F2ECE0] mt-3">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base md:text-lg font-bold text-[#121212]">
              {formatNaira(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatNaira(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            id={`add-to-cart-${product.id}`}
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : justAdded
                ? 'bg-[#188038] text-white'
                : 'bg-[#9E7422] hover:bg-[#85611B] text-white shadow-xs'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
