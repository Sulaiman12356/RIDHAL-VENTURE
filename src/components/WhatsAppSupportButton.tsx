import React, { useState } from 'react';
import { MessageCircle, X, Phone, Clock, MapPin, Send } from 'lucide-react';

export const WhatsAppSupportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const primaryPhone = '2349165317293';
  const secondaryPhone = '2348054760134';

  const QUICK_QUESTIONS = [
    'Hello Ridhal Ventures, I would like to inquire about Jalab/Abaya sizing.',
    'Hello! Do you have same-day delivery to my location in Ijebu-Ode?',
    'Hello Ridhal Ventures, I would like to verify an order status.',
    'Hello, do you offer wholesale or event packages?'
  ];

  const handleSend = (textToSend?: string) => {
    const message = textToSend || customMsg || 'Hello Ridhal Ventures, I would like to make an inquiry.';
    const url = `https://wa.me/${primaryPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded chat card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-88 bg-white border border-[#E5DFD5] rounded-2xl shadow-xl overflow-hidden mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="bg-[#121212] text-white p-4 flex items-center justify-between border-b border-[#9E7422]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide">Ridhal Ventures Desk</h4>
                <p className="text-[11px] text-[#DFC377] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  Online • Ijebu-Ode, Ogun State
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#FAF8F5] space-y-3 text-xs text-[#736B63]">
            <div className="bg-white p-3 rounded-xl border border-[#E5DFD5] shadow-2xs">
              <p className="text-[#121212] font-medium">As-salamu alaykum! Welcome to Ridhal Ventures.</p>
              <p className="mt-1">How may we assist your modesty wear or Islamic lifestyle order today?</p>
            </div>

            {/* Quick action buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#9E7422]">
                Quick Questions:
              </span>
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-2 bg-white hover:bg-[#F6F2EA] border border-[#E5DFD5] rounded-lg text-[11px] text-[#121212] transition-colors leading-tight"
                >
                  "{q}"
                </button>
              ))}
            </div>

            {/* Direct custom text */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 bg-white border border-[#E5DFD5] rounded-lg text-xs text-[#121212] focus:outline-none focus:border-[#9E7422]"
              />
              <button
                onClick={() => handleSend()}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct Phone Lines */}
            <div className="pt-2 border-t border-[#E5DFD5] text-[11px] flex justify-between items-center text-[#736B63]">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#9E7422]" /> Call Lines:
              </span>
              <span className="font-semibold text-[#121212]">09165317293 • 08054760134</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group relative"
        aria-label="Customer Support on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] text-white font-bold items-center justify-center">1</span>
        </span>
      </button>
    </div>
  );
};
