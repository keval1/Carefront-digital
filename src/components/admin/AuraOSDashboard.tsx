import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  Calendar as CalendarIcon,
  Users,
  Settings,
  HelpCircle,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Star,
  DollarSign,
  ChevronDown,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  SlidersHorizontal,
  X,
  MessageSquare,
  Send,
  UserCheck,
  Activity,
  Megaphone,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Tag,
  Eye,
  MoreHorizontal,
  Mic,
  ArrowUp,
  Download,
  Menu,
  Sun,
  Bell,
  Search,
  Check,
  Phone,
  Mail,
  Printer,
  RotateCcw,
  Stethoscope,
  Globe,
  LayoutDashboard,
  Filter,
  FileCheck,
  EyeOff,
  GitBranch,
  BarChart3,
  Receipt,
  Wallet,
  Layers,
  User,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tenant,
  Service,
  Provider,
  Appointment,
  Order,
  InboundLead,
  RecallLog,
  AdCreative,
  SeoArticle,
  BroadcastCampaign,
  AbandonedCheckout,
  CapacitySlot,
  ClinicalAftercareRecord
} from '../../types';
import {
  INITIAL_AD_CREATIVES,
  INITIAL_SEO_ARTICLES,
  INITIAL_BROADCAST_CAMPAIGNS,
  INITIAL_ABANDONED_CHECKOUTS,
  INITIAL_CAPACITY_SLOTS,
  INITIAL_AFTERCARE_RECORDS
} from '../../db';
import { OrdersDrawer } from './OrdersDrawer';
import { TreatmentFieldEditor } from './TreatmentFieldEditor';
import { UntitledMonthCalendar } from '../calendar/UntitledMonthCalendar';
import { MarketingAdsStudio } from './MarketingAdsStudio';
import { AbandonedCheckoutRecovery } from './AbandonedCheckoutRecovery';
import { CapacitySpotterView } from './CapacitySpotterView';
import { DiscountsPromotionManager, INITIAL_PROMOTIONS, PromotionCode } from './DiscountsPromotionManager';
import { OutreachAutomationsStudio } from './OutreachAutomationsStudio';
import { DetailedPracticeAnalytics } from './DetailedPracticeAnalytics';
import { DoctorUser, DR_DEMO, AVAILABLE_DOCTORS, DoctorAuthView } from './DoctorSessionManager';
import { ClinicalAftercareView } from './ClinicalAftercareView';

// Smooth Number Increment Component on Page Load & Filter Changes
const AnimatedNumber: React.FC<{ value: string; className?: string }> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    const match = value.match(/([\$,↗,▲,▼]*\s*)([\d,]+)(\.?\d*)(.*)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }
    const prefix = match[1] || '';
    const numStr = match[2].replace(/,/g, '');
    const targetNum = parseInt(numStr, 10);
    const decimal = match[3] || '';
    const suffix = match[4] || '';

    if (isNaN(targetNum) || targetNum <= 0) {
      setDisplayValue(value);
      return;
    }

    const duration = 650;
    const startTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(ease * targetNum);
      setDisplayValue(`${prefix}${current.toLocaleString('en-US')}${decimal}${suffix}`);

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  return <span className={className}>{displayValue}</span>;
};

interface AuraOSDashboardProps {
  tenant: Tenant;
  services: Service[];
  providers?: Provider[];
  appointments: Appointment[];
  orders: Order[];
  inboundLeads: InboundLead[];
  recallLogs: RecallLog[];
  onUpdateService: (updated: Service) => void;
  onAddService?: (newService: Service) => void;
  onAddAppointment?: (newApt: Appointment) => void;
  onSimulateMissedCall: () => void;
  isSimulatingMissedCall: boolean;
  onToast?: (msg: string) => void;
  onNavigateToView: (view: 'admin' | 'editor') => void;
  currentView?: 'admin' | 'editor';
  promotions?: PromotionCode[];
  onUpdatePromotions?: (updated: PromotionCode[]) => void;
  activeDoctor?: DoctorUser;
  onUpdateDoctor?: (doctor: DoctorUser) => void;
}

