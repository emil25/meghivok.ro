import React, { useState } from 'react';
import { ArrowLeft, Share2, Edit3, Check } from 'lucide-react';
import { InvitationData, GuestRsvp } from '../types/invitation';
import { InvitationPreview } from './InvitationPreview';
import { RsvpModal } from './RsvpModal';
import { ShareModal } from './ShareModal';

interface LiveGuestViewProps {
  invitation: InvitationData;
  onBackToEditor: () => void;
  onOpenShareModal: () => void;
}

export const LiveGuestView: React.FC<LiveGuestViewProps> = ({
  invitation,
  onBackToEditor,
  onOpenShareModal,
}) => {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] relative">
      {/* Quiet top floating control strip for the host */}
      <div className="sticky top-0 z-30 bg-stone-900/90 backdrop-blur-md text-white px-4 py-2 text-xs flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToEditor}
            className="flex items-center gap-1 hover:text-amber-200 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Vissza a Szerkesztőbe</span>
          </button>
          <span className="text-stone-500" aria-hidden="true">|</span>
          <span className="text-stone-400">Vendég Szemszögű Élő Nézet</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1 hover:text-amber-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Megosztás</span>
          </button>
          <button
            onClick={onBackToEditor}
            className="px-2.5 py-1 bg-amber-800 hover:bg-amber-700 text-white rounded font-medium transition-colors"
          >
            Szerkesztés
          </button>
        </div>
      </div>

      {/* Main invitation body */}
      <main className="max-w-2xl mx-auto py-6 sm:py-10 px-0 sm:px-4">
        <InvitationPreview
          data={invitation}
          viewMode="desktop"
          isEmbedded={false}
          onOpenRsvp={() => setIsRsvpOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
        />
      </main>

      {/* Modals */}
      <RsvpModal
        invitation={invitation}
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
      />

      <ShareModal
        invitation={invitation}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};
