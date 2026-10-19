import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { Tenant } from '../../types';
import { getThemeTokens } from '../../utils/themeUtils';

interface StorefrontFaqProps {
  tenant: Tenant;
  pageId?: string;
  customData?: {
    headline?: string;
    subhead?: string;
    layout?: string;
    faqs?: Array<{ question: string; answer: string }>;
  };
}

const PAGE_FAQ_DEFAULTS: Record<string, { headline: string; subhead: string; faqs: Array<{ question: string; answer: string }> }> = {
  home: {
    headline: 'Frequently Asked Clinical Questions',
    subhead: 'Everything you need to know about priority reservations, clinical recovery times, and procedure deposits.',
    faqs: [
      {
        question: 'What is the required booking deposit and is it refundable?',
        answer: 'All consultations and procedures require a deposit ($50 to $100 depending on treatment) to secure physician room allocation. Deposits are 100% refundable or applicable to your procedure balance when cancelled or rescheduled at least 24 hours prior.'
      },
      {
        question: 'How many sessions of Morpheus8 RF are recommended for optimal results?',
        answer: 'Most clinical patients see noticeable remodeling after 1 session, with a standard protocol of 3 sessions spaced 4 to 6 weeks apart for maximal subdermal collagen contraction and deep elastin renewal.'
      },
      {
        question: 'Do you offer 0% APR patient financing?',
        answer: 'Yes, Aura partners with Cherry to provide instant 0% APR financing with terms of 3, 6, 12, or 24 months. Over 80% of applications are approved in under 60 seconds without affecting your credit score.'
      },
      {
        question: 'Are all procedures performed by board-certified physicians?',
        answer: 'Yes. All aesthetic injectables and radiofrequency energy protocols are overseen by Dr. Sarah Jenkins, MD, FACS, and performed by licensed, fellowship-trained clinicians under strict sterile protocols.'
      }
    ]
  },
  about: {
    headline: 'Quad-A Accreditation & Surgical Credentials FAQ',
    subhead: 'Learn more about our physician fellowships, operating suite certifications, and surgical standards.',
    faqs: [
      {
        question: 'What does Quad-A surgical suite accreditation mean for patients?',
        answer: 'Quad-A is the gold standard in surgical facility accreditation. It verifies that our Beverly Hills clinical suites meet or exceed hospital operating room sterility, emergency life support equipment, and peer-reviewed safety criteria.'
      },
      {
        question: 'What are Dr. Sarah Jenkins’ board certifications?',
        answer: 'Dr. Sarah Jenkins is double board-certified by the American Board of Facial Plastic and Reconstructive Surgery and the American Board of Otolaryngology–Head and Neck Surgery, with fellowship training at Johns Hopkins.'
      },
      {
        question: 'How does Aura approach natural, non-overdone aesthetic outcomes?',
        answer: 'We utilize 3D computer facial volumetric mapping before any needle touch. We focus on deep anatomical structural support rather than surface over-filling, ensuring your natural facial expressions remain unhindered.'
      },
      {
        question: 'Can I request an in-person surgical consultation before committing?',
        answer: 'Yes, comprehensive 45-minute physician consultations can be booked directly online or through our concierge desk. Your deposit applies directly toward any recommended surgical or non-surgical plan.'
      }
    ]
  },
  financing: {
    headline: 'Cherry 0% APR Financing & Payment Plan FAQ',
    subhead: 'Everything you need to know about instant soft-credit checks, approval limits, and monthly payments.',
    faqs: [
      {
        question: 'Will applying with Cherry impact my credit score?',
        answer: 'No. Cherry performs a soft credit check that does not impact your credit score or show up on credit inquiries. You receive an instant pre-approval decision in under 60 seconds.'
      },
      {
        question: 'What loan amounts and payment terms are available?',
        answer: 'Approvals range from $500 to $10,000 with flexible terms of 3, 6, 12, or 24 months. 0% APR options are available on qualified promotional plans.'
      },
      {
        question: 'Can I combine Cherry financing with promotional specials or credits?',
        answer: 'Yes! You can apply your $100 Fall Skincare Credit or banked VIP Pass funds to your procedure balance, and finance the remaining amount through Cherry 0% APR.'
      },
      {
        question: 'How do I pay my monthly installments with Cherry?',
        answer: 'Cherry provides a secure patient portal with autopay options via debit card or bank transfer. There are zero prepayment penalties if you choose to pay off your balance early.'
      }
    ]
  },
  memberships: {
    headline: 'VIP Concierge Pass & Membership Rules FAQ',
    subhead: 'Details regarding banked treatments, rollover policies, guest privileges, and cancellation terms.',
    faqs: [
      {
        question: 'What happens to my monthly banked treatment if I travel or skip a month?',
        answer: 'Banked treatments never expire. They accumulate in your patient wallet and can be redeemed at any time or converted toward higher-tier laser and surgical procedures.'
      },
      {
        question: 'Can I share or transfer my VIP perks to a family member or friend?',
        answer: 'Yes, Executive and Total Tox tier members receive 2 complimentary companion guest passes per year, allowing a friend to enjoy member rates on Botox and Hydrafacials.'
      },
      {
        question: 'Is there a long-term contract or cancellation penalty?',
        answer: 'No long-term lock-in. Memberships are month-to-month and can be paused or cancelled with 14 days written notice through your patient portal.'
      },
      {
        question: 'Does member pricing apply to retail dispensaries like SkinCeuticals?',
        answer: 'Yes, all active VIP members receive an automatic 10% to 15% discount on all medical-grade dispensary products in clinic or through our patient portal.'
      }
    ]
  },
  gallery: {
    headline: 'Clinical Outcomes & Documentation Standards FAQ',
    subhead: 'How we capture standardized clinical photography, patient privacy protocols, and expected timelines.',
    faqs: [
      {
        question: 'Are before-and-after photographs retouched or filtered in any way?',
        answer: 'Never. All clinical photographs are taken in our medical imaging room under calibrated polarized cross-lighting, standardized focal distances, and zero makeup or retouching.'
      },
      {
        question: 'When can I expect to see my full results after Morpheus8 or Sculptra?',
        answer: 'Immediate tightening is often visible within 7 to 10 days, while peak collagen and neocollagenesis occurs between weeks 6 and 12 post-treatment as your body rebuilds its subdermal scaffolding.'
      },
      {
        question: 'How long do results typically last?',
        answer: 'Morpheus8 results typically maintain for 12 to 18 months. Dermal fillers last 9 to 18 months depending on metabolic rate, and Botox maintains peak relaxation for 3 to 4 months.'
      }
    ]
  },
  contact: {
    headline: 'Beverly Hills Suite Arrival & Parking FAQ',
    subhead: 'Directions, private executive parking, discrete arrivals, and pre-consultation recommendations.',
    faqs: [
      {
        question: 'Where is the private patient parking located on Wilshire Boulevard?',
        answer: 'We provide complimentary executive valet parking directly at our building entrance. Simply pull in and inform the attendant you have an appointment with Aura Aesthetics.'
      },
      {
        question: 'Is there a discrete VIP entrance for privacy?',
        answer: 'Yes, our suite features an executive private elevator and discrete rear departure corridor for high-profile patients requiring complete privacy.'
      },
      {
        question: 'What should I avoid prior to my injectable or laser consultation?',
        answer: 'We recommend avoiding aspirin, ibuprofen, fish oil, and alcohol for 48 hours prior to reduce bruising risk. Please arrive with a clean face or arrive 10 minutes early to use our cleansing bar.'
      }
    ]
  }
};

