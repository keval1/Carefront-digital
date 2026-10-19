import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Check,
  Copy,
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  X,
  Clock
} from 'lucide-react';

export interface PromotionCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  description: string;
  applicableTreatments: string;
  usageCount: number;
  usageLimit: number;
  attributedRevenueCents: number;
  status: 'active' | 'scheduled' | 'expired';
  expiresAt: string;
  showInAvailableList?: boolean; // Practice owner can selectively show or hide from patient checkout
}

export const INITIAL_PROMOTIONS: PromotionCode[] = [
  {
    id: 'promo-1',
    code: 'SUMMERGLOW20',
    discountType: 'percentage',
    discountValue: 20,
    description: '20% off all laser skin resurfacing and clinical chemical peels',
    applicableTreatments: 'Laser Skin Resurfacing, Chemical Peels',
    usageCount: 48,
    usageLimit: 100,
    attributedRevenueCents: 1482000,
    status: 'active',
    expiresAt: 'Aug 31, 2026',
    showInAvailableList: true
  },
  {
    id: 'promo-2',
    code: 'BOTOXVIP50',
    discountType: 'fixed',
    discountValue: 50,
    description: '$50 instant procedure credit on 50+ units neurotoxin',
    applicableTreatments: 'Botox / Dysport / Daxxify',
    usageCount: 114,
    usageLimit: 250,
    attributedRevenueCents: 2850000,
    status: 'active',
    expiresAt: 'Dec 31, 2026',
    showInAvailableList: true
  },
  {
    id: 'promo-3',
    code: 'CHERRYZERO',
    discountType: 'percentage',
    discountValue: 10,
    description: '10% promotional credit when using Cherry 0% APR financing',
    applicableTreatments: 'All treatments over $1,000',
    usageCount: 36,
    usageLimit: 100,
    attributedRevenueCents: 3420000,
    status: 'active',
    expiresAt: 'Nov 15, 2026',
    showInAvailableList: false
  },
  {
    id: 'promo-4',
    code: 'WELCOME100',
    discountType: 'fixed',
    discountValue: 100,
    description: '$100 off initial Juvederm or Restylane contouring syringe',
    applicableTreatments: 'Lip Fillers, Cheek Sculpting',
    usageCount: 82,
    usageLimit: 150,
    attributedRevenueCents: 2132000,
    status: 'active',
    expiresAt: 'Oct 30, 2026',
    showInAvailableList: true
  },
  {
    id: 'promo-5',
    code: 'MOTHERSDAY',
    discountType: 'percentage',
    discountValue: 15,
    description: '15% off Morpheus8 Full Face & Neck packages',
    applicableTreatments: 'Morpheus8 RF Microneedling',
    usageCount: 65,
    usageLimit: 65,
    attributedRevenueCents: 1625000,
    status: 'expired',
    expiresAt: 'May 15, 2026',
    showInAvailableList: false
  }
];

interface DiscountsPromotionManagerProps {
  promotions?: PromotionCode[];
  onUpdatePromotions?: (updated: PromotionCode[]) => void;
  onToast: (msg: string) => void;
}

