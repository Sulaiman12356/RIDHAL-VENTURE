import abayaImg from '../assets/images/abaya_product_1789167636274.jpg';
import scarfImg from '../assets/images/scarf_product_1789167648823.jpg';
import quranImg from '../assets/images/quran_product_1789167661627.jpg';
import watchImg from '../assets/images/watch_product_1789167673770.jpg';
import jewelryImg from '../assets/images/jewelry_cat_1789167685812.jpg';
import bagsShoesImg from '../assets/images/bags_shoes_cat_1789167699845.jpg';
import dressImg from '../assets/images/dress_cat_1789167711955.jpg';
import mensWearImg from '../assets/images/mens_wear_cat_1789167725241.jpg';

// Thematic high-reliability CDN fallback images
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Jalab & Abaya': abayaImg || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  'Scarfs & Hijabs': scarfImg || 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
  'Quran & Islamic Essentials': quranImg || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
  'English Dresses': dressImg || 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80',
  'Jewelries': jewelryImg || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  'Shoes & Bags': bagsShoesImg || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
  'Wrist Watches': watchImg || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
  'Singlet & Boxers': mensWearImg || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
};

export const DEFAULT_FALLBACK_IMAGE = abayaImg || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80';

/**
 * Returns a guaranteed valid image URL for any product
 */
export function getProductImage(product?: { images?: string[]; category?: string } | null): string {
  if (!product) return DEFAULT_FALLBACK_IMAGE;

  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    if (firstImg && typeof firstImg === 'string' && firstImg.trim().length > 0 && !firstImg.includes('undefined')) {
      return firstImg;
    }
  }

  if (product.category && CATEGORY_FALLBACK_IMAGES[product.category]) {
    return CATEGORY_FALLBACK_IMAGES[product.category];
  }

  return DEFAULT_FALLBACK_IMAGE;
}

/**
 * Gracefully replaces broken images with category-matching fallback
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>, categoryName?: string) {
  const target = e.currentTarget;
  target.onerror = null; // Prevent infinite onError trigger
  const fallback = (categoryName && CATEGORY_FALLBACK_IMAGES[categoryName]) || DEFAULT_FALLBACK_IMAGE;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
