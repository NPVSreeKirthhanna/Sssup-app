import React from 'react';
import { AVATAR_FACE_CARDS, DEFAULT_BLANK_AVATAR } from '../utils/avatars';
import { Camera, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  selectedAvatarUrl: string;
  onSelectAvatarUrl: (url: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteAvatar: () => void;
}

export const AvatarPickerGrid: React.FC<Props> = ({
  selectedAvatarUrl,
  onSelectAvatarUrl,
  onFileUpload,
  onDeleteAvatar,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#00a884] uppercase tracking-wider">
          Choose DP Avatar (12 Cute Cartoon Faces)
        </label>

        {selectedAvatarUrl && selectedAvatarUrl !== DEFAULT_BLANK_AVATAR && (
          <button
            type="button"
            onClick={onDeleteAvatar}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            title="Delete current DP"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete DP</span>
          </button>
        )}
      </div>

      {/* Grid of 12 Face Cards + 13th Gallery Upload Card */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-56 overflow-y-auto p-2 bg-[#111b21] rounded-2xl border border-slate-700/60 shadow-inner">
        {/* 12 Face Cards */}
        {AVATAR_FACE_CARDS.map((card) => {
          const isSelected = selectedAvatarUrl === card.url;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectAvatarUrl(card.url)}
              className={`relative p-1.5 rounded-xl border flex items-center justify-center transition-all group aspect-square ${
                isSelected
                  ? 'bg-[#00a884]/20 border-[#00a884] ring-2 ring-[#00a884]/50 scale-105'
                  : 'bg-[#1f2c34]/60 border-slate-700/60 hover:bg-[#1f2c34] hover:border-slate-500'
              }`}
            >
              <img
                src={card.url}
                alt="Avatar Face Card"
                className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform drop-shadow"
              />

              {isSelected && (
                <CheckCircle2 className="absolute top-1 right-1 w-4 h-4 text-[#00a884] bg-slate-950 rounded-full shadow" />
              )}
            </button>
          );
        })}

        {/* 13th Card: Upload from Gallery / Click Selfie */}
        <label className="relative p-1.5 rounded-xl border border-dashed border-[#00a884] bg-[#00a884]/10 hover:bg-[#00a884]/25 flex flex-col items-center justify-center cursor-pointer transition-all group aspect-square">
          <Camera className="w-6 h-6 text-[#00a884] group-hover:scale-110 transition-transform mb-0.5" />
          <span className="text-[9px] text-[#00a884] font-bold text-center leading-tight">
            13. Gallery / Selfie
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={onFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
