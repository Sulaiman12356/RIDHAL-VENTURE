import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Check,
  Minus,
  Plus,
  Share2,
  Star,
  MessageSquare,
  Sparkles,
  HelpCircle,
  X,
  PackagePlus,
  Eye
} from 'lucide-react';
import { Product, ActivePage } from '../types';
import { PRODUCTS, formatNaira } from '../data/products';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { getProductReviews, submitProductReview, ProductReview } from '../services/reviewService';

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
  const { addToCart, toggleWishlist, isInWishlist, recentlyViewed, addRecentlyViewed } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews' | 'shipping' | 'returns'>('description');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  // Track recently viewed
  useEffect(() => {
    if (product.id) {
      addRecentlyViewed(product.id);
    }
  }, [product.id, addRecentlyViewed]);

  // Load reviews from Firestore
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const revs = await getProductReviews(product.id);
        setReviews(revs);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [product.id]);

  const catalogSource = products && products.length > 0 ? products : PRODUCTS;

  // Related products
  const relatedProducts = catalogSource
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Recently viewed products
  const recentlyViewedProducts = catalogSource
    .filter((p) => recentlyViewed.includes(p.id) && p.id !== product.id)
    .slice(0, 4);

  // Product bundle suggestion
  const bundleCandidate = catalogSource.find(
    (p) => p.id !== product.id && (p.category === 'Shoes & Accessories' || p.category === 'Islamic Essentials' || p.category === product.category)
  );

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

  const handleAddBundle = () => {
    if (!bundleCandidate) return;
    addToCart(product, 1, selectedSize || product.sizes[0], selectedColor || product.colors[0]);
    addToCart(bundleCandidate, 1, bundleCandidate.sizes[0] || '', bundleCandidate.colors[0] || '');
    setIsAddedSuccess(true);
    setTimeout(() => setIsAddedSuccess(false), 3000);
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const newReview = await submitProductReview({
        productId: product.id,
        customerName: reviewAuthor.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        verifiedBuyer: true
      });
      setReviews(prev => [newReview, ...prev]);
      setReviewAuthor('');
      setReviewComment('');
      setShowReviewForm(false);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating?.toFixed(1) || '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-12">
      
      {/* 1. BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#736B63] overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => onNavigate('home')} className="hover:text-[#9E7422] transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <button onClick={() => onNavigate('shop')} className="hover:text-[#9E7422] transition-colors">Shop</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <button
          onClick={() => {
            onSelectCategory(product.category);
            onNavigate('shop');
          }}
          className="hover:text-[#9E7422] transition-colors"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-[#121212] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout: Gallery (Left) + Information (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* 2. PRODUCT GALLERY (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-white border border-[#E5DFD5] overflow-hidden shadow-xs">
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
              <span className="absolute top-4 left-4 bg-[#121212]/90 backdrop-blur-xs text-[#DFC377] text-xs font-semibold px-3 py-1 rounded-sm">
                Limited Stock: Only {product.stock} available
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    selectedImageIndex === idx
                      ? 'border-[#9E7422] shadow-xs scale-102'
                      : 'border-[#E5DFD5] opacity-70 hover:opacity-100'
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
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E5DFD5] text-xs text-[#736B63]">
              <Truck className="w-4 h-4 text-[#9E7422] shrink-0" />
              <span>Same-day Ijebu-Ode delivery & nationwide transit</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E5DFD5] text-xs text-[#736B63]">
              <ShieldCheck className="w-4 h-4 text-[#9E7422] shrink-0" />
              <span>100% Authentic Ridhal Ventures quality</span>
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
                className="text-[#736B63] hover:text-[#121212] p-1 text-xs flex items-center gap-1 font-semibold transition-colors"
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
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#121212] mt-1.5 leading-tight">
              {product.name}
            </h1>

            {/* Ratings overview */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(Number(avgRating)) ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#121212]">{avgRating}</span>
              <span className="text-xs text-[#736B63]">
                ({reviews.length > 0 ? `${reviews.length} reviews` : 'Verified boutique rating'})
              </span>
            </div>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-[#E5DFD5]">
            <span className="font-serif text-3xl font-extrabold text-[#121212]">
              {formatNaira(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-base text-gray-400 line-through">
                {formatNaira(product.compareAtPrice)}
              </span>
            )}
            {product.stock > 0 ? (
              <span className="ml-auto text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                In Stock ({product.stock} units)
              </span>
            ) : (
              <span className="ml-auto text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                Sold Out
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-sm text-[#736B63] leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Sizing & Sizing Guide modal trigger */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#121212]">
                  Select Size: <span className="text-[#9E7422]">{selectedSize || 'Choose'}</span>
                </span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-[#9E7422] hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                      selectedSize === sz
                        ? 'border-[#9E7422] bg-[#F6F2EA] text-[#9E7422] font-bold shadow-xs'
                        : 'border-[#E5DFD5] bg-white text-[#121212] hover:border-[#9E7422]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#121212]">
                Color Tone: <span className="text-[#9E7422]">{selectedColor || 'Choose'}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                      selectedColor === col
                        ? 'border-[#9E7422] bg-[#F6F2EA] text-[#9E7422] font-bold shadow-xs'
                        : 'border-[#E5DFD5] bg-white text-[#121212] hover:border-[#9E7422]'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#121212]">Quantity</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E5DFD5] rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 text-[#736B63] hover:text-[#121212] disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-[#121212]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2.5 text-[#736B63] hover:text-[#121212] disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-[#736B63]">
                Total: <strong className="text-[#121212]">{formatNaira(product.price * quantity)}</strong>
              </span>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {validationError}
            </div>
          )}

          {/* Success banner */}
          {isAddedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Added to your shopping cart!
              </span>
              <button
                onClick={() => onNavigate('cart')}
                className="underline font-bold text-emerald-900 ml-2"
              >
                View Cart
              </button>
            </div>
          )}

          {/* Action buttons: Add to Bag & Buy Now */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-6 rounded-lg bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-[#DFC377]" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-6 rounded-lg bg-[#9E7422] hover:bg-[#835E17] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 shadow-xs"
            >
              Proceed to Instant Checkout
            </button>
          </div>

          {/* Frequently Bought Together Bundle Card */}
          {bundleCandidate && (
            <div className="p-4 bg-[#F6F2EA] border border-[#DFC377] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#9E7422] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Modest Pairing Bundle
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Save 10%
                </span>
              </div>
              <p className="text-xs text-[#736B63]">
                Pair this item with <strong>{bundleCandidate.name}</strong> for a complete modest occasion outfit.
              </p>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs text-[#736B63] block">Bundle Total:</span>
                  <span className="text-sm font-bold text-[#121212]">
                    {formatNaira(Math.round((product.price + bundleCandidate.price) * 0.9))}
                  </span>
                  <span className="text-[10px] text-gray-400 line-through ml-1.5">
                    {formatNaira(product.price + bundleCandidate.price)}
                  </span>
                </div>
                <button
                  onClick={handleAddBundle}
                  className="px-3.5 py-2 bg-[#121212] hover:bg-[#262626] text-[#DFC377] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <PackagePlus className="w-3.5 h-3.5" />
                  Add Both to Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. TABS: Description, Details, Reviews, Shipping, Returns */}
      <div className="pt-8 border-t border-[#E5DFD5]">
        <div className="flex border-b border-[#E5DFD5] gap-4 sm:gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'description'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-[#736B63] hover:text-[#121212]'
            }`}
          >
            Description & Sourcing
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-[#736B63] hover:text-[#121212]'
            }`}
          >
            Fabric & Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-[#736B63] hover:text-[#121212]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Customer Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-[#736B63] hover:text-[#121212]'
            }`}
          >
            Shipping & Dispatch
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'returns'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-[#736B63] hover:text-[#121212]'
            }`}
          >
            Returns Policy
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="py-6 text-sm text-[#736B63] leading-relaxed">
          {activeTab === 'description' && (
            <div className="max-w-3xl space-y-4">
              <p>{product.description}</p>
              <p className="text-xs text-[#736B63] italic">
                Directly curated and verified by Ridhal Ventures, Ijebu-Ode showroom. Inspected for stitching precision, color fastness, and modesty wear standards.
              </p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="max-w-2xl">
              {product.details && product.details.length > 0 ? (
                <ul className="space-y-2 list-disc list-inside">
                  {product.details.map((d, i) => (
                    <li key={i} className="text-[#121212]">{d}</li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-2">
                  <p>Category: <strong className="text-[#121212]">{product.category}</strong></p>
                  <p>Subcategory: <strong className="text-[#121212]">{product.subcategory}</strong></p>
                  <p>Quality Guarantee: Authentic store merchandise</p>
                </div>
              )}
            </div>
          )}

          {/* CUSTOMER REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DFD5]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-serif font-extrabold text-[#121212]">{avgRating}</span>
                    <div>
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= Math.round(Number(avgRating)) ? 'fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[#736B63]">Based on {reviews.length} authentic customer ratings</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-[#9E7422] text-white rounded-lg text-xs font-semibold hover:bg-[#835E17] transition-colors self-start sm:self-auto"
                >
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </button>
              </div>

              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                  Thank you! Your verified review has been published.
                </div>
              )}

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="bg-white p-5 rounded-xl border border-[#DFC377] space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Share Your Experience</h4>
                  
                  {/* Rating Selector */}
                  <div>
                    <label className="text-xs text-[#736B63] block mb-1">Your Rating</label>
                    <div className="flex gap-1.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${s <= reviewRating ? 'fill-current' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#736B63] block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Hajia Fatima or Brother Ibrahim"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-xs text-[#121212] focus:outline-none focus:border-[#9E7422]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#736B63] block mb-1">Your Review & Fabric Feedback</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="How did the Jalab or piece fit? What do you think about the fabric quality?"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-xs text-[#121212] focus:outline-none focus:border-[#9E7422]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 bg-[#121212] hover:bg-[#262626] text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-[#736B63] italic">
                    Be the first to review this product! Click &ldquo;Write a Review&rdquo; above.
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-white border border-[#E5DFD5] rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#121212]">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <div className="flex text-amber-500 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= rev.rating ? 'fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-[11px] text-[#736B63]">
                          {new Date(rev.createdAt).toLocaleDateString('en-NG')}
                        </span>
                      </div>
                      <p className="text-xs text-[#736B63]">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-3xl space-y-4">
              <h4 className="font-bold text-[#121212]">Ijebu-Ode & Nationwide Delivery Rates</h4>
              <p>
                Dispatched directly from our store at <strong>5, Bass street, off idomowo, adjacent to new market police station, Ijebu-Ode, Ogun State</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-white rounded-xl border border-[#E5DFD5]">
                  <strong className="block text-[#121212] mb-1">Ijebu-Ode Metropolis:</strong>
                  <span className="text-xs text-[#736B63]">Same-day delivery or free store pickup. Standard: ₦1,500 - ₦2,000.</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E5DFD5]">
                  <strong className="block text-[#121212] mb-1">Ogun State & Lagos:</strong>
                  <span className="text-xs text-[#736B63]">1–2 business days via express intrastate transit.</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E5DFD5]">
                  <strong className="block text-[#121212] mb-1">Nationwide Nigeria:</strong>
                  <span className="text-xs text-[#736B63]">2–4 business days with live parcel tracking.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="max-w-3xl space-y-3">
              <h4 className="font-bold text-[#121212]">48-Hour Return & Exchange Policy</h4>
              <p>
                Customer satisfaction is our highest priority at Ridhal Ventures. If an item does not fit or has a manufacturing defect, notify us within 48 hours of delivery.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#736B63]">
                <li>Pieces must remain unworn, unwashed, and with all tags intact.</li>
                <li>WhatsApp our Ijebu-Ode desk at <strong>09165317293</strong> or <strong>08054760134</strong> for quick assistance.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 5. RECENTLY VIEWED PRODUCTS */}
      {recentlyViewedProducts.length > 0 && (
        <div className="pt-8 border-t border-[#E5DFD5] space-y-6">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#9E7422]" />
            <h2 className="font-serif text-2xl font-bold text-[#121212]">
              Recently Viewed
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}

      {/* 6. RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-[#E5DFD5] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#121212]">
              Related Pieces in {product.category}
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

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E5DFD5]">
              <h3 className="font-serif text-lg font-bold text-[#121212]">
                Modest Wear Sizing Guide
              </h3>
              <button onClick={() => setShowSizeGuide(false)} className="p-1 text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-[#736B63]">
              <p>
                Our Abayas and Jalabs follow standard modest length proportions measured in inches from shoulder to hem:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border border-[#E5DFD5]">
                  <thead className="bg-[#FAF8F5] text-[#121212] font-semibold">
                    <tr>
                      <th className="p-2 border-b border-[#E5DFD5]">Size</th>
                      <th className="p-2 border-b border-[#E5DFD5]">Your Height</th>
                      <th className="p-2 border-b border-[#E5DFD5]">Chest / Width</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD5]">
                    <tr>
                      <td className="p-2 font-bold text-[#121212]">Size 52</td>
                      <td className="p-2">5&apos;0&quot; - 5&apos;2&quot;</td>
                      <td className="p-2">Loose modest fit (up to 44&quot;)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[#121212]">Size 54</td>
                      <td className="p-2">5&apos;3&quot; - 5&apos;5&quot;</td>
                      <td className="p-2">Loose modest fit (up to 46&quot;)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[#121212]">Size 56</td>
                      <td className="p-2">5&apos;6&quot; - 5&apos;8&quot;</td>
                      <td className="p-2">Loose modest fit (up to 48&quot;)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[#121212]">Size 58</td>
                      <td className="p-2">5&apos;9&quot; - 6&apos;0&quot;</td>
                      <td className="p-2">Loose modest fit (up to 52&quot;)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-[#F6F2EA] rounded-lg border border-[#DFC377]">
                <p className="font-semibold text-[#121212]">Still unsure of your exact fit?</p>
                <p className="mt-0.5">Send a quick WhatsApp message to our Ijebu-Ode stylists at <strong>09165317293</strong> with your height, and we will recommend the perfect size!</p>
              </div>
            </div>

            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-2.5 bg-[#121212] text-white rounded-lg text-xs font-semibold"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
