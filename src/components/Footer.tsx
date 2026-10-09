import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'gallery' | 'editor' | 'guestlist' | 'live-view') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <span className="text-xl font-serif font-bold text-white tracking-tight">
              Meghívók.ro
            </span>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Prémium online meghívó készítő és vendégkezelő rendszer. Készíts egyedi web-meghívókat esküvőre, keresztelőre és születésnapra azonnali WhatsApp megosztással és RSVP követéssel.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Gyorsmenü
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('gallery')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Sablon Galéria
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('editor')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Meghívó Szerkesztő
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('guestlist')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Vendéglista & RSVP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('live-view')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Vendég Előnézet
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Eseménytípusok
            </p>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Esküvői web-meghívók</li>
              <li>Kerek születésnapok (30, 40, 50+)</li>
              <li>Keresztelő & Babaköszöntő</li>
              <li>Céges Gálák és Évzárók</li>
              <li>Házassági évfordulók</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 Meghívók.ro · Minden jog fenntartva.</p>
          <div className="flex items-center gap-1">
            <span>Szeretettel készült az emlékezetes pillanatokért</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
