import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface AnimationLoaderProps {
  guestName: string;
  brideName: string;
  groomName: string;
  onOpen: () => void;
}

export const AnimationLoader: React.FC<AnimationLoaderProps> = ({
  guestName,
  brideName,
  groomName,
  onOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClickOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 600); // 600ms CSS fade-out transition duration
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-luxury p-6 text-center transition-all duration-700 ${
        isOpening ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Background WebP/GIF Animation Overlay */}
      <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200"
          alt="Opening Animation Loader"
          className="w-full h-full object-cover filter blur-sm scale-105 animate-pulse-slow"
        />
      </div>

      <div className="relative z-10 max-w-sm w-full glass-card-gold p-8 rounded-3xl border border-gold-500/40 shadow-luxury flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-gold-gradient/20 border border-gold-400/40 flex items-center justify-center mb-4 animate-bounce">
          <Sparkles className="w-6 h-6 text-gold-400" />
        </div>

        <span className="text-[10px] uppercase tracking-[0.3em] text-gold-300 font-semibold mb-2">
          The Wedding Invitation
        </span>

        <h1 className="font-serif text-3xl font-bold text-gold-gradient my-2">
          {brideName.split(' ')[0]} & {groomName.split(' ')[0]}
        </h1>

        <div className="w-16 h-[1px] bg-gold-400/40 my-3" />

        <div className="w-full bg-coklat-950/70 p-4 rounded-2xl border border-gold-500/20 my-4">
          <p className="text-[11px] text-coklat-300 mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
          <h2 className="text-lg font-bold text-gold-200 capitalize">{guestName}</h2>
        </div>

        <p className="text-[11px] text-coklat-200 italic mb-6">
          "Tanpa mengurangi rasa hormat, kami mengundang Anda untuk merayakan kebahagiaan kami."
        </p>

        <button
          onClick={handleClickOpen}
          className="w-full py-3.5 px-6 rounded-full bg-gold-gradient text-coklat-950 font-bold tracking-wider hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 text-xs shadow-lg"
        >
          <Heart className="w-4 h-4 fill-coklat-950" />
          BUKA UNDANGAN (/open)
        </button>
      </div>
    </div>
  );
};
