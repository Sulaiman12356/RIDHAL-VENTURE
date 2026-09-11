import React from 'react';
import { CategoryItem } from '../types';

interface CategoryCardProps {
  category: CategoryItem;
  onSelect: (categoryName: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onSelect
}) => {
  return (
    <div
      id={`category-card-${category.slug}`}
      onClick={() => onSelect(category.name)}
      className="group cursor-pointer flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Framed Image Card with Arch/Pill top matching the prototype */}
      <div className="relative w-full aspect-[4/5] bg-white rounded-2xl border border-[#DFC377] p-2 shadow-xs group-hover:shadow-md transition-shadow overflow-hidden">
        <div className="w-full h-full rounded-xl overflow-hidden bg-[#F7F3EB] relative">
          <img
            src={category.image}
            alt={category.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Category Name Label pill */}
      <div className="mt-2.5 px-3 py-1.5 rounded-full bg-white border border-[#E8DFC8] group-hover:border-[#9E7422] transition-colors shadow-2xs w-full">
        <span className="font-serif-luxury text-xs sm:text-sm font-bold text-[#1F1F1F] group-hover:text-[#9E7422] transition-colors truncate block">
          {category.name}
        </span>
      </div>
    </div>
  );
};
