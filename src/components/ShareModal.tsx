import React, { useState } from 'react';
import { X, Copy, Check, Send, Printer, QrCode, Mail, MessageSquare, Download } from 'lucide-react';
import { InvitationData } from '../types/invitation';
import { formatHungarianDate } from '../utils/calendar';

interface ShareModalProps {
  invitation: InvitationData;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  invitation,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appBaseUrl = window.location.origin;
  const invitationLink = `${appBaseUrl}/?inv=${invitation.slug || invitation.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Pre-formatted friendly Hungarian WhatsApp text
  const whatsappMessage = encodeURIComponent(
    `Kedves barátunk!\n\nSzeretettel meghívunk: ${invitation.names} - ${invitation.title}\n📅 Időpont: ${formatHungarianDate(invitation.date)} ${invitation.time}\n📍 Helyszín: ${invitation.locationName}\n\nKérjük, nézd meg online meghívónkat és jelezz vissza az alábbi linken:\n${invitationLink}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  const emailSubject = encodeURIComponent(`Meghívó: ${invitation.names} - ${invitation.title}`);
  const emailBody = encodeURIComponent(
    `Kedves Barátunk!\n\nSzeretettel meghívunk az eseményünkre:\n\n${invitation.title} - ${invitation.names}\nIdőpont: ${formatHungarianDate(invitation.date)} ${invitation.time}\nHelyszín: ${invitation.locationName}, ${invitation.locationAddress}\n\nRészletek és visszajelzés (RSVP) ezen a linken:\n${invitationLink}\n\nSzeretettel várunk!`
  );
  const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;

  const handlePrint = () => {
    window.print();
  };

  // Generate SVG QR Code URL using QRServer public API or inline SVG fallback
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(invitationLink)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Meghívó Megosztása & Küldése
            </h3>
            <p className="text-xs text-stone-500">
              Oszd meg vendégeiddel online vagy nyomtasd ki
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Direct Link Copy */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Közvetlen Meghívó Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={invitationLink}
                className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-700 font-mono select-all focus:outline-hidden"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Másolva!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Másolás</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instant Messengers */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Küldés Üzenetküldőn
            </label>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp üzenet</span>
              </a>

              <a
                href={emailUrl}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-xl text-xs font-semibold transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>E-mail meghívó</span>
              </a>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  QR Kód Nyomtatáshoz
                </p>
                <p className="text-[11px] text-stone-500">
                  Tedd a borítékra vagy az asztalra az asztali kártyához
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-2.5 py-1 text-xs border border-stone-300 rounded-md hover:bg-stone-50 text-stone-700"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Nyomtatás</span>
              </button>
            </div>

            <div className="flex items-center justify-center p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-center">
                <img
                  src={qrCodeUrl}
                  alt="Meghívó QR kód"
                  className="w-36 h-36 mx-auto rounded-lg shadow-xs bg-white p-2 border border-stone-200"
                />
                <p className="text-[10px] text-stone-400 mt-2 font-mono">
                  Szkenneld a mobil kameráddal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 rounded-md"
          >
            Bezárás
          </button>
        </div>
      </div>
    </div>
  );
};
