import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'circular-only';
  theme?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'compact',
  theme = 'light'
}) => {
  // Dimension settings - responsive across mobile, tablet, and desktop
  const circleSizes = {
    sm: 'w-8 h-8 sm:w-10 sm:h-10',
    md: 'w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14',
    lg: 'w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28'
  };

  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      {/* Official Circular Seal Replica matching Ridah venture.jpeg */}
      <div className={`relative flex-shrink-0 ${circleSizes[size]} aspect-square rounded-full shadow-sm`}>
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rvGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5E4B5" />
              <stop offset="25%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#AA7A1E" />
              <stop offset="75%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#F7E7C4" />
            </linearGradient>

            <linearGradient id="rvGoldRing" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E9CA7C" />
              <stop offset="40%" stopColor="#B3862A" />
              <stop offset="70%" stopColor="#8C6316" />
              <stop offset="100%" stopColor="#DFC377" />
            </linearGradient>

            <radialGradient id="rvBgGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="85%" stopColor="#FAF7EE" />
              <stop offset="100%" stopColor="#F3EDE0" />
            </radialGradient>
          </defs>

          {/* Background Circle */}
          <circle cx="150" cy="150" r="144" fill="url(#rvBgGrad)" />

          {/* Double Metallic Gold Outer Border */}
          <circle cx="150" cy="150" r="142" stroke="url(#rvGoldRing)" strokeWidth="5.5" />
          <circle cx="150" cy="150" r="135" stroke="url(#rvGoldRing)" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Top Royal Crown with 5 spikes and jewels */}
          <g transform="translate(125, 14) scale(0.7)">
            <path
              d="M3 38L15 12L35 24L48 5L61 24L81 12L93 38C93 42 85 45 48 45C11 45 3 42 3 38Z"
              fill="url(#rvGoldGrad)"
              stroke="#8C6316"
              strokeWidth="1.5"
            />
            <circle cx="15" cy="11" r="3.2" fill="#FAF5E4" stroke="#8C6316" strokeWidth="1" />
            <circle cx="35" cy="23" r="2.8" fill="#C5221F" stroke="#8C6316" strokeWidth="1" />
            <circle cx="48" cy="4" r="3.6" fill="#FAF5E4" stroke="#8C6316" strokeWidth="1" />
            <circle cx="61" cy="23" r="2.8" fill="#188038" stroke="#8C6316" strokeWidth="1" />
            <circle cx="81" cy="11" r="3.2" fill="#FAF5E4" stroke="#8C6316" strokeWidth="1" />
            <ellipse cx="48" cy="40" rx="36" ry="2.5" fill="#8C6316" opacity="0.4" />
          </g>

          {/* Golden Stylized R & V Monogram */}
          <g id="rv-monogram" transform="translate(75, 48)">
            {/* Elegant R with swooping golden flourish */}
            <path
              d="M10 78L26 22H54C68 22 78 28 78 40C78 50 70 56 58 58L74 78H58L44 60H26L18 78H10ZM29 48H50C57 48 62 45 62 40C62 34 57 32 49 32H33L29 48Z"
              fill="url(#rvGoldGrad)"
              stroke="#8C6316"
              strokeWidth="1.2"
            />
            {/* Dynamic Gold Wing / Swoosh across R */}
            <path
              d="M-5 42C12 40 32 30 52 24C65 20 80 18 92 24C80 28 66 36 50 42C30 49 10 50 -5 42Z"
              fill="url(#rvGoldGrad)"
            />

            {/* Elegant V intertwined with Abaya Woman */}
            <path
              d="M50 78L78 22H94L80 78H66L50 78Z"
              fill="url(#rvGoldGrad)"
              opacity="0.85"
            />
          </g>

          {/* Silhouette of Modest Hijab / Abaya Lady inside V */}
          <g transform="translate(155, 34) scale(0.68)">
            {/* Head/Hijab draped in midnight black with golden trim */}
            <path
              d="M32 6C20 6 12 18 12 32C12 46 16 68 10 92C18 92 26 94 36 94C48 94 56 90 62 82C66 66 68 44 62 26C56 12 44 6 32 6Z"
              fill="#0F0F0F"
            />
            {/* Golden face profile and veil highlight */}
            <path
              d="M44 26C45 31 43 36 39 40C37 42 39 46 42 45C45 44 49 38 48 30C47 26 45 24 44 26Z"
              fill="#F5E4B5"
            />
            {/* Gold embroidery line tracing the hijab wrap */}
            <path
              d="M26 34C32 45 40 55 48 68C52 74 54 82 56 90"
              stroke="url(#rvGoldGrad)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Gold Wristwatch & Diamond Jewelry Accent on the right */}
          <g transform="translate(210, 85) scale(0.62)">
            {/* Watch Bezel & Strap */}
            <rect x="18" y="0" width="16" height="65" rx="3" fill="#D4AF37" stroke="#8C6316" strokeWidth="1" />
            <circle cx="26" cy="32" r="16" fill="#121212" stroke="url(#rvGoldRing)" strokeWidth="3" />
            <circle cx="26" cy="32" r="12" fill="#1E1E1E" />
            {/* Watch hands */}
            <line x1="26" y1="32" x2="26" y2="24" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="26" y1="32" x2="33" y2="34" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
            {/* Diamond / Pearl Bracelet loops */}
            <circle cx="10" cy="50" r="18" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
            <circle cx="36" cy="56" r="4" fill="#FBF3DB" stroke="#AA7A1E" strokeWidth="1" />
          </g>

          {/* RIDHAL bold serif typography */}
          <text
            x="150"
            y="142"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Playfair Display', serif"
            fontSize="34"
            fontWeight="800"
            letterSpacing="2"
            fill="#111111"
          >
            RIDHAL
          </text>

          {/* ― V E N T U R E S ― */}
          <g transform="translate(0, 158)">
            <line x1="50" y1="-5" x2="85" y2="-5" stroke="url(#rvGoldRing)" strokeWidth="2" />
            <text
              x="150"
              y="0"
              textAnchor="middle"
              fontFamily="'Cinzel', serif"
              fontSize="14.5"
              fontWeight="700"
              letterSpacing="6.5"
              fill="#9E7422"
            >
              VENTURES
            </text>
            <line x1="215" y1="-5" x2="250" y2="-5" stroke="url(#rvGoldRing)" strokeWidth="2" />
          </g>

          {/* Style for Every Occasion (Italic Script) */}
          <text
            x="150"
            y="180"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, cursive, serif"
            fontStyle="italic"
            fontSize="14"
            fontWeight="600"
            fill="#222222"
          >
            Style for Every Occasion
          </text>

          {/* 5 Product Icon Circles: Jalab, Abaya, English Dress, Jewelries, Wrist Watches */}
          <g transform="translate(48, 192)">
            {/* Icon 1: Jalab */}
            <circle cx="16" cy="12" r="11" fill="#0D0D0D" stroke="url(#rvGoldRing)" strokeWidth="1.2" />
            <path d="M12 7L16 9L20 7L21 17H11L12 7Z" fill="#D4AF37" />
            <text x="16" y="29" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#1A1A1A" fontFamily="'Plus Jakarta Sans', sans-serif">JALAB</text>

            {/* Icon 2: Abaya */}
            <circle cx="58" cy="12" r="11" fill="#0D0D0D" stroke="url(#rvGoldRing)" strokeWidth="1.2" />
            <path d="M58 5C56 5 55 7 55 9C55 10 53 17 52 18H64C63 17 61 10 61 9C61 7 60 5 58 5Z" fill="#D4AF37" />
            <text x="58" y="29" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#1A1A1A" fontFamily="'Plus Jakarta Sans', sans-serif">ABAYA</text>

            {/* Icon 3: English Dress */}
            <circle cx="100" cy="12" r="11" fill="#0D0D0D" stroke="url(#rvGoldRing)" strokeWidth="1.2" />
            <path d="M96 6L100 8L104 6L105 18H95L96 6Z" fill="#D4AF37" />
            <text x="100" y="29" textAnchor="middle" fontSize="6" fontWeight="700" fill="#1A1A1A" fontFamily="'Plus Jakarta Sans', sans-serif">ENGLISH DRESS</text>

            {/* Icon 4: Jewelries */}
            <circle cx="146" cy="12" r="11" fill="#0D0D0D" stroke="url(#rvGoldRing)" strokeWidth="1.2" />
            <path d="M141 9L146 6L151 9L146 17L141 9Z" fill="#D4AF37" />
            <text x="146" y="29" textAnchor="middle" fontSize="6" fontWeight="700" fill="#1A1A1A" fontFamily="'Plus Jakarta Sans', sans-serif">JEWELRIES</text>

            {/* Icon 5: Wrist Watches */}
            <circle cx="188" cy="12" r="11" fill="#0D0D0D" stroke="url(#rvGoldRing)" strokeWidth="1.2" />
            <circle cx="188" cy="12" r="5" fill="#D4AF37" />
            <rect x="186.5" y="4" width="3" height="16" rx="1" fill="#AA7A1E" opacity="0.6" />
            <text x="188" y="29" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#1A1A1A" fontFamily="'Plus Jakarta Sans', sans-serif">WATCHES</text>
          </g>

          {/* Contact Banner Pill */}
          <g transform="translate(48, 230)">
            <rect x="0" y="0" width="204" height="22" rx="11" fill="#0E0E0E" stroke="url(#rvGoldRing)" strokeWidth="1.5" />
            {/* Phone icon */}
            <circle cx="14" cy="11" r="8" fill="url(#rvGoldGrad)" />
            <path d="M11 8C10.5 8 10 8.5 10 9C10 12 12.5 14.5 15.5 14.5C16 14.5 16.5 14 16.5 13.5V12.3C16.5 12 16.2 11.7 15.9 11.6L14.7 11.3C14.5 11.2 14.2 11.3 14 11.5L13.5 12C12.5 11.5 11.8 10.8 11.3 9.8L11.8 9.3C12 9.1 12.1 8.8 12 8.6L11.7 7.4C11.6 7.1 11.3 6.8 11 6.8V8Z" fill="#111111" transform="translate(1.5, 0.5) scale(0.85)" />
            <text x="110" y="15" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FFFFFF" fontFamily="'Plus Jakarta Sans', monospace">
              09165317293 or 08054760134
            </text>
          </g>

          {/* Location Badge */}
          <g transform="translate(68, 258)">
            <circle cx="8" cy="8" r="7" fill="url(#rvGoldGrad)" />
            <path d="M8 4C6.3 4 5 5.3 5 7C5 9.2 8 12 8 12C8 12 11 9.2 11 7C11 5.3 9.7 4 8 4ZM8 8C7.4 8 7 7.6 7 7C7 6.4 7.4 6 8 6C8.6 6 9 6.4 9 7C9 7.6 8.6 8 8 8Z" fill="#111111" />
            <text x="20" y="7" fontSize="7" fontWeight="600" fill="#1F1F1F" fontFamily="'Plus Jakarta Sans', sans-serif">
              5, Bass street, off idomowo,
            </text>
            <text x="20" y="15" fontSize="6.5" fontWeight="500" fill="#444444" fontFamily="'Plus Jakarta Sans', sans-serif">
              adjacent to new market police station
            </text>
          </g>

          {/* Bottom Gold Laurel Motif */}
          <g transform="translate(138, 278) scale(0.6)">
            <path d="M20 5C15 15 0 16 0 16C0 16 12 18 16 28C18 18 30 16 30 16C30 16 22 14 20 5Z" fill="url(#rvGoldRing)" />
          </g>
        </svg>
      </div>

      {/* Typography Extension for Horizontal Navbar & Brand lockups */}
      {variant !== 'circular-only' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span
              className={`font-display-royal tracking-[0.12em] sm:tracking-[0.14em] font-extrabold uppercase transition-colors ${
                size === 'sm' ? 'text-sm sm:text-base' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base md:text-xl'
              } ${isDark ? 'text-white' : 'text-[#121212]'}`}
            >
              RIDHAL
            </span>
            <span
              className={`font-display-royal tracking-[0.16em] sm:tracking-[0.2em] font-semibold transition-colors ${
                size === 'sm' ? 'text-[11px] sm:text-xs' : size === 'lg' ? 'text-sm sm:text-base' : 'text-[11px] sm:text-xs md:text-sm'
              } text-[#C59A45]`}
            >
              VENTURES
            </span>
          </div>
          <span
            className={`font-serif-luxury italic tracking-wide text-[9px] sm:text-[10px] md:text-xs leading-none transition-colors truncate max-w-[130px] sm:max-w-none ${
              isDark ? 'text-[#D1C7B7]' : 'text-[#665D52]'
            }`}
          >
            Style for Every Occasion
          </span>
        </div>
      )}
    </div>
  );
};
