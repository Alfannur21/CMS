import React, { useState, useEffect } from 'react';
import { CompleteLightInvitationPayload } from '../types';
import { ApiService } from '../services/apiService';
import { AnimationLoader } from '../components/AnimationLoader';
import { OverlayRenderer } from '../components/OverlayRenderer';
import { TiltCard } from '../components/ui/TiltCard';
import { 
  Heart, Calendar, Clock, MapPin, Gift, Copy, Check, Send, 
  Instagram, Navigation, Home, Sparkles, UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PublicInvitationProps {
  initialPayload?: CompleteLightInvitationPayload;
  slug?: string;
  guestNameOverride?: string;
  isLivePreview?: boolean;
}

export const PublicInvitation: React.FC<PublicInvitationProps> = ({
  initialPayload,
  slug = 'elyana-syahril',
  guestNameOverride,
  isLivePreview = false,
}) => {
  const [data, setData] = useState<CompleteLightInvitationPayload | null>(initialPayload || null);
  const [isLoaderOpen, setIsLoaderOpen] = useState(!isLivePreview);
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // RSVP Form State
  const [guestNameInput, setGuestNameInput] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'Datang' | 'Ragu' | 'Tidak Datang'>('Datang');
  const [guestCount, setGuestCount] = useState(2);
  const [messageInput, setMessageInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Get guest name parameter
  const urlParams = new URLSearchParams(window.location.search);
  const guestNameParam = guestNameOverride || urlParams.get('to') || 'Tamu Undangan';

  useEffect(() => {
    if (initialPayload) {
      setData(initialPayload);
    } else {
      ApiService.getInvitationBySlug(slug).then((res) => setData(res));
    }

    const handleDataUpdate = (e: CustomEvent<CompleteLightInvitationPayload>) => {
      setData(e.detail);
    };

    window.addEventListener('light_invitation_updated' as any, handleDataUpdate);
    return () => {
      window.removeEventListener('light_invitation_updated' as any, handleDataUpdate);
    };
  }, [slug, initialPayload]);

  const handleCopyBank = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestNameInput.trim() || !messageInput.trim()) return;

    setIsSubmitting(true);
    try {
      const newRSVP = await ApiService.submitRSVP({
        guest_name: guestNameInput.trim(),
        attendance_status: attendanceStatus,
        guest_count: Number(guestCount),
        message: messageInput.trim(),
      });

      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          interactions: [newRSVP, ...prev.interactions],
        };
      });

      setSubmitSuccess(true);
      setGuestNameInput('');
      setMessageInput('');

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f5be38', '#faf3ee'],
      });

      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-coklat-950 text-gold-400 font-serif">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold-400 mb-3" />
        <p className="ml-3 text-sm">Memuat CMS Light-Version...</p>
      </div>
    );
  }

  const { couple, events, stories, gifts, interactions } = data;
  const bankGift = gifts.find((g) => g.slot_type === 'bank');
  const addressGift = gifts.find((g) => g.slot_type === 'physical_address');

  return (
    <div className="relative min-h-screen bg-coklat-950 text-coklat-100 font-sans selection:bg-gold-500 selection:text-coklat-950">
      
      {/* 1. OPENING ANIMATION LOADER (/open) */}
      {isLoaderOpen && (
        <AnimationLoader
          guestName={guestNameParam}
          brideName={couple.bride_name}
          groomName={couple.groom_name}
          onOpen={() => setIsLoaderOpen(false)}
        />
      )}

      {/* MAIN CONTAINER */}
      <div className="max-w-md mx-auto min-h-screen pb-16 space-y-12">
        
        {/* 2. LAYERED OVERLAY HERO RENDERER (FIGMA BASE + PERCENTAGE COORDINATES) */}
        <section className="pt-4 px-2">
          <OverlayRenderer data={data} />
        </section>

        {/* 3. MEMPELAI PENGANTIN SECTION */}
        <section className="px-6 space-y-8 text-center">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400">Mempelai Pengantin</span>
            <h2 className="font-serif text-3xl font-bold text-gold-gradient">Elyana & Syahril</h2>
            <div className="w-16 h-[1px] bg-gold-400/30 mx-auto mt-2" />
          </div>

          <div className="space-y-6">
            {/* BRIDE */}
            <TiltCard className="glass-card p-6 rounded-3xl border border-gold-500/30">
              <img
                src={couple.avatar_bride}
                alt={couple.bride_name}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover p-1 bg-gold-gradient"
              />
              <h3 className="font-serif text-xl font-bold text-gold-300">{couple.bride_name}</h3>
              <p className="text-xs text-coklat-300 mt-1">{couple.bride_parents}</p>
              {couple.bride_ig && (
                <a
                  href={`https://instagram.com/${couple.bride_ig.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coklat-900 border border-gold-500/30 text-[11px] text-gold-400 mt-3"
                >
                  <Instagram className="w-3 h-3" />
                  {couple.bride_ig}
                </a>
              )}
            </TiltCard>

            {/* GROOM */}
            <TiltCard className="glass-card p-6 rounded-3xl border border-gold-500/30">
              <img
                src={couple.avatar_groom}
                alt={couple.groom_name}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover p-1 bg-gold-gradient"
              />
              <h3 className="font-serif text-xl font-bold text-gold-300">{couple.groom_name}</h3>
              <p className="text-xs text-coklat-300 mt-1">{couple.groom_parents}</p>
              {couple.groom_ig && (
                <a
                  href={`https://instagram.com/${couple.groom_ig.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coklat-900 border border-gold-500/30 text-[11px] text-gold-400 mt-3"
                >
                  <Instagram className="w-3 h-3" />
                  {couple.groom_ig}
                </a>
              )}
            </TiltCard>
          </div>
        </section>

        {/* 4. DETAIL ACARA (AKAD & RESEPSI) */}
        <section className="px-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400">Rangkaian Acara</span>
            <h2 className="font-serif text-2xl font-bold text-gold-gradient">Waktu & Lokasi</h2>
          </div>

          <div className="space-y-4">
            {events.map((evt) => (
              <TiltCard key={evt.id} className="glass-card-gold p-6 rounded-3xl border border-gold-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-bold uppercase">
                    {evt.event_type}
                  </span>
                  <Calendar className="w-4 h-4 text-gold-400" />
                </div>

                <h3 className="font-serif text-xl font-bold text-gold-200">{evt.location_name}</h3>
                
                <p className="text-xs text-coklat-300 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span>{evt.address}</span>
                </p>

                <div className="flex items-center gap-2 text-xs text-gold-300 bg-coklat-950/70 p-3 rounded-xl">
                  <Clock className="w-4 h-4 text-gold-400" />
                  <span>31 Des 2024 • Pukul {evt.start_time.substring(11, 16)} - {evt.end_time.substring(11, 16)} WIB</span>
                </div>

                <a
                  href={evt.google_maps_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gold-gradient text-coklat-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-gold-glow"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Petunjuk Lokasi (Google Maps)
                </a>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* 5. LOVE STORY REPEATER */}
        <section className="px-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400">Kisah Cinta</span>
            <h2 className="font-serif text-2xl font-bold text-gold-gradient">Love Story</h2>
          </div>

          <div className="space-y-4">
            {stories.map((item, idx) => (
              <div key={item.id} className="glass-card p-5 rounded-2xl border border-gold-500/20 space-y-1.5">
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider">
                  {idx + 1}. {item.title} ({item.year_date})
                </span>
                <p className="text-xs text-coklat-200 leading-relaxed">{item.narrative}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. LOVE GIFT MULTI-SLOT & 1-CLICK COPY FEATURE */}
        <section className="px-6 space-y-6">
          <div className="text-center space-y-1">
            <Gift className="w-8 h-8 text-gold-400 mx-auto mb-1" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400">Tanda Kasih</span>
            <h2 className="font-serif text-2xl font-bold text-gold-gradient">Love Gift</h2>
          </div>

          <div className="space-y-4">
            {/* SLOT 1: BANK MANDIRI */}
            {bankGift && (
              <TiltCard className="glass-card-gold p-6 rounded-3xl border border-gold-500/40 text-center space-y-3">
                <p className="text-xs font-bold text-gold-300 uppercase">{bankGift.bank_name}</p>
                <p className="text-xl font-mono font-bold text-gold-400 tracking-widest">{bankGift.account_number}</p>
                <p className="text-xs text-coklat-300">a.n {bankGift.account_holder}</p>

                <button
                  onClick={() => handleCopyBank(bankGift.account_number || '')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gold-gradient text-coklat-950 font-bold text-xs flex items-center justify-center gap-2 hover:shadow-gold-glow"
                >
                  {copiedBank ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedBank ? 'Nomor Rekening Terekam!' : 'Salin Nomor Rekening'}
                </button>
              </TiltCard>
            )}

            {/* SLOT 2: PHYSICAL GIFT DELIVERY ADDRESS */}
            {addressGift && (
              <TiltCard className="glass-card p-6 rounded-3xl border border-gold-500/30 text-center space-y-3">
                <Home className="w-6 h-6 text-gold-400 mx-auto" />
                <p className="text-xs font-bold text-gold-300 uppercase">Kirim Kado Fisik</p>
                <p className="text-xs text-coklat-200 leading-relaxed px-2">{addressGift.address}</p>
                <p className="text-[11px] text-coklat-400">Penerima: {addressGift.recipient_name}</p>

                <button
                  onClick={() => handleCopyAddress(addressGift.address || '')}
                  className="w-full py-2.5 px-4 rounded-xl bg-coklat-900 border border-gold-500/30 text-gold-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-coklat-850"
                >
                  {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedAddress ? 'Alamat Berhasil Disalin!' : 'Salin Alamat Kado'}
                </button>
              </TiltCard>
            )}
          </div>
        </section>

        {/* 7. RSVP & WISHES FORM */}
        <section className="px-6 space-y-6">
          <div className="text-center space-y-1">
            <UserCheck className="w-8 h-8 text-gold-400 mx-auto mb-1" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400">Konfirmasi Kehadiran</span>
            <h2 className="font-serif text-2xl font-bold text-gold-gradient">RSVP & Ucapan Doa</h2>
          </div>

          <form onSubmit={handleRSVPSubmit} className="glass-card-gold p-6 rounded-3xl border border-gold-500/40 space-y-4">
            <div>
              <label className="block text-xs text-coklat-200 mb-1">Nama Tamu</label>
              <input
                type="text"
                required
                value={guestNameInput}
                onChange={(e) => setGuestNameInput(e.target.value)}
                placeholder="Masukkan Nama Anda"
                className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 placeholder-coklat-500 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-coklat-200 mb-1">Kehadiran</label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value as any)}
                  className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 focus:outline-none"
                >
                  <option value="Datang">Akan Hadir</option>
                  <option value="Ragu">Masih Ragu</option>
                  <option value="Tidak Datang">Tidak Hadir</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-coklat-200 mb-1">Jumlah</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-coklat-200 mb-1">Pesan & Doa</label>
              <textarea
                required
                rows={3}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Tuliskan ucapan selamat..."
                className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 placeholder-coklat-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gold-gradient text-coklat-950 font-bold text-xs flex items-center justify-center gap-2 hover:shadow-gold-glow"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Mengirim...' : 'Kirim RSVP & Doa'}
            </button>

            {submitSuccess && (
              <div className="p-3 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs text-center">
                Terima kasih! RSVP dan doa restu Anda berhasil terkirim.
              </div>
            )}
          </form>

          {/* WISHES STREAM */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gold-300 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
              Doa & Ucapan ({interactions.length})
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {interactions.map((item) => (
                <div key={item.id} className="glass-card p-3.5 rounded-2xl border border-gold-500/20 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gold-200">{item.guest_name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30">
                      {item.attendance_status} ({item.guest_count} Org)
                    </span>
                  </div>
                  <p className="text-[11px] text-coklat-200 leading-relaxed mb-1">{item.message}</p>
                  <span className="text-[9px] text-coklat-400 block">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
