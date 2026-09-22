import { CompleteLightInvitationPayload, GuestInteraction, OptimizedMedia, Template, Invitation, Couple, EventDetail, LoveStoryItem, DigitalGiftSlot } from '../types';

const BASE_TEMPLATE: Template = {
  id: 101,
  name: 'Figma Premium Coklat-Ai Base Overlay',
  base_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
  viewport_dimensions: '390x844',
  overlay_config: {
    viewport_width: 390,
    elements: [
      {
        id: 'header_title',
        type: 'text',
        top: '6%',
        left: '50%',
        transform: 'translateX(-50%)',
        font_family: 'Playfair Display',
        font_size: '14px',
        color: '#d4af37',
        content_key: 'header_text',
      },
      {
        id: 'mempelai_wanita',
        type: 'text',
        top: '14%',
        left: '50%',
        transform: 'translateX(-50%)',
        font_family: 'Playfair Display',
        font_size: '26px',
        color: '#f5be38',
        content_key: 'bride_name',
      },
      {
        id: 'ampersand',
        type: 'text',
        top: '18.5%',
        left: '50%',
        transform: 'translateX(-50%)',
        font_family: 'Great Vibes',
        font_size: '32px',
        color: '#d4af37',
        content_key: 'ampersand',
      },
      {
        id: 'mempelai_pria',
        type: 'text',
        top: '23%',
        left: '50%',
        transform: 'translateX(-50%)',
        font_family: 'Playfair Display',
        font_size: '26px',
        color: '#f5be38',
        content_key: 'groom_name',
      },
      {
        id: 'quote_text',
        type: 'text',
        top: '32%',
        left: '50%',
        transform: 'translateX(-50%)',
        font_family: 'Plus Jakarta Sans',
        font_size: '11px',
        color: '#e5c4b0',
        content_key: 'quote_ar_rum',
      },
      {
        id: 'countdown_timer',
        type: 'component',
        top: '44%',
        left: '50%',
        transform: 'translateX(-50%)',
        content_key: 'countdown_component',
      }
    ],
  },
};

const INITIAL_INVITATION: Invitation = {
  id: 'inv-elyana-syahril-001',
  slug: 'elyana-syahril',
  template_id: 101,
  user_id: 'usr-client-001',
  status_payment: 'pending', // Initialized as pending to showcase the Watermark feature
  created_at: new Date().toISOString(),
};

const INITIAL_COUPLE: Couple = {
  id: 'cpl-001',
  invitation_id: 'inv-elyana-syahril-001',
  bride_name: 'Elyana Azkiya Nur',
  bride_parents: 'Putri Bapak Nasrudin Hatta & Ibu Elma Muna',
  groom_name: 'Syahril Rendra Backhtiar',
  groom_parents: 'Putra Bapak Sufian Jadin & Ibu Elmira Ghendis',
  bride_ig: '@elyana.azkiya',
  groom_ig: '@syahril.rendra',
  avatar_bride: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  avatar_groom: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  quote_text: '"Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang." (QS. Ar-Rum: 21)',
};

const INITIAL_EVENTS: EventDetail[] = [
  {
    id: 'evt-001',
    invitation_id: 'inv-elyana-syahril-001',
    event_type: 'Akad',
    start_time: '2024-12-31T08:00:00',
    end_time: '2024-12-31T10:00:00',
    location_name: 'Auditorium Masjid Utama',
    address: 'Jalan Raya Bojongsari No.5, Gunung Putri, Citeureup, Bogor',
    google_maps_link: 'https://maps.google.com/?q=Auditorium+Masjid+Bojongsari+Bogor',
  },
  {
    id: 'evt-002',
    invitation_id: 'inv-elyana-syahril-001',
    event_type: 'Resepsi',
    start_time: '2024-12-31T11:00:00',
    end_time: '2024-12-31T16:00:00',
    location_name: 'Grand Ballroom Auditorium Masjid',
    address: 'Jalan Raya Bojongsari No.5, Gunung Putri, Citeureup, Bogor',
    google_maps_link: 'https://maps.google.com/?q=Auditorium+Masjid+Bojongsari+Bogor',
  }
];

const INITIAL_STORIES: LoveStoryItem[] = [
  {
    id: 'st-001',
    invitation_id: 'inv-elyana-syahril-001',
    title: 'Awal Bertemu',
    narrative: 'Pertemuan tidak sengaja dalam seminar nasional di Bandung, berlanjut ke komunikasi intens dan komitmen untuk saling mendukung.',
    year_date: 'Desember 2021',
  },
  {
    id: 'st-002',
    invitation_id: 'inv-elyana-syahril-001',
    title: 'Lamaran',
    narrative: 'Pertemuan keluarga pertama untuk mengikat hubungan ke jenjang yang lebih serius dan suci.',
    year_date: 'Juni 2024',
  },
  {
    id: 'st-003',
    invitation_id: 'inv-elyana-syahril-001',
    title: 'Menikah',
    narrative: 'Keputusan bersama untuk mengikat janji suci pernikahan sebagai pasangan suami istri.',
    year_date: '31 Desember 2024',
  }
];

