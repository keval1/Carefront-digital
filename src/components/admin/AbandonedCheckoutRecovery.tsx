import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart,
  Send,
  Phone,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { AbandonedCheckout } from '../../types';

interface AbandonedCheckoutRecoveryProps {
  checkouts: AbandonedCheckout[];
  onUpdateCheckoutStatus: (id: string, status: AbandonedCheckout['status']) => void;
  accentColor?: string;
  onToast: (msg: string) => void;
  onSendManualSms?: (id: string, msg: string) => void;
}

export const AbandonedCheckoutRecovery: React.FC<AbandonedCheckoutRecoveryProps> = ({
  checkouts,
  onUpdateCheckoutStatus,
  accentColor = '#2563EB',
  onToast
}) => {
  const [selectedCheckout, setSelectedCheckout] = useState<AbandonedCheckout | null>(null);
  const [customSms, setCustomSms] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCheckouts = checkouts.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.treatmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const totalAbandonedCents = checkouts.reduce((sum, c) => sum + c.cartTotalCents, 0);
  const recoveredCount = checkouts.filter((c) => c.status === 'recovered').length;
  const recoveredCents = checkouts
    .filter((c) => c.status === 'recovered')
    .reduce((sum, c) => sum + c.cartTotalCents, 0);

  const handleOpenRecoveryModal = (item: AbandonedCheckout) => {
    setSelectedCheckout(item);
    setCustomSms(item.suggestedSmsText);
  };

  const handleSendRecoverySms = () => {
    if (!selectedCheckout) return;
    setIsSending(true);
    setTimeout(() => {
      onUpdateCheckoutStatus(selectedCheckout.id, 'sms_sent');
      setIsSending(false);
      setSelectedCheckout(null);
      onToast(`⚡ Recovery SMS with incentive sent to ${selectedCheckout.patientName}!`);
    }, 800);
  };

  const handleMarkRecovered = (id: string, name: string) => {
    onUpdateCheckoutStatus(id, 'recovered');
    onToast(`🎉 Patient ${name} marked as RECOVERED! Revenue booked in Practice OS.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Abandoned Checkout Recovery</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time drop-off radar capturing patients who left deposit checkout or financing applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, procedure..."
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none w-56"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">Total Abandoned Value</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">Live Radar</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            ${(totalAbandonedCents / 100).toLocaleString()}.00
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Patients dropped off before card swipe</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">Recovery Rate</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">+12% vs avg</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-2">34.2%</div>
          <div className="text-[11px] text-slate-400 mt-1">Converted via automated 15-min SMS</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">Revenue Recovered</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">This Month</span>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-2">
            ${((recoveredCents || 510000) / 100).toLocaleString()}.00
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Rescued clinical gross revenue</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">Avg Recovery Window</span>
            <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-bold">Speed-to-Lead</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">12 mins</div>
          <div className="text-[11px] text-slate-400 mt-1">Automated prompt before lead cools</div>
        </div>
      </div>

      {/* Abandoned Checkouts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Active Drop-off Queue</h3>
            <p className="text-xs text-slate-400">Patients with active carts or unconfirmed time-slot deposits</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {filteredCheckouts.length} in queue
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Treatment / Cart</th>
                <th className="p-4">Cart Value</th>
                <th className="p-4">Drop-off Stage</th>
                <th className="p-4">Time Elapsed</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Recovery Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCheckouts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{item.patientName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{item.treatmentName}</div>
                    <span className="text-[10px] text-blue-600 font-bold block">{item.recoveryDiscountOffer}</span>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-900">
                    ${(item.cartTotalCents / 100).toLocaleString()}.00
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {item.dropoffStageLabel}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{item.timeAgo}</td>
                  <td className="p-4">
                    {item.status === 'recovered' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                        ✅ Recovered
                      </span>
                    )}
                    {item.status === 'sms_sent' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                        💬 SMS Sent (Opened)
                      </span>
                    )}
                    {item.status === 'pending_auto_sms' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                        ⏳ Pending Auto-SMS
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status !== 'recovered' && (
                        <>
                          <button
                            onClick={() => handleOpenRecoveryModal(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>Dispatch SMS</span>
                          </button>
                          <button
                            onClick={() => handleMarkRecovered(item.id, item.patientName)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                            title="Mark Recovered"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </button>
                        </>
                      )}
                      {item.status === 'recovered' && (
                        <span className="text-[11px] text-emerald-700 font-semibold">Deposit Locked</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recovery SMS Dispatch Centered Modal */}
      <AnimatePresence>
        {selectedCheckout && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            onClick={() => setSelectedCheckout(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 text-xs text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Send Recovery SMS: {selectedCheckout.patientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCheckout(null)}
                className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Abandoned Item:</span>
                  <span className="font-bold text-slate-900">{selectedCheckout.treatmentName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Cart Total:</span>
                  <span className="font-bold font-mono text-slate-900">
                    ${(selectedCheckout.cartTotalCents / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Drop-off Stage:</span>
                  <span className="font-semibold text-blue-700">{selectedCheckout.dropoffStageLabel}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Personalized SMS Message Body
                </label>
                <textarea
                  rows={4}
                  value={customSms}
                  onChange={(e) => setCustomSms(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none font-sans leading-relaxed"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/70 text-[11px] text-amber-800">
                ⚡ Automatically includes 1-click bypass link directly back to their saved appointment slot with pre-filled billing info.
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCheckout(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendRecoverySms}
                disabled={isSending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting SMS...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Recovery SMS</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </div>
);
};
