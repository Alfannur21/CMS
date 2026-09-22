export type PaymentStatus = 'pending' | 'settlement' | 'expired';

export interface OverlayElement {
  id: string;
  type: 'text' | 'component' | 'image';
  top: string; // e.g. "15.5%"
  left: string; // e.g. "50%"
  transform?: string; // e.g. "translateX(-50%)"
  font_family?: string;
  font_size?: string;
  color?: string;
  content_key?: string; // e.g. "bride_name", "countdown", "event_date", "quote"
}

export interface OverlayConfig {
  viewport_width: number; // 390
  elements: OverlayElement[];
}

export interface Template {
  id: number;
  name: string;
  base_image_url: string;
  viewport_dimensions: string; // e.g. "390x844"
  overlay_config: OverlayConfig;
}

export interface Invitation {
  id: string;
  slug: string;
  template_id: number;
  user_id: string;
  status_payment: PaymentStatus;
  created_at: string;
}

export interface Couple {
  id: string;
  invitation_id: string;
  bride_name: string;
  bride_parents: string;
  groom_name: string;
  groom_parents: string;
  bride_ig?: string;
  groom_ig?: string;
  avatar_bride?: string;
  avatar_groom?: string;
  quote_text?: string; // QS Ar-Rum: 21
}

export interface EventDetail {
  id: string;
  invitation_id: string;
  event_type: 'Akad' | 'Resepsi';
  start_time: string; // e.g. 2024-12-31T08:00:00
  end_time: string; // e.g. 2024-12-31T10:00:00
  location_name: string;
  address: string;
  google_maps_link: string;
}

export interface LoveStoryItem {
  id: string;
  invitation_id: string;
  title: string;
  narrative: string;
  year_date: string;
}

export interface DigitalGiftSlot {
  id: string;
  slot_type: 'bank' | 'physical_address';
  bank_name?: string;
  account_number?: string;
  account_holder?: string;
  address?: string;
  recipient_name?: string;
}

export interface Guest {
  id: string;
  invitation_id: string;
  guest_name: string;
  unique_token: string;
  slug_access: string;
}

export interface GuestInteraction {
  id: string;
  guest_id?: string;
  guest_name: string;
  attendance_status: 'Datang' | 'Ragu' | 'Tidak Datang';
  guest_count: number;
  message: string;
  created_at: string;
}

export interface OptimizedMedia {
  original_name: string;
  webp_url: string;
  width: number;
  height: number;
  file_size_kb: number;
  srcset: string;
}

export interface CompleteLightInvitationPayload {
  template: Template;
  invitation: Invitation;
  couple: Couple;
  events: EventDetail[];
  stories: LoveStoryItem[];
  gifts: DigitalGiftSlot[];
  interactions: GuestInteraction[];
  media_gallery: OptimizedMedia[];
}

export type ViewMode = 'public' | 'client' | 'admin';
