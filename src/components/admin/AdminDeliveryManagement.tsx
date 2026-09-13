import React, { useState, useEffect } from 'react';
import { Truck, Plus, Edit, Trash2, CheckCircle2, XCircle, Clock, MapPin, DollarSign } from 'lucide-react';
import { DeliveryZone } from '../../types';
import { getDeliveryZones, saveDeliveryZone, deleteDeliveryZone } from '../../services/deliveryService';
import { formatNaira } from '../../data/products';

export const AdminDeliveryManagement: React.FC = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [regionsInput, setRegionsInput] = useState('');
  const [fee, setFee] = useState<number>(2000);
  const [estimatedDays, setEstimatedDays] = useState('1 to 2 business days');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const data = await getDeliveryZones();
      setZones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const openCreateModal = () => {
    setEditingZone(null);
    setName('');
    setRegionsInput('');
    setFee(2000);
    setEstimatedDays('1 to 2 business days');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setName(zone.name);
    setRegionsInput((zone.regions || []).join(', '));
    setFee(zone.fee);
    setEstimatedDays(zone.estimatedDays);
    setIsActive(zone.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const regions = regionsInput.split(',').map(r => r.trim()).filter(Boolean);
    const zoneId = editingZone?.id || `zone_${Date.now()}`;

    try {
      await saveDeliveryZone({
        id: zoneId,
        name: name.trim(),
        regions,
        fee: Number(fee),
        estimatedDays: estimatedDays.trim(),
        estimatedTime: estimatedDays.trim() || '2 to 3 Business Days',
        available: isActive,
        isActive
      });

      setMessage('Delivery zone successfully saved!');
      setTimeout(() => setMessage(null), 3000);
      setIsModalOpen(false);
      await fetchZones();
    } catch (err: any) {
      alert('Error saving delivery zone: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (zone: DeliveryZone) => {
    if (!window.confirm(`Are you sure you want to delete delivery zone "${zone.name}"?`)) return;

    try {
      await deleteDeliveryZone(zone.id);
      setZones(prev => prev.filter(z => z.id !== zone.id));
      setMessage('Delivery zone removed.');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert('Error deleting zone: ' + err.message);
    }
  };

  const handleToggleActive = async (zone: DeliveryZone) => {
    try {
      const updated = { ...zone, isActive: !zone.isActive };
      await saveDeliveryZone(updated);
      setZones(prev => prev.map(z => z.id === zone.id ? updated : z));
    } catch (err: any) {
      alert('Error toggling zone: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#2D281F]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#F5E4B5] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#C59A45]" />
            Delivery Zones & Logistics Rates
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Configure delivery fees, local Ijebu-Ode transit zones, and estimated delivery dates across Nigeria.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#C59A45] hover:bg-[#A37B2C] text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Delivery Zone
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs rounded-lg">
          {message}
        </div>
      )}

      {/* Zones Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-xs">Loading delivery zones...</div>
      ) : zones.length === 0 ? (
        <div className="text-center py-12 bg-[#181613] rounded-xl border border-[#2D281F] text-gray-400 text-xs">
          No delivery zones configured yet. Click &quot;Add Delivery Zone&quot; to set up your first zone.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`p-5 rounded-xl border bg-[#181613] transition-all flex flex-col justify-between ${
                zone.isActive ? 'border-[#3E382E]' : 'border-red-900/40 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-sm">{zone.name}</h3>
                    <span className="text-base font-serif font-extrabold text-[#C59A45]">
                      {zone.fee === 0 ? 'Free / In-Store Pickup' : formatNaira(zone.fee)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleActive(zone)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      zone.isActive
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {zone.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C59A45]" />
                  <span>Transit: {zone.estimatedDays}</span>
                </div>

                <div className="pt-2 border-t border-[#2D281F]">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 block mb-1">
                    Applicable Regions / States:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {zone.regions?.map((r, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#25221C] text-amber-200/80 rounded text-[11px] border border-[#3E382E]"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#2D281F] flex justify-end gap-2">
                <button
                  onClick={() => openEditModal(zone)}
                  className="p-1.5 bg-[#25221C] hover:bg-[#3E382E] text-amber-200 rounded text-xs"
                  title="Edit Zone"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(zone)}
                  className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded text-xs"
                  title="Delete Zone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#181613] border border-[#3E382E] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#F5E4B5]">
              {editingZone ? 'Edit Delivery Zone' : 'Create Delivery Zone'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Zone Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ijebu-Ode Metropolis"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121212] border border-[#3E382E] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Delivery Fee (₦)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="w-full bg-[#121212] border border-[#3E382E] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Estimated Delivery Timeline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Same Day / Within 24 hours"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full bg-[#121212] border border-[#3E382E] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">
                  Applicable Cities / States (comma separated)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ijebu-Ode, Molipa, Apebi, Bass Street"
                  value={regionsInput}
                  onChange={(e) => setRegionsInput(e.target.value)}
                  className="w-full bg-[#121212] border border-[#3E382E] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-[#C59A45]"
                  />
                  <span>Zone is active and selectable at checkout</span>
                </label>
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
                  {saving ? 'Saving...' : 'Save Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
