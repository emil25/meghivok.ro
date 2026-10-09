import React from 'react';
import { Sparkles, Plus, Eye, Layout, Users, Edit3 } from 'lucide-react';

interface HeaderProps {
  currentTab: 'gallery' | 'editor' | 'guestlist' | 'live-view';
  onSelectTab: (tab: 'gallery' | 'editor' | 'guestlist' | 'live-view') => void;
  onCreateNew: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onCreateNew }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('gallery')}
          className="text-2xl font-serif font-bold tracking-tight text-stone-900 hover:text-amber-800 transition-colors text-left"
        >
          Meghívók.ro
        </button>

        {/* Zone 2: 4-6 clean text navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('gallery')}
            className={`transition-colors whitespace-nowrap hover:text-stone-900 ${
              currentTab === 'gallery' ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-amber-600' : ''
            }`}
          >
            Sablonok & Előnézet
          </button>
          <button
            onClick={() => onSelectTab('editor')}
            className={`transition-colors whitespace-nowrap hover:text-stone-900 ${
              currentTab === 'editor' ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-amber-600' : ''
            }`}
          >
            Szerkesztő
          </button>
          <button
            onClick={() => onSelectTab('guestlist')}
            className={`transition-colors whitespace-nowrap hover:text-stone-900 ${
              currentTab === 'guestlist' ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-amber-600' : ''
            }`}
          >
            Vendéglista & RSVP
          </button>
          <button
            onClick={() => onSelectTab('live-view')}
            className={`transition-colors whitespace-nowrap hover:text-stone-900 ${
              currentTab === 'live-view' ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-amber-600' : ''
            }`}
          >
            Teljes Vendég Előnézet
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSelectTab('live-view')}
            className="hidden sm:flex md:hidden items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Előnézet</span>
          </button>

          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Új Meghívó</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200/80 px-2 py-1.5 bg-[#FAF8F5] text-xs">
        <button
          onClick={() => onSelectTab('gallery')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
            currentTab === 'gallery' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Sablonok</span>
        </button>
        <button
          onClick={() => onSelectTab('editor')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
            currentTab === 'editor' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Szerkesztő</span>
        </button>
        <button
          onClick={() => onSelectTab('live-view')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
            currentTab === 'live-view' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Előnézet</span>
        </button>
        <button
          onClick={() => onSelectTab('guestlist')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
            currentTab === 'guestlist' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>RSVP</span>
        </button>
      </div>
    </header>
  );
};
