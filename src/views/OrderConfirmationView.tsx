import React, { useState } from 'react';
import {
  CheckCircle2,
  Package,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Building2,
  Truck,
  MessageCircle,
  ArrowRight,
  Copy,
  CheckCircle,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../data/products';
import { ActivePage } from '../types';
import { BrandLogo } from '../components/BrandLogo';

interface OrderConfirmationViewProps {
  onNavigate: (page: ActivePage, extra?: any) => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ onNavigate }) => {
  const { currentOrder } = useCart();
  const [copiedBank, setCopiedBank] = useState(false);

  if (!currentOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Package className="w-12 h-12 mx-auto text-[#9E7422] opacity-60" />
        <h2 className="font-serif text-2xl font-bold text-[#121212]">
          No active order found
        </h2>
        <p className="text-xs text-[#736B63]">
          You have not placed an order yet in this session.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#9E7422] text-white text-xs font-bold uppercase rounded-lg"
        >
          Browse Shop
        </button>
      </div>
    );
  }

  const orderDate = new Date(currentOrder.createdAt).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const customer = currentOrder.customer || currentOrder.customerDetails || {
    fullName: 'Valued Customer',
    email: '',
    phone: '',
    deliveryAddress: '',
    city: '',
    state: '',
    orderNotes: ''
  };

  const copyBankInfo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('6531729301').then(() => {
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2500);
      });
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Ridhal Ventures! I just placed an order on your website.\nOrder Reference: ${currentOrder.orderNumber}\nCustomer: ${customer.fullName}\nTotal: ${formatNaira(currentOrder.total)}\nPayment Method: ${currentOrder.paymentMethod}\nPlease confirm my order.`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      
      {/* Top Success Badge Banner */}
      <div className="bg-[#FAF6EE] rounded-2xl border border-[#E5DFD5] p-8 text-center space-y-4 shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-[#9E7422] font-bold">
            Order Successfully Placed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#121212] mt-1">
            Thank You for Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#736B63] mt-2 max-w-lg mx-auto leading-relaxed">
            Your order has been recorded in our official order registry. Our dispatch team in Ijebu-Ode is reviewing your items for preparation.
          </p>
        </div>

        {/* Order Ref & Status Box */}
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-white px-6 py-3 rounded-xl border border-[#DFC377] shadow-xs">
          <div>
            <span className="text-[10px] text-[#736B63] uppercase tracking-widest font-bold block">
              Official Order Reference
            </span>
            <span className="font-mono font-bold text-base text-[#9E7422]">
              {currentOrder.orderNumber}
            </span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          <div>
            <span className="text-[10px] text-[#736B63] uppercase tracking-widest font-bold block">
              Fulfillment Status
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#FAF2DC] text-[#8C6316] border border-[#DFC377]">
              {currentOrder.orderStatus || currentOrder.status || 'Order received'}
            </span>
          </div>
        </div>

        {/* Instant Track Order Action */}
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onNavigate('order-tracking', { orderNumber: currentOrder.orderNumber })}
            className="px-5 py-2.5 bg-[#121212] hover:bg-[#262626] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Truck className="w-4 h-4 text-[#DFC377]" />
            <span>Track Order Timeline</span>
          </button>
          <a
            href={`https://wa.me/2349165317293?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm via WhatsApp Desk</span>
          </a>
        </div>
      </div>

      {/* Invoice Details Layout */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] overflow-hidden shadow-xs divide-y divide-[#E5DFD5]">
        
        {/* Invoice Header */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" variant="compact" theme="light" />
          </div>
          <div className="text-left sm:text-right text-xs text-[#736B63] space-y-1">
            <div className="flex items-center sm:justify-end gap-1.5 font-medium text-[#121212]">
              <Calendar className="w-3.5 h-3.5 text-[#9E7422]" />
              <span>Placed: {orderDate}</span>
            </div>
            <div>Store: 5, Bass street, off idomowo, Ijebu-Ode</div>
          </div>
        </div>

        {/* Customer & Destination Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-[#121212] text-[11px] block">
              Customer Details
            </span>
            <div className="font-bold text-sm text-[#121212]">{customer.fullName}</div>
            <div className="text-[#736B63] flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#736B63]" />
              <span>{customer.email}</span>
            </div>
            <div className="text-[#736B63] flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#736B63]" />
              <span>{customer.phone}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-[#121212] text-[11px] block">
              Delivery Destination
            </span>
            <div className="text-[#736B63] flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#9E7422] shrink-0 mt-0.5" />
              <span>
                {customer.deliveryAddress}, {customer.city},{' '}
                {customer.state} State, Nigeria
              </span>
            </div>
            {customer.orderNotes && (
              <div className="text-[#736B63] pt-1 italic">
                &ldquo;{customer.orderNotes}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Items Summary Table */}
        <div className="p-6 space-y-4">
          <span className="font-bold uppercase tracking-wider text-[#121212] text-[11px] block">
            Items Ordered ({currentOrder.items.length})
          </span>

          <div className="divide-y divide-[#E5DFD5]">
            {currentOrder.items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover border border-[#E5DFD5]"
                  />
                  <div>
                    <span className="font-bold text-[#121212] block">{item.product.name}</span>
                    <span className="text-[#736B63] text-[11px]">
                      Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}{' '}
                      {item.selectedColor ? `| Color: ${item.selectedColor}` : ''}
                    </span>
                  </div>
                </div>
                <div className="font-bold text-[#121212]">
                  {formatNaira(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-[#E5DFD5] space-y-2 text-xs text-[#736B63] max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-bold text-[#121212]">{formatNaira(currentOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({currentOrder.deliveryZoneName || currentOrder.customer?.state}):</span>
              <span className="font-bold text-[#121212]">{formatNaira(currentOrder.deliveryFee)}</span>
            </div>
            {currentOrder.discountAmount && currentOrder.discountAmount > 0 ? (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon ({currentOrder.appliedCoupon}):</span>
                <span>-{formatNaira(currentOrder.discountAmount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-sm font-extrabold text-[#121212] border-t border-[#E5DFD5] pt-2">
              <span>Total Amount:</span>
              <span className="text-[#9E7422] font-serif text-base">
                {formatNaira(currentOrder.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="p-6 bg-[#FAF6EE] space-y-3">
          <span className="font-bold uppercase tracking-wider text-[#121212] text-[11px] block">
            Payment & Verification Arrangement
          </span>

          {currentOrder.paymentMethod === 'bank_transfer' && (
            <div className="bg-white p-4 rounded-xl border border-[#DFC377] space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#121212]">
                <Building2 className="w-4 h-4 text-[#9E7422]" />
                <span>Bank Transfer Instructions (Payment Pending)</span>
              </div>
              <p className="text-[#736B63]">
                Please transfer <strong>{formatNaira(currentOrder.total)}</strong> with reference <strong>{currentOrder.orderNumber}</strong> to complete your order:
              </p>
              
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] space-y-1.5 text-xs text-[#121212]">
                <div className="flex justify-between">
                  <span className="text-[#736B63]">Bank Name:</span>
                  <strong>Moniepoint Microfinance Bank</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736B63]">Account Name:</span>
                  <strong>RIDHAL VENTURES</strong>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded border border-[#E5DFD5]">
                  <span className="text-[#736B63]">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#9E7422]">6531729301</span>
                    <button
                      onClick={copyBankInfo}
                      className="text-[#736B63] hover:text-[#121212] p-0.5"
                      title="Copy Account Number"
                    >
                      {copiedBank ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <a
                  href={`https://wa.me/2349165317293?text=${encodeURIComponent(
                    `Hello Ridhal Ventures, I have completed the bank transfer of ${formatNaira(currentOrder.total)} for Order ${currentOrder.orderNumber}. Attached is my proof of transfer.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Proof of Payment on WhatsApp
                </a>
              </div>
            </div>
          )}

          {currentOrder.paymentMethod === 'online' && (
            <div className="bg-white p-4 rounded-xl border border-[#DFC377] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#121212]">
                <CreditCard className="w-4 h-4 text-[#9E7422]" />
                <span>Online Payment Gateway Status</span>
              </div>
              <p className="text-[#736B63]">
                Your transaction has been recorded. Once your payment reflects on Paystack, our system automatically advances your order to <strong>Payment Confirmed</strong>.
              </p>
            </div>
          )}

          {currentOrder.paymentMethod === 'pay_on_delivery' && (
            <div className="bg-white p-4 rounded-xl border border-[#DFC377] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#121212]">
                <Truck className="w-4 h-4 text-[#9E7422]" />
                <span>Pay on Delivery Arranged</span>
              </div>
              <p className="text-[#736B63]">
                Our local Ijebu-Ode courier will arrive at your address with your package. Please have <strong>{formatNaira(currentOrder.total)}</strong> ready in cash or instant transfer upon inspection.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-6 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto px-6 py-3 bg-[#FAF8F5] border border-[#E5DFD5] hover:border-[#9E7422] text-[#121212] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => onNavigate('order-tracking', { orderNumber: currentOrder.orderNumber })}
            className="w-full sm:w-auto px-6 py-3 bg-[#9E7422] hover:bg-[#835E17] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>Live Package Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
