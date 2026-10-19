import React from 'react';
import { ArrowUpRight, Award, HeartHandshake, Calendar, Crown, Microscope, ShieldCheck, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { Tenant } from '../../types';
import { getThemeTokens } from '../../utils/themeUtils';

interface CoreFeaturesSplitProps {
  tenant?: Tenant;
  onOpenBooking?: () => void;
  pageId?: string;
  customData?: {
    headline?: string;
    subhead?: string;
    eyebrowBadge?: string;
    layout?: string;
    design?: string;
    bullets?: any[];
  };
}

const PAGE_FEATURE_DEFAULTS: Record<string, { headline: string; subhead: string; eyebrowBadge: string; bullets: any[] }> = {
  home: {
    headline: 'Expert Care That Goes Beyond Relaxation',
    subhead: 'Every treatment is tailored to your body’s needs using evidence-based techniques that promote cellular repair, anatomical balance, and natural vitality.',
    eyebrowBadge: 'Our Core Features',
    bullets: [
      {
        title: 'Licensed Clinicians & Surgeons',
        description: 'Double fellowship-trained physicians and master injectors with over 14+ years of surgical anatomy experience.',
        iconName: 'award',
        highlightBadge: 'Quad-A Accredited'
      },
      {
        title: 'Customized Anatomical Care',
        description: 'Every procedure is mapped to your unique facial bone structure, skin barrier density, and aesthetic goals.',
        iconName: 'heart',
        highlightBadge: '3D Mapping'
      },
      {
        title: 'Flexible Priority Scheduling',
        description: 'Instant online slot reservations with refundable deposits to lock priority appointment times.',
        iconName: 'calendar',
        highlightBadge: 'Direct Lock'
      },
      {
        title: 'VIP Pass & Membership Perks',
        description: 'Exclusive banked neuromodulator units, 10% off clinical dispensary, and monthly hydrafacials.',
        iconName: 'crown',
        highlightBadge: '$11/unit Botox'
      },
      {
        title: 'Evidence-Based Regenerative Science',
        description: 'FDA-cleared radiofrequency, biostimulatory poly-L-lactic acid, and pharmaceutical-grade lipid formulations.',
        iconName: 'microscope',
        highlightBadge: 'FDA-Cleared'
      }
    ]
  },
  about: {
    headline: 'Quad-A Accredited Surgical Precision & Safety',
    subhead: 'Operating under hospital-grade sterility protocols and double board certifications, Aura Aesthetics guarantees maximum patient safety and anatomical mastery.',
    eyebrowBadge: 'Clinical Standards & Safety',
    bullets: [
      {
        title: 'Quad-A Accredited Surgical Center',
        description: 'Certified ambulatory surgical facility adhering to strict hospital-grade cleanliness and resuscitation standards.',
        iconName: 'shield',
        highlightBadge: 'Quad-A Certified'
      },
      {
        title: 'Double Board-Certified Leadership',
        description: 'Overseen by Dr. Sarah Jenkins, MD, FACS, with fellowship training in facial plastic surgery and aesthetic reconstruction.',
        iconName: 'award',
        highlightBadge: 'MD FACS'
      },
      {
        title: 'Standardized Pre & Post Protocols',
        description: 'Comprehensive pre-screening, digital medical charts, and monitored recovery lounges for every patient.',
        iconName: 'heart',
        highlightBadge: 'Zero Complications'
      },
      {
        title: 'Physician-Only Energy Devices',
        description: 'All Morpheus8 RF and laser wavelength applications are administered by trained medical staff.',
        iconName: 'microscope',
        highlightBadge: 'Clinical Only'
      }
    ]
  },
  memberships: {
    headline: 'Exclusive Concierge Member Privileges',
    subhead: 'Unlock guaranteed priority scheduling, banked monthly treatments, and exclusive clinical dispensary pricing designed for consistent aesthetic maintenance.',
    eyebrowBadge: 'Membership Privileges',
    bullets: [
      {
        title: 'Banked Treatments Never Expire',
        description: 'Monthly banked Hydrafacials or credits roll over indefinitely and can be redeemed whenever your schedule permits.',
        iconName: 'crown',
        highlightBadge: 'Rollover Guaranteed'
      },
      {
        title: 'Preferred Botox & Dysport Pricing',
        description: 'Members lock in $11/unit for all neuromodulators year-round with no minimum unit commitment.',
        iconName: 'sparkles',
        highlightBadge: '$11/unit Locked'
      },
      {
        title: 'Priority Weekend & Evening Access',
        description: 'VIP exclusive calendar access with reserved slots before and after regular office operating hours.',
        iconName: 'calendar',
        highlightBadge: 'VIP Calendar'
      },
      {
        title: 'Dispensary & Skin Health Credits',
        description: 'Enjoy 10% to 15% off medical-grade skincare including SkinCeuticals and custom lipid barrier creams.',
        iconName: 'heart',
        highlightBadge: '15% Off Skincare'
      }
    ]
  },
  contact: {
    headline: 'Private Beverly Hills Consultation Experience',
    subhead: 'Located on prestige Wilshire Boulevard with discrete valet parking, private executive suites, and personal patient coordinators.',
    eyebrowBadge: 'Concierge Arrival',
    bullets: [
      {
        title: 'Complimentary Executive Valet',
        description: 'Drop off at our private entrance with secured subterranean parking and immediate elevator escort.',
        iconName: 'clock',
        highlightBadge: 'Private Valet'
      },
      {
        title: 'Discrete Private Check-In',
        description: 'Direct-to-room intake ensures zero waiting room exposure and complete confidentiality.',
        iconName: 'shield',
        highlightBadge: '100% Confidential'
      },
      {
        title: '1-on-1 Physician Consultation',
        description: 'Unrushed 45-minute comprehensive 3D facial imaging and individualized longevity blueprint.',
        iconName: 'award',
        highlightBadge: '45m Physician Consult'
      },
      {
        title: 'Direct Care Concierge Access',
        description: 'Your dedicated patient coordinator is available 24/7 via SMS for all pre- and post-care queries.',
        iconName: 'calendar',
        highlightBadge: '24/7 Dedicated Concierge'
      }
    ]
  }
};

const ICON_MAP: Record<string, React.ElementType> = {
  award: Award,
  shield: ShieldCheck,
  heart: HeartHandshake,
  calendar: Calendar,
  crown: Crown,
  microscope: Microscope,
  sparkles: Sparkles,
  clock: Clock
};

export const CoreFeaturesSplit: React.FC<CoreFeaturesSplitProps> = ({
  tenant,
  onOpenBooking,
  pageId = 'home',
  customData
}) => {
  const theme = getThemeTokens(tenant?.branding.accentColor, tenant?.branding.primaryColor);
  const config = tenant?.branding.featuresConfig || {};
  const pageDefault = PAGE_FEATURE_DEFAULTS[pageId] || PAGE_FEATURE_DEFAULTS.home;

  const layout = customData?.layout || config.layout || (config.variant === 'grid_cards' ? 'grid_cards' : 'split_left_right');
  const design = customData?.design || config.design || 'clinical_editorial';

  const headline = customData?.headline !== undefined ? customData.headline : (config.headline || pageDefault.headline);
  const subhead = customData?.subhead !== undefined ? customData.subhead : (config.subhead || pageDefault.subhead);
  const eyebrowBadge = customData?.eyebrowBadge !== undefined ? customData.eyebrowBadge : (config.eyebrowBadge || pageDefault.eyebrowBadge);
  const doctorName = config.doctorName || 'Dr. Sarah Jenkins, MD, FACS';
  const doctorTitle = config.doctorTitle || 'Double Board-Certified Facial Plastic Surgeon';
  const doctorImage =
    config.doctorImage ||
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80';

  const bullets = customData?.bullets || (config.bullets && config.bullets.length > 0 ? config.bullets : pageDefault.bullets);

  return (
    <section
      className="py-24 sm:py-32 border-t transition-colors"
      style={{ backgroundColor: theme.surfaceTint, borderColor: theme.borderTint }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* LAYOUT 1: SPLIT LEFT (VIDEO / MEDIA) + RIGHT (FEATURES) */}
        {layout === 'split_left_right' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Heading, description, and Physician Card */}
            <div className="lg:col-span-5 space-y-8">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: theme.eyebrowBg,
                  borderColor: theme.eyebrowBorder,
                  borderWidth: '1px',
                  color: theme.eyebrowText
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.pillDot }} />
                {eyebrowBadge}
              </span>

              <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-[1.12]">
                {headline}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {subhead}
              </p>

              {onOpenBooking && (
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border text-xs uppercase tracking-widest font-semibold text-slate-800 hover:bg-white transition-all cursor-pointer shadow-2xs"
                  style={{ borderColor: theme.borderTint }}
                >
                  <span>Consult Clinical Team</span>
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                </button>
              )}

              {/* Physician Spotlight Thumbnail */}
              <div className="relative rounded-3xl overflow-hidden shadow-sm aspect-video bg-stone-900 group cursor-pointer border"
                style={{ borderColor: theme.borderTint }}
              >
                <img
                  src={doctorImage}
                  alt={doctorName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-5 flex flex-col justify-end text-white">
                  <div className="font-serif text-base font-semibold">{doctorName}</div>
                  <div className="text-[11px] text-stone-300">{doctorTitle}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Feature Bullets */}
            <div className="lg:col-span-7 divide-y" style={{ borderColor: theme.borderTint }}>
              {bullets.map((item, idx) => {
                const IconComponent = (item.iconName && ICON_MAP[item.iconName.toLowerCase()]) || Award;
                return (
                  <div
                    key={idx}
                    className="py-6 first:pt-0 last:pb-0 flex items-start gap-4 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border mt-0.5"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: theme.borderTint,
                        color: theme.accent
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-serif text-lg font-bold text-slate-900">
                          {item.title}
                        </h3>
                        {item.highlightBadge && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{
                              backgroundColor: theme.eyebrowBg,
                              color: theme.eyebrowText
                            }}
                          >
                            {item.highlightBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LAYOUT 2: GRID CARDS (3-COLUMN DETAILED CARDS) */}
        {layout === 'grid_cards' && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: theme.eyebrowBg,
                  borderColor: theme.eyebrowBorder,
                  borderWidth: '1px',
                  color: theme.eyebrowText
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.pillDot }} />
                {eyebrowBadge}
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-[1.15]">
                {headline}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {subhead}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bullets.map((item, idx) => {
                const IconComponent = (item.iconName && ICON_MAP[item.iconName.toLowerCase()]) || Award;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-7 border shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                    style={{ borderColor: theme.borderTint }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                          style={{
                            backgroundColor: theme.surfaceTint,
                            borderColor: theme.borderTint,
                            color: theme.accent
                          }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        {item.highlightBadge && (
                          <span
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: theme.eyebrowBg,
                              color: theme.eyebrowText
                            }}
                          >
                            {item.highlightBadge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LAYOUT 3: BENTO FEATURES */}
        {layout === 'bento_features' && (
          <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: theme.eyebrowBg,
                    borderColor: theme.eyebrowBorder,
                    borderWidth: '1px',
                    color: theme.eyebrowText
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.pillDot }} />
                  {eyebrowBadge}
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-[1.15]">
                  {headline}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
                {subhead}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Anchor Card with Doctor */}
              <div
                className="lg:col-span-5 bg-white rounded-3xl p-8 border shadow-xs flex flex-col justify-between space-y-6"
                style={{ borderColor: theme.borderTint }}
              >
                <div className="space-y-4">
                  <div className="h-52 rounded-2xl overflow-hidden relative">
                    <img src={doctorImage} alt={doctorName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-slate-900">{doctorName}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">{doctorTitle}</p>
                  </div>
                </div>
                {onOpenBooking && (
                  <button
                    onClick={onOpenBooking}
                    className="w-full py-3 rounded-full text-xs uppercase tracking-widest font-semibold text-white shadow-xs cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: theme.accent }}
                  >
                    Request Consultation
                  </button>
                )}
              </div>

              {/* Surrounding Bullets */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {bullets.slice(0, 4).map((item, idx) => {
                  const IconComponent = (item.iconName && ICON_MAP[item.iconName.toLowerCase()]) || Award;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl p-6 border shadow-xs space-y-3 flex flex-col justify-between"
                      style={{ borderColor: theme.borderTint }}
                    >
                      <div className="space-y-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center border"
                          style={{
                            backgroundColor: theme.surfaceTint,
                            borderColor: theme.borderTint,
                            color: theme.accent
                          }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 4: ASYMMETRIC SPOTLIGHT */}
        {layout === 'asymmetric_spotlight' && (
          <div className="space-y-12">
            <div className="max-w-3xl space-y-4">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: theme.eyebrowBg,
                  borderColor: theme.eyebrowBorder,
                  borderWidth: '1px',
                  color: theme.eyebrowText
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.pillDot }} />
                {eyebrowBadge}
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-[1.12]">
                {headline}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {subhead}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bullets.map((item, idx) => {
                const IconComponent = (item.iconName && ICON_MAP[item.iconName.toLowerCase()]) || Award;
                return (
                  <div
                    key={idx}
                    className="p-6 bg-white rounded-2xl border flex items-start gap-4 shadow-xs"
                    style={{ borderColor: theme.borderTint }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: theme.surfaceTint,
                        borderColor: theme.borderTint,
                        color: theme.accent
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
