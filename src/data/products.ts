import { Product } from '../types';

import abayaImg from '../assets/images/abaya_product_1789167636274.jpg';
import scarfImg from '../assets/images/scarf_product_1789167648823.jpg';
import quranImg from '../assets/images/quran_product_1789167661627.jpg';
import watchImg from '../assets/images/watch_product_1789167673770.jpg';
import jewelryImg from '../assets/images/jewelry_cat_1789167685812.jpg';
import bagsShoesImg from '../assets/images/bags_shoes_cat_1789167699845.jpg';
import dressImg from '../assets/images/dress_cat_1789167711955.jpg';
import mensWearImg from '../assets/images/mens_wear_cat_1789167725241.jpg';
import heroImg from '../assets/images/hero_banner_1789167622411.jpg';

// Distinct unique assets generated for every single product (no duplicate images across the website)
import moroccanJalabImg from '../assets/images/mens_moroccan_jalab_1789313015351.jpg';
import silkChiffonHijabImg from '../assets/images/silk_chiffon_hijab_1789312890832.jpg';
import orthopedicMatImg from '../assets/images/orthopedic_prayer_mat_1789312817371.jpg';
import chiffonAbayaImg from '../assets/images/chiffon_open_abaya_1789312860758.jpg';
import omaniThobeImg from '../assets/images/mens_omani_thobe_1789313028157.jpg';
import velvetKaftanImg from '../assets/images/velvet_moroccan_kaftan_1789312874779.jpg';
import kidsEidJalabImg from '../assets/images/kids_eid_jalab_1789312935222.jpg';
import satinSquareHijabImg from '../assets/images/satin_square_hijab_1789312903807.jpg';
import crinkleKhimarImg from '../assets/images/cotton_crinkle_khimar_1789312922139.jpg';
import digitalTasbihImg from '../assets/images/digital_finger_tasbih_1789312831893.jpg';
import travelPrayerMatImg from '../assets/images/travel_prayer_mat_1789312846775.jpg';
import dubaiBanglesImg from '../assets/images/dubai_gold_bangles_1789312948596.jpg';
import ayatAlkursiImg from '../assets/images/ayat_alkursi_necklace_1789312961994.jpg';
import saffianoBagImg from '../assets/images/saffiano_tophandle_bag_1789312976146.jpg';
import ladiesWatchImg from '../assets/images/ladies_crystal_watch_1789312988008.jpg';
import modalBoxersImg from '../assets/images/modal_stretch_boxers_1789313000274.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Luxury Black Abaya Set with Gold Piping',
    slug: 'luxury-black-abaya-set',
    category: 'Jalab & Abaya',
    subcategory: 'Abaya Sets',
    price: 45000,
    compareAtPrice: 52000,
    shortDescription: 'Premium quality Dubai Nidha abaya with matching sheila and inner slip.',
    description: 'Designed for effortless grace, the Luxury Black Abaya Set features premium nidha and crepe weave tailored for modest drape and all-day comfort. Accented with subtle artisanal gold thread piping along the sleeves and hemline, this ensemble comes complete with a matching tonal hijab and waist tie belt. Perfect for Jummah prayers, weddings, Eid celebrations, or formal gatherings.',
    images: [
      abayaImg,
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['52 (Small)', '54 (Medium)', '56 (Large)', '58 (XL)', '60 (XXL)'],
    colors: ['Midnight Black', 'Black with Gold Trim', 'Charcoal Noir'],
    stock: 12,
    featured: true,
    createdAt: '2026-03-01',
    details: [
      'Fabric: Premium imported Dubai Nidha crepe',
      'Cut: Flowing A-line modest silhouette',
      'Includes: Matching outer abaya, under-slip dress, and coordinated sheila scarf',
      'Care: Dry clean or delicate cold hand wash'
    ]
  },
  {
    id: 'prod-2',
    name: 'Premium Modal Jersey Scarf',
    slug: 'premium-jersey-scarf',
    category: 'Scarfs & Hijabs',
    subcategory: 'Jersey Scarfs',
    price: 7500,
    compareAtPrice: 9000,
    shortDescription: 'Ultra-soft, breathable 4-way stretch scarf for everyday modest comfort.',
    description: 'Our signature Premium Jersey Scarf is crafted from high-grade 4-way stretch modal cotton jersey. It wraps effortlessly without needing under-caps or pins, providing a smooth, non-slip drape that stays immaculate throughout busy days in the Nigerian climate.',
    images: [
      scarfImg,
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard Maxi (180cm x 75cm)'],
    colors: ['Mocha Taupe', 'Jet Black', 'Dusty Rose', 'Warm Sand', 'Olive Slate'],
    stock: 28,
    featured: true,
    createdAt: '2026-03-02',
    details: [
      'Material: 95% Rayon Cotton, 5% Spandex jersey',
      'Texture: Ultra-soft, breathable, and opaque',
      'Styling: Pin-free styling with natural contouring',
      'Dimensions: 180cm length by 75cm width'
    ]
  },
  {
    id: 'prod-3',
    name: 'Deluxe Gold-Embossed Arabic Quran with Tajweed',
    slug: 'arabic-quran-tajweed',
    category: 'Quran & Islamic Essentials',
    subcategory: 'Arabic Quran',
    price: 12000,
    compareAtPrice: 15000,
    shortDescription: 'High quality Quran with clear Medina Uthmani script and tajweed guides.',
    description: 'This deluxe edition of the Holy Quran is printed on archival acid-free ivory pages with gold-gilded edges and protective leatherette binding. Features crystal-clear Uthmani script with color-coded tajweed guidelines and precise English translation alongside the Arabic text for profound contemplation.',
    images: [
      quranImg,
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard Medium (17cm x 24cm)', 'Pocket Travel Edition (12cm x 17cm)'],
    colors: ['Emerald Green with Gold Foil', 'Midnight Black with Gold Foil', 'Royal Navy Gold'],
    stock: 20,
    featured: true,
    createdAt: '2026-03-03',
    details: [
      'Binding: Hardcover gold-embossed faux leather',
      'Script: Standard Medina Uthmani script',
      'Features: Ribbon bookmark, tajweed notation guide, gold gilt edges',
      'Language: Arabic text with authentic parallel translation'
    ]
  },
  {
    id: 'prod-4',
    name: 'Gold-Tone Obsidian Quartz Men\'s Wrist Watch',
    slug: 'gold-tone-wrist-watch',
    category: 'Wrist Watches',
    subcategory: 'Men\'s Wrist Watches',
    price: 25000,
    compareAtPrice: 32000,
    shortDescription: 'Stylish and elegant precision timepiece with sunray black dial.',
    description: 'Exude understated royalty with this precision quartz gold-tone timepiece. Features a polished ion-plated stainless steel case, minimalist obsidian-black sunray dial, gold indices, and a scratch-resistant mineral crystal glass. Fitted with an adjustable butterfly deployant clasp.',
    images: [
      watchImg,
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Adjustable Stainless Steel Link Strap'],
    colors: ['Polished Gold / Black Dial', 'Two-Tone Gold & Silver'],
    stock: 14,
    featured: true,
    createdAt: '2026-03-04',
    details: [
      'Movement: High precision Japanese Quartz',
      'Water Resistance: 30M Splash resistant',
      'Dial Diameter: 40mm',
      'Clasp: Dual-locking hidden butterfly clasp'
    ]
  },
  {
    id: 'prod-5',
    name: 'Embroidered Royal Moroccan Men\'s Jalab',
    slug: 'embroidered-royal-mens-jalab',
    category: 'Jalab & Abaya',
    subcategory: 'Men\'s Jalab',
    price: 38000,
    compareAtPrice: 44000,
    shortDescription: 'Tailored Moroccan style jalab with gold sfifa collar embroidery.',
    description: 'Distinguished Moroccan-inspired Jalab designed specifically for discerning gentlemen. Made from breathable tropical-weight linen blend featuring intricate hand-guided sfifa embroidery along the placket and chest pocket. Ideal for Friday prayers and family occasions.',
    images: [
      moroccanJalabImg,
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['54 (S)', '56 (M)', '58 (L)', '60 (XL)', '62 (XXL)'],
    colors: ['Pristine White with Gold Thread', 'Royal Midnight Blue', 'Desert Sand Beige'],
    stock: 10,
    featured: true,
    createdAt: '2026-03-05',
    details: [
      'Material: Tropical breathable linen-cotton blend',
      'Details: Traditional braided sfifa cord and handmade knots',
      'Pockets: Dual side utility slits and chest pocket'
    ]
  },
  {
    id: 'prod-6',
    name: 'Indonesian Silk Chiffon Luxury Hijab',
    slug: 'indonesian-silk-chiffon-hijab',
    category: 'Scarfs & Hijabs',
    subcategory: 'Indonesia Hijabs',
    price: 8500,
    compareAtPrice: 10500,
    shortDescription: 'Airy luxury chiffon hijab with fine hand-rolled baby edges.',
    description: 'Imported straight from Jakarta, this lightweight textured silk chiffon scarf gives a featherlight feel with graceful cascading drape. Resists creasing and retains its airy volume all day in tropical weather.',
    images: [
      silkChiffonHijabImg,
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Maxi 185cm x 80cm'],
    colors: ['Champagne Gold', 'Rich Mocha', 'Burgundy Wine', 'Navy Blue', 'Dusty Lavender'],
    stock: 22,
    featured: true,
    createdAt: '2026-03-06',
    details: [
      'Fabric: 100% High-twist textured silk chiffon',
      'Hem: Hand-finished rolled baby hem',
      'Breathability: Ultra-lightweight and crease resistant'
    ]
  },
  {
    id: 'prod-7',
    name: 'Turkish Modest Pleated Occasion Maxi Gown',
    slug: 'turkish-modest-pleated-occasion-gown',
    category: 'English Dresses',
    subcategory: 'Turkey Wears',
    price: 42000,
    compareAtPrice: 48000,
    shortDescription: 'Accordion pleated floor-length gown with high modest neckline.',
    description: 'Imported directly from Istanbul, this Turkish modest evening gown combines pleated Georgette fabric with a modest round neckline, cuffed balloon sleeves, and an optional matching gold-buckle waist sash.',
    images: [
      dressImg,
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['UK 10 (S)', 'UK 12 (M)', 'UK 14 (L)', 'UK 16 (XL)', 'UK 18 (XXL)'],
    colors: ['Dusty Rose Mauve', 'Emerald Green', 'Royal Navy', 'Golden Camel'],
    stock: 8,
    featured: true,
    createdAt: '2026-03-07',
    details: [
      'Origin: Made in Turkey',
      'Lining: Fully lined opaque poly-satin interior',
      'Length: Full floor length 150cm'
    ]
  },
  {
    id: 'prod-8',
    name: 'Bridal 18K Gold Plated Luxury Jewelry Set',
    slug: 'bridal-18k-gold-plated-jewelry-set',
    category: 'Jewelries',
    subcategory: 'Jewelry Sets',
    price: 35000,
    compareAtPrice: 45000,
    shortDescription: 'Exquisite 4-piece necklace, earrings, ring, and bracelet set.',
    description: 'Radiate queenly charm at your next celebration with this 18k micron gold-electroplated jewelry ensemble. Showcases sparkling cubic zirconia crystal clusters that mimic high-carat diamonds.',
    images: [
      jewelryImg,
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['One Size (Adjustable necklace & ring)'],
    colors: ['Classic Yellow Gold', 'White Rhodium Gold'],
    stock: 9,
    featured: true,
    createdAt: '2026-03-08',
    details: [
      'Plating: 18K Yellow Gold with anti-tarnish protective lacquer',
      'Stone: AAA+ Cubic Zirconia crystals',
      'Packaging: Presented in velvet Ridhal gift box'
    ]
  },
  {
    id: 'prod-9',
    name: 'Executive Quilted Saffiano Handbag & Heels Pair',
    slug: 'executive-quilted-handbag-heels-pair',
    category: 'Shoes & Bags',
    subcategory: 'Handbags',
    price: 38500,
    compareAtPrice: 46000,
    shortDescription: 'Structured black vegan leather bag with matching block heels.',
    description: 'A sophisticated combination for boardroom confidence or special gatherings. The structured handbag features gold turn-lock hardware, divided inner organizers, and a detachable shoulder strap.',
    images: [
      bagsShoesImg,
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42'],
    colors: ['Obsidian Black', 'Warm Camel Tan', 'Burgundy Wine'],
    stock: 7,
    featured: true,
    createdAt: '2026-03-09',
    details: [
      'Material: Scratch-resistant saffiano vegan leather',
      'Hardware: Heavy tarnish-resistant gold alloy',
      'Heel Height: 3.5-inch comfortable wide block heel'
    ]
  },
  {
    id: 'prod-10',
    name: 'Luxury Velvet Orthopedic Prayer Mat & Tasbih Set',
    slug: 'luxury-velvet-prayer-mat-tasbih-gift-set',
    category: 'Quran & Islamic Essentials',
    subcategory: 'Praying Mats',
    price: 18500,
    compareAtPrice: 22000,
    shortDescription: 'Thick memory foam prayer rug with 99-bead stone tasbih.',
    description: 'Engineered for exceptional knee and joint comfort during daily salat. Made with plush Turkish micro-velvet, anti-slip rubberized backing, and an ergonomic 15mm padded core.',
    images: [
      orthopedicMatImg,
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Large (120cm x 80cm)'],
    colors: ['Royal Gold & Cream', 'Deep Emerald & Gold', 'Midnight Navy'],
    stock: 16,
    featured: true,
    createdAt: '2026-03-10',
    details: [
      'Cushioning: High-density memory foam relief',
      'Backing: Anti-skid embossed silicone pattern',
      'Included: 99-bead agates stone tasbih with gold tassel'
    ]
  },
  {
    id: 'prod-11',
    name: 'Men\'s Pure Cotton Singlet & Boxers 6-Pack',
    slug: 'mens-pure-cotton-singlet-boxers-pack',
    category: 'Singlet & Boxers',
    subcategory: 'Underwear Sets',
    price: 14500,
    compareAtPrice: 18000,
    shortDescription: 'Pack of 3 breathable ribbed vests and 3 seamless cotton boxers.',
    description: 'Essential everyday comfort crafted from 100% combed Egyptian cotton. Ultra-absorbent, hypoallergenic, and designed with a plush no-roll waistband that guarantees zero chafing throughout warm tropical days.',
    images: [
      mensWearImg,
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M (30-32)', 'L (34-36)', 'XL (38-40)', 'XXL (42-44)'],
    colors: ['Classic Black Pack', 'Triple White Pack', 'Mixed Assorted'],
    stock: 35,
    featured: true,
    createdAt: '2026-03-11',
    details: [
      'Pack Contains: 3 Singlet vests + 3 Stretch boxers',
      'Fabric: 100% Combed breathable cotton',
      'Waistband: Spun soft jacquard elastic'
    ]
  },
  {
    id: 'prod-12',
    name: 'Dubai Butterfly Chiffon Open Abaya with Pearls',
    slug: 'dubai-butterfly-chiffon-open-abaya',
    category: 'Jalab & Abaya',
    subcategory: "Women's Abaya",
    price: 48000,
    compareAtPrice: 56000,
    shortDescription: 'Flowing Dubai butterfly batwing cut with delicate faux pearl trims.',
    description: 'An ethereal layered open abaya crafted from featherweight premium chiffon. Features voluminous butterfly batwing sleeves embellished with hand-stitched faux pearls along the lapel and cuffs. Wear open or belted for royal flair.',
    images: [
      chiffonAbayaImg,
      'https://images.unsplash.com/photo-1596783074418-4796cb5d0d65?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['54 (M)', '56 (L)', '58 (XL)', '60 (XXL)'],
    colors: ['Champagne Cream', 'Dusty Lavender', 'Pitch Black', 'Forest Green'],
    stock: 8,
    featured: true,
    createdAt: '2026-03-12',
    details: [
      'Fabric: Double-layered Korean chiffon',
      'Embellishments: Hand-set pearl clusters',
      'Cut: Extra wide butterfly flare'
    ]
  },
  {
    id: 'prod-13',
    name: 'Omani Men\'s Crisp White Thobe with Tarboosh Tassel',
    slug: 'omani-mens-white-thobe',
    category: 'Jalab & Abaya',
    subcategory: "Men's Jalab",
    price: 32000,
    compareAtPrice: 38000,
    shortDescription: 'Classic collarless Omani jalab with signature handwoven chest tassel.',
    description: 'Impeccably tailored Omani style men’s jalab featuring a rounded neckband with an authentic perfumed tarboosh tassel. Crafted from smooth anti-wrinkle Japanese spun polyester with a cooling silky handfeel.',
    images: [
      omaniThobeImg,
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['54 (S)', '56 (M)', '58 (L)', '60 (XL)', '62 (XXL)'],
    colors: ['Crisp Optical White', 'Almond Ivory', 'Slate Grey'],
    stock: 15,
    featured: true,
    createdAt: '2026-03-13',
    details: [
      'Fabric: Premium Japanese anti-static spun poly',
      'Collar: Authentic collarless Omani neckline with tarboosh',
      'Weight: Breathable summer-weight weave'
    ]
  },
  {
    id: 'prod-14',
    name: 'Royal Moroccan Velvet Kaftan with Gold Embroidery',
    slug: 'royal-moroccan-velvet-kaftan',
    category: 'English Dresses',
    subcategory: 'Turkey Wears',
    price: 55000,
    compareAtPrice: 65000,
    shortDescription: 'Plush velvet evening kaftan adorned with ornate gold filigree work.',
    description: 'A showstopping masterpiece designed for weddings and grand festive celebrations. Cut from rich jewel-toned micro-velvet and lavished with gold metallic skalli threadwork and crystal glass stones.',
    images: [
      velvetKaftanImg,
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['UK 12 (M)', 'UK 14 (L)', 'UK 16 (XL)', 'UK 18 (XXL)'],
    colors: ['Imperial Burgundy', 'Emerald Green', 'Midnight Sapphire'],
    stock: 5,
    featured: true,
    createdAt: '2026-03-14',
    details: [
      'Material: Heavy stretch micro-velvet',
      'Embroidery: High-density gold metallic thread',
      'Includes: Coordinated satin belt with gold filigree clasp'
    ]
  },
  {
    id: 'prod-15',
    name: 'Children\'s Eid Two-Piece Jalab & Keffiyeh Set',
    slug: 'childrens-eid-jalab-keffiyeh-set',
    category: 'Jalab & Abaya',
    subcategory: "Children's Abaya",
    price: 18000,
    compareAtPrice: 22000,
    shortDescription: 'Gentle cotton boys jalab with matching checked keffiyeh scarf and ring.',
    description: 'Dress your little ones in princely modesty. Specially tailored for boys aged 4-14, this 2-piece set features soft non-itchy combed cotton fabric with neat neckline buttoning and a matching red/white or black/white keffiyeh scarf.',
    images: [
      kidsEidJalabImg,
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Size 34 (Age 4-5)', 'Size 38 (Age 6-7)', 'Size 42 (Age 8-9)', 'Size 46 (Age 10-11)', 'Size 50 (Age 12-14)'],
    colors: ['Snow White', 'Caramel Beige', 'Royal Navy'],
    stock: 14,
    featured: false,
    createdAt: '2026-03-15',
    details: [
      'Fabric: 100% Breathable soft cotton',
      'Set includes: Tunic jalab + Keffiyeh headscarf + Egal band'
    ]
  },
  {
    id: 'prod-16',
    name: 'Turkish Silk Satin Square Hijab with Baroque Print',
    slug: 'turkish-silk-satin-square-hijab',
    category: 'Scarfs & Hijabs',
    subcategory: 'Chiffon Scarfs',
    price: 9500,
    compareAtPrice: 12000,
    shortDescription: 'Lustrous square silk satin scarf with rich ornamental border.',
    description: 'Indulge in the silky sheen and rich color payoff of our Turkish imported square scarf. Sits gracefully on the crown without slipping when paired with our breathable under-caps.',
    images: [
      satinSquareHijabImg,
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Square 100cm x 100cm'],
    colors: ['Gold & Noir Baroque', 'Emerald Jewel Print', 'Champagne Pearl'],
    stock: 19,
    featured: true,
    createdAt: '2026-03-16',
    details: [
      'Material: High grade twill silk satin',
      'Dimensions: 100cm x 100cm square'
    ]
  },
  {
    id: 'prod-17',
    name: 'Instant Full-Length Crinkle Cotton Khimar',
    slug: 'instant-crinkle-cotton-khimar',
    category: 'Scarfs & Hijabs',
    subcategory: 'Other Hijab Types',
    price: 11000,
    compareAtPrice: 14000,
    shortDescription: 'One-piece modest slip-on khimar with tie-back headband for daily salat.',
    description: 'The ultimate prayer and everyday modesty solution. Slip it on in 5 seconds without requiring pins. Features a comfort tie-back strap inside that secures gently around the crown without ear pressure.',
    images: [
      crinkleKhimarImg,
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['One Size (Floor / Knee Length Front & Back)'],
    colors: ['Jet Black', 'Deep Taupe', 'Olive Green', 'Earthy Terracotta'],
    stock: 17,
    featured: false,
    createdAt: '2026-03-17',
    details: [
      'Fabric: Pre-washed crinkle cotton linen',
      'Design: Integrated tie-back headband'
    ]
  },
  {
    id: 'prod-18',
    name: 'Smart Rechargeable Digital Finger Tasbih with LED',
    slug: 'smart-digital-finger-tasbih',
    category: 'Quran & Islamic Essentials',
    subcategory: 'Prayer Counters',
    price: 5500,
    compareAtPrice: 7000,
    shortDescription: 'Compact silent tally counter with LED backlight and memory reset.',
    description: 'Keep your daily dhikr uninterrupted. Features an ergonomic silicone strap fitting any finger size, a vibrant night-vision LED screen, silent click keys, and memory counter retention.',
    images: [
      digitalTasbihImg,
      'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Adjustable Silicone Strap (Universal Fit)'],
    colors: ['Rose Gold Trim / Black', 'Metallic Pearl White', 'Midnight Green'],
    stock: 40,
    featured: true,
    createdAt: '2026-03-18',
    details: [
      'Display: 5-digit LCD with backlighting',
      'Battery: USB rechargeable lithium cell'
    ]
  },
  {
    id: 'prod-19',
    name: 'Foldable Waterproof Travel Prayer Mat with Compass',
    slug: 'foldable-waterproof-travel-prayer-mat',
    category: 'Quran & Islamic Essentials',
    subcategory: 'Praying Mats',
    price: 8000,
    compareAtPrice: 10000,
    shortDescription: 'Pocket-sized waterproof nylon prayer rug with built-in Qibla compass.',
    description: 'Never miss salat while on transit, at the office, or travelling. Constructed from durable water-resistant ripstop nylon with corner iron weights that prevent windy blowouts. Folds neatly into an included pocket pouch.',
    images: [
      travelPrayerMatImg,
      'https://images.unsplash.com/photo-1591243315780-9fb23c0c5986?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Expanded: 100cm x 60cm | Folded Pouch: 15cm x 10cm'],
    colors: ['Forest Green', 'Navy Blue', 'Classic Black'],
    stock: 30,
    featured: false,
    createdAt: '2026-03-19',
    details: [
      'Material: 210D Waterproof coated polyester',
      'Features: Built-in Qibla compass & 4 corner weights'
    ]
  },
  {
    id: 'prod-20',
    name: 'Dubai 18K Gold-Layered Statement Bangles Set',
    slug: 'dubai-18k-gold-bangles-set',
    category: 'Jewelries',
    subcategory: 'Bracelets',
    price: 24000,
    compareAtPrice: 30000,
    shortDescription: 'Set of 4 laser-etched Dubai style stackable gold bangles.',
    description: 'Chic, lustrous, and crafted with authentic Dubai jewelry motifs. Thickly plated in 18k yellow gold with anti-tarnish protective coating that resists water, sweat, and daily wear.',
    images: [
      dubaiBanglesImg,
      'https://images.unsplash.com/photo-1611591475828-56cb2f20703c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard 2.6 (Medium)', 'Standard 2.8 (Large)'],
    colors: ['Classic 18K Yellow Gold'],
    stock: 11,
    featured: true,
    createdAt: '2026-03-20',
    details: [
      'Set: 4 stackable textured bangles',
      'Plating: Multi-layer vacuum electroplated 18K gold'
    ]
  },
  {
    id: 'prod-21',
    name: 'Arabic Calligraphy "Ayat al-Kursi" Gold Pendant Necklace',
    slug: 'arabic-calligraphy-ayat-alkursi-pendant',
    category: 'Jewelries',
    subcategory: 'Necklaces',
    price: 14000,
    compareAtPrice: 18000,
    shortDescription: 'Fine link chain necklace with intricate laser-cut Quranic medallion.',
    description: 'A timeless expression of faith and elegance. Features the sacred Ayat al-Kursi inscribed in flowing Thuluth Arabic script upon an oval gold medallion, hung on a sturdy 18-inch box chain.',
    images: [
      ayatAlkursiImg,
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['18-inch chain with 2-inch extender'],
    colors: ['18K Gold Finish', 'Silver Rhodium Finish'],
    stock: 18,
    featured: false,
    createdAt: '2026-03-21',
    details: [
      'Material: 316L Stainless steel core with 18K Gold PVD plating',
      'Hypoallergenic: 100% Nickel-free and lead-free'
    ]
  },
  {
    id: 'prod-22',
    name: 'Saffiano Structured Top-Handle Bag with Gold Lock',
    slug: 'saffiano-structured-top-handle-bag',
    category: 'Shoes & Bags',
    subcategory: 'Handbags',
    price: 28000,
    compareAtPrice: 34000,
    shortDescription: 'Classic structured ladies tote with polished gold turn-lock.',
    description: 'Crafted for timeless versatility, this top-handle handbag features structured saffiano-finish vegan leather, twin rolled handles, a secure top zipper with gold turn-lock, and a detachable crossbody strap.',
    images: [
      saffianoBagImg,
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Medium Tote (30cm x 22cm x 12cm)'],
    colors: ['Rich Caramel Tan', 'Midnight Black', 'Ivory Cream'],
    stock: 8,
    featured: false,
    createdAt: '2026-03-22',
    details: [
      'Outer: Textured saffiano water-resistant PU leather',
      'Hardware: Mirror polished gold zinc alloy'
    ]
  },
  {
    id: 'prod-23',
    name: 'Crystal Bezel Mother-of-Pearl Ladies Watch',
    slug: 'crystal-bezel-mother-of-pearl-ladies-watch',
    category: 'Wrist Watches',
    subcategory: "Women's Wrist Watches",
    price: 22000,
    compareAtPrice: 28000,
    shortDescription: 'Dainty gold mesh strap watch with iridescent mother-of-pearl dial.',
    description: 'An elegant feminine dress watch adorned with shimmering Austrian crystals around the slim bezel. Features a genuine iridescent mother-of-pearl dial with slender gold hour batons and a flexible magnetic mesh band.',
    images: [
      ladiesWatchImg,
      'https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Adjustable Milanese Mesh Strap'],
    colors: ['Rose Gold Mesh', 'Classic Yellow Gold'],
    stock: 12,
    featured: true,
    createdAt: '2026-03-23',
    details: [
      'Dial: Natural iridescent mother-of-pearl',
      'Movement: Japanese Quartz 3-hand movement',
      'Glass: Hardened mineral crystal'
    ]
  },
  {
    id: 'prod-24',
    name: 'Premium Micro-Modal Seamless Stretch Boxers 3-Pack',
    slug: 'premium-micro-modal-seamless-boxers',
    category: 'Singlet & Boxers',
    subcategory: 'Boxers',
    price: 9500,
    compareAtPrice: 12000,
    shortDescription: 'Silky smooth breathable modal trunks with stay-put no-roll waistband.',
    description: 'Upgraded daily foundation for men. Ultra-soft beechwood micro-modal fabric provides 3x the breathability of regular cotton, preventing heat rash and staying dry all day in the heat.',
    images: [
      modalBoxersImg,
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M (30-32)', 'L (34-36)', 'XL (38-40)', 'XXL (42-44)'],
    colors: ['Triple Black Pack', 'Charcoal & Navy Mix'],
    stock: 25,
    featured: false,
    createdAt: '2026-03-24',
    details: [
      'Fabric: 92% Micro-Modal, 8% Elastane',
      'Features: Flatlock anti-chafe seams & contoured pouch'
    ]
  }
];

export const NIGERIAN_STATES = [
  'Ogun', 'Lagos', 'Oyo', 'Osun', 'Ondo', 'Ekiti', 'Abuja (FCT)',
  'Rivers', 'Edo', 'Delta', 'Kwara', 'Kano', 'Kaduna', 'Enugu', 'Anambra', 'Other States'
];

export function formatNaira(amount: number): string {
  return '₦' + (amount || 0).toLocaleString('en-NG');
}
