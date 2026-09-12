import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  MapPin, 
  AlertCircle, 
  MessageCircle, 
  ArrowLeft, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Order, OrderStatus, ActivePage } from '../types';
import { trackOrder, ORDER_STATUS_STEPS, getOrderStatusStepIndex, normalizeOrderStatus } from '../services/trackingService';
import { formatNaira } from '../data/products';

interface OrderTrackingViewProps {
  initialOrderNumber?: string;
  onNavigate: (page: ActivePage, extra?: any) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ 
  initialOrderNumber = '', 
  onNavigate 
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialOrderNumber) {
      handleSearch(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = async (queryToUse?: string) => {
    const q = (queryToUse || orderQuery).trim();
    if (!q) {
      setError('Please enter your Order Reference Number (e.g. RV-2026-XXXX).');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await trackOrder(q);
      if (result) {
        setOrder(result);
        setError(null);
      } else {
        setOrder(null);
        setError(`No order found matching "${q}". Please double check your order number or contact our WhatsApp support desk.`);
      }
    } catch (err: any) {
      setError('An error occurred while tracking your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? getOrderStatusStepIndex(order.orderStatus || order.status) : 0;
  const isCancelled = order && normalizeOrderStatus(order.orderStatus || order.status) === 'Cancelled';

  return (
    <div className="min-h-[80vh] bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#736B63] hover:text-[#121212] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-widest text-[#9E7422] uppercase">
            Live Dispatch & Transit
          </span>
          <h1 className="text-3xl font-serif text-[#121212] mt-2">
            Track Your Order
          </h1>
          <p className="text-sm text-[#736B63] max-w-lg mx-auto mt-2">
            Enter your order reference code (received during checkout or via email) to view real-time delivery status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-[#E5DFD5] rounded-xl shadow-xs p-3 sm:p-4 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#736B63] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter Order Reference (e.g. RV-2026-ABCD or ID)"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-sm focus:outline-none focus:border-[#9E7422]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#121212] hover:bg-[#2A2A2A] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Track Package</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <div className="flex justify-center gap-3">
              <a
                href={`https://wa.me/2349165317293?text=${encodeURIComponent(
                  `Hello Ridhal Ventures, I am trying to track order ${orderQuery} but couldn't find it.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact WhatsApp Support
              </a>
            </div>
          </div>
        )}

        {/* ORDER DETAILS & TIMELINE */}
        {order && (
          <div className="bg-white border border-[#E5DFD5] rounded-xl shadow-xs overflow-hidden">
            {/* Header info */}
            <div className="p-6 bg-[#FBF9F6] border-b border-[#E5DFD5] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-[#9E7422] uppercase tracking-wider">
                  Order Status
                </span>
                <h2 className="text-2xl font-serif text-[#121212] mt-0.5">
                  {order.orderNumber || order.id}
                </h2>
                <p className="text-xs text-[#736B63] mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Placed: {new Date(order.createdAt).toLocaleString('en-NG', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>

              <div className="text-right">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold border ${
                  isCancelled 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : ORDER_STATUS_STEPS[currentStep]?.badgeColor || 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {order.orderStatus || order.status || 'Order received'}
                </span>
                <p className="text-xs text-[#736B63] mt-1">
                  Payment: <strong className="text-[#121212]">{order.paymentStatus}</strong> ({order.paymentMethod?.replace(/_/g, ' ')})
                </p>
              </div>
            </div>

            {/* CANCELLED NOTICE */}
            {isCancelled ? (
              <div className="p-8 bg-red-50/50 border-b border-red-100 text-center">
                <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
                <h3 className="text-lg font-serif text-red-900">Order Cancelled</h3>
                <p className="text-xs text-red-700 max-w-md mx-auto mt-1">
                  This order has been cancelled. If you believe this is an error or already made a bank transfer, please reach out to our support team immediately with your proof of payment.
                </p>
              </div>
            ) : (
              /* PROGRESS STEPPER (7 STAGES) */
              <div className="p-6 sm:p-8 border-b border-[#E5DFD5]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-6">
                  Fulfillment Progress
                </h3>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden md:block absolute top-5 left-4 right-4 h-0.5 bg-[#E5DFD5] -z-0">
                    <div 
                      className="h-full bg-[#9E7422] transition-all duration-500"
                      style={{ width: `${(currentStep / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative z-10">
                    {ORDER_STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={idx} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                              isCurrent
                                ? 'bg-[#9E7422] border-[#9E7422] text-white shadow-md'
                                : isCompleted
                                ? 'bg-[#FAF8F5] border-[#9E7422] text-[#9E7422]'
                                : 'bg-[#FAF8F5] border-[#E5DFD5] text-[#A8A096]'
                            }`}
                          >
                            {isCompleted && !isCurrent ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="text-xs font-bold">{idx + 1}</span>
                            )}
                          </div>

                          <div className="text-left md:text-center">
                            <p className={`text-xs font-semibold ${isCurrent ? 'text-[#9E7422]' : isCompleted ? 'text-[#121212]' : 'text-[#736B63]'}`}>
                              {step.title}
                            </p>
                            <p className="text-[11px] text-[#736B63] line-clamp-2 mt-0.5">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Carrier & Delivery Notes */}
            {(order.carrierName || order.trackingNotes) && (
              <div className="p-6 bg-[#FAF8F5] border-b border-[#E5DFD5]">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[#9E7422] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#121212]">
                      Courier & Transit Information
                    </h4>
                    {order.carrierName && (
                      <p className="text-xs text-[#736B63] mt-1">
                        Assigned Courier / Dispatch Rider: <strong className="text-[#121212]">{order.carrierName}</strong>
                      </p>
                    )}
                    {order.trackingNotes && (
                      <p className="text-xs text-[#736B63] mt-1 bg-white p-3 rounded border border-[#E5DFD5]">
                        "{order.trackingNotes}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Delivery address & items overview */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Delivery Address */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#9E7422]" />
                  Shipping Destination
                </h4>
                <div className="bg-[#FAF8F5] p-4 rounded-lg border border-[#E5DFD5] text-xs space-y-1">
                  <p className="font-bold text-[#121212]">{order.customerDetails?.fullName}</p>
                  <p className="text-[#736B63]">{order.customerDetails?.deliveryAddress}</p>
                  <p className="text-[#736B63]">{order.customerDetails?.city}, {order.customerDetails?.state} State, Nigeria</p>
                  <p className="text-[#736B63] pt-1">Phone: <strong className="text-[#121212]">{order.customerDetails?.phone}</strong></p>
                  {order.customerDetails?.orderNotes && (
                    <p className="text-[#736B63] pt-1 italic">Note: {order.customerDetails?.orderNotes}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#9E7422]" />
                  Package Contents ({order.items?.length || 0} item types)
                </h4>
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-[#E5DFD5]">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.images?.[0]}
                          alt={item.product?.name}
                          className="w-10 h-10 rounded object-cover bg-[#F6F2EA]"
                        />
                        <div>
                          <p className="font-medium text-[#121212]">{item.product?.name}</p>
                          <p className="text-[#736B63]">
                            Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-[#121212]">
                        {formatNaira(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2 text-xs space-y-1">
                    <div className="flex justify-between text-[#736B63]">
                      <span>Delivery Fee</span>
                      <span>{formatNaira(order.deliveryFee)}</span>
                    </div>
                    {order.discountAmount && order.discountAmount > 0 ? (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount ({order.appliedCoupon})</span>
                        <span>-{formatNaira(order.discountAmount)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-sm font-bold text-[#121212] pt-2 border-t border-[#E5DFD5]">
                      <span>Total Paid/Payable</span>
                      <span className="text-[#9E7422]">{formatNaira(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Support Action */}
            <div className="p-6 bg-[#FBF9F6] border-t border-[#E5DFD5] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-[#736B63]">
                <ShieldCheck className="w-4 h-4 text-[#9E7422]" />
                <span>Protected by Ridhal Ventures Quality & Delivery Guarantee</span>
              </div>

              <a
                href={`https://wa.me/2349165317293?text=${encodeURIComponent(
                  `Hello Ridhal Ventures, I am inquiring about the delivery timeline of order ${order.orderNumber || order.id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Dispatch Team on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
