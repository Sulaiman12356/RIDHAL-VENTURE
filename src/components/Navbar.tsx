import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X, Heart, Shield, Phone, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ActivePage } from '../types';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}

interface MobileMenuItem {
  label: string;
  page: ActivePage;
  badge?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenSearch,
  onOpenAccount
}) => {
  const { cartCount, wishlist } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop & Tablet Navigation Links
  const desktopNavLinks: { label: string; page: ActivePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Collections', page: 'collections' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' }
  ];

  // Specific 8 Mobile Menu Items requested:
  // Home, Shop, Collections, About Us, Contact Us, Wishlist, My Account, Cart
  const mobileNavLinks: MobileMenuItem[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Collections', page: 'collections' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact Us', page: 'contact' },
    { label: 'Wishlist', page: 'wishlist', badge: wishlist.length },
    { label: 'My Account', page: 'account' },
    { label: 'Cart', page: 'cart', badge: cartCount }
  ];

  const handleLinkClick = (page: ActivePage) => {
    setIsMobileMenuOpen(false);
    if (page === 'account') {
      onOpenAccount();
    } else {
      onNavigate(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFC8]/80 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 md:h-24">
          
          {/* Official Brand Logo - Kept intact as original */}
          <div
            id="navbar-brand-link"
            onClick={() => handleLinkClick('home')}
            className="cursor-pointer flex items-center group py-1"
          >
            <BrandLogo
              size="md"
              variant="compact"
              theme="light"
              className="transform group-hover:scale-[1.02] transition-transform"
            />
          </div>

          {/* Desktop & Tablet Navigation Links (hidden on mobile, visible on tablet and desktop) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 xl:gap-10" aria-label="Main Navigation">
            {desktopNavLinks.map((link) => {
              const isActive = activePage === link.page;
              return (
                <button
                  key={link.page}
                  id={`nav-link-${link.page}`}
                  onClick={() => handleLinkClick(link.page)}
                  className={`relative py-2 text-xs lg:text-sm uppercase tracking-wider font-semibold transition-colors ${
                    isActive
                      ? 'text-[#9E7422]'
                      : 'text-[#222222] hover:text-[#9E7422]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9E7422] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons Row */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Search Button */}
            <button
              id="navbar-search-btn"
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 rounded-full text-[#222] hover:text-[#9E7422] hover:bg-[#F2ECE0] transition-colors"
              aria-label="Search catalog"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Quick Link (Tablet & Desktop only) */}
            <button
              id="navbar-wishlist-btn"
              onClick={() => handleLinkClick('wishlist')}
              className="hidden md:flex relative p-2 sm:p-2.5 rounded-full text-[#222] hover:text-[#9E7422] hover:bg-[#F2ECE0] transition-colors"
              aria-label="Wishlist"
              title="Wishlist items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#121212] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Button (Tablet & Desktop only) */}
            <button
              id="navbar-account-btn"
              onClick={onOpenAccount}
              className="hidden md:flex p-2 sm:p-2.5 rounded-full text-[#222] hover:text-[#9E7422] hover:bg-[#F2ECE0] transition-colors"
              aria-label="Customer account"
              title="My Account & Orders"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Store Admin Portal button (Tablet & Desktop only) */}
            <button
              id="navbar-admin-btn"
              onClick={() => handleLinkClick('admin')}
              className="hidden md:flex p-2 sm:p-2.5 rounded-full text-[#9E7422] hover:text-[#735111] hover:bg-[#F2ECE0] transition-colors"
              aria-label="Store Admin Management"
              title="Admin Dashboard"
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* Shopping Bag / Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={() => handleLinkClick('cart')}
              className="relative p-2 sm:p-2.5 rounded-full text-[#222] hover:text-[#9E7422] hover:bg-[#F2ECE0] transition-colors flex items-center"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 rounded-full bg-[#9E7422] text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              ) : (
                <span className="hidden sm:inline-block absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E5DBC7] text-[#444] text-[10px] font-semibold text-center leading-4">
                  0
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Icon - Placed at the TOP RIGHT CORNER on mobile devices with styled luxury background */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#121212] bg-[#FAF1DF] hover:bg-[#F4E6C9] active:bg-[#ECD9B6] border border-[#DFD1B7] rounded-xl transition-all duration-200 focus:outline-none flex items-center justify-center min-w-[42px] min-h-[42px] shadow-2xs"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#121212]" />
              ) : (
                <Menu className="w-5 h-5 text-[#121212]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN MOBILE NAVIGATION OVERLAY */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-fullscreen"
          className="fixed inset-0 z-50 bg-gradient-to-b from-[#FAF8F5] via-[#FAF5EB] to-[#F5ECE0] flex flex-col justify-between md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Top Bar of Mobile Menu: Keeps identical alignment and close icon at TOP RIGHT CORNER */}
          <div className="flex items-center justify-between px-3 sm:px-6 h-18 sm:h-20 border-b border-[#E8DFC8]/90 bg-[#FAF8F5]/95 backdrop-blur-xs">
            {/* Brand Logo inside mobile menu header */}
            <div
              id="mobile-menu-brand-logo"
              onClick={() => handleLinkClick('home')}
              className="cursor-pointer flex items-center py-1"
            >
              <BrandLogo size="md" variant="compact" theme="light" />
            </div>

            {/* Top Right Action Icons & Close X Button */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Shortcut */}
              <button
                id="mobile-menu-search-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="p-2 rounded-full text-[#222] hover:text-[#9E7422] hover:bg-[#F2ECE0] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Shortcut */}
              <button
                id="mobile-menu-cart-btn"
                onClick={() => handleLinkClick('cart')}
                className="relative p-2 rounded-full text-[#222] hover:text-[#9E7422] hover:bg-[#F2ECE0] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label={`Cart with ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-4.5 px-1 rounded-full bg-[#9E7422] text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Close Button at TOP RIGHT CORNER with styled luxury background */}
              <button
                id="mobile-menu-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#121212] bg-[#FAF1DF] hover:bg-[#F4E6C9] active:bg-[#ECD9B6] border border-[#DFD1B7] rounded-xl transition-all duration-200 min-w-[42px] min-h-[42px] flex items-center justify-center focus:outline-none shadow-2xs"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-[#121212]" />
              </button>
            </div>
          </div>

          {/* All 8 Navigation Links Displayed with styled card backgrounds */}
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-2 sm:py-4 max-w-md mx-auto w-full">
            <nav
              id="mobile-menu-links-container"
              className="bg-[#FAF4EA]/80 border border-[#EADBBD] rounded-2xl p-2 sm:p-2.5 shadow-xs space-y-1.5 sm:space-y-2"
              aria-label="Mobile Navigation Links"
            >
              {mobileNavLinks.map((item) => {
                const isActive = activePage === item.page;
                return (
                  <button
                    key={item.label}
                    id={`mobile-nav-link-${item.page}`}
                    onClick={() => handleLinkClick(item.page)}
                    className={`w-full flex items-center justify-between px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-150 border text-left group shadow-2xs ${
                      isActive
                        ? 'bg-[#121212] text-[#E7CF9B] border-[#DFC377] shadow-sm'
                        : 'bg-white/95 text-[#1A1815] border-[#E8DFC8] hover:bg-[#FAF3E3] hover:border-[#C59A45]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isActive ? (
                        <span className="w-1.5 h-3.5 bg-[#DFC377] rounded-full" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-[#C59A45]/40 rounded-full group-hover:bg-[#9E7422] transition-colors" />
                      )}
                      <span className="font-serif-luxury text-base sm:text-lg font-bold tracking-tight">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wider ${
                            isActive
                              ? 'bg-[#9E7422] text-white'
                              : 'bg-[#9E7422] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <span
                        className={`text-xs transition-transform duration-150 ${
                          isActive
                            ? 'text-[#E7CF9B] translate-x-0.5'
                            : 'text-[#C59A45] group-hover:translate-x-0.5'
                        }`}
                      >
                        ✦
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Elegant Footer Details */}
          <div className="px-6 py-3 border-t border-[#E8DFC8] bg-[#FAF6EE]/80 text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#665D52]">
              <span>Ijebu-Ode, Ogun State</span>
              <span className="text-[#C59A45]">•</span>
              <a href="tel:09165317293" className="text-[#9E7422] font-semibold hover:underline">
                09165317293
              </a>
            </div>
            <div className="text-[10px] text-[#8C6316] font-semibold uppercase tracking-widest">
              Style for Every Occasion
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
