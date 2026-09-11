import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X, Heart, Phone, Shield } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ActivePage } from '../types';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenSearch,
  onOpenAccount
}) => {
  const { cartCount, wishlist } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: ActivePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Collections', page: 'collections' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' }
  ];

  const handleLinkClick = (page: ActivePage) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFC8]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          
          {/* Mobile Hamburger toggle */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-[#121212] hover:text-[#9E7422] transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Official Brand Logo */}
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activePage === link.page;
              return (
                <button
                  key={link.page}
                  id={`nav-link-${link.page}`}
                  onClick={() => handleLinkClick(link.page)}
                  className={`relative py-2 text-sm uppercase tracking-wider font-semibold transition-colors ${
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

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button */}
            <button
              id="navbar-search-btn"
              onClick={onOpenSearch}
              className="p-2 rounded-full text-[#222] hover:text-[#9E7422] hover:bg-[#F2ECE0] transition-colors"
              aria-label="Search catalog"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist quick link */}
            <button
              id="navbar-wishlist-btn"
              onClick={() => handleLinkClick('shop')}
              className="hidden sm:flex relative p-2 rounded-full text-[#222] hover:text-[#9E7422] hover:bg-[#F2ECE0] transition-colors"
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

            {/* Account Button */}
            <button
              id="navbar-account-btn"
              onClick={onOpenAccount}
              className="hidden sm:flex p-2 rounded-full text-[#222] hover:text-[#9E7422] hover:bg-[#F2ECE0] transition-colors"
              aria-label="Customer account"
              title="My Account & Orders"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Store Admin Portal button */}
            <button
              id="navbar-admin-btn"
              onClick={() => handleLinkClick('admin')}
              className="hidden sm:flex p-2 rounded-full text-[#9E7422] hover:text-[#735111] hover:bg-[#F2ECE0] transition-colors"
              aria-label="Store Admin Management"
              title="Admin Dashboard"
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* Shopping Bag / Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={() => handleLinkClick('cart')}
              className="relative p-2 rounded-full text-[#222] hover:text-[#9E7422] hover:bg-[#F2ECE0] transition-colors flex items-center"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#9E7422] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              ) : (
                <span className="hidden sm:inline-block absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E5DBC7] text-[#444] text-[10px] font-semibold text-center leading-4">
                  0
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-backdrop"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            id="mobile-drawer-content"
            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-[#FAF8F5] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Top Branding */}
              <div className="flex items-center justify-between pb-6 border-b border-[#E8DFC8]">
                <BrandLogo size="sm" variant="compact" theme="light" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-black rounded-full"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links List */}
              <div className="py-6 space-y-1">
                {navLinks.map((link) => {
                  const isActive = activePage === link.page;
                  return (
                    <button
                      key={link.page}
                      id={`mobile-nav-${link.page}`}
                      onClick={() => handleLinkClick(link.page)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold tracking-wider uppercase transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-[#F2ECE0] text-[#9E7422]'
                          : 'text-[#1A1A1A] hover:bg-[#F8F4EC]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#9E7422]"></span>}
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions in Mobile Drawer */}
              <div className="pt-2 pb-4 space-y-2 border-t border-[#E8DFC8]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#F2ECE0]"
                >
                  <Search className="w-4 h-4 text-[#C59A45]" />
                  <span>Search Products</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#F2ECE0]"
                >
                  <User className="w-4 h-4 text-[#C59A45]" />
                  <span>Customer Portal</span>
                </button>

                <button
                  onClick={() => handleLinkClick('cart')}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#F2ECE0]"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-[#C59A45]" />
                    <span>Shopping Bag</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#9E7422] text-white text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleLinkClick('admin')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#9E7422] font-semibold hover:bg-[#F2ECE0]"
                >
                  <Shield className="w-4 h-4 text-[#9E7422]" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            </div>

            {/* Mobile Footer Contact info */}
            <div className="pt-6 border-t border-[#E8DFC8] text-xs text-gray-600 space-y-2">
              <div className="font-semibold text-gray-900">Ijebu-Ode, Ogun State</div>
              <a href="tel:09165317293" className="flex items-center gap-2 text-[#9E7422]">
                <Phone className="w-3.5 h-3.5" />
                <span>09165317293 | 08054760134</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
