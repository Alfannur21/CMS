import React, { useState, useEffect } from 'react';
import { CompleteLightInvitationPayload, OverlayElement } from '../types';

interface OverlayRendererProps {
  data: CompleteLightInvitationPayload;
}

export const OverlayRenderer: React.FC<OverlayRendererProps> = ({ data }) => {
  const { template, couple, events, invitation } = data;
  const overlayConfig = template.overlay_config;
  const isPendingPayment = invitation.status_payment === 'pending';

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
          <p className="max-w-[320px] text-center italic leading-relaxed px-4 text-gray-600 text-[11px]">
            {couple.quote_text}
          </p>
        );
      case 'countdown_component':
        return (
          <div className="grid grid-cols-4 gap-2 w-[310px] bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-center shadow-minimal">
            <div>
              <span className="block text-xl font-semibold font-serif text-gray-900">{timeLeft.days}</span>
              <span className="text-[9px] uppercase text-gray-500 font-medium tracking-wider">Hari</span>
            </div>
            <div>
              <span className="block text-xl font-semibold font-serif text-gray-900">{timeLeft.hours}</span>
              <span className="text-[9px] uppercase text-gray-500 font-medium tracking-wider">Jam</span>
            </div>
            <div>
              <span className="block text-xl font-semibold font-serif text-gray-900">{timeLeft.minutes}</span>
              <span className="text-[9px] uppercase text-gray-500 font-medium tracking-wider">Menit</span>
            </div>
            <div>
              <span className="block text-xl font-semibold font-serif text-gray-900">{timeLeft.seconds}</span>
              <span className="text-[9px] uppercase text-gray-500 font-medium tracking-wider">Detik</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-[390px] mx-auto min-h-[844px] bg-white overflow-hidden shadow-minimal-lg border border-gray-200 rounded-3xl">
      
      {/* 1. BASE IMAGE LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={template.base_image_url}
          alt={template.name}
          className="w-full h-full object-cover filter brightness-[0.97] opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white" />
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
              color: elem.color || '#111827',
            }}
            className="whitespace-nowrap transition-all duration-300"
          >
            {renderElementContent(elem)}
          </div>
        ))}
      </div>

      {/* 3. WATERMARK STATE MACHINE OVERLAY */}
      {isPendingPayment && (
        <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between p-4 bg-gray-900/5 backdrop-blur-[1px] border-2 border-dashed border-gray-400">
          <div className="bg-gray-900 text-white text-center py-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest rounded-md shadow-minimal">
            DEMO / UNPAID WATERMARK - UNDANGANQU
          </div>
          <div className="bg-white/95 text-gray-700 text-center py-2 px-3 text-[10px] font-medium rounded-xl border border-gray-300 shadow-minimal">
            Selesaikan pembayaran untuk menghapus watermark.
          </div>
        </div>
      )}

    </div>
  );
};
