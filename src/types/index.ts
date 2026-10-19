// Shared TypeScript interfaces for Carefront & Aura MedSpa & Aesthetics

export type ClinicalVertical = 'medspa' | 'dental';

export interface TenantBranding {
  primaryColor: string;
  accentColor: string;
  fontFamily: 'Editorial Serif' | 'Geometric Sans' | 'Luxury Grotesk' | 'Classical Roman' | string;
  fontScale?: 'compact' | 'balanced' | 'spacious' | string;
  fontTracking?: 'tight' | 'normal' | 'wide' | string;
  themePreset: 'Warm Alabaster' | 'Luxe Gold' | 'Clean Medical Slate' | string;
  logoUrl?: string;
  logoType?: 'monogram' | 'custom_image';
  heroHeadline: string;
  heroSubhead: string;
  heroBadge?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  heroImageUrl?: string;
  heroVariant?: 'split_ambient' | 'centered_luxury' | 'physician_consult' | 'video_ambient';
  heroDesign?: 'warm_alabaster' | 'luxe_editorial' | 'clinical_slate' | 'frosted_glass';
  bannerText: string;
  bannerColor?: string;
  navbarLocation?: string;
  navbarPhone?: string;
  navbarShowPhone?: boolean;
  navbarCtaText?: string;
  widgets?: {
    aiFrontDesk?: boolean;
    missedCallSms?: boolean;
    quickBookBar?: boolean;
    onlineBookingBadge?: boolean;
  };
  servicesConfig?: {
    headline?: string;
    subhead?: string;
    cardStyle?: 'glass' | 'minimal' | 'compact' | 'editorial' | 'bordered_accent';
    cardStyles?: Record<string, 'glass' | 'minimal' | 'compact' | 'editorial' | 'bordered_accent'>;
    slotCardStyles?: Record<number, 'glass' | 'minimal' | 'compact' | 'editorial' | 'bordered_accent'>;
    slotServiceIds?: string[];
    featuredServiceIds?: string[];
    showDeposits?: boolean;
    showFinancing?: boolean;
    gridCols?: 2 | 3 | 4;
    gridRows?: 1 | 2;
    layoutPreset?: '2col_1row' | '3col_1row' | '2col_2row' | '3col_2row' | '4col_1row';
    designPreset?: 'modern_minimalist' | 'high_end_editorial' | 'frosted_luxe' | 'clinical_slate';
  };
  featuresConfig?: {
    headline?: string;
    subhead?: string;
    doctorName?: string;
    doctorTitle?: string;
    doctorBio?: string;
    doctorImage?: string;
    eyebrowBadge?: string;
    layout?: 'split_left_right' | 'grid_cards' | 'bento_features' | 'asymmetric_spotlight';
    design?: 'clinical_editorial' | 'clean_minimal' | 'high_tech_slate' | 'luxury_tint';
    variant?: 'video_split' | 'grid_cards' | 'clinical_tabs';
    bullets?: Array<{ title: string; description: string; iconName?: string; highlightBadge?: string }>;
  };
  reviewsConfig?: {
    headline?: string;
    subhead?: string;
    ratingScore?: string;
    reviewCount?: string;
    badgeLabel?: string;
    layout?: 'bento_grid' | 'three_col_cards' | 'horizontal_marquee' | 'split_spotlight';
    design?: 'minimal_white' | 'glass_frosted' | 'editorial_quote' | 'dark_luxury';
    variant?: 'bento' | 'carousel_cards' | 'editorial_spotlight';
    cardDesign?: 'minimal_white' | 'glass_frosted' | 'editorial_quote' | 'dark_luxury' | 'clinical_trust';
  };
  faqConfig?: {
    headline?: string;
    subhead?: string;
    layout?: 'single_col_accordion' | 'two_col_split' | 'categorized_tabs' | 'boxed_cards_grid';
    design?: 'clean_minimal' | 'bordered_cards' | 'brand_tint_glass' | 'editorial_dividers';
    variant?: 'accordion' | 'split_two_col' | 'boxed_cards';
    faqs?: Array<{ question: string; answer: string }>;
  };
  teamConfig?: {
    headline?: string;
    subhead?: string;
    layout?: 'three_cards' | 'horizontal_roster' | 'bio_grid' | 'compact_row';
    design?: 'portrait_editorial' | 'clinical_badges' | 'modern_cards' | 'glass_minimal';
    variant?: 'three_cards' | 'horizontal_roster' | 'bio_grid';
    selectedProviderIds?: string[];
  };
  galleryConfig?: {
    headline?: string;
    subhead?: string;
    layout?: 'three_cases' | 'comparison_slider' | 'showcase_tabs' | 'bento_gallery';
    design?: 'clinical_precision' | 'luxury_aesthetic' | 'clean_alabaster' | 'minimal_slate';
    variant?: 'three_cases' | 'comparison_slider' | 'showcase_tabs';
  };
  membershipConfig?: {
    headline?: string;
    subhead?: string;
    layout?: 'three_cards' | 'highlighted_center' | 'minimal_matrix' | 'vip_split';
    design?: 'luxury_gold_vip' | 'clean_alabaster' | 'glass_frosted' | 'editorial_black_tie';
    variant?: 'three_cards' | 'highlighted_center' | 'minimal_matrix';
  };
  financingConfig?: {
    headline?: string;
    subhead?: string;
    layout?: 'spotlight_banner' | 'calculator_card' | 'split_trust' | 'three_step_grid';
    design?: 'cherry_ruby_luxe' | 'clean_minimal' | 'dark_concierge' | 'brand_tinted';
    variant?: 'spotlight_banner' | 'calculator_card' | 'split_trust';
    approvedAmount?: string;
  };
  footerConfig?: {
    address?: string;
    phone?: string;
    email?: string;
    hours?: string;
    copyright?: string;
    disclaimer?: string;
    layout?: '5col_directory' | '4col_clean' | 'centered_luxe' | 'split_hours';
    design?: 'dark_luxe' | 'alabaster_clean' | 'brand_tinted' | 'monogram_minimal' | 'modern_slate';
    variant?: 'dark_luxe' | 'alabaster_clean' | 'monogram_minimal';
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    serviceLinks?: Array<{ label: string; href: string }>;
    quickLinks?: Array<{ label: string; href: string }>;
    legalLinks?: Array<{ label: string; href: string }>;
    instagramUrl?: string;
    facebookUrl?: string;
    websiteUrl?: string;
  };
  sectionsOrder?: string[];
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  customDomain: string;
  branding: TenantBranding;
  emrProvider: 'aesthetic_record' | 'dentrix';
  emrApiKey?: string;
  stripeAccountId?: string;
}

