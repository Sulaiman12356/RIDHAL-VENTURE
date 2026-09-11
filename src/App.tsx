import React, { useState, useEffect, useCallback } from 'react';
import { CartProvider } from './context/CartContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { PolicyModals } from './components/PolicyModals';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { CollectionsView } from './views/CollectionsView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { AdminDashboardView } from './views/AdminDashboardView';

import { ActivePage, Product } from './types';
import { PRODUCTS } from './data/products';
import { CATEGORIES } from './data/categories';
import { getAllProducts } from './services/productService';
import { getAllCategories } from './services/categoryService';

function MainAppContent() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [storeProducts, setStoreProducts] = useState<Product[]>(PRODUCTS);
  const [storeCategories, setStoreCategories] = useState<any[]>(CATEGORIES);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(PRODUCTS[0]);
  const [storeCategoryFilter, setStoreCategoryFilter] = useState<string>('All');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

  // Synchronize dynamic products and categories from Firestore
  const reloadCatalog = useCallback(async () => {
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);
      if (fetchedProducts && fetchedProducts.length > 0) {
        setStoreProducts(fetchedProducts);
      }
      if (fetchedCategories && fetchedCategories.length > 0) {
        setStoreCategories(fetchedCategories);
      }
    } catch (err) {
      console.warn('Using local fallback catalog data:', err);
    }
  }, []);

  useEffect(() => {
    reloadCatalog();
  }, [reloadCatalog]);

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHomeOrColl = (categoryName: string) => {
    setStoreCategoryFilter(categoryName);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If viewing the Admin Dashboard, show full-page dedicated administrative view
  if (activePage === 'admin') {
    return (
      <AdminDashboardView
        onExitToStore={() => navigateTo('home')}
        onRefreshGlobalStore={reloadCatalog}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A] font-sans antialiased selection:bg-[#EBD8A9] selection:text-[#121212]">
      
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Luxury Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={(page) => {
          if (page === 'shop') {
            setStoreCategoryFilter('All');
          }
          navigateTo(page);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomeView
            onNavigate={navigateTo}
            onSelectCategory={handleSelectCategoryFromHomeOrColl}
            onViewProduct={handleSelectProduct}
            products={storeProducts}
            categories={storeCategories}
          />
        )}

        {activePage === 'shop' && (
          <ShopView
            initialCategory={storeCategoryFilter}
            onViewProduct={handleSelectProduct}
            products={storeProducts}
            categories={storeCategories}
          />
        )}

        {activePage === 'collections' && (
          <CollectionsView
            onNavigate={navigateTo}
            onSelectCategory={handleSelectCategoryFromHomeOrColl}
          />
        )}

        {activePage === 'about' && (
          <AboutView onNavigate={navigateTo} />
        )}

        {activePage === 'contact' && (
          <ContactView />
        )}

        {activePage === 'product-detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategoryFromHomeOrColl}
            products={storeProducts}
          />
        )}

        {activePage === 'cart' && (
          <CartView
            onNavigate={navigateTo}
            onViewProduct={handleSelectProduct}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutView onNavigate={navigateTo} />
        )}

        {activePage === 'order-confirmation' && (
          <OrderConfirmationView onNavigate={navigateTo} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          if (page === 'shop') setStoreCategoryFilter('All');
          navigateTo(page);
        }}
        onOpenPrivacy={() => setPolicyType('privacy')}
        onOpenTerms={() => setPolicyType('terms')}
      />

      {/* Modals & Dialogs */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
        products={storeProducts}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onNavigateOrder={() => navigateTo('order-confirmation')}
      />

      <PolicyModals
        type={policyType}
        onClose={() => setPolicyType(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainAppContent />
    </CartProvider>
  );
}