const INITIAL_GIFTS: DigitalGiftSlot[] = [
  {
    id: 'gft-001',
    slot_type: 'bank',
    bank_name: 'Bank Mandiri',
    account_number: '123123123',
    account_holder: 'Elyana Azkiya Nur',
  },
  {
    id: 'gft-002',
    slot_type: 'physical_address',
    address: 'Jalan Raya Bojongsari No.5, Citeureup, Bogor',
    recipient_name: 'Elyana & Syahril',
  }
];

const INITIAL_INTERACTIONS: GuestInteraction[] = [
  {
    id: 'rsv-001',
    guest_name: 'Budi Santoso & Keluarga',
    attendance_status: 'Datang',
    guest_count: 2,
    message: 'Selamat menempuh hidup baru Elyana & Syahril! Bararakallahu lakuma.',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  }
];

const INITIAL_MEDIA: OptimizedMedia[] = [
  {
    original_name: 'photo_prewed_1.jpg',
    webp_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    width: 1200,
    height: 800,
    file_size_kb: 184,
    srcset: 'photo_prewed_1-400.webp 400w, photo_prewed_1-800.webp 800w, photo_prewed_1-1200.webp 1200w',
  }
];

const STORAGE_KEY = 'cms_light_invitation_v2';

export class ApiService {
  private static getStoredPayload(): CompleteLightInvitationPayload {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialPayload: CompleteLightInvitationPayload = {
        template: BASE_TEMPLATE,
        invitation: INITIAL_INVITATION,
        couple: INITIAL_COUPLE,
        events: INITIAL_EVENTS,
        stories: INITIAL_STORIES,
        gifts: INITIAL_GIFTS,
        interactions: INITIAL_INTERACTIONS,
        media_gallery: INITIAL_MEDIA,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPayload));
      return initialPayload;
    }
    return JSON.parse(raw);
  }

  private static savePayload(payload: CompleteLightInvitationPayload): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('light_invitation_updated', { detail: payload }));
  }

  // REST API: GET /v1/invitation/{slug}
  public static async getInvitationBySlug(slug: string): Promise<CompleteLightInvitationPayload> {
    return this.getStoredPayload();
  }

  // REST API: POST /v1/interact/rsvp
  public static async submitRSVP(data: {
    guest_id?: string;
    guest_name: string;
    attendance_status: 'Datang' | 'Ragu' | 'Tidak Datang';
    guest_count: number;
    message: string;
  }): Promise<GuestInteraction> {
    const payload = this.getStoredPayload();
    const newRSVP: GuestInteraction = {
      ...data,
      id: 'rsv-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    payload.interactions.unshift(newRSVP);
    this.savePayload(payload);
    return newRSVP;
  }

  // REST API: POST /v1/media/upload (Auto WebP Conversion & 1200px Capping Simulator)
  public static async uploadAndOptimizeMedia(fileName: string): Promise<OptimizedMedia> {
    const payload = this.getStoredPayload();
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const optimized: OptimizedMedia = {
      original_name: fileName,
      webp_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
      width: 1200,
      height: 800,
      file_size_kb: 142, // Under 500KB requirement
      srcset: `${baseName}-400.webp 400w, ${baseName}-800.webp 800w, ${baseName}-1200.webp 1200w`,
    };

    payload.media_gallery.unshift(optimized);
    this.savePayload(payload);
    return optimized;
  }

  // REST API: POST /v1/payments/webhook (Midtrans Webhook & Signature Verification Simulator)
  public static async processPaymentWebhook(invitationId: string, status: 'settlement' | 'pending' | 'expired'): Promise<{
    success: boolean;
    status_payment: string;
    message: string;
  }> {
    const payload = this.getStoredPayload();
    payload.invitation.status_payment = status;
    this.savePayload(payload);

    return {
      success: true,
      status_payment: status,
      message: status === 'settlement' 
        ? 'Pembayaran berhasil dikonfirmasi! Watermark demo otomatis dihapus dan fitur diaktifkan.'
        : 'Status pembayaran diubah ke Pending (Watermark Demo Aktif).',
    };
  }

  // Generate Guest WhatsApp Link
  public static generateGuestLink(slug: string, guestName: string): { url: string; waMessage: string } {
    const baseUrl = window.location.origin;
    const cleanGuest = encodeURIComponent(guestName.trim());
    const url = `${baseUrl}/?slug=${slug}&to=${cleanGuest}`;
    const waMessage = `Bismillah-ir-Rahman-ir-Rahim\n\nYth. *${guestName}*,\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:\n\n*Elyana & Syahril*\n\nInformasi lengkap acara & RSVP dapat diakses melalui tautan berikut:\n${url}\n\nTerima kasih.`;
    
    return { url, waMessage };
  }

  // Update Data Payload from Client Dashboard
  public static async updatePayload(updated: Partial<CompleteLightInvitationPayload>): Promise<CompleteLightInvitationPayload> {
    const current = this.getStoredPayload();
    const merged: CompleteLightInvitationPayload = {
      ...current,
      invitation: { ...current.invitation, ...updated.invitation },
      couple: { ...current.couple, ...updated.couple },
      events: updated.events || current.events,
      stories: updated.stories || current.stories,
      gifts: updated.gifts || current.gifts,
    };
    this.savePayload(merged);
    return merged;
  }
}
