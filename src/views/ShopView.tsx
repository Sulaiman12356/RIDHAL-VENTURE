import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS, formatNaira } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface ShopViewProps {
  initialCategory?: string;
  onViewProduct: (product: Product) => void;
  products?: Product[];
  categories?: any[];
}

type SortOption = 'newest' | 'price-asc' | 'price-desc';

export const ShopView: React.FC<ShopViewProps> = ({
  initialCategory = 'All',
  onViewProduct,
  products = PRODUCTS,
  categories = CATEGORIES
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [priceMax, setPriceMax] = useState<number>(60000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // Synchronize when initialCategory changes from parent
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setSelectedSubcategory('All');
    }
  }, [initialCategory]);

  // Find subcategories for current category
  const activeCategoryObj = useMemo(() => {
    return categories.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory, categories]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category match
      if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Subcategory match
      if (selectedSubcategory !== 'All' && product.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesSub = product.subcategory.toLowerCase().includes(q);
        const matchesDesc = (product.shortDescription || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesSub && !matchesDesc) {
          return false;
        }
      }
      // Price range
      if (product.price > priceMax) {
        return false;
      }
      // In stock
      if (onlyInStock && product.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      // Newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, sortOption, priceMax, onlyInStock]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSearchQuery('');
    setSortOption('newest');
    setPriceMax(60000);
    setOnlyInStock(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSubcategory !== 'All' ||
    searchQuery.trim() !== '' ||
    priceMax < 60000 ||
    onlyInStock;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* 1. PAGE HEADING */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
        <span className="text-xs uppercase tracking-widest text-[#9E7422] font-bold">
          The Official Boutique Catalog
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111] mt-2">
          Shop Ridhal Ventures
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-xl mx-auto leading-relaxed">
          Discover modest fashion, Islamic essentials, and timeless accessories for every occasion.
        </p>
        <div className="w-16 h-0.5 bg-[#C59A45] mx-auto mt-4 rounded-full" />
      </div>

      {/* Main Container: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* DESKTOP FILTERS SIDEBAR (Col 3) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-2xs sticky top-28 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#9E7422]" />
              <h2 className="font-serif-luxury text-base font-bold text-[#111]">Filters</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#9E7422] hover:text-[#6E4F14] font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSubcategory('All');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategory === 'All'
                    ? 'bg-[#FAF2DC] text-[#8C6316] font-bold'
                    : 'text-gray-600 hover:bg-[#FAF8F5]'
                }`}
              >
                <span>All Departments</span>
                <span className="text-[11px] opacity-75">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedSubcategory('All');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FAF2DC] text-[#8C6316] font-bold'
                        : 'text-gray-600 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories (if a category is active) */}
          {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#F2ECE0]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                {activeCategoryObj.name} Types
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedSubcategory('All')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                    selectedSubcategory === 'All'
                      ? 'text-[#9E7422] font-bold'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  • All {activeCategoryObj.name}
                </button>
                {activeCategoryObj.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                      selectedSubcategory === sub
                        ? 'text-[#9E7422] font-bold'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    • {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="space-y-3 pt-3 border-t border-[#F2ECE0]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider text-gray-700">Max Price</span>
              <span className="font-bold text-[#9E7422]">{formatNaira(priceMax)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="60000"
              step="2500"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#9E7422] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>₦5,000</span>
              <span>₦60,000</span>
            </div>
          </div>

          {/* Stock availability */}
          <div className="pt-3 border-t border-[#F2ECE0]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-[#9E7422] focus:ring-[#9E7422]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS AREA (Col 9) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar: Search, Mobile Filter trigger, Sort */}
          <div className="bg-white p-4 rounded-xl border border-[#E8DFC8] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Search within store */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products in this view..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Trigger + Sort dropdown */}
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E8DFC8] text-xs font-semibold text-gray-800 flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#9E7422]" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              {/* Sort By Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline text-gray-500 font-medium">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="appearance-none bg-[#FAF8F5] border border-[#E8DFC8] text-gray-800 py-2 pl-3 pr-8 rounded-lg font-semibold focus:outline-none focus:border-[#9E7422] cursor-pointer text-xs"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Chips Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-gray-500 font-semibold">Active:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#FAF2DC] text-[#8C6316] font-semibold border border-[#DFC377]">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSubcategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#FAF2DC] text-[#8C6316] font-semibold border border-[#DFC377]">
                  Type: {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory('All')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white text-gray-800 border border-gray-300">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#9E7422] hover:underline font-semibold ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Count Header */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing <strong className="text-gray-900">{filteredProducts.length}</strong> product
              {filteredProducts.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewProduct}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-[#E8DFC8] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border border-[#E8DFC8] flex items-center justify-center mx-auto text-[#9E7422]">
                <Search className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#111]">
                No matching items found
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any products matching your current search or filter combination.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#9E7422] hover:bg-[#85611B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden flex justify-end"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="w-4/5 max-w-xs bg-[#FAF8F5] h-full p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#9E7422]" />
                  <h3 className="font-serif-luxury font-bold text-base text-[#111]">Filter Products</h3>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</span>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedSubcategory('All');
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs ${
                      selectedCategory === 'All' ? 'bg-[#FAF2DC] text-[#8C6316] font-bold' : 'text-gray-600'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedSubcategory('All');
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs ${
                        selectedCategory === cat.name
                          ? 'bg-[#FAF2DC] text-[#8C6316] font-bold'
                          : 'text-gray-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price slider */}
              <div className="space-y-2 pt-2 border-t border-[#E8DFC8]">
                <div className="flex justify-between text-xs font-bold">
                  <span>Max Price:</span>
                  <span className="text-[#9E7422]">{formatNaira(priceMax)}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="60000"
                  step="2500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#9E7422]"
                />
              </div>

              {/* In stock */}
              <div className="pt-2 border-t border-[#E8DFC8]">
                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-[#9E7422]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8DFC8] flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-lg border border-[#DDD3BF] text-xs font-bold uppercase text-gray-700 hover:bg-gray-100"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-[#9E7422] text-white text-xs font-bold uppercase tracking-wider"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
