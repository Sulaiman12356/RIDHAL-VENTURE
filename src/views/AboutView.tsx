import React from 'react';
import { BrandLogo } from '../components/BrandLogo';
import { ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { ActivePage } from '../types';
import abayaBanner from '../assets/images/hero_banner_1789167622411.jpg';

interface AboutViewProps {
  onNavigate: (page: ActivePage) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
      
      {/* Brand Hero Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2DC] border border-[#DFC377] text-xs font-semibold tracking-widest uppercase text-[#9E7422]">
            <span>Our Story & Mission</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111] leading-tight">
            Elevating Modest Fashion in Nigeria
          </h1>

          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Welcome to <strong>RIDHAL VENTURES</strong> — your trusted one-stop boutique for premium Jalab, Abaya, Islamic essentials, English wear, and luxury lifestyle accessories.
          </p>

          <p className="text-sm text-gray-600 leading-relaxed">
            Founded on the principle of <em>&ldquo;Style for Every Occasion,&rdquo;</em> Ridhal Ventures was born out of a desire to provide men, women, and children across Nigeria with modest attire that embodies spiritual reverence, uncompromising quality, and modern sophistication.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3.5 rounded-xl bg-[#9E7422] hover:bg-[#85611B] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <span>Explore Boutique</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Frame */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl border-4 border-[#DFC377] p-2 bg-white shadow-xl overflow-hidden">
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              <img
                src={abayaBanner}
                alt="Ridhal Ventures Modest Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="font-serif-luxury text-lg font-bold">Ijebu-Ode, Ogun State</div>
                  <div className="text-xs text-[#E7CF9B]">Authentic Modest Luxury</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-[#FAF6EE] rounded-3xl border border-[#E8DFC8] p-8 md:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#111]">
            Our Foundational Pillars
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Why families and fashion-conscious individuals across Ogun, Lagos, and Nigeria choose Ridhal Ventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <ShieldCheck className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#111]">
              Uncompromising Quality
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every Jalab, Abaya fabric, and Turkish dress is rigorously checked for stitch strength, opacity, and lasting finish.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <Sparkles className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#111]">
              Affordable Elegance
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We source directly to bring you authentic Middle Eastern and international designs at fair, transparent Naira prices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <Heart className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#111]">
              Dedicated Personal Service
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              From our physical store in Ijebu-Ode to nationwide parcel tracking, our customer care team is always ready to guide your selection.
            </p>
          </div>
        </div>
      </div>

      {/* Official Identity & Store Address */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-8 md:p-12 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <BrandLogo size="lg" variant="compact" theme="light" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#111]">
              Visit Our Flagship Store
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#9E7422] flex-shrink-0 mt-0.5" />
                <span>
                  5, Bass street, off idomowo, adjacent to new market police station, Ijebu-Ode, Ogun State, Nigeria.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#9E7422] flex-shrink-0" />
                <span>09165317293 | 08054760134</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#9E7422] flex-shrink-0" />
                <span>alhajabizventure@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8DFC8] space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-[#111]">Store Hours</h4>
            <div className="text-xs text-gray-600 space-y-1.5">
              <div className="flex justify-between py-1 border-b border-[#EDE6D6]">
                <span>Monday – Friday:</span>
                <strong className="text-gray-900">8:30 AM – 6:30 PM</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDE6D6]">
                <span>Saturday:</span>
                <strong className="text-gray-900">9:00 AM – 7:00 PM</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Sunday:</span>
                <strong className="text-gray-900">12:00 PM – 5:00 PM</strong>
              </div>
            </div>
            <div className="pt-2">
              <a
                href="https://wa.me/2349165317293"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#121212] hover:bg-[#2C2416] text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Inquire Ahead on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
