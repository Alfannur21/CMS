import React, { useState, useEffect } from 'react';
import { CompleteLightInvitationPayload, OverlayElement } from '../types';
import { Sparkles, Calendar, Clock, MapPin, Heart } from 'lucide-react';

interface OverlayRendererProps {
  data: CompleteLightInvitationPayload;
}

export const OverlayRenderer: React.FC<OverlayRendererProps> = ({ data }) => {
  const { template, couple, events, invitation } = data;
  const overlayConfig = template.overlay_config;
  const isPendingPayment = invitation.status_payment === 'pending';

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!events[0]?.start_time) return;
    const targetDate = new Date(events[0].start_time).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const renderElementContent = (elem: OverlayElement) => {
    switch (elem.content_key) {
      case 'header_text':
        return 'The Wedding Invitation';
      case 'bride_name':
        return couple.bride_name;
      case 'ampersand':
        return '&';
      case 'groom_name':
        return couple.groom_name;
      case 'quote_ar_rum':
        return (
          <p className="max-w-[320px] text-center italic leading-relaxed px-4 text-coklat-200 text-[10px]">
            {couple.quote_text}
          </p>
        );
      case 'countdown_component':
        return (
          <div className="grid grid-cols-4 gap-2 w-[310px] glass-card-gold p-3 rounded-2xl border border-gold-500/40 text-center shadow-gold-glow">
            <div>
              <span className="block text-xl font-bold font-serif text-gold-300">{timeLeft.days}</span>
              <span className="text-[9px] uppercase text-coklat-300">Hari</span>
            </div>
            <div>
              <span className="block text-xl font-bold font-serif text-gold-300">{timeLeft.hours}</span>
              <span className="text-[9px] uppercase text-coklat-300">Jam</span>
            </div>
            <div>
              <span className="block text-xl font-bold font-serif text-gold-300">{timeLeft.minutes}</span>
              <span className="text-[9px] uppercase text-coklat-300">Menit</span>
            </div>
            <div>
              <span className="block text-xl font-bold font-serif text-gold-300">{timeLeft.seconds}</span>
              <span className="text-[9px] uppercase text-coklat-300">Detik</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-[390px] mx-auto min-h-[844px] bg-coklat-950 overflow-hidden shadow-luxury border border-gold-500/30 rounded-3xl">
      
      {/* 1. FIGMA STATIC BASE IMAGE LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={template.base_image_url}
          alt={template.name}
          className="w-full h-full object-cover filter contrast-[1.05] brightness-90 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coklat-950/80 via-transparent to-coklat-950/90" />
      </div>

      {/* 2. DYNAMIC PERCENTAGE OVERLAY LAYERS */}
      <div className="relative z-10 w-full h-[844px]">
        {overlayConfig.elements.map((elem) => (
          <div
            key={elem.id}
            style={{
              position: 'absolute',
              top: elem.top,
              left: elem.left,
              transform: elem.transform || 'none',
              fontFamily: elem.font_family || 'inherit',
              fontSize: elem.font_size || 'inherit',
              color: elem.color || 'inherit',
            }}
            className="whitespace-nowrap transition-all duration-300"
          >
            {renderElementContent(elem)}
          </div>
        ))}
      </div>

      {/* 3. WATERMARK STATE MACHINE OVERLAY */}
      {isPendingPayment && (
        <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between p-4 bg-rose-950/20 backdrop-blur-[1px] border-4 border-dashed border-rose-500/50">
          <div className="bg-rose-600 text-white text-center py-1.5 px-3 text-[11px] font-bold uppercase tracking-widest shadow-lg rotate-[-2deg]">
            ⚠️ DEMO / UNPAID WATERMARK - UNDANGANQU SAAS
          </div>
          <div className="bg-rose-900/90 text-rose-200 text-center py-2 px-4 text-[10px] font-medium rounded-xl border border-rose-500/40">
            Selesaikan pembayaran via Midtrans untuk menghapus watermark ini secara otomatis.
          </div>
        </div>
      )}

    </div>
  );
};
