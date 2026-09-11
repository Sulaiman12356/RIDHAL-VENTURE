import React, { useState } from 'react';
import {
  ChevronRight,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Check,
  ArrowRight,
  Minus,
  Plus,
  Share2
} from 'lucide-react';
import { Product, ActivePage } from '../types';
import { PRODUCTS, formatNaira } from '../data/products';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailViewProps {
  product: Product;
  onNavigate: (page: ActivePage) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryName: string) => void;
  products?: Product[];
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onNavigate,
  onSelectProduct,
  onSelectCategory,
  products
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping' | 'returns'>('description');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  // Related products from the actual inventory (including uploaded photos)
  const catalogSource = products && products.length > 0 ? products : PRODUCTS;
  const relatedProducts = catalogSource.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    setValidationError(null);
    if (product.sizes.length > 0 && !selectedSize) {
      setValidationError('Please select a size before adding to cart.');
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      setValidationError('Please select a color before adding to cart.');
      return;
    }
    if (quantity > product.stock) {
      setValidationError(`Only ${product.stock} items currently in stock.`);
      return;
    }

    const success = addToCart(product, quantity, selectedSize, selectedColor);
    if (success) {
      setIsAddedSuccess(true);
      setTimeout(() => setIsAddedSuccess(false), 3000);
    }
  };

  const handleBuyNow = () => {
    setValidationError(null);
    if (product.sizes.length > 0 && !selectedSize) {
      setValidationError('Please select a size before proceeding.');
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      setValidationError('Please select a color before proceeding.');
      return;
    }
    const success = addToCart(product, quantity, selectedSize, selectedColor);
    if (success) {
      onNavigate('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | Ridhal Ventures`,
        text: product.shortDescription,
        url: window.location.href
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-12">
      
      {/* 1. BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap pb-2">
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-[#9E7422] transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <button
          onClick={() => onNavigate('shop')}
          className="hover:text-[#9E7422] transition-colors"
        >
          Shop
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <button
          onClick={() => {
            onSelectCategory(product.category);
            onNavigate('shop');
          }}
          className="hover:text-[#9E7422] transition-colors"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span className="text-[#121212] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout: Gallery (Left) + Information (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* 2. PRODUCT GALLERY (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image Container */}
          <div className="relative aspect-square w-full rounded-2xl bg-white border border-[#E8DFC8] overflow-hidden shadow-xs">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md backdrop-blur-xs transition-colors ${
                isWishlisted
                  ? 'bg-white text-red-600'
                  : 'bg-white/90 text-gray-700 hover:text-red-500'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Stock badge */}
            {product.stock > 0 && product.stock <= 4 && (
              <span className="absolute top-4 left-4 bg-[#111111]/85 backdrop-blur-xs text-[#E7CF9B] text-xs font-semibold px-3 py-1 rounded-sm">
                Limited Stock: Only {product.stock} available
              </span>
            )}
          </div>

          {/* Thumbnail Strip (if multiple images) */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                    selectedImageIndex === idx
                      ? 'border-[#9E7422] shadow-xs scale-102'
                      : 'border-[#E8DFC8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E8DFC8] text-xs text-gray-700">
              <Truck className="w-4 h-4 text-[#9E7422] flex-shrink-0" />
              <span>Nationwide Nigeria delivery available</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E8DFC8] text-xs text-gray-700">
              <ShieldCheck className="w-4 h-4 text-[#9E7422] flex-shrink-0" />
              <span>Authentic Ridhal Ventures guarantee</span>
            </div>
          </div>
        </div>

        {/* 3. PRODUCT INFORMATION (Col 6) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header & Category */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E7422]">
                {product.category} • {product.subcategory}
              </span>
              <button
                onClick={handleShare}
                className="text-gray-500 hover:text-black p-1 text-xs flex items-center gap-1 font-semibold transition-colors"
                title="Share product link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" /> Share
                  </>
                )}
              </button>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111] mt-1.5 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-[#E8DFC8]">
            <span className="font-serif-luxury text-3xl font-extrabold text-[#111]">
              {formatNaira(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-base text-gray-400 line-through">
                {formatNaira(product.compareAtPrice)}
              </span>
            )}
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-[#FAF2DC] text-[#8C6316] border border-[#DFC377]">
              Official Price
            </span>
          </div>

          {/* Short Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-gray-800">
                  Select Size / Dimension:
                </span>
                <span className="text-[#9E7422] font-semibold">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(sz);
                      setValidationError(null);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                      selectedSize === sz
                        ? 'bg-[#121212] text-white border-[#121212] shadow-xs'
                        : 'bg-white text-gray-800 border-[#E8DFC8] hover:border-[#9E7422]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-gray-800">
                  Available Shades / Styles:
                </span>
                <span className="text-[#9E7422] font-semibold">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((clr) => (
                  <button
                    key={clr}
                    onClick={() => {
                      setSelectedColor(clr);
                      setValidationError(null);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                      selectedColor === clr
                        ? 'bg-[#FAF2DC] text-[#8C6316] border-[#DFC377] font-bold ring-1 ring-[#DFC377]'
                        : 'bg-white text-gray-800 border-[#E8DFC8] hover:border-[#9E7422]'
                    }`}
                  >
                    {clr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock availability indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-gray-700">Stock Status:</span>
            {isOutOfStock ? (
              <span className="text-red-600 font-bold">Currently Out of Stock</span>
            ) : product.stock <= 4 ? (
              <span className="text-amber-700 font-semibold">Low stock ({product.stock} units remaining)</span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In stock ({product.stock} available in Ijebu-Ode)
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800 block">
              Quantity:
            </span>
            <div className="inline-flex items-center rounded-lg border border-[#E8DFC8] bg-white p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="p-2 text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-bold text-[#121212]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
                className="p-2 text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Validation error message */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {validationError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {/* Add to Cart */}
            <button
              id="product-detail-add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-xs ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isAddedSuccess
                  ? 'bg-[#188038] text-white'
                  : 'bg-[#9E7422] hover:bg-[#85611B] text-white'
              }`}
            >
              {isAddedSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Added to Shopping Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>

            {/* Buy Now */}
            <button
              id="product-detail-buy-now-btn"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-xs bg-[#121212] hover:bg-[#2C2416] text-white border border-[#C59A45]/50 transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Confirmation Notice */}
          {isAddedSuccess && (
            <div className="p-3.5 rounded-xl bg-[#FAF2DC] border border-[#DFC377] flex items-center justify-between text-xs text-[#8C6316]">
              <span>Item added to your bag. Ready to complete your order?</span>
              <button
                onClick={() => onNavigate('cart')}
                className="font-bold underline hover:text-black ml-2"
              >
                View Cart
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 6. PRODUCT INFORMATION TABS */}
      <div className="pt-6 border-t border-[#E8DFC8]">
        <div className="flex border-b border-[#E8DFC8] gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'description'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Product Details & Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Shipping Information
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'returns'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Returns & Exchanges Policy
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="py-6 text-sm text-gray-700 leading-relaxed">
          {activeTab === 'description' && (
            <div className="max-w-3xl space-y-4">
              <p>{product.description}</p>
              <p className="text-xs text-gray-500 italic">
                Sourced and curated directly by Ridhal Ventures, Ijebu-Ode, Ogun State. Every piece is inspected for fabric integrity, modest styling, and elegant wearability.
              </p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="max-w-2xl">
              {product.details && product.details.length > 0 ? (
                <ul className="space-y-2 list-disc list-inside">
                  {product.details.map((d, i) => (
                    <li key={i} className="text-gray-700">{d}</li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-2">
                  <p>Category: {product.category}</p>
                  <p>Subcategory: {product.subcategory}</p>
                  <p>Quality Guarantee: Authentic store merchandise</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-3xl space-y-4">
              <h4 className="font-bold text-gray-900">Delivery Across Nigeria</h4>
              <p>
                Orders are processed and dispatched directly from our store located at <strong>5, Bass street, off idomowo, adjacent to new market police station, Ijebu-Ode, Ogun State</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-white rounded-xl border border-[#E8DFC8]">
                  <strong className="block text-gray-900 mb-1">Ijebu-Ode & Ogun State:</strong>
                  <span className="text-xs text-gray-600">Same-day pickup or 24-hour local dispatch. Standard delivery: ₦2,500.</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8DFC8]">
                  <strong className="block text-gray-900 mb-1">Lagos & South-West:</strong>
                  <span className="text-xs text-gray-600">Dispatched via trusted regional logistics. Standard delivery: ₦3,500.</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8DFC8]">
                  <strong className="block text-gray-900 mb-1">Nationwide Nigeria:</strong>
                  <span className="text-xs text-gray-600">Delivered within 2–4 business days depending on destination state.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="max-w-3xl space-y-3">
              <h4 className="font-bold text-gray-900">Returns & Exchange Terms</h4>
              <p>
                Customer satisfaction is our utmost priority at Ridhal Ventures. In the unlikely event that an item is received damaged or in the wrong size, please contact us within 48 hours of delivery.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                <li>Items must remain unworn, unwashed, with all original tags and intact packaging.</li>
                <li>For hygiene reasons, intimate apparel, unsealed prayer items, and earrings cannot be returned once delivered.</li>
                <li>To initiate an exchange, message our customer support team directly at <strong>09165317293</strong> or email <strong>alhajabizventure@gmail.com</strong>.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 7. RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-[#E8DFC8] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#111]">
              Related Products in {product.category}
            </h2>
            <button
              onClick={() => {
                onSelectCategory(product.category);
                onNavigate('shop');
              }}
              className="text-xs font-bold uppercase tracking-wider text-[#9E7422] hover:underline"
            >
              View Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
