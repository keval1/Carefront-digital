import React, { useState, useEffect } from 'react';
import { X, Lock, DollarSign, Clock, Layers, Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Service } from '../../types';

interface TreatmentFieldEditorProps {
  service: Service | null;
  isOpen: boolean;
  isNew?: boolean;
  onClose: () => void;
  onSave: (savedService: Service) => void;
}

export const TreatmentFieldEditor: React.FC<TreatmentFieldEditorProps> = ({
  service,
  isOpen,
  isNew = false,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Service['category']>('injectables');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [retailDollars, setRetailDollars] = useState(650);
  const [depositDollars, setDepositDollars] = useState(75);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFinancingEligible, setIsFinancingEligible] = useState(true);

  // Initialize form state
  useEffect(() => {
    if (!isOpen) return;
    if (service && !isNew) {
      setName(service.name);
      setCategory(service.category);
      setDurationMinutes(service.durationMinutes);
      setRetailDollars(service.retailPriceCents / 100);
      setDepositDollars(service.depositPriceCents / 100);
      setDescription(service.description);
      setIsActive(service.isActive !== false);
      setIsFinancingEligible(service.isFinancingEligible);
    } else {
      setName('');
      setCategory('injectables');
      setDurationMinutes(45);
      setRetailDollars(500);
      setDepositDollars(75);
      setDescription('Clinical treatment protocol administered by board-certified practitioners.');
      setIsActive(true);
      setIsFinancingEligible(true);
    }
  }, [service, isNew, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const defaultImages: Record<string, string> = {
      injectables: 'https://images.unsplash.com/photo-1512290903671-17adc82f0747?auto=format&fit=crop&w=600&q=80',
      laser_rf: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      facials: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
      longevity: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      ortho: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
      cosmetic_dental: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'
    };

    const finalService: Service = {
      id: service && !isNew ? service.id : `srv-${Date.now()}`,
      tenantId: service?.tenantId || 'tenant-aura-1',
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      description: description.trim(),
      durationMinutes: Number(durationMinutes) || 45,
      retailPriceCents: Math.round(Number(retailDollars) * 100),
      depositPriceCents: Math.round(Number(depositDollars) * 100),
      isFinancingEligible,
      isActive,
      imageUrl: service?.imageUrl || defaultImages[category] || defaultImages.injectables
    };

    onSave(finalService);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-6 text-xs text-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {isNew ? 'Catalog Management' : 'Treatment Field Editor'}
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-0.5">
              {isNew ? '+ Add New Clinical Treatment' : `Edit: ${service?.name}`}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Procedure Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sculptra Aesthetic Biostimulator"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
              >
                <option value="injectables">Injectables & Tox</option>
                <option value="laser_rf">Laser & RF Energy</option>
                <option value="facials">Clinical Facials</option>
                <option value="longevity">Cellular Longevity</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min="10"
                max="240"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Retail Cash Price ($)</label>
              <input
                type="number"
                value={retailDollars}
                onChange={(e) => setRetailDollars(Number(e.target.value))}
                min="0"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Booking Deposit Due ($)</label>
              <input
                type="number"
                value={depositDollars}
                onChange={(e) => setDepositDollars(Number(e.target.value))}
                min="0"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-emerald-800 font-mono font-bold focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Clinical Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Clinical indications, procedure details, and patient expectations..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Active Status & 0% Financing Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block text-xs">Active in Online Booking Catalog</span>
                <span className="text-[10px] text-slate-400">Patients can discover and reserve this procedure immediately</span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  isActive ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block text-xs">Cherry 0% APR Financing Eligible</span>
                <span className="text-[10px] text-slate-400">Enable split monthly payments at checkout</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFinancingEligible(!isFinancingEligible)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  isFinancingEligible ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isFinancingEligible ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold cursor-pointer shadow-sm"
            >
              {isNew ? 'Save Procedure' : 'Update Procedure'}
            </button>
          </div>
        </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
