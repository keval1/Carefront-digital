import React from 'react';
import { Award, ShieldCheck, Calendar, ArrowUpRight } from 'lucide-react';
import { Provider, Tenant } from '../../types';
import { getThemeTokens } from '../../utils/themeUtils';

interface StorefrontTeamProps {
  tenant: Tenant;
  providers: Provider[];
  onOpenBooking: () => void;
  customData?: any;
}

export const StorefrontTeam: React.FC<StorefrontTeamProps> = ({ tenant, providers, onOpenBooking, customData }) => {
  const theme = getThemeTokens(tenant.branding.accentColor, tenant.branding.primaryColor);
  const config = customData || tenant.branding.teamConfig || {};
  const layout = config.layout || (config.variant === 'horizontal_roster' ? 'horizontal_roster' : 'three_cards');

  const headline = config.headline || 'Board-Certified Clinical Leadership';
  const subhead =
    config.subhead ||
    'Meet the fellowship-trained facial plastic surgeons and aesthetic clinicians directing your treatments.';
  const selectedIds = config.selectedProviderIds || [];
  const displayProviders =
    selectedIds.length > 0 ? providers.filter((p) => selectedIds.includes(p.id)) : providers;

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
            <Award className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            Physician Faculty
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">{headline}</h2>
          <p className="text-xs sm:text-sm text-slate-600">{subhead}</p>
        </div>

        {/* LAYOUT 1: THREE CARDS */}
        {layout === 'three_cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProviders.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
                style={{ borderColor: theme.borderTint }}
              >
                <div className="space-y-4">
                  <div className="aspect-4/3 rounded-2xl overflow-hidden relative bg-slate-100">
                    <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-800 flex items-center gap-1 border border-white/50">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{p.credentials}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-slate-900 font-bold">{p.name}</h3>
                    <div className="text-xs font-medium mt-0.5" style={{ color: theme.accent }}>
                      {p.title}
                    </div>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{p.bio}</p>
                  </div>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-900 hover:text-white border rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                  style={{ borderColor: theme.borderTint }}
                >
                  Book with {p.name.split(' ')[1] || p.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* LAYOUT 2: HORIZONTAL ROSTER */}
        {layout === 'horizontal_roster' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {displayProviders.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-sm transition-shadow"
                style={{ borderColor: theme.borderTint }}
              >
                <div className="flex items-center gap-4">
                  <img src={p.avatarUrl} alt={p.name} className="w-16 h-16 rounded-full object-cover border" style={{ borderColor: theme.borderTint }} />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900">{p.name}</h3>
                    <div className="text-xs" style={{ color: theme.accent }}>{p.title} • {p.credentials}</div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p.bio}</p>
                  </div>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-white uppercase tracking-wider shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: theme.accent }}
                >
                  Schedule
                </button>
              </div>
            ))}
          </div>
        )}

        {/* LAYOUT 3: BIO GRID */}
        {layout === 'bio_grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayProviders.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-8 border shadow-xs flex flex-col sm:flex-row gap-6 items-start"
                style={{ borderColor: theme.borderTint }}
              >
                <img src={p.avatarUrl} alt={p.name} className="w-28 h-28 rounded-2xl object-cover shrink-0 border" style={{ borderColor: theme.borderTint }} />
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-900">{p.name}</h3>
                    <span className="text-xs font-semibold" style={{ color: theme.accent }}>{p.credentials}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.bio}</p>
                  <button
                    onClick={onOpenBooking}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    style={{ color: theme.accent }}
                  >
                    <span>Direct Appointment</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