export interface Service {
  id: string;
  tenantId: string;
  category: 'injectables' | 'laser_rf' | 'facials' | 'longevity' | 'ortho' | 'cosmetic_dental';
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  retailPriceCents: number; // e.g. 85000 = $850.00
  depositPriceCents: number; // e.g. 10000 = $100.00
  isFinancingEligible: boolean;
  isActive: boolean;
  badge?: string;
  imageUrl: string;
}

export interface Provider {
  id: string;
  tenantId: string;
  name: string;
  title: string;
  credentials: string;
  specialty: string;
  bio: string;
  avatarUrl: string;
  workingHours: {
    days: string[];
    start: string;
    end: string;
  };
}

export interface Patient {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  intakeStatus: 'pending' | 'completed';
  lastTreatmentDate?: string;
  chartNumber: string;
}

export interface Appointment {
  id: string;
  tenantId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  startTime: string; // ISO
  endTime: string;
  status: 'reserved' | 'confirmed' | 'completed' | 'no_show';
  depositAmountCents: number;
  depositStripeId?: string;
  emrSyncStatus: 'synced' | 'pending' | 'failed';
  emrAppointmentId?: string;
  isMissedCallRecovered?: boolean;
}

export interface Order {
  id: string;
  tenantId: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  subtotalCents: number;
  depositCents: number;
  gratuityCents: number;
  totalDueTodayCents: number;
  paymentMethod: 'stripe_card' | 'apple_pay' | 'cherry_financing';
  stripePaymentIntentId?: string;
  status: 'pending' | 'succeeded' | 'refunded';
  lineItems: {
    title: string;
    type: 'service_deposit' | 'retail_product' | 'membership';
    priceCents: number;
    quantity: number;
  }[];
  emrSyncStatus: 'synced' | 'pending';
  createdAt: string;
}

