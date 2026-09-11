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

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Luxury Black Abaya Set',
    slug: 'luxury-black-abaya-set',
    category: 'Jalab & Abaya',
    subcategory: 'Abaya Sets',
    price: 45000,
    compareAtPrice: 52000,
    shortDescription: 'Premium quality abaya with elegant design, comfortable and modest.',
    description: 'Designed for effortless grace, the Luxury Black Abaya Set features premium nidha and crepe weave tailored for modest drape and all-day comfort. Accented with subtle artisanal gold thread piping along the sleeves and hemline, this ensemble comes complete with a matching tonal hijab and waist tie belt. Perfect for Jummah prayers, weddings, Eid celebrations, or formal gatherings.',
    images: [abayaImg, heroImg],
    sizes: ['52 (Small)', '54 (Medium)', '56 (Large)', '58 (XL)', '60 (XXL)'],
    colors: ['Midnight Black', 'Black with Gold Trim', 'Charcoal Noir'],
    stock: 7,
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
    name: 'Premium Jersey Scarf',
    slug: 'premium-jersey-scarf',
    category: 'Scarfs & Hijabs',
    subcategory: 'Jersey Scarfs',
    price: 7500,
    compareAtPrice: 9000,
    shortDescription: 'Soft, breathable and versatile scarf for everyday wear.',
    description: 'Our signature Premium Jersey Scarf is crafted from high-grade 4-way stretch modal cotton jersey. It wraps effortlessly without needing under-caps or pins, providing a smooth, non-slip drape that stays immaculate throughout busy days in the Nigerian climate.',
    images: [scarfImg],
    sizes: ['Standard Maxi (180cm x 75cm)'],
    colors: ['Mocha Taupe', 'Jet Black', 'Dusty Rose', 'Warm Sand', 'Olive Slate'],
    stock: 24,
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
    name: 'Arabic Quran',
    slug: 'arabic-quran',
    category: 'Quran & Islamic Essentials',
    subcategory: 'Arabic Quran',
    price: 12000,
    compareAtPrice: 15000,
    shortDescription: 'High quality Quran with clear Arabic script and translation.',
    description: 'This deluxe edition of the Holy Quran is printed on archival acid-free ivory pages with gold-gilded edges and protective leatherette binding. Features crystal-clear Uthmani script with color-coded tajweed guidelines and precise English translation alongside the Arabic text for profound contemplation.',
    images: [quranImg],
    sizes: ['Standard Medium (17cm x 24cm)', 'Pocket Travel Edition (12cm x 17cm)'],
    colors: ['Emerald Green with Gold Foil', 'Midnight Black with Gold Foil'],
    stock: 15,
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
    name: 'Gold-Tone Wrist Watch',
    slug: 'gold-tone-wrist-watch',
    category: 'Wrist Watches',
    subcategory: 'Men\'s Wrist Watches',
    price: 25000,
    compareAtPrice: 32000,
    shortDescription: 'Stylish and elegant wrist watch for everyday use.',
    description: 'Exude understated royalty with this precision quartz gold-tone timepiece. Features a polished ion-plated stainless steel case, minimalist obsidian-black sunray dial, gold indices, and a scratch-resistant mineral crystal glass. Fitted with an adjustable butterfly deployant clasp.',
    images: [watchImg],
    sizes: ['Adjustable Stainless Steel Link Strap'],
    colors: ['Polished Gold / Black Dial', 'Two-Tone Gold & Silver'],
    stock: 9,
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
    name: 'Embroidered Royal Men\'s Jalab',
    slug: 'embroidered-royal-mens-jalab',
    category: 'Jalab & Abaya',
    subcategory: 'Men\'s Jalab',
    price: 38000,
    compareAtPrice: 44000,
    shortDescription: 'Tailored Moroccan style jalab with gold collar embroidery.',
    description: 'Distinguished Moroccan-inspired Jalab designed specifically for discerning gentlemen. Made from breathable tropical-weight linen blend featuring intricate hand-guided sfifa embroidery along the placket and chest pocket.',
    images: [abayaImg],
    sizes: ['54 (S)', '56 (M)', '58 (L)', '60 (XL)', '62 (XXL)'],
    colors: ['Pristine White', 'Royal Midnight Blue', 'Desert Beige'],
    stock: 6,
    featured: false,
    createdAt: '2026-03-05',
    details: [
      'Material: Tropical breathable linen-cotton blend',
      'Details: Traditional braided sfifa cord and buttons',
      'Pockets: Dual side utility slits and chest pocket'
    ]
  },
  {
    id: 'prod-6',
    name: 'Indonesian Silk Chiffon Hijab',
    slug: 'indonesian-silk-chiffon-hijab',
    category: 'Scarfs & Hijabs',
    subcategory: 'Indonesia Hijabs',
    price: 8500,
    shortDescription: 'Airy luxury chiffon hijab with fine hand-rolled edges.',
    description: 'Imported straight from Jakarta, this lightweight textured silk chiffon scarf gives a featherlight feel with graceful cascading drape. Resists creasing and retains its airy volume all day.',
    images: [scarfImg],
    sizes: ['Maxi 185cm x 80cm'],
    colors: ['Champagne Gold', 'Rich Mocha', 'Burgundy Wine', 'Navy Blue'],
    stock: 18,
    featured: false,
    createdAt: '2026-03-06',
    details: [
      'Fabric: 100% High-twist textured silk chiffon',
      'Hem: Hand-finished rolled baby hem'
    ]
  },
  {
    id: 'prod-7',
    name: 'Turkish Modest Pleated Occasion Gown',
    slug: 'turkish-modest-pleated-occasion-gown',
    category: 'English Dresses',
    subcategory: 'Turkey Wears',
    price: 42000,
    compareAtPrice: 48000,
    shortDescription: 'Elegant accordion pleated maxi gown with high modest neckline.',
    description: 'Imported directly from Istanbul, this Turkish modest evening gown combines pleated Georgette fabric with a modest round neckline, cuffed balloon sleeves, and an optional matching gold-buckle waist sash.',
    images: [dressImg],
    sizes: ['UK 10 (S)', 'UK 12 (M)', 'UK 14 (L)', 'UK 16 (XL)', 'UK 18 (XXL)'],
    colors: ['Dusty Rose Mauve', 'Emerald Green', 'Royal Navy'],
    stock: 4,
    featured: false,
    createdAt: '2026-03-07',
    details: [
      'Origin: Made in Turkey',
      'Lining: Fully lined opaque poly-satin interior',
      'Length: Full floor length 150cm'
    ]
  },
  {
    id: 'prod-8',
    name: 'Bridal 18K Gold Plated Jewelry Set',
    slug: 'bridal-18k-gold-plated-jewelry-set',
    category: 'Jewelries',
    subcategory: 'Jewelry Sets',
    price: 35000,
    compareAtPrice: 45000,
    shortDescription: 'Exquisite 4-piece necklace, earrings, ring, and bracelet set.',
    description: 'Radiate queenly charm at your next celebration with this 18k micron gold-electroplated jewelry ensemble. Showcases sparkling cubic zirconia crystal clusters that mimic high-carat diamonds.',
    images: [jewelryImg],
    sizes: ['One Size (Adjustable necklace & ring)'],
    colors: ['Classic Yellow Gold', 'White Rhodium Gold'],
    stock: 5,
    featured: false,
    createdAt: '2026-03-08',
    details: [
      'Plating: 18K Yellow Gold with anti-tarnish protective lacquer',
      'Stone: AAA+ Cubic Zirconia crystals',
      'Packaging: Presented in velvet Ridhal gift box'
    ]
  },
  {
    id: 'prod-9',
    name: 'Executive Quilted Handbag & Heels Pair',
    slug: 'executive-quilted-handbag-heels-pair',
    category: 'Shoes & Bags',
    subcategory: 'Handbags',
    price: 38500,
    compareAtPrice: 46000,
    shortDescription: 'Structured black vegan leather bag with matching block heels.',
    description: 'A sophisticated combination for boardroom confidence or church/mosque outings. The structured handbag features gold turn-lock hardware, divided inner organizers, and a detachable shoulder strap.',
    images: [bagsShoesImg],
    sizes: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42'],
    colors: ['Obsidian Black', 'Warm Camel Tan'],
    stock: 3,
    featured: false,
    createdAt: '2026-03-09',
    details: [
      'Material: Scratch-resistant saffiano vegan leather',
      'Hardware: Heavy tarnish-resistant gold alloy',
      'Heel Height: 3.5-inch comfortable wide block heel'
    ]
  },
  {
    id: 'prod-10',
    name: 'Luxury Velvet Prayer Mat & Tasbih Gift Set',
    slug: 'luxury-velvet-prayer-mat-tasbih-gift-set',
    category: 'Quran & Islamic Essentials',
    subcategory: 'Praying Mats',
    price: 18500,
    shortDescription: 'Thick memory foam prayer rug with 99-bead stone tasbih.',
    description: 'Engineered for exceptional knee and joint comfort during daily salat. Made with plush Turkish micro-velvet, anti-slip rubberized backing, and an ergonomic 15mm padded core.',
    images: [quranImg],
    sizes: ['Large (120cm x 80cm)'],
    colors: ['Royal Gold & Cream', 'Deep Emerald & Gold', 'Midnight Navy'],
    stock: 12,
    featured: false,
    createdAt: '2026-03-10',
    details: [
      'Cushioning: High-density memory foam relief',
      'Backing: Anti-skid embossed silicone pattern',
      'Included: 99-bead agates stone tasbih with gold tassel'
    ]
  },
  {
    id: 'prod-11',
    name: 'Men\'s Pure Cotton Singlet & Boxers Pack',
    slug: 'mens-pure-cotton-singlet-boxers-pack',
    category: 'Singlet & Boxers',
    subcategory: 'Underwear Sets',
    price: 14500,
    compareAtPrice: 18000,
    shortDescription: 'Pack of 3 breathable ribbed vests and 3 seamless cotton boxers.',
    description: 'Essential everyday comfort crafted from 100% combed Egyptian cotton. Ultra-absorbent, hypoallergenic, and designed with a plush no-roll waistband that guarantees zero chafing throughout warm tropical days.',
    images: [mensWearImg],
    sizes: ['M (30-32)', 'L (34-36)', 'XL (38-40)', 'XXL (42-44)'],
    colors: ['Classic Black Pack', 'Triple White Pack', 'Mixed Assorted'],
    stock: 30,
    featured: false,
    createdAt: '2026-03-11',
    details: [
      'Pack Contains: 3 Singlet vests + 3 Stretch boxers',
      'Fabric: 100% Combed breathable cotton',
      'Waistband: Spun soft jacquard elastic'
    ]
  }
];

export const NIGERIAN_STATES = [
  'Ogun', 'Lagos', 'Oyo', 'Osun', 'Ondo', 'Ekiti', 'Abuja (FCT)',
  'Rivers', 'Edo', 'Delta', 'Kwara', 'Kano', 'Kaduna', 'Enugu', 'Anambra', 'Other States'
];

export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG');
}
