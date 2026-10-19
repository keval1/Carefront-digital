import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Calculator, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import { Tenant } from '../../types';
import { getThemeTokens } from '../../utils/themeUtils';

interface CherryFinancingSectionProps {
  tenant: Tenant;
  customData?: any;
  onOpenBooking?: () => void;
}

export const CherryFinancingSection: React.FC<CherryFinancingSectionProps> = ({ tenant, customData, onOpenBooking }) => {
  const config = customData || tenant.branding.financingConfig || {};
  const variant = config.layout || config.variant || 'spotlight_banner';
  const design = config.design || 'brand_tinted';
  const headline = config.headline || '0% APR Patient Financing with Cherry';
  const subhead =
    config.subhead ||
    'Split procedure balances over 3, 6, 12, or 24-month payment plans with zero credit impact and 60-second approvals.';

  const theme = getThemeTokens(tenant.branding.accentColor, tenant.branding.primaryColor);
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const sampleTreatmentPrice = 1200;
  const monthlyPayment = Math.round(sampleTreatmentPrice / selectedMonths);

  return (
    <section
      className="py-20 sm:py-28 border-t transition-colors"
      style={{
        backgroundColor: design === 'dark_concierge' ? '#0F172A' : theme.surfaceTint,
        borderColor: theme.borderTint,
        color: design === 'dark_concierge' ? '#F8FAFC' : undefined
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* VARIATION 1: SPOTLIGHT BANNER */}
        {variant === 'spotlight_banner' && (
          <div
            className="bg-white rounded-3xl p-8 sm:p-12 border shadow-xs flex flex-col lg:flex-row items-center justify-between gap-10"
            style={{ borderColor: theme.borderTint }}
          >
            <div className="space-y-5 max-w-xl">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: theme.eyebrowBg,
                  color: theme.eyebrowText,
                  border: `1px solid ${theme.eyebrowBorder}`
                }}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Flexible Payment Plans</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight leading-tight">
                {headline}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {subhead}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No hard credit check</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>0% promotional APR</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant decision in 60s</span>
                </span>
              </div>
            </div>

            <div className="w-full lg:w-96 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-5 text-center shrink-0">
              <div
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white"
                style={{ backgroundColor: theme.accent }}
              >
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase text-slate-400">Pre-Approved Limit</div>
                <div className="text-3xl font-bold text-slate-900 mt-1">$3,500.00</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-1">Starting at $71/month</div>
              </div>
              <button
                onClick={() => alert('Starting fast Cherry pre-qualification...')}
                className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-sm cursor-pointer hover:opacity-90"
                style={{ backgroundColor: theme.accent }}
              >
                Check Approval Limit (60s)
              </button>
            </div>
          </div>
        )}

        {/* VARIATION 2: CALCULATOR CARD */}
        {variant === 'calculator_card' && (
          <div
            className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border shadow-xs space-y-8"
            style={{ borderColor: theme.borderTint }}
          >
            <div className="text-center space-y-3">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: theme.eyebrowBg,
                  color: theme.eyebrowText,
                  border: `1px solid ${theme.eyebrowBorder}`
                }}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Monthly Estimator</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">{headline}</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">{subhead}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-700">
                <span className="font-semibold">Select Repayment Term:</span>
                <span className="font-bold text-slate-900">{selectedMonths} Months</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 12, 24].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonths(m)}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                      selectedMonths === m
                        ? 'text-white border-transparent'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    style={selectedMonths === m ? { backgroundColor: theme.accent } : undefined}
                  >
                    {m} mos
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Estimated Monthly Payment for $1,200 Treatment:</div>
                  <div className="text-2xl font-bold text-slate-900">
                    ${monthlyPayment} <span className="text-xs font-normal text-slate-500">/mo</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('Starting fast Cherry verification...')}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: theme.accent }}
                >
                  Apply 0% Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VARIATION 3: SPLIT TRUST */}
        {variant === 'split_trust' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: theme.eyebrowBg,
                  color: theme.eyebrowText,
                  border: `1px solid ${theme.eyebrowBorder}`
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Barriers to Care</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-tight">{headline}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{subhead}</p>
              <div className="space-y-3">
                {[
                  'Instant electronic checkout with no paperwork',
                  'High approval rate across all credit tiers',
                  'Autopay integration directly into patient portal'
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 text-[10px] font-bold"
                      style={{ backgroundColor: theme.accent }}
                    >
                      ✓
                    </span>
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border shadow-xs space-y-6" style={{ borderColor: theme.borderTint }}>
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: theme.borderTint }}>
                <span className="font-bold text-slate-900 text-sm">Financing Verification</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  Pre-Approval Active
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unlock full facial rejuvenation, Morpheus8 radiofrequency, and biostimulatory injectables today without financial friction.
              </p>
              <button
                onClick={() => alert('Pre-qualify in 60 seconds with Cherry!')}
                className="w-full py-3.5 rounded-full text-xs font-semibold text-white uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all shadow-sm"
                style={{ backgroundColor: theme.accent }}
              >
                <span>Instant Pre-Qualification</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VARIATION 4: THREE-STEP GRID */}
        {variant === 'three_step_grid' && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: theme.eyebrowBg,
                  color: theme.eyebrowText,
                  border: `1px solid ${theme.eyebrowBorder}`
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3 Simple Steps</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">{headline}</h2>
              <p className="text-xs sm:text-sm text-slate-600">{subhead}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Apply in 60 Seconds', desc: 'No hard credit check, enter basic details on your mobile phone.' },
                { step: '02', title: 'Pick Your 0% Term', desc: 'Select 3, 6, 12, or 24-month flexible monthly repayment schedule.' },
                { step: '03', title: 'Lock Treatment Today', desc: 'Proceed straight to physician consultation with zero financial delay.' }
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-3xl p-7 border shadow-xs space-y-3" style={{ borderColor: theme.borderTint }}>
                  <div className="font-serif text-2xl font-bold" style={{ color: theme.accent }}>{card.step}</div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">{card.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
