import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ActivePage } from '../types';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacy,
  onOpenTerms
}) => {
  const handleNav = (page: ActivePage) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#0A0A0A] text-[#EDE6D6] border-t border-[#2A241A] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#24201A]">
          
          {/* Brand Identity & Logo Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <BrandLogo size="lg" variant="compact" theme="dark" />
            </div>
            <p className="text-xs sm:text-sm text-[#B3A897] leading-relaxed max-w-sm">
              Your one stop store for Jalab, Abaya, Islamic essentials, modest fashion, accessories, and lifestyle products. Crafted for elegance, modesty, and everyday grace.
            </p>

            {/* Social Media Placeholders (without inventing fake links) */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest text-[#E7CF9B] font-semibold block mb-3">
                Follow Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="#instagram"
                  aria-label="Instagram (Coming Soon)"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-full bg-[#181613] border border-[#3D3323] hover:border-[#C59A45] hover:text-[#C59A45] text-[#D1C7B7] flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#facebook"
                  aria-label="Facebook (Coming Soon)"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-full bg-[#181613] border border-[#3D3323] hover:border-[#C59A45] hover:text-[#C59A45] text-[#D1C7B7] flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                {/* TikTok SVG Icon placeholder */}
                <a
                  href="#tiktok"
                  aria-label="TikTok (Coming Soon)"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-full bg-[#181613] border border-[#3D3323] hover:border-[#C59A45] hover:text-[#C59A45] text-[#D1C7B7] flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47c1.37-1.37 2.14-3.23 2.14-5.17V8.6a8.28 8.28 0 0 0 4.63 1.4v-3.31a4.91 4.91 0 0 1-1-.001z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display-royal text-sm uppercase tracking-widest text-[#E7CF9B] font-bold">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#B3A897]">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[#E7CF9B] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop')}
                  className="hover:text-[#E7CF9B] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  Shop All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('collections')}
                  className="hover:text-[#E7CF9B] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  Collections & Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#E7CF9B] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#E7CF9B] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  Contact & Store Visit
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-[#E7CF9B] hover:translate-x-1 transition-all inline-flex items-center gap-1.5 text-[#888]"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-[#E7CF9B] hover:translate-x-1 transition-all inline-flex items-center gap-1.5 text-[#888]"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="text-[#C59A45] hover:text-[#F5E4B5] hover:translate-x-1 transition-all inline-flex items-center gap-1.5 font-semibold"
                >
                  Store Admin Portal 🔒
                </button>
              </li>
            </ul>
          </div>

          {/* Official Contact Details Column */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display-royal text-sm uppercase tracking-widest text-[#E7CF9B] font-bold">
              Contact & Store Location
            </h3>
            <div className="space-y-3.5 text-xs sm:text-sm text-[#B3A897]">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C59A45] flex-shrink-0 mt-0.5" />
                <span>
                  5, Bass street, off idomowo, adjacent to new market police station, Ijebu-Ode, Ogun State, Nigeria.
                </span>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C59A45] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div>
                    <a href="tel:09165317293" className="hover:text-[#E7CF9B] transition-colors">
                      09165317293
                    </a>
                  </div>
                  <div>
                    <a href="tel:08054760134" className="hover:text-[#E7CF9B] transition-colors">
                      08054760134
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#C59A45] flex-shrink-0" />
                <a
                  href="mailto:alhajabizventure@gmail.com"
                  className="hover:text-[#E7CF9B] transition-colors break-all"
                >
                  alhajabizventure@gmail.com
                </a>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <a
                href="https://wa.me/2349165317293"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161411] border border-[#C59A45]/40 hover:border-[#C59A45] text-[#E7CF9B] text-xs font-semibold transition-colors"
              >
                <span>Direct WhatsApp Inquiries</span>
                <span>→</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#7A7265]">
          <div>
            © 2026 RIDHAL VENTURES. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Modest Fashion</span>
            <span>•</span>
            <span>Islamic Essentials</span>
            <span>•</span>
            <span>Timeless Accessories</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
