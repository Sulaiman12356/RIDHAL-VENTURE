import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Order } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => boolean;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  selectedState: string;
  setSelectedState: (state: string) => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

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

  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [selectedState, setSelectedState] = useState<string>('Ogun');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ): boolean => {
    // Validate stock
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
        const existingItem = prevCart[existingIndex];
        const newQty = Math.min(existingItem.quantity + quantity, product.stock);
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQty
        };
        return updated;
      } else {
        const initialQty = Math.min(quantity, product.stock);
        return [
          ...prevCart,
          {
            product,
            quantity: initialQty,
            selectedSize,
            selectedColor,
            unitPrice: product.price
          }
        ];
      }
    });

    showToast(`Added "${product.name}" to your shopping bag.`);
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

    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        ) {
          const maxStock = item.product.stock;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock)
          };
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

  // Delivery rate estimate in Nigeria
  const calculateDeliveryFee = (state: string, itemsCount: number): number => {
    if (itemsCount === 0) return 0;
    if (state.toLowerCase().includes('ogun')) {
      return 2500; // Local delivery in Ijebu-Ode / Ogun State
    }
    if (state.toLowerCase().includes('lagos') || state.toLowerCase().includes('oyo')) {
      return 3500; // Neighboring South-West states
    }
    if (state.toLowerCase().includes('abuja')) {
      return 5000;
    }
    return 4500; // Nationwide logistics
  };

  const deliveryFee = calculateDeliveryFee(selectedState, cartCount);
  const total = subtotal + deliveryFee;

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
        total,
        selectedState,
        setSelectedState,
        wishlist,
        toggleWishlist,
        isInWishlist,
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
