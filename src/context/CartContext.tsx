import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Order, DeliveryZone, DiscountCoupon, Customer } from '../types';
import { getAllDeliveryZones, DEFAULT_DELIVERY_ZONES } from '../services/deliveryService';
import { validateCoupon } from '../services/couponService';
import { getSavedCustomer, fetchCustomerProfile } from '../services/customerAuthService';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => boolean;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  selectedState: string;
  setSelectedState: (state: string) => void;

  // Delivery zones
  deliveryZones: DeliveryZone[];
  selectedZone: DeliveryZone | null;
  setSelectedZone: (zone: DeliveryZone) => void;
  refreshDeliveryZones: () => Promise<void>;

  // Coupons
  appliedCoupon: DiscountCoupon | null;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Recently viewed
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Customer Account
  currentCustomer: Customer | null;
  refreshCustomer: () => Promise<void>;

  // Order history / recent order
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ridhal_cart_v1';
const WISHLIST_STORAGE_KEY = 'ridhal_wishlist_v1';
const ORDER_STORAGE_KEY = 'ridhal_last_order_v1';
const RECENTLY_VIEWED_KEY = 'ridhal_recently_viewed_v1';
const COUPON_STORAGE_KEY = 'ridhal_applied_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(DEFAULT_DELIVERY_ZONES);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(DEFAULT_DELIVERY_ZONES[0] || null);
  const [selectedState, setSelectedState] = useState<string>('Ogun');
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(getSavedCustomer());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch configured delivery zones from Firestore
  const refreshDeliveryZones = async () => {
    try {
      const zones = await getAllDeliveryZones();
      if (zones.length > 0) {
        setDeliveryZones(zones);
        // Retain current selection or pick first available
        setSelectedZone(prev => {
          if (prev) {
            const found = zones.find(z => z.id === prev.id);
            if (found && found.available) return found;
          }
          return zones.find(z => z.available) || zones[0];
        });
      }
    } catch (err) {
      console.warn('Error loading delivery zones:', err);
    }
  };

  useEffect(() => {
    refreshDeliveryZones();
  }, []);

  // Listen to customer auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchCustomerProfile(firebaseUser.uid);
        if (profile) {
          setCurrentCustomer(profile);
          // Sync wishlist with Firestore
          try {
            const wishRef = doc(db, 'wishlist', firebaseUser.uid);
            const wishSnap = await getDoc(wishRef);
            if (wishSnap.exists()) {
              const cloudIds = wishSnap.data().productIds || [];
              setWishlist(prev => Array.from(new Set([...prev, ...cloudIds])));
            }
          } catch {}
        }
      } else {
        setCurrentCustomer(getSavedCustomer());
      }
    });
    return () => unsubscribe();
  }, []);

  const refreshCustomer = async () => {
    if (auth.currentUser) {
      const profile = await fetchCustomerProfile(auth.currentUser.uid);
      setCurrentCustomer(profile);
    } else {
      setCurrentCustomer(getSavedCustomer());
    }
  };

  // Local storage persistence
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      // If user logged in, sync to Firestore
      if (auth.currentUser) {
        setDoc(doc(db, 'wishlist', auth.currentUser.uid), {
          id: auth.currentUser.uid,
          customerId: auth.currentUser.uid,
          productIds: wishlist
        }).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    } catch (e) {
      console.error('Failed to save recently viewed', e);
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      if (currentOrder) {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(currentOrder));
      } else {
        localStorage.removeItem(ORDER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save order', e);
    }
  }, [currentOrder]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon', e);
    }
  }, [appliedCoupon]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ): boolean => {
    if (product.stock <= 0) {
      showToast('This item is currently out of stock.');
      return false;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > product.stock) {
          showToast(`Only ${product.stock} units available in stock.`);
          return prevCart;
        }

        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newQty,
        };
        showToast(`Updated "${product.name}" in your bag.`);
        return newCart;
      } else {
        if (quantity > product.stock) {
          showToast(`Only ${product.stock} units available in stock.`);
          return prevCart;
        }

        showToast(`Added "${product.name}" to your shopping bag.`);
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedSize: selectedSize || (product.sizes?.length ? product.sizes[0] : undefined),
            selectedColor: selectedColor || (product.colors?.length ? product.colors[0] : undefined),
            unitPrice: product.price,
          },
        ];
      }
    });

    return true;
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        ) {
          if (quantity > item.product.stock) {
            showToast(`Maximum ${item.product.stock} units available.`);
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (
    productId: string,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    );
    showToast('Item removed from shopping bag.');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from your wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  // Calculate discount from applied coupon
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (subtotal >= appliedCoupon.minSpend) {
      if (appliedCoupon.type === 'percentage') {
        discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
      } else {
        discountAmount = Math.min(appliedCoupon.value, subtotal);
      }
    }
  }

  // Coupon code application
  const applyCouponCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const result = await validateCoupon(code, subtotal);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      showToast(result.message);
      return { success: true, message: result.message };
    } else {
      showToast(result.message);
      return { success: false, message: result.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.');
  };

  // Delivery fee dynamically derived from admin-configured zone
  const deliveryFee = cartCount === 0 ? 0 : (selectedZone?.available ? selectedZone.fee : 0);
  const total = Math.max(0, subtotal - discountAmount) + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
        selectedState,
        setSelectedState,
        deliveryZones,
        selectedZone,
        setSelectedZone,
        refreshDeliveryZones,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        recentlyViewed,
        addRecentlyViewed,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentCustomer,
        refreshCustomer,
        currentOrder,
        setCurrentOrder,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
