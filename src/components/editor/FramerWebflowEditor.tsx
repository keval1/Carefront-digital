import React, { useState, useRef } from 'react';
import {
  Plus,
  Layers,
  Type,
  Palette,
  Component,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  X,
  DollarSign,
  Tag,
  Check,
  ShieldCheck,
  Settings,
  Star,
  MapPin,
  Phone,
  LayoutTemplate,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  HelpCircle,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Zap,
  Sliders,
  ExternalLink,
  Crown,
  Lock,
  Upload,
  RefreshCw,
  Clock,
  Award,
  HeartHandshake,
  Microscope,
  CreditCard,
  LayoutDashboard,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  RotateCw,
  Play,
  Pencil,
  CheckCircle2,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tenant, Service, Provider } from '../../types';
import { BlockInsertionModal } from './BlockInsertionModal';
import { PageSeoConfig, PageSeoModal } from './PageSeoModal';

export interface PageSectionItem {
  id: string;
  label: string;
  tag: string;
  enabled: boolean;
}

interface FramerWebflowEditorProps {
  tenant: Tenant;
  services: Service[];
  providers?: Provider[];
  deviceView: 'desktop' | 'tablet' | 'mobile';
  onChangeDeviceView?: (view: 'desktop' | 'tablet' | 'mobile') => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  selectedElementId?: string;
  onSelectElement?: (id: string) => void;
  onUpdateTenantBranding: (updated: any) => void;
  onUpdateService: (updated: Service) => void;
  onAddService?: (newService: Service) => void;
  onCloseEditor: () => void;
  onNavigateToView?: (view: any) => void;
  onOpenLiveStorefront?: (domain?: string) => void;
  sections: PageSectionItem[];
  onUpdateSections: (sections: PageSectionItem[]) => void;
  currentPage?: string;
  onSelectPage?: (page: string) => void;
  availablePages?: Array<{ id: string; name: string; path: string; icon?: string }>;
  pageCustomData?: any;
  onUpdatePageCustomData?: (pageId: string, data: any) => void;
  pageSeoMap?: Record<string, PageSeoConfig>;
  onUpdatePageSeo?: (pageId: string, updated: PageSeoConfig) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  children: React.ReactNode;
}

