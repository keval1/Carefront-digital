import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  Send,
  Camera,
  MessageSquare,
  ShieldCheck,
  User,
  ArrowUpRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { ClinicalAftercareRecord } from '../../types';

interface ClinicalAftercareViewProps {
  records: ClinicalAftercareRecord[];
  onUpdateRecord?: (updated: ClinicalAftercareRecord) => void;
  onAddTimelineLog?: (id: string, msg: string) => void;
  onSendReviewInvite?: (id: string) => void;
  accentColor?: string;
  onToast: (msg: string) => void;
}

export const ClinicalAftercareView: React.FC<ClinicalAftercareViewProps> = ({
  records,
  onUpdateRecord,
  accentColor = '#2563EB',
  onToast
}) => {
  const [selectedRecord, setSelectedRecord] = useState<ClinicalAftercareRecord | null>(null);
  const [reassuranceMessage, setReassuranceMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'protocols'>('queue');

  const handleOpenDetail = (rec: ClinicalAftercareRecord) => {
    setSelectedRecord(rec);
    setReassuranceMessage(
      `Hi ${rec.patientName.split(' ')[0]}, Dr. Jenkins reviewed your Day ${rec.daysPostTreatment} photo! Your recovery is progressing exceptionally well. Keep maintaining your hydrating barrier cream.`
    );
  };

  const handleSendReassurance = () => {
    if (!selectedRecord) return;
    setIsSending(true);
    setTimeout(() => {
      const updated: ClinicalAftercareRecord = {
        ...selectedRecord,
        timelineLogs: [
          ...selectedRecord.timelineLogs,
          {
            sender: 'clinician',
            message: reassuranceMessage,
            timestamp: 'Just now'
          }
        ]
      };
      onUpdateRecord?.(updated);
      setSelectedRecord(updated);
      setIsSending(false);
      onToast(`🩺 Clinical reassurance dispatched to ${selectedRecord.patientName}!`);
    }, 800);
  };

  const handleDispatchGoogleReviewInvite = () => {
    if (!selectedRecord) return;
    const updated: ClinicalAftercareRecord = {
      ...selectedRecord,
      status: 'review_prompted',
      timelineLogs: [
        ...selectedRecord.timelineLogs,
        {
          sender: 'system',
          message: 'Automated 5-Star Google Review invitation sent with 1-click link.',
          timestamp: 'Just now'
        }
      ]
    };
    onUpdateRecord?.(updated);
    setSelectedRecord(updated);
    onToast(`⭐ Dispatched 5-Star Google Review invitation to ${selectedRecord.patientName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Clinical Aftercare & Retention</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated Day 1, 3, 7, and 14 post-procedure compliance monitoring and photo reviews.
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'queue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Recovery Queue
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'protocols' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Medical Protocols
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ACTIVE PATIENT RECOVERY QUEUE */}
      {/* ======================================================== */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* Metrics summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Patients in Recovery</div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-2">{records.length} Monitored</div>
              <p className="text-[11px] text-slate-500 mt-1">Day 1 to Day 14 post-care cycle</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Photo Verification</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 mt-2">94.2%</div>
              <p className="text-[11px] text-slate-500 mt-1">Submitted recovery selfie check-ins</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Clinical Alerts</div>
              <div className="text-2xl font-bold font-mono text-amber-600 mt-2">0 Urgent</div>
              <p className="text-[11px] text-slate-500 mt-1">Normal expected healing progression</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Google Review Conversion</div>
              <div className="text-2xl font-bold font-mono text-blue-600 mt-2">68.5%</div>
              <p className="text-[11px] text-slate-500 mt-1">Converted on Day 14 milestone check</p>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Patient Follow-up & Review Pipeline</h3>
                <p className="text-xs text-slate-400">Chronological post-procedure check-ins</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Procedure & Provider</th>
                    <th className="p-4">Cadence Milestone</th>
                    <th className="p-4">Clinical Status</th>
                    <th className="p-4">Photo Check-in</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{rec.patientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{rec.patientPhone}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{rec.procedureName}</div>
                        <div className="text-[11px] text-slate-500">{rec.providerName}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 font-mono text-xs block">
                          Day {rec.daysPostTreatment}
                        </span>
                        <span className="text-[10px] text-slate-400">{rec.milestoneCheck}</span>
                      </td>
                      <td className="p-4">
                        {rec.status === 'verified_normal' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                            Normal Healing
                          </span>
                        )}
                        {rec.status === 'review_prompted' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                            Review Sent ⭐
                          </span>
                        )}
                        {rec.status === 'awaiting_photo' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                            Awaiting Selfie
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {rec.patientPhotoUrl ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={rec.patientPhotoUrl}
                              alt="Checkin"
                              className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                            />
                            <span className="text-[10px] text-emerald-700 font-semibold">Photo Attached</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Pending upload</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenDetail(rec)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Review Case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MEDICAL PROTOCOLS */}
      {/* ======================================================== */}
      {activeTab === 'protocols' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Full-Face Neuromodulators (Botox & Dysport)',
              badge: 'Neurotoxin Protocol',
              rules: [
                'Keep head completely upright for minimum 4 hours post-injection.',
                'Avoid strenuous aerobic workouts and saunas for 24 hours.',
                'Day 14 milestone: Check for bilateral symmetry and trigger touch-up if needed.',
                'Day 14 automated trigger: If 5/5 satisfied, send 1-click Google Review invite.'
              ]
            },
            {
              title: 'Hyaluronic Acid Dermal Fillers',
              badge: 'Volumization Protocol',
              rules: [
                'Intermittent cold compress icing for initial 48 hours.',
                'Avoid invasive dental cleanings or laser facials for 14 days.',
                'Day 3 check-in: Verify absence of excessive vascular pain or blanching.',
                'Encourage gentle hydration to maximize hydrophilic HA expansion.'
              ]
            },
            {
              title: 'Morpheus8 Radiofrequency Microneedling',
              badge: 'Subdermal RF Protocol',
              rules: [
                'Strictly avoid direct sunlight and apply physical mineral zinc oxide.',
                'Refrain from active alpha-hydroxy acids, retinoids, or peels for 5 days.',
                'Apply sterile lipid barrier peptide ointment 3 times daily.',
                'Day 7 review: Confirm resolution of grid marks and initiation of collagen surge.'
              ]
            }
          ].map((proto, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {proto.badge}
                </span>
                <h4 className="font-bold text-slate-900 text-base mt-2">{proto.title}</h4>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                {proto.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Review Detail Centered Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 text-xs text-slate-800 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Clinical Aftercare Case: {selectedRecord.patientName}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {selectedRecord.procedureName} • Day {selectedRecord.daysPostTreatment} post-treatment
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo & Symptoms row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedRecord.patientPhotoUrl ? (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Patient Recovery Photo</span>
                    <img
                      src={selectedRecord.patientPhotoUrl}
                      alt="Recovery"
                      className="w-full h-44 object-cover rounded-2xl border border-slate-200 shadow-xs"
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs">
                    No photo uploaded
                  </div>
                )}

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Reported Symptoms</span>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-[11px] leading-relaxed mt-1">
                      "{selectedRecord.patientSymptomsFeedback}"
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Compliance verified: Normal erythema resolution on schedule.</span>
                  </div>
                </div>
              </div>

              {/* Timeline logs */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Care Timeline</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  {selectedRecord.timelineLogs.map((log, i) => (
                    <div key={i} className="flex justify-between text-[11px]">
                      <span className="text-slate-700">
                        <strong className="text-slate-900 capitalize">{log.sender}:</strong> {log.message}
                      </span>
                      <span className="text-slate-400 shrink-0 font-mono text-[10px]">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reassurance text dispatch */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Send Clinical Reassurance SMS
                </label>
                <textarea
                  rows={3}
                  value={reassuranceMessage}
                  onChange={(e) => setReassuranceMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              {selectedRecord.googleReviewEligible && (
                <button
                  type="button"
                  onClick={handleDispatchGoogleReviewInvite}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Send 5★ Review Link</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSendReassurance}
                disabled={isSending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ml-auto"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending to Patient...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reassurance SMS</span>
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
