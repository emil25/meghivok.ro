import React, { useState } from 'react';
import { X, Edit3, Smartphone, ExternalLink, Check } from 'lucide-react';
import { InvitationTemplate } from '../types/invitation';
import { InvitationPreview } from './InvitationPreview';
import { RsvpModal } from './RsvpModal';

interface TemplatePreviewModalProps {
  template: InvitationTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: InvitationTemplate) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate,
}) => {
  const [isTestRsvpOpen, setIsTestRsvpOpen] = useState(false);

  if (!isOpen || !template) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
          {/* Modal Top Bar */}
          <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="capitalize">{template.category}</span>
                <span aria-hidden="true">·</span>
                <span>{template.badge}</span>
                <span aria-hidden="true">·</span>
                <span>Élő Interaktív Előnézet</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {template.name}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onUseTemplate(template)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Szerkesztés Ezzel a Sablonnal</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Phone/Desktop interactive preview */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-100/60 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <InvitationPreview
                data={template.defaultData}
                viewMode="mobile"
                isEmbedded={true}
                onOpenRsvp={() => setIsTestRsvpOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive RSVP test modal */}
      {isTestRsvpOpen && (
        <RsvpModal
          invitation={template.defaultData}
          isOpen={isTestRsvpOpen}
          onClose={() => setIsTestRsvpOpen(false)}
        />
      )}
    </>
  );
};
