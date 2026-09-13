import React from 'react';
import { BrandLogo } from '../components/BrandLogo';
import { 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  BookOpen, 
  Shirt, 
  Watch, 
  Gem, 
  Truck, 
  Clock,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
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
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF2DC] border border-[#DFC377] text-xs font-semibold tracking-widest uppercase text-[#9E7422]">
            <span>Our Heritage and Mission</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111] leading-tight">
            Elevating Modest Fashion and Islamic Elegance in Nigeria
          </h1>

          <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-medium">
            Welcome to <strong>RIDHAL VENTURES</strong>, your premier destination for authentic Jalab, Abaya, Islamic essentials, English wears, and luxury lifestyle accessories.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            Founded under the guiding motto <em>&ldquo;Style for Every Occasion,&rdquo;</em> Ridhal Ventures was born out of a profound commitment to make timeless modesty, graceful fashion, and spiritual essentials accessible to every family. What began as a passionate mission in Ijebu-Ode, Ogun State has flourished into a trusted brand chosen by clients across all thirty six states of Nigeria.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            We believe true elegance requires neither compromise on modesty nor compromise on comfort. Whether you are adorning yourself for Jummah prayers, preparing for Eid celebrations, dressing for a formal corporate engagement, or gifting a loved one a revered edition of the Holy Quran, Ridhal Ventures delivers carefully curated pieces that reflect dignified beauty, exceptional craftsmanship, and enduring value.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3.5 rounded-xl bg-[#9E7422] hover:bg-[#85611B] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>Explore The Boutique</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-[#F2ECE0] text-[#111] border border-[#DFC377] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs inline-flex items-center gap-2"
            >
              <span>Visit Our Showroom</span>
            </button>
          </div>
        </div>

        {/* Visual Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl border-4 border-[#DFC377] p-2 bg-white shadow-xl overflow-hidden">
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              <img
                src={abayaBanner}
                alt="Ridhal Ventures Modest Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="font-serif-luxury text-xl font-bold text-white">Ijebu-Ode Flagship Store</div>
                  <div className="text-xs text-[#E7CF9B] font-medium">Style for Every Occasion</div>
                  <p className="text-[11px] text-gray-300">Adjacent to New Market Police Station, Ogun State</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Product Specializations */}
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#9E7422] font-bold">
            Curated Department Specializations
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111]">
            What We Specialize In at Ridhal Ventures
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Every department in our boutique is curated with attention to stitch durability, fabric breathability, and authentic styling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Item 1: Jalab & Abaya */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3 hover:border-[#C59A45] transition-colors shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <Shirt className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#111]">
              Jalab and Abaya for Adults and Children
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Exquisite Dubai and Saudi cut abayas made from premium Nidha, crepe, and linen fabrics, paired with tailored Moroccan and Emirati jalabs for men, women, and youth. Each piece offers generous modest draping, intricate embroidery, and lasting elegance.
            </p>
          </div>

          {/* Item 2: Scarfs & Hijabs */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3 hover:border-[#C59A45] transition-colors shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <Sparkles className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#111]">
              Jersey, Chiffon Scarfs, Malaysia and Indonesia Hijabs
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Breathable, lightweight, and non slip wraps suited for all weather. Our collection features premium stretch jersey scarfs, airy bubble chiffon, and authentic Malaysian and Indonesian instant and pleated hijabs in rich, modest color palettes.
            </p>
          </div>

          {/* Item 3: Islamic Essentials */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3 hover:border-[#C59A45] transition-colors shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <BookOpen className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#111]">
              Holy Quran, Praying Mats and Prayer Counters
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Clear script Arabic Qurans, alongside English and Yoruba translations with color coded Tajweed. We also provide plush memory foam Turkish praying mats and durable digital and crystal bead prayer counters (Tasbih) for your spiritual devotions.
            </p>
          </div>

          {/* Item 4: English Dresses */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3 hover:border-[#C59A45] transition-colors shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <Sparkles className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#111]">
              English Dresses, Turkey and China Wears
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Contemporary international fashion for modern women. From tailored Turkish formal gowns and midi shirts to chic China import wears, our selections blend modesty with workplace and ceremonial sophistication.
            </p>
          </div>

          {/* Item 5: Jewelries, Shoes and Bags */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3 hover:border-[#C59A45] transition-colors shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <Gem className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#111]">
              Jewelries, Shoes and Luxury Bags
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Complete your ensemble with gold plated and zircon jewelries, anti tarnish necklaces, and coordinating footwear and handbags. Built for celebratory outings, weddings, and formal occasions with unmatched grace.
            </p>
          </div>

          {/* Item 6: Watches, Singlets & Boxers */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3 hover:border-[#C59A45] transition-colors shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <Watch className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#111]">
              Wrist Watches, Singlets and Boxers
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Refined quartz and automatic luxury wrist watches for men and women, alongside pure combed Egyptian cotton singlets and elasticated boxers for everyday hygiene, breathable under-abaya comfort, and long lasting resilience.
            </p>
          </div>

        </div>
      </div>

      {/* Foundational Pillars */}
      <div className="bg-[#FAF6EE] rounded-3xl border border-[#E8DFC8] p-8 md:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#111]">
            Our Foundational Pillars
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            The core values that guide our service to families across Ogun State, Lagos, and throughout Nigeria.
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
              Every garment, prayer rug, and jewelry set is individually inspected by our team for fabric density, seam resilience, and lasting luster prior to customer dispatch.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <Sparkles className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#111]">
              Transparent Honest Pricing
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              By working directly with international weavers and manufacturers, we bypass costly third party intermediaries to deliver authentic modest luxury at equitable, fair prices in Nigerian Naira.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#C59A45] flex items-center justify-center text-[#E7CF9B]">
              <Heart className="w-6 h-6 text-[#DFC377]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#111]">
              Warm Personal Service
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              From sizing advice on WhatsApp to custom gift packaging for Ramadan and weddings, our dedicated associates treat every shopper like an honored family guest.
            </p>
          </div>
        </div>
      </div>

      {/* Nationwide Fulfillment Promise */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-8 md:p-12 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#9E7422] font-bold">
              <Truck className="w-4 h-4 text-[#9E7422]" />
              <span>Logistics and Customer Care</span>
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#111]">
              From Ijebu-Ode to Your Doorstep Anywhere in Nigeria
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We operate an efficient fulfillment workflow ensuring your orders are packed securely in protective sleeves and dispatched promptly.
            </p>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Same day and next day delivery across Ijebu-Ode metropolis.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1 to 2 business days rapid transit to Lagos and Ogun State towns.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2 to 4 business days nationwide parcel delivery with live tracking codes.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free store pickup available at our Ijebu-Ode walk-in showroom.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#DFC377]/60 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#121212] text-[#E7CF9B] border border-[#C59A45] flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 text-[#DFC377]" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-[#111]">
              Need Help Choosing the Right Size or Fabric?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our stylists are available on WhatsApp to share video close ups of fabrics, verify height measurements for abayas, and answer any styling inquiries.
            </p>
            <div>
              <a
                href="https://wa.me/2349165317293?text=Hello%20Ridhal%20Ventures,%20I%20would%20like%20guidance%20on%20sizing%20and%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#121212] hover:bg-[#2A2A2A] text-white text-xs font-bold uppercase rounded-xl transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat with Our Stylist on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Official Identity & Flagship Store Address */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-8 md:p-12 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <BrandLogo size="lg" variant="compact" theme="light" />
            <h3 className="font-serif-luxury text-2xl font-bold text-[#111]">
              Visit Our Walk-in Boutique Showroom
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Experience the quality firsthand. We invite you to visit our walk-in store for fittings, personal fabric inspection, or immediate pickup of online reservations.
            </p>
            
            <div className="space-y-3.5 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#9E7422] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Flagship Boutique Address:</strong><br />
                  5, Bass street, off idomowo, adjacent to new market police station, Ijebu-Ode, Ogun State, Nigeria.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#9E7422] flex-shrink-0" />
                <span>
                  <strong>Customer Hotlines:</strong> 09165317293 or 08054760134
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#9E7422] flex-shrink-0" />
                <span>
                  <strong>Official Email:</strong> alhajabizventure@gmail.com
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-[#E8DFC8] space-y-4">
            <div className="flex items-center gap-2 text-[#9E7422]">
              <Clock className="w-4 h-4" />
              <h4 className="font-serif-luxury text-base font-bold text-[#111]">Store Operating Hours</h4>
            </div>
            <div className="text-xs text-gray-700 space-y-2">
              <div className="flex justify-between py-1.5 border-b border-[#EDE6D6]">
                <span>Monday to Friday:</span>
                <strong className="text-gray-900">8:30 AM to 6:30 PM</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EDE6D6]">
                <span>Saturday:</span>
                <strong className="text-gray-900">9:00 AM to 7:00 PM</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Sunday:</span>
                <strong className="text-gray-900">12:00 PM to 5:00 PM</strong>
              </div>
            </div>
            <div className="pt-2">
              <a
                href="https://wa.me/2349165317293"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#9E7422] hover:bg-[#85611B] text-white text-xs font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Plan Your Visit via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
