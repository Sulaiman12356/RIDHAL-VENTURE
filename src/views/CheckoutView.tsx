import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building2,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Phone,
  Tag,
  CheckCircle,
  Copy,
  AlertCircle,
  MapPin,
  UserCheck,
  Sparkles,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNaira, NIGERIAN_STATES } from '../data/products';
import { ActivePage, PaymentMethod, CustomerInfo, Order, DeliveryZone, OrderStatus } from '../types';
import { createOrder } from '../services/orderService';
import { syncCustomer } from '../services/customerService';
import { normalizeOrderStatus } from '../services/trackingService';

interface CheckoutViewProps {
  onNavigate: (page: ActivePage) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate }) => {
  const {
    cart,
    subtotal,
    deliveryFee,
    discountAmount,
    appliedCoupon,
    total,
    selectedState,
    setSelectedState,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    applyCoupon,
    removeCoupon,
    customer,
    clearCart,
    setCurrentOrder
  } = useCart();

  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: customer?.fullName || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    deliveryAddress: '',
    city: '',
    state: selectedState || 'Ogun',
    orderNotes: ''
  });

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Sync customer details if customer is logged in
  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || customer.fullName || '',
        email: prev.email || customer.email || '',
        phone: prev.phone || customer.phone || ''
      }));

      // Pre-select default saved address if available
      const defaultAddr = customer.savedAddresses?.find(a => a.isDefault) || customer.savedAddresses?.[0];
      if (defaultAddr && !formData.deliveryAddress) {
        setFormData(prev => ({
          ...prev,
          deliveryAddress: defaultAddr.street,
          city: defaultAddr.city,
          state: defaultAddr.state
        }));
        setSelectedState(defaultAddr.state);
      }
    }
  }, [customer]);

  // Handle saved address quick select
  const handleSelectSavedAddress = (addr: any) => {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: addr.street,
      city: addr.city,
      state: addr.state
    }));
    setSelectedState(addr.state);
  };

  // Sync state change
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

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponMessage(null);
    const res = await applyCoupon(couponCodeInput.trim());
    setCouponLoading(false);

    if (res.success) {
      setCouponMessage({ type: 'success', text: res.message });
      setCouponCodeInput('');
    } else {
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  const handleCopyBank = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('6531729301').then(() => {
        setCopiedAccount(true);
        setTimeout(() => setCopiedAccount(false), 2500);
      });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full recipient name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please provide a valid email address for order notifications.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg('Please enter an active Nigerian telephone number (e.g. 080... or 090...).');
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setErrorMsg('Please enter the delivery street address.');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMsg('Please enter the city or town.');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg('Your shopping bag is empty.');
      return;
    }

    // Pay on delivery restriction check
    if (paymentMethod === 'pay_on_delivery') {
      const isOgunOrIjebu = formData.state.toLowerCase() === 'ogun' || formData.city.toLowerCase().includes('ijebu');
      if (!isOgunOrIjebu) {
        setErrorMsg('Pay on Delivery is currently available only for local Ijebu-Ode and Ogun State addresses.');
        return;
      }
    }

    setIsSubmitting(true);

    // Generate authentic order reference number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `RV-${new Date().getFullYear()}-${randomSuffix}`;
    const customerId = customer?.id || formData.phone.replace(/[^0-9]/g, '') || formData.email;

    // Initial order status based on payment method
    let initialOrderStatus: OrderStatus = 'Order received';
    let initialPaymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded' = 'Pending';

    // Check if online payment should be initialized via server
    let paystackAuthUrl = '';
    if (paymentMethod === 'online') {
      try {
        const payRes = await fetch('/api/payment/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            amount: total,
            orderId: orderNumber,
            customerName: formData.fullName,
            metadata: {
              orderNumber,
              customerId,
              phone: formData.phone
            }
          })
        });

        if (payRes.ok) {
          const payData = await payRes.json();
          if (payData.authorizationUrl) {
            paystackAuthUrl = payData.authorizationUrl;
          }
        }
      } catch (payErr) {
        console.warn('Payment endpoint init note:', payErr);
      }
    }

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
      discountAmount,
      appliedCoupon: appliedCoupon?.code || undefined,
      deliveryZoneName: selectedZone?.name || `${formData.state} Zone`,
      total,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
      status: 'Order received',
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

    // If online paystack gateway URL was returned and valid, navigate to gateway
    if (paystackAuthUrl && !paystackAuthUrl.includes('test_mode')) {
      window.location.href = paystackAuthUrl;
      return;
    }

    onNavigate('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#121212]">
          No items in bag for checkout
        </h2>
        <p className="text-xs text-[#736B63]">
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
          className="text-xs font-bold uppercase tracking-wider text-[#9E7422] hover:text-[#835E17] inline-flex items-center gap-1.5 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shopping Bag
        </button>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#121212]">
          Checkout & Order Placement
        </h1>
        <p className="text-xs sm:text-sm text-[#736B63] mt-1">
          Provide your delivery destination and select your preferred payment method.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Customer Information + Delivery + Payment Method (Col 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Customer Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <h2 className="font-serif text-lg font-bold text-[#121212]">
                1. Customer & Delivery Destination
              </h2>
              {customer && (
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Logged In
                </span>
              )}
            </div>

            {/* Saved addresses selector if customer is logged in */}
            {customer && customer.savedAddresses && customer.savedAddresses.length > 0 && (
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5] space-y-2">
                <span className="text-[11px] font-bold text-[#9E7422] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Use Saved Delivery Address:
                </span>
                <div className="flex flex-wrap gap-2">
                  {customer.savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`text-left px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                        formData.deliveryAddress === addr.street
                          ? 'border-[#9E7422] bg-[#F6F2EA] text-[#9E7422] font-semibold'
                          : 'border-[#E5DFD5] bg-white text-[#736B63] hover:border-[#9E7422]'
                      }`}
                    >
                      <span className="font-medium text-[#121212] block">{addr.title}:</span>
                      <span className="text-[11px] truncate block max-w-xs">{addr.street}, {addr.city}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#121212]">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Alhaja Fatima Adebayo"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-[#121212] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121212]">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-[#121212] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121212]">Phone Number (WhatsApp Active) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="08054760134 or 09165317293"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-[#121212] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              {/* Street Delivery Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#121212]">Street Delivery Address *</label>
                <input
                  type="text"
                  name="deliveryAddress"
                  required
                  placeholder="e.g. 5, Bass street, off idomowo, Ijebu-Ode"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-[#121212] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121212]">City / Town *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Ijebu-Ode, Sagamu, Abeokuta..."
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-[#121212] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121212]">Destination State *</label>
                <select
                  name="state"
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-[#121212] focus:outline-none focus:border-[#9E7422]"
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
                <label className="text-xs font-bold text-[#121212]">
                  Special Delivery Instructions / Landmarks (Optional)
                </label>
                <textarea
                  name="orderNotes"
                  rows={2}
                  placeholder="Nearby landmarks, preferred delivery time, or special gate instructions..."
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-[#121212] focus:outline-none focus:border-[#9E7422]"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Section */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-2xs space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#121212] pb-3 border-b border-[#E5DFD5]">
              2. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Bank Transfer (Recommended) */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#9E7422] bg-[#F6F2EA]'
                    : 'border-[#E5DFD5] hover:border-[#DFC377]'
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
                    <span className="font-bold text-xs text-[#121212]">Direct Bank Transfer (Instant Verification)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DFC377]/30 text-[#9E7422] font-semibold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-[#736B63] mt-1 leading-relaxed">
                    Transfer directly to the official Ridhal Ventures merchant account. Fast dispatch confirmation.
                  </p>

                  {/* BANK ACCOUNT BOX */}
                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-[#DFC377] space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#736B63]">Bank Name:</span>
                        <strong className="text-[#121212]">Moniepoint Microfinance Bank</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#736B63]">Account Name:</span>
                        <strong className="text-[#121212]">RIDHAL VENTURES</strong>
                      </div>
                      <div className="flex justify-between items-center bg-[#FAF8F5] p-2 rounded">
                        <span className="text-[#736B63]">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#9E7422]">6531729301</span>
                          <button
                            type="button"
                            onClick={handleCopyBank}
                            className="text-[#736B63] hover:text-[#121212] p-1"
                            title="Copy Account Number"
                          >
                            {copiedAccount ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#736B63] italic">
                        After transferring, your order is recorded in <strong>Payment Pending</strong> status and verified promptly by our dispatch desk.
                      </p>
                    </div>
                  )}
                </div>
              </label>

              {/* Online Payment (Paystack / Cards) */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-[#9E7422] bg-[#F6F2EA]'
                    : 'border-[#E5DFD5] hover:border-[#DFC377]'
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
                    <span className="font-bold text-xs text-[#121212]">Online Payment (Debit Card / USSD / Paystack)</span>
                  </div>
                  <p className="text-xs text-[#736B63] mt-1 leading-relaxed">
                    Automated PCI-DSS Level 1 secure payment gateway for Nigerian bank cards and instant USSD.
                  </p>
                </div>
              </label>

              {/* Pay on Delivery (Available for local Ogun State) */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === 'pay_on_delivery'
                    ? 'border-[#9E7422] bg-[#F6F2EA]'
                    : 'border-[#E5DFD5] hover:border-[#DFC377]'
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
                    <span className="font-bold text-xs text-[#121212]">Pay on Delivery (Local Ijebu-Ode Only)</span>
                  </div>
                  <p className="text-xs text-[#736B63] mt-1 leading-relaxed">
                    Inspect your items upon rider arrival and pay via cash or transfer to the dispatch agent in Ijebu-Ode.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Order Summary + Coupon + Place Order (Col 5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-2xs space-y-6 sticky top-28">
          <h2 className="font-serif text-lg font-bold text-[#121212] pb-3 border-b border-[#E5DFD5]">
            Order Review ({cart.length} item{cart.length > 1 ? 's' : ''})
          </h2>

          {/* Mini items list */}
          <div className="max-h-60 overflow-y-auto divide-y divide-[#E5DFD5] pr-1">
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
                    className="w-10 h-10 rounded-md object-cover border border-[#E5DFD5] shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-bold text-[#121212] truncate">{item.product.name}</div>
                    <div className="text-[#736B63] text-[11px]">
                      Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-[#121212] shrink-0">
                  {formatNaira(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* COUPON REDEMPTION BOX */}
          <div className="pt-2 border-t border-[#E5DFD5]">
            <span className="text-xs font-bold text-[#121212] block mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#9E7422]" /> Have a Promotional Coupon?
            </span>
            
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                <div>
                  <span className="font-bold text-emerald-900">{appliedCoupon.code}</span>
                  <span className="text-emerald-700 ml-1.5">(-{formatNaira(discountAmount)})</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-gray-500 hover:text-red-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. RAMADAN10 or WELCOME5"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-xs uppercase font-mono text-[#121212] focus:outline-none focus:border-[#9E7422]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCodeInput.trim()}
                  className="px-4 py-2 bg-[#121212] hover:bg-[#262626] text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {couponLoading ? 'Checking...' : 'Apply'}
                </button>
              </div>
            )}

            {couponMessage && (
              <p className={`text-[11px] mt-1.5 ${couponMessage.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Calculations */}
          <div className="space-y-2.5 text-xs text-[#736B63] border-t border-[#E5DFD5] pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-[#121212]">{formatNaira(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>
                Delivery Fee ({selectedZone?.name || selectedState}):
              </span>
              <span className="font-bold text-[#121212]">{formatNaira(deliveryFee)}</span>
            </div>

            {selectedZone?.estimatedDays && (
              <div className="text-[11px] text-[#9E7422]">
                Estimated delivery: {selectedZone.estimatedDays}
              </div>
            )}

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({appliedCoupon?.code}):</span>
                <span>-{formatNaira(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-extrabold text-[#121212] border-t border-[#E5DFD5] pt-3">
              <span>Grand Total:</span>
              <span className="text-[#9E7422] font-serif text-lg">
                {formatNaira(total)}
              </span>
            </div>
          </div>

          {/* Submit Order Button */}
          <button
            type="submit"
            id="place-order-submit-btn"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#9E7422] hover:bg-[#835E17] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Recording Order...' : 'Confirm & Place Official Order'}</span>
          </button>

          {/* Contact reassurance */}
          <div className="pt-2 text-[11px] text-[#736B63] space-y-1.5 border-t border-[#E5DFD5]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9E7422]" />
              <span>Direct fulfillment from Ridhal Ventures Ijebu-Ode</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#9E7422]" />
              <span>Assistance desk: 09165317293 | 08054760134</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
