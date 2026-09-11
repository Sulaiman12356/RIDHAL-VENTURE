import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center px-4 py-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E8DFC8] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#121212] px-6 py-5 text-white flex items-center justify-between border-b border-[#2C2416]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C59A45]/20 border border-[#C59A45] flex items-center justify-center text-[#C59A45]">
              {type === 'privacy' ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-display-royal text-base tracking-wider text-[#F5E4B5]">
                {type === 'privacy' ? 'PRIVACY POLICY' : 'TERMS & CONDITIONS'}
              </h2>
              <p className="text-xs text-[#A89F91]">Ridhal Ventures • Official Guidelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Ridhal Ventures</strong> is committed to safeguarding the privacy and personal details of our customers. This privacy notice outlines how your information is collected, protected, and used when shopping on our platform or visiting our store in Ijebu-Ode, Ogun State.
              </p>
              <h3 className="font-bold text-sm text-gray-900 pt-2">1. Information We Collect</h3>
              <p>
                When you place an order or contact our boutique, we collect necessary contact information including your full name, email address, phone number, and physical delivery address in Nigeria.
              </p>
              <h3 className="font-bold text-sm text-gray-900 pt-2">2. How We Use Your Information</h3>
              <p>
                Your data is exclusively utilized to:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Process and deliver your fashion and modest lifestyle orders.</li>
                <li>Communicate shipment dispatch notices and tracking details via phone or WhatsApp.</li>
                <li>Provide personalized customer support and answer tailoring or sizing inquiries.</li>
              </ul>
              <h3 className="font-bold text-sm text-gray-900 pt-2">3. Data Protection</h3>
              <p>
                We do not sell, lease, or rent your personal information to third parties. All order records are stored with high security and privacy standards.
              </p>
              <h3 className="font-bold text-sm text-gray-900 pt-2">4. Contacting Our Data Custodian</h3>
              <p>
                For questions regarding your saved information, contact us at <strong>alhajabizventure@gmail.com</strong> or call <strong>09165317293</strong>.
              </p>
            </>
          ) : (
            <>
              <p>
                Welcome to <strong>Ridhal Ventures</strong>. By accessing our ecommerce store, ordering items, or communicating with our team, you agree to comply with the following operational terms:
              </p>
              <h3 className="font-bold text-sm text-gray-900 pt-2">1. Product Authenticity & Imagery</h3>
              <p>
                All products displayed in our catalog represent authentic Ridhal Ventures inventory sourced for modest elegance. Minor variations in fabric sheen or lighting may occur between digital screens and physical apparel.
              </p>
              <h3 className="font-bold text-sm text-gray-900 pt-2">2. Pricing & Currency</h3>
              <p>
                All product prices are stated in Nigerian Naira (₦). Prices are subject to change without prior notice, but orders already placed and confirmed will not be affected by subsequent price alterations.
              </p>
              <h3 className="font-bold text-sm text-gray-900 pt-2">3. Delivery & Dispatch</h3>
              <p>
                Delivery timelines across Nigerian states depend on logistics routing from our Ijebu-Ode hub. We endeavor to ensure rapid dispatch and will provide direct phone/WhatsApp updates.
              </p>
              <h3 className="font-bold text-sm text-gray-900 pt-2">4. Store Governance</h3>
              <p>
                Ridhal Ventures operates under Nigerian commercial law, with physical store operations based at 5, Bass street, off idomowo, adjacent to new market police station, Ijebu-Ode, Ogun State.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E8DFC8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#121212] hover:bg-[#2C2416] text-white text-xs font-bold uppercase rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
