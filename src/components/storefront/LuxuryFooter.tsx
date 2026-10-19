import React from 'react';
import { Phone, Mail, MapPin, Instagram, Globe, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Tenant } from '../../types';
import { getThemeTokens } from '../../utils/themeUtils';

interface LuxuryFooterProps {
  tenant: Tenant;
  customData?: any;
}

export const LuxuryFooter: React.FC<LuxuryFooterProps> = ({ tenant, customData }) => {
  const theme = getThemeTokens(tenant.branding.accentColor, tenant.branding.primaryColor);
  const footer = customData || tenant.branding.footerConfig || {};
  const design = footer.design || footer.variant || 'dark_luxe';
  const layout = footer.layout || '5col_directory';

  const phone = footer.phone || '(310) 844-9120';
  const email = footer.email || 'concierge@auramedspa.com';
  const address = footer.address || '9601 Wilshire Blvd, Ste 420\nBeverly Hills, CA 90210';
  const hours = footer.hours || 'Mon–Fri: 9am–6pm • Sat: 10am–4pm';
  const copyright = footer.copyright || `© 2026 ${tenant.name}. All rights reserved.`;
  const disclaimer =
    footer.disclaimer ||
    'All clinical procedures performed under physician oversight. Individual clinical results may vary based on anatomical indications.';

  // Determine Colors
  let bg = '#110E0C';
  let text = '#FAF8F5';
  let subtext = '#A8A29E';
  let border = '#292524';

  if (design === 'alabaster_clean') {
    bg = '#FAF8F5';
    text = '#1C1917';
    subtext = '#78716C';
    border = '#EAE5DE';
  } else if (design === 'brand_tinted') {
    bg = theme.surfaceTint;
    text = '#1C1917';
    subtext = '#64748B';
    border = theme.borderTint;
  } else if (design === 'modern_slate') {
    bg = '#0F172A';
    text = '#F8FAFC';
    subtext = '#94A3B8';
    border = '#1E293B';
  }

  if (footer.bgColor) bg = footer.bgColor;
  if (footer.textColor) text = footer.textColor;

  const accentColor = footer.accentColor || theme.accent;

  interface FooterLink {
    label: string;
    href: string;
  }

  const defaultServiceLinks: FooterLink[] = [
    { label: 'Morpheus8 RF Dermal Lift', href: '#services' },
    { label: 'Lip Architecture & Contour', href: '#services' },
    { label: 'Medical Hydrafacial Elite', href: '#services' },
    { label: 'Botox Neuromodulators', href: '#services' },
    { label: 'Cellular NAD+ Infusions', href: '#services' }
  ];

  const defaultQuickLinks: FooterLink[] = [
    { label: 'About Our Physicians', href: '#team' },
    { label: 'VIP Passes & Memberships', href: '#memberships' },
    { label: '0% APR Cherry Financing', href: '#financing' },
    { label: 'Clinical Dispensary', href: '#dispensary' },
    { label: 'Patient Account Portal', href: '#portal' }
  ];

  const serviceLinks: FooterLink[] = footer.serviceLinks && footer.serviceLinks.length > 0 ? footer.serviceLinks : defaultServiceLinks;
  const quickLinks: FooterLink[] = footer.quickLinks && footer.quickLinks.length > 0 ? footer.quickLinks : defaultQuickLinks;

  return (
    <footer
      className="relative pt-24 pb-12 overflow-hidden border-t transition-colors"
      style={{ backgroundColor: bg, color: text, borderColor: border }}
    >
      {/* Background Watermark */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none select-none text-[8vw] font-serif font-extralight opacity-5 tracking-[0.2em] whitespace-nowrap z-0">
        {tenant.name.toUpperCase()}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* LAYOUT 1: 5-COLUMN DIRECTORY (DEFAULT) */}
        {layout === '5col_directory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column (Col Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                {tenant.branding.logoUrl ? (
                  <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-10 w-auto max-w-[160px] object-contain rounded" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xs font-serif font-bold text-base"
                    style={{ backgroundColor: accentColor }}
                  >
                    {tenant.name.charAt(0) || 'A'}
                  </div>
                )}
                <div>
                  <h3 className="font-serif text-2xl font-normal tracking-wide" style={{ color: text }}>
                    {tenant.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.25em] block font-sans" style={{ color: accentColor }}>
                    Beverly Hills Medical Suite
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed max-w-sm" style={{ color: subtext }}>
                Premium physician-led facial architecture, radiofrequency contouring, and regenerative skin therapies designed for subtle balance and cellular rejuvenation.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href={footer.instagramUrl || '#'}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ borderColor: border, color: subtext }}
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={footer.websiteUrl || '#'}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ borderColor: border, color: subtext }}
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 1: Services */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accentColor }}>
                Procedures
              </h4>
              <ul className="space-y-2.5 text-xs" style={{ color: subtext }}>
                {serviceLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="hover:opacity-100 transition-opacity" style={{ color: subtext }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accentColor }}>
                Patient Links
              </h4>
              <ul className="space-y-2.5 text-xs" style={{ color: subtext }}>
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="hover:opacity-100 transition-opacity" style={{ color: subtext }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accentColor }}>
                Contact & Suite
              </h4>
              <ul className="space-y-3 text-xs" style={{ color: subtext }}>
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span>{phone}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span>{email}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="whitespace-pre-line">{address}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span>{hours}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* LAYOUT 2: 4-COLUMN CLEAN */}
        {layout === '4col_clean' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold" style={{ color: text }}>{tenant.name}</h3>
              <p className="text-xs leading-relaxed" style={{ color: subtext }}>
                Anatomical precision and patient-first regenerative protocols delivered in Beverly Hills.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor }}>Treatments</h4>
              <ul className="space-y-2 text-xs" style={{ color: subtext }}>
                {serviceLinks.slice(0, 4).map((l, i) => (
                  <li key={i}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor }}>Patient Resources</h4>
              <ul className="space-y-2 text-xs" style={{ color: subtext }}>
                {quickLinks.slice(0, 4).map((l, i) => (
                  <li key={i}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor }}>Direct Contact</h4>
              <div className="text-xs space-y-1.5" style={{ color: subtext }}>
                <div>{phone}</div>
                <div>{email}</div>
                <div className="whitespace-pre-line">{address}</div>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 3: CENTERED LUXE */}
        {layout === 'centered_luxe' && (
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <div
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              {tenant.name.charAt(0) || 'A'}
            </div>
            <h3 className="font-serif text-3xl font-normal" style={{ color: text }}>{tenant.name}</h3>
            <p className="text-xs max-w-md mx-auto" style={{ color: subtext }}>
              {address.replace('\n', ' • ')} | {phone} | {email}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: subtext }}>
              {serviceLinks.map((l, i) => (
                <a key={i} href={l.href} className="hover:opacity-100">{l.label}</a>
              ))}
            </div>
          </div>
        )}

        {/* LAYOUT 4: SPLIT HOURS & CONTACT */}
        {layout === 'split_hours' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-serif text-2xl font-bold" style={{ color: text }}>{tenant.name}</h3>
              <p className="text-xs max-w-md leading-relaxed" style={{ color: subtext }}>{address.replace('\n', ', ')}</p>
              <div className="p-4 rounded-2xl border" style={{ borderColor: border, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="text-xs font-bold" style={{ color: accentColor }}>Operating Hours</div>
                <div className="text-xs mt-1" style={{ color: subtext }}>{hours}</div>
              </div>
            </div>
            <div className="lg:col-span-6 grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>Services</span>
                <ul className="text-xs space-y-1.5" style={{ color: subtext }}>
                  {serviceLinks.slice(0, 4).map((l, i) => <li key={i}><a href={l.href}>{l.label}</a></li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>Concierge</span>
                <ul className="text-xs space-y-1.5" style={{ color: subtext }}>
                  <li>{phone}</li>
                  <li>{email}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Medical Disclaimer */}
        <div className="pt-8 border-t text-[11px] leading-relaxed max-w-4xl" style={{ borderColor: border, color: subtext }}>
          <p>{disclaimer}</p>
        </div>

        {/* Bottom Legal & Powered by Carefront Watermark */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px]"
          style={{ borderColor: border, color: subtext }}
        >
          <div>
            {copyright} •{' '}
            <span className="font-medium" style={{ color: accentColor }}>
              Carefront Medical Commerce
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
            <a href="#" className="hover:opacity-100 transition-opacity">HIPAA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
