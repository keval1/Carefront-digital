import React, { useState } from 'react';
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  Send,
  FileText,
  Megaphone,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Eye,
  CheckCircle2,
  Code,
  Smartphone,
  Mail,
  Users,
  DollarSign,
  TrendingUp,
  Download,
  AlertCircle
} from 'lucide-react';
import { Service, AdCreative, SeoArticle, BroadcastCampaign } from '../../types';
import { hexToRgba } from '../../utils/themeUtils';

interface MarketingAdsStudioProps {
  services: Service[];
  accentColor?: string;
  primaryColor?: string;
  adCreatives: AdCreative[];
  onAddAdCreative: (creative: AdCreative) => void;
  seoArticles: SeoArticle[];
  onAddSeoArticle: (article: SeoArticle) => void;
  broadcastCampaigns: BroadcastCampaign[];
  onSendBroadcastCampaign: (campaign: BroadcastCampaign) => void;
  onToast: (msg: string) => void;
  subPage?: 'ads' | 'seo' | 'broadcasts';
}

export const MarketingAdsStudio: React.FC<MarketingAdsStudioProps> = ({
  services,
  accentColor = '#2563EB',
  primaryColor = '#064E3B',
  adCreatives,
  onAddAdCreative,
  seoArticles,
  onAddSeoArticle,
  broadcastCampaigns,
  onSendBroadcastCampaign,
  onToast,
  subPage = 'ads'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ads' | 'seo' | 'broadcasts'>(subPage);
  
  React.useEffect(() => {
    if (subPage) setActiveSubTab(subPage);
  }, [subPage]);

  // Ad Generator State
  const [selectedProcedure, setSelectedProcedure] = useState<string>(services[0]?.name || 'Morpheus8 RF Dermal Lift');
  const [campaignGoal, setCampaignGoal] = useState<'new_patient' | 'seasonal' | 'flash_sale'>('new_patient');
  const [isGeneratingAds, setIsGeneratingAds] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // SEO Article Generator State
  const [selectedSeoProcedure, setSelectedSeoProcedure] = useState<string>(services[0]?.name || 'Morpheus8 RF Dermal Lift');
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [selectedArticlePreview, setSelectedArticlePreview] = useState<SeoArticle | null>(seoArticles[0] || null);

  // Broadcasts State
  const [selectedSegment, setSelectedSegment] = useState<'dormant' | 'tox_refresh' | 'leads'>('dormant');
  const [channel, setChannel] = useState<'sms' | 'email'>('sms');
  const [promoOffer, setPromoOffer] = useState('$50 Off Any Fall Treatment');
  const [promoCode, setPromoCode] = useState('FALLGLOW');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  const segmentAudienceCounts = {
    dormant: { name: 'Dormant Patients (6+ Months Since Last Visit)', count: 142, revenue: 8200 },
    tox_refresh: { name: 'Neurotoxin Due for Refresh (90–120 Days)', count: 38, revenue: 4940 },
    leads: { name: 'High-Value Procedure Inquirers (Unconverted Leads)', count: 24, revenue: 6480 }
  };

  const currentSegment = segmentAudienceCounts[selectedSegment];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(id);
    onToast('Copied to clipboard!');
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleGenerateAds = () => {
    setIsGeneratingAds(true);
    setTimeout(() => {
      const targetService = services.find((s) => s.name === selectedProcedure) || services[0];
      const goalLabels = {
        new_patient: 'New Patient Acquisition',
        seasonal: 'Seasonal Rejuvenation',
        flash_sale: 'Open Capacity Flash'
      };

      const newCreative: AdCreative = {
        id: `ad-${Date.now()}`,
        procedureName: selectedProcedure,
        headlineBadge: `${goalLabels[campaignGoal]} • Dr. Jenkins`,
        aspectRatio: '4:5 Feed',
        imageUrl: targetService?.imageUrl || 'https://images.unsplash.com/photo-1512290900672-1f023075b9f9?auto=format&fit=crop&w=800&q=80',
        shortHook: `Experience Beverly Hills' top-rated ${selectedProcedure}. Natural elegance with board-certified anatomical precision.`,
        educationalStory: `Unlike off-the-shelf treatments, our ${selectedProcedure} protocol targets specific dermal tissue planes for profound longevity with zero unnecessary trauma.`,
        directOffer: `Lock your priority slot with promo code ${promoCode || 'NEWGLOW'} for $100 off your initial session + 0% financing through Cherry.`,
        targetAudienceTags: ['Women & Men 28–60', 'Radius 15mi Beverly Hills', 'Luxury Wellness', 'Household Income $120k+'],
        suggestedBudgetDaily: 55,
        projectedRoas: '5.4x'
      };

      onAddAdCreative(newCreative);
      setIsGeneratingAds(false);
      onToast(`✨ Generated 3 high-converting ad variations for "${selectedProcedure}"!`);
    }, 1200);
  };

  const handleGenerateArticle = () => {
    setIsGeneratingArticle(true);
    setTimeout(() => {
      const slug = `complete-guide-${selectedSeoProcedure.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-beverly-hills`;
      const title = `Complete Clinical Guide to ${selectedSeoProcedure}: Downtime, Candidate Suitability & Results`;
      const newArticle: SeoArticle = {
        id: `art-${Date.now()}`,
        procedureName: selectedSeoProcedure,
        title,
        slug,
        metaDescription: `Discover how ${selectedSeoProcedure} delivers anatomical restoration in Beverly Hills. Clinical safety, expected healing timelines, and before/after milestones by Dr. Sarah Jenkins, MD.`,
        readTime: '6 min read',
        targetKeywords: [
          `${selectedSeoProcedure} Beverly Hills`,
          `${selectedSeoProcedure} downtime`,
          'Aura MedSpa clinical protocols',
          'board-certified aesthetic physician'
        ],
        isPublishedToBlog: false,
        publishedDate: 'Just Generated',
        schemaJsonLd: JSON.stringify(
          {
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: title,
            headline: title,
            author: {
              '@type': 'Physician',
              name: 'Dr. Sarah Jenkins, MD',
              medicalSpecialty: 'Dermatology & Aesthetic Medicine'
            },
            publisher: {
              '@type': 'MedicalBusiness',
              name: 'Aura MedSpa & Aesthetics Beverly Hills'
            }
          },
          null,
          2
        ),
        contentMarkdown: `### Clinical Overview: ${selectedSeoProcedure}
At Aura MedSpa, every ${selectedSeoProcedure} is calibrated using anatomical precision mapping. Our approach prioritizes structural tissue health, natural contours, and predictable downtime.

#### What to Expect During Your Session
1. **Clinical Assessment:** Comprehensive consultation and 3D facial imaging.
2. **Procedure Execution:** Performed exclusively by board-certified physicians using medical-grade topical anesthesia.
3. **Immediate Aftercare:** Application of proprietary lipid barrier peptides for rapid recovery.`
      };

      onAddSeoArticle(newArticle);
      setSelectedArticlePreview(newArticle);
      setIsGeneratingArticle(false);
      onToast(`✨ Generated SEO & Schema article for "${selectedSeoProcedure}"!`);
    }, 1400);
  };

  const handlePublishArticleToBlog = (art: SeoArticle) => {
    art.isPublishedToBlog = true;
    onToast(`🚀 "${art.title}" published directly to Storefront Blog with JSON-LD Schema!`);
  };

  const handleSendBroadcast = () => {
    setIsSendingBroadcast(true);
    setTimeout(() => {
      const newCampaign: BroadcastCampaign = {
        id: `camp-${Date.now()}`,
        name: `${promoOffer} Broadcast`,
        channel,
        segmentName: currentSegment.name,
        audienceCount: currentSegment.count,
        promoOffer,
        promoCode,
        messageContent: `Aura MedSpa: Hi {first_name}, enjoy ${promoOffer} with Dr. Jenkins this week only. Claim your credit and lock your slot: https://auramedspa.com/book?promo=${promoCode} • Reply STOP to opt out`,
        deliverabilityRate: 99.6,
        projectedRevenue: currentSegment.revenue,
        status: 'sent',
        sentAt: 'Just now',
        openedCount: Math.round(currentSegment.count * 0.94),
        convertedCount: Math.round(currentSegment.count * 0.16)
      };

      onSendBroadcastCampaign(newCampaign);
      setIsSendingBroadcast(false);
      onToast(`🚀 Dispatched broadcast to ${currentSegment.count} patients! ($${currentSegment.revenue.toLocaleString()} projected revenue)`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {activeSubTab === 'ads' && 'Meta & Google Ad Campaigns'}
              {activeSubTab === 'seo' && 'SEO & AEO Clinical Guides'}
              {activeSubTab === 'broadcasts' && 'Patient Broadcasts & Recalls'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activeSubTab === 'ads' && 'Generate and manage high-converting Meta, Instagram & Google Local Services ad creatives with one-click export.'}
            {activeSubTab === 'seo' && 'Generate and publish Schema.org JSON-LD medical articles directly to the storefront blog.'}
            {activeSubTab === 'broadcasts' && 'Automated SMS and Email retention campaigns targeted to patient segments.'}
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: META & GOOGLE AD GENERATOR */}
      {/* ======================================================== */}
      {activeSubTab === 'ads' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Procedure</label>
                <select
                  value={selectedProcedure}
                  onChange={(e) => setSelectedProcedure(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.name}>
                      {srv.name} (${srv.retailPriceCents / 100})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Campaign Goal</label>
                <select
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="new_patient">New Patient Acquisition</option>
                  <option value="seasonal">Seasonal Promotion</option>
                  <option value="flash_sale">Open Capacity Flash Sale</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateAds}
                  disabled={isGeneratingAds}
                  style={{ backgroundColor: accentColor }}
                  className="w-full text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-90 cursor-pointer"
                >
                  {isGeneratingAds ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Creatives with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>✨ Generate Ad Campaign with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Ad Creatives Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adCreatives.map((creative) => (
              <div
                key={creative.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Visual Mockup Header with Aspect Badge */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden group">
                    <img
                      src={creative.imageUrl}
                      alt={creative.procedureName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-900 border border-white/40">
                        {creative.aspectRatio}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-bold">
                        {creative.headlineBadge}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[10px] text-blue-200 font-mono uppercase font-bold tracking-wider">
                        {creative.procedureName}
                      </div>
                      <div className="text-sm font-bold line-clamp-1 mt-0.5">{creative.shortHook}</div>
                    </div>
                  </div>

                  {/* Copywriting Variations */}
                  <div className="p-5 space-y-4">
                    {/* Variation 1: Short Hook */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>1. Short Hook</span>
                        <button
                          onClick={() => handleCopy(creative.shortHook, `${creative.id}-hook`)}
                          className="hover:text-blue-600 cursor-pointer"
                        >
                          {copiedText === `${creative.id}-hook` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">"{creative.shortHook}"</p>
                    </div>

                    {/* Variation 2: Educational Story */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>2. Educational Story</span>
                        <button
                          onClick={() => handleCopy(creative.educationalStory, `${creative.id}-story`)}
                          className="hover:text-blue-600 cursor-pointer"
                        >
                          {copiedText === `${creative.id}-story` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed text-[11px]">{creative.educationalStory}</p>
                    </div>

                    {/* Variation 3: Direct Offer */}
                    <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/60 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-blue-700">
                        <span>3. Direct Offer</span>
                        <button
                          onClick={() => handleCopy(creative.directOffer, `${creative.id}-offer`)}
                          className="hover:text-blue-600 cursor-pointer"
                        >
                          {copiedText === `${creative.id}-offer` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-xs text-blue-900 font-semibold leading-relaxed text-[11px]">{creative.directOffer}</p>
                    </div>

                    {/* Target Audience Tags */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Recommended Audience Targeting
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {creative.targetAudienceTags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    <span className="font-bold text-slate-900 font-mono">${creative.suggestedBudgetDaily}/day</span> • Est. ROAS: <span className="font-bold text-emerald-700">{creative.projectedRoas}</span>
                  </div>

                  <button
                    onClick={() => onToast(`🚀 Exported creative "${creative.procedureName}" to Meta Ads Manager campaign!`)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Export to Meta</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: SEO & AEO ARTICLE GENERATOR */}
      {/* ======================================================== */}
      {activeSubTab === 'seo' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Procedure Topic to Target</label>
                <select
                  value={selectedSeoProcedure}
                  onChange={(e) => setSelectedSeoProcedure(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.name}>
                      {srv.name} (Search Engine & Answer Engine Optimization)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateArticle}
                  disabled={isGeneratingArticle}
                  style={{ backgroundColor: accentColor }}
                  className="w-full text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-90 cursor-pointer"
                >
                  {isGeneratingArticle ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Writing Medical Article...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>✨ Generate SEO Article + JSON-LD</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Article List & Preview Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Article Directory (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Generated Clinical Articles</span>
              <div className="space-y-2.5">
                {seoArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticlePreview(art)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedArticlePreview?.id === art.id
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-1">
                      <span>{art.readTime}</span>
                      {art.isPublishedToBlog ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                          Live on Blog
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">{art.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1 line-clamp-1 font-mono">/{art.slug}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Preview (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
              {selectedArticlePreview ? (
                <>
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                          {selectedArticlePreview.procedureName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{selectedArticlePreview.publishedDate}</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 leading-tight">
                        {selectedArticlePreview.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => handlePublishArticleToBlog(selectedArticlePreview)}
                      disabled={selectedArticlePreview.isPublishedToBlog}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        selectedArticlePreview.isPublishedToBlog
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      }`}
                    >
                      {selectedArticlePreview.isPublishedToBlog ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Published to Storefront Blog</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Publish Directly to Storefront Blog</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Meta Details */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 text-[11px] block">Meta Description</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{selectedArticlePreview.metaDescription}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 text-[11px] block mb-1">Target Keywords</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedArticlePreview.targetKeywords.map((kw, i) => (
                          <span key={i} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-mono">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Article Markdown Body */}
                  <div className="prose prose-sm max-w-none text-xs text-slate-700 space-y-3 leading-relaxed whitespace-pre-line bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60">
                    {selectedArticlePreview.contentMarkdown}
                  </div>

                  {/* Structured Schema JSON-LD Display */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-blue-600" />
                        <span>Structured JSON-LD Schema (MedicalWebPage)</span>
                      </span>
                      <button
                        onClick={() => handleCopy(selectedArticlePreview.schemaJsonLd, 'schema-code')}
                        className="text-blue-600 hover:underline flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                      >
                        {copiedText === 'schema-code' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Schema</span>
                      </button>
                    </div>
                    <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-48">
                      {selectedArticlePreview.schemaJsonLd}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Select or generate an article to preview.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: CAMPAIGN BROADCAST ENGINE (SMS & EMAIL) */}
      {/* ======================================================== */}
      {activeSubTab === 'broadcasts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Campaign Builder (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">Broadcast Campaign Builder</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Re-engage inactive patients or trigger seasonal promotions with high deliverability.
                </p>
              </div>

              {/* 1. Audience Segmentation Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">1. Select Target Audience Segment</label>
                <div className="space-y-2">
                  {[
                    { key: 'dormant', label: 'Dormant Patients (6+ Months Since Last Visit)', count: '142 patients', tag: 'High Opportunity' },
                    { key: 'tox_refresh', label: 'Neurotoxin Due for Refresh (90–120 Days)', count: '38 patients', tag: 'Predictable Cadence' },
                    { key: 'leads', label: 'High-Value Procedure Inquirers (Unconverted Leads)', count: '24 patients', tag: 'High Intent' }
                  ].map((seg) => (
                    <div
                      key={seg.key}
                      onClick={() => setSelectedSegment(seg.key as any)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedSegment === seg.key
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedSegment === seg.key ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {selectedSegment === seg.key && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{seg.label}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{seg.count}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                        {seg.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Channel & Offer */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Message Channel</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setChannel('sms')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-all ${
                          channel === 'sms'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>SMS Broadcast</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChannel('email')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-all ${
                          channel === 'email'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Newsletter</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Promo Code</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="e.g. FALLGLOW"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Promo Offer Headline</label>
                  <input
                    type="text"
                    value={promoOffer}
                    onChange={(e) => setPromoOffer(e.target.value)}
                    placeholder="e.g. $50 Off Any Fall Treatment"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Simulation Stats Badge */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">
                    Projected Revenue
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-900 mt-0.5">
                    ${currentSegment.revenue.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-700">Based on 16% historical conversion</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">
                    Deliverability Rate
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-900 mt-0.5">99.4%</div>
                  <span className="text-[10px] text-emerald-700">Carrier 10DLC verified routes</span>
                </div>
              </div>

              {/* Send Action Button */}
              <button
                onClick={handleSendBroadcast}
                disabled={isSendingBroadcast}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                {isSendingBroadcast ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatched to Carrier Network...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>🚀 Send Broadcast to {currentSegment.count} Patients</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Live Phone / Message Preview (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-4 pb-2 border-b border-slate-800">
                  <span className="font-bold flex items-center gap-1.5 text-slate-200">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>Live Outgoing Preview</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">10DLC Compliant</span>
                </div>

                {/* Simulated iPhone Bubble */}
                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-300">Aura MedSpa Concierge</span>
                    <span>Just now</span>
                  </div>

                  <p className="text-xs text-slate-100 leading-relaxed font-sans">
                    Aura MedSpa: Hi <span className="text-blue-400 font-bold">&#123;first_name&#125;</span>, enjoy{' '}
                    <span className="text-amber-300 font-bold">{promoOffer}</span> with Dr. Jenkins this week only.
                    Claim your credit and lock your slot:{' '}
                    <span className="text-blue-400 underline font-mono">
                      https://auramedspa.com/book?c={promoCode || 'GLOW'}
                    </span>{' '}
                    • Reply STOP to opt out
                  </p>
                </div>

                <div className="mt-4 text-[10px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Target Segment:</span>
                    <span className="font-bold text-slate-200">{currentSegment.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recipients:</span>
                    <span className="font-bold text-slate-200">{currentSegment.count} verified patients</span>
                  </div>
                </div>
              </div>

              {/* Past Campaigns Log */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <span className="text-xs font-bold text-slate-900 block">Recent Broadcast Campaigns</span>
                <div className="divide-y divide-slate-100 text-xs">
                  {broadcastCampaigns.map((camp) => (
                    <div key={camp.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{camp.name}</div>
                        <div className="text-[10px] text-slate-400">{camp.sentAt} • {camp.audienceCount} delivered</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-emerald-700 block">
                          ${camp.projectedRevenue.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">{camp.convertedCount || 19} converted</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
