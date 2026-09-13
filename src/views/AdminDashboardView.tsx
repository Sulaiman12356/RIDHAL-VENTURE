import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  RefreshCw, 
  LogOut, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Users,
  Eye,
  EyeOff,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  Truck,
  Tag,
  Key,
  Copy,
  Lock,
  UserCheck,
  Database,
  Sparkles
} from 'lucide-react';
import { 
  Product, 
  CategoryItem, 
  Order, 
  Customer, 
  OrderStatus, 
  PaymentStatus, 
  AdminUser 
} from '../types';
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  updateProductStock, 
  updateProductPrice, 
  uploadProductImage 
} from '../services/productService';
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../services/categoryService';
import { 
  getAllOrders, 
  updateOrderStatus, 
  updatePaymentStatus, 
  updateOrderNotificationStatus,
  updateOrderTracking
} from '../services/orderService';
import { getAllCustomers } from '../services/customerService';
import { AdminDeliveryManagement } from '../components/admin/AdminDeliveryManagement';
import { AdminCouponManagement } from '../components/admin/AdminCouponManagement';
import { 
  adminLogin, 
  getCurrentAdmin, 
  adminLogout, 
  AUTHORIZED_ADMIN_EMAILS,
  isAuthorizedAdminEmail
} from '../services/adminAuthService';
import { 
  checkNotificationStatus, 
  sendOrderNotificationToAdmin, 
  NotificationStatusResponse 
} from '../services/notificationService';

