import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TemplateGallery } from './components/TemplateGallery';
import { InvitationEditor } from './components/InvitationEditor';
import { RsvpDashboard } from './components/RsvpDashboard';
import { LiveGuestView } from './components/LiveGuestView';
import { TemplatePreviewModal } from './components/TemplatePreviewModal';
import { ShareModal } from './components/ShareModal';
import { RsvpModal } from './components/RsvpModal';
import { Footer } from './components/Footer';
import { InvitationData, InvitationTemplate } from './types/invitation';
import { TEMPLATES } from './data/templates';
import { getSavedInvitations, saveInvitation } from './utils/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'gallery' | 'editor' | 'guestlist' | 'live-view'>('gallery');
  const [activeInvitation, setActiveInvitation] = useState<InvitationData>(() => {
    const saved = getSavedInvitations();
    return saved.length > 0 ? saved[0] : TEMPLATES[0].defaultData;
  });

  const [previewTemplate, setPreviewTemplate] = useState<InvitationTemplate | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);

  // Check URL query parameters for direct shared links (e.g. ?inv=anna-es-peter-2026)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invSlug = params.get('inv');
    if (invSlug) {
      // Find matching template or saved invitation
      const matchedTemplate = TEMPLATES.find(t => t.defaultData.slug === invSlug || t.defaultData.id === invSlug);
      if (matchedTemplate) {
        setActiveInvitation(matchedTemplate.defaultData);
        setCurrentTab('live-view');
        return;
      }
      const savedList = getSavedInvitations();
      const matchedSaved = savedList.find(s => s.slug === invSlug || s.id === invSlug);
      if (matchedSaved) {
        setActiveInvitation(matchedSaved);
        setCurrentTab('live-view');
      }
    }
  }, []);

  // Handlers
  const handleSelectTemplateToEdit = (template: InvitationTemplate) => {
    const clonedData: InvitationData = {
      ...template.defaultData,
      id: `inv-${Date.now()}`,
      slug: `${template.defaultData.slug}-${Math.floor(Math.random() * 1000)}`,
    };
    setActiveInvitation(clonedData);
    saveInvitation(clonedData);
    setCurrentTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNew = () => {
    // Pick the premier template to start fresh
    handleSelectTemplateToEdit(TEMPLATES[0]);
  };

  const handleOpenSample = () => {
    setActiveInvitation(TEMPLATES[0].defaultData);
    setCurrentTab('live-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* If currentTab is live-view, show dedicated guest view presentation */}
      {currentTab === 'live-view' ? (
        <LiveGuestView
          invitation={activeInvitation}
          onBackToEditor={() => setCurrentTab('editor')}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />
      ) : (
        <>
          {/* Top Bar Header */}
          <Header
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCreateNew={handleCreateNew}
          />

          <main className="flex-1">
            {/* Gallery View */}
            {currentTab === 'gallery' && (
              <>
                <HeroSection
                  onExploreTemplates={() => {
                    const el = document.getElementById('templates-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onOpenSample={handleOpenSample}
                />

                <div id="templates-section">
                  <TemplateGallery
                    onSelectTemplateToEdit={handleSelectTemplateToEdit}
                    onPreviewTemplate={(template) => setPreviewTemplate(template)}
                  />
                </div>
              </>
            )}

            {/* Editor View */}
            {currentTab === 'editor' && (
              <InvitationEditor
                initialData={activeInvitation}
                onOpenShareModal={(data) => {
                  setActiveInvitation(data);
                  setIsShareModalOpen(true);
                }}
                onOpenGuestList={() => {
                  setCurrentTab('guestlist');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenLiveGuestView={() => {
                  setCurrentTab('live-view');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Guest List & RSVP Tracker View */}
            {currentTab === 'guestlist' && (
              <RsvpDashboard
                invitation={activeInvitation}
                onOpenInviteEditor={() => setCurrentTab('editor')}
                onOpenShareModal={() => setIsShareModalOpen(true)}
              />
            )}
          </main>

          {/* Quiet clean Footer */}
          <Footer
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}

      {/* Global Modals */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={(template) => {
          setPreviewTemplate(null);
          handleSelectTemplateToEdit(template);
        }}
      />

      <ShareModal
        invitation={activeInvitation}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <RsvpModal
        invitation={activeInvitation}
        isOpen={isRsvpModalOpen}
        onClose={() => setIsRsvpModalOpen(false)}
      />
    </div>
  );
}
