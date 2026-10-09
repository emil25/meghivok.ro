import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Eye, 
  Edit3, 
  Check, 
  Smartphone, 
  LayoutGrid, 
  Columns, 
  ArrowRight, 
  ExternalLink,
  Crown
} from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { InvitationTemplate, EventCategory } from '../types/invitation';
import { InvitationPreview } from './InvitationPreview';
import { SafeImage } from './SafeImage';

interface TemplateGalleryProps {
  onSelectTemplateToEdit: (template: InvitationTemplate) => void;
  onPreviewTemplate: (template: InvitationTemplate) => void;
}

const CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: 'osszes', label: 'Összes Esemény' },
  { id: 'eskuvo', label: 'Esküvő' },
  { id: 'szuletesnap', label: 'Születésnap' },
  { id: 'keresztelo', label: 'Keresztelő' },
  { id: 'evfordulo', label: 'Évforduló' },
  { id: 'ceges', label: 'Céges Rendezvény' },
  { id: 'babavaro', label: 'Babaváró' },
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplateToEdit,
  onPreviewTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('osszes');
  const [searchQuery, setSearchQuery] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);
  
  // Selected template for the interactive side-by-side live preview panel
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<InvitationTemplate>(TEMPLATES[0]);
  const [galleryLayout, setGalleryLayout] = useState<'split' | 'grid'>('split');

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (selectedCategory !== 'osszes' && tpl.category !== selectedCategory) {
      return false;
    }
    if (premiumOnly && !tpl.isPremium) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tpl.name.toLowerCase().includes(q);
      const matchDesc = tpl.description.toLowerCase().includes(q);
      const matchBadge = tpl.badge.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchBadge) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Editorial Section Header & Layout Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Interaktív Sablon Galéria
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-medium text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-800" />
              <span>{TEMPLATES.filter(t => t.isPremium).length} Prémium Mestermunka</span>
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Válassz és Próbáld Ki Azonnal
          </h2>
          <p className="text-sm text-stone-600 mt-2 max-w-xl">
            Kattints bármelyik sablonra az azonnali, valós idejű okostelefonos kipróbáláshoz és testreszabáshoz!
          </p>
        </div>

        {/* Search Input & Layout Mode Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Keresés sablonok között..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-hidden focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
            />
          </div>

          {/* Premium Filter Switch */}
          <button
            onClick={() => setPremiumOnly(!premiumOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
              premiumOnly
                ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-amber-700'
            }`}
          >
            <Crown className={`w-3.5 h-3.5 ${premiumOnly ? 'text-amber-300' : 'text-amber-800'}`} />
            <span>Csak Prémium</span>
          </button>

          <div className="hidden lg:flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0">
            <button
              onClick={() => setGalleryLayout('split')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                galleryLayout === 'split' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Kétpaneles osztott nézet élő előnézettel"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Élő Előnézet</span>
            </button>
            <button
              onClick={() => setGalleryLayout('grid')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                galleryLayout === 'grid' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Teljes kártyarács nézet"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Rács</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:text-stone-900 hover:border-stone-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Split Layout: Left Template List + Right Live Interactive Phone Preview */}
      {galleryLayout === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Template Cards List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
              <span>Találatok: {filteredTemplates.length} sablon</span>
              <span className="text-amber-800 font-medium">Kattints a kártyára az előnézethez 👉</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => {
                const isSelected = activePreviewTemplate.id === template.id;
                return (
                  <div
                    key={template.id}
                    onClick={() => setActivePreviewTemplate(template)}
                    className={`cursor-pointer rounded-xl border bg-white overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-800 ring-2 ring-amber-800/30 shadow-md'
                        : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                      <SafeImage
                        src={template.thumbnail}
                        alt={template.name}
                        fallbackTitle={template.name}
                        className="w-full h-full object-cover"
                      />
                      {template.isPremium && (
                        <div className="absolute top-2 left-2 bg-stone-900/85 backdrop-blur-xs text-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 text-amber-400" />
                          <span>Prémium</span>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-amber-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
                          Kijelölt
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1">
                          <span className="capitalize">{template.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{template.badge}</span>
                        </div>
                        <h4 className="font-serif font-bold text-stone-900 text-base mb-1">
                          {template.name}
                        </h4>
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>
                      </div>

                      {/* Explicit Action Buttons */}
                      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewTemplate(template);
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Nagyítás</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTemplateToEdit(template);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                        >
                          <span>Szerkesztés</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Live Interactive Preview Panel (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-stone-900/5 rounded-2xl border border-stone-300/80 p-4 sm:p-5 flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-stone-200">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 block flex items-center gap-1">
                    {activePreviewTemplate.isPremium && <Crown className="w-3 h-3 text-amber-700" />}
                    <span>Élő Mobil Előnézet</span>
                  </span>
                  <p className="text-sm font-serif font-bold text-stone-900">
                    {activePreviewTemplate.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreviewTemplate(activePreviewTemplate)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-200/50"
                    title="Teljes képernyős nézet"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectTemplateToEdit(activePreviewTemplate)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Szerkesztés</span>
                  </button>
                </div>
              </div>

              {/* Live Interactive Phone Frame */}
              <div className="w-full flex justify-center">
                <InvitationPreview
                  data={activePreviewTemplate.defaultData}
                  viewMode="mobile"
                  isEmbedded={true}
                  onOpenRsvp={() => onPreviewTemplate(activePreviewTemplate)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div 
                className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer"
                onClick={() => onPreviewTemplate(template)}
              >
                <SafeImage
                  src={template.thumbnail}
                  alt={template.name}
                  fallbackTitle={template.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
                  {template.isPremium && <Crown className="w-3 h-3 text-amber-300" />}
                  <span>{template.badge}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                    <span className="capitalize">{template.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Interaktív RSVP</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
                    {template.name}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {template.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onPreviewTemplate(template)}
                    className="flex-1 py-2 px-3 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Előnézet</span>
                  </button>

                  <button
                    onClick={() => onSelectTemplateToEdit(template)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Testreszabás</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <p className="text-base text-stone-600 font-medium">
            Nem található sablon a megadott szűrési feltételekkel.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('osszes');
              setSearchQuery('');
              setPremiumOnly(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
          >
            Szűrők visszaállítása
          </button>
        </div>
      )}
    </div>
  );
};
