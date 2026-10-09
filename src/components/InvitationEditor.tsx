import React, { useState } from 'react';
import { 
  Save, 
  Send, 
  Eye, 
  Smartphone, 
  Monitor, 
  FileText, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Clock, 
  Palette, 
  Type, 
  Settings, 
  Check, 
  Sparkles,
  ExternalLink,
  Users,
  Edit2
} from 'lucide-react';
import { InvitationData, TimelineItem, InfoNote } from '../types/invitation';
import { COLOR_SCHEMES, FONT_OPTIONS } from '../data/themes';
import { InvitationPreview } from './InvitationPreview';
import { RsvpModal } from './RsvpModal';
import { SafeImage } from './SafeImage';
import { saveInvitation } from '../utils/storage';

interface InvitationEditorProps {
  initialData: InvitationData;
  onOpenShareModal: (data: InvitationData) => void;
  onOpenGuestList: () => void;
  onOpenLiveGuestView: () => void;
}

export const InvitationEditor: React.FC<InvitationEditorProps> = ({
  initialData,
  onOpenShareModal,
  onOpenGuestList,
  onOpenLiveGuestView,
}) => {
  const [data, setData] = useState<InvitationData>(initialData);
  const [activeTab, setActiveTab] = useState<'basics' | 'location' | 'timeline' | 'notes' | 'style' | 'rsvp'>('basics');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop' | 'card'>('mobile');
  const [mobilePane, setMobilePane] = useState<'editor' | 'preview'>('editor');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isRsvpTestModalOpen, setIsRsvpTestModalOpen] = useState(false);

  const handleSave = () => {
    saveInvitation(data);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Timeline handlers
  const handleAddTimelineItem = () => {
    const newItem: TimelineItem = {
      id: `time-${Date.now()}`,
      time: '18:00',
      title: 'Új programpont',
      description: 'Rövid leírás a vendégeknek',
    };
    setData({
      ...data,
      timeline: [...data.timeline, newItem],
    });
  };

  const handleUpdateTimelineItem = (id: string, updates: Partial<TimelineItem>) => {
    setData({
      ...data,
      timeline: data.timeline.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  const handleRemoveTimelineItem = (id: string) => {
    setData({
      ...data,
      timeline: data.timeline.filter((item) => item.id !== id),
    });
  };

  // Info notes handlers
  const handleAddInfoNote = () => {
    const newNote: InfoNote = {
      id: `note-${Date.now()}`,
      title: 'Új tudnivaló',
      text: 'Információ a vendégeknek...',
    };
    setData({
      ...data,
      infoNotes: [...data.infoNotes, newNote],
    });
  };

  const handleUpdateInfoNote = (id: string, updates: Partial<InfoNote>) => {
    setData({
      ...data,
      infoNotes: data.infoNotes.map((note) => (note.id === id ? { ...note, ...updates } : note)),
    });
  };

  const handleRemoveInfoNote = (id: string) => {
    setData({
      ...data,
      infoNotes: data.infoNotes.filter((note) => note.id !== id),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Action & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Szerkesztő Műhely</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-stone-800">{data.title}</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Meghívó Testreszabása
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mobile Screen Switcher (Editor vs Live Preview) */}
          <div className="flex lg:hidden items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              onClick={() => setMobilePane('editor')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mobilePane === 'editor' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Szerkesztés</span>
            </button>
            <button
              onClick={() => setMobilePane('preview')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mobilePane === 'preview' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Élő Előnézet</span>
            </button>
          </div>

          {/* Device Mockup Toggle */}
          <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 mr-2">
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'mobile' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Okostelefon Nézet"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'desktop' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Webes Teljes Nézet"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'card' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Nyomtatott Kártya Nézet"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors shadow-2xs"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Elmentve!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Mentés</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenLiveGuestView}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vendég Nézet</span>
          </button>

          <button
            onClick={onOpenGuestList}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Vendéglista</span>
          </button>

          <button
            onClick={() => onOpenShareModal(data)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-lg transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Megosztás & Küldés</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid: Left Editor Controls & Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
        {/* Left Column: Form Tabs (5 cols) */}
        <div className={`lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col ${
          mobilePane === 'preview' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-stone-200 overflow-x-auto scrollbar-none bg-stone-50/70 p-1.5 gap-1 text-xs font-medium">
            {[
              { id: 'basics', label: 'Alapadatok' },
              { id: 'location', label: 'Helyszín' },
              { id: 'timeline', label: 'Menetrend' },
              { id: 'notes', label: 'Tudnivalók' },
              { id: 'style', label: 'Stílus & Szín' },
              { id: 'rsvp', label: 'RSVP' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content Body */}
          <div className="p-5 space-y-5 max-h-[750px] overflow-y-auto">
            {/* Tab: Basics */}
            {activeTab === 'basics' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Főcímke (Kategória jelző)
                  </label>
                  <input
                    type="text"
                    value={data.badgeText}
                    onChange={(e) => setData({ ...data, badgeText: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                    placeholder="pl. ESKÜVŐI MEGHÍVÓ"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Ünnepeltek Neve / Esemény Címe
                  </label>
                  <input
                    type="text"
                    value={data.names}
                    onChange={(e) => setData({ ...data, names: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-semibold border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                    placeholder="pl. Anna & Péter"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Mottó / Kedvenc Idézet
                  </label>
                  <textarea
                    rows={2}
                    value={data.quote}
                    onChange={(e) => setData({ ...data, quote: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                    placeholder="Idézet vagy szép gondolat..."
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Meghívó Szöveg / Köszöntő
                  </label>
                  <textarea
                    rows={3}
                    value={data.subtitle}
                    onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                    placeholder="Szeretettel meghívunk Benneteket..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Esemény Dátuma
                    </label>
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => setData({ ...data, date: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Kezdés Időpontja
                    </label>
                    <input
                      type="time"
                      value={data.time}
                      onChange={(e) => setData({ ...data, time: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Visszajelzés Határideje (RSVP Deadline)
                  </label>
                  <input
                    type="date"
                    value={data.rsvpDeadline}
                    onChange={(e) => setData({ ...data, rsvpDeadline: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                  />
                </div>
              </div>
            )}

            {/* Tab: Location */}
            {activeTab === 'location' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Helyszín Neve
                  </label>
                  <input
                    type="text"
                    value={data.locationName}
                    onChange={(e) => setData({ ...data, locationName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                    placeholder="pl. Teleki-kastély & Park"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Pontos Cím
                  </label>
                  <input
                    type="text"
                    value={data.locationAddress}
                    onChange={(e) => setData({ ...data, locationAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                    placeholder="pl. Fő út 124, Gernyeszeg"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Google Maps Link
                  </label>
                  <input
                    type="text"
                    value={data.googleMapsUrl || ''}
                    onChange={(e) => setData({ ...data, googleMapsUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Kapcsolattartó Telefon
                    </label>
                    <input
                      type="text"
                      value={data.contactPhone || ''}
                      onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                      placeholder="+40 740..."
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Kapcsolattartó Email
                    </label>
                    <input
                      type="email"
                      value={data.contactEmail || ''}
                      onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                      placeholder="info@..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Timeline */}
            {activeTab === 'timeline' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <p className="font-semibold uppercase tracking-wider text-stone-700">
                    Esemény Programpontjai
                  </p>
                  <button
                    onClick={handleAddTimelineItem}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Új Időpont</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {data.timeline.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 relative group"
                    >
                      <button
                        onClick={() => handleRemoveTimelineItem(item.id)}
                        className="absolute top-2 right-2 p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                        title="Törlés"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-3 gap-2 mb-2 pr-6">
                        <div className="col-span-1">
                          <label className="block text-[10px] text-stone-500 uppercase">Időpont</label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => handleUpdateTimelineItem(item.id, { time: e.target.value })}
                            className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] text-stone-500 uppercase">Program Neve</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateTimelineItem(item.id, { title: e.target.value })}
                            className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase">Leírás (opcionális)</label>
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => handleUpdateTimelineItem(item.id, { description: e.target.value })}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-stone-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <p className="font-semibold uppercase tracking-wider text-stone-700">
                    Fontos Információk a Vendégeknek
                  </p>
                  <button
                    onClick={handleAddInfoNote}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Új Megjegyzés</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {data.infoNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 relative group"
                    >
                      <button
                        onClick={() => handleRemoveInfoNote(note.id)}
                        className="absolute top-2 right-2 p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                        title="Törlés"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="mb-2 pr-6">
                        <label className="block text-[10px] text-stone-500 uppercase">Cím (pl. Dress Code)</label>
                        <input
                          type="text"
                          value={note.title}
                          onChange={(e) => handleUpdateInfoNote(note.id, { title: e.target.value })}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase">Szöveges Leírás</label>
                        <textarea
                          rows={2}
                          value={note.text}
                          onChange={(e) => handleUpdateInfoNote(note.id, { text: e.target.value })}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-stone-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Style & Colors */}
            {activeTab === 'style' && (
              <div className="space-y-5 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Színvilág & Paletta
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {COLOR_SCHEMES.map((scheme) => (
                      <button
                        key={scheme.id}
                        onClick={() => setData({ ...data, colorSchemeId: scheme.id })}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          data.colorSchemeId === scheme.id
                            ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900/10'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex -space-x-1 shrink-0">
                          <span
                            className="w-4 h-4 rounded-full border border-white"
                            style={{ backgroundColor: scheme.primary }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-white"
                            style={{ backgroundColor: scheme.background }}
                          />
                        </div>
                        <span className="font-medium text-stone-800 text-[11px] truncate">
                          {scheme.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Tipográfia & Betűstílus
                  </label>
                  <div className="space-y-2">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setData({ ...data, fontOptionId: font.id })}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          data.fontOptionId === font.id
                            ? 'border-stone-900 bg-stone-50 font-semibold'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className={font.titleClass}>{font.name}</span>
                        {data.fontOptionId === font.id && <Check className="w-4 h-4 text-stone-900" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Borítókép Választás
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      {
                        src: '/images/template_wedding_tuscany_1791532526368.jpg',
                        title: 'Toszkán Olíva',
                      },
                      {
                        src: '/images/template_royal_crest_1791532555699.jpg',
                        title: 'Királyi Címer',
                      },
                      {
                        src: '/images/template_gatsby_gold_1791532535369.jpg',
                        title: 'Nagy Gatsby',
                      },
                      {
                        src: '/images/template_paris_chic_1791532545152.jpg',
                        title: 'Párizsi Masni',
                      },
                      {
                        src: '/images/template_wedding_gold_1791387064050.jpg',
                        title: 'Arany & Zsálya',
                      },
                      {
                        src: '/images/template_birthday_midnight_1791387074495.jpg',
                        title: 'Éjféli Bársony',
                      },
                      {
                        src: '/images/template_baptism_clouds_1791387083770.jpg',
                        title: 'Finom Felhők',
                      },
                      {
                        src: '/images/hero_invitation_craft_1791387051986.jpg',
                        title: 'Prémium Akvarell',
                      },
                    ].map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setData({ ...data, coverImage: img.src })}
                        className={`relative rounded-xl overflow-hidden border aspect-[4/3] group transition-all text-left ${
                          data.coverImage === img.src ? 'border-amber-800 ring-2 ring-amber-800/40 shadow-sm' : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <SafeImage
                          src={img.src}
                          alt={img.title}
                          fallbackTitle={img.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-stone-900/75 backdrop-blur-[2px] text-white text-[10px] py-1 px-1.5 truncate text-center font-medium">
                          {img.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: RSVP Settings */}
            {activeTab === 'rsvp' && (
              <div className="space-y-4 text-xs">
                <p className="font-semibold uppercase tracking-wider text-stone-700">
                  RSVP Űrlap Mezőinek Vezérlése
                </p>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                    <div>
                      <span className="font-semibold text-stone-800 block">Ételérzékenység & Menüigény</span>
                      <span className="text-[11px] text-stone-500">Vegetáriánus, gluténmentes stb. bekérése</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={data.allowDietary}
                      onChange={(e) => setData({ ...data, allowDietary: e.target.checked })}
                      className="w-4 h-4 text-amber-800 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                    <div>
                      <span className="font-semibold text-stone-800 block">Kívánságdal DJ-nek</span>
                      <span className="text-[11px] text-stone-500">Vendégek kedvenc tánczenéjének bekérése</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={data.allowSongRequest}
                      onChange={(e) => setData({ ...data, allowSongRequest: e.target.checked })}
                      className="w-4 h-4 text-amber-800 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                    <div>
                      <span className="font-semibold text-stone-800 block">Gyermeklétszám számláló</span>
                      <span className="text-[11px] text-stone-500">Külön felnőtt és gyermek számláló</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={data.allowChildren}
                      onChange={(e) => setData({ ...data, allowChildren: e.target.checked })}
                      className="w-4 h-4 text-amber-800 rounded"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Preview (7 cols) */}
        <div className={`lg:col-span-7 flex flex-col items-center ${
          mobilePane === 'editor' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="w-full bg-stone-200/50 p-4 sm:p-6 rounded-2xl border border-stone-300/70 overflow-hidden min-h-[750px] flex items-center justify-center">
            <InvitationPreview
              data={data}
              viewMode={viewMode}
              isEmbedded={true}
              onOpenRsvp={() => setIsRsvpTestModalOpen(true)}
              onOpenShare={() => onOpenShareModal(data)}
            />
          </div>
        </div>
      </div>

      {/* Interactive RSVP test modal */}
      {isRsvpTestModalOpen && (
        <RsvpModal
          invitation={data}
          isOpen={isRsvpTestModalOpen}
          onClose={() => setIsRsvpTestModalOpen(false)}
        />
      )}
    </div>
  );
};
