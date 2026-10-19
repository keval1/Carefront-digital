import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Tenant } from '../../types';
import { getThemeTokens } from '../../utils/themeUtils';

interface StorefrontGalleryProps {
  tenant: Tenant;
  onOpenBooking: () => void;
  customData?: any;
}

export const StorefrontGallery: React.FC<StorefrontGalleryProps> = ({ tenant, onOpenBooking, customData }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const theme = getThemeTokens(tenant.branding.accentColor, tenant.branding.primaryColor);
  const config = customData || tenant.branding.galleryConfig || {};
  const layout = config.layout || (config.variant === 'comparison_slider' ? 'comparison_slider' : 'three_cases');

  const headline = config.headline || 'Clinical Outcomes & Patient Transformations';
  const subhead =
    config.subhead ||
    'Unretouched before-and-after results documented under standardized clinical lighting and 3D Canfield imaging.';

  const galleryItems = [
    {
      id: 'case-1',
      category: 'Morpheus8 RF',
      title: 'Submental RF Remodeling & Dermal Tightening',
      protocol: '3 sessions Morpheus8 at 4mm depth • Dr. Sarah Jenkins',
      beforeImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      afterImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      note: 'Significant reduction in submental fullness and enhanced jawline definition at 12 weeks.'
    },
    {
      id: 'case-2',
      category: 'Botox Cosmetic',
      title: 'Full Upper Face Neuromodulator Precision',
      protocol: '48 units Botox Cosmetic • Lateral brow lift technique',
      beforeImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      afterImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      note: 'Softened dynamic forehead rhytids while preserving authentic, expressive brow motility.'
    },
    {
      id: 'case-3',
      category: 'Contour & Filler',
      title: 'Mandibular Angle Volumization with Juvéderm Volux',
      protocol: '2 syringes Volux XC • Micro-cannula technique',
      beforeImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      afterImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      note: 'Crisp mandibular contour and balanced gonial angle projection.'
    }
  ];

  return (
    <section
      className="py-20 sm:py-28 border-t transition-colors"
      style={{ backgroundColor: theme.surfaceTint, borderColor: theme.borderTint }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            Verified Case Studies
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">{headline}</h2>
          <p className="text-xs sm:text-sm text-slate-600">{subhead}</p>
        </div>

        {/* LAYOUT 1: THREE CASES CARDS */}
        {layout === 'three_cases' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
                style={{ borderColor: theme.borderTint }}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden relative">
                    <div className="relative">
                      <img src={item.beforeImg} alt="Before" className="w-full h-40 object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-sm">
                        Before
                      </span>
                    </div>
                    <div className="relative">
                      <img src={item.afterImg} alt="After" className="w-full h-40 object-cover" />
                      <span className="absolute bottom-2 right-2 bg-emerald-700 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-sm">
                        After
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-base text-slate-900 font-semibold">{item.title}</h3>
                    <div className="text-[11px] font-mono mt-1 font-semibold" style={{ color: theme.accent }}>
                      {item.protocol}
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.note}</p>
                  </div>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-900 hover:text-white border rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                  style={{ borderColor: theme.borderTint }}
                >
                  <span>Reserve Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* LAYOUT 2: COMPARISON SLIDER SPOTLIGHT */}
        {layout === 'comparison_slider' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border shadow-lg space-y-6" style={{ borderColor: theme.borderTint }}>
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden select-none">
              {/* After image */}
              <img src={galleryItems[0].afterImg} alt="After treatment" className="absolute inset-0 w-full h-full object-cover" />
              {/* Before image overlay with clip-path */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img src={galleryItems[0].beforeImg} alt="Before treatment" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100%' }} />
              </div>
              {/* Divider bar */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-xs font-bold text-slate-800">
                  ↔
                </div>
              </div>
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Before
              </span>
              <span className="absolute top-4 right-4 bg-emerald-800/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                After (12 Wks)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">{galleryItems[0].title}</h3>
                <p className="text-xs text-slate-500">{galleryItems[0].protocol}</p>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="w-48 cursor-pointer"
              />
              <button
                onClick={onOpenBooking}
                className="px-6 py-2.5 text-white rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-90"
                style={{ backgroundColor: theme.accent }}
              >
                Book This Result
              </button>
            </div>
          </div>
        )}

        {/* LAYOUT 3: BENTO GALLERY */}
        {layout === 'bento_gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {galleryItems.slice(0, 2).map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-6 border shadow-xs space-y-4" style={{ borderColor: theme.borderTint }}>
                <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden h-48">
                  <img src={item.beforeImg} alt="Before" className="w-full h-full object-cover" />
                  <img src={item.afterImg} alt="After" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-serif text-lg font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
