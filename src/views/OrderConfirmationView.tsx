import React from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../data/products';
import { ActivePage } from '../types';
import { BrandLogo } from '../components/BrandLogo';

interface OrderConfirmationViewProps {
  onNavigate: (page: ActivePage) => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ onNavigate }) => {
  const { currentOrder } = useCart();

  if (!currentOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Package className="w-12 h-12 mx-auto text-[#9E7422] opacity-60" />
        <h2 className="font-serif-luxury text-2xl font-bold text-[#111]">
          No active order found
        </h2>
        <p className="text-xs text-gray-500">
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

  const whatsappMessage = encodeURIComponent(
    `Hello Ridhal Ventures! I just placed an order on your website.\nOrder Reference: ${currentOrder.orderNumber}\nCustomer: ${currentOrder.customer.fullName}\nTotal: ${formatNaira(currentOrder.total)}\nPlease kindly assist in confirming my order.`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      
      {/* Top Success Badge Banner */}
      <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DFC8] p-8 text-center space-y-4 shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-[#9E7422] font-bold">
            Order Successfully Placed
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-extrabold text-[#111] mt-1">
            Thank You for Your Order
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg mx-auto leading-relaxed">
            Your order has been recorded in our official order registry. Our customer care team in Ijebu-Ode is reviewing your request for immediate dispatch.
          </p>
        </div>

        {/* Order Ref & Status Box */}
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-white px-6 py-3 rounded-xl border border-[#DFC377] shadow-xs">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">
              Official Order Reference
            </span>
            <span className="font-mono font-bold text-base text-[#9E7422]">
              {currentOrder.orderNumber}
            </span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">
              Current Status
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#FAF2DC] text-[#8C6316] border border-[#DFC377]">
              {currentOrder.status}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Details Layout */}
      <div className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-xs divide-y divide-[#EDE6D6]">
        
        {/* Invoice Header */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" variant="compact" theme="light" />
          </div>
          <div className="text-left sm:text-right text-xs text-gray-500 space-y-1">
            <div className="flex items-center sm:justify-end gap-1.5 font-medium text-gray-800">
              <Calendar className="w-3.5 h-3.5 text-[#9E7422]" />
              <span>Placed: {orderDate}</span>
            </div>
            <div>Store: Ijebu-Ode Central Distribution Hub</div>
          </div>
        </div>

        {/* Customer & Destination Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-gray-800 text-[11px] block">
              Customer Details
            </span>
            <div className="font-bold text-sm text-gray-900">{currentOrder.customer.fullName}</div>
            <div className="text-gray-600 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{currentOrder.customer.email}</span>
            </div>
            <div className="text-gray-600 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{currentOrder.customer.phone}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-gray-800 text-[11px] block">
              Delivery Destination
            </span>
            <div className="text-gray-700 flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>
                {currentOrder.customer.deliveryAddress}, {currentOrder.customer.city},{' '}
                {currentOrder.customer.state} State, Nigeria
              </span>
            </div>
            {currentOrder.customer.orderNotes && (
              <div className="text-gray-500 pt-1 italic">
                &ldquo;{currentOrder.customer.orderNotes}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Items Summary Table */}
        <div className="p-6 space-y-4">
          <span className="font-bold uppercase tracking-wider text-gray-800 text-[11px] block">
            Items Ordered ({currentOrder.items.length})
          </span>

          <div className="divide-y divide-[#F2ECE0]">
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
                    className="w-12 h-12 rounded-lg object-cover border border-[#E8DFC8]"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block">{item.product.name}</span>
                    <span className="text-gray-500 text-[11px]">
                      Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}{' '}
                      {item.selectedColor ? `| Color: ${item.selectedColor}` : ''}
                    </span>
                  </div>
                </div>
                <div className="font-bold text-gray-900">
                  {formatNaira(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-[#EDE6D6] space-y-2 text-xs text-gray-600 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-bold text-gray-900">{formatNaira(currentOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({currentOrder.customer.state}):</span>
              <span className="font-bold text-gray-900">{formatNaira(currentOrder.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#111] border-t border-[#EDE6D6] pt-2">
              <span>Total Amount:</span>
              <span className="text-[#9E7422] font-serif-luxury text-base">
                {formatNaira(currentOrder.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Instructions according to selected method */}
        <div className="p-6 bg-[#FAF6EE] space-y-3">
          <span className="font-bold uppercase tracking-wider text-gray-800 text-[11px] block">
            Payment & Verification Arrangement
          </span>

          {currentOrder.paymentMethod === 'bank_transfer' && (
            <div className="bg-white p-4 rounded-xl border border-[#DFC377] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Building2 className="w-4 h-4 text-[#9E7422]" />
                <span>Bank Transfer Payment Instructions</span>
              </div>
              <p className="text-gray-600">
                Please make a transfer of <strong>{formatNaira(currentOrder.total)}</strong> with reference <strong>{currentOrder.orderNumber}</strong> to confirm your dispatch:
              </p>
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] space-y-1 font-mono text-xs text-gray-800">
                <div>Bank: <strong>First Bank of Nigeria / Zenith Bank</strong></div>
                <div>Account Name: <strong>RIDHAL VENTURES</strong></div>
                <div>Account Number: <em>(Provided via WhatsApp support on confirmation)</em></div>
              </div>
            </div>
          )}

          {currentOrder.paymentMethod === 'online' && (
            <div className="bg-white p-4 rounded-xl border border-[#DFC377] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <CreditCard className="w-4 h-4 text-[#9E7422]" />
                <span>Online Payment Gateway Logged</span>
              </div>
              <p className="text-gray-600">
                Your order is set to <strong>Pending Payment</strong>. Once our Paystack/Flutterwave gateway keys are connected to the production server, payment will settle automatically. In the interim, you can finalize instantly via WhatsApp below.
              </p>
            </div>
          )}

          {currentOrder.paymentMethod === 'pay_on_delivery' && (
            <div className="bg-white p-4 rounded-xl border border-[#DFC377] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Truck className="w-4 h-4 text-[#9E7422]" />
                <span>Pay on Delivery Scheduled</span>
              </div>
              <p className="text-gray-600">
                Please prepare the exact sum of <strong>{formatNaira(currentOrder.total)}</strong> in cash or instant transfer when our dispatch rider arrives in Ijebu-Ode.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Direct Customer Support Actions & WhatsApp Link */}
      <div className="bg-white rounded-2xl border border-[#E8DFC8] p-6 sm:p-8 text-center space-y-4">
        <h3 className="font-serif-luxury text-xl font-bold text-[#111]">
          Have Questions About Your Order?
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Message us directly with your order reference (<strong>{currentOrder.orderNumber}</strong>) for instant confirmation, tracking, and sizing assistance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/2349165317293?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs inline-flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm on WhatsApp (09165317293)</span>
          </a>

          {/* Call hotline */}
          <a
            href="tel:08054760134"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#121212] hover:bg-[#2C2416] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#C59A45]" />
            <span>Call 08054760134</span>
          </a>
        </div>

        <div className="pt-4 border-t border-[#EDE6D6] flex justify-center">
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold uppercase tracking-wider text-[#9E7422] hover:text-[#735111] inline-flex items-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
