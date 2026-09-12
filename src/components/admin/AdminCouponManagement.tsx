import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Calendar, DollarSign, Percent, CheckCircle2, XCircle } from 'lucide-react';
import { Coupon } from '../../types';
import { getCoupons, createCoupon, toggleCouponStatus, deleteCoupon } from '../../services/couponService';
import { formatNaira } from '../../data/products';

export const AdminCouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(10000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openModal = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinSpend(10000);
    setExpiryDate('2026-12-31');
    setUsageLimit(100);
    setIsModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setSaving(true);
    try {
      const newCoupon = await createCoupon({
        code: code.trim().toUpperCase(),
        type: discountType,
        value: Number(discountValue),
        discountType,
        discountValue: Number(discountValue),
        minSpend: Number(minSpend),
        expiryDate,
        usageLimit: Number(usageLimit),
        active: true,
        isActive: true,
        description: `${discountType === 'percentage' ? discountValue + '%' : formatNaira(discountValue)} off on orders over ${formatNaira(minSpend)}`
      });

      setCoupons(prev => [newCoupon, ...prev]);
      setMsg('Coupon code generated successfully!');
      setTimeout(() => setMsg(null), 3000);
      setIsModalOpen(false);
    } catch (err: any) {
      alert('Error creating coupon: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (coupon: Coupon) => {
    try {
      await toggleCouponStatus(coupon.id, !coupon.isActive);
      setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c));
    } catch (err: any) {
      alert('Error updating coupon: ' + err.message);
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;

    try {
      await deleteCoupon(coupon.id);
      setCoupons(prev => prev.filter(c => c.id !== coupon.id));
      setMsg(`Coupon ${coupon.code} deleted.`);
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert('Error deleting coupon: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#2D281F]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#F5E4B5] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#C59A45]" />
            Promotional Coupons & Voucher Codes
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Create percentage discounts or flat Naira vouchers for customers at checkout.
          </p>
        </div>

        <button
          onClick={openModal}
          className="px-4 py-2 bg-[#C59A45] hover:bg-[#A37B2C] text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs rounded-lg">
          {msg}
        </div>
      )}

      {/* Coupons List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-xs">Loading coupons...</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 bg-[#181613] rounded-xl border border-[#2D281F] text-gray-400 text-xs">
          No active discount coupons found. Create your first promotion above!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-5 rounded-xl border bg-[#181613] flex flex-col justify-between ${
                coupon.isActive ? 'border-[#3E382E]' : 'border-red-900/30 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-base font-extrabold text-[#C59A45] bg-[#25221C] px-2.5 py-1 rounded-md border border-[#3E382E] inline-block mb-1">
                      {coupon.code}
                    </span>
                    <div className="text-xs text-gray-300">
                      Discount:{' '}
                      <strong className="text-white">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : formatNaira(coupon.discountValue) + ' OFF'}
                      </strong>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(coupon)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      coupon.isActive
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {coupon.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="text-xs text-gray-400 space-y-1 pt-1">
                  <div>Min. Order: <strong>{formatNaira(coupon.minSpend || 0)}</strong></div>
                  <div>Valid Until: <strong>{coupon.expiryDate}</strong></div>
                  <div>Usage Count: <strong>{coupon.timesUsed || 0}</strong> / {coupon.usageLimit || '∞'}</div>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-[#2D281F] flex justify-end">
                <button
                  onClick={() => handleDelete(coupon)}
                  className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded text-xs"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#181613] border border-[#3E382E] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#F5E4B5]">
              Create New Discount Voucher
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RAMADAN10 or WELCOME5"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#121212] border border-[#3E382E] rounded-lg px-3 py-2 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#121212] border border-[#3E382E] rounded-lg px-3 py-2 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Naira (₦)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">
                    {discountType === 'percentage' ? 'Percentage (e.g. 10)' : 'Amount in Naira'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#3E382E] rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Min Spend (₦)</label>
                  <input
                    type="number"
                    min="0"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#3E382E] rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#121212] border border-[#3E382E] rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Total Usage Limit</label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full bg-[#121212] border border-[#3E382E] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="pt-4 border-t border-[#2D281F] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#3E382E] text-gray-400 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#C59A45] hover:bg-[#A37B2C] text-black font-bold rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
