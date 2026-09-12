import React, { useState } from 'react';
import { X, User, Phone, Mail, Package, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../data/products';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateOrder?: () => void;
  onNavigateAccount?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onNavigateOrder,
  onNavigateAccount
}) => {
  const { currentOrder } = useCart();
  const [activeTab, setActiveTab] = useState<'profile' | 'order'>('profile');

  if (!isOpen) return null;

  return (
    <div
      id="account-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        id="account-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-dialog-title"
        className="w-full max-w-md bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E8DFC8] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#121212] px-6 py-5 text-white flex items-center justify-between border-b border-[#2C2416]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C59A45]/20 border border-[#C59A45] flex items-center justify-center text-[#C59A45]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 id="account-dialog-title" className="font-display-royal text-base tracking-wider text-[#F5E4B5]">
                CUSTOMER PORTAL
              </h2>
              <p className="text-xs text-[#A89F91]">Ridhal Ventures Shopper Account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#E8DFC8] bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#C59A45] text-[#121212]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Account Details
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'order'
                ? 'border-[#C59A45] text-[#121212]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Active Order {currentOrder && <span className="w-2 h-2 rounded-full bg-[#C59A45]"></span>}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#E8DFC8] space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-[#C59A45]" />
                  <span className="font-medium">Direct Store Checkout Active</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700">
                  <MapPin className="w-4 h-4 text-[#C59A45]" />
                  <span>Main Hub: Ijebu-Ode, Ogun State</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700">
                  <Phone className="w-4 h-4 text-[#C59A45]" />
                  <span>Support: 09165317293 | 08054760134</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700">
                  <Mail className="w-4 h-4 text-[#C59A45]" />
                  <span>alhajabizventure@gmail.com</span>
                </div>
              </div>

              {onNavigateAccount && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateAccount();
                  }}
                  className="w-full py-2.5 px-4 bg-[#C59A45] hover:bg-[#A87F2F] text-[#121212] font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Open Full Customer Account & Orders</span>
                </button>
              )}

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 mb-3">
                  Need custom measurements or bulk orders for events and ceremonies?
                </p>
                <a
                  href="https://wa.me/2349165317293?text=Hello%20Ridhal%20Ventures,%20I%20would%20like%20to%20inquire%20about%20your%20modest%20fashion%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-[#121212] hover:bg-[#2C2416] text-[#FAF8F5] text-xs font-semibold rounded-lg transition-colors border border-[#C59A45]/40"
                >
                  Chat with Customer Support on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentOrder ? (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-[#E8DFC8]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                          Order Number
                        </span>
                        <div className="font-mono font-bold text-sm text-[#C59A45]">
                          {currentOrder.orderNumber}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF2DC] text-[#8C6316] border border-[#DFC377]">
                        {currentOrder.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 border-t border-[#EDE6D6] pt-2 mt-2 space-y-1">
                      <div>Recipient: <strong className="text-gray-900">{currentOrder.customer?.fullName || currentOrder.customerDetails?.fullName || 'Customer'}</strong></div>
                      <div>Destination: {currentOrder.customer?.city || currentOrder.customerDetails?.city || ''}, {currentOrder.customer?.state || currentOrder.customerDetails?.state || ''}</div>
                      <div>Items: {currentOrder.items?.length || 0} product(s)</div>
                      <div className="font-bold text-gray-900 pt-1">
                        Total: {formatNaira(currentOrder.total)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onNavigateOrder) onNavigateOrder();
                      onClose();
                    }}
                    className="w-full py-2.5 bg-[#C59A45] hover:bg-[#9D7423] text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    View Full Order Summary
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Package className="w-10 h-10 mx-auto text-[#C59A45] mb-2 opacity-50" />
                  <p className="text-sm font-medium text-gray-800">No recent orders</p>
                  <p className="text-xs text-gray-500 mt-1">When you place an order, your order summary and invoice will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