interface AdminDashboardViewProps {
  onBackToStore?: () => void;
  onExitToStore?: () => void;
  onRefreshGlobalStore?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ 
  onBackToStore, 
  onExitToStore,
  onRefreshGlobalStore 
}) => {
  const exitToStore = onBackToStore || onExitToStore || (() => {});
  const [admin, setAdmin] = useState<AdminUser | null>(getCurrentAdmin());
  const [email, setEmail] = useState('admin@ridhalventures.com');
  const [password, setPassword] = useState('Admin2026!');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'customers' | 'delivery' | 'coupons'>('overview');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Drawer tracking state
  const [drawerCarrier, setDrawerCarrier] = useState('');
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerStatus, setDrawerStatus] = useState<OrderStatus>('Order received');
  const [drawerPaymentStatus, setDrawerPaymentStatus] = useState<PaymentStatus>('Pending');
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

  // Product Form state
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodSubcategory, setProdSubcategory] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodComparePrice, setProdComparePrice] = useState<number | undefined>(undefined);
  const [prodStock, setProdStock] = useState<number>(10);
  const [prodDescription, setProdDescription] = useState('');
  const [prodShortDescription, setProdShortDescription] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodImageInput, setProdImageInput] = useState('');
  const [prodSizes, setProdSizes] = useState<string>('M, L, XL');
  const [prodColors, setProdColors] = useState<string>('Black, Gold');
  const [prodFeatured, setProdFeatured] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Category Form state
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catSubcategories, setCatSubcategories] = useState('');

  // Quick edit stock & price
  const [quickStockId, setQuickStockId] = useState<string | null>(null);
  const [quickStockValue, setQuickStockValue] = useState<number>(0);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const [notificationConfig, setNotificationConfig] = useState<NotificationStatusResponse | null>(null);
  const [isSendingNotification, setIsSendingNotification] = useState<string | null>(null);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats, ords, custs] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getAllOrders(),
        getAllCustomers()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setCustomers(custs);
      if (cats.length > 0 && !prodCategory) {
        setProdCategory(cats[0].name);
      }
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      loadAllData();
      checkNotificationStatus().then(status => setNotificationConfig(status)).catch(() => {});
    }
  }, [admin]);

  useEffect(() => {
    if (selectedOrderDetails) {
      setDrawerCarrier(selectedOrderDetails.carrierName || '');
      setDrawerNotes(selectedOrderDetails.trackingNotes || '');
      setDrawerStatus(selectedOrderDetails.orderStatus || selectedOrderDetails.status || 'Order received');
      setDrawerPaymentStatus(selectedOrderDetails.paymentStatus || 'Pending');
    }
  }, [selectedOrderDetails]);

  const handleSaveDrawerTracking = async () => {
    if (!selectedOrderDetails) return;
    setIsUpdatingTracking(true);
    try {
      await updateOrderTracking(selectedOrderDetails.id, {
        orderStatus: drawerStatus,
        paymentStatus: drawerPaymentStatus,
        carrierName: drawerCarrier.trim() || undefined,
        trackingNotes: drawerNotes.trim() || undefined
      });

      const updatedOrder: Order = {
        ...selectedOrderDetails,
        orderStatus: drawerStatus,
        status: drawerStatus,
        paymentStatus: drawerPaymentStatus,
        carrierName: drawerCarrier.trim() || undefined,
        trackingNotes: drawerNotes.trim() || undefined
      };

      setOrders(prev => prev.map(o => o.id === selectedOrderDetails.id ? updatedOrder : o));
      setSelectedOrderDetails(updatedOrder);
      notify(`Order ${selectedOrderDetails.id} tracking updated to "${drawerStatus}"`);
    } catch (err: any) {
      notify('Failed to update tracking: ' + err.message, 'error');
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  const handleTriggerNotification = async (order: Order) => {
    setIsSendingNotification(order.id);
    try {
      const res = await sendOrderNotificationToAdmin(order);
      const updatedStatus = {
        sent: res.sent,
        provider: res.provider,
        messageId: res.messageId,
        sentAt: res.sent ? new Date().toISOString() : undefined,
        recipient: res.recipient || 'alhajabizventure@gmail.com',
        details: res.message
      };

      await updateOrderNotificationStatus(order.id, updatedStatus);
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, notificationStatus: updatedStatus } : o));
      if (selectedOrderDetails && selectedOrderDetails.id === order.id) {
        setSelectedOrderDetails({ ...selectedOrderDetails, notificationStatus: updatedStatus });
      }

      if (res.sent) {
        notify('✓ Real order email confirmed delivered to alhajabizventure@gmail.com', 'success');
      } else {
        notify(res.message, 'info');
      }
    } catch (err: any) {
      notify('Failed to send notification: ' + err.message, 'error');
    } finally {
      setIsSendingNotification(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const loggedAdmin = await adminLogin(email, password);
      setAdmin(loggedAdmin);
      notify(`Welcome back, ${loggedAdmin.displayName}`);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setAdmin(null);
  };

  const formatNaira = (amount: number) => {
    return '₦' + (amount || 0).toLocaleString();
  };

  // Product actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(categories[0]?.name || 'Jalab & Abaya');
    setProdSubcategory('');
    setProdPrice(15000);
    setProdComparePrice(undefined);
    setProdStock(10);
    setProdDescription('');
    setProdShortDescription('');
    setProdImages([]);
    setProdSizes('S, M, L, XL');
    setProdColors('Black, Gold, Navy');
    setProdFeatured(false);
    setIsAddProductOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdSubcategory(p.subcategory || '');
    setProdPrice(p.price);
    setProdComparePrice(p.compareAtPrice);
    setProdStock(p.stock);
    setProdDescription(p.description || '');
    setProdShortDescription(p.shortDescription || '');
    setProdImages(p.images || []);
    setProdSizes((p.sizes || []).join(', '));
    setProdColors((p.colors || []).join(', '));
    setProdFeatured(p.featured || false);
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || prodPrice <= 0) {
      notify('Please provide a valid product name and price.', 'error');
      return;
    }

    if (prodImages.length === 0) {
      notify('Please upload at least one authentic product photograph for your inventory.', 'error');
      return;
    }

    const sizesArr = prodSizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = prodColors.split(',').map(c => c.trim()).filter(Boolean);
    const finalImages = prodImages;

    const payload = {
      name: prodName.trim(),
      slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: prodCategory,
      subcategory: prodSubcategory,
      price: Number(prodPrice),
      compareAtPrice: prodComparePrice ? Number(prodComparePrice) : undefined,
      stock: Number(prodStock),
      description: prodDescription,
      shortDescription: prodShortDescription || prodDescription.slice(0, 100),
      images: finalImages,
      sizes: sizesArr,
      colors: colorsArr,
      featured: prodFeatured,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        notify('Product updated successfully!');
      } else {
        await createProduct(payload);
        notify('New product added to inventory!');
      }
      setIsAddProductOpen(false);
      await loadAllData();
      if (onRefreshGlobalStore) onRefreshGlobalStore();
    } catch (err: any) {
      notify('Failed to save product: ' + err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
      return;
    }
    try {
      await deleteProduct(id);
      notify('Product removed');
      await loadAllData();
      if (onRefreshGlobalStore) onRefreshGlobalStore();
    } catch (err: any) {
      notify('Failed to delete product: ' + err.message, 'error');
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    try {
      const fileList = Array.from(files) as File[];
      const urls: string[] = [];
      for (const file of fileList) {
        const url = await uploadProductImage(file);
        urls.push(url);
      }
      setProdImages(prev => [...prev, ...urls]);
      notify(`${urls.length} actual photo(s) uploaded successfully!`);
    } catch (err: any) {
      notify('Image upload failed: ' + err.message, 'error');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (prodImageInput.trim()) {
      setProdImages(prev => [...prev, prodImageInput.trim()]);
      setProdImageInput('');
    }
  };

  const handleQuickStockSave = async (id: string) => {
    try {
      await updateProductStock(id, quickStockValue);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: quickStockValue } : p));
      setQuickStockId(null);
      notify('Stock updated');
    } catch (err: any) {
      notify('Error updating stock: ' + err.message, 'error');
    }
  };

  // Category Actions
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatDescription('');
    setCatImage('https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600');
    setCatSubcategories('');
    setIsAddCategoryOpen(true);
  };

  const handleOpenEditCategory = (c: CategoryItem) => {
    setEditingCategory(c);
    setCatName(c.name);
    setCatSlug(c.slug);
    setCatDescription(c.description);
    setCatImage(c.image);
    setCatSubcategories((c.subcategories || []).join(', '));
    setIsAddCategoryOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const subcats = catSubcategories.split(',').map(s => s.trim()).filter(Boolean);
    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const payload = {
      name: catName.trim(),
      slug,
      description: catDescription.trim(),
      image: catImage.trim() || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
      subcategories: subcats
    };

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
        notify('Category updated');
      } else {
        await createCategory(payload);
        notify('Category created');
      }
      setIsAddCategoryOpen(false);
      await loadAllData();
      if (onRefreshGlobalStore) onRefreshGlobalStore();
    } catch (err: any) {
      notify('Failed to save category: ' + err.message, 'error');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      notify('Category deleted');
      await loadAllData();
      if (onRefreshGlobalStore) onRefreshGlobalStore();
    } catch (err: any) {
      notify('Failed to delete category: ' + err.message, 'error');
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus, status: newStatus } : o));
      if (selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails(prev => prev ? { ...prev, orderStatus: newStatus, status: newStatus } : null);
      }
      notify(`Order ${orderId} marked as ${newStatus}`);
    } catch (err: any) {
      notify('Failed to update status: ' + err.message, 'error');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newStatus: PaymentStatus) => {
    try {
      await updatePaymentStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
      if (selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails(prev => prev ? { ...prev, paymentStatus: newStatus } : null);
      }
      notify(`Payment for ${orderId} marked as ${newStatus}`);
    } catch (err: any) {
      notify('Failed to update payment status: ' + err.message, 'error');
    }
  };

  // Calculations for overview
  const totalSales = orders.reduce((sum, o) => {
    return o.paymentStatus === 'Paid' ? sum + (o.total || 0) : sum;
  }, 0);
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || !o.orderStatus).length;
  const completedOrdersCount = orders.filter(o => o.orderStatus === 'Delivered').length;
  const lowStockProducts = products.filter(p => p.stock <= 3);

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'All') return true;
    return o.orderStatus === orderStatusFilter;
  });

  // Login view if unauthenticated
  if (!admin) {
    const isEmailAuthorized = isAuthorizedAdminEmail(email);

    return (
      <div className="min-h-screen bg-[#0D0C0A] text-white flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans">
        {/* Top Header with Return Link */}
        <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 border-b border-[#2A241A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C59A45]/20 to-[#8C6316]/30 border border-[#C59A45]/40 flex items-center justify-center text-[#E7CF9B] shadow-inner">
              <Shield className="w-5 h-5 text-[#C59A45]" />
            </div>
            <div>
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#F5E4B5]">
                RIDHAL VENTURES
              </h1>
              <p className="text-[10px] text-amber-200/60 uppercase tracking-widest">
                Store Administration & Security Portal
              </p>
            </div>
          </div>

          <button
            onClick={exitToStore}
            className="px-3.5 py-1.5 rounded-lg bg-[#1F1B14] hover:bg-[#2A241A] border border-[#3E382E] text-xs text-[#E7CF9B] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* Main Content Grid */}
        <main className="max-w-6xl w-full mx-auto my-6 sm:my-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Full Details of Admin Logins & Privileges */}
          <div className="lg:col-span-6 bg-[#161411] border border-[#3A3326] rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A241A]">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#C59A45]" />
                <h2 className="text-sm sm:text-base font-serif font-bold text-[#F5E4B5]">
                  Authorized Admin Login Details
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#2E281C] text-[#C59A45] border border-[#C59A45]/30 text-[10px] font-semibold tracking-wider uppercase">
                RBAC Security
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Below are the official authorized credentials and administrative privileges required to access the Ridhal Ventures management backend.
            </p>

            {/* Authorized Accounts List */}
            <div className="space-y-2.5">
              <label className="block text-[11px] uppercase tracking-wider text-amber-200/70 font-semibold">
                Authorized Administrator Accounts
              </label>

              {/* Account 1: Master Admin */}
              <div 
                onClick={() => {
                  setEmail('admin@ridhalventures.com');
                  setPassword('Admin2026!');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  email === 'admin@ridhalventures.com'
                    ? 'bg-[#262016] border-[#C59A45] text-white shadow-sm'
                    : 'bg-[#1A1814] border-[#2E281C] text-gray-300 hover:border-[#4D422E]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#F5E4B5]">
                    <span>admin@ridhalventures.com</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C59A45]/20 text-[#DFC377] border border-[#C59A45]/40 font-mono">
                      Master
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Primary store manager with full catalog, orders & settings access
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy('admin@ridhalventures.com', 'Master Email');
                  }}
                  className="p-1.5 rounded-lg bg-[#2D261A] hover:bg-[#3D3322] text-[#DFC377] transition-colors text-[10px] flex items-center gap-1 shrink-0 ml-2"
                  title="Copy email"
                >
                  <Copy className="w-3 h-3" />
                  {copyFeedback === 'Master Email' ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Account 2: Store Owner */}
              <div 
                onClick={() => {
                  setEmail('ipesolasulaiman@gmail.com');
                  setPassword('Admin2026!');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  email === 'ipesolasulaiman@gmail.com'
                    ? 'bg-[#262016] border-[#C59A45] text-white shadow-sm'
                    : 'bg-[#1A1814] border-[#2E281C] text-gray-300 hover:border-[#4D422E]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#F5E4B5]">
                    <span>ipesolasulaiman@gmail.com</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 font-mono">
                      Owner
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Store proprietor executive access & financial management
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy('ipesolasulaiman@gmail.com', 'Owner Email');
                  }}
                  className="p-1.5 rounded-lg bg-[#2D261A] hover:bg-[#3D3322] text-[#DFC377] transition-colors text-[10px] flex items-center gap-1 shrink-0 ml-2"
                  title="Copy email"
                >
                  <Copy className="w-3 h-3" />
                  {copyFeedback === 'Owner Email' ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Account 3: Operations & Dispatch */}
              <div 
                onClick={() => {
                  setEmail('alhajabizventure@gmail.com');
                  setPassword('Admin2026!');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  email === 'alhajabizventure@gmail.com'
                    ? 'bg-[#262016] border-[#C59A45] text-white shadow-sm'
                    : 'bg-[#1A1814] border-[#2E281C] text-gray-300 hover:border-[#4D422E]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#F5E4B5]">
                    <span>alhajabizventure@gmail.com</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50 font-mono">
                      Operations
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Order dispatch, logistics tracking & notification routing
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy('alhajabizventure@gmail.com', 'Ops Email');
                  }}
                  className="p-1.5 rounded-lg bg-[#2D261A] hover:bg-[#3D3322] text-[#DFC377] transition-colors text-[10px] flex items-center gap-1 shrink-0 ml-2"
                  title="Copy email"
                >
                  <Copy className="w-3 h-3" />
                  {copyFeedback === 'Ops Email' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Standard Access Key / Password */}
            <div className="p-3.5 bg-[#1B1915] border border-[#3E382E] rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-amber-200/60 font-semibold">
                  Administrator Access Key / Password
                </div>
                <div className="font-mono text-sm font-bold text-[#E7CF9B] mt-0.5 flex items-center gap-2">
                  <span>Admin2026!</span>
                  <span className="text-[10px] font-normal text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    Active & Verified
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopy('Admin2026!', 'Password')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#2D261A] hover:bg-[#3D3322] text-[#DFC377] transition-colors text-xs flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copyFeedback === 'Password' ? 'Copied' : 'Copy Key'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPassword('Admin2026!');
                    setCopyFeedback('Filled');
                    setTimeout(() => setCopyFeedback(null), 1500);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#C59A45]/20 hover:bg-[#C59A45]/30 text-[#F5E4B5] border border-[#C59A45]/40 transition-colors text-xs font-semibold"
                >
                  {copyFeedback === 'Filled' ? 'Filled ✓' : 'Use Key'}
                </button>
              </div>
            </div>

            {/* Permissions Summary Granted Upon Approval */}
            <div className="pt-2 border-t border-[#2A241A]">
              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                Capabilities Granted Upon Entry Approval
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Real-time inventory & pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Firestore order dispatcher</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Tracking numbers & carriers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Customer registry & notes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Delivery zones & tariffs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Promotional coupon codes</span>
                </div>
              </div>
            </div>

            {/* Database & Security Banner */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#12110F] border border-[#2A241A] text-[11px] text-gray-400">
              <Database className="w-3.5 h-3.5 text-[#C59A45] shrink-0" />
              <span>
                Connected to <strong className="text-gray-200">Firebase Firestore Cloud Database</strong> with Role-Based Security Rules.
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Pre-Approval Verification & Sign-In Form */}
          <div className="lg:col-span-6 bg-[#1C1A17] border border-[#C59A45]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header Badge */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#C59A45]/15 border border-[#C59A45]/40 text-[#DFC377] text-xs font-semibold uppercase tracking-wider mb-3">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Pre-Approval Verification</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5E4B5]">
                Admin Sign-In & Entry Approval
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Verify credentials below before approving access into the administrator dashboard.
              </p>
            </div>

            {/* Dynamic Pre-Approval Status Box */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              isEmailAuthorized
                ? 'bg-emerald-950/25 border-emerald-600/40 text-emerald-200'
                : 'bg-amber-950/25 border-amber-600/40 text-amber-200'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  {isEmailAuthorized ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Authorized Admin Account:</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Account Verification:</span>
                    </>
                  )}
                  <span className="font-mono font-bold text-white text-xs truncate max-w-[190px]">
                    {email || 'None selected'}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  isEmailAuthorized
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isEmailAuthorized ? 'Approved' : 'Verify'}
                </span>
              </div>
              <div className="text-[11px] text-gray-300 mt-1.5">
                {isEmailAuthorized
                  ? 'Email matches whitelisted administrators in firestore.rules and adminAuthService.'
                  : 'Please select one of the authorized administrator accounts on the left.'}
              </div>
            </div>

            {/* Error Message if any */}
            {loginError && (
              <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Authentication Error</div>
                  <div>{loginError}</div>
                </div>
              </div>
            )}

            {/* The Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1.5 font-semibold">
                  Administrator Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#12110F] border border-[#3E382E] rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#C59A45] transition-colors"
                    placeholder="admin@ridhalventures.com"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isEmailAuthorized ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Mail className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                    Administrator Access Key / Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#C59A45] hover:text-[#DFC377] flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide Key' : 'Show Key'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#12110F] border border-[#3E382E] rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#C59A45] transition-colors font-mono"
                    placeholder="••••••••"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-gradient-to-r from-[#9E7422] via-[#C59A45] to-[#DFC377] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying & Authenticating Admin...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-black" />
                      <span>Approve Credentials & Enter Admin</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@ridhalventures.com');
                    setPassword('Admin2026!');
                    setLoginError('');
                    setCopyFeedback('Filled Master');
                    setTimeout(() => setCopyFeedback(null), 1500);
                  }}
                  className="w-full py-2.5 bg-[#25221C] hover:bg-[#2F2B24] border border-[#453D30] text-[#E7CF9B] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
                  <span>{copyFeedback === 'Filled Master' ? 'Master Details Loaded ✓' : 'Auto-Fill Master Administrator Credentials'}</span>
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-[#2D281F] flex items-center justify-between text-xs text-gray-400">
              <span>Customer storefront view?</span>
              <button
                onClick={exitToStore}
                className="text-[#C59A45] hover:underline flex items-center gap-1 font-medium"
              >
                Return to Store <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-6xl w-full mx-auto py-3 border-t border-[#221E17] text-center text-xs text-gray-500">
          Ridhal Ventures Administrative Suite • Ijebu-Ode, Ogun State, Nigeria • Phone: 09165317293
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0E0C] text-gray-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs tracking-wide animate-fade-in border ${
          notification.type === 'error'
            ? 'bg-red-950 text-red-200 border-red-800'
            : notification.type === 'info'
            ? 'bg-[#25221C] text-amber-200 border-[#C59A45]'
            : 'bg-[#C59A45] text-black border-[#F5E4B5]'
        }`}>
          {notification.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-[#181613] border-b border-[#2D281F] sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#C59A45]/20 border border-[#C59A45] flex items-center justify-center text-[#C59A45]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm text-[#F5E4B5] tracking-wider leading-none">
                RIDHAL VENTURES
              </h1>
              <span className="text-[10px] text-amber-200/50 uppercase tracking-widest">
                Admin Control Room
              </span>
            </div>
          </div>

          {/* Quick Tabs */}
          <nav className="hidden md:flex items-center gap-1 ml-6 border-l border-[#2D281F] pl-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-[#C59A45] text-black font-bold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'products' 
                  ? 'bg-[#C59A45] text-black font-bold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'categories' 
                  ? 'bg-[#C59A45] text-black font-bold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'orders' 
                  ? 'bg-[#C59A45] text-black font-bold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Orders ({orders.length})
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'customers' 
                  ? 'bg-[#C59A45] text-black font-bold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Customers ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'delivery' 
                  ? 'bg-[#C59A45] text-black font-bold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Delivery
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'coupons' 
                  ? 'bg-[#C59A45] text-black font-bold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Coupons
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            title="Refresh database"
            className="p-2 text-gray-400 hover:text-[#C59A45] rounded-lg hover:bg-[#25221C] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exitToStore}
            className="text-xs px-3 py-1.5 border border-[#3E382E] rounded-lg text-amber-200/80 hover:border-[#C59A45] transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> View Store
          </button>
          <button
            onClick={handleLogout}
            title="Log out"
            className="text-xs px-3 py-1.5 bg-red-950/40 border border-red-900/50 rounded-lg text-red-300 hover:bg-red-900/60 transition-colors flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#F5E4B5]">Executive Dashboard</h2>
                <p className="text-xs text-gray-400">Real-time inventory and sales operations for Ridhal Ventures</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#C59A45] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-[#25221C] border border-[#3E382E] text-amber-200 font-bold text-xs uppercase tracking-wider rounded-xl hover:border-[#C59A45] flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4" /> New Category
                </button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-5">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">Total Sales</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white font-serif">
                  {formatNaira(totalSales)}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Confirmed paid orders</p>
              </div>

              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-5">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">Total Orders</span>
                  <div className="p-2 rounded-xl bg-[#C59A45]/10 text-[#C59A45]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white font-serif">
                  {orders.length}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Lifetime customer orders</p>
              </div>

              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-5">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">Pending Orders</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white font-serif">
                  {pendingOrdersCount}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Requires processing or shipping</p>
              </div>

              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-5">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">Completed Orders</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white font-serif">
                  {completedOrdersCount}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Delivered to customers</p>
              </div>
            </div>

            {/* Low stock alerts & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-2 bg-[#181613] border border-[#2D281F] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-200">
                    Recent Customer Invoices
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#C59A45] hover:underline flex items-center gap-1"
                  >
                    View all orders <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#25221C] border border-[#3E382E] flex items-center justify-center mx-auto text-gray-500 mb-2">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-gray-300">No Orders Recorded Yet</p>
                    <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto">
                      Real customer transactions, delivery tracking, and payment statuses will appear here once orders are placed.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#24201A]">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-amber-300">{o.id}</span>
                          <div className="text-gray-400 text-[11px]">
                            {o.customerDetails?.fullName || 'Customer'} • {o.items?.length || 0} items
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">{formatNaira(o.total)}</div>
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            o.orderStatus === 'Delivered' ? 'bg-emerald-900/60 text-emerald-300' :
                            o.orderStatus === 'Shipped' ? 'bg-blue-900/60 text-blue-300' :
                            'bg-amber-900/60 text-amber-300'
                          }`}>
                            {o.orderStatus || 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Low Stock Warning */}
              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-200">
                    Low Stock Watchlist
                  </h3>
                </div>

                {products.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#25221C] border border-[#3E382E] flex items-center justify-center mx-auto text-gray-500 mb-2">
                      <Package className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-gray-300">No Inventory Added</p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Upload your products to begin automatic stock tracking.
                    </p>
                  </div>
                ) : lowStockProducts.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-emerald-300">Healthy Stock Levels</p>
                    <p className="text-[11px] text-gray-500 mt-1">All physical products have 4 or more units available.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center justify-between text-xs p-2.5 bg-[#12110E] rounded-xl border border-[#2D281F]">
                        <div className="truncate pr-2">
                          <p className="font-medium text-white truncate">{p.name}</p>
                          <span className="text-[10px] text-gray-400">{p.category}</span>
                        </div>
                        <span className="px-2 py-1 rounded bg-red-950 text-red-300 font-mono font-bold text-[11px] whitespace-nowrap">
                          {p.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#F5E4B5]">Product Inventory</h2>
                <p className="text-xs text-gray-400">Manage catalog, upload photos, update stock & prices in Firestore</p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-[#C59A45] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-[#181613] p-3 rounded-2xl border border-[#2D281F]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by title..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#C59A45]"
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={e => setProductCategoryFilter(e.target.value)}
                className="bg-[#12110E] border border-[#3E382E] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C59A45]"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Product Table */}
            {products.length === 0 ? (
              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#25221C] border border-[#3E382E] flex items-center justify-center mx-auto text-[#C59A45]">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Products in Inventory</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Your store inventory is empty. Click &ldquo;Add New Product&rdquo; to upload authentic photographs, set stock quantities, and publish items.
                </p>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#C59A45] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add First Product
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-8 text-center text-xs text-gray-400">
                No products match your search filter.
              </div>
            ) : (
              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#12110E] border-b border-[#2D281F] text-gray-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#24201A]">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-[#1C1A16] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=150'}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-lg object-cover bg-black border border-[#2D281F]"
                              />
                              <div>
                                <p className="font-semibold text-white truncate max-w-xs">{p.name}</p>
                                <span className="text-[10px] text-gray-500 font-mono">ID: {p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-amber-200/80">
                            {p.category}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-white">
                            {formatNaira(p.price)}
                            {p.compareAtPrice && (
                              <span className="block text-[10px] text-gray-500 line-through">
                                {formatNaira(p.compareAtPrice)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {quickStockId === p.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  value={quickStockValue}
                                  onChange={e => setQuickStockValue(Number(e.target.value))}
                                  className="w-16 bg-[#12110E] border border-[#C59A45] rounded px-2 py-1 text-xs text-white"
                                />
                                <button
                                  onClick={() => handleQuickStockSave(p.id)}
                                  className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setQuickStockId(null)}
                                  className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setQuickStockId(p.id);
                                  setQuickStockValue(p.stock);
                                }}
                                className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                                  p.stock <= 3 
                                    ? 'bg-red-950/60 text-red-300 border border-red-900/50' 
                                    : 'bg-[#25221C] text-amber-200 border border-[#3E382E]'
                                }`}
                              >
                                {p.stock} in stock <Edit className="w-2.5 h-2.5 opacity-60" />
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {p.featured ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#C59A45]/20 text-[#C59A45] text-[10px] font-bold">
                                Featured
                              </span>
                            ) : (
                              <span className="text-gray-500 text-[10px]">Standard</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                title="Edit product"
                                className="p-1.5 text-gray-400 hover:text-[#C59A45] hover:bg-[#25221C] rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                title="Delete product"
                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#F5E4B5]">Manage Store Categories</h2>
                <p className="text-xs text-gray-400">Classify departments and sub-categories in Firestore</p>
              </div>
              <button
                onClick={handleOpenAddCategory}
                className="px-4 py-2 bg-[#C59A45] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#25221C] border border-[#3E382E] flex items-center justify-center mx-auto text-[#C59A45]">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Categories Defined</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Organize your store collections by creating categories like Aso Oke, Swiss Voile Lace, Ankara, or Ready-to-Wear.
                </p>
                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-[#C59A45] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create First Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map(c => {
                  const count = products.filter(p => p.category === c.name).length;
                  return (
                    <div key={c.id} className="bg-[#181613] border border-[#2D281F] rounded-2xl overflow-hidden flex flex-col">
                      <div className="h-32 relative bg-black">
                        <img
                          src={c.image}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1">
                          <button
                            onClick={() => handleOpenEditCategory(c)}
                            className="p-1 text-gray-300 hover:text-[#C59A45]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="p-1 text-gray-300 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-sm text-white font-serif">{c.name}</h3>
                            <span className="text-[10px] text-[#C59A45] font-mono">{count} items</span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                            {c.description}
                          </p>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          slug: /{c.slug}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#F5E4B5]">Customer Orders</h2>
                <p className="text-xs text-gray-400">Track and fulfill sales, update status, and inspect delivery data</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Filter:</span>
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="bg-[#181613] border border-[#3E382E] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#C59A45]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Email Notification Channel Status Banner */}
            <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Order Notification Channel:</span>
                    <span className="font-mono text-amber-300">alhajabizventure@gmail.com</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {notificationConfig?.configured ? (
                      <span className="text-emerald-400 font-medium">
                        ✓ Real notification provider connected via {notificationConfig.provider}. Live confirmation emails dispatch on orders.
                      </span>
                    ) : (
                      <span className="text-amber-300/80">
                        Order notification gateway initialized. Add live RESEND_API_KEY, SENDGRID_API_KEY, or SMTP credentials to environment secrets to dispatch real emails.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            {orders.length === 0 ? (
              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#25221C] border border-[#3E382E] flex items-center justify-center mx-auto text-gray-500">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Customer Orders Yet</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  When customers purchase products in your store, their orders, contact details, payment statuses, and email notification confirmations will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#12110E] border-b border-[#2D281F] text-gray-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Destination</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Order Status</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Email Alert</th>
                        <th className="py-3 px-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#24201A]">
                      {filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-[#1C1A16] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-amber-300">
                            {o.id}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-white">{o.customerDetails?.fullName || 'Customer'}</p>
                            <span className="text-[10px] text-gray-500 font-mono">{o.customerDetails?.phone}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {o.customerDetails?.city}, {o.customerDetails?.state}
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-400">
                            {o.items?.length || 0} items
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-white">
                            {formatNaira(o.total)}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={o.orderStatus || 'Pending'}
                              onChange={e => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                              className="bg-[#12110E] border border-[#3E382E] rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#C59A45]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={o.paymentStatus || 'Pending'}
                              onChange={e => handleUpdatePaymentStatus(o.id, e.target.value as PaymentStatus)}
                              className={`rounded-lg px-2 py-1 text-[11px] font-semibold border ${
                                o.paymentStatus === 'Paid' 
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' 
                                  : 'bg-amber-950/60 text-amber-300 border-amber-800'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {o.notificationStatus?.sent ? (
                              <span 
                                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                                title={`Delivered to alhajabizventure@gmail.com via ${o.notificationStatus.provider || 'email provider'}`}
                              >
                                <Check className="w-2.5 h-2.5" /> Sent
                              </span>
                            ) : (
                              <button
                                onClick={() => handleTriggerNotification(o)}
                                disabled={isSendingNotification === o.id}
                                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-950/60 text-amber-300 border border-amber-800/60 hover:bg-amber-900 transition-colors"
                                title="Attempt real email delivery to alhajabizventure@gmail.com"
                              >
                                {isSendingNotification === o.id ? (
                                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                                ) : (
                                  <Mail className="w-2.5 h-2.5" />
                                )}
                                Send Alert
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(o)}
                              className="px-2.5 py-1 rounded bg-[#25221C] border border-[#3E382E] text-amber-200 hover:border-[#C59A45] transition-colors text-[11px]"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#F5E4B5]">Customer Registry</h2>
              <p className="text-xs text-gray-400">Directory of registered shoppers and order histories</p>
            </div>

            {customers.length === 0 ? (
              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#25221C] border border-[#3E382E] flex items-center justify-center mx-auto text-gray-500">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Customer Profiles Yet</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Buyer accounts and delivery history are generated automatically when customers place an order through checkout.
                </p>
              </div>
            ) : (
              <div className="bg-[#181613] border border-[#2D281F] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#12110E] border-b border-[#2D281F] text-gray-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Primary Address</th>
                        <th className="py-3 px-4">Orders Placed</th>
                        <th className="py-3 px-4">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#24201A]">
                      {customers.map(c => {
                        const customerOrders = orders.filter(
                          o => o.customerId === c.id || o.customerDetails?.phone === c.phone || o.customerDetails?.email === c.email
                        );
                        const addr = c.addresses?.[0];
                        return (
                          <tr key={c.id} className="hover:bg-[#1C1A16] transition-colors">
                            <td className="py-3 px-4 font-semibold text-white">
                              {c.name}
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-gray-300">{c.phone}</div>
                              <span className="text-[10px] text-gray-500">{c.email}</span>
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {addr ? `${addr.address}, ${addr.city}, ${addr.state}` : 'None saved'}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-[#C59A45]">
                              {customerOrders.length} orders
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-[10px]">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DELIVERY TAB */}
        {activeTab === 'delivery' && (
          <AdminDeliveryManagement />
        )}

        {/* COUPONS TAB */}
        {activeTab === 'coupons' && (
          <AdminCouponManagement />
        )}
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181613] border border-[#C59A45]/40 rounded-2xl max-w-2xl w-full p-6 my-8 text-xs text-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D281F] mb-4">
              <h3 className="text-base font-bold font-serif text-[#F5E4B5]">
                {editingProduct ? 'Edit Product' : 'Add New Inventory Item'}
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={e => setProdName(e.target.value)}
                    placeholder="e.g. Royal Dubai Gold Embellished Abaya"
                    className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                    Category Department *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={e => setProdCategory(e.target.value)}
                    className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                    Price in Naira (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={prodPrice}
                    onChange={e => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                    Compare Price (Crossed out)
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={prodComparePrice || ''}
                    onChange={e => setProdComparePrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 25000"
                    className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                    Inventory Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodStock}
                    onChange={e => setProdStock(Number(e.target.value))}
                    className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={e => setProdDescription(e.target.value)}
                  placeholder="Detailed specifications, fabric composition, origin, and occasion styling tips..."
                  className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl p-3 text-white focus:outline-none focus:border-[#C59A45]"
                />
              </div>

              {/* Product Images */}
              <div>
                <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                  Product Images ({prodImages.length})
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {prodImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#3E382E]">
                      <img src={img} alt="preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProdImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL (https://...)"
                    value={prodImageInput}
                    onChange={e => setProdImageInput(e.target.value)}
                    className="flex-1 bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-[#25221C] border border-[#3E382E] rounded-xl text-amber-200 hover:border-[#C59A45]"
                  >
                    Add URL
                  </button>
                  <label className="px-3 py-2 bg-[#C59A45]/20 border border-[#C59A45] rounded-xl text-[#C59A45] cursor-pointer hover:bg-[#C59A45]/30 flex items-center justify-center gap-1.5 whitespace-nowrap">
                    {isUploadingImage ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Upload File
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                    Sizes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={prodSizes}
                    onChange={e => setProdSizes(e.target.value)}
                    placeholder="M, L, XL, XXL or 42, 43, 44"
                    className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                    Colors (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={prodColors}
                    onChange={e => setProdColors(e.target.value)}
                    placeholder="Black, Gold, Emerald Green"
                    className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={prodFeatured}
                  onChange={e => setProdFeatured(e.target.checked)}
                  className="rounded border-[#3E382E] text-[#C59A45] focus:ring-0"
                />
                <label htmlFor="featuredCheckbox" className="text-xs text-gray-300 font-medium">
                  Feature this item on homepage and curated showcases
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2D281F]">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border border-[#3E382E] rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#9E7422] to-[#C59A45] text-black font-bold uppercase tracking-wider rounded-xl hover:opacity-90"
                >
                  {editingProduct ? 'Save Updates' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT CATEGORY MODAL */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181613] border border-[#C59A45]/40 rounded-2xl max-w-md w-full p-6 text-xs text-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D281F] mb-4">
              <h3 className="text-base font-bold font-serif text-[#F5E4B5]">
                {editingCategory ? 'Edit Category' : 'Add New Department'}
              </h3>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  placeholder="e.g. Jalab & Abaya"
                  className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                  Category Banner Image URL
                </label>
                <input
                  type="text"
                  value={catImage}
                  onChange={e => setCatImage(e.target.value)}
                  className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={e => setCatDescription(e.target.value)}
                  placeholder="Brief description for category tiles..."
                  className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl p-3 text-white focus:outline-none focus:border-[#C59A45]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-400 mb-1 text-[10px] font-semibold">
                  Subcategories (comma-separated)
                </label>
                <input
                  type="text"
                  value={catSubcategories}
                  onChange={e => setCatSubcategories(e.target.value)}
                  placeholder="Men's Jalab, Women's Abaya, Kids"
                  className="w-full bg-[#12110E] border border-[#3E382E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C59A45]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2D281F]">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 border border-[#3E382E] rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C59A45] text-black font-bold uppercase tracking-wider rounded-xl hover:opacity-90"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER INSPECTION DRAWER */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181613] border border-[#C59A45]/40 rounded-2xl max-w-xl w-full p-6 text-xs text-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D281F] mb-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Order Details</span>
                <h3 className="text-base font-bold font-mono text-amber-300">
                  {selectedOrderDetails.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Customer contact */}
              <div className="bg-[#12110E] p-3.5 rounded-xl border border-[#2D281F] space-y-1.5">
                <p className="font-bold text-white">{selectedOrderDetails.customerDetails?.fullName}</p>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-3.5 h-3.5 text-[#C59A45]" />
                  <span>{selectedOrderDetails.customerDetails?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-3.5 h-3.5 text-[#C59A45]" />
                  <span>{selectedOrderDetails.customerDetails?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-[#C59A45]" />
                  <span>
                    {selectedOrderDetails.customerDetails?.deliveryAddress}, {selectedOrderDetails.customerDetails?.city}, {selectedOrderDetails.customerDetails?.state}
                  </span>
                </div>
                {selectedOrderDetails.customerDetails?.orderNotes && (
                  <p className="text-[11px] text-amber-200/80 italic mt-2 pt-2 border-t border-[#24201A]">
                    Note: "{selectedOrderDetails.customerDetails.orderNotes}"
                  </p>
                )}
              </div>

              {/* Items List */}
              <div className="border border-[#2D281F] rounded-xl overflow-hidden divide-y divide-[#24201A]">
                {selectedOrderDetails.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-[#12110E]">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=100'}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-white">{item.product?.name}</p>
                        <span className="text-[10px] text-gray-400">
                          Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''} {item.selectedColor ? `• Color: ${item.selectedColor}` : ''}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="bg-[#12110E] p-3.5 rounded-xl border border-[#2D281F] space-y-1">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span>{formatNaira(selectedOrderDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping Fee ({selectedOrderDetails.customerDetails?.state}):</span>
                  <span>{formatNaira(selectedOrderDetails.deliveryFee)}</span>
                </div>
                {selectedOrderDetails.discountAmount && selectedOrderDetails.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Coupon ({selectedOrderDetails.appliedCoupon}):</span>
                    <span>-{formatNaira(selectedOrderDetails.discountAmount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-[#24201A]">
                  <span>Total Amount:</span>
                  <span className="text-[#C59A45]">{formatNaira(selectedOrderDetails.total)}</span>
                </div>
              </div>

              {/* Order Tracking & Fulfillment Status Control */}
              <div className="bg-[#12110E] p-3.5 rounded-xl border border-[#3E382E] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#C59A45]" />
                    Order Status & Tracking Controls
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#25221C] text-[#C59A45] border border-[#3E382E]">
                    {drawerStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-gray-400 mb-1 text-[10px]">Fulfillment Status</label>
                    <select
                      value={drawerStatus}
                      onChange={(e) => setDrawerStatus(e.target.value as OrderStatus)}
                      className="w-full bg-[#181613] border border-[#3E382E] rounded-lg px-2.5 py-1.5 text-white"
                    >
                      <option value="Order received">1. Order received</option>
                      <option value="Payment pending">2. Payment pending</option>
                      <option value="Payment confirmed">3. Payment confirmed</option>
                      <option value="Processing">4. Processing / Packaging</option>
                      <option value="Ready for delivery">5. Ready for delivery</option>
                      <option value="Shipped">6. Shipped / In Transit</option>
                      <option value="Delivered">7. Delivered to Customer</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 text-[10px]">Payment Status</label>
                    <select
                      value={drawerPaymentStatus}
                      onChange={(e) => setDrawerPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full bg-[#181613] border border-[#3E382E] rounded-lg px-2.5 py-1.5 text-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-gray-400 mb-1 text-[10px]">Courier / Dispatcher Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ridhal Local Dispatch, GIG, DHL"
                      value={drawerCarrier}
                      onChange={(e) => setDrawerCarrier(e.target.value)}
                      className="w-full bg-[#181613] border border-[#3E382E] rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 text-[10px]">Tracking Notes / ETA Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g. Dispatched from Ijebu-Ode, arrival 4pm"
                      value={drawerNotes}
                      onChange={(e) => setDrawerNotes(e.target.value)}
                      className="w-full bg-[#181613] border border-[#3E382E] rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveDrawerTracking}
                  disabled={isUpdatingTracking}
                  className="w-full py-2 bg-[#C59A45] hover:bg-[#A37B2C] text-black font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isUpdatingTracking ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Save Tracking & Order Status
                </button>
              </div>

              {/* Order Notification To Admin */}
              <div className="bg-[#12110E] p-3.5 rounded-xl border border-[#2D281F] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C59A45]" />
                    Admin Notification
                  </span>
                  <span className="font-mono text-[10px] text-amber-300">
                    alhajabizventure@gmail.com
                  </span>
                </div>

                {selectedOrderDetails.notificationStatus?.sent ? (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-[11px] text-emerald-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Delivered via {selectedOrderDetails.notificationStatus.provider || 'email provider'}
                    </div>
                    {selectedOrderDetails.notificationStatus.sentAt && (
                      <div className="text-[10px] text-emerald-400/80">
                        Dispatched: {new Date(selectedOrderDetails.notificationStatus.sentAt).toLocaleString()}
                      </div>
                    )}
                    {selectedOrderDetails.notificationStatus.messageId && (
                      <div className="text-[10px] text-emerald-400/70 font-mono truncate">
                        ID: {selectedOrderDetails.notificationStatus.messageId}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-lg text-[11px] text-amber-300">
                    {selectedOrderDetails.notificationStatus?.details || 'Notification pending. Live send requires email API key on backend.'}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleTriggerNotification(selectedOrderDetails)}
                  disabled={isSendingNotification === selectedOrderDetails.id}
                  className="w-full py-2 bg-[#25221C] border border-[#3E382E] text-amber-200 hover:border-[#C59A45] rounded-xl font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isSendingNotification === selectedOrderDetails.id ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Mail className="w-3 h-3" />
                  )}
                  {selectedOrderDetails.notificationStatus?.sent
                    ? 'Resend Notification to alhajabizventure@gmail.com'
                    : 'Dispatch Notification to alhajabizventure@gmail.com'}
                </button>
              </div>

              {/* Quick WhatsApp message */}
              <a
                href={`https://wa.me/234${selectedOrderDetails.customerDetails?.phone.replace(/^0/, '')}?text=${encodeURIComponent(`Hello ${selectedOrderDetails.customerDetails?.fullName}, regarding your Ridhal Ventures order ${selectedOrderDetails.id} (${selectedOrderDetails.orderStatus})...`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                <Phone className="w-4 h-4" /> Message Buyer on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
