import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNaira, NIGERIAN_STATES } from '../data/products';
import { ActivePage, Product } from '../types';

interface CartViewProps {
  onNavigate: (page: ActivePage) => void;
  onViewProduct: (product: Product) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  onNavigate,
  onViewProduct
}) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
    selectedState,
    setSelectedState,
    clearCart
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#FAF2DC] border-2 border-[#DFC377] flex items-center justify-center mx-auto text-[#9E7422]">
          <ShoppingBag className="w-10 h-10 opacity-70" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif-luxury text-3xl font-extrabold text-[#111]">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            You haven&apos;t added any items from Ridhal Ventures yet. Explore our abayas, scarfs, Islamic essentials, and watches to start.
          </p>
        </div>
        <div>
          <button
            id="cart-start-shopping-btn"
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 bg-[#9E7422] hover:bg-[#85611B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs inline-flex items-center gap-2"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFC8]">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111]">
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review your modest wear and lifestyle picks before checking out.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 font-semibold self-start sm:self-auto flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All Items
        </button>
      </div>

      {/* Cart Grid: Items (Left Col 8) + Summary (Right Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List (Col 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-2xs divide-y divide-[#EDE6D6]">
            {cart.map((item) => {
              const maxStock = item.product.stock;
              return (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => onViewProduct(item.product)}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAF6EE] border border-[#E8DFC8] flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E7422]">
                      {item.product.category}
                    </span>
                    <h3
                      onClick={() => onViewProduct(item.product)}
                      className="font-serif-luxury text-base font-bold text-[#111] hover:text-[#9E7422] transition-colors cursor-pointer truncate"
                    >
                      {item.product.name}
                    </h3>

                    {/* Selected Options */}
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                      {item.selectedSize && (
                        <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8DFC8]">
                          Size: <strong className="text-gray-800">{item.selectedSize}</strong>
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8DFC8]">
                          Color: <strong className="text-gray-800">{item.selectedColor}</strong>
                        </span>
                      )}
                    </div>

                    {/* Unit Price */}
                    <div className="text-xs text-gray-500 mt-1">
                      Unit price: <span className="font-semibold text-gray-900">{formatNaira(item.unitPrice)}</span>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <div className="font-bold text-base text-[#111]">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="inline-flex items-center rounded-lg border border-[#E8DFC8] bg-[#FAF8F5] p-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="p-1.5 text-gray-600 hover:text-black"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#111]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        disabled={item.quantity >= maxStock}
                        className="p-1.5 text-gray-600 hover:text-black disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() =>
                        removeFromCart(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                      className="text-xs text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping button */}
          <div className="pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-bold uppercase tracking-wider text-[#9E7422] hover:text-[#735111] inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </button>
          </div>
        </div>

        {/* Order Summary Card (Col 4) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-6">
          <h2 className="font-serif-luxury text-xl font-bold text-[#111] pb-3 border-b border-[#EDE6D6]">
            Order Summary
          </h2>

          {/* Destination State Selector for Delivery Calculation */}
          <div className="space-y-2">
            <label htmlFor="delivery-state-select" className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#9E7422]" /> Delivery Destination State
            </label>
            <select
              id="delivery-state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8DFC8] text-xs font-medium rounded-lg p-2.5 text-[#111] focus:outline-none focus:border-[#9E7422]"
            >
              {NIGERIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st} {st === 'Ogun' ? '(Local - Ijebu-Ode)' : ''}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400">
              * Local dispatch in Ogun State: ₦2,500. Lagos/Oyo: ₦3,500.
            </p>
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-3 text-xs text-gray-600 border-t border-[#EDE6D6] pt-4">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-gray-900">{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery ({selectedState})</span>
              <span className="font-bold text-gray-900">{formatNaira(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#111] border-t border-[#EDE6D6] pt-3">
              <span>Total Amount</span>
              <span className="text-[#9E7422] font-serif-luxury text-lg">
                {formatNaira(total)}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            id="proceed-to-checkout-btn"
            onClick={() => onNavigate('checkout')}
            className="w-full py-3.5 bg-[#9E7422] hover:bg-[#85611B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Security note */}
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DFC8] flex items-center gap-2.5 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-[#9E7422] flex-shrink-0" />
            <span>Secure checkout. Direct order coordination with Ridhal Ventures.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
