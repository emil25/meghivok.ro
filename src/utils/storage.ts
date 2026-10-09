import { InvitationData, GuestRsvp } from '../types/invitation';
import { TEMPLATES } from '../data/templates';

const STORAGE_KEY_INVITATIONS = 'meghivok_ro_user_invitations';
const STORAGE_KEY_RSVPS = 'meghivok_ro_guest_rsvps';

const INITIAL_RSVPS: GuestRsvp[] = [
  {
    id: 'rsvp-1',
    invitationId: 'inv-eskuvo-1',
    guestName: 'Kovács Zoltán & Kovács Katalin',
    email: 'kovacs.zoltan@gmail.com',
    phone: '+40 740 555 123',
    attendance: 'attending',
    adultsCount: 2,
    childrenCount: 1,
    dietaryRequirements: '1 fő vegetáriánus menüt kér',
    dietType: 'vegetarian',
    songRequest: 'Bagossy Brothers Company - Olyan Ő',
    message: 'Nagyon boldogok vagyunk miattatok! Alig várjuk a Nagy Napot!',
    createdAt: '2026-06-12T14:22:00Z',
  },
  {
    id: 'rsvp-2',
    invitationId: 'inv-eskuvo-1',
    guestName: 'Balogh Márton',
    email: 'balogh.marci@yahoo.com',
    phone: '+40 751 222 888',
    attendance: 'attending',
    adultsCount: 1,
    childrenCount: 0,
    dietaryRequirements: 'Gluténmentes étkezés',
    dietType: 'gluten_free',
    songRequest: 'Earth, Wind & Fire - September',
    message: 'Ott leszek biztosan, tánccipőt már készítem!',
    createdAt: '2026-06-14T09:15:00Z',
  },
  {
    id: 'rsvp-3',
    invitationId: 'inv-eskuvo-1',
    guestName: 'Szabó Tamás és Andrea',
    email: 'szabo.andrea@gmail.com',
    phone: '+40 722 345 678',
    attendance: 'attending',
    adultsCount: 2,
    childrenCount: 2,
    dietaryRequirements: 'Normál hagyományos',
    dietType: 'normal',
    songRequest: 'Halott Pénz - Valami van a levegőben',
    message: 'A gyerekek is nagyon várják a lagzit!',
    createdAt: '2026-06-15T18:40:00Z',
  },
  {
    id: 'rsvp-4',
    invitationId: 'inv-eskuvo-1',
    guestName: 'Nagy Levente és felesége',
    email: 'levi.nagy@outlook.com',
    phone: '+40 745 678 901',
    attendance: 'declined',
    adultsCount: 0,
    childrenCount: 0,
    dietaryRequirements: 'Nincs',
    dietType: 'normal',
    message: 'Drága Anna és Péter! Sajnos épp külföldi konferencián leszünk azon a hétvégén, így személyesen nem tudunk ott lenni. Kívánunk nektek rengeteg boldogságot!',
    createdAt: '2026-06-16T11:05:00Z',
  },
  {
    id: 'rsvp-5',
    invitationId: 'inv-eskuvo-1',
    guestName: 'Molnár Dániel & Barátnője',
    email: 'molnar.dani@gmail.com',
    phone: '+40 758 111 444',
    attendance: 'attending',
    adultsCount: 2,
    childrenCount: 0,
    dietaryRequirements: 'Laktózmentes',
    dietType: 'lactose_free',
    songRequest: 'Dua Lipa - Levitating',
    message: 'Gratulálunk a döntésetekhez, ott találkozunk!',
    createdAt: '2026-06-18T16:50:00Z',
  },
];

export function getSavedInvitations(): InvitationData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVITATIONS);
    if (!raw) {
      // Initialize with our premier wedding template
      const defaultInv = TEMPLATES[0].defaultData;
      localStorage.setItem(STORAGE_KEY_INVITATIONS, JSON.stringify([defaultInv]));
      return [defaultInv];
    }
    const parsed: InvitationData[] = JSON.parse(raw);
    return parsed.map(inv => ({
      ...inv,
      coverImage: inv.coverImage ? inv.coverImage.replace('/src/assets/images/', '/images/') : inv.coverImage,
    }));
  } catch {
    return [TEMPLATES[0].defaultData];
  }
}

export function saveInvitation(inv: InvitationData): void {
  try {
    const list = getSavedInvitations();
    const idx = list.findIndex(item => item.id === inv.id);
    if (idx >= 0) {
      list[idx] = inv;
    } else {
      list.unshift(inv);
    }
    localStorage.setItem(STORAGE_KEY_INVITATIONS, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving invitation', e);
  }
}

export function getRsvpsForInvitation(invitationId: string): GuestRsvp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RSVPS);
    let allRsvps: GuestRsvp[] = [];
    if (!raw) {
      allRsvps = INITIAL_RSVPS;
      localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify(INITIAL_RSVPS));
    } else {
      allRsvps = JSON.parse(raw);
    }
    return allRsvps.filter(r => r.invitationId === invitationId);
  } catch {
    return INITIAL_RSVPS.filter(r => r.invitationId === invitationId);
  }
}

export function addRsvp(rsvp: Omit<GuestRsvp, 'id' | 'createdAt'>): GuestRsvp {
  const newRsvp: GuestRsvp = {
    ...rsvp,
    id: `rsvp-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_RSVPS);
    const list: GuestRsvp[] = raw ? JSON.parse(raw) : INITIAL_RSVPS;
    list.unshift(newRsvp);
    localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify(list));
  } catch (e) {
    console.error('Error storing rsvp', e);
  }

  return newRsvp;
}

export function deleteRsvp(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RSVPS);
    if (raw) {
      const list: GuestRsvp[] = JSON.parse(raw);
      const filtered = list.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('Error deleting rsvp', e);
  }
}
