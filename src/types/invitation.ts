export type EventCategory = 
  | 'osszes'
  | 'eskuvo'
  | 'szuletesnap'
  | 'keresztelo'
  | 'evfordulo'
  | 'ceges'
  | 'babavaro'
  | 'party';

export type InvitationStyle = 
  | 'arany-elegans'
  | 'botanikus-zold'
  | 'ejfekeli-navy'
  | 'romantikus-rozsa'
  | 'minimalista-modern'
  | 'vintage-kraft';

export type InvitationFormat = 'digital-web' | 'story-card' | 'print-pdf';

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface InfoNote {
  id: string;
  title: string;
  text: string;
  icon?: string;
}

export interface ColorScheme {
  id: string;
  name: string;
  primary: string; // Accent color (e.g. gold, sage, navy)
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
}

export interface FontOption {
  id: string;
  name: string;
  titleClass: string;
  bodyClass: string;
}

export interface InvitationData {
  id: string;
  slug: string;
  title: string;
  badgeText: string;
  names: string;
  subtitle: string;
  quote: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  locationName: string;
  locationAddress: string;
  googleMapsUrl?: string;
  timeline: TimelineItem[];
  infoNotes: InfoNote[];
  rsvpDeadline: string;
  allowDietary: boolean;
  allowSongRequest: boolean;
  allowPlusOne: boolean;
  allowChildren: boolean;
  contactPhone?: string;
  contactEmail?: string;
  colorSchemeId: string;
  fontOptionId: string;
  coverImage?: string;
  backgroundImageType?: 'none' | 'botanical' | 'stars' | 'linen' | 'marble';
}

export interface InvitationTemplate {
  id: string;
  name: string;
  category: EventCategory;
  style: InvitationStyle;
  formats: InvitationFormat[];
  description: string;
  thumbnail: string;
  badge: string;
  isPremium?: boolean;
  defaultData: InvitationData;
}

export interface GuestRsvp {
  id: string;
  invitationId: string;
  guestName: string;
  email?: string;
  phone?: string;
  attendance: 'attending' | 'declined';
  adultsCount: number;
  childrenCount: number;
  dietaryRequirements: string;
  dietType?: 'normal' | 'vegetarian' | 'vegan' | 'gluten_free' | 'lactose_free' | 'other';
  songRequest?: string;
  message?: string;
  createdAt: string;
}
