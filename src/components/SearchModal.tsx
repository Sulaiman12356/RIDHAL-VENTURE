import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, formatNaira } from '../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory?: (categoryName: string) => void;
  products?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory,
  products = PRODUCTS
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = query.trim() === ''
    ? []
    : products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(query.toLowerCase()) ||
        (p.shortDescription || '').toLowerCase().includes(query.toLowerCase())
      );

  const quickCategories = [
    'Jalab & Abaya',
    'Scarfs & Hijabs',
    'Quran & Islamic Essentials',
    'Jewelries',
    'Wrist Watches'
  ];

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 md:pt-24 px-4"
      onClick={onClose}
    >
      <div
        id="search-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
        className="w-full max-w-2xl bg-[#FAF8F5] rounded-xl shadow-2xl border border-[#E8DFC8] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="search-dialog-title" className="sr-only">Search Products</h2>
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E8DFC8] bg-white gap-3">
          <Search className="w-5 h-5 text-[#C59A45]" />
          <input
            type="text"
            id="search-input"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Jalab, Abayas, Scarfs, Qurans, Wrist Watches..."
            className="flex-1 bg-transparent border-none outline-none text-[#121212] placeholder-[#888] text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-black transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widest px-2.5 py-1 text-gray-500 hover:text-black font-semibold"
          >
            Esc
          </button>
        </div>

        {/* Quick Categories Bar */}
        <div className="px-5 py-3 bg-[#F4EFE6] border-b border-[#E8DFC8] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-500 font-medium whitespace-nowrap">Popular:</span>
          {quickCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                onClose();
              }}
              className="px-2.5 py-1 rounded-full bg-white text-[#2C2416] hover:bg-[#C59A45] hover:text-white transition-colors border border-[#DDD3BF] whitespace-nowrap font-medium"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-[#EDE6D6]">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-gray-500">
              <ShoppingBag className="w-10 h-10 mx-auto text-[#C59A45] mb-2 opacity-60" />
              <p className="font-medium text-sm text-[#333]">Search Ridhal Ventures Store</p>
              <p className="text-xs text-gray-500 mt-1">Type a product title, category, or fabric name to browse instantly.</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">
                Found {filteredProducts.length} Product{filteredProducts.length > 1 ? 's' : ''}
              </div>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-white transition-all cursor-pointer group border border-transparent hover:border-[#E8DFC8]"
                >
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-white border border-[#E8DFC8] flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#C59A45] uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#121212] truncate group-hover:text-[#9D7423] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{product.shortDescription}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-[#121212]">
                      {formatNaira(product.price)}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#C59A45] font-semibold group-hover:underline mt-0.5">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">
              <p className="font-medium text-sm text-[#121212]">No products found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-gray-500 mt-1">Try checking for typos or browse our main categories above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
