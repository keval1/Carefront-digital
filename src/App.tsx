import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  RotateCw,
  Play,
  Pencil,
  Save,
  Search,
  Mail,
  Bell,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  User,
  X,
  Tag,
  Lock,
  Crown,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Upload,
  ExternalLink,
  Check,
  Sun,
  Palette,
  Globe,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tenant, Service, Provider, Appointment, Order, InboundLead, RecallLog, ReviewItem } from './types';
import {
  INITIAL_SERVICES,
  INITIAL_PROVIDERS,
  INITIAL_APPOINTMENTS,
  INITIAL_ORDERS,
  INITIAL_INBOUND_LEADS,
  INITIAL_RECALL_LOGS,
  INITIAL_REVIEWS
} from './db';
import { StorefrontHeader } from './components/storefront/StorefrontHeader';
import { StorefrontHero } from './components/storefront/StorefrontHero';
import { SignatureServices } from './components/storefront/SignatureServices';
import { CoreFeaturesSplit } from './components/storefront/CoreFeaturesSplit';
import { BentoReviews } from './components/storefront/BentoReviews';
import { StorefrontFaq } from './components/storefront/StorefrontFaq';
import { StorefrontTeam } from './components/storefront/StorefrontTeam';
import { StorefrontGallery } from './components/storefront/StorefrontGallery';
import { CherryFinancingSection } from './components/storefront/CherryFinancingSection';
import { LuxuryFooter } from './components/storefront/LuxuryFooter';
import { AiFrontDeskChatbot } from './components/storefront/AiFrontDeskChatbot';
import { MultiStepBookingWizard } from './components/booking/MultiStepBookingWizard';
import { FramerWebflowEditor, PageSectionItem } from './components/editor/FramerWebflowEditor';
import { PageSeoConfig } from './components/editor/PageSeoModal';
import { AuraOSDashboard } from './components/admin/AuraOSDashboard';
import { getThemeTokens } from './utils/themeUtils';
import { PromotionCode, INITIAL_PROMOTIONS } from './components/admin/DiscountsPromotionManager';
import { DoctorUser, DR_DEMO, DoctorAuthView } from './components/admin/DoctorSessionManager';

