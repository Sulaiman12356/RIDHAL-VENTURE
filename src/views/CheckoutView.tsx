import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Phone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNaira, NIGERIAN_STATES } from '../data/products';
import { ActivePage, PaymentMethod, CustomerInfo, Order } from '../types';
import { createOrder } from '../services/orderService';
import { syncCustomer } from '../services/customerService';

interface CheckoutViewProps {
  onNavigate: (page: ActivePage) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate }) => {
  const {
    cart,
    subtotal,
    deliveryFee,
    total,
    selectedState,
    setSelectedState,
    clearCart,
    setCurrentOrder
  } = useCart();

  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    city: '',
    state: selectedState,
    orderNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state selection
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedState(val);
    setFormData((prev) => ({ ...prev, state: val }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg('Please enter a valid Nigerian telephone number (e.g. 080... / 090...).');
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setErrorMsg('Please provide your complete street delivery address.');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMsg('Please enter your town or city.');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg('Your shopping bag is empty.');
      return;
    }

    setIsSubmitting(true);

    // Generate authentic order reference number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `RV-${new Date().getFullYear()}-${randomSuffix}`;
    const customerId = formData.phone.replace(/[^0-9]/g, '') || formData.email || 'cust_' + Date.now();

    const newOrder: Order = {
      id: orderNumber,
      orderNumber,
      customerId,
      customerDetails: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        deliveryAddress: formData.deliveryAddress,
        city: formData.city,
        state: formData.state,
        orderNotes: formData.orderNotes,
      },
      customer: { ...formData },
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'Pending' : 'Pending',
      orderStatus: 'Pending',
      status: paymentMethod === 'online' ? 'Pending Payment' : 'Confirmed',
      createdAt: new Date().toISOString()
    };

    try {
      await Promise.all([
        createOrder(newOrder),
        syncCustomer({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.deliveryAddress,
          city: formData.city,
          state: formData.state,
        })
      ]);
    } catch (err) {
      console.warn('Could not sync order to Firestore cloud, saving locally:', err);
    }

    setCurrentOrder(newOrder);
    clearCart();
    setIsSubmitting(false);
    onNavigate('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl font-bold text-[#111]">
          No items in bag for checkout
        </h2>
        <p className="text-xs text-gray-500">
          Please add products to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#9E7422] text-white text-xs font-bold uppercase rounded-lg"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Breadcrumb & Heading */}
      <div>
        <button
          onClick={() => onNavigate('cart')}
          className="text-xs font-bold uppercase tracking-wider text-[#9E7422] hover:text-[#735111] inline-flex items-center gap-1.5 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shopping Bag
        </button>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111]">
          Checkout & Order Placement
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Provide your delivery details and choose your preferred payment arrangement.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Customer Information + Payment Method (Col 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Customer Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-5">
            <h2 className="font-serif-luxury text-lg font-bold text-[#111] pb-3 border-b border-[#F2ECE0] flex items-center justify-between">
              <span>1. Customer & Delivery Information</span>
              <span className="text-[11px] text-gray-400 font-sans font-normal">* All fields required</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Alhaja Fatima Adebayo"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Phone Number (Active WhatsApp) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="08054760134 or 09165317293"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              {/* Street Delivery Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-gray-700">Street Delivery Address *</label>
                <input
                  type="text"
                  name="deliveryAddress"
                  required
                  placeholder="e.g. 14 Awujale Street, near Molipa Expressway"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">City / Town *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Ijebu-Ode, Sagamu, Abeokuta..."
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">State *</label>
                <select
                  name="state"
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                >
                  {NIGERIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Notes */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-gray-700">
                  Additional Order Note (Optional)
                </label>
                <textarea
                  name="orderNotes"
                  rows={2}
                  placeholder="Special instructions for tailoring, delivery landmarks, or urgent dates..."
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Section (Configurable options) */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-5">
            <h2 className="font-serif-luxury text-lg font-bold text-[#111] pb-3 border-b border-[#F2ECE0]">
              2. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Bank Transfer (Recommended) */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#9E7422] bg-[#FAF6EE]'
                    : 'border-[#E8DFC8] hover:border-[#DFC377]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 accent-[#9E7422]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#9E7422]" />
                    <span className="font-bold text-xs text-[#111]">Direct Bank Transfer</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7CF9B]/40 text-[#8C6316] font-semibold">
                      Fastest Verification
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Transfer directly into the official Ridhal Ventures account. Order will be confirmed immediately once our team acknowledges receipt.
                  </p>
                </div>
              </label>

              {/* Online Payment (Paystack / Flutterwave Gateway Architecture) */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-[#9E7422] bg-[#FAF6EE]'
                    : 'border-[#E8DFC8] hover:border-[#DFC377]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="mt-1 accent-[#9E7422]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#9E7422]" />
                    <span className="font-bold text-xs text-[#111]">Online Payment (Debit Card / USSD / Bank App)</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Prepared for secure integration with Paystack or Flutterwave.
                  </p>
                  <div className="mt-2 text-[11px] text-gray-500 bg-white/80 p-2 rounded border border-[#E8DFC8]">
                    <span className="font-semibold text-gray-700">Notice:</span> Awaiting backend merchant gateway credentials. Your order will be logged as <em>Pending Payment</em> with reference to complete via verified channel.
                  </div>
                </div>
              </label>

              {/* Pay on Delivery (Available for local Ogun State) */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === 'pay_on_delivery'
                    ? 'border-[#9E7422] bg-[#FAF6EE]'
                    : 'border-[#E8DFC8] hover:border-[#DFC377]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="pay_on_delivery"
                  checked={paymentMethod === 'pay_on_delivery'}
                  onChange={() => setPaymentMethod('pay_on_delivery')}
                  className="mt-1 accent-[#9E7422]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#9E7422]" />
                    <span className="font-bold text-xs text-[#111]">Pay on Delivery (Local Ijebu-Ode Only)</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Pay in cash or transfer to the dispatch rider upon inspection in Ijebu-Ode central zones.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Order Summary & Place Order (Col 5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-6 sticky top-28">
          <h2 className="font-serif-luxury text-lg font-bold text-[#111] pb-3 border-b border-[#EDE6D6]">
            Order Review ({cart.length} item{cart.length > 1 ? 's' : ''})
          </h2>

          {/* Mini items list */}
          <div className="max-h-60 overflow-y-auto divide-y divide-[#EDE6D6] pr-1">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-md object-cover border border-[#E8DFC8] flex-shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-bold text-gray-900 truncate">{item.product.name}</div>
                    <div className="text-gray-500 text-[11px]">
                      Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-gray-900 flex-shrink-0">
                  {formatNaira(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="space-y-2.5 text-xs text-gray-600 border-t border-[#EDE6D6] pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-gray-900">{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({selectedState}):</span>
              <span className="font-bold text-gray-900">{formatNaira(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#111] border-t border-[#EDE6D6] pt-3">
              <span>Grand Total:</span>
              <span className="text-[#9E7422] font-serif-luxury text-lg">
                {formatNaira(total)}
              </span>
            </div>
          </div>

          {/* Submit Order Button */}
          <button
            type="submit"
            id="place-order-submit-btn"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#9E7422] hover:bg-[#85611B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Recording Order...' : 'Place Official Order'}</span>
          </button>

          {/* Contact reassurance */}
          <div className="pt-2 text-[11px] text-gray-500 space-y-1.5 border-t border-[#EDE6D6]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9E7422]" />
              <span>Direct confirmation by Ridhal Ventures management</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#9E7422]" />
              <span>Assistance hotline: 09165317293 | 08054760134</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
