import React from 'react';
import { ArrowUpRight, Zap, Heart, Clock, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';
import { Service, Tenant } from '../../types';
import { getThemeTokens } from '../../utils/themeUtils';

interface SignatureServicesProps {
  services: Service[];
  tenant?: Tenant;
  customData?: any;
  onSelectService: (service: Service) => void;
  onExploreAll?: () => void;
  onAddToCart?: (item: any) => void;
}

export const SignatureServices: React.FC<SignatureServicesProps> = ({
  services,
  tenant,
  customData,
  onSelectService,
  onExploreAll,
  onAddToCart
}) => {
  const theme = getThemeTokens(tenant?.branding.accentColor, tenant?.branding.primaryColor);
  const config = customData || tenant?.branding.servicesConfig || {};
  const showDeposits = config.showDeposits ?? true;
  const showFinancing = config.showFinancing ?? true;

  // Determine grid dimensions and capacity
  const layoutPreset = config.layoutPreset || (config.gridCols === 2 ? '2col_2row' : '3col_1row');
  let gridCols = 3;
  let capacity = 3;

  switch (layoutPreset) {
    case '2col_1row':
      gridCols = 2;
      capacity = 2;
      break;
    case '2col_2row':
      gridCols = 2;
      capacity = 4;
      break;
    case '3col_1row':
      gridCols = 3;
      capacity = 3;
      break;
    case '3col_2row':
      gridCols = 3;
      capacity = 6;
      break;
    case '4col_1row':
      gridCols = 4;
      capacity = 4;
      break;
    default:
      gridCols = config.gridCols || 3;
      capacity = (config.gridRows || 1) * gridCols;
  }

  // Populate cards for the exact capacity
  const cardsToRender: Service[] = [];
  const slotIds = config.slotServiceIds || [];
  const featuredIds = config.featuredServiceIds || [];

  for (let i = 0; i < capacity; i++) {
    let srv: Service | undefined;
    if (slotIds[i]) {
      srv = services.find((s) => s.id === slotIds[i]);
    } else if (featuredIds[i]) {
      srv = services.find((s) => s.id === featuredIds[i]);
    }
    if (!srv) {
      srv = services[i % services.length];
    }
    if (srv) {
      cardsToRender.push(srv);
    }
  }

  const headline = config.headline || 'Clinical Treatments Designed Around You';
  const subhead =
    config.subhead ||
    'Whether you’re addressing skin laxity, restoring facial harmony, or recharging cellular energy, our physician-directed protocols deliver measurable transformation.';

  return (
    <section
      className="py-24 sm:py-32 border-t transition-colors"
      style={{ backgroundColor: theme.surfaceTint, borderColor: theme.borderTint }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header Split */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            {/* Category Badge Pill */}
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
              style={{
                backgroundColor: theme.eyebrowBg,
                borderColor: theme.eyebrowBorder,
                borderWidth: '1px',
                color: theme.eyebrowText
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.pillDot }} />
              Signature Treatments
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-[1.15]">
              {headline}
            </h2>
          </div>

          <div className="max-w-md space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {subhead}
            </p>
            {onExploreAll && (
              <button
                onClick={onExploreAll}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border text-xs uppercase tracking-widest font-semibold text-slate-800 hover:bg-white transition-all cursor-pointer shadow-2xs"
                style={{ borderColor: theme.borderTint }}
              >
                <span>Explore Full Catalog</span>
                <ArrowUpRight className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Grid: cols and rows based on layoutPreset */}
        <div
          className={`grid grid-cols-1 ${
            gridCols === 2
              ? 'md:grid-cols-2'
              : gridCols === 4
              ? 'md:grid-cols-2 lg:grid-cols-4'
              : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-8`}
        >
          {cardsToRender.map((srv, idx) => {
            const depositDollars = srv.depositPriceCents / 100;
            const retailDollars = srv.retailPriceCents / 100;
            const monthlyCherry = Math.round(retailDollars / 12);

            // INDIVIDUAL CARD STYLE PRESET FOR THIS SPECIFIC CARD
            const cardStyle =
              config.slotCardStyles?.[idx] ||
              config.cardStyles?.[srv.id] ||
              config.cardStyle ||
              'glass';

            // STYLE 1: LUXURY GLASS
            if (cardStyle === 'glass') {
              return (
                <div
                  key={`${srv.id}-${idx}`}
                  className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                  style={{ borderColor: theme.borderTint }}
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center border"
                        style={{
                          backgroundColor: theme.surfaceTint,
                          borderColor: theme.borderTint,
                          color: theme.accent
                        }}
                      >
                        {idx % 2 === 0 ? <Zap className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                      </div>
                      {showDeposits && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ${depositDollars} Deposit
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl text-slate-900 font-medium leading-snug">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        {srv.description}
                      </p>
                    </div>

                    <div
                      className="flex items-center justify-between text-xs font-medium text-slate-600 pt-2 border-t"
                      style={{ borderColor: theme.borderTint }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                        <span>{srv.durationMinutes} min</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-base text-slate-900">
                          ${retailDollars.toLocaleString()}
                        </span>
                        {showFinancing && (
                          <div className="text-[10px] text-emerald-700 font-medium">
                            Cherry from ${monthlyCherry}/mo
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="h-36 rounded-2xl overflow-hidden relative">
                      <img
                        src={srv.imageUrl}
                        alt={srv.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <button
                      onClick={() => onSelectService(srv)}
                      className="w-full text-white py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:opacity-90"
                      style={{ backgroundColor: theme.accent }}
                    >
                      <span>Reserve Treatment</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            }

            // STYLE 2: MINIMALIST MODERN
            if (cardStyle === 'minimal') {
              return (
                <div
                  key={`${srv.id}-${idx}`}
                  className="bg-white rounded-2xl p-6 border shadow-2xs flex flex-col justify-between hover:shadow-md transition-all group"
                  style={{ borderColor: theme.borderTint }}
                >
                  <div className="space-y-4">
                    <div className="h-44 rounded-xl overflow-hidden">
                      <img
                        src={srv.imageUrl}
                        alt={srv.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>{srv.durationMinutes} mins • Physician Directed</span>
                        {showDeposits && (
                          <span className="text-emerald-700 font-semibold">${depositDollars} Deposit</span>
                        )}
                      </div>
                      <h3 className="font-sans font-bold text-lg text-slate-900">{srv.name}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{srv.description}</p>
                    </div>
                  </div>

                  <div
                    className="pt-4 border-t flex items-center justify-between mt-6"
                    style={{ borderColor: theme.borderTint }}
                  >
                    <div>
                      <div className="text-xs text-slate-400">Treatment Fee</div>
                      <div className="text-lg font-bold text-slate-900">${retailDollars.toLocaleString()}</div>
                    </div>
                    <button
                      onClick={() => onSelectService(srv)}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer shadow-xs hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: theme.accent }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              );
            }

            // STYLE 3: CLINICAL COMPACT
            if (cardStyle === 'compact') {
              return (
                <div
                  key={`${srv.id}-${idx}`}
                  className="bg-white rounded-2xl p-5 border shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
                  style={{ borderColor: theme.borderTint }}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={srv.imageUrl}
                      alt={srv.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                          {srv.category}
                        </span>
                        {showDeposits && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                            ${depositDollars} lock
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-base text-slate-900 font-semibold truncate mt-1">
                        {srv.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{srv.description}</p>
                    </div>
                  </div>

                  <div
                    className="mt-4 pt-3 border-t flex items-center justify-between"
                    style={{ borderColor: theme.borderTint }}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">${retailDollars.toLocaleString()}</div>
                      {showFinancing && (
                        <div className="text-[10px] text-emerald-700">Cherry ${monthlyCherry}/mo</div>
                      )}
                    </div>
                    <button
                      onClick={() => onSelectService(srv)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: theme.accent }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              );
            }

            // STYLE 4: BORDERED ACCENT
            if (cardStyle === 'bordered_accent') {
              return (
                <div
                  key={`${srv.id}-${idx}`}
                  className="bg-white rounded-3xl p-7 border-2 shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative group"
                  style={{ borderColor: theme.accent }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: theme.eyebrowBg, color: theme.eyebrowText }}
                      >
                        Priority Procedure
                      </span>
                      {showDeposits && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ${depositDollars} Deposit
                        </span>
                      )}
                    </div>
                    <div className="h-40 rounded-2xl overflow-hidden">
                      <img
                        src={srv.imageUrl}
                        alt={srv.name}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-slate-900">{srv.name}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{srv.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t mt-4 flex items-center justify-between" style={{ borderColor: theme.borderTint }}>
                    <div>
                      <div className="text-base font-bold text-slate-900">${retailDollars.toLocaleString()}</div>
                      {showFinancing && (
                        <div className="text-[10px] text-emerald-700">Cherry ~${monthlyCherry}/mo</div>
                      )}
                    </div>
                    <button
                      onClick={() => onSelectService(srv)}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white cursor-pointer shadow-xs hover:opacity-90"
                      style={{ backgroundColor: theme.accent }}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              );
            }

            // STYLE 5: EDITORIAL MAGAZINE (DEFAULT FALLBACK)
            return (
              <div
                key={`${srv.id}-${idx}`}
                className="rounded-3xl p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group min-h-[460px] text-white"
              >
                <img
                  src={srv.imageUrl}
                  alt={srv.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      Editorial Curated
                    </span>
                    {showDeposits && (
                      <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                        ${depositDollars} Deposit
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium leading-snug">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between text-xs text-white/90 pt-3 border-t border-white/20">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-white/80" />
                      <span>{srv.durationMinutes} min protocol</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-white">${retailDollars.toLocaleString()}</div>
                      {showFinancing && (
                        <div className="text-[10px] text-emerald-300">0% Cherry ${monthlyCherry}/mo</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectService(srv)}
                    className="w-full text-white py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all shadow-md cursor-pointer hover:opacity-90 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: theme.accent }}
                  >
                    <span>Reserve Procedure</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Dots */}
        <div className="flex justify-center items-center gap-2 pt-4">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accent }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.borderTint }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.borderTint }} />
        </div>
      </div>
    </section>
  );
};
