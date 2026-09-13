import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle, Clock } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Product Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 500);
  };

  const whatsappDirectUrl =
    'https://wa.me/2349165317293?text=Hello%20Ridhal%20Ventures,%20I%20am%20contacting%20you%20from%20your%20website%20regarding%20an%20inquiry.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-12">
      
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#9E7422] font-bold">
          Get in Touch
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111] mt-1">
          Contact Ridhal Ventures
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
          Have a question about abaya sizing, bulk orders for events, or delivery to your state? Our team in Ijebu-Ode is ready to assist you.
        </p>
        <div className="w-16 h-0.5 bg-[#C59A45] mx-auto mt-4 rounded-full" />
      </div>

      {/* Main Grid: Info Cards (Col 5) + Contact Form (Col 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Cards (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Physical Address */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-2">
            <div className="flex items-center gap-3 text-gray-900 font-bold text-sm">
              <div className="w-9 h-9 rounded-full bg-[#FAF2DC] text-[#9E7422] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="font-serif-luxury text-base">Store Address</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pl-12">
              5, Bass street, off idomowo, adjacent to new market police station, Ijebu-Ode, Ogun State, Nigeria.
            </p>
          </div>

          {/* Phone Numbers */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-3">
            <div className="flex items-center gap-3 text-gray-900 font-bold text-sm">
              <div className="w-9 h-9 rounded-full bg-[#FAF2DC] text-[#9E7422] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <span className="font-serif-luxury text-base">Phone Hotlines</span>
            </div>
            <div className="pl-12 space-y-2 text-xs text-gray-700">
              <div>
                <a href="tel:09165317293" className="font-bold hover:text-[#9E7422] transition-colors block text-sm">
                  09165317293
                </a>
                <span className="text-[11px] text-gray-400">Customer Support & WhatsApp</span>
              </div>
              <div>
                <a href="tel:08054760134" className="font-bold hover:text-[#9E7422] transition-colors block text-sm">
                  08054760134
                </a>
                <span className="text-[11px] text-gray-400">Store Direct Line</span>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-2">
            <div className="flex items-center gap-3 text-gray-900 font-bold text-sm">
              <div className="w-9 h-9 rounded-full bg-[#FAF2DC] text-[#9E7422] flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <span className="font-serif-luxury text-base">Official Email</span>
            </div>
            <p className="text-xs text-gray-600 pl-12">
              <a
                href="mailto:alhajabizventure@gmail.com"
                className="hover:text-[#9E7422] font-semibold transition-colors break-all"
              >
                alhajabizventure@gmail.com
              </a>
            </p>
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="bg-[#FAF6EE] p-6 rounded-2xl border border-[#DFC377] space-y-3">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-wider">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Instant WhatsApp Chat</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Prefer chatting directly on WhatsApp? Send us product screenshots or custom sizing requirements anytime.
            </p>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase rounded-lg transition-colors shadow-xs gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Us on WhatsApp</span>
            </a>
          </div>

          {/* Operating hours */}
          <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] flex items-center gap-3 text-xs text-gray-600">
            <Clock className="w-4 h-4 text-[#9E7422] flex-shrink-0" />
            <span>Store hours: Monday to Saturday (8:30 AM to 6:30 PM)</span>
          </div>

        </div>

        {/* Contact Form (Col 7) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-6">
          <div className="border-b border-[#F2ECE0] pb-4">
            <h2 className="font-serif-luxury text-xl font-bold text-[#111]">
              Send Us a Direct Message
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Fill out this form and our customer team will respond via phone or email within a few hours.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center space-y-3 bg-[#FAF6EE] rounded-xl border border-[#DFC377]">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-gray-900">
                Message Sent Successfully
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to Ridhal Ventures. We have received your inquiry and will contact you promptly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-xs font-bold uppercase tracking-wider text-[#9E7422] underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Alhaja, Alhaji, Mr, Mrs..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="080... or 090..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Inquiry Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                  >
                    <option value="General Product Inquiry">General Product Inquiry</option>
                    <option value="Abaya / Jalab Sizing">Abaya / Jalab Sizing</option>
                    <option value="Delivery to My State">Delivery to My State</option>
                    <option value="Bulk / Event Orders">Bulk / Event Orders</option>
                    <option value="Store Visit in Ijebu-Ode">Store Visit in Ijebu-Ode</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you today? Let us know what you need..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E8DFC8] focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#9E7422] hover:bg-[#85611B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