export const AuraOSDashboard: React.FC<AuraOSDashboardProps> = ({
  tenant,
  services,
  providers = [],
  appointments,
  orders,
  inboundLeads,
  recallLogs,
  onUpdateService,
  onAddService,
  onAddAppointment,
  onSimulateMissedCall,
  isSimulatingMissedCall,
  onToast,
  onNavigateToView,
  currentView = 'admin',
  promotions: propPromotions,
  onUpdatePromotions,
  activeDoctor: propActiveDoctor,
  onUpdateDoctor
}) => {
  const [appointmentsState, setAppointmentsState] = useState<Appointment[]>(appointments);

  React.useEffect(() => {
    setAppointmentsState(appointments);
  }, [appointments]);

  // Active Doctor Session (Defaults to Dr. Demo: Dr. Sarah Jenkins, M.D.)
  const [activeDoctor, setActiveDoctor] = useState<DoctorUser>(propActiveDoctor || DR_DEMO);
  const [isDoctorAuthModalOpen, setIsDoctorAuthModalOpen] = useState(false);
  const [isSystemHealthModalOpen, setIsSystemHealthModalOpen] = useState(false);

  React.useEffect(() => {
    if (propActiveDoctor) {
      setActiveDoctor(propActiveDoctor);
    }
  }, [propActiveDoctor]);

  // Navigation Menu Active Tab
  const [activeMenu, setActiveMenu] = useState<
    | 'dashboard'
    | 'calendar'
    | 'treatments'
    | 'orders'
    | 'customers'
    | 'discounts'
    | 'abandoned_checkouts'
    | 'finances_overview'
    | 'finances_transactions'
    | 'finances_payouts'
    | 'automations_canvas'
    | 'automations_lead_qualification'
    | 'automations_aftercare'
    | 'automations_retention'
    | 'analytics_overview'
    | 'analytics_retention'
    | 'analytics_scheduling'
    | 'analytics_acceptance'
    | 'analytics_google_analytics'
    | 'marketing_ads'
    | 'marketing_seo'
    | 'marketing_broadcasts'
    | 'capacity_spotter'
    | 'clinical_aftercare'
    | 'retention'
    | 'settings'
    | 'help'
  >('dashboard');

  // Accordion Toggles
  const [isFinancesOpen, setIsFinancesOpen] = useState(true);
  const [isAutomationsOpen, setIsAutomationsOpen] = useState(true);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(true);
  const [isMarketingOpen, setIsMarketingOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Top Left Active Workspace Mode Dropdown
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  // Mobile / Tablet Sidebar Drawer State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Shared Data States - Synchronized with App-level promotions
  const [promotions, setPromotions] = useState<PromotionCode[]>(propPromotions || INITIAL_PROMOTIONS);

  React.useEffect(() => {
    if (propPromotions) {
      setPromotions(propPromotions);
    }
  }, [propPromotions]);
  const [adCreatives, setAdCreatives] = useState<AdCreative[]>(INITIAL_AD_CREATIVES);
  const [seoArticles, setSeoArticles] = useState<SeoArticle[]>(INITIAL_SEO_ARTICLES);
  const [broadcastCampaigns, setBroadcastCampaigns] = useState<BroadcastCampaign[]>(INITIAL_BROADCAST_CAMPAIGNS);
  const [abandonedCheckouts, setAbandonedCheckouts] = useState<AbandonedCheckout[]>(INITIAL_ABANDONED_CHECKOUTS);
  const [capacitySlots, setCapacitySlots] = useState<CapacitySlot[]>(INITIAL_CAPACITY_SLOTS);
  const [aftercareRecords, setAftercareRecords] = useState<ClinicalAftercareRecord[]>(INITIAL_AFTERCARE_RECORDS);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingTreatment, setIsAddingTreatment] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false);
  const [selectedCustomerForModal, setSelectedCustomerForModal] = useState<InboundLead | null>(null);
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null);

  // Widgets Visibility in Customize Modal
  const [visibleWidgets, setVisibleWidgets] = useState({
    capacityAlertBanner: true,
    kpiCards: true,
    totalProfitChart: true,
    dayActiveBarChart: true,
    repeatPatientGauge: true,
    bestSellingTreatments: true,
    aiAssistantWidget: true,
    teamCollaboration: true,
    speedToLeadEngine: true,
    frontDeskChatbot: true
  });

  // Date Range State & Tiny Calendar Popover
  const [dateRangePreset, setDateRangePreset] = useState<'7d' | '30d' | '90d' | 'year'>('30d');
  const [dateRangeLabel, setDateRangeLabel] = useState('Jan 1, 2026 – Feb 1, 2026');
  const [isDateCalendarOpen, setIsDateCalendarOpen] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(15);

  // Dynamic KPI Data based on Date Range
  const getKpiData = () => {
    switch (dateRangePreset) {
      case '7d':
        return {
          revenue: '$4,820',
          revGrowth: '▲ 9.2%',
          revPeriod: 'vs. 4,414 last 7 days',
          deposits: '$1,850',
          depGrowth: '▲ 12.1%',
          depPeriod: 'vs. 1,650 last 7 days',
          leads: '84',
          leadsGrowth: '▲ 6.4%',
          leadsPeriod: 'vs. 79 last 7 days',
          orders: '298',
          ordGrowth: '▲ 5.2%',
          ordPeriod: 'vs. 283 last 7 days',
          profit: '$112.4K'
        };
      case '90d':
        return {
          revenue: '$52,890',
          revGrowth: '▲ 18.4%',
          revPeriod: 'vs. 44,670 last 90 days',
          deposits: '$19,450',
          depGrowth: '▲ 14.2%',
          depPeriod: 'vs. 17,030 last 90 days',
          leads: '1,048',
          leadsGrowth: '▲ 22.0%',
          leadsPeriod: 'vs. 859 last 90 days',
          orders: '3,840',
          ordGrowth: '▲ 11.5%',
          ordPeriod: 'vs. 3,444 last 90 days',
          profit: '$894.2K'
        };
      case 'year':
        return {
          revenue: '$198,420',
          revGrowth: '▲ 24.8%',
          revPeriod: 'vs. 158,990 last year',
          deposits: '$74,200',
          depGrowth: '▲ 19.5%',
          depPeriod: 'vs. 62,100 last year',
          leads: '4,120',
          leadsGrowth: '▲ 31.4%',
          leadsPeriod: 'vs. 3,135 last year',
          orders: '14,890',
          ordGrowth: '▲ 16.8%',
          ordPeriod: 'vs. 12,748 last year',
          profit: '$1.42M'
        };
      case '30d':
      default:
        return {
          revenue: '$16,431',
          revGrowth: '▲ 15.5%',
          revPeriod: 'vs. 14,132 last period',
          deposits: '$6,225',
          depGrowth: '▲ 8.4%',
          depPeriod: 'vs. 5,742 last period',
          leads: '342',
          leadsGrowth: '▼ 10.5%',
          leadsPeriod: 'vs. 3,164 last period',
          orders: '1,224',
          ordGrowth: '↗ 4.4%',
          ordPeriod: 'vs. 1,172 last period',
          profit: '$446.7K'
        };
    }
  };

  const kpis = getKpiData();

  // Total Profit Chart 12-Month Timeline (Starts far left Jan through Oct present month, plus projected Nov & Dec)
  const monthlyProfitData = [
    { month: 'Jan', profit: '$28,400', prev: '$25,000', change: '+13.6%', x: 50, y: 160, isProjected: false },
    { month: 'Feb', profit: '$32,100', prev: '$28,400', change: '+13.0%', x: 150, y: 148, isProjected: false },
    { month: 'Mar', profit: '$36,800', prev: '$32,100', change: '+14.6%', x: 250, y: 138, isProjected: false },
    { month: 'Apr', profit: '$34,200', prev: '$36,800', change: '-7.0%', x: 350, y: 144, isProjected: false },
    { month: 'May', profit: '$44,500', prev: '$34,200', change: '+30.1%', x: 450, y: 115, isProjected: false },
    { month: 'Jun', profit: '$48,000', prev: '$44,500', change: '+7.8%', x: 550, y: 102, isProjected: false },
    { month: 'Jul', profit: '$52,000', prev: '$48,000', change: '+8.3%', x: 650, y: 90, isProjected: false },
    { month: 'Aug', profit: '$54,300', prev: '$52,000', change: '+4.4%', x: 750, y: 82, isProjected: false },
    { month: 'Sep', profit: '$57,800', prev: '$54,300', change: '+6.4%', x: 850, y: 70, isProjected: false },
    { month: 'Oct', profit: '$62,400', prev: '$57,800', change: '+8.0%', x: 950, y: 56, isCurrent: true, isProjected: false },
    // Future profits (Projected):
    { month: 'Nov', profit: '$66,500', prev: '$62,400', change: '+6.6% (proj)', x: 1050, y: 46, isProjected: true },
    { month: 'Dec', profit: '$71,200', prev: '$66,500', change: '+7.1% (proj)', x: 1150, y: 36, isProjected: true }
  ];
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number>(9); // Default to October (present month)

  // Top Bar Search & Auto-Suggestions State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Weekly Procedure Volume & Capacity (Sun - Sat) with hover count & color transition
  const [hoveredDay, setHoveredDay] = useState<string>('Mon');
  const weeklyVolumeData = [
    { day: 'Sun', volume: '3,210', height: '48%' },
    { day: 'Mon', volume: '6,532', height: '90%' },
    { day: 'Tue', volume: '3,940', height: '54%' },
    { day: 'Wed', volume: '3,120', height: '44%' },
    { day: 'Thu', volume: '2,750', height: '36%' },
    { day: 'Fri', volume: '4,820', height: '62%' },
    { day: 'Sat', volume: '5,140', height: '70%' }
  ];

  // Best Selling Treatments Filter & Data
  const [treatmentCategoryFilter, setTreatmentCategoryFilter] = useState<'all' | 'injectables' | 'laser_rf' | 'facials'>('all');
  const bestSellingTreatments = [
    {
      id: '#TX-101',
      name: 'Morpheus8 RF Dermal Lift',
      category: 'laser_rf',
      categoryLabel: 'Laser & RF',
      price: '$850.00',
      totalSales: '$125,800.00',
      volume: '148 procedures',
      rating: '4.9',
      badge: 'Bestseller'
    },
    {
      id: '#TX-102',
      name: 'Botox Cosmetic (40-Unit Bundle)',
      category: 'injectables',
      categoryLabel: 'Injectables',
      price: '$520.00',
      totalSales: '$162,240.00',
      volume: '312 procedures',
      rating: '4.9',
      badge: 'High Yield'
    },
    {
      id: '#TX-103',
      name: 'Lip Architecture & Micro-Contour',
      category: 'injectables',
      categoryLabel: 'Injectables',
      price: '$680.00',
      totalSales: '$63,920.00',
      volume: '94 procedures',
      rating: '4.8',
      badge: 'Signature'
    },
    {
      id: '#TX-104',
      name: 'Medical Hydrafacial MD Elite',
      category: 'facials',
      categoryLabel: 'Facials',
      price: '$325.00',
      totalSales: '$68,250.00',
      volume: '210 procedures',
      rating: '4.9',
      badge: 'Recurring Club'
    },
    {
      id: '#TX-105',
      name: 'Clear + Brilliant Perméa Laser',
      category: 'laser_rf',
      categoryLabel: 'Laser & RF',
      price: '$450.00',
      totalSales: '$38,700.00',
      volume: '86 procedures',
      rating: '4.8',
      badge: 'Low Downtime'
    }
  ];

  const filteredTreatments = treatmentCategoryFilter === 'all'
    ? bestSellingTreatments
    : bestSellingTreatments.filter((t) => t.category === treatmentCategoryFilter);

  // Customer Spreadsheet Directory State
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<'all' | 'consult_booked' | 'active_series' | 'vip_member' | 'lead'>('all');

  // AI Assistant in Card
  const [aiAssistantInput, setAiAssistantInput] = useState('');
  const [aiAssistantReply, setAiAssistantReply] = useState<string | null>(null);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  // Settings State
  const [settingsTab, setSettingsTab] = useState<'practice' | 'booking' | 'emr' | 'payments' | 'ai_rules'>('practice');
  const [depositAmountSetting, setDepositAmountSetting] = useState('75');
  const [autoSmsDelaySetting, setAutoSmsDelaySetting] = useState('14');

  const triggerToast = (msg: string) => {
    if (onToast) {
      setTimeout(() => {
        onToast(msg);
      }, 0);
    }
  };

  const handleAiAssistantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiAssistantInput.trim()) return;
    setIsAssistantThinking(true);
    const query = aiAssistantInput;
    setAiAssistantInput('');

    setTimeout(() => {
      setIsAssistantThinking(false);
      const lower = query.toLowerCase();
      if (lower.includes('revenue') || lower.includes('profit') || lower.includes('sales')) {
        setAiAssistantReply(
          `Total profit is ${kpis.profit} (${kpis.revGrowth} vs last period). July is your highest grossing month at $52K with Morpheus8 RF packages leading yield.`
        );
      } else if (lower.includes('capacity') || lower.includes('slot') || lower.includes('open')) {
        setAiAssistantReply(
          `Detected 2 open treatment slots this Thursday afternoon with Dr. Jenkins ($2,950 unrealized revenue). You can launch a flash booking SMS to 18 waitlisted patients.`
        );
      } else if (lower.includes('botox') || lower.includes('tox') || lower.includes('morpheus')) {
        setAiAssistantReply(
          `Morpheus8 RF Dermal Lift is currently booked at 92% capacity with $100 upfront deposits. 14 abandoned checkouts ($12,400) have been recovered via AI SMS.`
        );
      } else {
        setAiAssistantReply(
          `Analysis complete: Aura Aesthetics is operating at 94% retention with ${kpis.leads} AI leads converted (14s avg response) and ${kpis.deposits} in secured upfront deposits.`
        );
      }
    }, 500);
  };

  // Dedicated Navigation Menu Item Component
  const NavItem: React.FC<{
    id: typeof activeMenu;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeCount?: number;
  }> = ({ id, label, icon: Icon, badgeCount }) => {
    const isActive = activeMenu === id;
    return (
      <button
        onClick={() => {
          setActiveMenu(id);
          setIsMobileSidebarOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          isActive
            ? 'bg-[#EEF4FF] text-[#2563EB]'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3 truncate">
          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`} />
          <span className="truncate">{label}</span>
        </div>
        {badgeCount !== undefined && badgeCount > 0 && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-colors ${
              isActive ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {badgeCount}
          </span>
        )}
      </button>
    );
  };

  // Reusable Card Action Popover for all 3-dots menus
  const CardMenu: React.FC<{
    id: string;
    title: string;
    widgetKey?: keyof typeof visibleWidgets;
    onConfigure?: () => void;
    onExport?: () => void;
  }> = ({ id, title, widgetKey, onConfigure, onExport }) => {
    if (activeCardMenuId !== id) return null;
    return (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={(e) => {
            e.stopPropagation();
            setActiveCardMenuId(null);
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-2 top-11 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 z-50 text-xs w-52 space-y-0.5 text-slate-700 pointer-events-auto"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            {title} Actions
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveCardMenuId(null);
              if (onConfigure) {
                onConfigure();
              } else {
                setIsCustomizeOpen(true);
              }
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Configure Metrics</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveCardMenuId(null);
              if (onExport) {
                onExport();
              } else {
                triggerToast(`Exported ${title} metrics to CSV.`);
              }
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Data CSV</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveCardMenuId(null);
              triggerToast(`Refreshed live data for ${title}.`);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Refresh Live Data</span>
          </button>
          {widgetKey && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveCardMenuId(null);
                setVisibleWidgets((prev) => ({ ...prev, [widgetKey]: false }));
                triggerToast(`"${title}" hidden. You can restore it anytime from "Customize Dashboard".`);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide Widget</span>
            </button>
          )}
        </motion.div>
      </>
    );
  };

  // Search anything suggestions across navigation pages, clinical procedures, and website editor
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const items: Array<{
      id: string;
      title: string;
      category: 'Page' | 'Treatment' | 'Tool' | 'Mode';
      subtext: string;
      icon?: any;
      iconColor?: string;
      iconBg?: string;
      action: () => void;
    }> = [
      {
        id: 'nav-dashboard',
        title: 'Practice OS Dashboard',
        category: 'Page',
        subtext: 'Overview, live KPIs, orders & revenue',
        icon: LayoutGrid,
        iconColor: '#2563EB',
        iconBg: '#EFF6FF',
        action: () => { setActiveMenu('dashboard'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-appointments',
        title: 'Appointments & Schedule',
        category: 'Page',
        subtext: 'Timetable, calendar & patient bookings',
        icon: CalendarIcon,
        iconColor: '#0284C7',
        iconBg: '#E0F2FE',
        action: () => { setActiveMenu('calendar'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-treatments',
        title: 'Treatments & Catalog',
        category: 'Page',
        subtext: 'Manage procedures, deposits & pricing',
        icon: Sparkles,
        iconColor: '#E11D48',
        iconBg: '#FFE4E6',
        action: () => { setActiveMenu('treatments'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-orders',
        title: 'Orders & Receipts',
        category: 'Page',
        subtext: 'Patient deposits, checkouts & receipts',
        icon: ShoppingBag,
        iconColor: '#059669',
        iconBg: '#D1FAE5',
        action: () => { setActiveMenu('orders'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-customers',
        title: 'Customers & Leads',
        category: 'Page',
        subtext: 'Patient charts & AI Speed-to-Lead triage',
        icon: Users,
        iconColor: '#7C3AED',
        iconBg: '#EDE9FE',
        action: () => { setActiveMenu('customers'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-discounts',
        title: 'Discounts & Promotions',
        category: 'Page',
        subtext: 'Manage clinic promo codes & checkout visibility',
        icon: Tag,
        iconColor: '#D97706',
        iconBg: '#FEF3C7',
        action: () => { setActiveMenu('discounts'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-abandoned',
        title: 'Abandoned Checkout Recovery',
        category: 'Page',
        subtext: 'Automated SMS cart drop-off recovery engine',
        icon: ShoppingCart,
        iconColor: '#EA580C',
        iconBg: '#FFEDD5',
        action: () => { setActiveMenu('abandoned_checkouts'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-automations',
        title: 'Outreach & Lead Automations',
        category: 'Tool',
        subtext: 'Movable canvas for Meta/Google ads lead qualification & aftercare',
        icon: GitBranch,
        iconColor: '#4F46E5',
        iconBg: '#EEF2FF',
        action: () => { setActiveMenu('automations_canvas'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-analytics',
        title: 'Detailed Practice Analytics',
        category: 'Tool',
        subtext: 'Retention, chair scheduling, treatment acceptance & Google Analytics',
        icon: BarChart3,
        iconColor: '#0891B2',
        iconBg: '#CFFAFE',
        action: () => { setActiveMenu('analytics_overview'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-finances-ov',
        title: 'Finances Overview',
        category: 'Page',
        subtext: 'Net collections, revenue & operating margins',
        icon: DollarSign,
        iconColor: '#16A34A',
        iconBg: '#DCFCE7',
        action: () => { setActiveMenu('finances_overview'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-finances-tx',
        title: 'Transactions & Receipts',
        category: 'Page',
        subtext: 'Stripe deposits, cash receipts & itemized refunds',
        icon: Receipt,
        iconColor: '#475569',
        iconBg: '#F1F5F9',
        action: () => { setActiveMenu('finances_transactions'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-finances-po',
        title: 'Finances Payouts',
        category: 'Page',
        subtext: 'Bank transfers & weekly direct deposits',
        icon: Wallet,
        iconColor: '#2563EB',
        iconBg: '#DBEAFE',
        action: () => { setActiveMenu('finances_payouts'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-marketing-ads',
        title: 'Meta & Google Ads Studio',
        category: 'Tool',
        subtext: 'Generate high-converting social & search ad copy',
        icon: Megaphone,
        iconColor: '#C026D3',
        iconBg: '#FAE8FF',
        action: () => { setActiveMenu('marketing_ads'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-marketing-seo',
        title: 'SEO & Local Google Rank',
        category: 'Tool',
        subtext: 'AI clinical guides & Schema.org JSON-LD',
        icon: Search,
        iconColor: '#0D9488',
        iconBg: '#CCFBF1',
        action: () => { setActiveMenu('marketing_seo'); setIsSearchOpen(false); setSearchQuery(''); }
      },
      {
        id: 'nav-editor',
        title: 'Website Editor Visual Canvas',
        category: 'Mode',
        subtext: 'Switch to live storefront builder & typography editor',
        icon: Globe,
        iconColor: '#2563EB',
        iconBg: '#EFF6FF',
        action: () => { onNavigateToView('editor'); setIsSearchOpen(false); setSearchQuery(''); }
      }
    ];

    // Add clinical services from catalog with category-specific clinical icons
    services.forEach((s) => {
      const cat = s.category.toLowerCase();
      let icon = Sparkles;
      let iconColor = '#7C3AED';
      let iconBg = '#EDE9FE';

      if (cat.includes('neurotoxin') || cat.includes('inject')) {
        icon = Zap;
        iconColor = '#E11D48';
        iconBg = '#FFE4E6';
      } else if (cat.includes('laser') || cat.includes('rf') || cat.includes('energy')) {
        icon = Zap;
        iconColor = '#D97706';
        iconBg = '#FEF3C7';
      }

      items.push({
        id: `srv-${s.id}`,
        title: s.name,
        category: 'Treatment',
        subtext: `${s.category.replace('_', ' ')} • $${s.retailPriceCents / 100} (${s.durationMinutes}m)`,
        icon,
        iconColor,
        iconBg,
        action: () => {
          setActiveMenu('treatments');
          setEditingService(s);
          setIsSearchOpen(false);
          setSearchQuery('');
        }
      });
    });

    if (!q) return items.slice(0, 6);
    return items.filter((it) =>
      it.title.toLowerCase().includes(q) ||
      it.subtext.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery, services, onNavigateToView]);

  return (
    <div className="carefront-dashboard font-manrope h-full w-full bg-[#F8FAFC] flex text-slate-800 antialiased overflow-hidden select-none relative">
      
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR (CLEAN, NO DUPLICATE LOGO, TOGGLE DROPDOWN) */}
      {/* ======================================================== */}
      
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none overflow-visible transition-transform duration-200 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Section (Aligned to top menu bar, height 14) */}
        <div className="h-14 px-4 border-b border-slate-200/80 flex items-center shrink-0 relative overflow-visible z-50">
          <div className="relative w-full">
            <button
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer border border-transparent hover:border-slate-100"
              title="Switch Active Workspace Mode"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {/* Modern dual-ring medical spa logo mark */}
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
                  <div className="text-[11px] text-slate-400 font-medium leading-tight">
                    Practice OS (/)
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
                  className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 w-64 z-[999] text-xs text-slate-800"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Workspace Mode
                  </div>

                  {/* Mode 1: Practice OS Dashboard */}
                  <button
                    onClick={() => {
                      onNavigateToView('admin');
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50/80 text-blue-700 font-bold cursor-pointer text-left border border-blue-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                        <LayoutDashboard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Practice OS Dashboard</div>
                        <div className="text-[10px] text-blue-600 font-normal">EMR, orders, leads & analytics (/)</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  </button>

                  {/* Mode 2: Website Editor */}
                  <button
                    onClick={() => {
                      onNavigateToView('editor');
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer text-left mt-1 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Website Editor</div>
                        <div className="text-[10px] text-slate-400 font-normal">Visual storefront canvas (/editor)</div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="space-y-4">
            
            {/* GROUP 1: CORE OPERATIONS */}
            <div className="space-y-1">
              <NavItem id="dashboard" label="Dashboard" icon={LayoutGrid} />
              <NavItem id="calendar" label="Appointments" icon={CalendarIcon} badgeCount={appointmentsState.length} />
              <NavItem id="treatments" label="Treatments" icon={Sparkles} badgeCount={services.length} />
              <NavItem id="orders" label="Orders" icon={ShoppingBag} badgeCount={orders.length} />
              <NavItem id="customers" label="Customers" icon={Users} badgeCount={inboundLeads.length} />
              <NavItem id="discounts" label="Discounts" icon={Tag} badgeCount={promotions.length} />
              <NavItem id="abandoned_checkouts" label="Abandoned Recovery" icon={ShoppingCart} badgeCount={abandonedCheckouts.length} />
            </div>

            {/* GROUP 2: FINANCES */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <button
                onClick={() => setIsFinancesOpen(!isFinancesOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Finances</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isFinancesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFinancesOpen && (
                <div className="pl-9 pr-2 space-y-1 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setActiveMenu('finances_overview');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'finances_overview' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('finances_transactions');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'finances_transactions' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Transactions & Receipts
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('finances_payouts');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'finances_payouts' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Payouts
                  </button>
                </div>
              )}
            </div>

            {/* GROUP 3: AUTOMATIONS (Replaces email/sms broadcast, aftercare & retention into separate dropdown tab) */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="flex items-center justify-between px-2 py-1 rounded-xl hover:bg-slate-50 transition-colors">
                <button
                  onClick={() => {
                    setIsAutomationsOpen(true);
                    setActiveMenu('automations_canvas');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`flex-1 flex items-center gap-3 px-1.5 py-1 text-xs font-semibold rounded-lg text-left cursor-pointer transition-colors ${
                    activeMenu.startsWith('automations_') ? 'text-[#2563EB] font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GitBranch className={`w-4 h-4 shrink-0 ${activeMenu.startsWith('automations_') ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                  <span>Automations</span>
                </button>
                <button
                  onClick={() => setIsAutomationsOpen(!isAutomationsOpen)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer transition-transform"
                  title="Toggle Automations Submenu"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAutomationsOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isAutomationsOpen && (
                <div className="pl-9 pr-2 space-y-1 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setActiveMenu('automations_canvas');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'automations_canvas' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Workflow Canvas Builder
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('automations_lead_qualification');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'automations_lead_qualification' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Lead Qualification (Ads &amp; Web)
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('automations_aftercare');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'automations_aftercare' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Clinical Aftercare
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('automations_retention');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'automations_retention' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    90-Day Retention &amp; Recall
                  </button>
                </div>
              )}
            </div>

            {/* GROUP 4: DETAILED ANALYTICS (Dropdown menu item with all inner pages) */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="flex items-center justify-between px-2 py-1 rounded-xl hover:bg-slate-50 transition-colors">
                <button
                  onClick={() => {
                    setIsAnalyticsOpen(true);
                    setActiveMenu('analytics_overview');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`flex-1 flex items-center gap-3 px-1.5 py-1 text-xs font-semibold rounded-lg text-left cursor-pointer transition-colors ${
                    activeMenu.startsWith('analytics_') ? 'text-[#2563EB] font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className={`w-4 h-4 shrink-0 ${activeMenu.startsWith('analytics_') ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer transition-transform"
                  title="Toggle Analytics Submenu"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAnalyticsOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isAnalyticsOpen && (
                <div className="pl-9 pr-2 space-y-1 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setActiveMenu('analytics_overview');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'analytics_overview' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Practice Overview
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('analytics_retention');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'analytics_retention' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Patient Retention &amp; LTV
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('analytics_scheduling');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'analytics_scheduling' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Scheduling &amp; Room Utilization
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('analytics_acceptance');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'analytics_acceptance' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Treatment Plan Acceptance
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('analytics_google_analytics');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'analytics_google_analytics' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Google Analytics (GA4) &amp; Web
                  </button>
                </div>
              )}
            </div>

            {/* GROUP 5: MARKETING STUDIO (Meta & Google Ads, SEO) */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <button
                onClick={() => setIsMarketingOpen(!isMarketingOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Megaphone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Marketing Studio</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isMarketingOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMarketingOpen && (
                <div className="pl-9 pr-2 space-y-1 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setActiveMenu('marketing_ads');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'marketing_ads' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Meta &amp; Google Ads
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('marketing_seo');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeMenu === 'marketing_seo' ? 'bg-[#EEF4FF] text-[#2563EB] font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    SEO &amp; Local Rank
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Sidebar Bottom: Settings, Help, Operational Status Card */}
        <div className="p-5 pt-3 border-t border-slate-100 shrink-0 space-y-3">
          <div className="space-y-1">
            <NavItem id="settings" label="Settings" icon={Settings} />
            <NavItem id="help" label="Help" icon={HelpCircle} />
          </div>

          {/* Complete Operational Systems Status Card with full necessary information */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800 text-[11px]">All Systems Operational</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-bold">
                99.99% Uptime
              </span>
            </div>

            {/* Essential Clinical System Health Metrics */}
            <div className="space-y-1.5 text-[10px] text-slate-500 pt-0.5 font-medium">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Aesthetic Record EMR
                </span>
                <span className="text-emerald-700 font-mono font-semibold">Synced (42ms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Stripe &amp; Cherry Gateway
                </span>
                <span className="text-emerald-700 font-mono font-semibold">Live (0% APR)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Carefront Edge CDN
                </span>
                <span className="text-blue-700 font-mono font-semibold">SSL 256-bit</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[9px]">
              <span className="text-slate-400 font-mono">0 Incidents (90d)</span>
              <button
                onClick={() => setIsSystemHealthModalOpen(true)}
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
              >
                Inspect Health &rarr;
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA WITH UNIFIED TOP HEADER */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Bar across content: Mobile trigger, Search Pill, Theme Sun, Bell, JD Avatar */}
        <header className="h-14 w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shrink-0 z-30">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Interactive Search Bar with Auto-Suggestions & ⌘ K */}
            <div className="relative">
              <div className="w-64 sm:w-80 md:w-96 bg-[#F8FAFC] border border-slate-200/80 rounded-full px-4 py-2 text-xs text-slate-600 flex items-center gap-2.5 shadow-2xs hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchSuggestions.length > 0) {
                      e.preventDefault();
                      searchSuggestions[0].action();
                    } else if (e.key === 'Escape') {
                      setIsSearchOpen(false);
                    }
                  }}
                  placeholder="Search anything (pages, treatments, editor)..."
                  className="bg-transparent border-none outline-none text-xs text-slate-800 w-full placeholder:text-slate-400 font-medium"
                />
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200/80 font-semibold shrink-0">
                    ⌘ K
                  </kbd>
                )}
              </div>

              {/* Auto-suggestions dropdown */}
              {isSearchOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-2 z-50 text-xs text-slate-800 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span>{searchQuery ? `Search Results (${searchSuggestions.length})` : 'Quick Navigation Suggestions'}</span>
                      <span className="font-mono text-[9px] text-slate-400">ESC to close</span>
                    </div>
                    {searchSuggestions.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-xs">
                        No matches found for "{searchQuery}".
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto space-y-0.5 pt-1">
                        {searchSuggestions.map((item) => (
                          <button
                            key={item.id}
                            onClick={item.action}
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors shadow-2xs"
                                style={{
                                  backgroundColor: item.iconBg || '#EFF6FF',
                                  color: item.iconColor || '#2563EB'
                                }}
                              >
                                {item.icon ? (
                                  <item.icon className="w-3.5 h-3.5" />
                                ) : item.category === 'Mode' ? (
                                  <Globe className="w-3.5 h-3.5" />
                                ) : item.category === 'Treatment' ? (
                                  <Sparkles className="w-3.5 h-3.5" />
                                ) : (
                                  <LayoutDashboard className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <div className="truncate">
                                <div className="font-bold text-slate-800 group-hover:text-blue-600 truncate">
                                  {item.title}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {item.subtext}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase shrink-0 ${
                                item.category === 'Mode'
                                  ? 'bg-purple-50 text-purple-700'
                                  : item.category === 'Treatment'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : item.category === 'Tool'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.category}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center gap-3">
            {/* Theme Sun Toggle */}
            <button
              onClick={() => triggerToast('Light luxury mode active with Manrope typography.')}
              className="w-9 h-9 border border-slate-200/80 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
              title="Theme: Light Mode"
            >
              <Sun className="w-4 h-4" />
            </button>

            {/* Notification Bell with indicator dot */}
            <button
              onClick={() => triggerToast('Notifications: 3 unread patient chart updates from Aesthetic Record.')}
              className="w-9 h-9 border border-slate-200/80 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 relative flex items-center justify-center transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 bg-emerald-500 rounded-full absolute top-2 right-2 border-2 border-white" />
            </button>

            {/* Circular Doctor Profile Avatar with Details Dropdown & Session Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                style={{ backgroundColor: activeDoctor.avatarBg, color: activeDoctor.avatarColor }}
                className="w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center border border-slate-200/80 shadow-2xs cursor-pointer hover:ring-2 hover:ring-blue-500/20 transition-all relative"
                title={`${activeDoctor.name} • ${activeDoctor.title} (Active Session)`}
              >
                <span>{activeDoctor.initials}</span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-white" />
              </button>

              {isUserDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-84 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 text-xs text-slate-800 space-y-3.5 animate-in fade-in zoom-in-95 duration-100">
                    
                    {/* User Header with Active Session Info */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div
                        style={{ backgroundColor: activeDoctor.avatarBg, color: activeDoctor.avatarColor }}
                        className="w-11 h-11 rounded-full font-extrabold text-sm flex items-center justify-center border border-slate-200/60 shrink-0 shadow-xs"
                      >
                        {activeDoctor.initials}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 truncate">
                          <span className="truncate">{activeDoctor.name}</span>
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded shrink-0">
                            {activeDoctor.initials}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{activeDoctor.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{activeDoctor.email}</div>
                      </div>
                    </div>

                    {/* Practice & Compliance Credentials */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Practice:</span>
                        <strong className="text-slate-900 truncate max-w-[170px]">{activeDoctor.clinicName || 'Aura Aesthetics & Longevity'}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Medical License:</span>
                        <span className="font-mono text-slate-700 font-semibold">{activeDoctor.licenseNumber} (Active)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">EMR Status:</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Aesthetic Record Synced
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Session Started:</span>
                        <span className="font-mono text-slate-500 text-[10px]">{activeDoctor.sessionStartedAt || 'Today at 08:00 AM'}</span>
                      </div>
                    </div>

                    {/* Switch Physician Session (Direct Doctor Switcher) */}
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Switch Physician Session
                        </span>
                        <span className="text-[9px] text-blue-600 font-bold">
                          {AVAILABLE_DOCTORS.length} Available
                        </span>
                      </div>

                      <div className="space-y-1">
                        {AVAILABLE_DOCTORS.map((doc) => {
                          const isActive = doc.id === activeDoctor.id;
                          return (
                            <button
                              key={doc.id}
                              onClick={() => {
                                setActiveDoctor(doc);
                                onUpdateDoctor?.(doc);
                                setIsUserDropdownOpen(false);
                                triggerToast(`Switched active session to ${doc.name} (${doc.title})`);
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left cursor-pointer transition-all ${
                                isActive
                                  ? 'bg-blue-50 border border-blue-200 text-blue-900 font-bold'
                                  : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <div
                                  style={{ backgroundColor: doc.avatarBg, color: doc.avatarColor }}
                                  className="w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0"
                                >
                                  {doc.initials}
                                </div>
                                <div className="truncate">
                                  <div className="text-xs truncate">{doc.name}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{doc.title}</div>
                                </div>
                              </div>
                              {isActive && (
                                <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">
                                  Current
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation & Action Links */}
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsDoctorAuthModalOpen(true);
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-blue-600" />
                          <span>Doctor Login / New Sign Up</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">Portal</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveMenu('settings');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Settings className="w-4 h-4 text-slate-500" />
                          <span>Practice Settings &amp; EMR</span>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => {
                          onNavigateToView('editor');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 text-blue-700 font-semibold text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span>Open Website Editor</span>
                        </div>
                        <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">/editor</span>
                      </button>
                    </div>

                    {/* Footer / Sign Out */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Carefront v2.4 Suite</span>
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          triggerToast('Logged out of practitioner session. Opening authentication view.');
                          setIsDoctorAuthModalOpen(true);
                        }}
                        className="text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Scrolling Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-7 md:p-8 space-y-7">
          
          {/* ======================================================== */}
          {/* VIEW: MAIN DASHBOARD */}
          {/* ======================================================== */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-7">
              
              {/* Top Greeting & Unified Date Picker + Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome JD!
                  </h1>
                </div>

                {/* Header Actions: Single Unified Date Range + Customize + Export */}
                <div className="flex flex-wrap items-center gap-2.5">
                  
                  {/* Single Unified Date Range Picker Button with Tiny Calendar */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDateCalendarOpen(!isDateCalendarOpen)}
                      className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
                    >
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dateRangeLabel}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {/* Tiny Calendar Popover */}
                    {isDateCalendarOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsDateCalendarOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 text-xs text-slate-800 space-y-3"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <span className="font-bold text-slate-900 text-xs">Select Date Range</span>
                            <button
                              onClick={() => setIsDateCalendarOpen(false)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Quick Presets */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { key: '7d', label: 'Last 7 days', range: 'Jan 25, 2026 – Feb 1, 2026' },
                              { key: '30d', label: 'Last 30 days', range: 'Jan 1, 2026 – Feb 1, 2026' },
                              { key: '90d', label: 'Last 90 days', range: 'Nov 1, 2025 – Feb 1, 2026' },
                              { key: 'year', label: 'This Year (2026)', range: 'Jan 1, 2026 – Dec 31, 2026' }
                            ].map((preset) => (
                              <button
                                key={preset.key}
                                onClick={() => {
                                  setDateRangePreset(preset.key as any);
                                  setDateRangeLabel(preset.range);
                                  setIsDateCalendarOpen(false);
                                  triggerToast(`Filtered dashboard metrics to ${preset.label}.`);
                                }}
                                className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-semibold transition-colors cursor-pointer ${
                                  dateRangePreset === preset.key
                                    ? 'bg-[#2563EB] text-white shadow-2xs'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>

                          {/* Tiny Interactive Month Days */}
                          <div className="pt-2 border-t border-slate-100 space-y-1">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold px-1">
                              <span>January 2026</span>
                              <span>Selected: Day {selectedCalendarDay}</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] pt-1">
                              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={i} className="text-slate-400 font-bold text-[9px]">{d}</span>
                              ))}
                              {Array.from({ length: 31 }).map((_, idx) => {
                                const dayNum = idx + 1;
                                const isSelected = dayNum === selectedCalendarDay;
                                return (
                                  <button
                                    key={dayNum}
                                    onClick={() => {
                                      setSelectedCalendarDay(dayNum);
                                      setDateRangeLabel(`Jan 1, 2026 – Jan ${dayNum}, 2026`);
                                      setIsDateCalendarOpen(false);
                                      triggerToast(`Date filter updated to Jan 1 – Jan ${dayNum}, 2026.`);
                                    }}
                                    className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#2563EB] text-white font-bold'
                                        : 'hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {dayNum}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </div>

                  {/* Customize Dashboard Button */}
                  <button
                    onClick={() => setIsCustomizeOpen(true)}
                    className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Customize Dashboard</span>
                  </button>

                  {/* Export Button */}
                  <button
                    onClick={() => triggerToast('📊 Exported monthly practice metrics to CSV & PDF.')}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>

                </div>
              </div>

              {/* Clean AI Capacity Alert Banner */}
              {visibleWidgets.capacityAlertBanner && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                      <Zap className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>AI Capacity Alert</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          2 Open Slots
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        2 open treatment slots detected this Thursday afternoon ($2,950.00 unrealized revenue with Dr. Jenkins).
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      triggerToast('⚡ Flash Booking SMS dispatched to 18 waitlisted patients! Expected fill time: 14 mins.');
                      setCapacitySlots((prev) =>
                        prev.map((s) => (s.id === 'cap_1' ? { ...s, isBroadcasted: true } : s))
                      );
                    }}
                    className="shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Launch Flash Booking SMS</span>
                  </button>
                </div>
              )}

              {/* 4 TOP KPI CARDS WITH INTERACTIVE THREE-DOTS MENU & SMOOTH ANIMATIONS */}
              {visibleWidgets.kpiCards && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  
                  {/* Card 1: Total Revenue */}
                  <motion.div
                    whileHover={activeCardMenuId === 'kpi_rev' ? undefined : { y: -2 }}
                    transition={{ duration: 0.15 }}
                    className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between relative group ${
                      activeCardMenuId === 'kpi_rev' ? 'z-40 overflow-visible' : 'z-10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-slate-500">Total Revenue</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setActiveCardMenuId(activeCardMenuId === 'kpi_rev' ? null : 'kpi_rev')}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                          title="Card Options"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center shrink-0">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <AnimatedNumber
                          value={kpis.revenue}
                          className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight font-mono"
                        />
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#E8F8F0] text-[#12B76A]">
                          {kpis.revGrowth}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {kpis.revPeriod}
                      </div>
                    </div>

                    <CardMenu
                      id="kpi_rev"
                      title="Total Revenue"
                      widgetKey="kpiCards"
                      onConfigure={() => setActiveMenu('finances_overview')}
                      onExport={() => triggerToast('Exported total revenue breakdown CSV.')}
                    />
                  </motion.div>

                  {/* Card 2: Deposits Collected */}
                  <motion.div
                    whileHover={activeCardMenuId === 'kpi_dep' ? undefined : { y: -2 }}
                    transition={{ duration: 0.15 }}
                    className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between relative group ${
                      activeCardMenuId === 'kpi_dep' ? 'z-40 overflow-visible' : 'z-10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-slate-500">Deposits Collected</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setActiveCardMenuId(activeCardMenuId === 'kpi_dep' ? null : 'kpi_dep')}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                          title="Card Options"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <AnimatedNumber
                          value={kpis.deposits}
                          className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight font-mono"
                        />
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#E8F8F0] text-[#12B76A]">
                          {kpis.depGrowth}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {kpis.depPeriod}
                      </div>
                    </div>

                    <CardMenu
                      id="kpi_dep"
                      title="Deposits Collected"
                      widgetKey="kpiCards"
                      onConfigure={() => setActiveMenu('orders')}
                      onExport={() => triggerToast('Exported deposit transactions CSV.')}
                    />
                  </motion.div>

                  {/* Card 3: AI Leads Handled */}
                  <motion.div
                    whileHover={activeCardMenuId === 'kpi_leads' ? undefined : { y: -2 }}
                    transition={{ duration: 0.15 }}
                    className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between relative group ${
                      activeCardMenuId === 'kpi_leads' ? 'z-40 overflow-visible' : 'z-10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-slate-500">AI Leads Handled</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setActiveCardMenuId(activeCardMenuId === 'kpi_leads' ? null : 'kpi_leads')}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                          title="Card Options"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center shrink-0">
                          <Send className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <AnimatedNumber
                          value={kpis.leads}
                          className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight font-mono"
                        />
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FEE4E2] text-[#F04438]">
                          {kpis.leadsGrowth}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {kpis.leadsPeriod}
                      </div>
                    </div>

                    <CardMenu
                      id="kpi_leads"
                      title="AI Leads Handled"
                      widgetKey="kpiCards"
                      onConfigure={() => setActiveMenu('customers')}
                      onExport={() => triggerToast('Exported AI leads conversion CSV.')}
                    />
                  </motion.div>

                  {/* Card 4: Orders */}
                  <motion.div
                    whileHover={activeCardMenuId === 'kpi_ord' ? undefined : { y: -2 }}
                    transition={{ duration: 0.15 }}
                    className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between relative group ${
                      activeCardMenuId === 'kpi_ord' ? 'z-40 overflow-visible' : 'z-10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-slate-500">Orders</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setActiveCardMenuId(activeCardMenuId === 'kpi_ord' ? null : 'kpi_ord')}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                          title="Card Options"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <AnimatedNumber
                          value={kpis.orders}
                          className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight font-mono"
                        />
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#E8F8F0] text-[#12B76A]">
                          {kpis.ordGrowth}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {kpis.ordPeriod}
                      </div>
                    </div>

                    <CardMenu
                      id="kpi_ord"
                      title="Orders"
                      widgetKey="kpiCards"
                      onConfigure={() => setActiveMenu('orders')}
                      onExport={() => triggerToast('Exported order history CSV.')}
                    />
                  </motion.div>

                </div>
              )}

              {/* MIDDLE ROW: TOTAL PROFIT (8 COLS) + WEEKLY PROCEDURE VOLUME & CAPACITY (4 COLS) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* TOTAL PROFIT CHART CARD (8 COLS) - INTERACTIVE HOVER TILL DATE */}
                {visibleWidgets.totalProfitChart && (
                  <div className={`lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-6 relative group ${
                    activeCardMenuId === 'chart_profit' ? 'z-40 overflow-visible' : 'z-10'
                  }`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-base">Total Profit</h3>
                        <div className="relative">
                          <button
                            onClick={() => setActiveCardMenuId(activeCardMenuId === 'chart_profit' ? null : 'chart_profit')}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                            title="Card Options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <CardMenu
                            id="chart_profit"
                            title="Total Profit"
                            widgetKey="totalProfitChart"
                            onConfigure={() => setIsCustomizeOpen(true)}
                            onExport={() => triggerToast('Exported profit monthly telemetry to CSV.')}
                          />
                        </div>
                      </div>

                      <div className="flex items-baseline gap-3 mt-2">
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
                          {kpis.profit}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#12B76A]">
                          ↗ 15.8% <span className="text-slate-400 font-normal">vs. last period</span>
                        </span>
                      </div>
                    </div>

                    {/* Interactive Curved Line & Area Chart (Showing data till date: Jan–Jul) */}
                    <div className="relative pt-4">
                      <div className="relative h-56 w-full">
                        {/* Y-axis grid markers */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-mono">
                          <div className="border-b border-dashed border-slate-100 pb-0.5">$60k</div>
                          <div className="border-b border-dashed border-slate-100 pb-0.5">$40k</div>
                          <div className="border-b border-dashed border-slate-100 pb-0.5">$20k</div>
                          <div className="border-b border-slate-100 pb-0.5">$0</div>
                        </div>

                        {/* SVG Line & Area with smooth cubic spline across 12 months */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Smooth Area Fill from far left (x=0) all the way through Oct */}
                          <path
                            d="M 0,168 C 25,164 35,162 50,160 C 95,155 105,150 150,148 C 195,146 205,140 250,138 C 295,136 305,142 350,144 C 395,146 405,122 450,115 C 495,108 505,106 550,102 C 595,98 605,94 650,90 C 695,86 705,84 750,82 C 795,80 805,74 850,70 C 895,66 905,60 950,56 L 950,198 L 0,198 Z"
                            fill="url(#profitGrad)"
                          />

                          {/* Smooth Solid Curve Line from far left (x=0) through Oct */}
                          <path
                            d="M 0,168 C 25,164 35,162 50,160 C 95,155 105,150 150,148 C 195,146 205,140 250,138 C 295,136 305,142 350,144 C 395,146 405,122 450,115 C 495,108 505,106 550,102 C 595,98 605,94 650,90 C 695,86 705,84 750,82 C 795,80 805,74 850,70 C 895,66 905,60 950,56"
                            fill="none"
                            stroke="#2563EB"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Projected Future Months (Dashed Line for Nov and Dec) */}
                          <path
                            d="M 950,56 C 995,51 1005,48 1050,46 C 1095,44 1105,38 1150,36 C 1175,34 1185,32 1200,30"
                            fill="none"
                            stroke="#94A3B8"
                            strokeWidth="2.5"
                            strokeDasharray="5 5"
                            strokeLinecap="round"
                          />
                        </svg>

                        {/* Perfectly Circular Interactive Dots Aligned Down to the Exact Month Column */}
                        <div className="absolute inset-0 pointer-events-none">
                          {monthlyProfitData.map((pt, i) => (
                            <div
                              key={pt.month}
                              style={{
                                left: `${(pt.x / 1200) * 100}%`,
                                top: `${(pt.y / 200) * 100}%`
                              }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer p-1"
                              onMouseEnter={() => setHoveredMonthIndex(i)}
                              onClick={() => setHoveredMonthIndex(i)}
                            >
                              <div
                                className={`rounded-full transition-all duration-150 ${
                                  hoveredMonthIndex === i
                                    ? pt.isProjected
                                      ? 'w-3.5 h-3.5 bg-slate-500 ring-4 ring-slate-200'
                                      : 'w-4 h-4 bg-blue-600 ring-4 ring-blue-100 shadow-md scale-110'
                                    : pt.isCurrent
                                    ? 'w-3.5 h-3.5 bg-blue-600 ring-4 ring-blue-100 shadow-xs'
                                    : pt.isProjected
                                    ? 'w-2.5 h-2.5 bg-white border-2 border-slate-400'
                                    : 'w-2.5 h-2.5 bg-white border-2 border-blue-600 shadow-xs'
                                }`}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Interactive Floating Tooltip on Hover */}
                        {hoveredMonthIndex !== null && (
                          <div
                            className="absolute bg-white rounded-xl shadow-xl border border-slate-200/90 p-2.5 text-[11px] space-y-1 pointer-events-none z-20 transition-all duration-150 -translate-x-1/2 -translate-y-full -mt-4"
                            style={{
                              left: `${(monthlyProfitData[hoveredMonthIndex].x / 1200) * 100}%`,
                              top: `${(monthlyProfitData[hoveredMonthIndex].y / 200) * 100}%`
                            }}
                          >
                            <div className="font-bold text-slate-900 flex items-center justify-between gap-2">
                              <span>
                                {monthlyProfitData[hoveredMonthIndex].month}, 2026
                                {monthlyProfitData[hoveredMonthIndex].isCurrent && (
                                  <span className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded ml-1 font-bold">Present</span>
                                )}
                                {monthlyProfitData[hoveredMonthIndex].isProjected && (
                                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded ml-1 font-bold">Projected</span>
                                )}
                              </span>
                              <span className={`text-[10px] font-bold ${monthlyProfitData[hoveredMonthIndex].isProjected ? 'text-blue-600' : 'text-emerald-600'}`}>
                                {monthlyProfitData[hoveredMonthIndex].change}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-700 font-bold font-mono">
                              <span className={`w-2 h-2 rounded-full ${monthlyProfitData[hoveredMonthIndex].isProjected ? 'bg-slate-400' : 'bg-[#2563EB]'}`} />
                              <span>{monthlyProfitData[hoveredMonthIndex].profit} profit</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Prior: {monthlyProfitData[hoveredMonthIndex].prev}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 12-Month Column Selectors directly aligned with each dot */}
                      <div className="grid grid-cols-12 text-center text-[11px] text-slate-400 pt-3">
                        {monthlyProfitData.map((m, idx) => (
                          <button
                            key={m.month}
                            onMouseEnter={() => setHoveredMonthIndex(idx)}
                            onClick={() => setHoveredMonthIndex(idx)}
                            className={`transition-colors cursor-pointer py-1 ${
                              hoveredMonthIndex === idx
                                ? 'font-bold text-blue-600'
                                : m.isCurrent
                                ? 'font-bold text-blue-600'
                                : m.isProjected
                                ? 'text-slate-400 hover:text-slate-700 font-mono text-[10px]'
                                : 'hover:text-slate-800'
                            }`}
                          >
                            <span>{m.month}</span>
                            {m.isProjected && <span className="text-[9px] text-slate-300 ml-0.5">*</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Customers Breakdown Progress Cards */}
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <span className="text-xs font-bold text-slate-700 block">Patient Cohort Breakdown</span>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                          <div>
                            <div className="text-lg font-bold text-slate-900 leading-tight font-mono">2,894</div>
                            <div className="text-[11px] text-slate-500">New Patients</div>
                          </div>
                          <div className="h-1.5 bg-[#2563EB] rounded-full mt-2.5 w-full" />
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                          <div>
                            <div className="text-lg font-bold text-slate-900 leading-tight font-mono">1,432</div>
                            <div className="text-[11px] text-slate-500">Returning VIPs</div>
                          </div>
                          <div className="h-1.5 bg-[#12B76A] rounded-full mt-2.5 w-full" />
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                          <div>
                            <div className="text-lg font-bold text-slate-900 leading-tight font-mono">562</div>
                            <div className="text-[11px] text-slate-500">Recalls Due</div>
                          </div>
                          <div className="h-1.5 bg-[#F79009] rounded-full mt-2.5 w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* RIGHT 4 COLS: WEEKLY PROCEDURE VOLUME & CAPACITY + REPEAT CUSTOMER RATE */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* 1. WEEKLY PROCEDURE VOLUME & CAPACITY (RENAMED FROM MOST DAY ACTIVE) */}
                  {visibleWidgets.dayActiveBarChart && (
                    <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-4 relative ${
                      activeCardMenuId === 'chart_vol' ? 'z-40 overflow-visible' : 'z-10'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Weekly Procedure Volume & Capacity</h4>
                          <span className="text-[11px] text-slate-400">Hover day for live slot occupancy</span>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setActiveCardMenuId(activeCardMenuId === 'chart_vol' ? null : 'chart_vol')}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                            title="Card Options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <CardMenu
                            id="chart_vol"
                            title="Procedure Volume"
                            widgetKey="dayActiveBarChart"
                            onConfigure={() => setActiveMenu('capacity_spotter')}
                            onExport={() => triggerToast('Exported weekly procedure volume CSV.')}
                          />
                        </div>
                      </div>

                      {/* Interactive Bar Chart with Live Count at Top & Color Transition */}
                      <div className="h-44 flex items-end justify-between gap-2 pt-2 px-1">
                        {weeklyVolumeData.map((bar) => {
                          const isHovered = hoveredDay === bar.day;
                          return (
                            <div
                              key={bar.day}
                              onMouseEnter={() => setHoveredDay(bar.day)}
                              className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                            >
                              {/* Hover Number At Top */}
                              <span
                                className={`text-[10px] font-bold font-mono mb-1 transition-all ${
                                  isHovered ? 'text-[#2563EB] opacity-100 scale-110' : 'opacity-0'
                                }`}
                              >
                                {bar.volume}
                              </span>

                              {/* Bar */}
                              <div
                                style={{ height: bar.height }}
                                className={`w-full rounded-xl transition-all duration-200 ${
                                  isHovered
                                    ? 'bg-[#2563EB] shadow-md shadow-blue-500/20 scale-y-105'
                                    : 'bg-[#EEF2F6] hover:bg-slate-300'
                                }`}
                              />
                              <span className={`text-[11px] mt-2 font-medium transition-colors ${
                                isHovered ? 'text-blue-700 font-bold' : 'text-slate-400'
                              }`}>
                                {bar.day}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span>Peak Day: <strong className="text-slate-900">Monday (90% Cap)</strong></span>
                        <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => setActiveMenu('capacity_spotter')}>
                          View 2 Idle Slots →
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2. REPEAT CUSTOMER RATE RADIAL GAUGE (WITH WORKING SHOW DETAILS MODAL) */}
                  {visibleWidgets.repeatPatientGauge && (
                    <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3 flex flex-col items-center text-center relative ${
                      activeCardMenuId === 'chart_repeat' ? 'z-40 overflow-visible' : 'z-10'
                    }`}>
                      <div className="w-full flex justify-between items-center">
                        <h4 className="font-bold text-slate-900 text-sm">Repeat Customer Rate</h4>
                        <div className="relative">
                          <button
                            onClick={() => setActiveCardMenuId(activeCardMenuId === 'chart_repeat' ? null : 'chart_repeat')}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                            title="Card Options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <CardMenu
                            id="chart_repeat"
                            title="Repeat Customer Rate"
                            widgetKey="repeatPatientGauge"
                            onConfigure={() => setIsRepeatModalOpen(true)}
                            onExport={() => triggerToast('Exported patient retention metrics CSV.')}
                          />
                        </div>
                      </div>

                      {/* Semi-circular Dotted / Segmented Arc Gauge */}
                      <div className="relative w-44 h-24 flex items-end justify-center pt-2">
                        <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 85">
                          {Array.from({ length: 30 }).map((_, i) => {
                            const angle = 180 + (i / 29) * 180;
                            const rad = (angle * Math.PI) / 180;
                            const r1 = 60;
                            const r2 = 72;
                            const x1 = 80 + r1 * Math.cos(rad);
                            const y1 = 80 + r1 * Math.sin(rad);
                            const x2 = 80 + r2 * Math.cos(rad);
                            const y2 = 80 + r2 * Math.sin(rad);
                            const isActive = i <= 20; // 68% of 30 ticks = ~21 ticks active
                            return (
                              <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={isActive ? '#12B76A' : '#E2E8F0'}
                                strokeWidth="3.2"
                                strokeLinecap="round"
                              />
                            );
                          })}
                        </svg>

                        {/* Center Stats */}
                        <div className="absolute bottom-0 flex flex-col items-center">
                          <span className="text-3xl font-extrabold text-slate-900 leading-none font-mono">
                            <AnimatedNumber value="68%" />
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium mt-1">
                            ↗ 8% from last 30 days
                          </span>
                        </div>
                      </div>

                      {/* Working Show Details Button */}
                      <button
                        onClick={() => setIsRepeatModalOpen(true)}
                        className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer mt-1"
                      >
                        Show details
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* BOTTOM ROW: BEST SELLING TREATMENTS (8 COLS) + AI ASSISTANT (4 COLS) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* BEST SELLING TREATMENTS TABLE (8 COLS) */}
                {visibleWidgets.bestSellingTreatments && (
                  <div className={`lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-4 relative ${
                    activeCardMenuId === 'best_selling' ? 'z-40 overflow-visible' : 'z-10'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Best Selling Treatments</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Top procedural yield by booking volume</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 text-xs">
                          {[
                            { key: 'all', label: 'All Treatments' },
                            { key: 'injectables', label: 'Injectables' },
                            { key: 'laser_rf', label: 'Laser & RF' },
                            { key: 'facials', label: 'Facials' }
                          ].map((tab) => (
                            <button
                              key={tab.key}
                              onClick={() => setTreatmentCategoryFilter(tab.key as any)}
                              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                                treatmentCategoryFilter === tab.key
                                  ? 'bg-white shadow-2xs text-slate-900 font-bold'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <button
                            onClick={() => setActiveCardMenuId(activeCardMenuId === 'best_selling' ? null : 'best_selling')}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                            title="Table Options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <CardMenu
                            id="best_selling"
                            title="Best Selling Treatments"
                            widgetKey="bestSellingTreatments"
                            onConfigure={() => setActiveMenu('treatments')}
                            onExport={() => triggerToast('Exported treatments performance table to CSV.')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                            <th className="py-3 px-2">ID</th>
                            <th className="py-3 px-2">PROCEDURE</th>
                            <th className="py-3 px-2">CATEGORY</th>
                            <th className="py-3 px-2">PRICE</th>
                            <th className="py-3 px-2">TOTAL REVENUE</th>
                            <th className="py-3 px-2">RATING</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredTreatments.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3.5 px-2 font-mono text-slate-400">{tx.id}</td>
                              <td className="py-3.5 px-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                                      {tx.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{tx.volume}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-2">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                  {tx.categoryLabel}
                                </span>
                              </td>
                              <td className="py-3.5 px-2 font-mono font-bold text-slate-900">{tx.price}</td>
                              <td className="py-3.5 px-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#E8F8F0] text-[#12B76A] font-mono">
                                  ↗ {tx.totalSales}
                                </span>
                              </td>
                              <td className="py-3.5 px-2">
                                <div className="flex items-center gap-1 font-semibold text-slate-800">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{tx.rating}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* AI ASSISTANT CARD (4 COLS) */}
                {visibleWidgets.aiAssistantWidget && (
                  <div className={`lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-6 relative ${
                    activeCardMenuId === 'ai_assistant' ? 'z-40 overflow-visible' : 'z-10'
                  }`}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-900 text-sm">AI Assistant</h4>
                      <div className="relative">
                        <button
                          onClick={() => setActiveCardMenuId(activeCardMenuId === 'ai_assistant' ? null : 'ai_assistant')}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Card Options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <CardMenu
                          id="ai_assistant"
                          title="AI Assistant"
                          widgetKey="aiAssistantWidget"
                          onConfigure={() => setIsCustomizeOpen(true)}
                          onExport={() => triggerToast('Exported AI assistant chat telemetry.')}
                        />
                      </div>
                    </div>

                    {/* Photorealistic 3D Glowing Blue Luminous Sphere Orb */}
                    <div className="flex flex-col items-center justify-center py-2 relative">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
                        <div
                          className="w-24 h-24 rounded-full relative shadow-2xl transition-transform hover:scale-105 duration-300"
                          style={{
                            background:
                              'radial-gradient(circle at 35% 35%, #93C5FD 0%, #3B82F6 30%, #1D4ED8 70%, #0F172A 100%)',
                            boxShadow:
                              '0 12px 28px -4px rgba(37, 99, 235, 0.45), inset 0 -6px 14px rgba(15, 23, 42, 0.6), inset 0 6px 12px rgba(255, 255, 255, 0.45)'
                          }}
                        >
                          <div
                            className="absolute top-2 left-4 w-7 h-4 rounded-full opacity-75"
                            style={{
                              background:
                                'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)',
                              transform: 'rotate(-25deg)'
                            }}
                          />
                        </div>
                      </div>

                      {aiAssistantReply && (
                        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-700 leading-relaxed text-left animate-in fade-in">
                          <span className="text-[10px] font-bold text-blue-600 block mb-0.5">Aura AI:</span>
                          {aiAssistantReply}
                        </div>
                      )}

                      {isAssistantThinking && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Synthesizing practice telemetry...</span>
                        </div>
                      )}
                    </div>

                    {/* Floating Pill Input */}
                    <form onSubmit={handleAiAssistantSubmit} className="relative w-full">
                      <div className="bg-white border border-slate-200/90 rounded-full pl-3.5 pr-1.5 py-1.5 flex items-center gap-2 shadow-2xs hover:border-slate-300 transition-colors">
                        <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={aiAssistantInput}
                          onChange={(e) => setAiAssistantInput(e.target.value)}
                          placeholder="Ask me anything..."
                          className="w-full bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => triggerToast('Microphone voice recognition active: Speak clinical command.')}
                          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                          title="Voice input"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                        <button
                          type="submit"
                          disabled={!aiAssistantInput.trim() && !isAssistantThinking}
                          className="w-7 h-7 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
                          title="Submit"
                        >
                          <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>

              {/* THREE CLINICAL OPERATING PANELS RESTORED TO MAIN DASHBOARD */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. CLINICAL TEAM LIVE COLLABORATION (4 COLS) */}
                {visibleWidgets.teamCollaboration && (
                  <div className={`lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-4 relative ${
                    activeCardMenuId === 'team_collab' ? 'z-40 overflow-visible' : 'z-10'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-[#2563EB]" />
                        <h4 className="font-bold text-slate-900 text-sm">Clinical Team Live Collaboration</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div className="relative">
                          <button
                            onClick={() => setActiveCardMenuId(activeCardMenuId === 'team_collab' ? null : 'team_collab')}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                            title="Panel Options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <CardMenu
                            id="team_collab"
                            title="Clinical Team Live"
                            widgetKey="teamCollaboration"
                            onConfigure={() => setActiveMenu('calendar')}
                            onExport={() => triggerToast('Exported clinical provider logs CSV.')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          name: 'Dr. Sarah Jenkins, MD',
                          role: 'Medical Director',
                          room: 'Suite 101',
                          procedure: 'Morpheus8 RF Dermal Lift',
                          status: 'In Session (28m left)',
                          avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80'
                        },
                        {
                          name: 'Rachel K., NP',
                          role: 'Master Injector',
                          room: 'Suite 103',
                          procedure: 'Botox 40-Unit Refresh',
                          status: 'In Session (14m left)',
                          avatar: 'https://images.unsplash.com/photo-1594824813580-0a568cfa823d?auto=format&fit=crop&w=150&q=80'
                        },
                        {
                          name: 'David H., CLS',
                          role: 'Laser Specialist',
                          room: 'Laser Suite B',
                          procedure: 'Clear + Brilliant Perméa',
                          status: 'Available (Next: 2:30 PM)',
                          avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80'
                        }
                      ].map((member, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <div className="font-bold text-slate-900">{member.name}</div>
                              <div className="text-[10px] text-slate-500">{member.role} • {member.room}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full block">
                              {member.status}
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{member.procedure}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. AI SPEED-TO-LEAD RESPONSE ENGINE (4 COLS) */}
                {visibleWidgets.speedToLeadEngine && (
                  <div className={`lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-4 relative ${
                    activeCardMenuId === 'speed_to_lead' ? 'z-40 overflow-visible' : 'z-10'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#2563EB]" />
                        <h4 className="font-bold text-slate-900 text-sm">AI Speed-to-Lead Response</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          14s Avg Speed
                        </span>
                        <div className="relative">
                          <button
                            onClick={() => setActiveCardMenuId(activeCardMenuId === 'speed_to_lead' ? null : 'speed_to_lead')}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                            title="Panel Options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <CardMenu
                            id="speed_to_lead"
                            title="Speed-to-Lead Engine"
                            widgetKey="speedToLeadEngine"
                            onConfigure={() => setActiveMenu('customers')}
                            onExport={() => triggerToast('Exported AI lead conversion logs.')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-medium block">Interception Rate</span>
                        <span className="text-lg font-bold text-slate-900 font-mono">98.4%</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-medium block">Leads Intercepted</span>
                        <span className="text-lg font-bold text-emerald-700 font-mono">18 Today</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Recent Interceptions
                      </span>
                      {[
                        { name: 'Elena Rostova', proc: 'Morpheus8 RF', time: '8m ago', action: '$100 Deposit Secured' },
                        { name: 'Chloe Vance', proc: 'Lip Contour', time: '24m ago', action: 'Cherry 0% Pre-Approved' },
                        { name: 'Marcus Chen', proc: 'Botox Refresher', time: '41m ago', action: 'Slot Locked 8:30 AM' }
                      ].map((lead, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-slate-800 block">{lead.name}</span>
                            <span className="text-[10px] text-slate-400">{lead.proc} • {lead.time}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {lead.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. AI FRONT DESK & CHATBOT CONFIGURATION (4 COLS) */}
                {visibleWidgets.frontDeskChatbot && (
                  <div className={`lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-4 relative ${
                    activeCardMenuId === 'front_desk' ? 'z-40 overflow-visible' : 'z-10'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#2563EB]" />
                        <h4 className="font-bold text-slate-900 text-sm">AI Front Desk & Chatbot</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                          24/7 Concierge Active
                        </span>
                        <div className="relative">
                          <button
                            onClick={() => setActiveCardMenuId(activeCardMenuId === 'front_desk' ? null : 'front_desk')}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                            title="Panel Options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <CardMenu
                            id="front_desk"
                            title="AI Front Desk"
                            widgetKey="frontDeskChatbot"
                            onConfigure={() => setIsCustomizeOpen(true)}
                            onExport={() => triggerToast('Exported concierge triage logs.')}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">
                      Automated live triage for incoming website visitors, after-hours booking, and payment authorizations.
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <span className="font-medium text-slate-700">Instant Deposit Authorization</span>
                        <span className="text-[10px] font-bold text-emerald-700">Enabled ($75/$100)</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <span className="font-medium text-slate-700">After-Hours Emergency Triage</span>
                        <span className="text-[10px] font-bold text-blue-700">Call-Transfer Active</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <span className="font-medium text-slate-700">Aesthetic Record Sync</span>
                        <span className="text-[10px] font-bold text-emerald-700">Bi-directional Live</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSimulateMissedCall()}
                      disabled={isSimulatingMissedCall}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingMissedCall ? 'animate-spin' : ''}`} />
                      <span>{isSimulatingMissedCall ? 'Testing Dispatch...' : 'Test AI Speed-to-Lead Call'}</span>
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: SCHEDULE & CALENDAR */}
          {/* ======================================================== */}
          {activeMenu === 'calendar' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Appointments &amp; Schedule</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage patient bookings, clinic rooms, practitioner availability, and Quad-A medical aesthetic workflows.
                  </p>
                </div>
              </div>
              <UntitledMonthCalendar
                appointments={appointmentsState}
                services={services}
                providers={providers}
                onSelectAppointment={(apt) => triggerToast(`Selected ${apt.patientName} (${apt.serviceName}) appointment.`)}
                onAddAppointment={(newApt) => {
                  setAppointmentsState((prev) => [newApt, ...prev]);
                  onAddAppointment?.(newApt);
                  triggerToast(`Scheduled appointment for ${newApt.patientName}!`);
                }}
                onToast={triggerToast}
              />
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: TREATMENTS & CATALOG */}
          {/* ======================================================== */}
          {activeMenu === 'treatments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Treatments & Catalog</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Live procedures, cash fees, refundable booking deposits, and financing settings.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingService(null);
                    setIsAddingTreatment(true);
                  }}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Treatment</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <img src={srv.imageUrl} alt={srv.name} className="h-40 w-full object-cover rounded-xl" />
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-[#2563EB] tracking-wider">
                            {srv.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{srv.durationMinutes} min</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base mt-1">{srv.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{srv.description}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 font-mono text-base">
                          ${(srv.retailPriceCents / 100).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          ${srv.depositPriceCents / 100} Deposit Required
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setEditingService(srv);
                          setIsAddingTreatment(false);
                        }}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-slate-200/80"
                      >
                        Edit Protocol
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: ORDERS & TRANSACTIONS (VIEW RECEIPT) */}
          {/* ======================================================== */}
          {activeMenu === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Orders & Retail Settlements</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Stripe authorized procedure deposits, retail dispensary purchases, and receipts.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Patient Name</th>
                      <th className="p-4">Line Items</th>
                      <th className="p-4">Deposit Settled</th>
                      <th className="p-4">EMR Ledger</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-900">{ord.id}</td>
                        <td className="p-4 font-semibold text-slate-900">{ord.patientName}</td>
                        <td className="p-4 text-slate-500">{ord.lineItems.map((l) => l.title).join(', ')}</td>
                        <td className="p-4 font-mono font-bold text-emerald-700">
                          ${(ord.depositCents / 100).toLocaleString()}.00
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                            ✅ Synced (Chart #AR-9941)
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: CUSTOMERS (FULL SPREADSHEET DIRECTORY) */}
          {/* ======================================================== */}
          {activeMenu === 'customers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Customer Directory</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Spreadsheet ledger of all clinical patients, leads, intake statuses, and interaction histories.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="Search patient name, phone, or chart..."
                      className="outline-none bg-transparent text-xs w-48 text-slate-800"
                    />
                  </div>
                  <button
                    onClick={() => triggerToast('Exported customer spreadsheet to CSV.')}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit text-xs">
                {[
                  { key: 'all', label: `All Patients (${inboundLeads.length})` },
                  { key: 'consult_booked', label: 'Consultation Booked (8)' },
                  { key: 'active_series', label: 'Active Series (5)' },
                  { key: 'vip_member', label: 'VIP Members (3)' },
                  { key: 'lead', label: 'New Leads (2)' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setCustomerStatusFilter(tab.key as any)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      customerStatusFilter === tab.key ? 'bg-[#EEF4FF] text-[#2563EB]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Customer Spreadsheet Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Patient ID</th>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Preferred Procedure</th>
                      <th className="p-3.5">Channel / Source</th>
                      <th className="p-3.5">Intake Status</th>
                      <th className="p-3.5">Lifetime Spend</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {inboundLeads.map((lead, idx) => {
                      const chartNum = `AR-94${idx + 10}`;
                      const spend = (idx + 1) * 850 + 520;
                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono text-slate-500">{chartNum}</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                                {lead.patientName ? lead.patientName.charAt(0) : 'P'}
                              </div>
                              <span className="font-bold text-slate-900">{lead.patientName || 'Anonymous Inquirer'}</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="text-slate-900">{lead.phone}</div>
                            <div className="text-[10px] text-slate-400">patient@auramedspa.com</div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px]">
                              {lead.intentTag}
                            </span>
                          </td>
                          <td className="p-3.5 capitalize text-slate-600">
                            {lead.channel === 'web_chat' ? '💬 Web Concierge' : '📞 Missed-Call Auto-SMS'}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              lead.depositSecured ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {lead.depositSecured ? 'Deposit Secured ($100)' : 'AI Qualifying (In Progress)'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-900">${spend.toLocaleString()}.00</td>
                          <td className="p-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => triggerToast(`Opening 2-way SMS chat with ${lead.patientName || lead.phone}.`)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold cursor-pointer transition-colors"
                            >
                              SMS
                            </button>
                            <button
                              onClick={() => setSelectedCustomerForModal(lead)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold cursor-pointer transition-colors"
                            >
                              View Chart
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: DISCOUNTS & PROMOTIONS (SEPARATE PAGE) */}
          {/* ======================================================== */}
          {activeMenu === 'discounts' && (
            <DiscountsPromotionManager
              promotions={promotions}
              onUpdatePromotions={(updated) => {
                setPromotions(updated);
                onUpdatePromotions?.(updated);
              }}
              onToast={triggerToast}
            />
          )}

          {/* ======================================================== */}
          {/* VIEW: ABANDONED CHECKOUT RECOVERY (SEPARATE PAGE) */}
          {/* ======================================================== */}
          {activeMenu === 'abandoned_checkouts' && (
            <AbandonedCheckoutRecovery
              checkouts={abandonedCheckouts}
              onUpdateCheckoutStatus={(id, status) =>
                setAbandonedCheckouts((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, status } : c))
                )
              }
              onSendManualSms={(id, msg) => {
                triggerToast(`Dispatched recovery incentive SMS for checkout #${id}`);
              }}
              onToast={triggerToast}
            />
          )}

          {/* ======================================================== */}
          {/* VIEW: FINANCES SUB-PAGES */}
          {/* ======================================================== */}
          {activeMenu === 'finances_overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Financial Overview</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Practice cash flow, merchant net deposits, operational costs, and monthly profitability.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Total Net Practice Revenue</span>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">{kpis.profit}</div>
                  <span className="text-[11px] text-emerald-600 font-bold block">▲ +15.8% YoY Growth</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Stripe Auto-Payouts</span>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">$148,250.00</div>
                  <span className="text-[11px] text-slate-500 block">Next deposit: Tomorrow morning (Chase)</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Cherry 0% Financing Yield</span>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">$42,800.00</div>
                  <span className="text-[11px] text-blue-600 font-bold block">Paid 100% upfront at point of sale</span>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'finances_transactions' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Transactions &amp; Itemized Receipts</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Complete audit trail of all patient deposits, treatment packages, and credit card charges.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 p-4 border-b border-slate-100 font-bold text-slate-500">
                    <tr>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Patient</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-slate-900">{o.id}</td>
                        <td className="p-4 font-semibold text-slate-900">{o.patientName}</td>
                        <td className="p-4 font-mono font-bold text-emerald-700">${(o.depositCents / 100).toFixed(2)}</td>
                        <td className="p-4 capitalize">{o.paymentMethod.replace('_', ' ')}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl font-bold cursor-pointer"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === 'finances_payouts' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Stripe Bank Payouts</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Daily automated bank transfers, processing fees, and rolling settlement schedule.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4 text-xs">
                <div className="font-bold text-base text-slate-900">Connected Direct Deposit Account</div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      JPMC
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">JPMorgan Chase Business Checking (•••8819)</div>
                      <div className="text-[11px] text-slate-500">Automatic 2-Day Rolling Payouts Active</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ======================================================== */}
          {/* VIEW: OUTREACH & LEAD AUTOMATIONS (NEW SEPARATE DROPDOWN TAB) */}
          {/* ======================================================== */}
          {(activeMenu === 'automations_canvas' ||
            activeMenu === 'automations_lead_qualification' ||
            activeMenu === 'automations_aftercare' ||
            activeMenu === 'automations_retention') && (
            <OutreachAutomationsStudio
              key={activeMenu}
              activeMenuCategory={activeMenu}
              onToast={triggerToast}
            />
          )}

          {/* ======================================================== */}
          {/* VIEW: DETAILED PRACTICE ANALYTICS (NEW SEPARATE DROPDOWN TAB) */}
          {/* ======================================================== */}
          {(activeMenu === 'analytics_overview' ||
            activeMenu === 'analytics_retention' ||
            activeMenu === 'analytics_scheduling' ||
            activeMenu === 'analytics_acceptance' ||
            activeMenu === 'analytics_google_analytics') && (
            <DetailedPracticeAnalytics
              key={activeMenu}
              onToast={triggerToast}
              subPage={
                activeMenu === 'analytics_retention'
                  ? 'retention'
                  : activeMenu === 'analytics_scheduling'
                  ? 'scheduling'
                  : activeMenu === 'analytics_acceptance'
                  ? 'acceptance'
                  : activeMenu === 'analytics_google_analytics'
                  ? 'google_analytics'
                  : 'overview'
              }
            />
          )}

          {/* ======================================================== */}
          {/* VIEW: MARKETING SUB-PAGES (Meta & Google Ads, SEO) */}
          {/* ======================================================== */}
          {(activeMenu === 'marketing_ads' || activeMenu === 'marketing_seo' || activeMenu === 'marketing_broadcasts') && (
            <MarketingAdsStudio
              services={services}
              accentColor="#2563EB"
              primaryColor="#064E3B"
              subPage={activeMenu === 'marketing_seo' ? 'seo' : activeMenu === 'marketing_broadcasts' ? 'broadcasts' : 'ads'}
              adCreatives={adCreatives}
              onAddAdCreative={(creative) => setAdCreatives((prev) => [creative, ...prev])}
              seoArticles={seoArticles}
              onAddSeoArticle={(article) => setSeoArticles((prev) => [article, ...prev])}
              broadcastCampaigns={broadcastCampaigns}
              onSendBroadcastCampaign={(camp) => setBroadcastCampaigns((prev) => [camp, ...prev])}
              onToast={triggerToast}
            />
          )}

          {/* ======================================================== */}
          {/* VIEW: ANALYTICS & CAPACITY SPOTTER */}
          {/* ======================================================== */}
          {activeMenu === 'capacity_spotter' && (
            <CapacitySpotterView
              slots={capacitySlots}
              onBroadcastSlot={(id) => {
                setCapacitySlots((prev) =>
                  prev.map((s) => (s.id === id ? { ...s, isBroadcasted: true } : s))
                );
                triggerToast('⚡ Flash Booking SMS sent to 18 waitlisted patients!');
              }}
              onFillSlot={(slot) => {
                triggerToast(`Reserved ${slot.timeWindow} with ${slot.providerName}.`);
              }}
              onToast={triggerToast}
            />
          )}

          {/* ======================================================== */}
          {/* VIEW: CLINICAL AFTERCARE */}
          {/* ======================================================== */}
          {activeMenu === 'clinical_aftercare' && (
            <ClinicalAftercareView
              records={aftercareRecords}
              onAddTimelineLog={(id: string, msg: string) => {
                setAftercareRecords((prev) =>
                  prev.map((r) =>
                    r.id === id
                      ? {
                          ...r,
                          timelineLogs: [
                            ...r.timelineLogs,
                            { sender: 'clinician', message: msg, timestamp: 'Just now' }
                          ]
                        }
                      : r
                  )
                );
                triggerToast('Recorded physician progress review in patient aftercare chart.');
              }}
              onSendReviewInvite={(id: string) => {
                triggerToast('Sent 5-Star Google Review invitation via SMS.');
              }}
              onToast={triggerToast}
            />
          )}

          {/* ======================================================== */}
          {/* VIEW: RETENTION & RECALLS */}
          {/* ======================================================== */}
          {activeMenu === 'retention' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Patient Retention &amp; 90-Day Recalls</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Predictive clinical recall cadence tracking Botox touch-ups, filler refills, and skincare maintenance.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 space-y-4 text-xs">
                <span className="font-bold text-slate-900 text-sm">Automated Neurotoxin & Filler Recalls</span>
                <p className="text-slate-500">
                  Patients are automatically engaged at Day 75, 90, and 105 post-treatment to maintain muscle relaxation and prevent lines from reforming.
                </p>
                <div className="divide-y divide-slate-100">
                  {recallLogs.map((rec) => (
                    <div key={rec.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{rec.patientName}</div>
                        <div className="text-[11px] text-slate-500">{rec.serviceName} • Due in {rec.cadenceDays} days (Due: {rec.dueDate})</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                        SMS Scheduled
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: COMPREHENSIVE SETTINGS */}
          {/* ======================================================== */}
          {activeMenu === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Practice OS Settings</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Configure clinical credentials, Quad-A compliance, deposit rules, EMR integrations, and AI response policies.
                </p>
              </div>

              {/* Settings Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs w-fit">
                {[
                  { key: 'practice', label: 'Practice & Licensure' },
                  { key: 'booking', label: 'Booking & Deposits' },
                  { key: 'emr', label: 'EMR & Calendar' },
                  { key: 'payments', label: 'Payment Gateways' },
                  { key: 'ai_rules', label: 'AI Speed-to-Lead' }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSettingsTab(t.key as any)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      settingsTab === t.key ? 'bg-[#EEF4FF] text-[#2563EB]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Practice Profile */}
              {settingsTab === 'practice' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm">Clinical Practice Credentials</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Practice Legal Name</label>
                      <input type="text" defaultValue="Aura MedSpa & Aesthetics, Inc." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Medical Director</label>
                      <input type="text" defaultValue="Dr. Sarah Jenkins, MD (CA License #G84910)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">NPI Number</label>
                      <input type="text" defaultValue="1942850192" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Quad-A Accreditation Suite</label>
                      <input type="text" defaultValue="Quad-A Surgical & Laser Accredited #3911" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" />
                    </div>
                  </div>
                  <button onClick={() => triggerToast('Saved practice credentials.')} className="bg-[#2563EB] text-white px-4 py-2 rounded-xl font-bold cursor-pointer">
                    Save Changes
                  </button>
                </div>
              )}

              {/* Tab 2: Booking & Deposits */}
              {settingsTab === 'booking' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm">Deposit Policy & Cancellation Rules</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Default Appointment Deposit ($)</label>
                      <div className="flex items-center gap-2">
                        {['50', '75', '100', '150'].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setDepositAmountSetting(amt)}
                            className={`px-4 py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                              depositAmountSetting === amt ? 'bg-[#EEF4FF] border-[#2563EB] text-[#2563EB]' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            ${amt}.00
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Cancellation Window for Refund</label>
                      <select className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 w-full sm:w-64">
                        <option>24 Hours Notice</option>
                        <option>48 Hours Notice</option>
                        <option>72 Hours Notice</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => triggerToast('Updated practice deposit rules.')} className="bg-[#2563EB] text-white px-4 py-2 rounded-xl font-bold cursor-pointer">
                    Save Deposit Rules
                  </button>
                </div>
              )}

              {/* Tab 3: EMR Integration */}
              {settingsTab === 'emr' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm">EMR & Electronic Health Record Sync</h3>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-900">Aesthetic Record (Connected)</div>
                      <div className="text-[11px] text-emerald-700">Real-time bi-directional patient chart & appointment sync</div>
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                </div>
              )}

              {/* Tab 4: Payment Gateways */}
              {settingsTab === 'payments' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm">Payment Gateways & Financing</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">Stripe Medical Terminal & Web Checkout</div>
                        <div className="text-[11px] text-slate-500">Connected to Chase Checking • Apple Pay active</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">Active</span>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">Cherry 0% APR Financing</div>
                        <div className="text-[11px] text-slate-500">Merchant ID #CH-88412 • Instant soft credit approval</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: AI Rules */}
              {settingsTab === 'ai_rules' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm">AI Speed-to-Lead Response Policy</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Auto-Response Delay Seconds</label>
                      <input
                        type="number"
                        value={autoSmsDelaySetting}
                        onChange={(e) => setAutoSmsDelaySetting(e.target.value)}
                        className="w-32 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">Recommended: 14 seconds for maximum patient reassurance.</span>
                    </div>
                  </div>
                  <button onClick={() => triggerToast('Updated AI speed-to-lead parameters.')} className="bg-[#2563EB] text-white px-4 py-2 rounded-xl font-bold cursor-pointer">
                    Save AI Policy
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: COMPREHENSIVE HELP & SUPPORT */}
          {/* ======================================================== */}
          {activeMenu === 'help' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Clinical Help & Concierge Support</h1>
                <p className="text-xs text-slate-500 mt-1">
                  24/7 dedicated support for aesthetic practices, HIPAA compliance advisory, and technical assistance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">24/7 Dedicated Concierge Hotline</h3>
                  <p className="text-slate-500">
                    Direct physician support line for practice directors and clinical managers.
                  </p>
                  <div className="font-mono text-sm font-bold text-blue-600">(310) 844-1290</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">HIPAA & Quad-A Documentation</h3>
                  <p className="text-slate-500">
                    Download signed Business Associate Agreement (BAA) and cryptographic audit trails.
                  </p>
                  <button onClick={() => triggerToast('Downloaded HIPAA BAA agreement (PDF).')} className="text-blue-600 font-bold underline cursor-pointer">
                    Download BAA Package →
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. MODALS (WITH FRAMER MOTION ANIMATIONS) */}
      {/* ======================================================== */}

      {/* REPEAT CUSTOMER RATE RETENTION COHORT MODAL */}
      <AnimatePresence>
        {isRepeatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl p-6 space-y-5 text-xs text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-[#12B76A]" />
                  <h3 className="font-bold text-base text-slate-900">Repeat Patient Retention Cohort Analysis</h3>
                </div>
                <button onClick={() => setIsRepeatModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-900 block">Overall Practice Retention</span>
                    <span className="text-3xl font-extrabold text-emerald-800 font-mono">68.4%</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-full shadow-2xs">
                    Top 5% in California
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-900 block">Re-Booking Velocity by Procedure</span>
                  <div className="space-y-1.5">
                    {[
                      { proc: 'Botox Cosmetic (90-Day Refresh Window)', rate: '82% Retention', count: '142 patients' },
                      { proc: 'Morpheus8 RF Protocol (3-Session Series)', rate: '94% Retention', count: '88 patients' },
                      { proc: 'Medical Hydrafacial Monthly Glow Pass', rate: '76% Retention', count: '190 patients' },
                      { proc: 'Dermal Fillers (12-Month Touch-Up)', rate: '64% Retention', count: '74 patients' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-900 block">{item.proc}</span>
                          <span className="text-[10px] text-slate-400">{item.count}</span>
                        </div>
                        <span className="font-bold text-emerald-700">{item.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-500">
                  <span>Retention Revenue Q3:</span>
                  <span className="font-bold text-slate-900 font-mono">$142,600.00</span>
                </div>
              </div>

              <button
                onClick={() => setIsRepeatModalOpen(false)}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2.5 rounded-xl font-bold cursor-pointer transition-colors"
              >
                Close Retention Report
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOMER CHART VIEW MODAL */}
      <AnimatePresence>
        {selectedCustomerForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl p-6 space-y-4 text-xs text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {selectedCustomerForModal.patientName ? selectedCustomerForModal.patientName.charAt(0) : 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {selectedCustomerForModal.patientName || 'Anonymous Inquirer'}
                    </h3>
                    <div className="text-[11px] text-slate-400">Chart #AR-9410 • Aesthetic Record Synced</div>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomerForModal(null)} className="p-1 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Contact Details</span>
                  <div className="flex justify-between text-slate-800 font-medium">
                    <span>Phone:</span>
                    <span>{selectedCustomerForModal.phone}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-medium">
                    <span>Inquiry Channel:</span>
                    <span className="capitalize">{selectedCustomerForModal.channel.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">AI Conversation Transcript</span>
                  <div className="space-y-1 text-slate-600 max-h-36 overflow-y-auto pr-1">
                    {selectedCustomerForModal.transcript?.map((t, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-white border border-slate-100">
                        <span className="text-[10px] font-bold text-blue-600 block capitalize">{t.sender}:</span>
                        <span>{t.text}</span>
                      </div>
                    )) || <span className="text-slate-400 italic">No historical transcript available.</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    triggerToast(`Launched direct SMS thread to ${selectedCustomerForModal.phone}`);
                    setSelectedCustomerForModal(null);
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Send Direct SMS
                </button>
                <button
                  onClick={() => setSelectedCustomerForModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Close Chart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW RECEIPT MODAL WITH ANIMATEPRESENCE */}
      <AnimatePresence>
        {selectedOrder && (
          <OrdersDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>

      {/* TREATMENT PROTOCOL FIELD EDITOR MODAL */}
      <TreatmentFieldEditor
        isOpen={Boolean(editingService) || isAddingTreatment}
        isNew={isAddingTreatment}
        service={editingService}
        onClose={() => {
          setEditingService(null);
          setIsAddingTreatment(false);
        }}
        onSave={(saved) => {
          if (isAddingTreatment && onAddService) {
            onAddService(saved);
          } else {
            onUpdateService(saved);
          }
        }}
      />

      {/* CUSTOMIZE DASHBOARD MODAL */}
      <AnimatePresence>
        {isCustomizeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl p-6 space-y-5 text-xs text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="font-bold text-base text-slate-900">Customize Practice Dashboard</h3>
                </div>
                <button onClick={() => setIsCustomizeOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-slate-500 text-[11px]">
                Toggle widgets to configure your clinical operating command center.
              </p>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {[
                  { key: 'capacityAlertBanner', label: 'AI Capacity Spotter Alert Banner' },
                  { key: 'kpiCards', label: 'Top 4 KPI Metrics Cards' },
                  { key: 'totalProfitChart', label: 'Total Profit Analytics Curve & Patients' },
                  { key: 'dayActiveBarChart', label: 'Weekly Procedure Volume & Capacity' },
                  { key: 'repeatPatientGauge', label: 'Repeat Customer Rate Radial Gauge' },
                  { key: 'bestSellingTreatments', label: 'Best Selling Treatments Table' },
                  { key: 'aiAssistantWidget', label: 'AI Assistant 3D Orb' },
                  { key: 'teamCollaboration', label: 'Clinical Team Live Collaboration' },
                  { key: 'speedToLeadEngine', label: 'AI Speed-to-Lead Response Engine' },
                  { key: 'frontDeskChatbot', label: 'AI Front Desk & Chatbot Panel' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-800 text-xs">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={(visibleWidgets as any)[item.key]}
                      onChange={(e) =>
                        setVisibleWidgets((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked
                        }))
                      }
                      className="w-4 h-4 text-[#2563EB] rounded-sm cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Save Layout
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SYSTEM HEALTH DIAGNOSTICS MODAL */}
      <AnimatePresence>
        {isSystemHealthModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 font-manrope">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 text-xs text-slate-800 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      All Systems Operational &amp; Clinical Health
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      Real-time SLA telemetry, EMR sync integrity, and payment rails
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsSystemHealthModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Uptime Badge Banner */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 block text-xs">
                    99.99% Guaranteed Availability
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Past 90 days: 0 outages, 0 degraded performance incidents
                  </span>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-2xs">
                  SLA Active
                </span>
              </div>

              {/* Detailed Service Status Grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Connected Subsystems &amp; API Integrity
                </span>

                <div className="space-y-2">
                  {[
                    {
                      name: 'Aesthetic Record EMR & EHR',
                      desc: 'Bidirectional patient chart sync & calendar locking',
                      status: 'Operational',
                      latency: '42ms',
                      detail: 'Last synchronized 14 seconds ago'
                    },
                    {
                      name: 'Stripe Connect & Cherry 0% APR Gateway',
                      desc: 'Credit card tokenization, POS terminals & financing webhooks',
                      status: 'Operational',
                      latency: '28ms',
                      detail: 'Zero pending disputes • 2-day rolling payout'
                    },
                    {
                      name: 'AI Speed-to-Lead Triage Engine',
                      desc: 'Meta, Google ads & web form inbound triage',
                      status: 'Operational',
                      latency: '15s SLA',
                      detail: 'Twilio SMS & WhatsApp Business API green'
                    },
                    {
                      name: 'Carefront Edge CDN & SSL Vault',
                      desc: 'Cloudflare enterprise caching & DDoS mitigation',
                      status: 'Operational',
                      latency: '12ms',
                      detail: 'SSL 256-bit TLS 1.3 active • 98.4% cache hit'
                    },
                    {
                      name: 'Quad-A HIPAA Security Vault',
                      desc: 'Encrypted patient database and clinical audit trails',
                      status: 'Compliant',
                      latency: '18ms',
                      detail: 'BAA executed • AES-256 rest encryption'
                    }
                  ].map((sys, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>{sys.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{sys.desc}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{sys.detail}</div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                          {sys.status}
                        </span>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">{sys.latency}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    triggerToast('⚡ Diagnostic ping sent to Aesthetic Record & Stripe. All nodes responded in <45ms.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Re-test Subsystems</span>
                </button>

                <button
                  onClick={() => setIsSystemHealthModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  Close Diagnostics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOCTOR SESSION AUTHENTICATION & REGISTRATION MODAL */}
      {isDoctorAuthModalOpen && (
        <DoctorAuthView
          onLoginSuccess={(doctor) => {
            setActiveDoctor(doctor);
            onUpdateDoctor?.(doctor);
            setIsDoctorAuthModalOpen(false);
          }}
          onToast={triggerToast}
          onCancel={() => setIsDoctorAuthModalOpen(false)}
        />
      )}

    </div>
  );
};
