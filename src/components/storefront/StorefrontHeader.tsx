import React from 'react';
import { Sparkles, Phone, User, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Tenant } from '../../types';
import { getThemeTokens } from '../../utils/themeUtils';

interface StorefrontHeaderProps {
  tenant: Tenant;
  cartCount: number;
  onOpenCart: () => void;
  onOpenPortal: () => void;
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
  selectedElementId?: string;
  onSelectElement?: (id: string) => void;
  isEditMode?: boolean;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({
  tenant,
  cartCount,
  onOpenCart,
  onOpenPortal,
  onOpenBooking,
  onNavigate,
  activePage,
  selectedElementId,
  onSelectElement,
  isEditMode
}) => {
  const theme = getThemeTokens(tenant.branding.accentColor, tenant.branding.primaryColor);
  const location = tenant.branding.navbarLocation || 'Beverly Hills';
  const phone = tenant.branding.navbarPhone || '(310) 844-9120';
  const showPhone = tenant.branding.navbarShowPhone ?? true;
  const ctaText = tenant.branding.navbarCtaText || 'Book Consultation';
  const bannerBg = tenant.branding.bannerColor || theme.primary || '#1C1917';
  const accentColor = theme.accent;

  return (
    <header className="relative z-20 bg-white border-b transition-all" style={{ borderColor: theme.borderTint }}>
      {/* Top Ambient Announcement Strip */}
      <div
        onClick={(e) => {
          if (isEditMode && onSelectElement) {
            e.stopPropagation();
            onSelectElement('banner');
          }
        }}
        style={{ backgroundColor: bannerBg }}
        className={`text-[#FAF8F5] text-[11px] py-2 px-4 text-center border-b border-black/20 flex items-center justify-center gap-2 relative transition-all group ${
          isEditMode
            ? selectedElementId === 'banner'
              ? 'outline outline-2 outline-blue-600 ring-4 ring-blue-500/20 z-30 cursor-pointer'
              : 'hover:outline hover:outline-2 hover:outline-blue-500/80 cursor-pointer'
            : ''
        }`}
      >
        {isEditMode && (
          <div
            className={`absolute top-1 right-2 z-40 bg-blue-600 text-white text-[9px] font-sans px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity ${
              selectedElementId === 'banner' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            Announcement Banner
          </div>
        )}
        <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accent }} />
        <span className="font-medium tracking-wide">{tenant.branding.bannerText}</span>
        <button
          onClick={onOpenBooking}
          className="underline font-semibold ml-2 cursor-pointer hover:opacity-90"
          style={{ color: theme.accent }}
        >
          Lock Your Slot
        </button>
      </div>

      <div
        onClick={(e) => {
          if (isEditMode && onSelectElement) {
            e.stopPropagation();
            onSelectElement('navbar');
          }
        }}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative transition-all group ${
          isEditMode
            ? selectedElementId === 'navbar'
              ? 'outline outline-2 outline-blue-600 ring-4 ring-blue-500/20 z-30 cursor-pointer'
              : 'hover:outline hover:outline-2 hover:outline-blue-500/80 cursor-pointer'
            : ''
        }`}
      >
        {isEditMode && (
          <div
            className={`absolute top-2 right-4 z-40 bg-blue-600 text-white text-[9px] font-sans px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity ${
              selectedElementId === 'navbar' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            Practice Navigation Header
          </div>
        )}
        {/* Brand Logo & Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          {tenant.branding.logoUrl ? (
            <div className="flex items-center">
              <img
                src={tenant.branding.logoUrl}
                alt={tenant.name}
                className="h-10 w-auto max-h-12 max-w-[170px] object-contain group-hover:scale-102 transition-transform"
              />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
              style={{ backgroundColor: theme.primary }}
            >
              <span className="font-serif font-bold text-base tracking-widest">
                {tenant.name.charAt(0) || 'A'}
              </span>
            </div>
          )}
          <div>
            <div className="font-serif text-2xl font-normal tracking-tight text-slate-900 flex items-center gap-2">
              <span>{tenant.name}</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 block -mt-1 font-sans">
              {location}
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-medium text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            style={{
              color: activePage === 'home' ? theme.primary : undefined,
              borderBottomColor: activePage === 'home' ? theme.accent : 'transparent'
            }}
            className={`transition-colors py-1 cursor-pointer ${
              activePage === 'home' ? 'font-bold border-b-2' : 'hover:text-slate-900'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => onNavigate('treatments')}
            style={{
              color: activePage === 'treatments' ? theme.primary : undefined,
              borderBottomColor: activePage === 'treatments' ? theme.accent : 'transparent'
            }}
            className={`transition-colors py-1 cursor-pointer ${
              activePage === 'treatments' ? 'font-bold border-b-2' : 'hover:text-slate-900'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => onNavigate('memberships')}
            style={{
              color: activePage === 'memberships' ? theme.primary : undefined,
              borderBottomColor: activePage === 'memberships' ? theme.accent : 'transparent'
            }}
            className={`transition-colors py-1 cursor-pointer ${
              activePage === 'memberships' ? 'font-bold border-b-2' : 'hover:text-slate-900'
            }`}
          >
            Membership
          </button>
          <button
            onClick={() => onNavigate('financing')}
            style={{
              color: activePage === 'financing' ? theme.primary : undefined,
              borderBottomColor: activePage === 'financing' ? theme.accent : 'transparent'
            }}
            className={`transition-colors py-1 cursor-pointer ${
              activePage === 'financing' ? 'font-bold border-b-2' : 'hover:text-slate-900'
            }`}
          >
            0% Financing
          </button>
          <button
            onClick={() => onNavigate('contact')}
            style={{
              color: activePage === 'contact' ? theme.primary : undefined,
              borderBottomColor: activePage === 'contact' ? theme.accent : 'transparent'
            }}
            className={`transition-colors py-1 cursor-pointer ${
              activePage === 'contact' ? 'font-bold border-b-2' : 'hover:text-slate-900'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {showPhone && (
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium mr-2"
            >
              <Phone className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span>{phone}</span>
            </a>
          )}

          {/* Book Consultation Direct Button */}
          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: accentColor }}
          >
            <span>{ctaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* My Portal */}
          <button
            onClick={onOpenPortal}
            style={{ borderColor: theme.borderTint }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>My Portal</span>
          </button>

          {/* Cart Bag */}
          <button
            onClick={onOpenCart}
            style={{ borderColor: theme.borderTint }}
            className="relative w-9 h-9 rounded-full border bg-white flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span
                style={{ backgroundColor: theme.primary }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

