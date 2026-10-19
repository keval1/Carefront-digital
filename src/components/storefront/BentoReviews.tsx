import React from 'react';
import { Star, Quote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ReviewItem, Tenant } from '../../types';
import { getThemeTokens } from '../../utils/themeUtils';

interface BentoReviewsProps {
  reviews?: ReviewItem[];
  tenant?: Tenant;
  customData?: any;
}

export const BentoReviews: React.FC<BentoReviewsProps> = ({ reviews: initialReviews, tenant, customData }) => {
  const theme = getThemeTokens(tenant?.branding.accentColor, tenant?.branding.primaryColor);
  const config = customData || tenant?.branding.reviewsConfig || {};
  const layout = config.layout || (config.variant === 'carousel_cards' ? 'three_col_cards' : 'bento_grid');
  const cardDesign = config.cardDesign || 'minimal_white';

  const defaultReviews: ReviewItem[] = [
    {
      id: 'rev-1',
      author: 'Camilla Vance',
      role: 'Verified Google Review • Morpheus8 & Dysport',
      comment:
        'Dr. Jenkins and her team redefined my skin structure without giving me that "done" plastic look. At 46, my jawline has never looked sharper and the downtime was barely 48 hours.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      date: '2 weeks ago',
      isVerifiedPatient: true
    },
    {
      id: 'rev-2',
      author: 'Elena Rostova',
      role: 'Verified Google Review • Lip Architecture & Sculptra',
      comment:
        'The level of clinical precision at Aura is unmatched. The 3D facial mapping made me feel so secure. My volume loss around the temples and cheeks is completely restored naturally.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      date: '1 month ago',
      isVerifiedPatient: true
    },
    {
      id: 'rev-3',
      author: 'Dr. Marcus Sterling',
      role: 'Verified Google Review • Longevity Protocol',
      comment:
        'As an orthopedic surgeon, I appreciate the sterile clinical rigor combined with five-star luxury hospitality. Their cellular NAD+ and RF lifting protocols are top tier.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      date: '3 weeks ago',
      isVerifiedPatient: true
    },
    {
      id: 'rev-4',
      author: 'Sophia Chen',
      role: 'Verified Google Review • Hydrafacial MD',
      comment:
        'The aesthetic suite feels like a high-end private club. Skin was instantly radiant before my gala. Truly Beverly Hills excellence.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      date: '5 days ago',
      isVerifiedPatient: true
    }
  ];

  const reviews = initialReviews && initialReviews.length > 0 ? initialReviews : defaultReviews;
  const headline = config.headline || 'Trusted by Thousands Seeking Clinical Beauty';
  const subhead =
    config.subhead ||
    'Real patient outcomes and unedited verified ratings pulled live from our Google Business Profile.';
  const ratingScore = config.ratingScore || '4.9';
  const reviewCount = config.reviewCount || '184 Verified Reviews';
  const badgeLabel = config.badgeLabel || 'Google Business Profile Verified';

  // Helper to render individual card based on cardDesign preset
  const renderReviewCard = (rev: ReviewItem, idx: number) => {
    const starCount = Math.max(1, Math.min(5, Math.round(Number(rev.rating) || 5)));

    // DESIGN 1: MINIMAL WHITE
    if (cardDesign === 'minimal_white') {
      return (
        <div
          key={rev.id || idx}
          className="bg-white rounded-3xl p-7 border shadow-xs space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          style={{ borderColor: theme.borderTint }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex" style={{ color: theme.accent }}>
                {[...Array(starCount)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <span className="text-blue-600 font-bold">G</span> {rev.date}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans italic">
              "{rev.comment}"
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: theme.borderTintSubtle }}>
            <img src={rev.avatarUrl} alt={rev.author} className="w-10 h-10 rounded-full object-cover border" style={{ borderColor: theme.borderTint }} />
            <div>
              <div className="font-serif text-sm font-bold text-slate-900">{rev.author}</div>
              <div className="text-[10px] text-slate-500">{rev.role}</div>
            </div>
          </div>
        </div>
      );
    }

    // DESIGN 2: GLASS FROSTED
    if (cardDesign === 'glass_frosted') {
      return (
        <div
          key={rev.id || idx}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-7 border shadow-xs space-y-5 flex flex-col justify-between hover:shadow-md transition-all"
          style={{ borderColor: theme.accent, backgroundColor: theme.surfaceTint }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex" style={{ color: theme.accent }}>
                {[...Array(starCount)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
                ✓ Google Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-serif italic">
              "{rev.comment}"
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: theme.borderTint }}>
            <img src={rev.avatarUrl} alt={rev.author} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-serif text-sm font-bold text-slate-900">{rev.author}</div>
              <div className="text-[10px] text-slate-600">{rev.role}</div>
            </div>
          </div>
        </div>
      );
    }

    // DESIGN 3: EDITORIAL QUOTE
    if (cardDesign === 'editorial_quote') {
      return (
        <div
          key={rev.id || idx}
          className="bg-white rounded-3xl p-8 border shadow-xs space-y-6 flex flex-col justify-between relative overflow-hidden"
          style={{ borderColor: theme.borderTint }}
        >
          <Quote className="w-10 h-10 absolute -top-1 -right-1 opacity-10" style={{ color: theme.accent }} />
          <div className="space-y-4 relative z-10">
            <div className="flex" style={{ color: theme.accent }}>
              {[...Array(starCount)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm font-serif text-slate-900 leading-relaxed italic">
              "{rev.comment}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: theme.borderTintSubtle }}>
            <div className="flex items-center gap-3">
              <img src={rev.avatarUrl} alt={rev.author} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-serif text-sm font-bold text-slate-900">{rev.author}</div>
                <div className="text-[10px] text-slate-500">{rev.role}</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400">{rev.date}</span>
          </div>
        </div>
      );
    }

    // DESIGN 4: DARK LUXURY
    if (cardDesign === 'dark_luxury') {
      return (
        <div
          key={rev.id || idx}
          className="bg-[#0F172A] text-white rounded-3xl p-7 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-400">
                {[...Array(starCount)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400">Google Review</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic">
              "{rev.comment}"
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
            <img src={rev.avatarUrl} alt={rev.author} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700" />
            <div>
              <div className="font-serif text-sm font-bold text-white">{rev.author}</div>
              <div className="text-[10px] text-slate-400">{rev.role}</div>
            </div>
          </div>
        </div>
      );
    }

    // DESIGN 5: CLINICAL TRUST (DEFAULT)
    return (
      <div
        key={rev.id || idx}
        className="bg-white rounded-3xl p-7 border shadow-xs space-y-5 flex flex-col justify-between"
        style={{ borderColor: theme.borderTint }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: theme.eyebrowBg, color: theme.eyebrowText }}
            >
              <CheckCircle2 className="w-3 h-3" />
              Verified Patient
            </span>
            <div className="flex" style={{ color: theme.accent }}>
              {[...Array(starCount)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic">
            "{rev.comment}"
          </p>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: theme.borderTintSubtle }}>
          <img src={rev.avatarUrl} alt={rev.author} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-serif text-sm font-bold text-slate-900">{rev.author}</div>
            <div className="text-[10px] text-slate-500">{rev.date} • {rev.role}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      className="py-24 sm:py-32 border-t transition-colors"
      style={{ backgroundColor: theme.surfaceTint, borderColor: theme.borderTint }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Header Split with Live Google Badge */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-xl">
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
              {badgeLabel}
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-[1.15]">
              {headline}
            </h2>
          </div>

          <div className="max-w-md space-y-3">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {subhead}
            </p>
            {/* Google Rating Trust Badge */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border shadow-2xs" style={{ borderColor: theme.borderTint }}>
                <span className="font-bold text-slate-900 text-sm font-mono">{ratingScore}</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {reviewCount}
              </span>
            </div>
          </div>
        </div>

        {/* LAYOUT 1: BENTO GRID */}
        {layout === 'bento_grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => renderReviewCard(rev, idx))}
          </div>
        )}

        {/* LAYOUT 2: THREE COLUMN CARDS */}
        {layout === 'three_col_cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.slice(0, 3).map((rev, idx) => renderReviewCard(rev, idx))}
          </div>
        )}

        {/* LAYOUT 3: HORIZONTAL MARQUEE */}
        {layout === 'horizontal_marquee' && (
          <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
            {reviews.map((rev, idx) => (
              <div key={idx} className="min-w-[320px] max-w-[360px] shrink-0 snap-start">
                {renderReviewCard(rev, idx)}
              </div>
            ))}
          </div>
        )}

        {/* LAYOUT 4: SPLIT SPOTLIGHT */}
        {layout === 'split_spotlight' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Big Spotlight Quote */}
            <div
              className="lg:col-span-6 bg-white rounded-3xl p-10 border shadow-md space-y-6 flex flex-col justify-between"
              style={{ borderColor: theme.borderTint }}
            >
              <div className="space-y-4">
                <Quote className="w-12 h-12" style={{ color: theme.accent }} />
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-slate-900 leading-snug">
                  "{reviews[0]?.comment}"
                </h3>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: theme.borderTint }}>
                <img src={reviews[0]?.avatarUrl} alt={reviews[0]?.author} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-serif text-base font-bold text-slate-900">{reviews[0]?.author}</div>
                  <div className="text-xs text-slate-500">{reviews[0]?.role}</div>
                </div>
              </div>
            </div>

            {/* Stack of remaining reviews */}
            <div className="lg:col-span-6 space-y-6">
              {reviews.slice(1, 3).map((rev, idx) => renderReviewCard(rev, idx + 1))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
