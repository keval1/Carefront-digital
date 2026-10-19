import React from 'react';
import { ArrowUpRight, Star, ChevronLeft, ChevronRight, ShieldCheck, Play, Award, CheckCircle2 } from 'lucide-react';
import { Tenant } from '../../types';
import { getThemeTokens } from '../../utils/themeUtils';

interface StorefrontHeroProps {
  tenant: Tenant;
  onOpenBooking: () => void;
  onExploreTreatments: () => void;
  pageId?: string;
  customData?: {
    headline?: string;
    subhead?: string;
    badge?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
    heroImage?: string;
    variant?: string;
    design?: string;
  };
}

const PAGE_DEFAULTS: Record<string, { headline: string; subhead: string; badge: string; variant: string }> = {
  home: {
    headline: 'Feel Better. Move Freely. Live Pain-Free.',
    subhead: 'Personalized therapeutic medicine and radiofrequency contouring designed to reduce pain, relieve tension, and restore your natural cellular balance—delivered by board-certified physicians.',
    badge: 'Beverly Hills • Quad A Clinical Suite',
    variant: 'split_ambient'
  },
  treatments: {
    headline: 'Signature Clinical Procedures & Advanced RF',
    subhead: 'Explore physician-administered neurotoxins, dermal architecture, and Morpheus8 RF tissue tightening protocols.',
    badge: 'Board-Certified Medical Team',
    variant: 'centered_luxury'
  },
  about: {
    headline: 'Quad-A Accredited Surgical Precision',
    subhead: 'Founded by Dr. Sarah Jenkins, MD, Aura Aesthetics sets the gold standard for clinical excellence and natural facial harmony.',
    badge: 'Meet Our Medical Team',
    variant: 'split_ambient'
  },
  financing: {
    headline: '0% APR Cherry Medical Financing',
    subhead: 'Instant soft credit approvals from $500 to $10,000. Up to 24-month payment plans with zero impact on your credit score.',
    badge: 'Flexible Healthcare Payments',
    variant: 'centered_luxury'
  },
  memberships: {
    headline: 'VIP Concierge Aesthetic Memberships',
    subhead: 'Exclusive monthly banked treatments, preferred Botox rates ($11/unit), and priority physician scheduling.',
    badge: 'Aura VIP Concierge Club',
    variant: 'centered_luxury'
  },
  gallery: {
    headline: 'Clinical Transformations & Case Studies',
    subhead: 'Real patient before-and-after results documented under standardized medical lighting and Quad-A protocol.',
    badge: 'Verified Patient Outcomes',
    variant: 'centered_luxury'
  },
  contact: {
    headline: 'Beverly Hills Suite & Private Consultations',
    subhead: 'Located on Wilshire Boulevard with private valet parking and discrete executive entrances.',
    badge: 'Concierge Direct Access',
    variant: 'split_ambient'
  }
};