export const StorefrontFaq: React.FC<StorefrontFaqProps> = ({
  tenant,
  pageId = 'home',
  customData
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const theme = getThemeTokens(tenant.branding.accentColor, tenant.branding.primaryColor);
  const config = tenant.branding.faqConfig || {};
  const pageDefault = PAGE_FAQ_DEFAULTS[pageId] || PAGE_FAQ_DEFAULTS.home;

  const layout = customData?.layout || config.layout || (config.variant === 'split_two_col' ? 'two_col_split' : 'single_col_accordion');
  const faqs = customData?.faqs || (config.faqs && config.faqs.length > 0 ? config.faqs : pageDefault.faqs);
  const headline = customData?.headline !== undefined ? customData.headline : (config.headline || pageDefault.headline);
  const subhead = customData?.subhead !== undefined ? customData.subhead : (config.subhead || pageDefault.subhead);

  return (
    <section
      className="py-20 sm:py-28 border-t transition-colors"
      style={{ backgroundColor: theme.surfaceTint, borderColor: theme.borderTint }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: theme.eyebrowBg,
              borderColor: theme.eyebrowBorder,
              borderWidth: '1px',
              color: theme.eyebrowText
            }}
          >
            <HelpCircle className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            Patient Information
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">{headline}</h2>
          <p className="text-xs sm:text-sm text-slate-600">{subhead}</p>
        </div>

        {/* LAYOUT 1: SINGLE COLUMN ACCORDION */}
        {layout === 'single_col_accordion' && (
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border shadow-xs overflow-hidden transition-all"
                  style={{ borderColor: theme.borderTint }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                  >
                    <span className="font-serif text-base sm:text-lg text-slate-900 font-medium">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      style={{ color: isOpen ? theme.accent : '#94A3B8' }}
                    />
                  </button>
                  {isOpen && (
                    <div
                      className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t animate-in fade-in duration-150"
                      style={{ borderColor: theme.borderTintSubtle }}
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* LAYOUT 2: TWO COLUMN SPLIT */}
        {layout === 'two_col_split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border p-5 shadow-xs space-y-2 h-fit"
                  style={{ borderColor: theme.borderTint }}
                >
                  <h3 className="font-serif text-base font-bold text-slate-900">{item.question}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* LAYOUT 3: BOXED CARDS GRID */}
        {layout === 'boxed_cards_grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border shadow-xs space-y-3"
                style={{ borderColor: theme.borderTint }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: theme.accent }}
                  >
                    Q
                  </div>
                  <h4 className="font-serif text-base font-bold text-slate-900">{item.question}</h4>
                </div>
                <p className="text-xs text-slate-600 pl-8 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