export interface InboundLead {
  id: string;
  tenantId: string;
  phone: string;
  patientName?: string;
  channel: 'web_chat' | 'sms_missed_call';
  intentScore: number; // 0 - 100
  intentTag: 'High Value ($1,000+)' | 'Procedure Inquirer' | 'Price Sensitive' | 'Missed-Call Recovery';
  status: 'ai_qualifying' | 'converted' | 'escalated';
  depositSecured: boolean;
  transcript: {
    sender: 'patient' | 'ai' | 'staff';
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface RecallLog {
  id: string;
  tenantId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  serviceName: string;
  cadenceDays: number;
  dueDate: string;
  sentAt?: string;
  status: 'queued' | 'sent' | 'booked';
  suggestedSlot: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  avatarUrl: string;
  rating: number;
  procedure?: string;
  provider?: string;
  comment: string;
  date: string;
  status?: 'Posted to Google' | 'Pending Response';
  aiSentimentTag?: string;
  emrVerified?: boolean;
  isVerifiedPatient?: boolean;
  aiDraftResponse?: string;
}

export interface RetailProduct {
  id: string;
  title: string;
  category: string;
  benefit: string;
  price: number;
  volume: string;
  imageUrl: string;
}

// ==========================================
// MARKETING & AD GENERATOR TYPES
// ==========================================
export interface AdCreative {
  id: string;
  procedureName: string;
  headlineBadge: string;
  aspectRatio: '1:1 Square' | '4:5 Feed' | '9:16 Story';
  imageUrl: string;
  shortHook: string;
  educationalStory: string;
  directOffer: string;
  targetAudienceTags: string[];
  suggestedBudgetDaily: number;
  projectedRoas: string;
}

export interface SeoArticle {
  id: string;
  procedureName: string;
  title: string;
  slug: string;
  metaDescription: string;
  readTime: string;
  schemaJsonLd: string;
  contentMarkdown: string;
  targetKeywords: string[];
  isPublishedToBlog: boolean;
  publishedDate: string;
}

export interface BroadcastCampaign {
  id: string;
  name: string;
  channel: 'sms' | 'email';
  segmentName: string;
  audienceCount: number;
  promoOffer: string;
  promoCode: string;
  messageContent: string;
  deliverabilityRate: number;
  projectedRevenue: number;
  status: 'draft' | 'scheduled' | 'sent';
  sentAt?: string;
  openedCount?: number;
  convertedCount?: number;
}

// ==========================================
// ABANDONED CHECKOUT RECOVERY TYPES
// ==========================================
export interface AbandonedCheckout {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  treatmentName: string;
  cartTotalCents: number;
  depositAmountCents: number;
  dropoffStage: 'deposit_auth' | 'datetime_select' | 'financing_prequal' | 'intake_form';
  dropoffStageLabel: string;
  abandonedAt: string;
  timeAgo: string;
  status: 'pending_auto_sms' | 'sms_sent' | 'recovered' | 'unresponsive';
  recoveryDiscountOffer: string;
  suggestedSmsText: string;
  notes?: string;
}

// ==========================================
// CAPACITY SPOTTER TYPES
// ==========================================
export interface CapacitySlot {
  id: string;
  providerName: string;
  providerAvatar?: string;
  roomName: string;
  dateStr: string;
  timeWindow: string;
  durationMinutes: number;
  idleCategory: 'doctor_gap' | 'laser_room_idle' | 'nurse_opening' | 'suite_free';
  potentialRevenueCents: number;
  recommendedTreatments: string[];
  flashDiscountPercent: number;
  matchingWaitlistPatientsCount: number;
  flashSmsPreview: string;
  isBroadcasted: boolean;
}

// ==========================================
// CLINICAL AFTERCARE TYPES
// ==========================================
export interface ClinicalAftercareRecord {
  id: string;
  patientName: string;
  patientPhone: string;
  procedureName: string;
  providerName: string;
  treatedDate: string;
  daysPostTreatment: number;
  milestoneCheck: 'Day 1 Check-in' | 'Day 3 Tenderness' | 'Day 7 Healing' | 'Day 14 Touch-up & Review';
  status: 'awaiting_photo' | 'verified_normal' | 'alert_flagged' | 'review_prompted';
  patientPhotoUrl?: string;
  patientSymptomsFeedback: string;
  complianceChecked: boolean;
  alertNotes?: string;
  googleReviewEligible: boolean;
  timelineLogs: Array<{
    sender: 'system' | 'patient' | 'clinician';
    message: string;
    timestamp: string;
  }>;
}
