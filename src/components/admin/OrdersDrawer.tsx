import React, { useState } from 'react';
import { X, ShieldCheck, DollarSign, Printer, RotateCcw, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Order } from '../../types';

interface OrdersDrawerProps {
  order: Order | null;
  onClose: () => void;
  onToast?: (msg: string) => void;
}

export const OrdersDrawer: React.FC<OrdersDrawerProps> = ({ order, onClose, onToast }) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!order) return null;

  const handlePrint = () => {
    setFeedback(`Sent receipt for Order #${order.id} to clinic printer.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRefund = () => {
    setFeedback(`Initiated automated refund for Order #${order.id}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.16 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-xs text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header matching clean dashboard design */}
        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center font-bold text-sm">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Receipt #{order.id}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                  Payment Succeeded
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{order.patientName}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transient Feedback Banner */}
        {feedback && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-emerald-800 font-medium text-xs">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Order Meta Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date & Time</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{order.createdAt || 'Today at 02:30 PM'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Method</span>
              <span className="font-semibold text-slate-900 mt-0.5 block capitalize">
                {order.paymentMethod === 'apple_pay' ? ' Apple Pay' : order.paymentMethod === 'cherry_financing' ? 'Cherry 0% APR' : 'Stripe Card (•••4242)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Deposit Collected</span>
              <span className="font-mono font-bold text-[#12B76A] mt-0.5 block text-sm">
                ${((order.depositCents || 7500) / 100).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Line Items Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 block">Itemized Clinical Treatments</span>
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50">
              {order.lineItems && order.lineItems.length > 0 ? (
                order.lineItems.map((it, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between bg-white">
                    <div>
                      <span className="font-semibold text-slate-900 block">{it.title}</span>
                      <span className="text-[10px] text-slate-400">Qty: {it.quantity || 1} • In-Clinic Medical Suite</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      ${(((it.priceCents || 0) * (it.quantity || 1)) / 100).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3.5 flex items-center justify-between bg-white">
                  <div>
                    <span className="font-semibold text-slate-900 block">Signature Clinical Treatment Session</span>
                    <span className="text-[10px] text-slate-400">Qty: 1 • Beverly Hills Clinic Suite</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    ${((order.subtotalCents || 85000) / 100).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Summary Calculation */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 font-mono">
            <div className="flex justify-between text-slate-500">
              <span>Procedure Total:</span>
              <span>${((order.subtotalCents || 85000) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Upfront Deposit Paid:</span>
              <span className="text-[#12B76A] font-bold">-${((order.depositCents || 7500) / 100).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-900 font-bold text-sm">
              <span>Balance Due at Appointment:</span>
              <span>${(((order.subtotalCents || 85000) - (order.depositCents || 7500)) / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Stripe Connect & EMR Audit Trail */}
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Stripe Connect & EMR Audit Trail</span>
            </div>
            <div className="space-y-1 font-mono text-[10px] text-blue-800">
              <div className="flex justify-between">
                <span>Stripe Charge Intent:</span>
                <span className="font-bold">{order.stripePaymentIntentId || 'pi_live_3M091848Aura'}</span>
              </div>
              <div className="flex justify-between">
                <span>EMR Patient Ledger:</span>
                <span className="font-bold text-emerald-700">✅ Synced to Aesthetic Record (Chart #AR-9941)</span>
              </div>
              <div className="flex justify-between">
                <span>Authorization Token:</span>
                <span>auth_capture_succeeded_200</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={handleRefund}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refund Deposit</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl font-bold text-xs cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
