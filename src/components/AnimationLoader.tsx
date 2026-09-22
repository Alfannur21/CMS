import React, { useState } from 'react';
import { Heart } from 'lucide-react';

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
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center transition-all duration-700 ${
        isOpening ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="relative z-10 max-w-sm w-full bg-white p-8 rounded-3xl border border-gray-200 shadow-minimal-lg flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-medium mb-3">
          The Wedding Invitation
        </span>

        <h1 className="font-serif text-3xl font-normal text-gray-900 my-2">
          {brideName.split(' ')[0]} & {groomName.split(' ')[0]}
        </h1>

        <div className="w-12 h-[1px] bg-gray-300 my-4" />

        <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 my-4">
          <p className="text-[11px] text-gray-500 mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
          <h2 className="text-base font-semibold text-gray-900 capitalize">{guestName}</h2>
        </div>

        <p className="text-[11px] text-gray-600 italic mb-6 leading-relaxed">
          "Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dan memberikan doa restu."
        </p>

        <button
          onClick={handleClickOpen}
          className="w-full py-3 px-6 rounded-full bg-gray-900 text-white font-medium tracking-wide hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 text-xs shadow-minimal"
        >
          <Heart className="w-3.5 h-3.5 fill-white" />
          BUKA UNDANGAN
        </button>
      </div>
    </div>
  );
};
