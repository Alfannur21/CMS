import React, { useState, useEffect } from 'react';
import { CompleteLightInvitationPayload } from '../types';
import { ApiService } from '../services/apiService';
import { AnimationLoader } from '../components/AnimationLoader';
import { OverlayRenderer } from '../components/OverlayRenderer';
import { TiltCard } from '../components/ui/TiltCard';
import { 
  Heart, Calendar, Clock, MapPin, Gift, Copy, Check, Send, 
  Instagram, Navigation, Home, UserCheck
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
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#111827', '#4b5563', '#9ca3af'],
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
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-700">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2" />
        <p className="ml-3 text-sm">Memuat Undangan...</p>
      </div>
    );
  }

  const { couple, events, stories, gifts, interactions } = data;
  const bankGift = gifts.find((g) => g.slot_type === 'bank');
  const addressGift = gifts.find((g) => g.slot_type === 'physical_address');

  return (
    <div className="relative min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-900 selection:text-white">
      
      {/* 1. ANIMATION LOADER */}
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
        
        {/* 2. LAYERED OVERLAY HERO RENDERER */}
        <section className="pt-4 px-2">
          <OverlayRenderer data={data} />
        </section>

        {/* 3. MEMPELAI PENGANTIN SECTION */}
        <section className="px-6 space-y-8 text-center">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">Mempelai Pengantin</span>
            <h2 className="font-serif text-3xl font-normal text-gray-900">Elyana & Syahril</h2>
            <div className="w-12 h-[1px] bg-gray-200 mx-auto mt-2" />
          </div>

          <div className="space-y-6">
            {/* BRIDE */}
            <TiltCard className="p-6 text-center">
              <img
                src={couple.avatar_bride}
                alt={couple.bride_name}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover filter contrast-[1.02] border border-gray-200 p-1"
              />
              <h3 className="font-serif text-xl font-normal text-gray-900">{couple.bride_name}</h3>
              <p className="text-xs text-gray-500 mt-1">{couple.bride_parents}</p>
              {couple.bride_ig && (
                <a
                  href={`https://instagram.com/${couple.bride_ig.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[11px] text-gray-600 hover:text-gray-900 mt-3 transition-colors"
                >
                  <Instagram className="w-3 h-3 text-gray-500" />
                  {couple.bride_ig}
                </a>
              )}
            </TiltCard>

            {/* GROOM */}
            <TiltCard className="p-6 text-center">
              <img
                src={couple.avatar_groom}
                alt={couple.groom_name}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover filter contrast-[1.02] border border-gray-200 p-1"
              />
              <h3 className="font-serif text-xl font-normal text-gray-900">{couple.groom_name}</h3>
              <p className="text-xs text-gray-500 mt-1">{couple.groom_parents}</p>
              {couple.groom_ig && (
                <a
                  href={`https://instagram.com/${couple.groom_ig.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[11px] text-gray-600 hover:text-gray-900 mt-3 transition-colors"
                >
                  <Instagram className="w-3 h-3 text-gray-500" />
                  {couple.groom_ig}
                </a>
              )}
            </TiltCard>
          </div>
        </section>

        {/* 4. DETAIL ACARA */}
        <section className="px-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">Rangkaian Acara</span>
            <h2 className="font-serif text-2xl font-normal text-gray-900">Waktu & Lokasi</h2>
          </div>

          <div className="space-y-4">
            {events.map((evt) => (
              <TiltCard key={evt.id} className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-medium border border-gray-200">
                    {evt.event_type}
                  </span>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>

                <h3 className="font-serif text-lg font-medium text-gray-900">{evt.location_name}</h3>
                
                <p className="text-xs text-gray-600 flex items-start gap-2 leading-relaxed">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>{evt.address}</span>
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span>31 Des 2024 • Pukul {evt.start_time.substring(11, 16)} - {evt.end_time.substring(11, 16)} WIB</span>
                </div>

                <a
                  href={evt.google_maps_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-900 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-minimal hover:bg-gray-800 transition-colors"
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
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">Kisah Cinta</span>
            <h2 className="font-serif text-2xl font-normal text-gray-900">Love Story</h2>
          </div>

          <div className="space-y-4">
            {stories.map((item, idx) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-minimal space-y-1">
                <span className="text-[11px] font-semibold text-gray-900 tracking-wider">
                  {idx + 1}. {item.title} ({item.year_date})
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">{item.narrative}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. LOVE GIFT MULTI-SLOT */}
        <section className="px-6 space-y-6">
          <div className="text-center space-y-1">
            <Gift className="w-6 h-6 text-gray-700 mx-auto mb-1" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">Tanda Kasih</span>
            <h2 className="font-serif text-2xl font-normal text-gray-900">Love Gift</h2>
          </div>

          <div className="space-y-4">
            {bankGift && (
              <TiltCard className="p-6 text-center space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{bankGift.bank_name}</p>
                <p className="text-xl font-mono font-semibold text-gray-900 tracking-wider">{bankGift.account_number}</p>
                <p className="text-xs text-gray-500">a.n {bankGift.account_holder}</p>

                <button
                  onClick={() => handleCopyBank(bankGift.account_number || '')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-900 text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedBank ? 'Nomor Rekening Terekam!' : 'Salin Nomor Rekening'}
                </button>
              </TiltCard>
            )}

            {addressGift && (
              <TiltCard className="p-6 text-center space-y-3">
                <Home className="w-5 h-5 text-gray-600 mx-auto" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kirim Kado Fisik</p>
                <p className="text-xs text-gray-600 leading-relaxed px-2">{addressGift.address}</p>
                <p className="text-[11px] text-gray-500">Penerima: {addressGift.recipient_name}</p>

                <button
                  onClick={() => handleCopyAddress(addressGift.address || '')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 font-medium text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  {copiedAddress ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAddress ? 'Alamat Berhasil Disalin!' : 'Salin Alamat Kado'}
                </button>
              </TiltCard>
            )}
          </div>
        </section>

        {/* 7. RSVP & WISHES FORM */}
        <section className="px-6 space-y-6">
          <div className="text-center space-y-1">
            <UserCheck className="w-6 h-6 text-gray-700 mx-auto mb-1" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">Konfirmasi Kehadiran</span>
            <h2 className="font-serif text-2xl font-normal text-gray-900">RSVP & Ucapan Doa</h2>
          </div>

          <form onSubmit={handleRSVPSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Nama Tamu</label>
              <input
                type="text"
                required
                value={guestNameInput}
                onChange={(e) => setGuestNameInput(e.target.value)}
                placeholder="Masukkan Nama Anda"
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Kehadiran</label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value as any)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                >
                  <option value="Datang">Akan Hadir</option>
                  <option value="Ragu">Masih Ragu</option>
                  <option value="Tidak Datang">Tidak Hadir</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Jumlah</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Pesan & Doa</label>
              <textarea
                required
                rows={3}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Tuliskan ucapan selamat..."
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-900 text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Mengirim...' : 'Kirim RSVP & Doa'}
            </button>

            {submitSuccess && (
              <div className="p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 text-xs text-center font-medium">
                Terima kasih! RSVP dan doa restu Anda telah terkirim.
              </div>
            )}
          </form>

          {/* WISHES STREAM */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-gray-700 fill-gray-700" />
              Doa & Ucapan ({interactions.length})
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {interactions.map((item) => (
                <div key={item.id} className="bg-white p-3.5 rounded-2xl border border-gray-200 text-xs shadow-minimal">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">{item.guest_name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium border border-gray-200">
                      {item.attendance_status} ({item.guest_count} Org)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed mb-1">{item.message}</p>
                  <span className="text-[9px] text-gray-400 block">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
