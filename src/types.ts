export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  details?: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  unitPrice: number;
}

export type PaymentMethod = 'online' | 'bank_transfer' | 'pay_on_delivery';

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  orderNotes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: {
    address: string;
    city: string;
    state: string;
    isDefault?: boolean;
  }[];
  createdAt: string;
}

export interface WishlistDoc {
  id: string;
  customerId: string;
  productIds: string[];
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface Order {
  id: string;
  orderNumber?: string; // e.g. RV-2026-XXXX
  customerId: string;
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    city: string;
    state: string;
    orderNotes?: string;
  };
  // Compatibility helper property for existing components
  customer?: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  status?: string; // backward compat
  createdAt: string;
  notificationStatus?: {
    sent: boolean;
    provider?: string;
    messageId?: string;
    sentAt?: string;
    recipient?: string;
    details?: string;
  };
}

export type ActivePage = 
  | 'home' 
  | 'shop' 
  | 'collections' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'order-confirmation'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'admin';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'store_manager';
}
