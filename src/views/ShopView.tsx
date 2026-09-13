import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  RotateCcw, 
  Check, 
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';
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
  
  // Price range filter
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(65000);
  
  // Attribute filters
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  
  // Mobile drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync category if navigated from external link
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setSelectedSubcategory('All');
    }
  }, [initialCategory]);

  // Extract unique available sizes from products
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.sizes?.forEach((s) => set.add(s.trim()));
    });
    return Array.from(set).sort();
  }, [products]);

  // Extract unique available colors from products
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.colors?.forEach((c) => set.add(c.trim()));
    });
    return Array.from(set).sort();
  }, [products]);

  // Find subcategories for current category
  const activeCategoryObj = useMemo(() => {
    return categories.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory, categories]);

  // Multi-attribute filtering and sorting
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category
      if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // 2. Subcategory
      if (selectedSubcategory !== 'All' && product.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) {
        return false;
      }

      // 3. Search query (matches name, category, subcategory, tags, description)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesSub = product.subcategory.toLowerCase().includes(q);
        const matchesDesc = (product.shortDescription || '').toLowerCase().includes(q) ||
                            (product.description || '').toLowerCase().includes(q);
        const matchesTags = product.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesSub && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // 4. Price range
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // 5. Size
      if (selectedSize !== 'All') {
        const hasSize = product.sizes?.some(s => s.toLowerCase() === selectedSize.toLowerCase());
        if (!hasSize) return false;
      }

      // 6. Color
      if (selectedColor !== 'All') {
        const hasColor = product.colors?.some(c => c.toLowerCase().includes(selectedColor.toLowerCase()));
        if (!hasColor) return false;
      }

      // 7. Stock availability
      if (onlyInStock && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      // 'newest' default
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    products, 
    selectedCategory, 
    selectedSubcategory, 
    searchQuery, 
    sortOption, 
    minPrice, 
    maxPrice, 
    selectedSize, 
    selectedColor, 
    onlyInStock
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSearchQuery('');
    setSortOption('newest');
    setMinPrice(0);
    setMaxPrice(65000);
    setSelectedSize('All');
    setSelectedColor('All');
    setOnlyInStock(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSubcategory !== 'All' ||
    searchQuery.trim() !== '' ||
    minPrice > 0 ||
    maxPrice < 65000 ||
    selectedSize !== 'All' ||
    selectedColor !== 'All' ||
    onlyInStock;

  const activeFiltersCount = [
    selectedCategory !== 'All',
    selectedSubcategory !== 'All',
    searchQuery.trim() !== '',
    minPrice > 0 || maxPrice < 65000,
    selectedSize !== 'All',
    selectedColor !== 'All',
    onlyInStock
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* 1. PAGE HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
        <span className="text-xs uppercase tracking-widest text-[#9E7422] font-bold">
          The Official Boutique Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#121212] mt-2">
          Shop Ridhal Ventures
        </h1>
        <p className="text-sm sm:text-base text-[#736B63] mt-2 max-w-xl mx-auto leading-relaxed">
          Premium Jalabs, Abayas, Modest Wear, and Islamic Essentials for every occasion.
        </p>
        <div className="w-16 h-0.5 bg-[#DFC377] mx-auto mt-4 rounded-full" />
      </div>

      {/* Main Grid: Sidebar (Col 3) + Products (Col 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-2xs sticky top-28 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#9E7422]" />
              <h2 className="font-serif text-base font-bold text-[#121212]">Filters</h2>
              {activeFiltersCount > 0 && (
                <span className="text-[10px] bg-[#9E7422] text-white px-2 py-0.5 rounded-full font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#9E7422] hover:text-[#835E17] font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* 1. Category Filter */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSubcategory('All');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedCategory === 'All'
                    ? 'bg-[#F6F2EA] text-[#9E7422] font-bold border border-[#DFC377]'
                    : 'text-[#736B63] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>All Categories</span>
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
                        ? 'bg-[#F6F2EA] text-[#9E7422] font-bold border border-[#DFC377]'
                        : 'text-[#736B63] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Subcategory Filter */}
          {activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-[#E5DFD5]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212]">
                Subcategory
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedSubcategory('All')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                    selectedSubcategory === 'All'
                      ? 'text-[#9E7422] font-bold'
                      : 'text-[#736B63] hover:text-[#121212]'
                  }`}
                >
                  • All {activeCategoryObj.name}
                </button>
                {activeCategoryObj.subcategories.map((sub: string) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                      selectedSubcategory === sub
                        ? 'text-[#9E7422] font-bold'
                        : 'text-[#736B63] hover:text-[#121212]'
                    }`}
                  >
                    • {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-[#E5DFD5]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider text-[#121212]">Price Range</span>
              <span className="font-bold text-[#9E7422]">{formatNaira(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="65000"
              step="2500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#9E7422] cursor-pointer"
            />
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-[#736B63] block">Min (₦)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2 py-1 bg-[#FAF8F5] border border-[#E5DFD5] rounded text-xs text-[#121212]"
                />
              </div>
              <span className="text-[#736B63] text-xs pt-3">-</span>
              <div className="flex-1">
                <label className="text-[10px] text-[#736B63] block">Max (₦)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-[#FAF8F5] border border-[#E5DFD5] rounded text-xs text-[#121212]"
                />
              </div>
            </div>
          </div>

          {/* 4. Size Filter */}
          <div className="space-y-2 pt-4 border-t border-[#E5DFD5]">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Size</h3>
              {selectedSize !== 'All' && (
                <button
                  onClick={() => setSelectedSize('All')}
                  className="text-[11px] text-[#9E7422] hover:underline"
                >
                  All sizes
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedSize('All')}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  selectedSize === 'All'
                    ? 'bg-[#121212] text-white border-[#121212]'
                    : 'bg-white border-[#E5DFD5] text-[#736B63] hover:border-[#9E7422]'
                }`}
              >
                All
              </button>
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? 'All' : sz)}
                  className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                    selectedSize === sz
                      ? 'bg-[#9E7422] text-white border-[#9E7422] font-semibold'
                      : 'bg-white border-[#E5DFD5] text-[#121212] hover:border-[#9E7422]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Color Filter */}
          <div className="space-y-2 pt-4 border-t border-[#E5DFD5]">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Color</h3>
              {selectedColor !== 'All' && (
                <button
                  onClick={() => setSelectedColor('All')}
                  className="text-[11px] text-[#9E7422] hover:underline"
                >
                  All colors
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedColor('All')}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  selectedColor === 'All'
                    ? 'bg-[#121212] text-white border-[#121212]'
                    : 'bg-white border-[#E5DFD5] text-[#736B63] hover:border-[#9E7422]'
                }`}
              >
                All
              </button>
              {availableColors.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(selectedColor === col ? 'All' : col)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    selectedColor === col
                      ? 'bg-[#9E7422] text-white border-[#9E7422] font-semibold'
                      : 'bg-white border-[#E5DFD5] text-[#121212] hover:border-[#9E7422]'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Stock Availability */}
          <div className="pt-4 border-t border-[#E5DFD5]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#121212] font-medium">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-[#9E7422] focus:ring-[#9E7422] w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS AREA (Col 9) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar: Search + Sort + Mobile Filter Trigger */}
          <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Search within store */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736B63]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, tag, or fabric..."
                className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-[#121212] focus:outline-none focus:border-[#9E7422]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B63] hover:text-[#121212]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button + Sort dropdown */}
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5] text-xs font-semibold text-[#121212] flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#9E7422]" />
                <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
              </button>

              {/* Sort By Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline text-[#736B63] font-medium">Sort:</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="appearance-none bg-[#FAF8F5] border border-[#E5DFD5] text-[#121212] py-2 pl-3 pr-8 rounded-lg font-semibold focus:outline-none focus:border-[#9E7422] cursor-pointer text-xs"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#736B63]" />
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS BAR */}
          {hasActiveFilters && (
            <div className="bg-white p-3 rounded-lg border border-[#E5DFD5] flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#736B63] font-medium">Active Filters:</span>
              
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#F6F2EA] text-[#9E7422] font-semibold border border-[#DFC377]">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSubcategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#F6F2EA] text-[#9E7422] font-semibold border border-[#DFC377]">
                  Subcategory: {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory('All')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSize !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#F6F2EA] text-[#9E7422] font-semibold border border-[#DFC377]">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize('All')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedColor !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#F6F2EA] text-[#9E7422] font-semibold border border-[#DFC377]">
                  Color: {selectedColor}
                  <button onClick={() => setSelectedColor('All')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(minPrice > 0 || maxPrice < 65000) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#F6F2EA] text-[#9E7422] font-semibold border border-[#DFC377]">
                  Price: {formatNaira(minPrice)} to {formatNaira(maxPrice)}
                  <button onClick={() => { setMinPrice(0); setMaxPrice(65000); }} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onlyInStock && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#F6F2EA] text-[#9E7422] font-semibold border border-[#DFC377]">
                  In Stock Only
                  <button onClick={() => setOnlyInStock(false)} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF8F5] text-[#121212] font-medium border border-[#E5DFD5]">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-[#9E7422] hover:text-[#835E17] font-bold underline ml-2 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product count */}
          <div className="flex items-center justify-between text-xs text-[#736B63]">
            <span>
              Showing <strong className="text-[#121212]">{filteredProducts.length}</strong> modest fashion pieces
            </span>
          </div>

          {/* Product Grid */}
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
            <div className="bg-white rounded-2xl border border-[#E5DFD5] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F6F2EA] border border-[#DFC377] flex items-center justify-center mx-auto text-[#9E7422]">
                <Search className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#121212]">
                No matching products found
              </h3>
              <p className="text-xs sm:text-sm text-[#736B63] max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any items matching your selected attributes. Try resetting filters or searching with a broader keyword.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#9E7422] hover:bg-[#835E17] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER (ZERO HORIZONTAL OVERFLOW) */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden flex justify-end"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="w-full max-w-xs bg-white h-full p-5 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#9E7422]" />
                  <h3 className="font-serif font-bold text-base text-[#121212]">Filter Products</h3>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-gray-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-2">Category</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedSubcategory('All');
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs ${
                      selectedCategory === 'All' ? 'bg-[#F6F2EA] text-[#9E7422] font-bold' : 'text-[#736B63]'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.name);
                        setSelectedSubcategory('All');
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs ${
                        selectedCategory === c.name ? 'bg-[#F6F2EA] text-[#9E7422] font-bold' : 'text-[#736B63]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-2">Size</h4>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                  <button
                    onClick={() => setSelectedSize('All')}
                    className={`px-2 py-1 text-xs rounded border ${
                      selectedSize === 'All' ? 'bg-[#121212] text-white' : 'bg-white text-[#736B63] border-[#E5DFD5]'
                    }`}
                  >
                    All
                  </button>
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(selectedSize === sz ? 'All' : sz)}
                      className={`px-2 py-1 text-xs rounded border ${
                        selectedSize === sz ? 'bg-[#9E7422] text-white border-[#9E7422]' : 'bg-white text-[#121212] border-[#E5DFD5]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-2">Color</h4>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                  <button
                    onClick={() => setSelectedColor('All')}
                    className={`px-2 py-1 text-xs rounded border ${
                      selectedColor === 'All' ? 'bg-[#121212] text-white' : 'bg-white text-[#736B63] border-[#E5DFD5]'
                    }`}
                  >
                    All
                  </button>
                  {availableColors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(selectedColor === col ? 'All' : col)}
                      className={`px-2 py-1 text-xs rounded border ${
                        selectedColor === col ? 'bg-[#9E7422] text-white border-[#9E7422]' : 'bg-white text-[#121212] border-[#E5DFD5]'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-[#121212]">Max Price:</span>
                  <span className="font-bold text-[#9E7422]">{formatNaira(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="65000"
                  step="2500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#9E7422]"
                />
              </div>

              {/* In stock */}
              <div>
                <label className="flex items-center gap-2 text-xs text-[#121212] cursor-pointer">
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

            {/* Apply & Reset Buttons */}
            <div className="pt-4 border-t border-[#E5DFD5] space-y-2 mt-4">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-[#9E7422] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                View {filteredProducts.length} Results
              </button>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2 border border-[#E5DFD5] text-[#736B63] rounded-lg text-xs font-semibold hover:text-black"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