export const StorefrontHero: React.FC<StorefrontHeroProps> = ({
  tenant,
  onOpenBooking,
  onExploreTreatments,
  pageId = 'home',
  customData
}) => {
  const theme = getThemeTokens(tenant.branding.accentColor, tenant.branding.primaryColor);
  const pageDefault = PAGE_DEFAULTS[pageId] || PAGE_DEFAULTS.home;
  const variant = customData?.variant || pageDefault.variant || 'split_ambient';
  const design = customData?.design || 'warm_alabaster';

  const headline = customData?.headline !== undefined ? customData.headline : pageDefault.headline;
  const subhead = customData?.subhead !== undefined ? customData.subhead : pageDefault.subhead;
  const badge = customData?.badge !== undefined ? customData.badge : pageDefault.badge;
  const ctaPrimary = customData?.ctaPrimary || tenant.branding.heroCtaPrimary || 'Book Your Session';
  const ctaSecondary = customData?.ctaSecondary || tenant.branding.heroCtaSecondary || 'Explore Treatments';
  const heroImage =
    customData?.heroImage ||
    tenant.branding.heroImageUrl ||
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1920&q=85';

  return (
    <section
      className="relative min-h-[620px] lg:min-h-[720px] flex items-center overflow-hidden transition-colors"
      style={{
        backgroundColor: design === 'clinical_slate' ? '#0F172A' : theme.surfaceTint
      }}
    >
      {/* Background Ambient Luxury Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={tenant.name}
          className={`w-full h-full object-cover object-center filter ${
            design === 'clinical_slate' ? 'brightness-[0.4] contrast-125' : 'brightness-[0.90]'
          }`}
        />
        {/* Ambient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              variant === 'centered_luxury'
                ? 'radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)'
                : 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.2) 100%)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
        {/* VARIATION 1: CENTERED LUXURY */}
        {variant === 'centered_luxury' && (
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }} />
              <span>{badge}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.08] font-normal drop-shadow-md">
              {headline}
            </h1>

            <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-sans drop-shadow-xs">
              {subhead}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="text-white rounded-full px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all shadow-lg cursor-pointer hover:scale-102 hover:opacity-90"
                style={{ backgroundColor: theme.accent }}
              >
                {ctaPrimary}
              </button>
              <button
                onClick={onExploreTreatments}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/35 rounded-full px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>{ctaSecondary}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-6 border-t border-white/20 flex items-center justify-center gap-6 text-white text-xs">
              <div className="flex items-center gap-2">
                <div className="flex" style={{ color: theme.accent }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold">4.9 / 5.0</span>
                <span className="text-white/70">• 1,400+ Verified Patient Reviews</span>
              </div>
            </div>
          </div>
        )}

        {/* VARIATION 2: PHYSICIAN CONSULT SPLIT */}
        {variant === 'physician_consult' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <span>{badge}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.08] font-normal drop-shadow-sm">
                {headline}
              </h1>

              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xl font-sans drop-shadow-xs">
                {subhead}
              </p>

              <div className="space-y-2.5 text-xs text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Quad-A accredited Beverly Hills surgical suite & laser facility</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Complimentary 3D anatomical facial symmetry assessment</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenBooking}
                  className="text-white rounded-full px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all shadow-md cursor-pointer hover:scale-102 hover:opacity-90"
                  style={{ backgroundColor: theme.accent }}
                >
                  {ctaPrimary}
                </button>
                <button
                  onClick={onExploreTreatments}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{ctaSecondary}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Physician Spotlight Card */}
            <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-2xl text-slate-900 space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-4/3">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                  alt="Clinical Consultation"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Online Scheduling Available
                </span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Physician-Led Care Protocols</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Private one-on-one evaluations with board-certified physicians for tailored contouring and regenerative medicine.
                </p>
              </div>
              <button
                onClick={onOpenBooking}
                className="w-full py-3 rounded-xl text-white text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
                style={{ backgroundColor: theme.accent }}
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        )}

        {/* VARIATION 3: VIDEO / CINEMATIC AMBIENT */}
        {variant === 'video_ambient' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium">
              <Play className="w-3 h-3 fill-current" style={{ color: theme.accent }} />
              <span>Cinematic Clinical Walkthrough • {badge}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.08] font-normal drop-shadow-sm">
              {headline}
            </h1>

            <p className="text-white/85 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-sans drop-shadow-xs">
              {subhead}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="text-white rounded-full px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all shadow-md cursor-pointer hover:scale-102 hover:opacity-90"
                style={{ backgroundColor: theme.accent }}
              >
                {ctaPrimary}
              </button>
              <button
                onClick={onExploreTreatments}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{ctaSecondary}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* VARIATION 4: DEFAULT SPLIT AMBIENT (CLASSIC HIGH-CONVERSION) */}
        {variant === 'split_ambient' && (
          <div className="max-w-2xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }} />
              <span>{badge}</span>
            </div>

            {/* Main Large Editorial Serif Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.08] font-normal drop-shadow-sm">
              {headline}
            </h1>

            {/* Subheading / Value Proposition */}
            <p className="text-white/85 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-sans drop-shadow-xs">
              {subhead}
            </p>

            {/* Dual Pill Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="text-white rounded-full px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all shadow-md cursor-pointer hover:scale-102 hover:opacity-90"
                style={{ backgroundColor: theme.accent }}
              >
                {ctaPrimary}
              </button>

              <button
                onClick={onExploreTreatments}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{ctaSecondary}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Social Proof Row */}
            <div className="pt-6 border-t border-white/20 flex flex-wrap items-center gap-6 text-white text-xs">
              <div>
                <div className="font-bold text-sm tracking-wide">
                  15k+ <span className="font-normal text-white/80">Satisfied Patients</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex" style={{ color: theme.accent }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold">4.9</span>
                </div>
              </div>

              {/* Overlapping Patient Avatars */}
              <div className="flex -space-x-2 overflow-hidden items-center">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
                ].map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Verified Patient"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white/60 object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Highlight Card in Bottom-Right Corner */}
      {variant === 'split_ambient' && (
        <div className="hidden lg:flex absolute bottom-8 right-8 z-20 bg-white/85 backdrop-blur-md rounded-3xl p-4 max-w-sm border border-white/40 shadow-xl items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1512290900672-1f023075b9f9?auto=format&fit=crop&w=200&q=80"
            alt="Session preview"
            className="w-16 h-16 rounded-2xl object-cover shrink-0"
          />
          <div className="space-y-2 flex-1">
            <p className="text-xs text-slate-900 font-medium leading-snug">
              A premium wellness experience designed for your body, needs, and tranquility.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-500">
                <button className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 cursor-pointer">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={onOpenBooking}
                className="w-7 h-7 rounded-full text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                style={{ backgroundColor: theme.accent }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
