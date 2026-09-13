import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  HelpCircle, 
  FileText, 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  ArrowLeft 
} from 'lucide-react';
import { ActivePage } from '../types';

interface PolicyPageViewProps {
  pageType: 'privacy' | 'terms' | 'shipping-policy' | 'refund-policy' | 'faqs';
  onNavigate: (page: ActivePage) => void;
}

export const PolicyPageView: React.FC<PolicyPageViewProps> = ({ pageType, onNavigate }) => {
  // FAQs accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  const FAQS_DATA = [
    {
      question: "Where is Ridhal Ventures located, and can I pick up in person?",
      answer: "Yes! Our walk-in store is located at 5, Bass street, off idomowo, adjacent to new market police station, Ijebu-Ode, Ogun State, Nigeria. You are welcome to visit our physical showroom during business hours (Monday to Saturday: 8:00 AM to 6:30 PM) for fitting, fabric inspection, or immediate order pickup."
    },
    {
      question: "How long does delivery take within Ijebu-Ode and across Nigeria?",
      answer: "Orders within Ijebu-Ode central are delivered Same Day or within 24 hours via local dispatch riders. Neighboring Ogun State towns (Abeokuta, Sagamu, Ago-Iwoye) and Lagos State take 1 to 2 business days. South-West states take 2 to 3 business days, while Abuja (FCT), South-East, and Northern states take 3 to 5 business days via established nationwide logistics partners."
    },
    {
      question: "What payment methods are supported?",
      answer: "We accept Instant Direct Bank Transfer to our official Moniepoint Microfinance Bank account (Account Name: RIDHAL VENTURES), automated Online Debit Card payment via Paystack/Flutterwave, and Pay on Delivery (available exclusively for selected local delivery zones within Ijebu-Ode)."
    },
    {
      question: "How do I choose the correct Jalab or Abaya size?",
      answer: "Abayas and Jalabs are traditionally sized by height in inches (Size 52 fits 5'0\" to 5'2\", Size 54 fits 5'3\" to 5'5\", Size 56 fits 5'6\" to 5'8\", Size 58 fits 5'9\" to 6'0\"). Standard men's and women's clothing also offer standard S, M, L, XL, XXL. If you are unsure, you can click the WhatsApp support button and our personal styling assistant will guide your exact measurements."
    },
    {
      question: "What is your Return and Exchange Policy?",
      answer: "We offer a 48-hour return and exchange window from the time of delivery for unworn items in their original packaging with tags intact. If an item does not fit or has a manufacturing defect, contact us immediately via WhatsApp at 09165317293 or 08054760134 to arrange an exchange."
    },
    {
      question: "Are the fabrics genuine and authentic?",
      answer: "Absolutely. Every piece at Ridhal Ventures, from our Emirati Nidha abayas to Turkish prayer rugs, Egyptian cotton underwear, and hand-embroidered Omani jalabs, is hand-selected and quality-inspected to guarantee superior comfort, durability, and modesty."
    },
    {
      question: "Can I place custom wholesale or bridal orders?",
      answer: "Yes, we cater to bridal trousseaus, Islamic school uniforms, Ramadan gift hampers, and wholesale distribution. Please email alhajabizventure@gmail.com or chat directly with our store manager on WhatsApp."
    }
  ];

  return (
    <div className="min-h-[80vh] bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation back */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#736B63] hover:text-[#121212] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store Home
        </button>

        {/* Tab switchers */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[#E5DFD5]">
          <button
            onClick={() => onNavigate('shipping-policy')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              pageType === 'shipping-policy'
                ? 'bg-[#121212] text-white'
                : 'bg-white border border-[#E5DFD5] text-[#736B63] hover:text-[#121212]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Shipping & Delivery
          </button>
          <button
            onClick={() => onNavigate('refund-policy')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              pageType === 'refund-policy'
                ? 'bg-[#121212] text-white'
                : 'bg-white border border-[#E5DFD5] text-[#736B63] hover:text-[#121212]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Returns & Exchanges
          </button>
          <button
            onClick={() => onNavigate('faqs')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              pageType === 'faqs'
                ? 'bg-[#121212] text-white'
                : 'bg-white border border-[#E5DFD5] text-[#736B63] hover:text-[#121212]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </button>
          <button
            onClick={() => onNavigate('privacy')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              pageType === 'privacy'
                ? 'bg-[#121212] text-white'
                : 'bg-white border border-[#E5DFD5] text-[#736B63] hover:text-[#121212]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            onClick={() => onNavigate('terms')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              pageType === 'terms'
                ? 'bg-[#121212] text-white'
                : 'bg-white border border-[#E5DFD5] text-[#736B63] hover:text-[#121212]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Service
          </button>
        </div>

        {/* CONTENT CONTAINER */}
        <div className="bg-white border border-[#E5DFD5] rounded-xl shadow-xs p-6 sm:p-10 text-[#121212]">
          {/* 1. SHIPPING POLICY */}
          {pageType === 'shipping-policy' && (
            <div className="space-y-6">
              <div className="border-b border-[#E5DFD5] pb-6">
                <span className="text-xs font-semibold text-[#9E7422] uppercase tracking-wider">
                  Logistics & Dispatch Information
                </span>
                <h1 className="text-3xl font-serif text-[#121212] mt-2">
                  Shipping & Delivery Policy
                </h1>
                <p className="text-xs text-[#736B63] mt-2">
                  Last Updated: March 2026 • Ridhal Ventures, Ijebu-Ode, Ogun State
                </p>
              </div>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">1. Physical Store Pickup (Ijebu-Ode)</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  Customers residing in or visiting Ijebu-Ode may opt for complimentary in-store pickup at our official branch located at <strong>5, Bass street, off idomowo, adjacent to new market police station, Ijebu-Ode, Ogun State</strong>. Orders placed for pickup are ready within 2 hours during store working hours.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">2. Delivery Zones & Estimated Timelines</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-[#E5DFD5] rounded-lg">
                    <thead className="bg-[#FAF8F5] text-[#121212] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-3 border-b border-[#E5DFD5]">Destination Zone</th>
                        <th className="p-3 border-b border-[#E5DFD5]">Estimated Transit Time</th>
                        <th className="p-3 border-b border-[#E5DFD5]">Courier Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DFD5] text-[#736B63]">
                      <tr>
                        <td className="p-3 font-medium text-[#121212]">Ijebu-Ode Metropolis (Central, Molipa, Apebi, Bass St)</td>
                        <td className="p-3">Same Day / Within 24 Hours</td>
                        <td className="p-3">Dedicated Local Dispatch Rider</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-[#121212]">Ijebu Environs (Ago-Iwoye, Ijebu-Igbo, Oru, Obalende)</td>
                        <td className="p-3">1 to 2 Business Days</td>
                        <td className="p-3">Intrastate Transit Rider</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-[#121212]">Ogun State Other (Abeokuta, Sagamu, Mowe, Ibafo)</td>
                        <td className="p-3">1 to 3 Business Days</td>
                        <td className="p-3">Statewide Courier Network</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-[#121212]">Lagos State (Mainland, Island, Lekki, Ikeja)</td>
                        <td className="p-3">1 to 2 Business Days</td>
                        <td className="p-3">Express Interstate Courier</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-[#121212]">South-West (Oyo/Ibadan, Osun, Ondo, Ekiti, Kwara)</td>
                        <td className="p-3">2 to 3 Business Days</td>
                        <td className="p-3">Regional Transit Logistics</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-[#121212]">Abuja FCT, Kano, Kaduna, Port Harcourt, Enugu</td>
                        <td className="p-3">3 to 5 Business Days</td>
                        <td className="p-3">National Air Cargo / Motor Park Hub</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">3. Order Dispatch Notification & Tracking</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  Upon dispatch from our Ijebu-Ode store, customers receive an automated notification with their unique order tracking code (e.g. <code>RV-2026-XXXX</code>) and the contact details of the designated driver or carrier. You can view real-time stage progression at any time on our <strong>Track Order</strong> page.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">4. Address Accuracy & Receiver Availability</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  Please provide accurate street names, prominent landmarks, and an active Nigerian telephone line. If the recipient is unavailable at the agreed delivery time, a re-dispatch surcharge may apply.
                </p>
              </section>
            </div>
          )}

          {/* 2. RETURN & REFUND POLICY */}
          {pageType === 'refund-policy' && (
            <div className="space-y-6">
              <div className="border-b border-[#E5DFD5] pb-6">
                <span className="text-xs font-semibold text-[#9E7422] uppercase tracking-wider">
                  Customer Satisfaction Guarantee
                </span>
                <h1 className="text-3xl font-serif text-[#121212] mt-2">
                  Returns & Exchanges Policy
                </h1>
                <p className="text-xs text-[#736B63] mt-2">
                  Last Updated: March 2026 • Ridhal Ventures
                </p>
              </div>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">1. 48-Hour Inspection & Return Window</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  We take pride in delivering pristine modesty wear. If you receive an item that is defective, damaged in transit, or does not match the ordered size/color, you must notify us within <strong>48 hours of delivery confirmation</strong>.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">2. Eligibility Criteria for Exchange</h2>
                <ul className="list-disc pl-5 text-sm text-[#736B63] space-y-2">
                  <li>Items must be unworn, unwashed, unaltered, and free of perfumes, makeup stains, or odors.</li>
                  <li>Original tags, polybags, and accessories (such as matching hijabs or belts) must be intact.</li>
                  <li>Due to health and hygiene regulations, intimate items (such as singlets, boxers, and undergarments) cannot be returned once opened unless a verified manufacturing defect exists.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">3. Size Exchanges</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  We gladly facilitate size exchanges for Jalabs, Abayas, and footwear subject to stock availability in our warehouse. The customer is responsible for the courier return transit fee, while Ridhal Ventures covers the dispatch fee of the replacement item for verified errors.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">4. How to Initiate a Return</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  To start a return or exchange, message our customer support team on WhatsApp at <strong>09165317293</strong> or email <strong>alhajabizventure@gmail.com</strong> with your Order Number and clear photos of the product. Our team will review and guide your return within 12 business hours.
                </p>
              </section>
            </div>
          )}

          {/* 3. FAQS */}
          {pageType === 'faqs' && (
            <div className="space-y-6">
              <div className="border-b border-[#E5DFD5] pb-6">
                <span className="text-xs font-semibold text-[#9E7422] uppercase tracking-wider">
                  Knowledge Base & Help Desk
                </span>
                <h1 className="text-3xl font-serif text-[#121212] mt-2">
                  Frequently Asked Questions
                </h1>
                <p className="text-xs text-[#736B63] mt-2">
                  Find answers regarding our luxury jalabs, delivery logistics to Ijebu-Ode & nationwide, payments, and fabrics.
                </p>
              </div>

              <div className="space-y-3">
                {FAQS_DATA.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="border border-[#E5DFD5] rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left p-4 sm:p-5 flex justify-between items-center gap-4 bg-white hover:bg-[#FAF8F5] transition-colors"
                      >
                        <span className="text-sm sm:text-base font-medium text-[#121212]">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#9E7422] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#E5DFD5] text-xs sm:text-sm text-[#736B63] leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Need more help banner */}
              <div className="mt-8 p-6 bg-[#F6F2EA] border border-[#DFC377] rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#121212]">Still have questions?</h4>
                  <p className="text-xs text-[#736B63] mt-0.5">Our support team in Ijebu-Ode is here to assist you daily.</p>
                </div>
                <a
                  href="https://wa.me/2349165317293?text=Hello%20Ridhal%20Ventures,%20I%20have%20a%20question%20about%20your%20store."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium inline-flex items-center gap-2 shrink-0 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* 4. PRIVACY POLICY */}
          {pageType === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-[#E5DFD5] pb-6">
                <span className="text-xs font-semibold text-[#9E7422] uppercase tracking-wider">
                  Data Protection & Privacy
                </span>
                <h1 className="text-3xl font-serif text-[#121212] mt-2">
                  Privacy Policy
                </h1>
                <p className="text-xs text-[#736B63] mt-2">
                  Compliant with Nigeria Data Protection Act (NDPA) • Ridhal Ventures
                </p>
              </div>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">1. Information We Collect</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  When you place an order or create an account with Ridhal Ventures, we collect personal information strictly required to fulfill your purchase, including: your full name, email address, Nigerian delivery address, contact phone number, and transaction history.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">2. How We Use Your Data</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  Your information is utilized solely to:
                </p>
                <ul className="list-disc pl-5 text-sm text-[#736B63] space-y-1">
                  <li>Process, package, and deliver your orders accurately.</li>
                  <li>Transmit SMS/WhatsApp/email delivery updates and order receipts.</li>
                  <li>Enable account features such as saved addresses and order history.</li>
                  <li>Maintain store security and prevent fraudulent transactions.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">3. Payment Security & Zero Card Storage</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  Ridhal Ventures does NOT store, process, or transmit your credit/debit card numbers or bank PINs on our servers. All digital payments are processed through PCI-DSS Level 1 certified payment gateways (Paystack / Flutterwave) using bank-grade end-to-end tokenization and encryption.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">4. Third-Party Sharing</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  We never sell, rent, or trade your personal information. We only share necessary delivery details (recipient name, address, and phone number) with trusted logistics couriers and dispatch riders for fulfillment purposes.
                </p>
              </section>
            </div>
          )}

          {/* 5. TERMS OF SERVICE */}
          {pageType === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-[#E5DFD5] pb-6">
                <span className="text-xs font-semibold text-[#9E7422] uppercase tracking-wider">
                  Commercial Agreement
                </span>
                <h1 className="text-3xl font-serif text-[#121212] mt-2">
                  Terms and Conditions
                </h1>
                <p className="text-xs text-[#736B63] mt-2">
                  Official Terms of Sale • Ridhal Ventures, Ijebu-Ode, Ogun State
                </p>
              </div>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">1. Acceptance of Terms</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  By accessing or purchasing goods from the Ridhal Ventures website or physical store, you agree to be bound by these Terms and Conditions and our associated Shipping and Return policies.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">2. Product Availability & Pricing</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  All prices are listed in Nigerian Naira (₦). While we endeavor to maintain precise real-time inventory levels, luxury modest pieces are imported and subject to stock turnover. In the rare event an ordered item is out of stock, we will contact you immediately to offer an alternative or a prompt full refund.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">3. Bank Transfer Payment Verification</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  When selecting Direct Bank Transfer, orders are placed in <em>Payment Pending</em> status until funds reflect in our official Moniepoint account (Account Name: RIDHAL VENTURES). Customers are advised to forward their transfer receipt with their Order Number to 09165317293 or 08054760134.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif text-[#121212]">4. Governing Law</h2>
                <p className="text-sm text-[#736B63] leading-relaxed">
                  These terms are governed by and construed in accordance with the Laws of Ogun State and the Federal Republic of Nigeria. Any disputes shall be submitted to the competent courts of Ogun State, Nigeria.
                </p>
              </section>
            </div>
          )}

          {/* Business details footer */}
          <div className="mt-10 pt-6 border-t border-[#E5DFD5] text-xs text-[#736B63] space-y-1">
            <p className="font-semibold text-[#121212]">RIDHAL VENTURES (Style for Every Occasion)</p>
            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#9E7422]" /> 5, Bass street, off idomowo, adjacent to new market police station, Ijebu-Ode, Ogun State, Nigeria.</p>
            <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#9E7422]" /> 09165317293, 08054760134</p>
            <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#9E7422]" /> alhajabizventure@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
