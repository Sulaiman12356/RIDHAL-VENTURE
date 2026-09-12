import React, { useState, useMemo } from 'react';
import { ArrowRight, ShieldCheck, Gem, Headphones, Truck, Sparkles, Star, Flame, BookOpen } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { Product, ActivePage } from '../types';
import heroImg from '../assets/images/hero_banner_1789167622411.jpg';
import { handleImageError } from '../utils/imageUtils';

interface HomeViewProps {
  onNavigate: (page: ActivePage) => void;
  onSelectCategory: (categoryName: string) => void;
  onViewProduct: (product: Product) => void;
  products?: Product[];
  categories?: any[];
}

const FILTER_TABS = [
  'All',
  'Jalab & Abaya',
  'Scarfs & Hijabs',
  'Quran & Islamic Essentials',
  'English Dresses',
  'Jewelries',
  'Shoes & Bags',
  'Wrist Watches',
  'Singlet & Boxers'
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectCategory,
  onViewProduct,
  products = PRODUCTS,
  categories = CATEGORIES
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [displayLimit, setDisplayLimit] = useState<number>(8);

  // Filtered products for main showcase
  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'All') {
      return products;
    }
    return products.filter((p) => p.category === selectedFilter);
  }, [products, selectedFilter]);

  // New arrivals / trending items (latest added)
  const newArrivals = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 4);
  }, [products]);

  // Islamic Essentials & Jummah / Ramadan specials
  const islamicEssentials = useMemo(() => {
    return products.filter((p) => p.category === 'Quran & Islamic Essentials').slice(0, 4);
  }, [products]);

  return (
    <div className="space-y-14 md:space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section id="hero-section" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 md:pt-8">
        <div className="relative rounded-3xl bg-[#FAF6EE] border border-[#E8DFC8] overflow-hidden shadow-xs">
          {/* Subtle background golden glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#EBD8A9]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#DFC377]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            
            {/* Left Column: Typography and Call to Actions */}
            <div className="lg:col-span-6 space-y-6 z-10 text-center lg:text-left">
              {/* Brand Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#DFC377] text-xs font-semibold tracking-widest uppercase text-[#9E7422]">
                <span>✦</span>
                <span>RIDHAL VENTURES</span>
                <span>✦</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.12]">
                Style for Every Occasion
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-base sm:text-lg text-[#554D40] leading-relaxed max-w-xl mx-auto lg:mx-0">
                Your one-stop boutique in Ijebu-Ode for luxury modest fashion, Islamic essentials, Turkish gowns, watches, and accessories.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-shop-collection-btn"
                  onClick={() => onNavigate('shop')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#9E7422] hover:bg-[#85611B] text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-explore-categories-btn"
                  onClick={() => {
                    const el = document.getElementById('categories-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-[#F2ECE0] text-[#121212] border border-[#DDD3BF] text-sm font-bold uppercase tracking-wider transition-colors shadow-2xs"
                >
                  Explore Categories
                </button>
              </div>

              {/* Modest Fashion / Timeless Elegance tag */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[11px] sm:text-xs tracking-wider uppercase text-[#8C6316] font-semibold">
                <span>Modest Fashion</span>
                <span className="text-[#C59A45]">•</span>
                <span>Islamic Essentials</span>
                <span className="text-[#C59A45]">•</span>
                <span>Timeless Elegance</span>
              </div>
            </div>

            {/* Right Column: Hero Visual with Arched Frame matching prototype */}
            <div className="lg:col-span-6 flex justify-center z-10">
              <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/5] rounded-t-[120px] rounded-b-2xl border-4 border-[#DFC377] p-2 bg-[#F3EDE0] shadow-xl overflow-hidden group">
                <div className="w-full h-full rounded-t-[112px] rounded-b-xl overflow-hidden relative">
                  <img
                    src={heroImg}
                    alt="Elegant Nigerian woman in black luxury abaya with gold embroidery"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, 'Jalab & Abaya')}
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700"
                  />
                  {/* Luxury Corner Badge */}
                  <div className="absolute top-6 right-6 bg-[#0E0E0E]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C59A45]/40 text-center shadow-lg">
                    <span className="font-serif-luxury italic text-xs text-[#E7CF9B] font-medium block">
                      Modest Fashion
                    </span>
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-white/90">
                      Timeless Elegance
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORIES SECTION */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <span className="text-xs uppercase tracking-widest text-[#9E7422] font-bold">
            Curated Department Collections
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-extrabold text-[#111] mt-1">
            Shop by Categories
          </h2>
          <div className="w-16 h-0.5 bg-[#C59A45] mx-auto mt-3 rounded-full" />
        </div>

        {/* 8-Card Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 md:gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onSelect={onSelectCategory}
            />
          ))}
        </div>
      </section>

      {/* 3. MAIN PRODUCT SHOWCASE (With Filter Tabs & Expanded Grid) */}
      <section id="featured-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-3 border-b border-[#E8DFC8]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9E7422]" />
              <span className="text-xs uppercase tracking-widest text-[#9E7422] font-bold">
                Luxury Collection & Popular Picks
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111] mt-1">
              Explore Our Products
            </h2>
          </div>

          <button
            id="featured-view-all-link"
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#9E7422] hover:text-[#7A5714] transition-colors group"
          >
            <span>View Full Shop ({products.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {FILTER_TABS.map((tab) => {
            const isSelected = selectedFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setSelectedFilter(tab);
                  setDisplayLimit(8);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 uppercase tracking-wider ${
                  isSelected
                    ? 'bg-[#121212] text-[#E7CF9B] border border-[#DFC377] shadow-xs'
                    : 'bg-white text-[#554D40] border border-[#E8DFC8] hover:border-[#9E7422] hover:bg-[#FAF6EE]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Products Grid: Displays 8 to 16+ products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, displayLimit).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewProduct}
            />
          ))}
        </div>

        {/* Action button if more products exist in this category */}
        {filteredProducts.length > displayLimit && (
          <div className="text-center pt-10">
            <button
              onClick={() => setDisplayLimit((prev) => prev + 8)}
              className="px-8 py-3 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#121212] border-2 border-[#DFC377] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs inline-flex items-center gap-2"
            >
              <span>Show More Products ({filteredProducts.length - displayLimit} remaining)</span>
            </button>
          </div>
        )}
      </section>

      {/* 4. NEW ARRIVALS & TRENDING THIS WEEK */}
      {newArrivals.length > 0 && (
        <section id="new-arrivals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#171717] via-[#121212] to-[#242018] text-white border border-[#DFC377]/40 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#DFC377] font-bold">
                  <Flame className="w-4 h-4 text-[#DFC377]" />
                  <span>Fresh In Store</span>
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FAF8F5] mt-1">
                  Trending New Arrivals
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                  Discover the newest modest dresses, Dubai open abayas, tailored Moroccan jalabs, and accessories.
                </p>
              </div>

              <button
                onClick={() => onNavigate('shop')}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#DFC377] hover:text-[#F3E2B8] transition-colors"
              >
                <span>Explore All New Styles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. JUMMAH & RAMADAN / ISLAMIC ESSENTIALS SPOTLIGHT */}
      {islamicEssentials.length > 0 && (
        <section id="islamic-essentials-spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-3 border-b border-[#E8DFC8]">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#9E7422]" />
                <span className="text-xs uppercase tracking-widest text-[#9E7422] font-bold">
                  Spiritual & Prayer Essentials
                </span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111] mt-1">
                Quran & Prayer Collection
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Archival Arabic Qurans with Tajweed, orthopedic memory foam prayer mats, digital tasbih counters, and travel sets.
              </p>
            </div>

            <button
              onClick={() => onSelectCategory('Quran & Islamic Essentials')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#9E7422] hover:text-[#7A5714] transition-colors group"
            >
              <span>View All Islamic Items</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {islamicEssentials.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. WHY SHOP WITH US */}
      <section id="why-shop-with-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DFC8] p-8 md:p-12 shadow-2xs">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#111]">
              Why Shop With Us?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Dedicated to delivering excellence in every stitch, fold, and delivery box.
            </p>
            <div className="w-12 h-0.5 bg-[#C59A45] mx-auto mt-2 rounded-full" />
          </div>

          {/* 4 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* 1. Quality Selection */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#121212] border-2 border-[#C59A45] flex items-center justify-center text-[#E7CF9B] shadow-sm">
                <ShieldCheck className="w-6 h-6 text-[#DFC377]" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#111]">
                Quality Selection
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Premium products you can trust.
              </p>
            </div>

            {/* 2. Affordable Luxury */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#121212] border-2 border-[#C59A45] flex items-center justify-center text-[#E7CF9B] shadow-sm">
                <Gem className="w-6 h-6 text-[#DFC377]" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#111]">
                Affordable Luxury
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Get the best quality at great prices.
              </p>
            </div>

            {/* 3. Customer Support */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#121212] border-2 border-[#C59A45] flex items-center justify-center text-[#E7CF9B] shadow-sm">
                <Headphones className="w-6 h-6 text-[#DFC377]" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#111]">
                Customer Support
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We&apos;re always here to help you.
              </p>
            </div>

            {/* 4. Delivery in Nigeria */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#121212] border-2 border-[#C59A45] flex items-center justify-center text-[#E7CF9B] shadow-sm">
                <Truck className="w-6 h-6 text-[#DFC377]" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#111]">
                Delivery in Nigeria
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fast, reliable and nationwide delivery.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
