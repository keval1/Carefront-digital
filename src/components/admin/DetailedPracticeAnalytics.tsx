import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Globe,
  Key,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Activity,
  Layers,
  ChevronDown,
  RefreshCw,
  Eye,
  ShoppingBag,
  Zap,
  BarChart3,
  Percent,
  Check,
  Lock,
  ArrowRight,
  PhoneCall,
  Smartphone,
  ExternalLink
} from 'lucide-react';

interface DetailedPracticeAnalyticsProps {
  onToast: (msg: string) => void;
  subPage?: 'overview' | 'retention' | 'scheduling' | 'acceptance' | 'google_analytics';
}

export const DetailedPracticeAnalytics: React.FC<DetailedPracticeAnalyticsProps> = ({
  onToast,
  subPage = 'overview'
}) => {
  const [activeSubPage, setActiveSubPage] = useState<'overview' | 'retention' | 'scheduling' | 'acceptance' | 'google_analytics'>(subPage);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '12m'>('30d');

  // Google Analytics configuration
  const [gaMeasurementId, setGaMeasurementId] = useState('G-9941AURA77');
  const [gaApiSecret, setGaApiSecret] = useState('••••••••••••••••••••••••');
  const [isGaConnected, setIsGaConnected] = useState(true);
  const [isEditingGa, setIsEditingGa] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('AIzaSyD-AuraMedSpaKey-BeverlyHills90210');

  // Sync when subPage prop changes from AuraOSDashboard left menu navigation
  useEffect(() => {
    if (subPage) {
      setActiveSubPage(subPage);
    }
  }, [subPage]);

  return (
    <div className="space-y-6 font-manrope">
      
      {/* Page Header (No duplicate tabs, clean standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeSubPage === 'retention' && 'Patient Retention & Cohort LTV'}
            {activeSubPage === 'scheduling' && 'Scheduling & Room Optimization'}
            {activeSubPage === 'acceptance' && 'Treatment Plan Acceptance & Margins'}
            {activeSubPage === 'google_analytics' && 'Google Analytics (GA4) & Web Intelligence'}
            {activeSubPage === 'overview' && 'Practice Intelligence Overview'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data intelligence driving patient retention, chair scheduling efficiency, treatment plan acceptance, and Google Analytics conversion tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe pill selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['30d', '90d', '12m'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setTimeRange(r);
                  onToast(`Loaded ${r === '30d' ? '30-Day' : r === '90d' ? '90-Day' : '12-Month'} practice cohort data.`);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r === '30d' ? 'Last 30 Days' : r === '90d' ? 'Last 90 Days' : 'Past Year'}
              </button>
            ))}
          </div>

          <button
            onClick={() => onToast('📊 Exported executive clinical analytics report (PDF/CSV).')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. PRACTICE OVERVIEW SUB-VIEW (HIGHLY ENRICHED & DETAILED) */}
      {/* ======================================================== */}
      {activeSubPage === 'overview' && (
        <div className="space-y-6">
          
          {/* Top Row: Automated Outreach Performance (Relocated from Automations) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Automated Lead Outreach &amp; Conversion Efficiency
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                AI Speed-to-Lead Live
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Leads Qualified</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">342</div>
                <span className="text-[11px] text-emerald-600 font-bold block">▲ 3.2s Avg Response</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Automated Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">$118,400</div>
                <span className="text-[11px] text-slate-500 block">Attributed to automated touches</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ad-to-Deposit Rate</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">36.4%</div>
                <span className="text-[11px] text-emerald-600 font-bold block">▲ +14% vs manual triage</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Channels</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-sm font-extrabold text-slate-900 font-mono pt-1">SMS • WhatsApp • Email</div>
                <span className="text-[11px] text-slate-500 block">Quad-A &amp; HIPAA Compliant</span>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Medical Aesthetic Efficiency */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Practice Core Financial &amp; Clinical Health
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Net Practice Collections</span>
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">$492,840</div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% vs previous period</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">90-Day Retention Rate</span>
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <Users className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">74.2%</div>
                <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-bold">
                  <span>90-day neurotoxin repeat curve</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Treatment Plan Acceptance</span>
                  <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">68.4%</div>
                <div className="flex items-center gap-1.5 text-[11px] text-purple-600 font-bold">
                  <span>Boosted by Cherry 0% APR</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Chair &amp; Suite Utilization</span>
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <Clock className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">84.6%</div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-bold">
                  <span>Only 15.4% idle room capacity</span>
                </div>
              </div>
            </div>
          </div>

          {/* Procedure Revenue Leaderboard & Margins */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Procedure Revenue &amp; Operating Margins</h3>
                  <p className="text-[11px] text-slate-500">Gross revenue, consumable cost, and physician gross yield</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">EMR Verified</span>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { name: 'Morpheus8 RF Dermal Lift (Face & Neck)', revenue: 148200, margin: 84, volume: '98 cases', consumable: '$140 tip' },
                  { name: 'Botox & Dysport Neuromodulators', revenue: 118400, margin: 72, volume: '210 visits', consumable: '$5.50/unit cost' },
                  { name: 'Juvederm & Restylane Volume Contouring', revenue: 94800, margin: 68, volume: '112 syringes', consumable: '$165/syringe' },
                  { name: 'LaseMD Ultra Sub-Ablative Laser', revenue: 82400, margin: 88, volume: '74 sessions', consumable: '$45 tip' },
                  { name: 'Aura VIP Membership Pass (MRR)', revenue: 49040, margin: 92, volume: '164 members', consumable: '$0 recurring' }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <span className="font-mono font-extrabold text-slate-900">${item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{item.volume} • Consumable: {item.consumable}</span>
                      <span className="font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded text-[10px]">
                        {item.margin}% Gross Margin
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${(item.revenue / 150000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Productivity & Room Utilization */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Physician &amp; Room Productivity</h3>
                  <p className="text-[11px] text-slate-500">Hourly yield and chair booking density</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Dr. Sarah Jenkins, M.D.</span>
                    <span className="font-mono font-bold text-blue-700">$2,420 / hr</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Suite 1 &bull; 92% Booked &bull; 44 Consults</div>
                  <span className="text-[10px] text-emerald-600 font-bold block pt-1">
                    ▲ 98.4% Treatment plan acceptance
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Nurse Olivia Vance, RN</span>
                    <span className="font-mono font-bold text-blue-700">$1,180 / hr</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Suite 2 &bull; 86% Booked &bull; 68 Treatments</div>
                  <span className="text-[10px] text-emerald-600 font-bold block pt-1">
                    ▲ 89.2% 90-day neurotoxin recall return
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Quad-A Surgical Suite 3</span>
                    <span className="font-mono font-bold text-purple-700">$3,850 / case</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Sedation &amp; Deep Tissue Tightening &bull; 76% Booked</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Google Analytics (GA4) Live</span>
                </div>
                <p className="text-[11px] text-blue-700">
                  Measurement ID <strong className="font-mono">{gaMeasurementId}</strong> tracking web traffic, treatment views, and deposit conversions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PATIENT RETENTION & LTV SUB-VIEW */}
      {/* ======================================================== */}
      {activeSubPage === 'retention' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Average 12-Month Patient LTV</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">$3,840.00</div>
              <span className="text-[11px] text-emerald-600 font-bold block">▲ +$620 vs local aesthetic clinics</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Predictive Recall Return Rate</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">78.6%</div>
              <span className="text-[11px] text-blue-600 font-bold block">Automated 90-day SMS &amp; Email touches</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Patient Churn / Drop-off</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">11.2%</div>
              <span className="text-[11px] text-emerald-600 font-bold block">▼ Reduced by 8% via aftercare protocol</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">12-Month Retention by Treatment Category</h3>
            <div className="space-y-3">
              {[
                { category: 'Neuromodulators (Botox/Dysport)', repeatDays: '84 days avg', returnRate: '86%', ltv: '$2,400/yr' },
                { category: 'RF Microneedling (Morpheus8 3-Pack)', repeatDays: '180 days avg', returnRate: '72%', ltv: '$4,200/yr' },
                { category: 'Dermal Fillers (Lips & Cheeks)', repeatDays: '210 days avg', returnRate: '68%', ltv: '$3,100/yr' },
                { category: 'Medical Grade Chemical Peels', repeatDays: '45 days avg', returnRate: '64%', ltv: '$1,600/yr' }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{c.category}</div>
                    <div className="text-slate-500 text-[11px]">Average interval: {c.repeatDays}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {c.returnRate} Return Rate
                    </span>
                    <div className="font-mono text-slate-600 text-[11px] mt-0.5">Est. LTV: {c.ltv}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SCHEDULING & ROOM OPTIMIZATION SUB-VIEW */}
      {/* ======================================================== */}
      {activeSubPage === 'scheduling' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Deposit Protected Attendance</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">98.2%</div>
              <span className="text-[11px] text-emerald-600 font-bold block">No-show rate dropped to under 1.8%</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Idle Chair Capacity Recovered</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">34.5 hrs</div>
              <span className="text-[11px] text-blue-600 font-bold block">Auto-filled via AI Missed Call &amp; VIP list</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Peak Booking Density</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">Thu–Sat</div>
              <span className="text-[11px] text-slate-500 block">10:00 AM – 3:30 PM prime hours</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Treatment Room &amp; Surgical Suite Utilization</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { room: 'Suite 1 — Physician Consult & Injectables', util: 92, status: 'High Demand', provider: 'Dr. Sarah Jenkins' },
                { room: 'Suite 2 — Laser & RF Microneedling', util: 86, status: 'Optimal', provider: 'Nurse Olivia Vance' },
                { room: 'Suite 3 — Quad-A Surgical Contouring', util: 76, status: 'Specialized', provider: 'Dr. Marcus Vance' }
              ].map((r, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                  <div className="font-bold text-slate-900 text-xs">{r.room}</div>
                  <div className="text-2xl font-mono font-extrabold text-blue-700">{r.util}%</div>
                  <div className="text-[11px] text-slate-500">Assigned: {r.provider}</div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${r.util}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TREATMENT PLAN ACCEPTANCE SUB-VIEW */}
      {/* ======================================================== */}
      {activeSubPage === 'acceptance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Treatment Plan Acceptance</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">68.4%</div>
              <span className="text-[11px] text-emerald-600 font-bold block">▲ +12% with Cherry 0% Financing</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Average Plan Ticket Size</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">$2,940.00</div>
              <span className="text-[11px] text-slate-500 block">Bundled packages vs single sessions</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Deposit Conversion Rate</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">94.8%</div>
              <span className="text-[11px] text-emerald-600 font-bold block">Instant Stripe / Apple Pay auth</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Financing &amp; Acceptance Drivers</h3>
            <p className="text-xs text-slate-500">
              Patients presented with monthly financing options through Cherry accept packages 2.4x more often than single treatments.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-900 block">Cherry 0% APR Financing Integration</span>
                <p className="text-emerald-700 text-[11px]">Paid 100% upfront to practice bank account with 0 merchant fraud liability.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs space-y-1">
                <span className="font-bold text-blue-900 block">Digital Multi-Step Consult Authorizer</span>
                <p className="text-blue-700 text-[11px]">Instant SMS treatment quotes with 1-tap agreement signoff and deposit lock.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. GOOGLE ANALYTICS (GA4) & WEB SUB-VIEW */}
      {/* ======================================================== */}
      {activeSubPage === 'google_analytics' && (
        <div className="space-y-6">
          
          {/* GA4 Setup & API Key Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Google Analytics 4 (GA4) Integration</h3>
                  <p className="text-xs text-slate-500">Track website visitors, treatment views, and appointment deposit checkouts.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                  isGaConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isGaConnected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {isGaConnected ? 'GA4 Connected & Active' : 'Disconnected'}
                </span>

                <button
                  onClick={() => setIsEditingGa(!isEditingGa)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {isEditingGa ? 'Done' : 'Edit Credentials'}
                </button>
              </div>
            </div>

            {/* Input Credentials Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs">
                  GA4 Measurement ID
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                  <input
                    type="text"
                    disabled={!isEditingGa}
                    value={gaMeasurementId}
                    onChange={(e) => setGaMeasurementId(e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-mono font-bold text-slate-900"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Found in Google Analytics &gt; Data Streams &gt; Stream ID</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs">
                  Google API Secret / Key (Measurement Protocol)
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                  <input
                    type={isEditingGa ? 'text' : 'password'}
                    disabled={!isEditingGa}
                    value={gaApiSecret}
                    onChange={(e) => setGaApiSecret(e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-mono text-slate-900"
                    placeholder="API Secret Key"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Used for server-authoritative EMR deposit conversion tracking</span>
              </div>
            </div>

            {isEditingGa && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setIsEditingGa(false);
                    setIsGaConnected(true);
                    onToast('✓ Google Analytics GA4 credentials saved & verified.');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save &amp; Test Connection
                </button>
              </div>
            )}
          </div>

          {/* Web Traffic & Conversion Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Storefront Unique Visitors</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">14,820</div>
              <span className="text-[11px] text-emerald-600 font-bold block">▲ +22.4% organic &amp; ads</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Treatment Catalog Views</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">38,400</div>
              <span className="text-[11px] text-slate-500 block">Avg 2.6 pages / session</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Checkout Funnel Initiation</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">1,142</div>
              <span className="text-[11px] text-blue-600 font-bold block">7.7% of site visitors</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Deposit Completion Rate</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">34.8%</div>
              <span className="text-[11px] text-emerald-600 font-bold block">397 completed deposits</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