export default function App() {
  // Check initial URL: '/editor' -> visual editor, '/staged' or '/live' -> live demo storefront, else default to 'admin' dashboard (Main Page)
  const getInitialView = (): 'editor' | 'admin' | 'live-demo' => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/editor')) return 'editor';
      if (window.location.pathname.startsWith('/staged') || window.location.pathname.startsWith('/live') || window.location.pathname.startsWith('/aura')) {
        return 'live-demo';
      }
    }
    return 'admin';
  };

  // Main Workspace: Practice OS Dashboard is the default landing / main page
  const [currentView, setCurrentView] = useState<'editor' | 'admin' | 'live-demo'>(getInitialView);

  // Sync browser URL when switching between Dashboard (/), Visual Editor (/editor), and Staged Demo (/staged)
  const navigateToView = (view: 'editor' | 'admin' | 'live-demo') => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const targetPath = view === 'editor' ? '/editor' : view === 'live-demo' ? '/staged' : '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view }, '', targetPath);
      }
    }
  };

  // Listen to browser Back/Forward popstate buttons
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/editor')) {
        setCurrentView('editor');
      } else if (window.location.pathname.startsWith('/staged') || window.location.pathname.startsWith('/live') || window.location.pathname.startsWith('/aura')) {
        setCurrentView('live-demo');
      } else {
        setCurrentView('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Device Viewport Toggles: Desktop vs Tablet vs Mobile (Image 4)
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Preview Mode Toggle (Image 3)
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Brand Switcher Dropdown Open State (Image 2)
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);

  // Global Toast for Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Practice Promotions & Coupons (Synchronized across Dashboard & Checkout Modal)
  const [promotions, setPromotions] = useState<PromotionCode[]>(INITIAL_PROMOTIONS);

  // Active Doctor Session (Defaults to Dr. Demo: Dr. Sarah Jenkins, M.D.)
  const [currentDoctor, setCurrentDoctor] = useState<DoctorUser>(DR_DEMO);
  const [isDoctorAuthOpen, setIsDoctorAuthOpen] = useState(false);

  // Subpage navigation in storefront
  const [storefrontPage, setStorefrontPage] = useState<string>('home');

  // Active Tenant state for Aura MedSpa & Aesthetics
  const [tenant, setTenant] = useState<Tenant>({
    id: 'tenant-aura-1',
    name: 'Aura MedSpa & Aesthetics',
    slug: 'aura',
    customDomain: 'auramedspa.com',
    branding: {
      primaryColor: '#1C1917',
      accentColor: '#C28E75',
      fontFamily: 'Editorial Serif',
      themePreset: 'Warm Alabaster',
      heroHeadline: 'Feel Better. Move Freely. Live Pain-Free.',
      heroSubhead:
        'Personalized therapeutic medicine and radiofrequency contouring designed to reduce pain, relieve tension, and restore your natural cellular balance—delivered by board-certified physicians.',
      bannerText: '✨ Fall Clinical Special: $50 Deposit Locks Priority Physician Scheduling & $100 Skincare Credit'
    },
    emrProvider: 'aesthetic_record'
  });

  // Clinical Datasets State
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [providers] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inboundLeads, setInboundLeads] = useState<InboundLead[]>(INITIAL_INBOUND_LEADS);
  const [recallLogs] = useState<RecallLog[]>(INITIAL_RECALL_LOGS);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);

  // Booking Wizard Modal State
  const [isBookingWizardOpen, setIsBookingWizardOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service>(services[0]);

  // Cart Drawer State
  const [cart, setCart] = useState<
    Array<{ id: string; title: string; priceCents: number; quantity: number; type: string }>
  >([
    {
      id: 'c-1',
      title: 'Lipid Barrier Recovery Cream',
      priceCents: 8500,
      quantity: 1,
      type: 'retail_product'
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountCents: number } | null>(null);

  // Patient Portal Drawer State
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  // Simulated Missed-Call Loading State
  const [isSimulatingMissedCall, setIsSimulatingMissedCall] = useState(false);

  // History stack for branding (Undo / Redo support)
  const [brandingHistory, setBrandingHistory] = useState<any[]>([tenant.branding]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active Element Selection in Visual Editor Mode
  const [selectedElementId, setSelectedElementId] = useState<string>('hero');

  // Universal Default Sections for each Subpage (Fully customizable per page)
  const DEFAULT_PAGES_SECTIONS: Record<string, PageSectionItem[]> = {
    home: [
      { id: 'hero', label: 'Hero & Value Proposition', tag: 'Hero', enabled: true },
      { id: 'treatments', label: 'Signature Procedures Catalog', tag: 'Catalog', enabled: true },
      { id: 'features', label: 'Clinical Features Split', tag: 'Clinical', enabled: true },
      { id: 'cherry_financing', label: 'Cherry 0% APR Financing', tag: 'Financing', enabled: true },
      { id: 'reviews', label: 'Verified Reviews Grid', tag: 'Social Proof', enabled: true },
      { id: 'faq', label: 'Patient FAQ Accordion', tag: 'FAQ', enabled: true },
      { id: 'team', label: 'Clinical Medical Team', tag: 'Providers', enabled: false },
      { id: 'gallery', label: 'Before & After Clinical Gallery', tag: 'Results', enabled: false },
      { id: 'membership', label: 'VIP Concierge Membership Passes', tag: 'VIP Pass', enabled: false },
      { id: 'footer', label: 'Ambient Luxury Footer', tag: 'Footer', enabled: true }
    ],
    treatments: [
      { id: 'hero', label: 'Treatments Header Hero', tag: 'Hero', enabled: true },
      { id: 'treatments', label: 'Procedures Catalog Grid', tag: 'Catalog', enabled: true },
      { id: 'cherry_financing', label: 'Cherry 0% Financing Plans', tag: 'Financing', enabled: true },
      { id: 'faq', label: 'Procedure & Downtime FAQ', tag: 'FAQ', enabled: true },
      { id: 'reviews', label: 'Patient Ratings & Reviews', tag: 'Social Proof', enabled: true },
      { id: 'footer', label: 'Ambient Luxury Footer', tag: 'Footer', enabled: true }
    ],
    about: [
      { id: 'hero', label: 'Leadership & Practice Story Hero', tag: 'Hero', enabled: true },
      { id: 'team', label: 'Board-Certified Physicians & Clinicians', tag: 'Providers', enabled: true },
      { id: 'features', label: 'Quad-A Surgical Suite Standards', tag: 'Clinical', enabled: true },
      { id: 'reviews', label: 'Verified Patient Endorsements', tag: 'Social Proof', enabled: true },
      { id: 'faq', label: 'Medical Credentials FAQ', tag: 'FAQ', enabled: true },
      { id: 'footer', label: 'Ambient Luxury Footer', tag: 'Footer', enabled: true }
    ],
    financing: [
      { id: 'hero', label: 'Cherry 0% Financing Hero', tag: 'Hero', enabled: true },
      { id: 'cherry_financing', label: 'Cherry Monthly Estimator & Calculator', tag: 'Financing', enabled: true },
      { id: 'treatments', label: 'Eligible Cosmetic Procedures', tag: 'Catalog', enabled: true },
      { id: 'faq', label: 'Payment Plan & Soft Credit FAQ', tag: 'FAQ', enabled: true },
      { id: 'footer', label: 'Ambient Luxury Footer', tag: 'Footer', enabled: true }
    ],
    memberships: [
      { id: 'hero', label: 'VIP Concierge Pass Hero', tag: 'Hero', enabled: true },
      { id: 'membership', label: 'VIP Concierge Tier Packages', tag: 'VIP Pass', enabled: true },
      { id: 'features', label: 'Exclusive Clinical Perks & Priority', tag: 'Clinical', enabled: true },
      { id: 'faq', label: 'Membership Agreement & Rollover FAQ', tag: 'FAQ', enabled: true },
      { id: 'footer', label: 'Ambient Luxury Footer', tag: 'Footer', enabled: true }
    ],
    gallery: [
      { id: 'hero', label: 'Before & After Gallery Hero', tag: 'Hero', enabled: true },
      { id: 'gallery', label: 'Verified Clinical Transformations', tag: 'Results', enabled: true },
      { id: 'reviews', label: 'Patient Verified Testimonials', tag: 'Social Proof', enabled: true },
      { id: 'faq', label: 'Longevity & Healing Protocol FAQ', tag: 'FAQ', enabled: true },
      { id: 'footer', label: 'Ambient Luxury Footer', tag: 'Footer', enabled: true }
    ],
    contact: [
      { id: 'hero', label: 'Beverly Hills Suite & Hours Hero', tag: 'Hero', enabled: true },
      { id: 'features', label: 'Concierge Direct Booking & Parking', tag: 'Clinical', enabled: true },
      { id: 'faq', label: 'Arrival & Pre-Procedure FAQ', tag: 'FAQ', enabled: true },
      { id: 'footer', label: 'Ambient Luxury Footer', tag: 'Footer', enabled: true }
    ]
  };

  // Per-Page Sections Map State (Every page can add, reorder, and remove its own sections)
  const [pagesSectionsMap, setPagesSectionsMap] = useState<Record<string, PageSectionItem[]>>(DEFAULT_PAGES_SECTIONS);

  // Per-Page Custom Data Map (Allows independent hero headlines, subheads, and layouts per page)
  const [pageCustomDataMap, setPageCustomDataMap] = useState<
    Record<string, { headline?: string; subhead?: string; badge?: string; variant?: string; design?: string; features?: any; faq?: any; [key: string]: any }>
  >({
    home: {
      headline: 'Feel Better. Move Freely. Live Pain-Free.',
      subhead:
        'Personalized therapeutic medicine and radiofrequency contouring designed to reduce pain, relieve tension, and restore your natural cellular balance—delivered by board-certified physicians.',
      badge: 'Beverly Hills • Quad A Clinical Suite',
      variant: 'split_ambient'
    },
    treatments: {
      headline: 'Signature Clinical Procedures & Advanced RF',
      subhead:
        'Explore physician-administered neurotoxins, dermal architecture, and Morpheus8 RF tissue tightening protocols.',
      badge: 'Board-Certified Medical Team',
      variant: 'centered_luxury'
    },
    about: {
      headline: 'Quad-A Accredited Surgical Precision',
      subhead:
        'Founded by Dr. Sarah Jenkins, MD, Aura Aesthetics sets the gold standard for clinical excellence and natural facial harmony.',
      badge: 'Meet Our Medical Team',
      variant: 'split_ambient'
    },
    financing: {
      headline: '0% APR Cherry Medical Financing',
      subhead:
        'Instant soft credit approvals from $500 to $10,000. Up to 24-month payment plans with zero impact on your credit score.',
      badge: 'Flexible Healthcare Payments',
      variant: 'centered_luxury'
    },
    memberships: {
      headline: 'VIP Concierge Aesthetic Memberships',
      subhead:
        'Exclusive monthly banked treatments, preferred Botox rates ($11/unit), and priority physician scheduling.',
      badge: 'Aura VIP Concierge Club',
      variant: 'centered_luxury'
    },
    gallery: {
      headline: 'Clinical Transformations & Case Studies',
      subhead:
        'Real patient before-and-after results documented under standardized medical lighting and Quad-A protocol.',
      badge: 'Verified Patient Outcomes',
      variant: 'centered_luxury'
    },
    contact: {
      headline: 'Beverly Hills Suite & Private Consultations',
      subhead:
        'Located on Wilshire Boulevard with private valet parking and discrete executive entrances.',
      badge: 'Concierge Direct Access',
      variant: 'split_ambient'
    }
  });

  // Per-Page SEO & Metadata Configuration Map
  const [pageSeoMap, setPageSeoMap] = useState<Record<string, PageSeoConfig>>({
    home: {
      id: 'home',
      name: 'Home Page',
      slug: '/',
      titleTag: 'Aura Aesthetics | Luxury Med Spa & Regenerative Medicine',
      metaDescription: 'Beverly Hills premier medical spa offering Morpheus8, Botox, Hydrafacial MD, and regenerative aesthetic medicine.'
    },
    treatments: {
      id: 'treatments',
      name: 'Treatments Catalog',
      slug: '/services',
      titleTag: 'Clinical Procedures & Catalog | Aura Aesthetics',
      metaDescription: 'Explore our physician-led catalog of aesthetic procedures, neurotoxins, body contouring, and skin rejuvenation.'
    },
    about: {
      id: 'about',
      name: 'About & Leadership',
      slug: '/about',
      titleTag: 'Board-Certified Clinical Team | Aura Aesthetics',
      metaDescription: 'Meet our fellowship-trained plastic surgeons and master aesthetic injectors in Beverly Hills.'
    },
    financing: {
      id: 'financing',
      name: '0% Cherry Financing',
      slug: '/financing',
      titleTag: '0% APR Patient Financing with Cherry | Aura Aesthetics',
      metaDescription: 'Flexible 3 to 24 month aesthetic financing options with 0% APR and instant pre-approval.'
    },
    memberships: {
      id: 'memberships',
      name: 'VIP Concierge Passes',
      slug: '/memberships',
      titleTag: 'Aura VIP Concierge Passes & Monthly Credits | Aura Aesthetics',
      metaDescription: 'Monthly banked medical spa treatments, priority booking, and member-exclusive injectable pricing.'
    },
    gallery: {
      id: 'gallery',
      name: 'Before & After Gallery',
      slug: '/gallery',
      titleTag: 'Patient Clinical Outcomes & Transformations | Aura Aesthetics',
      metaDescription: 'Real unretouched before-and-after results documented under standardized medical lighting and Quad-A protocol.'
    },
    contact: {
      id: 'contact',
      name: 'Contact & Booking',
      slug: '/contact',
      titleTag: 'Schedule Private Aesthetic Consultation | Aura Aesthetics',
      metaDescription: 'Reserve your 1-on-1 diagnostic consultation and computerized 3D facial analysis session.'
    }
  });

  const handleUpdatePageSeo = (pageId: string, updated: PageSeoConfig) => {
    setPageSeoMap((prev) => ({
      ...prev,
      [pageId]: updated
    }));
    showToast(`Saved SEO settings for "${updated.name}"`);
  };

  // Active page's current sections
  const currentActiveSections = pagesSectionsMap[storefrontPage] || DEFAULT_PAGES_SECTIONS[storefrontPage] || DEFAULT_PAGES_SECTIONS.home;

  const handleUpdatePageSections = (pageId: string, updatedSections: PageSectionItem[]) => {
    setPagesSectionsMap((prev) => ({
      ...prev,
      [pageId]: updatedSections
    }));
  };

  // Publish dropdown menu state & white branding toggle
  const [isPublishDropdownOpen, setIsPublishDropdownOpen] = useState(false);
  const [isWhiteBrandingEnabled, setIsWhiteBrandingEnabled] = useState(false);

  // Synchronize Universal Brand Colors across Storefront and Dashboard
  React.useEffect(() => {
    const accent = tenant.branding.accentColor || '#2563EB';
    const primary = tenant.branding.primaryColor || '#064E3B';
    document.documentElement.style.setProperty('--brand-accent', accent);
    document.documentElement.style.setProperty('--brand-primary', primary);
    document.documentElement.style.setProperty('--brand-accent-hover', `${accent}e6`);
    document.documentElement.style.setProperty('--brand-primary-hover', `${primary}e6`);
  }, [tenant.branding.accentColor, tenant.branding.primaryColor]);

  const showToast = (msg: string) => {
    setTimeout(() => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
    }, 0);
  };

  const handleUpdateTenantBranding = (updatedBranding: any) => {
    setTenant((prev) => ({ ...prev, branding: updatedBranding }));
    setBrandingHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, updatedBranding];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUpdatePageCustomData = (pageId: string, data: any) => {
    setPageCustomDataMap((prev) => ({
      ...prev,
      [pageId]: {
        ...(prev[pageId] || {}),
        ...data
      }
    }));
  };

  // Smooth scroll to section in canvas when editing
  useEffect(() => {
    if (selectedElementId) {
      const timer = setTimeout(() => {
        const el =
          document.getElementById(`canvas-section-${selectedElementId}`) ||
          document.querySelector(`[data-section-id="${selectedElementId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [selectedElementId]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setTenant((prev) => ({ ...prev, branding: brandingHistory[nextIdx] }));
      showToast('↶ Undone last design edit');
    }
  };

  const handleRedo = () => {
    if (historyIndex < brandingHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setTenant((prev) => ({ ...prev, branding: brandingHistory[nextIdx] }));
      showToast('↷ Redone design edit');
    }
  };

  // Add Item to Cart
  const handleAddToCart = (item: { id: string; title: string; priceCents: number; type: string }) => {
    setCart((prev) => {
      const exist = prev.find((x) => x.id === item.id);
      if (exist) {
        return prev.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Promo Code Application
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCodeInput.trim().toUpperCase() === 'FALLGLOW') {
      setAppliedPromo({ code: 'FALLGLOW', discountCents: 2500 });
      setPromoCodeInput('');
    } else {
      alert('Invalid promo code. Try "FALLGLOW" for $25 off.');
    }
  };

  // 14-Second Missed Call Recovery Trigger
  const handleSimulateMissedCall = () => {
    setIsSimulatingMissedCall(true);

    setTimeout(() => {
      const newLead: InboundLead = {
        id: `lead-${Date.now()}`,
        tenantId: tenant.id,
        phone: '(310) 902-8814',
        patientName: 'Lauren Sterling',
        channel: 'sms_missed_call',
        intentScore: 98,
        intentTag: 'Missed-Call Recovery',
        status: 'converted',
        depositSecured: true,
        transcript: [
          {
            sender: 'ai',
            text: `📞 [Automated Outbound SMS • 14s after missed call at 8:15 PM]: Hi! We missed your call at Aura MedSpa. Dr. Jenkins' clinical team is closed for the evening, but I can help you check pricing or reserve an opening right now. What can we help you with?`,
            timestamp: '8:15 PM'
          },
          {
            sender: 'patient',
            text: 'Hi! Looking for a Morpheus8 consult this Thursday with Dr. Jenkins?',
            timestamp: '8:16 PM'
          },
          {
            sender: 'ai',
            text: `We have Thursday at 2:30 PM open with Dr. Jenkins! A $100 deposit locks your slot and applies 100% toward your procedure. Should I lock 2:30 PM for you?`,
            timestamp: '8:16 PM'
          },
          {
            sender: 'patient',
            text: 'Yes please, locking now!',
            timestamp: '8:17 PM'
          },
          {
            sender: 'ai',
            text: '🎉 Slot locked! Synced to Aesthetic Record (Chart #AR-9481). See you Thursday!',
            timestamp: '8:17 PM'
          }
        ],
        createdAt: 'Just now'
      };

      const newCalApt: Appointment = {
        id: `apt-missed-${Date.now()}`,
        tenantId: tenant.id,
        patientId: 'pat-lauren',
        patientName: 'Lauren Sterling',
        patientPhone: '(310) 902-8814',
        providerId: providers[0].id,
        providerName: providers[0].name,
        serviceId: services[0].id,
        serviceName: services[0].name,
        startTime: '2026-10-15T14:30:00Z',
        endTime: '2026-10-15T15:30:00Z',
        status: 'confirmed',
        depositAmountCents: 10000,
        emrSyncStatus: 'synced',
        emrAppointmentId: 'AR-9481',
        isMissedCallRecovered: true
      };

      setInboundLeads((prev) => [newLead, ...prev]);
      setAppointments((prev) => [newCalApt, ...prev]);
      setIsSimulatingMissedCall(false);
    }, 1000);
  };

  // Booking Confirmation Handler
  const handleBookingConfirmed = (data: any) => {
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      tenantId: tenant.id,
      patientId: `pat-${Date.now()}`,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      providerId: data.provider.id,
      providerName: data.provider.name,
      serviceId: data.service.id,
      serviceName: data.service.name,
      startTime: '2026-10-15T09:30:00Z',
      endTime: '2026-10-15T10:30:00Z',
      status: 'confirmed',
      depositAmountCents: data.depositAmountCents,
      emrSyncStatus: 'synced',
      emrAppointmentId: `AR-${Math.floor(1000 + Math.random() * 9000)}`
    };

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      tenantId: tenant.id,
      patientId: newApt.patientId,
      patientName: data.patientName,
      appointmentId: newApt.id,
      subtotalCents: data.service.retailPriceCents,
      depositCents: data.depositAmountCents,
      gratuityCents: 0,
      totalDueTodayCents: data.depositAmountCents,
      paymentMethod: data.paymentMethod,
      status: 'succeeded',
      lineItems: [
        {
          title: `${data.service.name} Booking Deposit`,
          type: 'service_deposit',
          priceCents: data.depositAmountCents,
          quantity: 1
        }
      ],
      emrSyncStatus: 'synced',
      createdAt: 'Just now'
    };

    setAppointments((prev) => [newApt, ...prev]);
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Cart financial totals
  const cartSubtotalCents = cart.reduce((acc, i) => acc + i.priceCents * i.quantity, 0);
  const discountCents = appliedPromo ? appliedPromo.discountCents : 0;
  const finalCartDueCents = Math.max(0, cartSubtotalCents - discountCents);

  // Render Storefront Landing Sections
  const renderStorefrontContent = () => {
    const isEdit = currentView === 'editor' && !isPreviewMode;
    const theme = getThemeTokens(tenant.branding.accentColor, tenant.branding.primaryColor);

    const wrapEditBox = (id: string, name: string, content: React.ReactNode) => {
      const isSelected = selectedElementId === id;
      if (!isEdit) {
        return (
          <div id={`canvas-section-${id}`} data-section-id={id}>
            {content}
          </div>
        );
      }
      return (
        <div
          id={`canvas-section-${id}`}
          data-section-id={id}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElementId(id);
          }}
          className={`relative group transition-all cursor-pointer ${
            isSelected
              ? 'outline outline-2 outline-blue-600 ring-4 ring-blue-500/20 z-20'
              : 'hover:outline hover:outline-2 hover:outline-blue-500/80 hover:ring-2 hover:ring-blue-500/10'
          }`}
        >
          <div
            className={`absolute top-2 right-4 z-40 px-2 py-0.5 rounded text-[10px] font-sans font-medium transition-all pointer-events-none shadow-sm ${
              isSelected
                ? 'bg-blue-600 text-white opacity-100'
                : 'bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 backdrop-blur-xs'
            }`}
          >
            {name}
          </div>
          {content}
        </div>
      );
    };

    let headingFont = '"Cormorant Garamond", "Playfair Display", Georgia, serif';
    let bodyFont = '"Inter", "Plus Jakarta Sans", sans-serif';
    let letterSpacing = 'normal';

    if (tenant.branding.fontFamily === 'Geometric Sans' || tenant.branding.fontFamily === 'Modern Sans') {
      headingFont = '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
      bodyFont = '"Inter", system-ui, sans-serif';
      letterSpacing = '-0.02em';
    } else if (tenant.branding.fontFamily === 'Luxury Grotesk') {
      headingFont = '"Syne", "Plus Jakarta Sans", sans-serif';
      bodyFont = '"Outfit", "Inter", sans-serif';
      letterSpacing = '-0.03em';
    } else if (tenant.branding.fontFamily === 'Classical Roman') {
      headingFont = '"Cinzel", Georgia, serif';
      bodyFont = '"Outfit", "Inter", sans-serif';
      letterSpacing = '0.04em';
    } else {
      // Editorial Serif
      headingFont = '"Cormorant Garamond", "Playfair Display", Georgia, serif';
      bodyFont = '"Inter", sans-serif';
      letterSpacing = '-0.01em';
    }

    if (tenant.branding.fontTracking === 'tight') {
      letterSpacing = '-0.03em';
    } else if (tenant.branding.fontTracking === 'wide') {
      letterSpacing = '0.05em';
    }

    const scaleClass =
      tenant.branding.fontScale === 'compact'
        ? 'text-[95%]'
        : tenant.branding.fontScale === 'spacious'
        ? 'text-[105%]'
        : 'text-[100%]';

    return (
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-white">
        {/* Scrollable Practice Page Website Canvas with Real-Time Typography Tokens */}
        <div
          className={`storefront-canvas flex-1 w-full overflow-y-auto ${scaleClass}`}
          style={{
            ['--storefront-heading-font' as any]: headingFont,
            ['--storefront-body-font' as any]: bodyFont,
            ['--storefront-tracking' as any]: letterSpacing,
            letterSpacing
          }}
          id="practice-page-scroll"
        >
          <StorefrontHeader
            tenant={tenant}
            cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenPortal={() => setIsPortalOpen(true)}
            onOpenBooking={() => {
              setSelectedServiceForBooking(services[0]);
              setIsBookingWizardOpen(true);
            }}
            onNavigate={(page) => setStorefrontPage(page)}
            activePage={storefrontPage}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            isEditMode={isEdit}
          />

          {/* Dynamic Page Sections according to active page with Framer Motion Page Transition */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={storefrontPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="w-full"
              >
                {currentActiveSections.filter((s) => s.id !== 'footer').map((sec) => {
                  if (!sec.enabled) return null;
                  if (sec.id === 'hero') {
                    return (
                      <React.Fragment key={`${storefrontPage}-${sec.id}`}>
                        {wrapEditBox('hero', sec.label, (
                          <StorefrontHero
                            pageId={storefrontPage}
                            tenant={tenant}
                            customData={pageCustomDataMap[storefrontPage]}
                            onOpenBooking={() => {
                              setSelectedServiceForBooking(services[0]);
                              setIsBookingWizardOpen(true);
                            }}
                            onExploreTreatments={() => setStorefrontPage('treatments')}
                          />
                        ))}
                      </React.Fragment>
                    );
                  }
                    if (sec.id === 'treatments') {
                    return (
                      <React.Fragment key={`${storefrontPage}-${sec.id}`}>
                        {wrapEditBox('treatments', sec.label, (
                          <SignatureServices
                            services={services}
                            tenant={tenant}
                            customData={pageCustomDataMap[storefrontPage]?.treatments}
                            onSelectService={(srv) => {
                              setSelectedServiceForBooking(srv);
                              setIsBookingWizardOpen(true);
                            }}
                            onExploreAll={() => setStorefrontPage('treatments')}
                            onAddToCart={(item) => handleAddToCart(item)}
                          />
                        ))}
                      </React.Fragment>
                    );
                  }
                  if (sec.id === 'features') {
                    return (
                      <React.Fragment key={`${storefrontPage}-${sec.id}`}>
                        {wrapEditBox('features', sec.label, (
                          <CoreFeaturesSplit
                            tenant={tenant}
                            pageId={storefrontPage}
                            customData={pageCustomDataMap[storefrontPage]?.features}
                            onOpenBooking={() => {
                              setSelectedServiceForBooking(services[0]);
                              setIsBookingWizardOpen(true);
                            }}
                          />
                        ))}
                      </React.Fragment>
                    );
                  }
                  if (sec.id === 'cherry_financing') {
                    return (
                      <React.Fragment key={`${storefrontPage}-${sec.id}`}>
                        {wrapEditBox('cherry_financing', sec.label, (
                          <CherryFinancingSection
                            tenant={tenant}
                            customData={pageCustomDataMap[storefrontPage]?.financing}
                            onOpenBooking={() => {
                              setSelectedServiceForBooking(services[0]);
                              setIsBookingWizardOpen(true);
                            }}
                          />
                        ))}
                      </React.Fragment>
                    );
                  }
                  if (sec.id === 'reviews') {
                    return (
                      <React.Fragment key={`${storefrontPage}-${sec.id}`}>
                        {wrapEditBox('reviews', sec.label, (
                          <BentoReviews
                            reviews={reviews}
                            tenant={tenant}
                            customData={pageCustomDataMap[storefrontPage]?.reviews}
                          />
                        ))}
                      </React.Fragment>
                    );
                  }
                  if (sec.id === 'faq') {
                    return (
                      <React.Fragment key={`${storefrontPage}-${sec.id}`}>
                        {wrapEditBox('faq', sec.label, (
                          <StorefrontFaq
                            tenant={tenant}
                            pageId={storefrontPage}
                            customData={pageCustomDataMap[storefrontPage]?.faq}
                          />
                        ))}
                      </React.Fragment>
                    );
                  }
                  if (sec.id === 'team') {
                    return (
                      <React.Fragment key={`${storefrontPage}-${sec.id}`}>
                        {wrapEditBox('team', sec.label, (
                          <StorefrontTeam
                            tenant={tenant}
                            providers={providers}
                            customData={pageCustomDataMap[storefrontPage]?.team}
                            onOpenBooking={() => {
                              setSelectedServiceForBooking(services[0]);
                              setIsBookingWizardOpen(true);
                            }}
                          />
                        ))}
                      </React.Fragment>
                    );
                  }
                  if (sec.id === 'gallery') {
                    return (
                      <React.Fragment key={`${storefrontPage}-${sec.id}`}>
                        {wrapEditBox('gallery', sec.label, (
                          <StorefrontGallery
                            tenant={tenant}
                            customData={pageCustomDataMap[storefrontPage]?.gallery}
                            onOpenBooking={() => {
                              setSelectedServiceForBooking(services[0]);
                              setIsBookingWizardOpen(true);
                            }}
                          />
                        ))}
                      </React.Fragment>
                    );
                  }
                  if (sec.id === 'membership') {
                    const currentMembership = pageCustomDataMap[storefrontPage]?.membership || tenant.branding.membershipConfig || {};
                    return (
                      <React.Fragment key={`${storefrontPage}-${sec.id}`}>
                        {wrapEditBox('membership', sec.label, (
                          <section
                            className="py-20 sm:py-28 border-t transition-colors"
                            style={{ backgroundColor: theme.surfaceTint, borderColor: theme.borderTint }}
                          >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                              <div className="text-center max-w-2xl mx-auto space-y-3">
                                <span
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
                                  style={{
                                    backgroundColor: theme.eyebrowBg,
                                    borderColor: theme.eyebrowBorder,
                                    borderWidth: '1px',
                                    color: theme.eyebrowText
                                  }}
                                >
                                  👑 VIP Concierge Club
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">
                                  {currentMembership.headline || 'Aura VIP Membership Passes'}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600">
                                  {currentMembership.subhead ||
                                    'Monthly banked treatments, preferred Botox rates ($11/unit), and 10% dispensary savings.'}
                                </p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                  {
                                    title: 'Glow VIP Club',
                                    price: '$149',
                                    perks: [
                                      '1 Monthly Platinum Hydrafacial MD',
                                      'Member-only Botox ($11/unit)',
                                      '10% off clinical dispensary'
                                    ]
                                  },
                                  {
                                    title: 'Total Tox & Sculpt Pass',
                                    price: '$299',
                                    perks: [
                                      'Quarterly 40-unit Botox refresh',
                                      '15% off Morpheus8 treatments',
                                      'Priority weekend booking'
                                    ]
                                  },
                                  {
                                    title: 'Executive Longevity Tier',
                                    price: '$499',
                                    perks: [
                                      'Monthly NAD+ 500mg infusion',
                                      'Quarterly RF skin tightening',
                                      'Physician concierge oversight'
                                    ]
                                  }
                                ].map((tier, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-white rounded-3xl p-8 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow border"
                                    style={{ borderColor: theme.borderTint }}
                                  >
                                    <div>
                                      <h3 className="font-serif text-2xl text-slate-900">{tier.title}</h3>
                                      <div className="text-3xl font-bold font-sans mt-2 text-slate-900">
                                        {tier.price}{' '}
                                        <span className="text-xs text-slate-400 font-normal">/ month</span>
                                      </div>
                                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                                        {tier.perks.map((p, i) => (
                                          <li key={i} className="flex items-center gap-2">
                                            <span className="font-bold" style={{ color: theme.accent }}>✓</span> {p}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleAddToCart({
                                          id: `mem-${idx}`,
                                          title: tier.title,
                                          priceCents: parseInt(tier.price.replace('$', '')) * 100,
                                          type: 'membership'
                                        })
                                      }
                                      className="w-full text-white py-3 rounded-full text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all hover:opacity-90 shadow-xs"
                                      style={{ backgroundColor: theme.accent }}
                                    >
                                      Join Pass
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </section>
                        ))}
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* 1. Footers scoped to practice page */}
          {currentActiveSections.find((s) => s.id === 'footer')?.enabled !== false &&
            wrapEditBox('footer', 'Luxury Ambient Footer', (
              <LuxuryFooter tenant={tenant} customData={pageCustomDataMap[storefrontPage]?.footer} />
            ))}
        </div>

        {/* 2. 24/7 AI Front Desk Concierge Chatbot (Anchored to Bottom-Right of Practice Page) */}
        {tenant.branding.widgets?.aiFrontDesk !== false && (
          <AiFrontDeskChatbot
            tenant={tenant}
            services={services}
            onOpenBooking={(srv) => {
              if (srv) setSelectedServiceForBooking(srv);
              setIsBookingWizardOpen(true);
            }}
            onOpenFinancing={() => setStorefrontPage('financing')}
          />
        )}

        {/* 3. Multi-Step Progressive Booking Wizard Modal */}
        <AnimatePresence>
          {isBookingWizardOpen && (
            <MultiStepBookingWizard
              isOpen={isBookingWizardOpen}
              onClose={() => setIsBookingWizardOpen(false)}
              services={services}
              providers={providers}
              initialService={selectedServiceForBooking}
              onBookingConfirmed={handleBookingConfirmed}
              promotions={promotions}
            />
          )}
        </AnimatePresence>

        {/* 4. Slide-Over Cart Drawer (Smooth Framer Motion) */}
        <AnimatePresence>
          {isCartOpen && (
            <div className="absolute inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
              <motion.div
                initial={{ opacity: 0, x: 320 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 320 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto text-xs text-slate-800"
              >
                <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-stone-900" />
                    <h3 className="font-serif text-lg text-stone-900">Treatment & Dispensary Bag</h3>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 flex-1 overflow-y-auto divide-y divide-stone-100">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-4 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-stone-900">{item.title}</div>
                        <div className="text-stone-500 text-[11px]">Qty: {item.quantity}</div>
                      </div>
                      <span className="font-bold text-stone-900">${(item.priceCents / 100).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
                  {/* Promo Code Input */}
                  <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-2">
                    <span className="font-semibold text-stone-800 block text-[11px]">Have a Promo Code?</span>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 p-2 rounded-xl font-bold">
                        <span>🏷️ Promo {appliedPromo.code} (-${appliedPromo.discountCents / 100}.00)</span>
                        <button onClick={() => setAppliedPromo(null)} className="text-[10px] text-rose-600 underline cursor-pointer">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="flex gap-2">
                        <input
                          type="text"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          placeholder="Enter Promo (try FALLGLOW)"
                          className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 uppercase focus:outline-none"
                        />
                        <button type="submit" className="bg-stone-900 text-white px-3 py-1.5 rounded-xl font-semibold cursor-pointer">
                          Apply
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total Due Today:</span>
                    <span className="font-mono text-base text-emerald-700">${(finalCartDueCents / 100).toLocaleString()}.00</span>
                  </div>

                  <button
                    onClick={() => {
                      showToast(`Checkout completed for $${(finalCartDueCents / 100).toLocaleString()}.00! Pushed to Aesthetic Record ledger.`);
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-[#1C1917] hover:bg-stone-800 text-white rounded-full py-3.5 text-xs uppercase tracking-widest font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Proceed to Secure Checkout • ${(finalCartDueCents / 100).toLocaleString()}.00 Due</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 5. Patient Portal Drawer (Smooth Framer Motion) */}
        <AnimatePresence>
          {isPortalOpen && (
            <div className="absolute inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
              <motion.div
                initial={{ opacity: 0, x: 320 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 320 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto text-xs text-slate-800"
              >
                <div className="p-6 bg-[#1C1917] text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C28E75] flex items-center justify-center text-white font-bold text-sm">
                      CV
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-medium text-white">Camilla Vance</h3>
                      <div className="text-[10px] text-[#D4A373]">Active VIP Member • Chart #AR-4891</div>
                    </div>
                  </div>
                  <button onClick={() => setIsPortalOpen(false)} className="text-stone-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                  <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-stone-900">Upcoming Visit</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Deposit Paid $100.00
                      </span>
                    </div>
                    <div className="font-serif text-base text-stone-900">Morpheus8 RF Dermal Lift</div>
                    <div className="text-stone-500 text-[11px]">Thursday, Oct 15 at 09:30 AM with Dr. Sarah Jenkins</div>
                  </div>

                  <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-1">
                    <div className="font-bold text-stone-900">HIPAA Intake Status</div>
                    <p className="text-stone-500 text-[11px]">Verified and synced directly to Aesthetic Record.</p>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-200">
                  <button onClick={() => setIsPortalOpen(false)} className="w-full bg-[#1C1917] text-white py-2.5 rounded-xl font-bold cursor-pointer">
                    Close Portal
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col text-slate-800 overflow-hidden relative carefront-dashboard carefront-editor font-manrope">
      
      {/* Global Toast Notification (Brought down 5-10% to top-[12%]) */}
      {toastMessage && (
        <div className="fixed top-[12%] left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-2xl text-xs px-5 py-2.5 rounded-2xl font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN WORKSPACE ROUTING (FULL HEIGHT, UNIFIED LEFT SIDEBAR) */}
      {/* ======================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {currentView === 'editor' && (
          <FramerWebflowEditor
            tenant={tenant}
            services={services}
            providers={providers}
            deviceView={deviceView}
            onChangeDeviceView={setDeviceView}
            isPreviewMode={isPreviewMode}
            onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateTenantBranding={handleUpdateTenantBranding}
            onUpdateService={(s) =>
              setServices((prev) => prev.map((x) => (x.id === s.id ? s : x)))
            }
            onAddService={(newSrv) => {
              setServices((prev) => [newSrv, ...prev]);
              showToast(`Added ${newSrv.name} to clinical catalog!`);
            }}
            onCloseEditor={() => navigateToView('admin')}
            onNavigateToView={navigateToView}
            onOpenLiveStorefront={(url) => navigateToView('live-demo')}
            sections={currentActiveSections}
            onUpdateSections={(updated) => handleUpdatePageSections(storefrontPage, updated)}
            currentPage={storefrontPage}
            onSelectPage={(page) => setStorefrontPage(page)}
            pageCustomData={pageCustomDataMap[storefrontPage]}
            onUpdatePageCustomData={handleUpdatePageCustomData}
            pageSeoMap={pageSeoMap}
            onUpdatePageSeo={handleUpdatePageSeo}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < brandingHistory.length - 1}
          >
            {renderStorefrontContent()}
          </FramerWebflowEditor>
        )}

        {currentView === 'live-demo' && (
          <div
            className="w-full h-full flex flex-col bg-white overflow-hidden relative"
            data-carefront-builder="true"
            data-carefront-tenant="Aura MedSpa & Aesthetics"
            data-carefront-domain="aura.carefront.website"
          >
            {/* Top Subtle Floating Staging Banner */}
            <div className="h-10 bg-slate-900 text-white px-4 flex items-center justify-between text-xs shrink-0 select-none border-b border-white/10 z-50">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-200">Staging Demo:</span>
                <span className="font-mono text-blue-400 font-bold truncate">aura.carefront.website</span>
                <span className="hidden sm:inline text-slate-500 font-normal">|</span>
                <span className="hidden sm:inline text-slate-400 text-[11px]">Powered by Carefront Website Engine v2.4</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateToView('editor')}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Return to Editor</span>
                </button>
                <button
                  onClick={() => navigateToView('admin')}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Practice Dashboard</span>
                </button>
              </div>
            </div>

            {/* Standalone Pure Website Canvas */}
            <div className="flex-1 w-full overflow-hidden relative">
              {renderStorefrontContent()}
            </div>
          </div>
        )}

        {currentView === 'admin' && (
          <AuraOSDashboard
            tenant={tenant}
            services={services}
            providers={providers}
            appointments={appointments}
            orders={orders}
            inboundLeads={inboundLeads}
            recallLogs={recallLogs}
            onUpdateService={(s) =>
              setServices((prev) => prev.map((x) => (x.id === s.id ? s : x)))
            }
            onAddService={(newSrv) => {
              setServices((prev) => [newSrv, ...prev]);
              showToast(`Added ${newSrv.name} to clinical catalog!`);
            }}
            onAddAppointment={(newApt) => {
              setAppointments((prev) => [newApt, ...prev]);
              showToast(`Scheduled appointment for ${newApt.patientName}!`);
            }}
            onSimulateMissedCall={handleSimulateMissedCall}
            isSimulatingMissedCall={isSimulatingMissedCall}
            onToast={showToast}
            onNavigateToView={navigateToView}
            currentView={currentView}
            promotions={promotions}
            onUpdatePromotions={setPromotions}
            activeDoctor={currentDoctor}
            onUpdateDoctor={setCurrentDoctor}
          />
        )}
      </div>

      {/* Global Doctor Authentication Modal */}
      {isDoctorAuthOpen && (
        <DoctorAuthView
          onLoginSuccess={(doctor) => {
            setCurrentDoctor(doctor);
            setIsDoctorAuthOpen(false);
            showToast(`Active doctor session: ${doctor.name}`);
          }}
          onToast={showToast}
          onCancel={() => setIsDoctorAuthOpen(false)}
        />
      )}

    </div>
  );
}
