import React, { useState, useEffect } from 'react';
import { X, Globe, Search, Sparkles, Check, Sliders, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface PageSeoConfig {
  id: string;
  name: string;
  slug: string;
  titleTag: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  indexInSearch?: boolean;
}

interface PageSeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageConfig: PageSeoConfig;
  onSave: (updated: PageSeoConfig) => void;
}

export const PageSeoModal: React.FC<PageSeoModalProps> = ({
  isOpen,
  onClose,
  pageConfig,
  onSave
}) => {
  const [formData, setFormData] = useState<PageSeoConfig>({ ...pageConfig });
  const [sameAsSeo, setSameAsSeo] = useState<boolean>(
    !pageConfig.ogTitle || pageConfig.ogTitle === pageConfig.titleTag
  );

  useEffect(() => {
    setFormData({ ...pageConfig });
    setSameAsSeo(!pageConfig.ogTitle || pageConfig.ogTitle === pageConfig.titleTag);
  }, [pageConfig]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const titleLength = (formData.titleTag || '').length;
  const descLength = (formData.metaDescription || '').length;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[1000] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-manrope select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="bg-white rounded-3xl max-w-xl w-full border border-slate-200/90 shadow-2xl overflow-hidden text-xs text-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Page Settings & SEO — {formData.name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Configure search engine optimization, metadata, and page attributes.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Live Google Search Result SERP Preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3 h-3 text-blue-600" />
                  Google SERP Search Preview
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Schema.org Verified
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white font-bold">
                    A
                  </span>
                  <span className="truncate">https://auramedspa.com{formData.slug === '/' ? '' : formData.slug}</span>
                </div>
                <div className="text-blue-700 hover:underline font-medium text-sm leading-snug line-clamp-1 cursor-pointer">
                  {formData.titleTag || `${formData.name} | Aura Aesthetics`}
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {formData.metaDescription || 'Experience premier physician-administered neurotoxins, Morpheus8 RF tissue tightening, and medical facial contouring in Beverly Hills.'}
                </div>
              </div>
            </div>

            {/* General Page Information */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Page Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium"
                    placeholder="e.g. Signature Treatments"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">URL Path (Slug)</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                    <span className="text-slate-400 select-none">/</span>
                    <input
                      type="text"
                      required
                      value={formData.slug.replace(/^\//, '')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          slug: e.target.value.startsWith('/') ? e.target.value : `/${e.target.value}`
                        })
                      }
                      className="w-full bg-transparent border-none outline-none text-xs text-slate-900 font-medium pl-0.5"
                      placeholder="treatments"
                    />
                  </div>
                </div>
              </div>

              {/* Title Tag with recommendations */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 block">Title Tag (&lt;title&gt;)</label>
                  <span
                    className={`text-[10px] font-mono ${
                      titleLength > 60
                        ? 'text-amber-600 font-bold'
                        : titleLength >= 40
                        ? 'text-emerald-600 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    {titleLength} / 60 chars {titleLength > 60 ? '(Long)' : titleLength >= 40 ? '(Optimal)' : ''}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.titleTag}
                  onChange={(e) => setFormData({ ...formData, titleTag: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium"
                  placeholder="e.g. Clinical Aesthetic Treatments & RF Contouring | Aura Aesthetics"
                />
              </div>

              {/* Meta Description with recommendations */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 block">Meta Description</label>
                  <span
                    className={`text-[10px] font-mono ${
                      descLength > 160
                        ? 'text-amber-600 font-bold'
                        : descLength >= 120
                        ? 'text-emerald-600 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    {descLength} / 160 chars {descLength > 160 ? '(Truncated in SERP)' : descLength >= 120 ? '(Optimal)' : ''}
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium resize-none leading-relaxed"
                  placeholder="Summarize the procedure, physician qualifications, and value proposition for searchers..."
                />
              </div>

              {/* Open Graph Social Share Settings */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-slate-800 block text-xs">
                      OpenGraph Social Share Settings (og:title &amp; og:description)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Card preview shown when this page is shared on iMessage, WhatsApp, Meta &amp; LinkedIn.
                    </p>
                  </div>
                </div>

                {/* Option: Same as SEO title and meta description */}
                <label className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={sameAsSeo}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSameAsSeo(checked);
                      if (checked) {
                        setFormData({
                          ...formData,
                          ogTitle: formData.titleTag,
                          ogDescription: formData.metaDescription
                        });
                      }
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800">Same as SEO title and meta description</span>
                    <span className="text-[10px] text-slate-400 block">Keep social share cards synchronized with Google search preview</span>
                  </div>
                </label>

                {!sameAsSeo ? (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                        OpenGraph Title (og:title)
                      </label>
                      <input
                        type="text"
                        value={formData.ogTitle || ''}
                        onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-500 outline-none transition-all font-medium"
                        placeholder="e.g. Aura Aesthetics — Beverly Hills Premier Medical Spa"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                        OpenGraph Description (og:description)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.ogDescription || ''}
                        onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-500 outline-none transition-all font-medium resize-none leading-relaxed"
                        placeholder="Custom snippet when shared on social apps..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-800 flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Synchronized: Social cards will mirror <strong>"{formData.titleTag || formData.name}"</strong> and active meta description.</span>
                  </div>
                )}
              </div>

              {/* Search Engine Indexing Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Search Engine Indexing</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Allow Google, Bing, and clinical search crawlers to index this page.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, indexInSearch: !formData.indexInSearch })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.indexInSearch !== false ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      formData.indexInSearch !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Save Page Settings</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
