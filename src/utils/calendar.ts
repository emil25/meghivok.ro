import { InvitationData } from '../types/invitation';

export function formatHungarianDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

export function formatHungarianShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getDaysRemaining(dateStr: string): number {
  if (!dateStr) return 0;
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getCountdownTime(dateStr: string, timeStr = '12:00') {
  if (!dateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const [hours, minutes] = timeStr.split(':').map(Number);
  const targetDate = new Date(dateStr);
  targetDate.setHours(hours || 12, minutes || 0, 0, 0);

  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSeconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds };
}

export function createGoogleCalendarUrl(data: InvitationData): string {
  const [hours, minutes] = (data.time || '14:00').split(':').map(Number);
  const start = new Date(data.date);
  start.setHours(hours, minutes, 0);
  const end = new Date(start.getTime() + 6 * 60 * 60 * 1000); // 6 hours default

  const formatIso = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const datesParam = `${formatIso(start)}/${formatIso(end)}`;
  const titleParam = encodeURIComponent(data.names || data.title);
  const locationParam = encodeURIComponent(`${data.locationName}, ${data.locationAddress}`);
  const detailsParam = encodeURIComponent(
    `${data.subtitle}\n\nRészletek és visszajelzés: ${window.location.origin}/?inv=${data.slug || data.id}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleParam}&dates=${datesParam}&details=${detailsParam}&location=${locationParam}`;
}

export function downloadIcsFile(data: InvitationData): void {
  const [hours, minutes] = (data.time || '14:00').split(':').map(Number);
  const start = new Date(data.date);
  start.setHours(hours, minutes, 0);
  const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);

  const formatIcsDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Meghivok.ro//Online Meghivok//HU',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${data.id}-${Date.now()}@meghivok.ro`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${data.names} - ${data.title}`,
    `DESCRIPTION:${data.subtitle.replace(/\n/g, '\\n')}`,
    `LOCATION:${data.locationName}, ${data.locationAddress}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${data.slug || 'meghivo'}-esemeny.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
