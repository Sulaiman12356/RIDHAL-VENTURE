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
  isAvailable?: boolean;
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

export interface DeliveryAddress {
  id: string;
  title?: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: DeliveryAddress[];
  notes?: string;
  createdAt: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
  available: boolean;
  allowPayOnDelivery: boolean;
  description?: string;
  regions?: string[];
  estimatedDays?: string;
  isActive?: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId?: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedBuyer: boolean;
  createdAt: string;
  status: 'approved' | 'pending';
}

export interface DiscountCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  active: boolean;
  expiryDate?: string;
  description?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  usageLimit?: number;
  timesUsed?: number;
  isActive?: boolean;
}

export type Coupon = DiscountCoupon;

export interface ProductBundle {
  id: string;
  title: string;
  description: string;
  productIds: string[];
  bundlePrice: number;
  originalPrice: number;
  badge?: string;
  active: boolean;
}

export interface WishlistDoc {
  id: string;
  customerId: string;
  productIds: string[];
}

export type OrderStatus = 
  | 'Order received'
  | 'Payment pending'
  | 'Payment confirmed'
  | 'Processing'
  | 'Ready for delivery'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  // Legacy aliases
  | 'Pending';

export type PaymentStatus = 
  | 'Pending' 
  | 'Pending Payment' 
  | 'Paid' 
  | 'Failed';

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
  customer?: CustomerInfo; // compatibility
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount?: number;
  appliedCoupon?: string;
  deliveryZoneId?: string;
  deliveryZoneName?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  status?: string; // backward compat
  trackingNotes?: string;
  carrierName?: string;
  createdAt: string;
  updatedAt?: string;
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
  | 'wishlist'
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'order-confirmation'
  | 'track-order'
  | 'order-tracking'
  | 'account'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'shipping-policy'
  | 'refund-policy'
  | 'faqs'
  | 'admin';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'store_manager';
}

export interface CustomerUser {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
}

