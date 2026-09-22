import React, { useState, useEffect } from 'react';
import { CompleteLightInvitationPayload, Couple, EventDetail, LoveStoryItem, DigitalGiftSlot, OverlayElement, MediaOverlayType, MixBlendMode } from '../types';
import { ApiService } from '../services/apiService';
import { PublicInvitation } from './PublicInvitation';
import { 
  Users, Calendar, Heart, Gift, MessageSquare, CreditCard, 
  Share2, Eye, CheckCircle2, Copy, ExternalLink, Plus, Trash2, Layout, Upload, Image as ImageIcon, Film
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const [payload, setPayload] = useState<CompleteLightInvitationPayload | null>(null);
  const [activeTab, setActiveTab] = useState<'couple' | 'events' | 'stories' | 'gifts' | 'overlay_media' | 'media' | 'generator' | 'analytics' | 'payment'>('couple');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  const [guestNameInput, setGuestNameInput] = useState('Budi Santoso');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const [uploadFileName, setUploadFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

  // MEDIA OVERLAY EDITOR LOGIC (.gif, .webp, .mp4)
  const handleOverlayMediaChange = (id: string, field: keyof OverlayElement, value: any) => {
    if (!payload) return;
    const updatedElements = payload.template.overlay_config.elements.map((elem) => {
      if (elem.id === id) {
        return { ...elem, [field]: value };
      }
      return elem;
    });

    const newTemplate = {
      ...payload.template,
      overlay_config: { ...payload.template.overlay_config, elements: updatedElements },
    };
    const newPayload = { ...payload, template: newTemplate };
    setPayload(newPayload);
    ApiService.updatePayload(newPayload);
  };

  const handleAddMediaOverlay = () => {
    if (!payload) return;
    const newMediaElement: OverlayElement = {
      id: 'media_overlay_' + Math.random().toString(36).substring(2, 7),
      type: 'media_overlay',
      media_type: 'gif',
      media_url: 'https://media.giphy.com/media/l0HlHJGHe3yAMhdQY/giphy.gif',
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '300px',
      opacity: 0.2,
      blend_mode: 'multiply',
    };

    const newElements = [...payload.template.overlay_config.elements, newMediaElement];
    const newTemplate = {
      ...payload.template,
      overlay_config: { ...payload.template.overlay_config, elements: newElements },
    };
    const newPayload = { ...payload, template: newTemplate };
    setPayload(newPayload);
    ApiService.updatePayload(newPayload);
  };

  const handleRemoveMediaOverlay = (id: string) => {
    if (!payload) return;
    const newElements = payload.template.overlay_config.elements.filter((e) => e.id !== id);
    const newTemplate = {
      ...payload.template,
      overlay_config: { ...payload.template.overlay_config, elements: newElements },
    };
    const newPayload = { ...payload, template: newTemplate };
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
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-700">
        <p>Memuat Dashboard...</p>
      </div>
    );
  }

  const isWatermarkActive = payload.invitation.status_payment === 'pending';
  const totalRSVP = payload.interactions.length;
  const attendingCount = payload.interactions.filter((i) => i.attendance_status === 'Datang').length;
  const mediaOverlayElements = payload.template.overlay_config.elements.filter((e) => e.type === 'media_overlay');

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      
      {/* DASHBOARD HEADER */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-minimal">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gray-900 text-white">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-gray-900">Client Dashboard & Live Preview</h1>
            <p className="text-xs text-gray-500">{payload.couple.bride_name.split(' ')[0]} & {payload.couple.groom_name.split(' ')[0]}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${previewDevice === 'mobile' ? 'bg-white text-gray-900 shadow-minimal font-semibold' : 'text-gray-600'}`}
            >
              Mobile View (390px)
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${previewDevice === 'desktop' ? 'bg-white text-gray-900 shadow-minimal font-semibold' : 'text-gray-600'}`}
            >
              Desktop View
            </button>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${
            isWatermarkActive
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isWatermarkActive ? 'Status: Pending (Watermark Demo)' : 'Status: Settlement (Watermark Off)'}
          </span>
        </div>
      </header>

      {/* WORKSPACE MAIN SPLIT SCREEN */}
      <div className="flex-1 grid lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT PANEL: CRUD FORMS & REPEATERS */}
        <div className="lg:col-span-6 p-6 overflow-y-auto max-h-[calc(100vh-60px)] border-r border-gray-200 space-y-6">
          
          {/* TABS */}
          <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-none">
            {[
              { id: 'couple', label: 'Mempelai', icon: Users },
              { id: 'events', label: 'Acara', icon: Calendar },
              { id: 'stories', label: 'Love Story', icon: Heart },
              { id: 'gifts', label: 'Love Gift', icon: Gift },
              { id: 'overlay_media', label: 'Media Overlay (.gif/.webp/.mp4)', icon: Film },
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
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white shadow-minimal'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">Form Data Mempelai</h2>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Mempelai Wanita</label>
                  <input
                    type="text"
                    value={payload.couple.bride_name}
                    onChange={(e) => handleCoupleChange('bride_name', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Orang Tua Wanita</label>
                  <input
                    type="text"
                    value={payload.couple.bride_parents}
                    onChange={(e) => handleCoupleChange('bride_parents', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Mempelai Pria</label>
                  <input
                    type="text"
                    value={payload.couple.groom_name}
                    onChange={(e) => handleCoupleChange('groom_name', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Orang Tua Pria</label>
                  <input
                    type="text"
                    value={payload.couple.groom_parents}
                    onChange={(e) => handleCoupleChange('groom_parents', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-600 mb-1">Teks Kutipan Ayat (QS. Ar-Rum: 21)</label>
                <textarea
                  rows={3}
                  value={payload.couple.quote_text || ''}
                  onChange={(e) => handleCoupleChange('quote_text', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {payload.events.map((evt, idx) => (
                <div key={evt.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-3">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase">Acara {evt.event_type}</h3>
                  <div>
                    <label className="block text-[10px] text-gray-600 mb-1">Lokasi Acara</label>
                    <input
                      type="text"
                      value={evt.location_name}
                      onChange={(e) => handleEventChange(idx, 'location_name', e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-600 mb-1">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={evt.address}
                      onChange={(e) => handleEventChange(idx, 'address', e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: LOVE STORY REPEATER */}
          {activeTab === 'stories' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Love Story Repeater</h2>
                <button
                  onClick={handleAddStory}
                  className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-medium flex items-center gap-1 hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Cerita
                </button>
              </div>

              {payload.stories.map((st, idx) => (
                <div key={st.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900">Story #{idx + 1}</span>
                    {payload.stories.length > 1 && (
                      <button
                        onClick={() => handleRemoveStory(idx)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => handleStoryChange(idx, 'title', e.target.value)}
                    placeholder="Judul Story"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={st.narrative}
                    onChange={(e) => handleStoryChange(idx, 'narrative', e.target.value)}
                    placeholder="Teks Narasi Story..."
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: LOVE GIFT MULTI-SLOT */}
          {activeTab === 'gifts' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">Love Gift Multi-Slot Manager</h2>
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs font-semibold text-gray-900 block">Slot 1: Transfer Bank</span>
                <input
                  type="text"
                  value={payload.gifts[0]?.bank_name || ''}
                  onChange={(e) => handleGiftChange(0, 'bank_name', e.target.value)}
                  placeholder="Nama Bank"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900"
                />
                <input
                  type="text"
                  value={payload.gifts[0]?.account_number || ''}
                  onChange={(e) => handleGiftChange(0, 'account_number', e.target.value)}
                  placeholder="Nomor Rekening"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-mono"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs font-semibold text-gray-900 block">Slot 2: Alamat Kirim Kado Fisik</span>
                <textarea
                  rows={2}
                  value={payload.gifts[1]?.address || ''}
                  onChange={(e) => handleGiftChange(1, 'address', e.target.value)}
                  placeholder="Alamat Pengiriman Kado..."
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA OVERLAY ENGINE (.gif, .webp, .mp4) */}
          {activeTab === 'overlay_media' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-gray-700" />
                    Media Overlay Manager (.gif / .webp / .mp4)
                  </h2>
                  <p className="text-[11px] text-gray-500">Atur animasi partikel, stiker .gif/.webp, atau video loop .mp4 sebagai lapisan overlay.</p>
                </div>
                <button
                  onClick={handleAddMediaOverlay}
                  className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-medium flex items-center gap-1 hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Overlay
                </button>
              </div>

              {mediaOverlayElements.length === 0 ? (
                <p className="text-xs text-gray-500 italic p-4 bg-gray-50 rounded-xl text-center">Belum ada animasi overlay. Klik "Tambah Overlay" untuk memasukkan .gif, .webp, atau .mp4.</p>
              ) : (
                <div className="space-y-4">
                  {mediaOverlayElements.map((elem, idx) => (
                    <div key={elem.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-900">Media Overlay #{idx + 1}</span>
                        <button
                          onClick={() => handleRemoveMediaOverlay(elem.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-600 mb-1">Format Media</label>
                          <select
                            value={elem.media_type || 'gif'}
                            onChange={(e) => handleOverlayMediaChange(elem.id, 'media_type', e.target.value as MediaOverlayType)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none"
                          >
                            <option value="gif">GIF (.gif)</option>
                            <option value="webp">WebP Animasi (.webp)</option>
                            <option value="mp4">Video Loop (.mp4)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-600 mb-1">Mode Blend CSS</label>
                          <select
                            value={elem.blend_mode || 'normal'}
                            onChange={(e) => handleOverlayMediaChange(elem.id, 'blend_mode', e.target.value as MixBlendMode)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none"
                          >
                            <option value="normal">Normal</option>
                            <option value="multiply">Multiply (Sembunyikan Putih)</option>
                            <option value="screen">Screen (Sembunyikan Hitam)</option>
                            <option value="overlay">Overlay</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-600 mb-1">URL File Animasi (.gif / .webp / .mp4)</label>
                        <input
                          type="text"
                          value={elem.media_url || ''}
                          onChange={(e) => handleOverlayMediaChange(elem.id, 'media_url', e.target.value)}
                          placeholder="Masukkan URL file .gif, .webp, atau .mp4"
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-mono focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-gray-600 mb-1">Posisi Top (%)</label>
                          <input
                            type="text"
                            value={elem.top || '0%'}
                            onChange={(e) => handleOverlayMediaChange(elem.id, 'top', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-600 mb-1">Lebar (px / %)</label>
                          <input
                            type="text"
                            value={elem.width || '100%'}
                            onChange={(e) => handleOverlayMediaChange(elem.id, 'width', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-600 mb-1">Opacity (0.1-1.0)</label>
                          <input
                            type="number"
                            step="0.05"
                            min="0"
                            max="1"
                            value={elem.opacity !== undefined ? elem.opacity : 1}
                            onChange={(e) => handleOverlayMediaChange(elem.id, 'opacity', parseFloat(e.target.value))}
                            className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: MEDIA PIPELINE */}
          {activeTab === 'media' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">Media Pipeline (.WebP Auto-Convert)</h2>
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <label className="block text-xs text-gray-600">Unggah Gambar Galeri (.jpg / .png)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    placeholder="Nama file (e.g. foto_prewed.jpg)"
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900"
                  />
                  <button
                    onClick={handleUploadMedia}
                    disabled={isUploading}
                    className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 hover:bg-gray-800 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {isUploading ? 'Converting...' : 'Process WebP'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-700">Hasil Optimasi Pipeline ({payload.media_gallery.length})</h3>
                {payload.media_gallery.map((img, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 border border-gray-200">
                    <div className="flex justify-between font-medium text-gray-900">
                      <span>{img.original_name} ➔ .WebP</span>
                      <span className="text-emerald-700 font-mono">{img.file_size_kb} KB (&lt; 500KB)</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono">Srcset: {img.srcset}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: LINK WA GENERATOR */}
          {activeTab === 'generator' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">Link Guest Generator (URL & WA Draft)</h2>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Nama Tamu Undangan</label>
                <input
                  type="text"
                  value={guestNameInput}
                  onChange={(e) => handleGuestNameChange(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 font-mono"
                />
                <button
                  onClick={() => copyToClipboard(generatedUrl)}
                  className="p-2 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-gray-800 transition-colors"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Buka WA & Kirim Tautan
              </a>
            </div>
          )}

          {/* TAB 8: RSVP TRACKER */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-minimal text-center">
                  <span className="text-xs text-gray-500">Total Respons</span>
                  <span className="text-2xl font-bold text-gray-900 block mt-1">{totalRSVP}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-minimal text-center">
                  <span className="text-xs text-gray-500">Konfirmasi Hadir</span>
                  <span className="text-2xl font-bold text-emerald-700 block mt-1">{attendingCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: MIDTRANS WEBHOOK SIMULATOR */}
          {activeTab === 'payment' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 uppercase">Payment State Machine</span>
                  <h3 className="text-base font-semibold text-gray-900">Midtrans Webhook Simulator</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSimulatePaymentWebhook('settlement')}
                  disabled={isProcessingPayment}
                  className="py-3 px-4 bg-gray-900 text-white font-medium text-xs rounded-xl hover:bg-gray-800 transition-colors shadow-minimal"
                >
                  Trigger Settlement (Watermark Off)
                </button>

                <button
                  onClick={() => handleSimulatePaymentWebhook('pending')}
                  disabled={isProcessingPayment}
                  className="py-3 px-4 bg-gray-100 text-gray-800 border border-gray-300 font-medium text-xs rounded-xl hover:bg-gray-200 transition-colors shadow-minimal"
                >
                  Trigger Pending (Watermark On)
                </button>
              </div>

              {paymentNotice && (
                <div className="p-3 bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-xl text-center">
                  {paymentNotice}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT PANEL: LIVE WYSIWYG PREVIEW */}
        <div className="lg:col-span-6 p-6 bg-gray-50 flex flex-col items-center justify-start overflow-hidden border-l border-gray-200">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs text-gray-700 font-medium flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              WYSIWYG Live Preview ({previewDevice})
            </span>
            <span className="text-[10px] text-gray-400">Viewport 390px minimal white</span>
          </div>

          <div className={`w-full transition-all duration-300 overflow-y-auto rounded-3xl border border-gray-200 shadow-minimal-lg ${
            previewDevice === 'mobile' ? 'max-w-[420px] h-[750px] ring-8 ring-gray-200' : 'w-full h-[750px]'
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
