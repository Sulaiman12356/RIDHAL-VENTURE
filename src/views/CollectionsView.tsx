import React from 'react';
import { CATEGORIES } from '../data/categories';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ActivePage } from '../types';

interface CollectionsViewProps {
  onNavigate: (page: ActivePage) => void;
  onSelectCategory: (categoryName: string) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  onNavigate,
  onSelectCategory
}) => {
  const handleOpenCategory = (catName: string) => {
    onSelectCategory(catName);
    onNavigate('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2DC] border border-[#DFC377] text-xs font-semibold tracking-widest uppercase text-[#9E7422] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Boutiques</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111]">
          Featured Collections
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg mx-auto leading-relaxed">
          Explore Ridhal Ventures&apos; complete spectrum of modest fashion, authentic Islamic essentials, Turkish and Chinese English wear, and jewelry.
        </p>
        <div className="w-16 h-0.5 bg-[#C59A45] mx-auto mt-4 rounded-full" />
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleOpenCategory(cat.name)}
            className="group cursor-pointer bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Container with golden arch border */}
            <div className="p-3">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF6EE] relative border border-[#DFC377]/60">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E7CF9B] block">
                    Curated Collection
                  </span>
                  <h3 className="font-serif-luxury text-lg font-bold">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Subcategories list & action */}
            <div className="p-4 pt-1 flex-1 flex flex-col justify-between">
              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.slice(0, 4).map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8DFC8] text-gray-600 font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                  {cat.subcategories.length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8DFC8] text-gray-400">
                      +{cat.subcategories.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F2ECE0] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#9E7422] group-hover:text-[#735111]">
                <span>Explore Pieces</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
