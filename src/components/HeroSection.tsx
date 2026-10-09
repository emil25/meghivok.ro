import React from 'react';
import { ArrowRight, Sparkles, Send, Users, CheckCircle2 } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  onExploreTemplates: () => void;
  onOpenSample: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreTemplates, onOpenSample }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Proposition and Actions */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800 mb-3">
            Online Meghívó Műhely · Románia & Magyarország
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.1] mb-6 text-balance">
            Elegáns online meghívók, felejthetetlen pillanatokhoz.
          </h1>

          <p className="text-lg text-stone-600 max-w-xl leading-relaxed mb-8">
            Tervezz prémium digitális eseményoldalt esküvőre, születésnapra vagy keresztelőre. Valós idejű RSVP vendégkezelővel, térképpel, menüigényekkel és egykattintásos WhatsApp küldéssel.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={onExploreTemplates}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-amber-900 rounded-lg hover:bg-amber-800 transition-all shadow-sm group whitespace-nowrap"
            >
              <span>Sablonok Böngészése</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenSample}
              className="px-6 py-3.5 text-sm font-medium text-stone-800 bg-stone-100/90 hover:bg-stone-200/90 border border-stone-300 rounded-lg transition-colors whitespace-nowrap"
            >
              Élő Minta Meghívó Megnyitása
            </button>
          </div>

          {/* Clean unboxed proof markers adhering to Zero-Pill Discipline */}
          <div className="flex flex-wrap items-center gap-y-2 text-xs text-stone-500 pt-6 border-t border-stone-200/80">
            <span className="font-semibold text-stone-800">42.000+ elküldött meghívó</span>
            <span className="mx-3 text-stone-300" aria-hidden="true">·</span>
            <span>98.6% RSVP válaszadási arány</span>
            <span className="mx-3 text-stone-300" aria-hidden="true">·</span>
            <span>Azonnali WhatsApp & Email küldés</span>
            <span className="mx-3 text-stone-300" aria-hidden="true">·</span>
            <span>Nyomtatható PDF export</span>
          </div>
        </div>

        {/* Right Column: Hero Visual Asset */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-100 aspect-[4/3] group">
            <SafeImage
              src="/images/hero_invitation_craft_1791387051986.jpg"
              alt="Meghívók.ro elegáns esküvői és rendezvény meghívó kollekció"
              fallbackTitle="Meghívók.ro Prémium Kollekció"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white p-4 rounded-xl backdrop-blur-md bg-stone-900/40 border border-white/20 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-amber-200 font-medium">Interaktív Élménymeghívó</p>
                <p className="text-sm font-serif font-semibold text-white">Anna & Péter Nagy Napja</p>
              </div>
              <span className="text-xs font-mono text-amber-200/90 bg-white/10 px-2 py-1 rounded">RSVP Aktív</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
