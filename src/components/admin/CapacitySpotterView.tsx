import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Clock,
  DollarSign,
  Users,
  Send,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { CapacitySlot } from '../../types';

interface CapacitySpotterViewProps {
  slots: CapacitySlot[];
  onBroadcastSlot: (slotId: string) => void;
  onFillSlot?: (slot: CapacitySlot) => void;
  accentColor?: string;
  onToast: (msg: string) => void;
}

export const CapacitySpotterView: React.FC<CapacitySpotterViewProps> = ({
  slots,
  onBroadcastSlot,
  accentColor = '#2563EB',
  onToast
}) => {
  const [selectedSlotForBroadcast, setSelectedSlotForBroadcast] = useState<CapacitySlot | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const totalIdleRevenueCents = slots
    .filter((s) => !s.isBroadcasted)
    .reduce((sum, s) => sum + s.potentialRevenueCents, 0);

  const handleOpenBroadcastModal = (slot: CapacitySlot) => {
    setSelectedSlotForBroadcast(slot);
    setDiscountPercent(slot.flashDiscountPercent || 15);
  };

  const handleExecuteBroadcast = () => {
    if (!selectedSlotForBroadcast) return;
    setIsBroadcasting(true);
    setTimeout(() => {
      onBroadcastSlot(selectedSlotForBroadcast.id);
      setIsBroadcasting(false);
      setSelectedSlotForBroadcast(null);
      onToast(
        `⚡ Flash opening broadcast sent to ${selectedSlotForBroadcast.matchingWaitlistPatientsCount} patients for ${selectedSlotForBroadcast.roomName}!`
      );
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Capacity Spotter</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Predictive yield optimization: Automatically detects idle rooms and provider gaps to fill open slots fast.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200/80 px-4 py-2 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900">
                ${(totalIdleRevenueCents / 100).toLocaleString()}.00
              </span>{' '}
              <span className="text-amber-700">unbooked idle capacity this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Identified Open Gaps</div>
          <div className="text-3xl font-bold font-mono text-slate-900 mt-2">
            {slots.filter((s) => !s.isBroadcasted).length} Open Windows
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Next 7 days across physician & laser rooms</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Waitlist Match Density</div>
          <div className="text-3xl font-bold font-mono text-blue-600 mt-2">
            {slots.reduce((acc, s) => acc + s.matchingWaitlistPatientsCount, 0)} Patients
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Pre-screened for exact matching procedures</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Average Fill Time</div>
          <div className="text-3xl font-bold font-mono text-emerald-600 mt-2">18 mins</div>
          <p className="text-[11px] text-slate-500 mt-1">From flash SMS broadcast to deposit paid</p>
        </div>
      </div>

      {/* Capacity Slots List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">Detected Schedule Gaps & Idle Apparatus</h3>
          <span className="text-xs text-slate-400">EMR Schedule Timetable Sync: Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`bg-white rounded-3xl border p-5 shadow-2xs flex flex-col justify-between space-y-4 transition-all ${
                slot.isBroadcasted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img
                      src={slot.providerAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'}
                      alt={slot.providerName}
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{slot.providerName}</h4>
                      <p className="text-[11px] text-slate-400">{slot.roomName}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      slot.isBroadcasted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {slot.isBroadcasted ? 'Broadcast Active' : 'Unbooked Gap'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-bold">{slot.dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{slot.timeWindow}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Matching High-Yield Procedures
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {slot.recommendedTreatments.map((tr, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {tr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">At-Risk Revenue</div>
                  <div className="font-mono font-bold text-slate-900 text-base">
                    ${(slot.potentialRevenueCents / 100).toLocaleString()}
                  </div>
                </div>

                {slot.isBroadcasted ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dispatched</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenBroadcastModal(slot)}
                    style={{ backgroundColor: accentColor }}
                    className="text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-all shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>⚡ Fill Slot</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Flash Modal */}
      <AnimatePresence>
        {selectedSlotForBroadcast && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            onClick={() => setSelectedSlotForBroadcast(null)}
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
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">
                  Broadcast Flash Capacity Opening
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlotForBroadcast(null)}
                className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Provider & Room:</span>
                  <span className="font-bold text-slate-900">
                    {selectedSlotForBroadcast.providerName} • {selectedSlotForBroadcast.roomName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Idle Time Window:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {selectedSlotForBroadcast.dateStr} @ {selectedSlotForBroadcast.timeWindow}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Waitlist Matches:</span>
                  <span className="font-bold text-blue-600">
                    {selectedSlotForBroadcast.matchingWaitlistPatientsCount} patients
                  </span>
                </div>
              </div>

              {/* Discount Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Flash Booking Incentive Discount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDiscountPercent(pct)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        discountPercent === pct
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pct}% Flash Credit
                    </button>
                  ))}
                </div>
              </div>

              {/* Outgoing SMS Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Outgoing Flash SMS Template
                </span>
                <div className="p-3 bg-slate-900 text-white rounded-2xl text-[11px] font-sans leading-relaxed border border-slate-800">
                  ⚡ Aura MedSpa Last-Minute Opening: Dr. Jenkins opened a priority slot for {selectedSlotForBroadcast.dateStr} at{' '}
                  {selectedSlotForBroadcast.timeWindow}. Enjoy{' '}
                  <span className="text-amber-300 font-bold">{discountPercent}% off</span> your protocol when you reserve online
                  now: <span className="text-blue-400 underline">https://auramedspa.com/flash/{selectedSlotForBroadcast.id}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSlotForBroadcast(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBroadcast}
                disabled={isBroadcasting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isBroadcasting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Broadcasting to Waitlist...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast to {selectedSlotForBroadcast.matchingWaitlistPatientsCount} Patients</span>
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
