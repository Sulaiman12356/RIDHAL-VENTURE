import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  Key, 
  CheckCircle, 
  Clock, 
  Truck, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Printer, 
  MessageCircle, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { 
  loginCustomer, 
  registerCustomer, 
  loginWithGoogle, 
  sendCustomerPasswordReset, 
  logoutCustomer, 
  addCustomerAddress, 
  deleteCustomerAddress, 
  setDefaultAddress, 
  updateCustomerProfile, 
  getCustomerOrders 
} from '../services/customerAuthService';
import { Customer, DeliveryAddress, Order, ActivePage } from '../types';
import { formatNaira, NIGERIAN_STATES } from '../data/products';
import { ORDER_STATUS_STEPS, getOrderStatusStepIndex } from '../services/trackingService';

interface AccountViewProps {
  onNavigate: (page: ActivePage, extra?: any) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ onNavigate }) => {
  const { currentCustomer, refreshCustomer, showToast, deliveryZones } = useCart();

  // Auth form states (if not logged in)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Active tab when logged in
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  // Customer Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Address form modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Home');
  const [newAddrFullName, setNewAddrFullName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Ijebu-Ode');
  const [newAddrState, setNewAddrState] = useState('Ogun');
  const [newAddrDefault, setNewAddrDefault] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);

  // Edit Profile
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Load orders when customer is active
  useEffect(() => {
    if (currentCustomer) {
      setProfileName(currentCustomer.name || '');
      setProfilePhone(currentCustomer.phone || '');
      loadOrders();
    }
  }, [currentCustomer]);

  const loadOrders = async () => {
    if (!currentCustomer) return;
    setOrdersLoading(true);
    try {
      const list = await getCustomerOrders(currentCustomer.id, currentCustomer.email);
      setOrders(list);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      await loginCustomer(email, password);
      await refreshCustomer();
      showToast('Welcome back to Ridhal Ventures!');
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      await registerCustomer(email, password, fullName, phone);
      await refreshCustomer();
      showToast('Account created successfully! Welcome to Ridhal Ventures.');
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
      await refreshCustomer();
      showToast('Signed in with Google.');
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      await sendCustomerPasswordReset(email);
      setAuthSuccess('Password reset link sent to your email. Check your inbox or spam folder.');
    } catch (err: any) {
      setAuthError(err.message || 'Unable to send password reset email.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutCustomer();
    await refreshCustomer();
    setOrders([]);
    showToast('You have been logged out.');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;
    setSavingProfile(true);
    try {
      await updateCustomerProfile(currentCustomer.id, {
        name: profileName.trim(),
        phone: profilePhone.trim()
      });
      await refreshCustomer();
      showToast('Profile updated successfully.');
    } catch (err: any) {
      showToast('Error updating profile: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;
    if (!newAddrFullName || !newAddrPhone || !newAddrStreet) {
      showToast('Please fill all required address fields.');
      return;
    }
    setSavingAddress(true);
    try {
      await addCustomerAddress(currentCustomer.id, {
        title: newAddrTitle,
        fullName: newAddrFullName,
        phone: newAddrPhone,
        address: newAddrStreet,
        city: newAddrCity,
        state: newAddrState,
        isDefault: newAddrDefault || (currentCustomer.addresses?.length === 0)
      });
      await refreshCustomer();
      setShowAddressModal(false);
      // Reset
      setNewAddrStreet('');
      showToast('Address added to your account.');
    } catch (err: any) {
      showToast('Error saving address: ' + err.message);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!currentCustomer) return;
    if (!confirm('Are you sure you want to delete this delivery address?')) return;
    try {
      await deleteCustomerAddress(currentCustomer.id, addrId);
      await refreshCustomer();
      showToast('Address removed.');
    } catch (err: any) {
      showToast('Error deleting address: ' + err.message);
    }
  };

  const handleSetDefaultAddress = async (addrId: string) => {
    if (!currentCustomer) return;
    try {
      await setDefaultAddress(currentCustomer.id, addrId);
      await refreshCustomer();
      showToast('Default delivery address updated.');
    } catch (err: any) {
      showToast('Error setting default address: ' + err.message);
    }
  };

  // IF NOT LOGGED IN: SHOW AUTH SCREEN
  if (!currentCustomer) {
    return (
      <div className="min-h-[75vh] bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#E5DFD5] rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif text-[#121212] tracking-wide">
              {authMode === 'login' ? 'Customer Sign In' : authMode === 'register' ? 'Create Your Account' : 'Reset Password'}
            </h1>
            <p className="text-sm text-[#736B63] mt-2">
              {authMode === 'login' 
                ? 'Access your orders, saved delivery addresses, and wishlist.' 
                : authMode === 'register'
                ? 'Join Ridhal Ventures for seamless modest fashion shopping.'
                : 'Enter your email address to receive recovery instructions.'}
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 text-emerald-800 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-sm focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setAuthError(null); }}
                    className="text-xs text-[#9E7422] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-sm focus:outline-none focus:border-[#9E7422]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B63] hover:text-[#121212] transition-colors p-1"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-[#121212] hover:bg-[#2A2A2A] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {authLoading ? 'Signing In...' : 'Sign In to Account'}
              </button>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5DFD5]"></div></div>
                <span className="relative bg-white px-3 text-xs text-[#736B63] uppercase tracking-wider">Or</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full py-2.5 border border-[#E5DFD5] hover:bg-[#FAF8F5] rounded-lg text-sm font-medium text-[#121212] flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              <div className="text-center pt-4 border-t border-[#E5DFD5] mt-6">
                <p className="text-sm text-[#736B63]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthError(null); }}
                    className="text-[#9E7422] font-medium hover:underline"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Hajia Maryam Ibrahim"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-sm focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-sm focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08012345678"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-sm focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-sm focus:outline-none focus:border-[#9E7422]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B63] hover:text-[#121212] transition-colors p-1"
                    title={showRegisterPassword ? 'Hide password' : 'Show password'}
                    aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-[#9E7422] hover:bg-[#835E17] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 mt-2"
              >
                {authLoading ? 'Creating Account...' : 'Register Account'}
              </button>

              <div className="text-center pt-4 border-t border-[#E5DFD5] mt-6">
                <p className="text-sm text-[#736B63]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    className="text-[#9E7422] font-medium hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Account Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-sm focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-[#121212] hover:bg-[#2A2A2A] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {authLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-4 border-t border-[#E5DFD5] mt-6">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(null); }}
                  className="text-xs text-[#736B63] hover:text-[#121212]"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // IF LOGGED IN: CUSTOMER DASHBOARD
  return (
    <div className="min-h-[80vh] bg-[#FAF8F5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top welcome banner */}
        <div className="bg-white border border-[#E5DFD5] rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#F6F2EA] border border-[#DFC377] flex items-center justify-center text-[#9E7422] font-serif text-xl font-bold">
              {currentCustomer.name ? currentCustomer.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h1 className="text-2xl font-serif text-[#121212]">
                {currentCustomer.name || 'Valued Customer'}
              </h1>
              <p className="text-xs text-[#736B63] flex items-center gap-2 mt-1">
                <span>{currentCustomer.email}</span>
                {currentCustomer.phone && <span>• {currentCustomer.phone}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('track-order')}
              className="px-4 py-2 border border-[#9E7422] text-[#9E7422] hover:bg-[#F6F2EA] rounded-lg text-xs font-medium tracking-wide uppercase transition-colors flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Track an Order
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-[#E5DFD5] text-[#736B63] hover:text-red-700 hover:border-red-300 rounded-lg text-xs font-medium tracking-wide transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5DFD5] mb-8 gap-8 text-sm">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-[#736B63] hover:text-[#121212]'
            }`}
          >
            <Package className="w-4 h-4" />
            Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-[#736B63] hover:text-[#121212]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Saved Addresses ({currentCustomer.addresses?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-[#9E7422] text-[#9E7422]'
                : 'border-transparent text-[#736B63] hover:text-[#121212]'
            }`}
          >
            <User className="w-4 h-4" />
            Profile & Security
          </button>
        </div>

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div className="bg-white border border-[#E5DFD5] rounded-xl p-12 text-center text-[#736B63]">
                Loading your purchase history...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-[#E5DFD5] rounded-xl p-12 text-center">
                <Package className="w-12 h-12 text-[#9E7422] mx-auto mb-3 opacity-60" />
                <h3 className="text-lg font-serif text-[#121212] mb-1">No Orders Found Yet</h3>
                <p className="text-sm text-[#736B63] max-w-md mx-auto mb-6">
                  You haven't placed any orders yet. Discover our latest collections of luxury Jalabs, Abayas, and Islamic essentials.
                </p>
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-6 py-2.5 bg-[#121212] hover:bg-[#2A2A2A] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const stepIndex = getOrderStatusStepIndex(order.orderStatus || order.status);
                  const stepInfo = ORDER_STATUS_STEPS[Math.max(0, stepIndex)] || ORDER_STATUS_STEPS[0];

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-[#E5DFD5] rounded-xl p-6 hover:border-[#DFC377] transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#E5DFD5]">
                        <div>
                          <span className="text-xs font-semibold text-[#9E7422] tracking-wider uppercase">
                            Order {order.orderNumber || order.id}
                          </span>
                          <p className="text-xs text-[#736B63] mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-NG', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium border ${stepInfo.badgeColor}`}>
                            {order.orderStatus || order.status || 'Order received'}
                          </span>
                          <span className="text-sm font-bold text-[#121212]">
                            {formatNaira(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items preview */}
                      <div className="py-4 flex flex-wrap gap-4 items-center">
                        <div className="flex -space-x-2 overflow-hidden">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.product?.images?.[0]}
                              alt={item.product?.name}
                              className="inline-block h-12 w-12 rounded-lg object-cover border-2 border-white bg-[#F6F2EA]"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#736B63]">
                          {order.items?.reduce((tot, it) => tot + it.quantity, 0)} item(s)
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4 border-t border-[#E5DFD5] flex flex-wrap justify-between items-center gap-2">
                        <div className="text-xs text-[#736B63]">
                          Delivery to: <strong className="text-[#121212]">{order.customerDetails?.city || 'Ijebu-Ode'}, {order.customerDetails?.state || 'Ogun'}</strong>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="px-3 py-1.5 border border-[#E5DFD5] hover:bg-[#FAF8F5] rounded text-xs font-medium text-[#121212] flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </button>
                          <button
                            onClick={() => onNavigate('track-order', { orderNumber: order.orderNumber || order.id })}
                            className="px-3 py-1.5 bg-[#9E7422] hover:bg-[#835E17] text-white rounded text-xs font-medium flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            Track Order
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-serif text-[#121212]">Your Delivery Addresses</h3>
                <p className="text-xs text-[#736B63]">Manage saved shipping locations for fast 1-click checkout.</p>
              </div>
              <button
                onClick={() => {
                  setNewAddrFullName(currentCustomer.name || '');
                  setNewAddrPhone(currentCustomer.phone || '');
                  setShowAddressModal(true);
                }}
                className="px-4 py-2 bg-[#9E7422] hover:bg-[#835E17] text-white rounded-lg text-xs font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            </div>

            {(!currentCustomer.addresses || currentCustomer.addresses.length === 0) ? (
              <div className="bg-white border border-[#E5DFD5] rounded-xl p-10 text-center">
                <MapPin className="w-10 h-10 text-[#9E7422] mx-auto mb-2 opacity-50" />
                <p className="text-sm text-[#736B63] mb-4">You have no saved delivery addresses yet.</p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 border border-[#9E7422] text-[#9E7422] hover:bg-[#FAF8F5] rounded-lg text-xs font-medium"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCustomer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white border rounded-xl p-5 relative ${
                      addr.isDefault ? 'border-[#9E7422] shadow-xs' : 'border-[#E5DFD5]'
                    }`}
                  >
                    {addr.isDefault && (
                      <span className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider bg-[#F6F2EA] text-[#9E7422] px-2.5 py-0.5 rounded-full border border-[#DFC377]">
                        Default Address
                      </span>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-[#9E7422]" />
                      <span className="text-sm font-semibold text-[#121212]">{addr.title || 'Address'}</span>
                    </div>

                    <p className="text-sm font-medium text-[#121212]">{addr.fullName}</p>
                    <p className="text-xs text-[#736B63] mt-1">{addr.address}</p>
                    <p className="text-xs text-[#736B63]">{addr.city}, {addr.state} State</p>
                    <p className="text-xs text-[#736B63] mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {addr.phone}
                    </p>

                    <div className="mt-4 pt-4 border-t border-[#E5DFD5] flex items-center justify-between text-xs">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[#9E7422] hover:underline font-medium"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-[#736B63]">Primary shipping destination</span>
                      )}

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-white border border-[#E5DFD5] rounded-xl p-6 sm:p-8">
            <h3 className="text-lg font-serif text-[#121212] mb-1">Account Information</h3>
            <p className="text-xs text-[#736B63] mb-6">Keep your contact details up to date for order tracking notifications.</p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-sm focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={currentCustomer.email}
                  className="w-full px-4 py-2.5 bg-[#F0EBE1] border border-[#E5DFD5] rounded-lg text-sm text-[#736B63] cursor-not-allowed"
                />
                <span className="text-[11px] text-[#736B63] mt-0.5 block">Email address is linked to your authentication login.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Primary Phone Number
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="08012345678"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-sm focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-between">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-[#9E7422] hover:bg-[#835E17] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sendCustomerPasswordReset(currentCustomer.email);
                    showToast(`Password reset link dispatched to ${currentCustomer.email}`);
                  }}
                  className="text-xs text-[#736B63] hover:text-[#121212] flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  Request Password Reset
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: ADD ADDRESS */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5DFD5] rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-serif text-[#121212] mb-1">Add Delivery Address</h3>
            <p className="text-xs text-[#736B63] mb-4">Save an address for rapid checkout dispatch.</p>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Label (e.g. Home, Office, Campus)
                </label>
                <input
                  type="text"
                  value={newAddrTitle}
                  onChange={(e) => setNewAddrTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded text-sm focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrFullName}
                    onChange={(e) => setNewAddrFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded text-sm focus:outline-none focus:border-[#9E7422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded text-sm focus:outline-none focus:border-[#9E7422]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                  Street Address & Landmarks
                </label>
                <textarea
                  rows={2}
                  required
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  placeholder="e.g. 15, Molipa Expressway, Opposite Central Mosque"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded text-sm focus:outline-none focus:border-[#9E7422]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded text-sm focus:outline-none focus:border-[#9E7422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1">
                    State
                  </label>
                  <select
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded text-sm focus:outline-none focus:border-[#9E7422]"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAddrDefault}
                  onChange={(e) => setNewAddrDefault(e.target.checked)}
                  className="rounded text-[#9E7422] focus:ring-[#9E7422]"
                />
                <span className="text-xs text-[#121212]">Set as default delivery address</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5DFD5]">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-[#E5DFD5] rounded text-xs font-medium text-[#736B63] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="px-5 py-2 bg-[#9E7422] hover:bg-[#835E17] text-white rounded text-xs font-medium disabled:opacity-50"
                >
                  {savingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5DFD5] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-start pb-4 border-b border-[#E5DFD5]">
              <div>
                <span className="text-xs font-semibold text-[#9E7422] uppercase tracking-wider">
                  Order Invoice
                </span>
                <h3 className="text-xl font-serif text-[#121212]">
                  {selectedOrderDetails.orderNumber || selectedOrderDetails.id}
                </h3>
                <p className="text-xs text-[#736B63] mt-1">
                  Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString('en-NG')}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-gray-400 hover:text-black text-2xl font-light"
              >
                ✕
              </button>
            </div>

            {/* Order Items Table */}
            <div className="my-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-3">
                Purchased Products
              </h4>
              <div className="divide-y divide-[#E5DFD5] border-y border-[#E5DFD5]">
                {selectedOrderDetails.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.name}
                        className="w-12 h-12 rounded object-cover bg-[#F6F2EA]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#121212]">{item.product?.name}</p>
                        <p className="text-xs text-[#736B63]">
                          Qty: {item.quantity} 
                          {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                          {item.selectedColor ? ` • Color: ${item.selectedColor}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#121212]">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="bg-[#FAF8F5] p-4 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between text-[#736B63]">
                <span>Subtotal</span>
                <span>{formatNaira(selectedOrderDetails.subtotal)}</span>
              </div>
              {selectedOrderDetails.discountAmount && selectedOrderDetails.discountAmount > 0 ? (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({selectedOrderDetails.appliedCoupon})</span>
                  <span>-{formatNaira(selectedOrderDetails.discountAmount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-[#736B63]">
                <span>Delivery Fee</span>
                <span>{formatNaira(selectedOrderDetails.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#121212] pt-2 border-t border-[#E5DFD5]">
                <span>Total Amount</span>
                <span className="text-[#9E7422]">{formatNaira(selectedOrderDetails.total)}</span>
              </div>
            </div>

            {/* Delivery address & notes */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 border border-[#E5DFD5] rounded-lg">
                <span className="font-semibold text-[#121212] block mb-1">Delivery Destination</span>
                <p className="text-[#736B63]">{selectedOrderDetails.customerDetails?.fullName}</p>
                <p className="text-[#736B63]">{selectedOrderDetails.customerDetails?.deliveryAddress}</p>
                <p className="text-[#736B63]">{selectedOrderDetails.customerDetails?.city}, {selectedOrderDetails.customerDetails?.state}</p>
                <p className="text-[#736B63] mt-1">Phone: {selectedOrderDetails.customerDetails?.phone}</p>
              </div>

              <div className="p-3 border border-[#E5DFD5] rounded-lg">
                <span className="font-semibold text-[#121212] block mb-1">Payment & Logistics</span>
                <p className="text-[#736B63]">Method: <strong className="uppercase">{selectedOrderDetails.paymentMethod?.replace(/_/g, ' ')}</strong></p>
                <p className="text-[#736B63]">Payment Status: <strong className="text-[#9E7422]">{selectedOrderDetails.paymentStatus}</strong></p>
                <p className="text-[#736B63]">Order Status: <strong>{selectedOrderDetails.orderStatus || selectedOrderDetails.status}</strong></p>
                {selectedOrderDetails.carrierName && (
                  <p className="text-[#736B63] mt-1">Courier: {selectedOrderDetails.carrierName}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#E5DFD5] flex flex-wrap justify-between items-center gap-3">
              <a
                href={`https://wa.me/2349165317293?text=${encodeURIComponent(
                  `Hello Ridhal Ventures, I need assistance regarding my order ${selectedOrderDetails.orderNumber || selectedOrderDetails.id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Order Support
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 border border-[#E5DFD5] hover:bg-[#FAF8F5] rounded text-xs font-medium flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  onClick={() => {
                    const ref = selectedOrderDetails.orderNumber || selectedOrderDetails.id;
                    setSelectedOrderDetails(null);
                    onNavigate('track-order', { orderNumber: ref });
                  }}
                  className="px-4 py-2 bg-[#9E7422] hover:bg-[#835E17] text-white rounded text-xs font-medium"
                >
                  Full Tracking View →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