export const FramerWebflowEditor: React.FC<FramerWebflowEditorProps> = ({
  tenant,
  services,
  providers = [],
  deviceView,
  onChangeDeviceView,
  isPreviewMode,
  onTogglePreview,
  selectedElementId: externalSelectedElementId,
  onSelectElement: externalOnSelectElement,
  onUpdateTenantBranding,
  onUpdateService,
  onAddService,
  onCloseEditor,
  onNavigateToView,
  onOpenLiveStorefront,
  sections,
  onUpdateSections,
  currentPage = 'home',
  onSelectPage,
  availablePages = [
    { id: 'home', name: 'Home Page', path: '/', icon: 'Home' },
    { id: 'treatments', name: 'Treatments Catalog', path: '/services', icon: 'Sparkles' },
    { id: 'about', name: 'About & Leadership', path: '/about', icon: 'Stethoscope' },
    { id: 'financing', name: '0% Cherry Financing', path: '/financing', icon: 'CreditCard' },
    { id: 'memberships', name: 'VIP Concierge Passes', path: '/memberships', icon: 'Crown' },
    { id: 'gallery', name: 'Before & After Gallery', path: '/gallery', icon: 'Image' },
    { id: 'contact', name: 'Contact & Booking', path: '/contact', icon: 'MapPin' }
  ],
  pageCustomData,
  onUpdatePageCustomData,
  pageSeoMap,
  onUpdatePageSeo,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  children
}) => {
  // Active tool tab in the Left Editor Menu
  const [activeMenuTool, setActiveMenuTool] = useState<
    'elements' | 'layers' | 'typography' | 'styling' | 'components' | 'copilot'
  >('elements');

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiToast, setAiToast] = useState<string | null>(null);
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isPublishDropdownOpen, setIsPublishDropdownOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [editingSeoPageId, setEditingSeoPageId] = useState<string>(currentPage || 'home');
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback internal selectedElementId if not controlled from parent
  const [internalSelectedElementId, setInternalSelectedElementId] = useState<string>('hero');
  const activeElementId = externalSelectedElementId !== undefined ? externalSelectedElementId : internalSelectedElementId;
  const currentSection = sections.find((s) => s.id === activeElementId);

  const handleSelectElement = (id: string) => {
    if (externalOnSelectElement) {
      externalOnSelectElement(id);
    } else {
      setInternalSelectedElementId(id);
    }
    setTimeout(() => {
      const targetEl =
        document.getElementById(`canvas-section-${id}`) ||
        document.querySelector(`[data-section-id="${id}"]`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const showSubtleToast = (msg: string) => {
    setAiToast(msg);
    setTimeout(() => {
      setAiToast(null);
    }, 2800);
  };

  // Reorder a section in the page sections list
  // IMPORTANT: Hero and Footer are pinned structural sections and cannot be moved!
  const handleMoveSection = (id: string, direction: 'up' | 'down') => {
    if (id === 'hero' || id === 'footer') {
      showSubtleToast('Hero and Footer are pinned sections and cannot be moved.');
      return;
    }
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;

    // Do not move past pinned hero at index 0 or pinned footer at end
    if (targetIdx <= 0 && sections[0]?.id === 'hero') return;
    if (targetIdx >= sections.length - 1 && sections[sections.length - 1]?.id === 'footer') return;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(idx, 1);
    newSections.splice(targetIdx, 0, moved);
    onUpdateSections(newSections);
    showSubtleToast(`Moved "${moved.label}" ${direction}!`);
  };

  // Toggle visibility of a section
  const handleToggleSection = (id: string) => {
    const newSections = sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    onUpdateSections(newSections);
    const target = sections.find((s) => s.id === id);
    showSubtleToast(
      target?.enabled ? `Hidden "${target.label}" from page` : `Restored "${target?.label}" to page`
    );
  };

  // Remove a section (Hero and Footer CANNOT be removed)
  const handleRemoveSection = (id: string) => {
    if (id === 'hero' || id === 'footer') {
      showSubtleToast('Hero & Footer are required core sections and cannot be removed.');
      return;
    }
    const target = sections.find((s) => s.id === id);
    const newSections = sections.filter((s) => s.id !== id);
    onUpdateSections(newSections);
    showSubtleToast(`Removed "${target?.label || id}" section.`);
    if (activeElementId === id) {
      handleSelectElement('');
    }
  };

  // Add a section to the page
  const handleAddElement = (id: string, label: string, tag: string) => {
    const existing = sections.find((s) => s.id === id);
    if (existing) {
      if (!existing.enabled) {
        handleToggleSection(id);
      }
      handleSelectElement(id);
      showSubtleToast(`Selected "${label}" section.`);
    } else {
      // Insert before footer if footer exists, else append
      const footerIdx = sections.findIndex((s) => s.id === 'footer');
      const newSections = [...sections];
      const newItem = { id, label, tag, enabled: true };
      if (footerIdx !== -1) {
        newSections.splice(footerIdx, 0, newItem);
      } else {
        newSections.push(newItem);
      }
      onUpdateSections(newSections);
      handleSelectElement(id);
      showSubtleToast(`Added "+ ${label}" section to page!`);
    }
  };

  // Handle Logo Upload via file reader
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUpdateTenantBranding({
          ...tenant.branding,
          logoUrl: dataUrl,
          logoType: 'custom_image'
        });
        showSubtleToast('Uploaded new practice logo for navigation!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset Palettes (Universal across Storefront and Dashboard)
  const colorPresets = [
    { name: 'Rich Plum', accent: '#7E22CE', primary: '#581C87' },
    { name: 'Royal Blue', accent: '#2563EB', primary: '#1E3A8A' },
    { name: 'Luxe Gold', accent: '#D4A373', primary: '#1C1917' },
    { name: 'Warm Sand', accent: '#B2906C', primary: '#292524' },
    { name: 'Emerald Green', accent: '#059669', primary: '#064E3B' },
    { name: 'Midnight Noir', accent: '#475569', primary: '#0F172A' },
    { name: 'Rose Blush', accent: '#BE185D', primary: '#831843' }
  ];

  // AI Copilot Fast Action Handlers
  const handleApplyAiCopilot = (customPrompt?: string) => {
    const text = (customPrompt || aiPrompt).trim().toLowerCase();
    if (!text) return;

    if (text.includes('botox') || text.includes('special') || text.includes('12')) {
      // Add Fall Botox Special $12/unit
      const existingBotox = services.find((s) => s.id === 'botox_special');
      if (!existingBotox && onAddService) {
        onAddService({
          id: 'botox_special',
          tenantId: tenant.id,
          name: 'Fall Botox Special ($12/unit)',
          slug: 'botox-fall-special',
          description: 'Medical aesthetic neurotoxin targeted micro-droplet treatment. $12 per unit promotional seasonal rate.',
          depositPriceCents: 7500,
          retailPriceCents: 24000,
          durationMinutes: 30,
          category: 'injectables',
          isFinancingEligible: true,
          badge: '$12/Unit Special',
          imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f41b38f121d?auto=format&fit=crop&w=800&q=80',
          isActive: true
        });
      }
      onUpdateTenantBranding({
        ...tenant.branding,
        heroBadgeText: '🍂 Limited Fall Special: Neurotoxin $12/Unit'
      });
      showSubtleToast('Applied: Added Fall Botox Special ($12/unit) and updated promotional banner!');
    } else if (text.includes('luxe gold') || text.includes('gold')) {
      onUpdateTenantBranding({
        ...tenant.branding,
        themePreset: 'Luxe Gold',
        accentColor: '#D4A373',
        primaryColor: '#1C1917'
      });
      showSubtleToast('Applied: Switched theme to Luxe Gold (#D4A373 / #1C1917)!');
    } else if (text.includes('75') || text.includes('standardize deposits')) {
      services.forEach((s) => {
        onUpdateService({ ...s, depositPriceCents: 7500 });
      });
      showSubtleToast('Applied: Standardized all appointment booking deposits to $75.00!');
    } else if (text.includes('plum')) {
      onUpdateTenantBranding({
        ...tenant.branding,
        themePreset: 'Rich Plum',
        accentColor: '#7E22CE',
        primaryColor: '#581C87'
      });
      showSubtleToast('Applied: Rich Plum palette with 5% tinted section backgrounds!');
    } else if (text.includes('hero') && (text.includes('center') || text.includes('luxury'))) {
      onUpdateTenantBranding({
        ...tenant.branding,
        heroVariant: 'centered_luxury'
      });
      showSubtleToast('Applied: Switched hero section to Centered Luxury layout!');
    } else if (text.includes('treatment') || text.includes('editorial')) {
      onUpdateTenantBranding({
        ...tenant.branding,
        servicesConfig: {
          ...(tenant.branding.servicesConfig || {}),
          layoutPreset: '3col_1row',
          cardStyle: 'editorial'
        }
      });
      showSubtleToast('Applied: Changed treatments catalog to 3-column editorial layout!');
    } else if (text.includes('reviews') || text.includes('glass')) {
      onUpdateTenantBranding({
        ...tenant.branding,
        reviewsConfig: {
          ...(tenant.branding.reviewsConfig || {}),
          cardDesign: 'glass_frosted',
          layout: 'bento_grid'
        }
      });
      showSubtleToast('Applied: Configured testimonials to Frosted Glass Bento cards!');
    } else if (text.includes('feature') || text.includes('bento')) {
      onUpdateTenantBranding({
        ...tenant.branding,
        featuresConfig: {
          ...(tenant.branding.featuresConfig || {}),
          layout: 'bento_features'
        }
      });
      showSubtleToast('Applied: Changed core features to Bento mosaic layout!');
    } else if (text.includes('footer')) {
      onUpdateTenantBranding({
        ...tenant.branding,
        footerConfig: {
          ...(tenant.branding.footerConfig || {}),
          layout: '4col_clean'
        }
      });
      showSubtleToast('Applied: Switched footer to 4-Column Clean directory!');
    } else if (text.includes('deposit') || text.includes('50')) {
      services.forEach((s) => {
        onUpdateService({ ...s, depositPriceCents: 5000 });
      });
      showSubtleToast('Applied: Standardized all booking deposits to $50!');
    } else {
      onUpdateTenantBranding({
        ...tenant.branding,
        heroHeadline: 'Feel Better. Move Freely. Live Pain-Free.',
        heroSubhead:
          'Personalized therapeutic medicine and radiofrequency contouring designed to restore cellular vitality.'
      });
      showSubtleToast('Applied: AI prompt applied to storefront canvas!');
    }

    setAiPrompt('');
  };

  const enrichedPages = availablePages.map((p) => ({
    ...p,
    name: pageSeoMap?.[p.id]?.name || p.name,
    path: pageSeoMap?.[p.id]?.slug || p.path
  }));
  const activePageObj = enrichedPages.find((p) => p.id === currentPage) || enrichedPages[0];

  return (
    <div className="carefront-editor font-manrope w-full h-full flex overflow-hidden bg-[#F8FAFC] text-slate-800 relative">
      {/* Floating Translucent Notification Toast */}
      {aiToast && (
        <div className="fixed top-[12%] left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-2xl rounded-2xl px-5 py-2.5 text-xs font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{aiToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. LEFT SIDE MENU (FULL HEIGHT, EXACT SAME TYPE AS DASHBOARD) */}
      {/* ======================================================== */}
      {!isPreviewMode && (
        <aside className="w-64 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 shadow-2xs z-50 select-none overflow-visible">
          {/* Top Header Section with Active Workspace Selector (Aligned to top menu bar, height 14) */}
          <div className="h-14 px-4 border-b border-slate-200/80 flex items-center shrink-0 relative overflow-visible z-50">
            <div className="relative w-full">
              <button
                onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer border border-transparent hover:border-slate-100"
                title="Switch Active Workspace Mode"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xs shrink-0">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" strokeWidth="2.5" strokeDasharray="14 10" />
                      <circle cx="12" cy="12" r="4" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5 leading-tight">
                      <span className="truncate">Aura Aesthetics</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform ${
                          isWorkspaceDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    <div className="text-[11px] text-blue-600 font-medium leading-tight">
                      Website Editor (/editor)
                    </div>
                  </div>
                </div>
              </button>

              {/* Active Workspace Mode Dropdown (Opens down naturally) */}
              {isWorkspaceDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[900]" onClick={() => setIsWorkspaceDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 w-64 z-[999] text-xs text-slate-800 select-auto"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Active Workspace Mode
                    </div>

                    {/* Mode 1: Practice OS Dashboard */}
                    <button
                      onClick={() => {
                        if (onNavigateToView) onNavigateToView('admin');
                        else onCloseEditor();
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                          <LayoutDashboard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Practice OS Dashboard</div>
                          <div className="text-[10px] text-slate-400 font-normal">EMR, orders, leads & analytics (/)</div>
                        </div>
                      </div>
                    </button>

                    {/* Mode 2: Website Editor */}
                    <button
                      onClick={() => setIsWorkspaceDropdownOpen(false)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50/80 text-blue-700 font-bold cursor-pointer text-left border border-blue-100 mt-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Website Editor</div>
                          <div className="text-[10px] text-blue-600 font-normal">Visual storefront canvas (/editor)</div>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 px-1 tracking-wider block mb-2">
                CANVAS TOOLS
              </span>

              {/* Menu items matching Dashboard text, colors, active states and icons */}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveMenuTool('elements')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    activeMenuTool === 'elements'
                      ? 'bg-[#EEF4FF] text-[#2563EB]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Add Sections"
                >
                  <div className="flex items-center gap-3">
                    <Plus className={`w-4 h-4 shrink-0 transition-colors ${activeMenuTool === 'elements' ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>Add Sections</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      activeMenuTool === 'elements' ? 'bg-white text-[#2563EB] shadow-2xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    +{sections.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveMenuTool('layers')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    activeMenuTool === 'layers'
                      ? 'bg-[#EEF4FF] text-[#2563EB]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Page Sections & Layers"
                >
                  <div className="flex items-center gap-3">
                    <Layers className={`w-4 h-4 shrink-0 transition-colors ${activeMenuTool === 'layers' ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>Page Sections</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      activeMenuTool === 'layers' ? 'bg-white text-[#2563EB] shadow-2xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {sections.filter((s) => s.enabled).length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveMenuTool('typography')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    activeMenuTool === 'typography'
                      ? 'bg-[#EEF4FF] text-[#2563EB]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Typography Tokens"
                >
                  <Type className={`w-4 h-4 shrink-0 transition-colors ${activeMenuTool === 'typography' ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Typography Tokens</span>
                </button>

                <button
                  onClick={() => setActiveMenuTool('styling')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    activeMenuTool === 'styling'
                      ? 'bg-[#EEF4FF] text-[#2563EB]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Brand Colors & Style"
                >
                  <Palette className={`w-4 h-4 shrink-0 transition-colors ${activeMenuTool === 'styling' ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Brand & Colors</span>
                </button>

                <button
                  onClick={() => setActiveMenuTool('components')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    activeMenuTool === 'components'
                      ? 'bg-[#EEF4FF] text-[#2563EB]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Clinical Widgets"
                >
                  <Component className={`w-4 h-4 shrink-0 transition-colors ${activeMenuTool === 'components' ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Clinical Widgets</span>
                </button>

                <button
                  onClick={() => setActiveMenuTool('copilot')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    activeMenuTool === 'copilot'
                      ? 'bg-[#EEF4FF] text-[#2563EB]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="AI Page Copilot"
                >
                  <Sparkles className={`w-4 h-4 shrink-0 transition-colors ${activeMenuTool === 'copilot' ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>AI Page Copilot</span>
                </button>
              </div>
            </div>

            {/* Active Tool Sub-Drawer inside w-64 menu */}
            <div className="pt-3 border-t border-slate-100">
              {/* TAB 1: ADD SECTIONS (ALLOWS ADD AND REMOVE) */}
              {activeMenuTool === 'elements' && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsBlockModalOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all mb-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Insert Component Block</span>
                  </button>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Sections Catalog
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">Add / Remove</span>
                  </div>
                  <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-0.5">
                    {[
                      { id: 'hero', label: 'Hero & Value Prop', icon: LayoutTemplate, tag: 'Hero', isCore: true },
                      { id: 'treatments', label: 'Signature Procedures', icon: Zap, tag: 'Catalog' },
                      { id: 'features', label: 'Clinical Features Split', icon: ShieldCheck, tag: 'Clinical' },
                      { id: 'cherry_financing', label: 'Cherry 0% Financing', icon: CreditCard, tag: 'Financing' },
                      { id: 'reviews', label: 'Verified Reviews Grid', icon: Star, tag: 'Social Proof' },
                      { id: 'faq', label: 'FAQ Accordion', icon: HelpCircle, tag: 'FAQ' },
                      { id: 'team', label: 'Clinical Medical Team', icon: Users, tag: 'Providers' },
                      { id: 'gallery', label: 'Before & After Gallery', icon: ImageIcon, tag: 'Results' },
                      { id: 'membership', label: 'VIP Concierge Passes', icon: Crown, tag: 'VIP Pass' },
                      { id: 'banner', label: 'Announcement Banner', icon: Sparkles, tag: 'Banner' },
                      { id: 'footer', label: 'Ambient Luxury Footer', icon: MapPin, tag: 'Footer', isCore: true }
                    ].map((el) => {
                      const isAdded = sections.some((s) => s.id === el.id);
                      const isEnabled = sections.some((s) => s.id === el.id && s.enabled);
                      const Icon = el.icon;
                      return (
                        <div
                          key={el.id}
                          className="p-2 rounded-xl border flex items-center justify-between text-xs bg-white border-slate-200"
                        >
                          <div
                            className="flex items-center gap-2 truncate cursor-pointer flex-1 min-w-0 mr-1"
                            onClick={() => handleSelectElement(el.id)}
                          >
                            <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="truncate text-[11px] font-medium text-slate-700">{el.label}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {el.isCore ? (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> Core
                              </span>
                            ) : isAdded ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleToggleSection(el.id)}
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full cursor-pointer ${
                                    isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {isEnabled ? 'Active' : 'Off'}
                                </button>
                                <button
                                  onClick={() => handleRemoveSection(el.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                                  title="Remove section from page"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddElement(el.id, el.label, el.tag)}
                                className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: PAGE SECTIONS & REARRANGING (HERO & FOOTER LOCKED) */}
              {activeMenuTool === 'layers' && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsBlockModalOpen(true)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all mb-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Insert Block into {activePageObj.name}</span>
                  </button>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Sections on {activePageObj.name}
                    </span>
                    <span className="text-[10px] text-slate-400">↑ / ↓ Reorder</span>
                  </div>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-0.5">
                    {sections.map((sec, idx) => {
                      const isPinned = sec.id === 'hero' || sec.id === 'footer';
                      return (
                        <div
                          key={sec.id}
                          onClick={() => handleSelectElement(sec.id)}
                          className={`p-2 rounded-xl cursor-pointer flex items-center justify-between text-xs border transition-all ${
                            activeElementId === sec.id
                              ? 'bg-blue-50 text-blue-800 font-bold border-blue-300 shadow-xs'
                              : sec.enabled
                              ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate flex-1 min-w-0 mr-1">
                            {!isPinned ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSection(sec.id);
                                }}
                                title={sec.enabled ? 'Hide Section' : 'Show Section'}
                                className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                              >
                                {sec.enabled ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3" />}
                              </button>
                            ) : (
                              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate text-[11px]">{sec.label}</span>
                          </div>

                          {/* Action Buttons: Hero and Footer are locked and CANNOT be moved or deleted! */}
                          {isPinned ? (
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                              Core Locked
                            </span>
                          ) : (
                            <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                disabled={idx <= 1 && sections[0]?.id === 'hero'}
                                onClick={() => handleMoveSection(sec.id, 'up')}
                                className="p-1 hover:bg-slate-200 rounded disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed text-slate-600"
                                title="Move section up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                disabled={idx >= sections.length - 2 && sections[sections.length - 1]?.id === 'footer'}
                                onClick={() => handleMoveSection(sec.id, 'down')}
                                className="p-1 hover:bg-slate-200 rounded disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed text-slate-600"
                                title="Move section down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleRemoveSection(sec.id)}
                                className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-400 cursor-pointer"
                                title="Remove section"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveMenuTool('elements')}
                    className="w-full mt-2 py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-blue-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Another Section</span>
                  </button>
                </div>
              )}

              {/* TAB 3: TYPOGRAPHY TOKENS */}
              {activeMenuTool === 'typography' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Font Hierarchy Pairings
                    </span>
                    <div className="space-y-1.5">
                      {[
                        {
                          id: 'Editorial Serif',
                          title: 'Editorial Serif',
                          desc: 'Cormorant Garamond + Inter body',
                          sample: 'font-serif'
                        },
                        {
                          id: 'Geometric Sans',
                          title: 'Modern Sans',
                          desc: 'Plus Jakarta Sans + Inter body',
                          sample: 'font-sans'
                        },
                        {
                          id: 'Luxury Grotesk',
                          title: 'Luxury Grotesk',
                          desc: 'Cabinet Grotesk + Satoshi body',
                          sample: 'font-sans tracking-tight'
                        },
                        {
                          id: 'Classical Roman',
                          title: 'Classical Roman',
                          desc: 'Cinzel Decorative + Outfit body',
                          sample: 'font-serif tracking-wide'
                        }
                      ].map((font) => (
                        <button
                          key={font.id}
                          onClick={() => {
                            onUpdateTenantBranding({ ...tenant.branding, fontFamily: font.id });
                            showSubtleToast(`Applied typography token: ${font.title}`);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                            tenant.branding.fontFamily === font.id
                              ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`text-sm ${font.sample}`}>{font.title}</div>
                          <div className="text-[10px] text-slate-500">{font.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Base Scale Tokens */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Base Typographic Scale
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'compact', label: 'Compact', desc: '0.95x' },
                        { id: 'balanced', label: 'Balanced', desc: '1.0x' },
                        { id: 'spacious', label: 'Spacious', desc: '1.08x' }
                      ].map((sc) => {
                        const currentScale = tenant.branding.fontScale || 'balanced';
                        const isSel = currentScale === sc.id;
                        return (
                          <button
                            key={sc.id}
                            onClick={() => {
                              onUpdateTenantBranding({ ...tenant.branding, fontScale: sc.id });
                              showSubtleToast(`Applied scale token: ${sc.label}`);
                            }}
                            className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
                              isSel
                                ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <div className="text-xs font-bold">{sc.label}</div>
                            <div className="text-[9px] text-slate-400">{sc.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Letter Spacing Tokens */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Heading Letter Spacing
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'tight', label: 'Tight', val: '-0.02em' },
                        { id: 'normal', label: 'Normal', val: '0em' },
                        { id: 'wide', label: 'Wide', val: '+0.04em' }
                      ].map((tr) => {
                        const currentTracking = tenant.branding.fontTracking || 'normal';
                        const isSel = currentTracking === tr.id;
                        return (
                          <button
                            key={tr.id}
                            onClick={() => {
                              onUpdateTenantBranding({ ...tenant.branding, fontTracking: tr.id });
                              showSubtleToast(`Applied tracking token: ${tr.label}`);
                            }}
                            className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
                              isSel
                                ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <div className="text-xs font-bold">{tr.label}</div>
                            <div className="text-[9px] text-slate-400">{tr.val}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BRAND & COLORS */}
              {activeMenuTool === 'styling' && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Universal Color Presets
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {colorPresets.map((swatch) => (
                        <button
                          key={swatch.name}
                          onClick={() => {
                            onUpdateTenantBranding({
                              ...tenant.branding,
                              themePreset: swatch.name,
                              accentColor: swatch.accent,
                              primaryColor: swatch.primary
                            });
                            showSubtleToast(`Applied universal palette: ${swatch.name}!`);
                          }}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            tenant.branding.accentColor === swatch.accent
                              ? 'border-blue-600 bg-blue-50 shadow-xs'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: swatch.accent }}
                          />
                          <span className="text-[10px] font-semibold text-slate-800 truncate">
                            {swatch.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Hex Pickers */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Custom Color Pickers
                    </span>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Accent Color:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={tenant.branding.accentColor || '#2563EB'}
                          onChange={(e) =>
                            onUpdateTenantBranding({ ...tenant.branding, accentColor: e.target.value })
                          }
                          className="w-6 h-6 rounded cursor-pointer border border-slate-300"
                        />
                        <span className="font-mono text-[10px] text-slate-600 uppercase">
                          {tenant.branding.accentColor || '#2563EB'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Primary Base:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={tenant.branding.primaryColor || '#064E3B'}
                          onChange={(e) =>
                            onUpdateTenantBranding({ ...tenant.branding, primaryColor: e.target.value })
                          }
                          className="w-6 h-6 rounded cursor-pointer border border-slate-300"
                        />
                        <span className="font-mono text-[10px] text-slate-600 uppercase">
                          {tenant.branding.primaryColor || '#064E3B'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CLINICAL WIDGETS (NO EMR BADGE, NO DUPLICATE SECTIONS) */}
              {activeMenuTool === 'components' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Storefront Clinical Widgets
                  </span>
                  {[
                    {
                      key: 'aiFrontDesk',
                      label: '24/7 AI Concierge Bot',
                      desc: 'Bottom-right automated frontdesk assistant'
                    },
                    {
                      key: 'missedCallSms',
                      label: 'Missed-Call Auto-SMS',
                      desc: 'Reassurance callback messaging within 14s'
                    },
                    {
                      key: 'quickBookBar',
                      label: 'Sticky Quick-Book Bar',
                      desc: 'Mobile bottom drawer for instant slot lock'
                    },
                    {
                      key: 'onlineBookingBadge',
                      label: 'Real-Time Schedule Sync',
                      desc: 'Live provider calendar availability indicator'
                    }
                  ].map((w) => {
                    const widgets = tenant.branding.widgets || {
                      aiFrontDesk: true,
                      missedCallSms: true,
                      quickBookBar: true,
                      onlineBookingBadge: true
                    };
                    const isEnabled = widgets[w.key as keyof typeof widgets] ?? true;

                    return (
                      <button
                        key={w.key}
                        onClick={() => {
                          const updatedWidgets = { ...widgets, [w.key]: !isEnabled };
                          onUpdateTenantBranding({
                            ...tenant.branding,
                            widgets: updatedWidgets
                          });
                          showSubtleToast(`${isEnabled ? 'Disabled' : 'Enabled'}: ${w.label}!`);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isEnabled
                            ? 'bg-blue-50/70 border-blue-300 text-blue-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{w.label}</div>
                          <div className="text-[10px] text-slate-500">{w.desc}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                            isEnabled ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          {isEnabled ? '✓' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 6: AI COPILOT */}
              {activeMenuTool === 'copilot' && (
                <div className="space-y-3">
                  <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block text-xs">AI Studio Page Copilot</span>
                    <span className="text-[10px] text-blue-600">Describe any change to update layout or design.</span>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Switch hero to centered luxury layout..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                    <button
                      onClick={() => handleApplyAiCopilot()}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-xs"
                    >
                      Apply AI Change
                    </button>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-1">
                    Quick AI Presets
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    <button
                      onClick={() => handleApplyAiCopilot('Apply Rich Plum theme')}
                      className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 cursor-pointer border border-slate-200/80 transition-colors"
                    >
                      🎨 Apply Rich Plum with 5% theme tint
                    </button>
                    <button
                      onClick={() => handleApplyAiCopilot('Switch hero to centered luxury layout')}
                      className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 cursor-pointer border border-slate-200/80 transition-colors"
                    >
                      ✨ Switch Hero to Centered Luxury
                    </button>
                    <button
                      onClick={() => handleApplyAiCopilot('Change treatments to editorial')}
                      className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 cursor-pointer border border-slate-200/80 transition-colors"
                    >
                      ⚡ Treatments 3-Col Editorial
                    </button>
                    <button
                      onClick={() => handleApplyAiCopilot('Set reviews to frosted glass bento')}
                      className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 cursor-pointer border border-slate-200/80 transition-colors"
                    >
                      🌟 Reviews Frosted Glass Bento
                    </button>
                    <button
                      onClick={() => handleApplyAiCopilot('Standardize deposits to $50')}
                      className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 cursor-pointer border border-slate-200/80 transition-colors"
                    >
                      💳 Standardize $50 Deposits Across Catalog
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Bottom: Status Card with matching p-5 pt-3 padding and clean spacing */}
          <div className="p-5 pt-3 border-t border-slate-100 shrink-0">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-800 text-[11px]">Real-Time Sync</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-semibold">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                All visual edits propagate instantly to staged &amp; live domains.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[9px] text-slate-400 font-mono">
                <span>Fast Carefront CDN</span>
                <span className="text-emerald-600 font-bold">24ms Latency</span>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ======================================================== */}
      {/* 2. RIGHT COLUMN: TOP HEADER BAR + CANVAS & INSPECTOR     */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Bar across Canvas (Page Dropdown, Device Viewport, Undo/Redo, Publish) */}
        <header className="h-14 w-full bg-white border-b border-slate-200/80 px-4 flex items-center justify-between relative z-[100] shrink-0 shadow-2xs">
          {/* Left: Page Selector Dropdown (With SEO & Settings next to page name) */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsPageDropdownOpen(!isPageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 transition-colors cursor-pointer group shadow-2xs"
                title="Switch Page or Edit SEO"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate max-w-[150px] sm:max-w-none">{activePageObj.name}</span>
                <span className="text-[10px] text-slate-400 font-mono font-normal">
                  ({activePageObj.path || '/'})
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform ${
                    isPageDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Page Menu (High z-index z-[210] so never behind navbar) */}
              {isPageDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[200]" onClick={() => setIsPageDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 w-72 z-[210] text-xs text-slate-800 space-y-1"
                  >
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 pb-1">
                      <span>Select Storefront Page</span>
                      <span className="font-mono text-[9px] text-slate-400">{enrichedPages.length} Pages</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-0.5 py-1">
                      {enrichedPages.map((p) => {
                        const isActive = currentPage === p.id;
                        return (
                          <div
                            key={p.id}
                            className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                              isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <button
                              onClick={() => {
                                onSelectPage?.(p.id);
                                setIsPageDropdownOpen(false);
                                showSubtleToast(`Switched to ${p.name}`);
                              }}
                              className="flex-1 flex items-center gap-2 text-left cursor-pointer truncate"
                            >
                              <span className="truncate text-xs">{p.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono truncate">{p.path}</span>
                            </button>
                            <button
                              onClick={() => {
                                setIsPageDropdownOpen(false);
                                setEditingSeoPageId(p.id);
                                setIsSeoModalOpen(true);
                              }}
                              title={`Configure SEO & Settings for ${p.name}`}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors ml-1 cursor-pointer shrink-0"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Center: Device Viewport Icons (Desktop, Tablet, Mobile — JUST ICONS!) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-0.5 border border-slate-200/60">
            <button
              onClick={() => onChangeDeviceView?.('desktop')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                deviceView === 'desktop'
                  ? 'bg-white shadow-xs text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Desktop View (100% Canvas)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeDeviceView?.('tablet')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                deviceView === 'tablet'
                  ? 'bg-white shadow-xs text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tablet View (768px Canvas)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeDeviceView?.('mobile')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                deviceView === 'mobile'
                  ? 'bg-white shadow-xs text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Mobile View (375px Canvas)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Undo, Redo, Preview/Edit, Publish Dropdown */}
          <div className="flex items-center gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePreview}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                isPreviewMode
                  ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs font-bold'
                  : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {isPreviewMode ? (
                <>
                  <Pencil className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit Mode</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-600 fill-slate-600" />
                  <span>Preview</span>
                </>
              )}
            </button>

            {/* Save Button */}
            <button
              onClick={() => showSubtleToast('Changes saved to Aura production database.')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              title="Save Changes"
            >
              <Save className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Save</span>
            </button>

            {/* Single Publish Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPublishDropdownOpen(!isPublishDropdownOpen)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <span>Publish</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isPublishDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[200]" onClick={() => setIsPublishDropdownOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 w-96 z-[210] text-xs space-y-3.5 animate-in fade-in zoom-in-95 duration-100">
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-between pb-1 border-b border-slate-100">
                      <span>Storefront Publishing &amp; Domains</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">2 Domains Ready</span>
                    </div>

                    {/* Staging Domain: aura.carefront.website */}
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                            <span className="font-mono text-blue-700">aura.carefront.website</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Staging Subdomain • Fast Carefront CDN
                          </div>
                        </div>
                        <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-md">
                          Staging
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            setIsPublishDropdownOpen(false);
                            if (onOpenLiveStorefront) {
                              onOpenLiveStorefront('https://aura.carefront.website');
                            } else if (onNavigateToView) {
                              onNavigateToView('live-demo');
                            } else {
                              window.open('/staged', '_blank');
                            }
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          title="Open aura.carefront.website live demo website"
                        >
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                          <span>Open Staged Site</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsPublishDropdownOpen(false);
                            showSubtleToast('🚀 Published changes to aura.carefront.website staging domain!');
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Publish Staging</span>
                        </button>
                      </div>
                    </div>

                    {/* Production Custom Domain: auramedspa.com */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                            <span className="font-mono text-slate-800">auramedspa.com</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Production Custom Domain (SSL 256-bit)
                          </div>
                        </div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                          Production
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            setIsPublishDropdownOpen(false);
                            if (onOpenLiveStorefront) {
                              onOpenLiveStorefront('https://auramedspa.com');
                            } else if (onNavigateToView) {
                              onNavigateToView('live-demo');
                            } else {
                              window.open('https://auramedspa.com', '_blank');
                            }
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          title="Open auramedspa.com custom production domain"
                        >
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                          <span>Open Domain</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsPublishDropdownOpen(false);
                            showSubtleToast('🚀 Published live to auramedspa.com custom domain!');
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Publish Live</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100">
                      EMR sync: Quad-A Suite • DNS Cloudflare Proxied • Carefront v2.4
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Area with Canvas and Inspector */}
        <div className="flex-1 flex overflow-hidden relative">
      <div
        className={`flex-1 h-full overflow-hidden bg-[#F1F5F9] flex flex-col items-center ${
          deviceView === 'desktop' ? 'p-0' : 'p-4 md:p-6'
        } relative`}
      >
        <div
          className={`w-full transition-all duration-300 bg-white relative flex flex-col ${
            deviceView === 'desktop'
              ? 'h-full max-w-full rounded-none border-0 shadow-none overflow-hidden'
              : deviceView === 'tablet'
              ? 'max-w-2xl my-auto rounded-3xl border border-slate-300 shadow-2xl overflow-hidden h-[85vh] bg-white'
              : 'max-w-sm my-auto rounded-3xl border border-slate-300 shadow-2xl overflow-hidden h-[85vh] bg-white'
          }`}
        >
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {children}

            {/* Adjustment 1: DOCK THE AI PAGE COPILOT DIRECTLY ON THE CANVAS */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-full px-4 py-2.5 shadow-2xl flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-[92%] max-w-xl">
              <div className="flex items-center gap-2 w-full flex-1">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 animate-pulse" />
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyAiCopilot();
                    }
                  }}
                  placeholder='✨ AI Page Copilot: "Describe changes to this page..."'
                  className="w-full bg-transparent border-0 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 font-medium"
                />
              </div>

              {/* Action Buttons & Quick Action Chips */}
              <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleApplyAiCopilot('Add Fall Botox Special $12/unit')}
                  className="hidden md:inline-flex px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[10px] font-semibold transition-colors cursor-pointer"
                  title="Add Fall Botox Special $12/unit"
                >
                  ⚡ Botox $12
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyAiCopilot('Switch Theme to Luxe Gold')}
                  className="hidden md:inline-flex px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full text-[10px] font-semibold transition-colors cursor-pointer"
                  title="Switch Theme to Luxe Gold"
                >
                  ⚡ Luxe Gold
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyAiCopilot('Standardize Deposits to $75')}
                  className="hidden md:inline-flex px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-semibold transition-colors cursor-pointer"
                  title="Standardize Deposits to $75"
                >
                  ⚡ $75 Deposit
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyAiCopilot()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ml-1"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. RIGHT INSPECTOR PANEL (DETAILED SECTION CONTROLS) */}
      {/* ======================================================== */}
      {!isPreviewMode && (
        <aside className="w-80 bg-white border-l border-slate-200 p-5 space-y-5 overflow-y-auto shrink-0 text-xs shadow-2xs z-30">
          {/* Header Breadcrumb & Section Action Bar */}
          <div className="border-b border-slate-100 pb-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Section &gt;</span>
                <span className="font-bold text-slate-900 capitalize">
                  {currentSection?.label || activeElementId || 'General Page'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  Live
                </span>
                {activeElementId && (
                  <button
                    onClick={() => handleSelectElement('')}
                    title="Deselect section"
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Reorder and Visibility bar for selected section */}
            {currentSection && (
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-600 font-mono">
                  &lt;{currentSection.tag}&gt;
                </span>
                {currentSection.id === 'hero' || currentSection.id === 'footer' ? (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Core Section
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveSection(currentSection.id, 'up')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title="Move section up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(currentSection.id, 'down')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title="Move section down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleSection(currentSection.id)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title={currentSection.enabled ? 'Hide Section' : 'Show Section'}
                    >
                      {currentSection.enabled ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                    <button
                      onClick={() => handleRemoveSection(currentSection.id)}
                      className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-400 cursor-pointer"
                      title="Delete section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ===================================================== */}
          {/* CASE 1: ANNOUNCEMENT BANNER */}
          {/* ===================================================== */}
          {activeElementId === 'banner' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900 block text-xs">Announcement Banner</span>
                <span className="text-[10px] text-blue-600">Top ribbon alerting patients to clinical promos & hours.</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Banner Announcement Text</label>
                <textarea
                  rows={3}
                  value={tenant.branding.bannerText}
                  onChange={(e) =>
                    onUpdateTenantBranding({ ...tenant.branding, bannerText: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Banner Background Color</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Dark Luxe', bg: '#1C1917' },
                    { name: 'Deep Emerald', bg: '#064E3B' },
                    { name: 'Rich Plum', bg: '#581C87' },
                    { name: 'Royal Blue', bg: '#1E40AF' }
                  ].map((color) => (
                    <button
                      key={color.name}
                      onClick={() =>
                        onUpdateTenantBranding({
                          ...tenant.branding,
                          bannerColor: color.bg
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-medium flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                    >
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: color.bg }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* CASE 2: NAVIGATION HEADER & LOGO UPLOAD */}
          {/* ===================================================== */}
          {activeElementId === 'navbar' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900 block text-xs">Navbar & Logo Branding</span>
                <span className="text-[10px] text-blue-600">Upload practice logo or choose monogram style.</span>
              </div>

              {/* LOGO UPLOAD SECTION */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <label className="font-bold text-slate-700 block">Practice Logo Image</label>
                {tenant.branding.logoUrl ? (
                  <div className="space-y-2">
                    <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <img src={tenant.branding.logoUrl} alt="Logo" className="h-8 max-w-[120px] object-contain" />
                      <button
                        onClick={() =>
                          onUpdateTenantBranding({
                            ...tenant.branding,
                            logoUrl: undefined,
                            logoType: 'monogram'
                          })
                        }
                        className="text-[10px] text-rose-600 hover:underline font-semibold cursor-pointer"
                      >
                        Reset to Monogram
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500">Currently using Monogram Letter badge.</div>
                )}

                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload Logo File</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location Subtitle</label>
                <input
                  type="text"
                  value={tenant.branding.navbarLocation || 'Beverly Hills'}
                  onChange={(e) =>
                    onUpdateTenantBranding({ ...tenant.branding, navbarLocation: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Direct Phone Number</label>
                <input
                  type="text"
                  value={tenant.branding.navbarPhone || '(310) 844-9120'}
                  onChange={(e) =>
                    onUpdateTenantBranding({ ...tenant.branding, navbarPhone: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Booking Button Label</label>
                <input
                  type="text"
                  value={tenant.branding.navbarCtaText || 'Book Consultation'}
                  onChange={(e) =>
                    onUpdateTenantBranding({ ...tenant.branding, navbarCtaText: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                />
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* CASE 3: HERO SECTION (>2 LAYOUTS & >2 DESIGNS) */}
          {/* ===================================================== */}
          {activeElementId === 'hero' && (() => {
            const PAGE_HERO_DEFAULTS: Record<string, { headline: string; subhead: string; badge: string; variant: string }> = {
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
                subhead: 'Founded by Dr. Sarah Jenkins, MD, FACS, Aura Aesthetics sets the gold standard for clinical excellence and natural facial harmony.',
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

            const pageDef = PAGE_HERO_DEFAULTS[currentPage || 'home'] || PAGE_HERO_DEFAULTS.home;
            const currentHeroVariant = pageCustomData?.variant || pageDef.variant || 'split_ambient';
            const currentHeroDesign = pageCustomData?.design || 'warm_alabaster';
            const currentHeroHeadline = pageCustomData?.headline !== undefined ? pageCustomData.headline : pageDef.headline;
            const currentHeroSubhead = pageCustomData?.subhead !== undefined ? pageCustomData.subhead : pageDef.subhead;
            const currentHeroBadge = pageCustomData?.badge !== undefined ? pageCustomData.badge : pageDef.badge;
            const currentHeroCtaPrimary = pageCustomData?.ctaPrimary !== undefined ? pageCustomData.ctaPrimary : 'Book Your Session';
            const currentHeroCtaSecondary = pageCustomData?.ctaSecondary !== undefined ? pageCustomData.ctaSecondary : 'Explore Treatments';

            const updateCurrentPageHero = (patch: Record<string, any>) => {
              if (onUpdatePageCustomData && currentPage) {
                onUpdatePageCustomData(currentPage, patch);
              }
            };

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900 block text-xs">
                    {activePageObj.name} • Hero Variations
                  </span>
                  <span className="text-[10px] text-blue-600">
                    Changes here are isolated strictly to {activePageObj.name}.
                  </span>
                </div>

                {/* HERO LAYOUT OPTIONS (>2 OPTIONS) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Hero Layout Style</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'split_ambient', label: 'Split Ambient Photo', desc: 'Left text + ambient photo' },
                      { id: 'centered_luxury', label: 'Centered Luxury', desc: 'Centered headline & dual CTA' },
                      { id: 'physician_consult', label: 'Physician Spotlight', desc: 'Split doctor consult card' },
                      { id: 'video_ambient', label: 'Cinematic Ambient', desc: 'Video consult walkthrough' }
                    ].map((lay) => (
                      <button
                        key={lay.id}
                        onClick={() => {
                          updateCurrentPageHero({ variant: lay.id });
                          showSubtleToast(`Applied ${lay.label} layout to ${activePageObj.name}!`);
                        }}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          currentHeroVariant === lay.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{lay.label}</div>
                        <div className="text-[9px] text-slate-500">{lay.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* HERO DESIGN PRESET (>2 OPTIONS) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Design Aesthetic</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'warm_alabaster', label: 'Warm Alabaster', desc: 'Soft ambient tones' },
                      { id: 'luxe_editorial', label: 'Luxe Editorial', desc: 'Dramatic gold contrast' },
                      { id: 'clinical_slate', label: 'Clinical Slate', desc: 'Medical dark precision' },
                      { id: 'frosted_glass', label: 'Frosted Glass', desc: 'Luminous backdrop blur' }
                    ].map((des) => (
                      <button
                        key={des.id}
                        onClick={() => {
                          updateCurrentPageHero({ design: des.id });
                          showSubtleToast(`Applied ${des.label} aesthetic to ${activePageObj.name}!`);
                        }}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          currentHeroDesign === des.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{des.label}</div>
                        <div className="text-[9px] text-slate-500">{des.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Main Headline Text</label>
                  <textarea
                    rows={2}
                    value={currentHeroHeadline}
                    onChange={(e) => updateCurrentPageHero({ headline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subtitle & Value Proposition</label>
                  <textarea
                    rows={3}
                    value={currentHeroSubhead}
                    onChange={(e) => updateCurrentPageHero({ subhead: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinical Suite Badge</label>
                  <input
                    type="text"
                    value={currentHeroBadge}
                    onChange={(e) => updateCurrentPageHero({ badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block text-[10px] mb-1">Primary CTA</label>
                    <input
                      type="text"
                      value={currentHeroCtaPrimary}
                      onChange={(e) => updateCurrentPageHero({ ctaPrimary: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block text-[10px] mb-1">Secondary CTA</label>
                    <input
                      type="text"
                      value={currentHeroCtaSecondary}
                      onChange={(e) => updateCurrentPageHero({ ctaSecondary: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* CASE 4: SIGNATURE SERVICES & CARD SLOTS */}
          {/* ===================================================== */}
          {activeElementId === 'treatments' && (() => {
            const currentTreatments = pageCustomData?.treatments || tenant.branding.servicesConfig || {};
            const updateCurrentPageTreatments = (patch: Record<string, any>) => {
              if (onUpdatePageCustomData && currentPage) {
                onUpdatePageCustomData(currentPage, {
                  treatments: {
                    ...currentTreatments,
                    ...patch
                  }
                });
              } else {
                onUpdateTenantBranding({
                  ...tenant.branding,
                  servicesConfig: {
                    ...(tenant.branding.servicesConfig || {}),
                    ...patch
                  }
                });
              }
            };

            const preset = currentTreatments?.layoutPreset || '3col_1row';
            const capacityMap: Record<string, number> = {
              '2col_1row': 2,
              '3col_1row': 3,
              '2col_2row': 4,
              '3col_2row': 6,
              '4col_1row': 4
            };
            const capacity = capacityMap[preset] || 3;
            const slotServiceIds = currentTreatments?.slotServiceIds || [];
            const slotCardStyles = currentTreatments?.slotCardStyles || {};

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900 block text-xs">Treatments Grid & Individual Cards</span>
                  <span className="text-[10px] text-blue-600">
                    Changes here apply strictly to {activePageObj.name} (isolated page instance).
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Section Headline</label>
                  <input
                    type="text"
                    value={currentTreatments?.headline || 'Clinical Treatments Designed Around You'}
                    onChange={(e) => updateCurrentPageTreatments({ headline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                {/* GRID LAYOUT SELECTION (>2 LAYOUTS, CALCULATES CAPACITY) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grid Layout & Card Count</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: '2col_1row', label: '2 Col × 1 Row', cards: 2 },
                      { id: '3col_1row', label: '3 Col × 1 Row', cards: 3 },
                      { id: '2col_2row', label: '2 Col × 2 Rows', cards: 4 },
                      { id: '3col_2row', label: '3 Col × 2 Rows', cards: 6 },
                      { id: '4col_1row', label: '4 Col × 1 Row', cards: 4 }
                    ].map((p) => {
                      const isSelected = preset === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            updateCurrentPageTreatments({ layoutPreset: p.id as any });
                            showSubtleToast(`Set to ${p.label} (${p.cards} cards capacity)!`);
                          }}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-[11px] font-semibold">{p.label}</div>
                          <div className="text-[9px] text-slate-500">{p.cards} Cards Capacity</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* INDIVIDUAL CARD STYLE PRESETS PER SLOT */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 block">
                        Configure Individual Cards ({capacity} Slots)
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">1 per slot</span>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-0.5">
                      {Array.from({ length: capacity }).map((_, idx) => {
                        const currentServiceId = slotServiceIds[idx] || services[idx % services.length]?.id;
                        const currentCardStyle = slotCardStyles[idx] || 'glass';

                        return (
                          <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-blue-700 uppercase">
                                Card Slot #{idx + 1}
                              </span>
                              <span className="text-[9px] text-slate-500">Preset: {currentCardStyle}</span>
                            </div>

                            {/* Service Dropdown */}
                            <div>
                              <label className="text-[9px] text-slate-500 block mb-0.5">Procedure:</label>
                              <select
                                value={currentServiceId}
                                onChange={(e) => {
                                  const nextSlotIds = [...slotServiceIds];
                                  nextSlotIds[idx] = e.target.value;
                                  updateCurrentPageTreatments({ slotServiceIds: nextSlotIds });
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                              >
                                {services.map((srv) => (
                                  <option key={srv.id} value={srv.id}>
                                    {srv.name} (${(srv.retailPriceCents / 100).toLocaleString()})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Card Style Preset Dropdown */}
                            <div>
                              <label className="text-[9px] text-slate-500 block mb-0.5">Card Style Preset:</label>
                              <select
                                value={currentCardStyle}
                                onChange={(e) => {
                                  const nextStyles = { ...slotCardStyles, [idx]: e.target.value as any };
                                  updateCurrentPageTreatments({ slotCardStyles: nextStyles });
                                  showSubtleToast(`Card #${idx + 1} set to ${e.target.value}!`);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                              >
                                <option value="glass">Luxury Frosted Glass</option>
                                <option value="minimal">Modern Minimalist Clean</option>
                                <option value="compact">Clinical Compact Quick-Specs</option>
                                <option value="editorial">Editorial Dramatic Magazine</option>
                                <option value="bordered_accent">Brand Tinted Border</option>
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* CASE 5: CORE FEATURES DETAILED EDIT ACCESSIBILITY */}
          {/* ===================================================== */}
          {activeElementId === 'features' && (() => {
            const currentFeatures = pageCustomData?.features || tenant.branding.featuresConfig || {};
            const updateCurrentPageFeatures = (patch: Record<string, any>) => {
              if (onUpdatePageCustomData && currentPage) {
                onUpdatePageCustomData(currentPage, {
                  features: {
                    ...currentFeatures,
                    ...patch
                  }
                });
              } else {
                onUpdateTenantBranding({
                  ...tenant.branding,
                  featuresConfig: {
                    ...(tenant.branding.featuresConfig || {}),
                    ...patch
                  }
                });
              }
            };

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900 block text-xs">
                    {activePageObj.name} • Core Features Editor
                  </span>
                  <span className="text-[10px] text-blue-600">
                    Changes here are isolated strictly to {activePageObj.name}.
                  </span>
                </div>

                {/* LAYOUT OPTIONS (>2 LAYOUTS) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Layout Option</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'split_left_right', label: 'Split Media + Standards' },
                      { id: 'grid_cards', label: '3-Column Cards Grid' },
                      { id: 'bento_features', label: 'Bento Mosaic Spotlight' },
                      { id: 'asymmetric_spotlight', label: 'Asymmetric 2-Col List' }
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          updateCurrentPageFeatures({ layout: l.id as any });
                          showSubtleToast(`Applied ${l.label} to ${activePageObj.name}!`);
                        }}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          (currentFeatures?.layout || 'split_left_right') === l.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{l.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Section Headline</label>
                  <input
                    type="text"
                    value={currentFeatures?.headline || 'Expert Care That Goes Beyond Relaxation'}
                    onChange={(e) => updateCurrentPageFeatures({ headline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medical Director</label>
                  <input
                    type="text"
                    value={currentFeatures?.doctorName || 'Dr. Sarah Jenkins, MD, FACS'}
                    onChange={(e) => updateCurrentPageFeatures({ doctorName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Director Specialization</label>
                  <input
                    type="text"
                    value={currentFeatures?.doctorTitle || 'Double Board-Certified Facial Plastic Surgeon'}
                    onChange={(e) => updateCurrentPageFeatures({ doctorTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

              {/* BULLETS / CLINICAL STANDARDS MANAGER */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Manage Feature Bullets</label>
                  <button
                    onClick={() => {
                      const currentBullets = tenant.branding.featuresConfig?.bullets || [
                        {
                          title: 'Licensed Clinicians & Surgeons',
                          description: 'Double fellowship-trained physicians with surgical experience.',
                          iconName: 'award',
                          highlightBadge: 'Accredited'
                        }
                      ];
                      const newBullets = [
                        ...currentBullets,
                        {
                          title: 'New Clinical Standard',
                          description: 'Description of protocol or technology...',
                          iconName: 'shield',
                          highlightBadge: 'Precision'
                        }
                      ];
                      onUpdateTenantBranding({
                        ...tenant.branding,
                        featuresConfig: {
                          ...(tenant.branding.featuresConfig || {}),
                          bullets: newBullets
                        }
                      });
                      showSubtleToast('Added new feature bullet!');
                    }}
                    className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Bullet</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                  {(tenant.branding.featuresConfig?.bullets || [
                    {
                      title: 'Licensed Clinicians & Surgeons',
                      description: 'Double fellowship-trained physicians and master injectors with 14+ years experience.',
                      iconName: 'award',
                      highlightBadge: 'Quad-A Accredited'
                    },
                    {
                      title: 'Customized Anatomical Care',
                      description: 'Every procedure mapped to bone structure, skin barrier density, and goals.',
                      iconName: 'heart',
                      highlightBadge: '3D Mapping'
                    },
                    {
                      title: 'Flexible Priority Scheduling',
                      description: 'Instant online slot reservations with refundable deposits.',
                      iconName: 'calendar',
                      highlightBadge: 'Direct Lock'
                    }
                  ]).map((bullet, bIdx) => (
                    <div key={bIdx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500">Feature #{bIdx + 1}</span>
                        <button
                          onClick={() => {
                            const current = tenant.branding.featuresConfig?.bullets || [];
                            const updated = current.filter((_, i) => i !== bIdx);
                            onUpdateTenantBranding({
                              ...tenant.branding,
                              featuresConfig: {
                                ...(tenant.branding.featuresConfig || {}),
                                bullets: updated
                              }
                            });
                            showSubtleToast('Removed bullet point');
                          }}
                          className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={bullet.title}
                        onChange={(e) => {
                          const current = [...(tenant.branding.featuresConfig?.bullets || [])];
                          current[bIdx] = { ...current[bIdx], title: e.target.value };
                          onUpdateTenantBranding({
                            ...tenant.branding,
                            featuresConfig: { ...(tenant.branding.featuresConfig || {}), bullets: current }
                          });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-semibold"
                        placeholder="Feature title..."
                      />
                      <textarea
                        rows={2}
                        value={bullet.description}
                        onChange={(e) => {
                          const current = [...(tenant.branding.featuresConfig?.bullets || [])];
                          current[bIdx] = { ...current[bIdx], description: e.target.value };
                          onUpdateTenantBranding({
                            ...tenant.branding,
                            featuresConfig: { ...(tenant.branding.featuresConfig || {}), bullets: current }
                          });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-600"
                        placeholder="Feature description..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

          {/* ===================================================== */}
          {/* CASE 6: TESTIMONIALS (GOOGLE PROFILE SYNC - CARD DESIGNS) */}
          {/* ===================================================== */}
          {activeElementId === 'reviews' && (() => {
            const currentReviews = pageCustomData?.reviews || tenant.branding.reviewsConfig || {};
            const updateCurrentPageReviews = (patch: Record<string, any>) => {
              if (onUpdatePageCustomData && currentPage) {
                onUpdatePageCustomData(currentPage, {
                  reviews: {
                    ...currentReviews,
                    ...patch
                  }
                });
              } else {
                onUpdateTenantBranding({
                  ...tenant.branding,
                  reviewsConfig: {
                    ...(tenant.branding.reviewsConfig || {}),
                    ...patch
                  }
                });
              }
            };

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-900 block text-xs flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Google Business Profile Connected
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    Reviews customized strictly for {activePageObj.name} (isolated page instance).
                  </span>
                </div>

                {/* CARD DESIGN PRESETS */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Card Design Preset</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'minimal_white', label: 'Minimal White Clean', desc: 'Crisp white with Google verification tag' },
                      { id: 'glass_frosted', label: 'Frosted Glass Tint', desc: '5% brand surface tint with luminous border' },
                      { id: 'editorial_quote', label: 'Editorial Quote Luxe', desc: 'Large serif pull-quote with gold star accents' },
                      { id: 'dark_luxury', label: 'Dark Slate Luxury', desc: 'Deep slate backdrop with high contrast' },
                      { id: 'clinical_trust', label: 'Clinical Trust Badge', desc: 'Accreditation header with verified seal' }
                    ].map((card) => {
                      const currentDesign = currentReviews?.cardDesign || 'minimal_white';
                      const isSelected = currentDesign === card.id;
                      return (
                        <button
                          key={card.id}
                          onClick={() => {
                            updateCurrentPageReviews({ cardDesign: card.id as any });
                            showSubtleToast(`Applied ${card.label} card design!`);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-xs font-semibold">{card.label}</div>
                          <div className="text-[10px] text-slate-500">{card.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* LAYOUT OPTIONS (>2 LAYOUTS) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Section Layout</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'bento_grid', label: 'Bento Mosaic' },
                      { id: 'three_col_cards', label: '3-Card Grid' },
                      { id: 'horizontal_marquee', label: 'Horizontal Strip' },
                      { id: 'split_spotlight', label: 'Spotlight Quote' }
                    ].map((lay) => (
                      <button
                        key={lay.id}
                        onClick={() => {
                          updateCurrentPageReviews({ layout: lay.id as any });
                          showSubtleToast(`Applied ${lay.label} layout!`);
                        }}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          (currentReviews?.layout || 'bento_grid') === lay.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{lay.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* CASE 7: CHERRY 0% FINANCING FULL SECTION */}
          {/* ===================================================== */}
          {activeElementId === 'cherry_financing' && (() => {
            const currentFinancing = pageCustomData?.financing || tenant.branding.financingConfig || {};
            const updateCurrentPageFinancing = (patch: Record<string, any>) => {
              if (onUpdatePageCustomData && currentPage) {
                onUpdatePageCustomData(currentPage, {
                  financing: {
                    ...currentFinancing,
                    ...patch
                  }
                });
              } else {
                onUpdateTenantBranding({
                  ...tenant.branding,
                  financingConfig: {
                    ...(tenant.branding.financingConfig || {}),
                    ...patch
                  }
                });
              }
            };

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900 block text-xs">
                    {activePageObj.name} • Cherry 0% APR Financing
                  </span>
                  <span className="text-[10px] text-blue-600">
                    Edits apply strictly to {activePageObj.name} (isolated page instance).
                  </span>
                </div>

                {/* LAYOUT OPTIONS (>2 LAYOUTS) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Financing Layout</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'spotlight_banner', label: 'Spotlight Banner' },
                      { id: 'calculator_card', label: 'Calculator Card' },
                      { id: 'split_trust', label: 'Split Trust Grid' },
                      { id: 'three_step_grid', label: '3-Step Process' }
                    ].map((lay) => (
                      <button
                        key={lay.id}
                        onClick={() => {
                          updateCurrentPageFinancing({ layout: lay.id as any });
                          showSubtleToast(`Applied ${lay.label} financing layout!`);
                        }}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          (currentFinancing?.layout || 'spotlight_banner') === lay.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{lay.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Headline</label>
                  <input
                    type="text"
                    value={currentFinancing?.headline || '0% APR Patient Financing with Cherry'}
                    onChange={(e) => updateCurrentPageFinancing({ headline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subhead Description</label>
                  <textarea
                    rows={2}
                    value={
                      currentFinancing?.subhead ||
                      'Split procedure balances over 3, 6, 12, or 24-month payment plans with zero credit impact.'
                    }
                    onChange={(e) => updateCurrentPageFinancing({ subhead: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* CASE 8: FAQ ACCORDION */}
          {/* ===================================================== */}
          {activeElementId === 'faq' && (() => {
            const currentFaq = pageCustomData?.faq || tenant.branding.faqConfig || {};
            const updateCurrentPageFaq = (patch: Record<string, any>) => {
              if (onUpdatePageCustomData && currentPage) {
                onUpdatePageCustomData(currentPage, {
                  faq: {
                    ...currentFaq,
                    ...patch
                  }
                });
              } else {
                onUpdateTenantBranding({
                  ...tenant.branding,
                  faqConfig: {
                    ...(tenant.branding.faqConfig || {}),
                    ...patch
                  }
                });
              }
            };

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900 block text-xs">
                    {activePageObj.name} • Patient FAQ Section
                  </span>
                  <span className="text-[10px] text-blue-600">
                    Questions here are isolated strictly to {activePageObj.name}.
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Section Headline</label>
                  <input
                    type="text"
                    value={currentFaq?.headline || 'Frequently Asked Clinical Questions'}
                    onChange={(e) => updateCurrentPageFaq({ headline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* CASE 9: CLINICAL MEDICAL TEAM */}
          {/* ===================================================== */}
          {activeElementId === 'team' && (() => {
            const currentTeam = pageCustomData?.team || tenant.branding.teamConfig || {};
            const updateCurrentPageTeam = (patch: Record<string, any>) => {
              if (onUpdatePageCustomData && currentPage) {
                onUpdatePageCustomData(currentPage, {
                  team: {
                    ...currentTeam,
                    ...patch
                  }
                });
              } else {
                onUpdateTenantBranding({
                  ...tenant.branding,
                  teamConfig: {
                    ...(tenant.branding.teamConfig || {}),
                    ...patch
                  }
                });
              }
            };

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900 block text-xs">
                    {activePageObj.name} • Clinical Medical Team
                  </span>
                  <span className="text-[10px] text-blue-600">
                    Edits apply strictly to {activePageObj.name} (isolated page instance).
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Team Layout</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'three_cards', label: '3-Card Grid' },
                      { id: 'horizontal_roster', label: 'Horizontal Roster' }
                    ].map((lay) => (
                      <button
                        key={lay.id}
                        onClick={() => {
                          updateCurrentPageTeam({ layout: lay.id });
                          showSubtleToast(`Applied ${lay.label} layout!`);
                        }}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          (currentTeam?.layout || 'three_cards') === lay.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{lay.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Section Headline</label>
                  <input
                    type="text"
                    value={currentTeam?.headline || 'Board-Certified Clinical Leadership'}
                    onChange={(e) => updateCurrentPageTeam({ headline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subhead Description</label>
                  <textarea
                    rows={2}
                    value={
                      currentTeam?.subhead ||
                      'Meet the fellowship-trained facial plastic surgeons and aesthetic clinicians directing your treatments.'
                    }
                    onChange={(e) => updateCurrentPageTeam({ subhead: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* CASE 10: BEFORE & AFTER GALLERY */}
          {/* ===================================================== */}
          {activeElementId === 'gallery' && (() => {
            const currentGallery = pageCustomData?.gallery || tenant.branding.galleryConfig || {};
            const updateCurrentPageGallery = (patch: Record<string, any>) => {
              if (onUpdatePageCustomData && currentPage) {
                onUpdatePageCustomData(currentPage, {
                  gallery: {
                    ...currentGallery,
                    ...patch
                  }
                });
              } else {
                onUpdateTenantBranding({
                  ...tenant.branding,
                  galleryConfig: {
                    ...(tenant.branding.galleryConfig || {}),
                    ...patch
                  }
                });
              }
            };

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900 block text-xs">
                    {activePageObj.name} • Before & After Case Studies
                  </span>
                  <span className="text-[10px] text-blue-600">
                    Edits apply strictly to {activePageObj.name} (isolated page instance).
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gallery Layout</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'three_cases', label: '3-Case Grid' },
                      { id: 'comparison_slider', label: 'Interactive Slider' }
                    ].map((lay) => (
                      <button
                        key={lay.id}
                        onClick={() => {
                          updateCurrentPageGallery({ layout: lay.id });
                          showSubtleToast(`Applied ${lay.label} layout!`);
                        }}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          (currentGallery?.layout || 'three_cases') === lay.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{lay.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Section Headline</label>
                  <input
                    type="text"
                    value={currentGallery?.headline || 'Clinical Outcomes & Patient Transformations'}
                    onChange={(e) => updateCurrentPageGallery({ headline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subhead Description</label>
                  <textarea
                    rows={2}
                    value={
                      currentGallery?.subhead ||
                      'Unretouched before-and-after results documented under standardized clinical lighting and 3D Canfield imaging.'
                    }
                    onChange={(e) => updateCurrentPageGallery({ subhead: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* CASE 11: VIP CONCIERGE MEMBERSHIP */}
          {/* ===================================================== */}
          {activeElementId === 'membership' && (() => {
            const currentMembership = pageCustomData?.membership || tenant.branding.membershipConfig || {};
            const updateCurrentPageMembership = (patch: Record<string, any>) => {
              if (onUpdatePageCustomData && currentPage) {
                onUpdatePageCustomData(currentPage, {
                  membership: {
                    ...currentMembership,
                    ...patch
                  }
                });
              } else {
                onUpdateTenantBranding({
                  ...tenant.branding,
                  membershipConfig: {
                    ...(tenant.branding.membershipConfig || {}),
                    ...patch
                  }
                });
              }
            };

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900 block text-xs">
                    {activePageObj.name} • VIP Membership Passes
                  </span>
                  <span className="text-[10px] text-blue-600">
                    Edits apply strictly to {activePageObj.name} (isolated page instance).
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Section Headline</label>
                  <input
                    type="text"
                    value={currentMembership?.headline || 'Aura VIP Membership Passes'}
                    onChange={(e) => updateCurrentPageMembership({ headline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subhead Description</label>
                  <textarea
                    rows={2}
                    value={
                      currentMembership?.subhead ||
                      'Monthly banked treatments, preferred Botox rates ($11/unit), and 10% dispensary savings.'
                    }
                    onChange={(e) => updateCurrentPageMembership({ subhead: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* CASE 12: LUXURY FOOTER (DETAILED EDIT: COLORS, LINKS) */}
          {/* ===================================================== */}
          {activeElementId === 'footer' && (() => {
            const currentFooter = pageCustomData?.footer || tenant.branding.footerConfig || {};
            const updateCurrentPageFooter = (patch: Record<string, any>) => {
              if (onUpdatePageCustomData && currentPage) {
                onUpdatePageCustomData(currentPage, {
                  footer: {
                    ...currentFooter,
                    ...patch
                  }
                });
              } else {
                onUpdateTenantBranding({
                  ...tenant.branding,
                  footerConfig: {
                    ...(tenant.branding.footerConfig || {}),
                    ...patch
                  }
                });
              }
            };

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900 block text-xs">
                    {activePageObj.name} • Footer Customizer
                  </span>
                  <span className="text-[10px] text-blue-600">
                    Edits apply strictly to {activePageObj.name} (isolated page instance).
                  </span>
                </div>

                {/* FOOTER DESIGN PRESET (>2 DESIGNS) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Footer Design Preset</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'dark_luxe', label: 'Dark Luxury' },
                      { id: 'alabaster_clean', label: 'Alabaster Clean' },
                      { id: 'brand_tinted', label: '5% Brand Tint' },
                      { id: 'modern_slate', label: 'Modern Slate' }
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          updateCurrentPageFooter({ design: d.id as any });
                          showSubtleToast(`Applied ${d.label} footer design!`);
                        }}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          (currentFooter?.design || 'dark_luxe') === d.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{d.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* FOOTER LAYOUT (>2 LAYOUTS) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Directory Layout</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: '5col_directory', label: '5-Col Directory' },
                      { id: '4col_clean', label: '4-Col Clean' },
                      { id: 'centered_luxe', label: 'Centered Luxe' },
                      { id: 'split_hours', label: 'Split Hours & Map' }
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          updateCurrentPageFooter({ layout: l.id as any });
                          showSubtleToast(`Applied ${l.label}!`);
                        }}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          (currentFooter?.layout || '5col_directory') === l.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{l.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CONTACT & SUITE FIELDS */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Suite Physical Address</label>
                  <textarea
                    rows={2}
                    value={
                      currentFooter?.address ||
                      '9601 Wilshire Blvd, Ste 420\nBeverly Hills, CA 90210'
                    }
                    onChange={(e) => updateCurrentPageFooter({ address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block text-[10px] mb-1">Telephone Contact</label>
                    <input
                      type="text"
                      value={currentFooter?.phone || '(310) 844-9120'}
                      onChange={(e) => updateCurrentPageFooter({ phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block text-[10px] mb-1">Concierge Email</label>
                    <input
                      type="text"
                      value={currentFooter?.email || 'concierge@auramedspa.com'}
                      onChange={(e) => updateCurrentPageFooter({ email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={currentFooter?.hours || 'Mon–Fri: 9am–6pm • Sat: 10am–4pm'}
                    onChange={(e) => updateCurrentPageFooter({ hours: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            );
          })()}

          {/* DEFAULT / NO SECTION SELECTED */}
          {!activeElementId && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-center py-4 space-y-2 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
                  <Sliders className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs">Page Sections Manager</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Select any section on the canvas to customize its layout, design variations, text, and styles.
                </p>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Active Sections on {activePageObj.name}
                </span>
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectElement(sec.id)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between cursor-pointer transition-all ${
                      sec.enabled
                        ? 'bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border-slate-200 text-slate-800'
                        : 'bg-slate-50/50 border-slate-100 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-mono font-bold text-slate-500">&lt;{sec.tag}&gt;</span>
                      <span className="font-medium truncate">{sec.label}</span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold shrink-0">Edit →</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      )}

        </div>
      </div>

      {/* Page Settings & SEO Modal */}
      {isSeoModalOpen && (
        <PageSeoModal
          isOpen={isSeoModalOpen}
          onClose={() => setIsSeoModalOpen(false)}
          pageConfig={
            pageSeoMap?.[editingSeoPageId] || {
              id: editingSeoPageId,
              name: enrichedPages.find((p) => p.id === editingSeoPageId)?.name || editingSeoPageId,
              slug: enrichedPages.find((p) => p.id === editingSeoPageId)?.path || `/${editingSeoPageId}`,
              titleTag: `${enrichedPages.find((p) => p.id === editingSeoPageId)?.name || editingSeoPageId} | Aura Aesthetics`,
              metaDescription: 'Personalized therapeutic medicine and radiofrequency contouring delivered by board-certified physicians in Beverly Hills.'
            }
          }
          onSave={(updated) => {
            if (onUpdatePageSeo) {
              onUpdatePageSeo(updated.id, updated);
            }
            showSubtleToast(`Saved SEO settings for ${updated.name}!`);
          }}
        />
      )}

      {/* Rich Component Block Insertion Modal */}
      <BlockInsertionModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onInsertBlock={(id, label, tag) => handleAddElement(id, label, tag)}
        existingSectionIds={sections.filter((s) => s.enabled).map((s) => s.id)}
        accentColor={tenant.branding.accentColor}
      />
    </div>
  );
};
