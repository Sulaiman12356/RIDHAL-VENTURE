import React from 'react';
import { Phone, MapPin } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside aria-label="Announcement" id="announcement-bar" className="bg-[#0D0D0D] text-[#E7CF9B] text-xs py-2 px-4 border-b border-[#2A241A]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left location tag */}
        <div className="hidden md:flex items-center gap-2 text-[#D1C7B7]">
          <MapPin className="w-3.5 h-3.5 text-[#C59A45]" />
          <span>Ijebu-Ode, Ogun State, Nigeria</span>
        </div>

        {/* Center main announcement */}
        <div className="w-full md:w-auto text-center font-medium tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
          <span className="text-[#C59A45] text-[10px] sm:text-xs flex-shrink-0">✦</span>
          <span className="truncate max-w-[260px] sm:max-w-none">Style for Every Occasion • Ijebu-Ode, Ogun State</span>
          <span className="text-[#C59A45] text-[10px] sm:text-xs flex-shrink-0">✦</span>
        </div>

        {/* Right direct hotline */}
        <div className="hidden lg:flex items-center gap-3 text-[#D1C7B7]">
          <a
            href="tel:09165317293"
            className="flex items-center gap-1.5 hover:text-[#C59A45] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#C59A45]" />
            <span>09165317293</span>
          </a>
          <span className="text-[#444]">|</span>
          <a
            href="tel:08054760134"
            className="hover:text-[#C59A45] transition-colors"
          >
            08054760134
          </a>
        </div>
      </div>
    </aside>
  );
};
