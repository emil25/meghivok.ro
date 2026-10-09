import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  Share2, 
  CheckCircle, 
  Download, 
  ExternalLink, 
  Music, 
  Utensils, 
  Sparkles,
  Phone,
  Mail,
  ChevronDown,
  Info
} from 'lucide-react';
import { InvitationData } from '../types/invitation';
import { COLOR_SCHEMES, FONT_OPTIONS } from '../data/themes';
import { formatHungarianDate, getCountdownTime, createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { SafeImage } from './SafeImage';

interface InvitationPreviewProps {
  data: InvitationData;
  onOpenRsvp?: () => void;
  onOpenShare?: () => void;
  viewMode?: 'mobile' | 'desktop' | 'card';
  isEmbedded?: boolean;
}

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  data,
  onOpenRsvp,
  onOpenShare,
  viewMode = 'mobile',
  isEmbedded = false,
}) => {
  const currentTheme = COLOR_SCHEMES.find(t => t.id === data.colorSchemeId) || COLOR_SCHEMES[0];
  const currentFont = FONT_OPTIONS.find(f => f.id === data.fontOptionId) || FONT_OPTIONS[0];

  const [countdown, setCountdown] = useState(getCountdownTime(data.date, data.time));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownTime(data.date, data.time));
    }, 1000);
    return () => clearInterval(timer);
  }, [data.date, data.time]);

  // Content of the invitation
  const renderInvitationContent = () => (
    <div
      className={`min-h-full transition-colors duration-300 ${currentFont.bodyClass}`}
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.textPrimary,
      }}
    >
      {/* Top Banner / Cover Image */}
      <div className="relative overflow-hidden w-full">
        {data.coverImage ? (
          <div className="h-64 sm:h-80 w-full relative">
            <SafeImage
              src={data.coverImage}
              alt={data.names}
              fallbackTitle={data.names}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-t" 
              style={{
                background: `linear-gradient(to top, ${currentTheme.background} 10%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%)`
              }} 
            />
          </div>
        ) : (
          <div 
            className="h-44 sm:h-56 w-full flex items-center justify-center p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.surface} 0%, ${currentTheme.background} 100%)`,
              borderBottom: `1px solid ${currentTheme.border}`,
            }}
          >
            <div className="max-w-md">
              <span 
                className="text-xs tracking-widest uppercase font-semibold block mb-2"
                style={{ color: currentTheme.primary }}
              >
                {data.badgeText || 'MEGHÍVÓ'}
              </span>
              <p className="text-sm opacity-80">{data.subtitle}</p>
            </div>
          </div>
        )}

        {/* Floating Header Card */}
        <div className="px-6 text-center -mt-16 sm:-mt-20 relative z-10">
          <div
            className="max-w-xl mx-auto rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-sm transition-all"
            style={{
              backgroundColor: currentTheme.surface,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: currentTheme.primary }}
            >
              {data.badgeText || 'SZERETETTEL MEGHÍVUNK'}
            </p>

            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-bold my-3 leading-tight ${currentFont.titleClass}`}
              style={{ color: currentTheme.textPrimary }}
            >
              {data.names || 'Név & Név'}
            </h1>

            {data.quote && (
              <p
                className="italic text-xs sm:text-sm my-4 px-2 leading-relaxed opacity-85"
                style={{ color: currentTheme.textSecondary }}
              >
                {data.quote}
              </p>
            )}

            <div 
              className="w-16 h-0.5 mx-auto my-5 rounded-full" 
              style={{ backgroundColor: currentTheme.primary }} 
            />

            <p className="text-sm sm:text-base leading-relaxed opacity-90 max-w-md mx-auto">
              {data.subtitle || 'Szeretettel várunk benneteket, hogy együtt ünnepeljük ezt a felejthetetlen napot!'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8 space-y-8">
        {/* Date & Time & Countdown Box */}
        <div
          className="rounded-xl p-6 text-center shadow-xs"
          style={{
            backgroundColor: currentTheme.surface,
            border: `1px solid ${currentTheme.border}`,
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-4 h-4" style={{ color: currentTheme.primary }} />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-75">Időpont & Dátum</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold mb-1">
            {formatHungarianDate(data.date)}
          </h2>
          <p className="text-base font-medium opacity-80 mb-6">
            Kezdés: <span className="font-semibold">{data.time || '15:00'}</span> órakor
          </p>

          {/* Countdown timer */}
          <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto mb-6">
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${currentTheme.border}40` }}
            >
              <span className="block text-xl sm:text-2xl font-bold font-mono tabular-nums">
                {countdown.days}
              </span>
              <span className="text-[11px] uppercase opacity-70">Nap</span>
            </div>
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${currentTheme.border}40` }}
            >
              <span className="block text-xl sm:text-2xl font-bold font-mono tabular-nums">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase opacity-70">Óra</span>
            </div>
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${currentTheme.border}40` }}
            >
              <span className="block text-xl sm:text-2xl font-bold font-mono tabular-nums">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase opacity-70">Perc</span>
            </div>
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${currentTheme.border}40` }}
            >
              <span className="block text-xl sm:text-2xl font-bold font-mono tabular-nums">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase opacity-70">Mpd</span>
            </div>
          </div>

          {/* Add to Calendar buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t" style={{ borderColor: currentTheme.border }}>
            <a
              href={createGoogleCalendarUrl(data)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md hover:opacity-85 transition-opacity"
              style={{
                backgroundColor: currentTheme.primary,
                color: '#ffffff',
              }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Google Naptár</span>
            </a>
            <button
              onClick={() => downloadIcsFile(data)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border hover:bg-stone-50 transition-colors"
              style={{
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary,
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Apple / iCal (.ics)</span>
            </button>
          </div>
        </div>

        {/* Location Box */}
        <div
          className="rounded-xl p-6 shadow-xs text-center"
          style={{
            backgroundColor: currentTheme.surface,
            border: `1px solid ${currentTheme.border}`,
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="w-4 h-4" style={{ color: currentTheme.primary }} />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-75">Helyszín</span>
          </div>

          <h3 className="text-xl font-bold mb-1">{data.locationName}</h3>
          <p className="text-sm opacity-80 mb-4">{data.locationAddress}</p>

          {data.googleMapsUrl && (
            <a
              href={data.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border hover:opacity-80 transition-opacity"
              style={{
                borderColor: currentTheme.border,
                backgroundColor: `${currentTheme.primary}10`,
                color: currentTheme.primary,
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Megnyitás Google Térképen</span>
            </a>
          )}
        </div>

        {/* Program / Timeline */}
        {data.timeline && data.timeline.length > 0 && (
          <div
            className="rounded-xl p-6 shadow-xs"
            style={{
              backgroundColor: currentTheme.surface,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <div className="text-center mb-6">
              <span 
                className="text-xs font-semibold uppercase tracking-wider block mb-1"
                style={{ color: currentTheme.primary }}
              >
                Menetrend
              </span>
              <h3 className="text-xl font-serif font-bold">A Nap Programja</h3>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-14 before:w-0.5 before:bg-stone-200">
              {data.timeline.map((item, idx) => (
                <div key={item.id || idx} className="flex items-start gap-4 relative">
                  <div className="w-12 text-right shrink-0 pt-0.5">
                    <span className="text-xs font-semibold font-mono tabular-nums opacity-85">
                      {item.time}
                    </span>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full shrink-0 mt-1 border-2 flex items-center justify-center z-10"
                    style={{
                      borderColor: currentTheme.primary,
                      backgroundColor: currentTheme.surface,
                    }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: currentTheme.primary }} 
                    />
                  </div>
                  <div className="flex-1 pb-3">
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs mt-0.5 opacity-75 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Important Notes / Tudnivalók */}
        {data.infoNotes && data.infoNotes.length > 0 && (
          <div
            className="rounded-xl p-6 shadow-xs space-y-4"
            style={{
              backgroundColor: currentTheme.surface,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <div className="text-center mb-4">
              <span 
                className="text-xs font-semibold uppercase tracking-wider block mb-1"
                style={{ color: currentTheme.primary }}
              >
                Tudnivalók
              </span>
              <h3 className="text-xl font-serif font-bold">Fontos Információk</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {data.infoNotes.map((note, idx) => (
                <div
                  key={note.id || idx}
                  className="p-3.5 rounded-lg border text-left"
                  style={{
                    backgroundColor: `${currentTheme.background}60`,
                    borderColor: currentTheme.border,
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: currentTheme.primary }}>
                    {note.title}
                  </p>
                  <p className="text-xs opacity-85 leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RSVP Card with working Call-to-Action */}
        <div
          className="rounded-xl p-6 sm:p-8 text-center shadow-md relative overflow-hidden"
          style={{
            backgroundColor: currentTheme.surface,
            border: `2px solid ${currentTheme.primary}40`,
          }}
        >
          <span 
            className="text-xs font-semibold uppercase tracking-wider block mb-1"
            style={{ color: currentTheme.primary }}
          >
            Visszajelzés
          </span>
          <h3 className="text-2xl font-serif font-bold mb-2">Ott leszel velünk?</h3>
          
          <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto mb-6">
            Kérjük, legkésőbb <strong className="font-semibold">{formatHungarianDate(data.rsvpDeadline)}</strong> napig jelezd vissza részvételi szándékodat, felnőtt- és gyermeklétszámot, illetve esetleges ételérzékenységedet!
          </p>

          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold rounded-xl text-white shadow-md hover:opacity-95 transition-all transform active:scale-95"
            style={{
              backgroundColor: currentTheme.primary,
            }}
          >
            Részvétel Visszajelzése (RSVP)
          </button>

          {(data.contactPhone || data.contactEmail) && (
            <div className="mt-6 pt-4 border-t flex flex-wrap items-center justify-center gap-4 text-xs opacity-75" style={{ borderColor: currentTheme.border }}>
              {data.contactPhone && (
                <a href={`tel:${data.contactPhone}`} className="inline-flex items-center gap-1 hover:underline">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{data.contactPhone}</span>
                </a>
              )}
              {data.contactEmail && (
                <a href={`mailto:${data.contactEmail}`} className="inline-flex items-center gap-1 hover:underline">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{data.contactEmail}</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Share Button Bar */}
        {onOpenShare && (
          <div className="text-center pt-2">
            <button
              onClick={onOpenShare}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border hover:bg-stone-100 transition-colors"
              style={{
                borderColor: currentTheme.border,
                color: currentTheme.textSecondary,
              }}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Meghívó Link & QR Kód Megosztása</span>
            </button>
          </div>
        )}

        {/* Footer brand stamp */}
        <div className="text-center pt-8 pb-4 border-t text-[11px] opacity-60" style={{ borderColor: currentTheme.border }}>
          <span>Készült a </span>
          <a href="https://meghivok.ro" className="font-semibold hover:underline">Meghívók.ro</a>
          <span> digitális műhelyében</span>
        </div>
      </div>
    </div>
  );

  // If in mobile mockup frame
  if (viewMode === 'mobile' && isEmbedded) {
    return (
      <div className="flex justify-center p-2 sm:p-4">
        <div className="w-full max-w-[420px] rounded-[40px] border-[8px] border-stone-800 shadow-2xl overflow-hidden bg-stone-900 relative">
          {/* Mobile phone speaker notch */}
          <div className="h-5 w-32 bg-stone-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20" />
          
          <div className="h-[740px] overflow-y-auto scrollbar-thin">
            {renderInvitationContent()}
          </div>
          
          {/* Mobile bottom swipe bar */}
          <div className="h-4 bg-stone-900 flex items-center justify-center">
            <div className="w-24 h-1 bg-stone-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // If in printable card mode
  if (viewMode === 'card') {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-8">
        <div 
          className="rounded-2xl p-8 sm:p-12 shadow-lg border border-stone-300 relative text-center"
          style={{
            backgroundColor: currentTheme.surface,
            color: currentTheme.textPrimary,
          }}
        >
          <div className="border border-stone-200 p-8 rounded-xl">
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: currentTheme.primary }}>
              {data.badgeText}
            </p>
            <h2 className={`text-4xl font-bold my-4 ${currentFont.titleClass}`}>
              {data.names}
            </h2>
            <p className="italic text-sm my-4 max-w-md mx-auto opacity-80">
              {data.quote}
            </p>
            <div className="w-12 h-0.5 mx-auto my-6" style={{ backgroundColor: currentTheme.primary }} />
            <p className="text-base my-3">{data.subtitle}</p>
            <p className="text-xl font-serif font-bold mt-6">{formatHungarianDate(data.date)}</p>
            <p className="text-sm font-medium mt-1">{data.time} óra</p>
            <p className="text-base font-semibold mt-6">{data.locationName}</p>
            <p className="text-xs opacity-75">{data.locationAddress}</p>
            
            <div className="mt-8 pt-6 border-t border-stone-200 text-xs">
              <p className="font-medium">Visszajelzés határideje: {formatHungarianDate(data.rsvpDeadline)}</p>
              <p className="mt-2 text-stone-500">Online RSVP: {window.location.origin}/?inv={data.slug}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop or default full view
  return (
    <div className="w-full">
      {renderInvitationContent()}
    </div>
  );
};
