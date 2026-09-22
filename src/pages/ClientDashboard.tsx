import React, { useState, useEffect } from 'react';
import { CompleteLightInvitationPayload, Couple, EventDetail, LoveStoryItem, DigitalGiftSlot } from '../types';
import { ApiService } from '../services/apiService';
import { PublicInvitation } from './PublicInvitation';
import { 
  Users, Calendar, Heart, Gift, MessageSquare, CreditCard, 
  Share2, Eye, CheckCircle2, Copy, ExternalLink, Sparkles, Plus, Trash2, Layout, Upload, Image as ImageIcon
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const [payload, setPayload] = useState<CompleteLightInvitationPayload | null>(null);
  const [activeTab, setActiveTab] = useState<'couple' | 'events' | 'stories' | 'gifts' | 'media' | 'generator' | 'analytics' | 'payment'>('couple');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Generator State
  const [guestNameInput, setGuestNameInput] = useState('Budi Santoso');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Upload state
  const [uploadFileName, setUploadFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Payment State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  useEffect(() => {
    ApiService.getInvitationBySlug('elyana-syahril').then((data) => {
      setPayload(data);
      updateLink(guestNameInput, data.invitation.slug);
    });
  }, []);

  const updateLink = (name: string, slug: string) => {
    const result = ApiService.generateGuestLink(slug, name);
    setGeneratedUrl(result.url);
    setWaMessage(result.waMessage);
  };

  const handleGuestNameChange = (name: string) => {
    setGuestNameInput(name);
    if (payload) {
      updateLink(name, payload.invitation.slug);
    }
  };

  const handleCoupleChange = (field: keyof Couple, value: string) => {
    if (!payload) return;
    const updatedCouple = { ...payload.couple, [field]: value };
    const newPayload = { ...payload, couple: updatedCouple };
    setPayload(newPayload);
    ApiService.updatePayload(newPayload);
  };

  const handleEventChange = (index: number, field: keyof EventDetail, value: string) => {
    if (!payload) return;
    const updatedEvents = [...payload.events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    const newPayload = { ...payload, events: updatedEvents };
    setPayload(newPayload);
    ApiService.updatePayload(newPayload);
  };

  const handleStoryChange = (index: number, field: keyof LoveStoryItem, value: string) => {
    if (!payload) return;
    const updatedStories = [...payload.stories];
    updatedStories[index] = { ...updatedStories[index], [field]: value };
    const newPayload = { ...payload, stories: updatedStories };
    setPayload(newPayload);
    ApiService.updatePayload(newPayload);
  };

  const handleAddStory = () => {
    if (!payload) return;
    const newStory: LoveStoryItem = {
      id: 'st-' + Math.random().toString(36).substring(2, 7),
      invitation_id: payload.invitation.id,
      title: 'Kisah Baru',
      narrative: 'Tuliskan momen indah Anda...',
      year_date: '2024',
    };
    const newPayload = { ...payload, stories: [...payload.stories, newStory] };
    setPayload(newPayload);
    ApiService.updatePayload(newPayload);
  };

  const handleRemoveStory = (index: number) => {
    if (!payload || payload.stories.length <= 1) return;
    const updatedStories = payload.stories.filter((_, i) => i !== index);
    const newPayload = { ...payload, stories: updatedStories };
    setPayload(newPayload);
    ApiService.updatePayload(newPayload);
  };

  const handleGiftChange = (index: number, field: keyof DigitalGiftSlot, value: string) => {
    if (!payload) return;
    const updatedGifts = [...payload.gifts];
    updatedGifts[index] = { ...updatedGifts[index], [field]: value };
    const newPayload = { ...payload, gifts: updatedGifts };
    setPayload(newPayload);
    ApiService.updatePayload(newPayload);
  };

  const handleUploadMedia = async () => {
    if (!uploadFileName.trim()) return;
    setIsUploading(true);
    try {
      await ApiService.uploadAndOptimizeMedia(uploadFileName);
      const updated = await ApiService.getInvitationBySlug('elyana-syahril');
      setPayload(updated);
      setUploadFileName('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSimulatePaymentWebhook = async (targetStatus: 'settlement' | 'pending') => {
    if (!payload) return;
    setIsProcessingPayment(true);
    setPaymentNotice(null);
    try {
      const res = await ApiService.processPaymentWebhook(payload.invitation.id, targetStatus);
      setPaymentNotice(res.message);
      const updated = await ApiService.getInvitationBySlug(payload.invitation.slug);
      setPayload(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!payload) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-coklat-950 text-gold-400">
        <p>Memuat Client Dashboard CMS Light-Version...</p>
      </div>
    );
  }

  const isWatermarkActive = payload.invitation.status_payment === 'pending';
  const totalRSVP = payload.interactions.length;
  const attendingCount = payload.interactions.filter((i) => i.attendance_status === 'Datang').length;

  return (
    <div className="min-h-screen bg-coklat-950 text-coklat-100 flex flex-col font-sans">
      
      {/* DASHBOARD HEADER */}
      <header className="bg-coklat-900/90 border-b border-gold-500/20 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gold-gradient text-coklat-950 font-bold">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-base text-gold-200">CMS Light-Version Dashboard</h1>
            <p className="text-xs text-coklat-400">Figma Overlay CMS: {payload.couple.bride_name.split(' ')[0]} & {payload.couple.groom_name.split(' ')[0]}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-coklat-950 p-1 rounded-xl border border-gold-500/20 text-xs">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`px-3 py-1 rounded-lg transition-colors ${previewDevice === 'mobile' ? 'bg-gold-500 text-coklat-950 font-bold' : 'text-coklat-300'}`}
            >
              Mobile View (390px)
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`px-3 py-1 rounded-lg transition-colors ${previewDevice === 'desktop' ? 'bg-gold-500 text-coklat-950 font-bold' : 'text-coklat-300'}`}
            >
              Desktop View
            </button>
          </div>

          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
            isWatermarkActive
              ? 'bg-rose-950 border-rose-500/40 text-rose-300'
              : 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isWatermarkActive ? 'Status: Pending (Watermark Demo Aktif)' : 'Status: Settlement (Watermark Off)'}
          </span>
        </div>
      </header>

      {/* WORKSPACE MAIN SPLIT SCREEN */}
      <div className="flex-1 grid lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT PANEL: CRUD FORMS & REPEATERS */}
        <div className="lg:col-span-6 p-6 overflow-y-auto max-h-[calc(100vh-65px)] border-r border-gold-500/20 space-y-6">
          
          {/* TABS */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
            {[
              { id: 'couple', label: 'Mempelai', icon: Users },
              { id: 'events', label: 'Acara', icon: Calendar },
              { id: 'stories', label: 'Love Story Repeater', icon: Heart },
              { id: 'gifts', label: 'Love Gift Multi-Slot', icon: Gift },
              { id: 'media', label: 'Media Pipeline', icon: ImageIcon },
              { id: 'generator', label: 'Link WA Generator', icon: Share2 },
              { id: 'analytics', label: 'RSVP Tracker', icon: MessageSquare },
              { id: 'payment', label: 'Midtrans Webhook', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-gold-gradient text-coklat-950 shadow-gold-glow'
                      : 'bg-coklat-900/60 text-coklat-300 hover:bg-coklat-850 border border-gold-500/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: MEMPELAI */}
          {activeTab === 'couple' && (
            <div className="glass-card p-6 rounded-2xl border border-gold-500/30 space-y-4">
              <h2 className="text-sm font-bold text-gold-300">Form Mempelai (Elyana & Syahril)</h2>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-coklat-300 mb-1">Mempelai Wanita</label>
                  <input
                    type="text"
                    value={payload.couple.bride_name}
                    onChange={(e) => handleCoupleChange('bride_name', e.target.value)}
                    className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-coklat-300 mb-1">Orang Tua Wanita</label>
                  <input
                    type="text"
                    value={payload.couple.bride_parents}
                    onChange={(e) => handleCoupleChange('bride_parents', e.target.value)}
                    className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-coklat-300 mb-1">Mempelai Pria</label>
                  <input
                    type="text"
                    value={payload.couple.groom_name}
                    onChange={(e) => handleCoupleChange('groom_name', e.target.value)}
                    className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-coklat-300 mb-1">Orang Tua Pria</label>
                  <input
                    type="text"
                    value={payload.couple.groom_parents}
                    onChange={(e) => handleCoupleChange('groom_parents', e.target.value)}
                    className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-coklat-300 mb-1">Teks Kutipan Ayat (QS. Ar-Rum: 21)</label>
                <textarea
                  rows={3}
                  value={payload.couple.quote_text || ''}
                  onChange={(e) => handleCoupleChange('quote_text', e.target.value)}
                  className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {payload.events.map((evt, idx) => (
                <div key={evt.id} className="glass-card p-6 rounded-2xl border border-gold-500/30 space-y-3">
                  <h3 className="text-xs font-bold text-gold-300 uppercase">Acara {evt.event_type}</h3>
                  <div>
                    <label className="block text-[10px] text-coklat-300 mb-1">Lokasi Acara</label>
                    <input
                      type="text"
                      value={evt.location_name}
                      onChange={(e) => handleEventChange(idx, 'location_name', e.target.value)}
                      className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-coklat-300 mb-1">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={evt.address}
                      onChange={(e) => handleEventChange(idx, 'address', e.target.value)}
                      className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: LOVE STORY REPEATER */}
          {activeTab === 'stories' && (
            <div className="glass-card p-6 rounded-2xl border border-gold-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gold-300">Love Story Repeater Field</h2>
                <button
                  onClick={handleAddStory}
                  className="px-3 py-1.5 rounded-xl bg-gold-gradient text-coklat-950 text-xs font-bold flex items-center gap-1 hover:shadow-gold-glow"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Cerita
                </button>
              </div>

              {payload.stories.map((st, idx) => (
                <div key={st.id} className="p-4 bg-coklat-950/80 rounded-xl border border-gold-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gold-400">Story #{idx + 1}</span>
                    {payload.stories.length > 1 && (
                      <button
                        onClick={() => handleRemoveStory(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => handleStoryChange(idx, 'title', e.target.value)}
                    placeholder="Judul Story (contoh: Awal Bertemu)"
                    className="w-full bg-coklat-900 border border-gold-500/20 rounded-lg px-3 py-1.5 text-xs text-gold-100"
                  />
                  <textarea
                    rows={2}
                    value={st.narrative}
                    onChange={(e) => handleStoryChange(idx, 'narrative', e.target.value)}
                    placeholder="Teks Narasi Story..."
                    className="w-full bg-coklat-900 border border-gold-500/20 rounded-lg px-3 py-1.5 text-xs text-coklat-200 resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: LOVE GIFT MULTI-SLOT */}
          {activeTab === 'gifts' && (
            <div className="glass-card p-6 rounded-2xl border border-gold-500/30 space-y-4">
              <h2 className="text-sm font-bold text-gold-300">Love Gift Multi-Slot Manager</h2>
              
              {/* SLOT 1: BANK */}
              <div className="p-4 bg-coklat-950/80 rounded-xl border border-gold-500/20 space-y-2">
                <span className="text-xs font-bold text-gold-400 block">Slot 1: Transfer Bank</span>
                <input
                  type="text"
                  value={payload.gifts[0]?.bank_name || ''}
                  onChange={(e) => handleGiftChange(0, 'bank_name', e.target.value)}
                  placeholder="Nama Bank (e.g. Bank Mandiri)"
                  className="w-full bg-coklat-900 border border-gold-500/20 rounded-lg px-3 py-1.5 text-xs text-gold-100"
                />
                <input
                  type="text"
                  value={payload.gifts[0]?.account_number || ''}
                  onChange={(e) => handleGiftChange(0, 'account_number', e.target.value)}
                  placeholder="Nomor Rekening (e.g. 123123123)"
                  className="w-full bg-coklat-900 border border-gold-500/20 rounded-lg px-3 py-1.5 text-xs text-gold-100 font-mono"
                />
              </div>

              {/* SLOT 2: PHYSICAL ADDRESS */}
              <div className="p-4 bg-coklat-950/80 rounded-xl border border-gold-500/20 space-y-2">
                <span className="text-xs font-bold text-gold-400 block">Slot 2: Alamat Kirim Kado Fisik</span>
                <textarea
                  rows={2}
                  value={payload.gifts[1]?.address || ''}
                  onChange={(e) => handleGiftChange(1, 'address', e.target.value)}
                  placeholder="Alamat Pengiriman Kado..."
                  className="w-full bg-coklat-900 border border-gold-500/20 rounded-lg px-3 py-1.5 text-xs text-coklat-200 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA SLOT MANAGER & PIPELINE OPTIMIZATION */}
          {activeTab === 'media' && (
            <div className="glass-card p-6 rounded-2xl border border-gold-500/30 space-y-4">
              <h2 className="text-sm font-bold text-gold-300">Media Pipeline (.WebP Auto-Convert & 1200px Capping)</h2>
              
              <div className="p-4 bg-coklat-950/80 rounded-xl border border-gold-500/20 space-y-3">
                <label className="block text-xs text-coklat-300">Unggah Gambar Galeri (.jpg / .png)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    placeholder="Nama file foto (contoh: foto_prewed.jpg)"
                    className="flex-1 bg-coklat-900 border border-gold-500/20 rounded-xl px-3 py-2 text-xs text-gold-100"
                  />
                  <button
                    onClick={handleUploadMedia}
                    disabled={isUploading}
                    className="px-4 py-2 bg-gold-gradient text-coklat-950 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:shadow-gold-glow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {isUploading ? 'Converting...' : 'Process WebP'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-coklat-300">Hasil Optimasi Pipeline ({payload.media_gallery.length})</h3>
                {payload.media_gallery.map((img, i) => (
                  <div key={i} className="p-3 bg-coklat-950/60 rounded-xl text-xs space-y-1 border border-gold-500/10">
                    <div className="flex justify-between font-bold text-gold-300">
                      <span>{img.original_name} ➔ .WebP</span>
                      <span className="text-emerald-400 font-mono">{img.file_size_kb} KB (&lt; 500KB)</span>
                    </div>
                    <p className="text-[10px] text-coklat-400 font-mono">Srcset: {img.srcset}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LINK WA GENERATOR */}
          {activeTab === 'generator' && (
            <div className="glass-card-gold p-6 rounded-2xl border border-gold-500/40 space-y-4">
              <h2 className="text-sm font-bold text-gold-300">Link Guest Generator (URL Slug & WA Draft)</h2>
              <div>
                <label className="block text-xs text-coklat-200 mb-1">Nama Tamu Undangan</label>
                <input
                  type="text"
                  value={guestNameInput}
                  onChange={(e) => handleGuestNameChange(e.target.value)}
                  className="w-full bg-coklat-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl}
                  className="flex-1 bg-coklat-950 border border-gold-500/20 rounded-xl px-3 py-2 text-xs text-gold-300 font-mono"
                />
                <button
                  onClick={() => copyToClipboard(generatedUrl)}
                  className="p-2 bg-gold-gradient text-coklat-950 rounded-xl text-xs font-bold"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Buka WA & Kirim Tautan
              </a>
            </div>
          )}

          {/* TAB 7: RSVP TRACKER */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-4 rounded-xl text-center">
                  <span className="text-xs text-coklat-300">Total Respons</span>
                  <span className="text-2xl font-bold text-gold-300 block mt-1">{totalRSVP}</span>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <span className="text-xs text-coklat-300">Konfirmasi Hadir</span>
                  <span className="text-2xl font-bold text-emerald-400 block mt-1">{attendingCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MIDTRANS WEBHOOK SIMULATOR */}
          {activeTab === 'payment' && (
            <div className="glass-card-gold p-6 rounded-2xl border border-gold-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-coklat-300 uppercase">Payment State Machine</span>
                  <h3 className="text-lg font-bold text-gold-300">Midtrans / Xendit Webhook Trigger</h3>
                </div>
                <Sparkles className="w-6 h-6 text-gold-400" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSimulatePaymentWebhook('settlement')}
                  disabled={isProcessingPayment}
                  className="py-3 px-4 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-colors shadow-lg"
                >
                  Trigger Settlement (Hapus Watermark)
                </button>

                <button
                  onClick={() => handleSimulatePaymentWebhook('pending')}
                  disabled={isProcessingPayment}
                  className="py-3 px-4 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-500 transition-colors shadow-lg"
                >
                  Trigger Pending (Aktifkan Watermark)
                </button>
              </div>

              {paymentNotice && (
                <div className="p-3 bg-coklat-950 border border-gold-500/30 text-gold-300 text-xs rounded-xl text-center">
                  {paymentNotice}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT PANEL: LIVE WYSIWYG PREVIEW */}
        <div className="lg:col-span-6 p-6 bg-coklat-950 flex flex-col items-center justify-start overflow-hidden">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs text-gold-400 font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4" />
              WYSIWYG Live Preview ({previewDevice})
            </span>
            <span className="text-[10px] text-coklat-400">Layered Overlay base 390px viewport</span>
          </div>

          <div className={`w-full transition-all duration-300 overflow-y-auto rounded-3xl border border-gold-500/30 shadow-luxury ${
            previewDevice === 'mobile' ? 'max-w-[420px] h-[750px] ring-8 ring-coklat-900' : 'w-full h-[750px]'
          }`}>
            <PublicInvitation
              initialPayload={payload}
              guestNameOverride={guestNameInput}
              isLivePreview={true}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
