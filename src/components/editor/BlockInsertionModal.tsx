import React, { useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Layers,
  Star,
  DollarSign,
  HeartHandshake,
  HelpCircle,
  Users,
  Image as ImageIcon,
  ShieldCheck,
  Check,
  CreditCard,
  Crown,
  LayoutTemplate
} from 'lucide-react';
import { PageSectionItem } from './FramerWebflowEditor';

interface BlockInsertionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertBlock: (blockId: string, label: string, tag: string) => void;
  existingSectionIds: string[];
  accentColor?: string;
}

interface ComponentBlockTemplate {
  id: string;
  name: string;
  tag: string;
  category: string;
  description: string;
  badge: string;
  previewUrl: string;
  variantsCount: number;
}

export const BLOCK_TEMPLATES: ComponentBlockTemplate[] = [
  {
    id: 'hero',
    name: 'Hero & Value Proposition',
    tag: 'Hero',
    category: 'Header',
    description: 'Ambient luxury split hero with live booking badges, video backgrounds, and high-converting CTAs.',
    badge: 'Core Section',
    previewUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    variantsCount: 4
  },
  {
    id: 'treatments',
    name: 'Signature Procedures Catalog',
    tag: 'Catalog',
    category: 'Procedures',
    description: 'Dynamic treatment cards with individual card styling presets, refundable deposits, and 0% financing indicators.',
    badge: 'High Conversion',
    previewUrl: 'https://images.unsplash.com/photo-1512290900672-1f023075b9f9?auto=format&fit=crop&w=600&q=80',
    variantsCount: 4
  },
  {
    id: 'features',
    name: 'Clinical Features Split',
    tag: 'Clinical',
    category: 'Safety & Trust',
    description: 'Board-certified medical credentials, quad-A surgical suite safety standards, and technology spotlight.',
    badge: 'Trust Builder',
    previewUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    variantsCount: 4
  },
  {
    id: 'cherry_financing',
    name: 'Cherry 0% APR Financing',
    tag: 'Financing',
    category: 'Revenue',
    description: 'Interactive monthly payment calculator banner with soft credit prequalification without hurting score.',
    badge: 'High Intent',
    previewUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    variantsCount: 3
  },
  {
    id: 'reviews',
    name: 'Verified Reviews Bento Grid',
    tag: 'Social Proof',
    category: 'Reviews',
    description: 'Google Business Profile verified testimonials, 5-star ratings, and photo-verified clinical feedback.',
    badge: 'Google Verified',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    variantsCount: 4
  },
  {
    id: 'gallery',
    name: 'Before & After Clinical Transformations',
    tag: 'Results',
    category: 'Transformations',
    description: 'Interactive comparison slider, case outcome milestones, and unretouched clinical imagery.',
    badge: 'High Retention',
    previewUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    variantsCount: 3
  },
  {
    id: 'membership',
    name: 'VIP Concierge Membership Passes',
    tag: 'VIP Pass',
    category: 'Recurring Revenue',
    description: 'Monthly beauty bank rollover tiers, priority physician booking, and members-only skincare dispensary perks.',
    badge: 'Recurring MRR',
    previewUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=600&q=80',
    variantsCount: 3
  },
  {
    id: 'faq',
    name: 'Patient FAQ Accordion',
    tag: 'FAQ',
    category: 'Conversion',
    description: 'Medical downtime, contraindications, anesthesia protocols, and pre-arrival instructions.',
    badge: 'Search Schema',
    previewUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    variantsCount: 4
  },
  {
    id: 'team',
    name: 'Clinical Medical Team',
    tag: 'Providers',
    category: 'Authority',
    description: 'Physician credentials, master aesthetician bios, and verified provider specialty badges.',
    badge: 'Physician Led',
    previewUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    variantsCount: 3
  },
  {
    id: 'footer',
    name: 'Ambient Luxury Footer',
    tag: 'Footer',
    category: 'Footer',
    description: 'Comprehensive medical dispensary links, Beverly Hills parking directions, and legal compliance disclaimers.',
    badge: 'Core Section',
    previewUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    variantsCount: 5
  }
];

export const BlockInsertionModal: React.FC<BlockInsertionModalProps> = ({
  isOpen,
  onClose,
  onInsertBlock,
  existingSectionIds,
  accentColor = '#2563EB'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Procedures', 'Social Proof', 'Revenue', 'Safety & Trust', 'Transformations'];

  const filteredBlocks = selectedCategory === 'All'
    ? BLOCK_TEMPLATES
    : BLOCK_TEMPLATES.filter((b) => b.category === selectedCategory || b.tag.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 text-xs text-slate-800 max-h-[90vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-blue-50 text-blue-600">
              <LayoutTemplate className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Insert Component Block / Section</h3>
              <p className="text-xs text-slate-500">
                Choose a pre-designed production block to insert into your current page.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blocks Catalog Grid */}
        <div className="overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
          {filteredBlocks.map((block) => {
            const isAlreadyActive = existingSectionIds.includes(block.id);

            return (
              <div
                key={block.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-blue-400 transition-all"
              >
                <div>
                  <div className="relative h-32 bg-slate-100 overflow-hidden">
                    <img
                      src={block.previewUrl}
                      alt={block.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800">
                        {block.tag}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                        {block.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                      {block.variantsCount} Layout Options
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{block.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{block.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      onInsertBlock(block.id, block.name, block.tag);
                      onClose();
                    }}
                    style={!isAlreadyActive ? { backgroundColor: accentColor } : undefined}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      isAlreadyActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : 'text-white hover:opacity-90 shadow-xs'
                    }`}
                  >
                    {isAlreadyActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Already on Page (Configure)</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Insert Block into Page</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 shrink-0">
          <span>
            Hero & Footer remain securely pinned to preserve luxury framing. All other sections can be freely reordered or removed.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
