import { CategoryItem } from '../types';

import abayaImg from '../assets/images/abaya_product_1789167636274.jpg';
import scarfImg from '../assets/images/scarf_product_1789167648823.jpg';
import quranImg from '../assets/images/quran_product_1789167661627.jpg';
import dressImg from '../assets/images/dress_cat_1789167711955.jpg';
import jewelryImg from '../assets/images/jewelry_cat_1789167685812.jpg';
import bagsShoesImg from '../assets/images/bags_shoes_cat_1789167699845.jpg';
import watchImg from '../assets/images/watch_product_1789167673770.jpg';
import mensWearImg from '../assets/images/mens_wear_cat_1789167725241.jpg';

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'jalab-abaya',
    name: 'Jalab & Abaya',
    slug: 'jalab-abaya',
    image: abayaImg,
    description: "Premium Jalab for men, elegant women's abayas, and coordinated modest sets.",
    subcategories: ["Men's Jalab", "Women's Abaya", "Children's Abaya", "Abaya Sets"]
  },
  {
    id: 'scarfs-hijabs',
    name: 'Scarfs & Hijabs',
    slug: 'scarfs-hijabs',
    image: scarfImg,
    description: "Breathable jersey, chiffon, imported Malaysia and Indonesia hijabs.",
    subcategories: ['Jersey Scarfs', 'Chiffon Scarfs', 'Malaysia Hijabs', 'Indonesia Hijabs', 'Other Hijab Types']
  },
  {
    id: 'quran-islamic-essentials',
    name: 'Quran & Islamic Essentials',
    slug: 'quran-islamic-essentials',
    image: quranImg,
    description: 'Authentic Holy Quran, translations, prayer mats, and digital tasbih counters.',
    subcategories: ['Arabic Quran', 'English Quran', 'Yoruba Quran', 'Quran with Translation', 'Praying Mats', 'Prayer Counters']
  },
  {
    id: 'english-dresses',
    name: 'English Dresses',
    slug: 'english-dresses',
    image: dressImg,
    description: 'Sophisticated modest Turkey and China corporate wears and occasion gowns.',
    subcategories: ['Turkey Wears', 'China Wears', 'Other English Dresses']
  },
  {
    id: 'jewelries',
    name: 'Jewelries',
    slug: 'jewelries',
    image: jewelryImg,
    description: 'Gold-plated bridal sets, delicate necklaces, earrings, and rings.',
    subcategories: ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Jewelry Sets']
  },
  {
    id: 'shoes-bags',
    name: 'Shoes & Bags',
    slug: 'shoes-bags',
    image: bagsShoesImg,
    description: 'Structured luxury handbags, classic heels, and matching shoe-bag pairs.',
    subcategories: ["Women's Shoes", "Men's Shoes", 'Handbags', 'Other Bags']
  },
  {
    id: 'wrist-watches',
    name: 'Wrist Watches',
    slug: 'wrist-watches',
    image: watchImg,
    description: 'Timeless gold-tone and silver timepieces for gentlemen and ladies.',
    subcategories: ["Men's Wrist Watches", "Women's Wrist Watches", 'Watch Sets']
  },
  {
    id: 'singlet-boxers',
    name: 'Singlet & Boxers',
    slug: 'singlet-boxers',
    image: mensWearImg,
    description: 'Pure combed cotton undershirts, seamless boxers, and comfortable lounge basics.',
    subcategories: ['Singlets', 'Boxers', 'Underwear Sets']
  }
];