export const DiscountsPromotionManager: React.FC<DiscountsPromotionManagerProps> = ({
  promotions: initialPromos = INITIAL_PROMOTIONS,
  onUpdatePromotions,
  onToast
}) => {
  const [promotions, setPromotions] = useState<PromotionCode[]>(initialPromos);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Code Form State
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [newValue, setNewValue] = useState<number>(20);
  const [newDescription, setNewDescription] = useState('');
  const [newTreatments, setNewTreatments] = useState('All clinical treatments');
  const [newLimit, setNewLimit] = useState<number>(100);
  const [newExpiry, setNewExpiry] = useState('Dec 31, 2026');
  const [newShowInCheckout, setNewShowInCheckout] = useState(true);

  // Sync when initialPromos updates from parent
  React.useEffect(() => {
    if (initialPromos) {
      setPromotions(initialPromos);
    }
  }, [initialPromos]);

  const handleToggleCheckoutVisibility = (id: string) => {
    setPromotions((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          const nextVal = p.showInAvailableList === false ? true : false;
          onToast(
            nextVal
              ? `✓ Code "${p.code}" is now visible under "Check Available Coupons" at checkout.`
              : `Removed "${p.code}" from checkout list (Only valid via direct entry).`
          );
          return { ...p, showInAvailableList: nextVal };
        }
        return p;
      });
      onUpdatePromotions?.(updated);
      return updated;
    });
  };

  const filteredPromotions = promotions.filter(
    (p) =>
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.applicableTreatments.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePromos = promotions.filter((p) => p.status === 'active');
  const totalAttributedRevenue = promotions.reduce((acc, p) => acc + p.attributedRevenueCents, 0);
  const totalRedemptions = promotions.reduce((acc, p) => acc + p.usageCount, 0);

  const handleCopyCode = (code: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCodeId(id);
    onToast(`Copied code "${code}" to clipboard!`);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleToggleStatus = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'active' ? 'expired' : 'active';
          onToast(`Updated status of ${p.code} to ${nextStatus}.`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleDeleteCode = (id: string, code: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    onToast(`Removed discount code "${code}".`);
  };

  const handleCreatePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      onToast('Please specify a promotional code.');
      return;
    }

    const created: PromotionCode = {
      id: `promo-${Date.now()}`,
      code: newCode.trim().toUpperCase().replace(/\s+/g, ''),
      discountType: newType,
      discountValue: Number(newValue) || 10,
      description: newDescription.trim() || `${newValue}${newType === 'percentage' ? '%' : '$'} special discount`,
      applicableTreatments: newTreatments.trim() || 'All clinical treatments',
      usageCount: 0,
      usageLimit: Number(newLimit) || 100,
      attributedRevenueCents: 0,
      status: 'active',
      expiresAt: newExpiry.trim() || 'Dec 31, 2026',
      showInAvailableList: newShowInCheckout
    };

    setPromotions((prev) => {
      const updated = [created, ...prev];
      onUpdatePromotions?.(updated);
      return updated;
    });
    setIsCreateModalOpen(false);
    onToast(`Created active promotion code "${created.code}"!`);

    // Reset Form
    setNewCode('');
    setNewDescription('');
    setNewValue(20);
  };

  return (
    <div className="space-y-6">
      {/* Page Header (No icon next to heading, clean and standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discounts &amp; Promotions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create and manage promotional discount codes, seasonal specials, VIP membership perks, and procedure vouchers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discount Code</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">Active Promotions</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              Live in Storefront
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">{activePromos.length} Codes</div>
          <div className="text-[11px] text-slate-400 mt-1">Available for online patient checkout</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">Attributed Campaign Revenue</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
              +28% YoY
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-2">
            ${(totalAttributedRevenue / 100).toLocaleString()}.00
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Deposits unlocked via promo codes</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">Total Redemptions</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
              All Channels
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-2">{totalRedemptions} Uses</div>
          <div className="text-[11px] text-slate-400 mt-1">Across SMS broadcasts &amp; web store</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">Average Order Uplift</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
              High Yield
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">+26.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">Higher cart value when promo is applied</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code name, description, treatment..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredPromotions.length}</span> discount codes
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-4">Discount Code</th>
              <th className="p-4">Discount Value</th>
              <th className="p-4">Eligible Treatments</th>
              <th className="p-4">Checkout Visibility</th>
              <th className="p-4">Redemptions</th>
              <th className="p-4">Attributed Revenue</th>
              <th className="p-4">Expires</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPromotions.map((p) => {
              const isCopied = copiedCodeId === p.id;
              const isPercentage = p.discountType === 'percentage';
              const progressPct = Math.min(100, Math.round((p.usageCount / p.usageLimit) * 100));

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Code */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 px-2 py-1 bg-slate-100 rounded-lg text-xs border border-slate-200">
                        {p.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(p.code, p.id)}
                        title="Copy Code"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 max-w-xs truncate">{p.description}</div>
                  </td>

                  {/* Value */}
                  <td className="p-4">
                    <span className="font-bold text-slate-900 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-mono text-xs">
                      {isPercentage ? `${p.discountValue}% OFF` : `$${p.discountValue} OFF`}
                    </span>
                  </td>

                  {/* Treatments */}
                  <td className="p-4 text-slate-600 max-w-xs truncate font-medium">
                    {p.applicableTreatments}
                  </td>

                  {/* Checkout Visibility Toggle */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleCheckoutVisibility(p.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all border ${
                        p.showInAvailableList !== false
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                      title="Click to toggle display in patient checkout 'Check Available Coupons' list"
                    >
                      {p.showInAvailableList !== false ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Shown at Checkout</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>Direct Code Only</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Usage */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {p.usageCount} / {p.usageLimit}
                      </span>
                    </div>
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          progressPct >= 100 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className="p-4 font-mono font-bold text-emerald-700">
                    ${(p.attributedRevenueCents / 100).toLocaleString()}.00
                  </td>

                  {/* Expiration */}
                  <td className="p-4 text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{p.expiresAt}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(p.id)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {p.status === 'active' ? 'Active' : 'Expired'}
                      </span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteCode(p.id, p.code)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Discount Code */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Create Promotional Discount</h3>
                <p className="text-xs text-slate-500 mt-0.5">Define redemption terms for online checkout</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromotion} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon / Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="e.g. GLOWSPRING25"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-slate-800 uppercase focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setNewCode(`AURA${Math.floor(100 + Math.random() * 900)}`)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
                  >
                    Randomize
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Dollar Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Value {newType === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={newType === 'percentage' ? 100 : 5000}
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Campaign Purpose</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. 20% off neurotoxin during seasonal beauty week"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    min={1}
                    value={newLimit}
                    onChange={(e) => setNewLimit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expiration Date</label>
                  <input
                    type="text"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    placeholder="e.g. Dec 31, 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Show at Checkout Toggle */}
              <label className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={newShowInCheckout}
                  onChange={(e) => setNewShowInCheckout(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Include in "Check Available Coupons" at checkout</span>
                  <span className="text-[11px] text-slate-500 block">
                    When enabled, patients can browse and apply this promotion directly during deposit checkout.
                  </span>
                </div>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Save &amp; Activate Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
