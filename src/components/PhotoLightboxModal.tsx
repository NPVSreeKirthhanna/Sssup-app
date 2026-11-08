import React from 'react';
import { X, Download, ZoomIn } from 'lucide-react';

interface Props {
  imageUrl: string;
  caption?: string;
  onClose: () => void;
}

export const PhotoLightboxModal: React.FC<Props> = ({ imageUrl, caption, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative max-w-5xl max-h-[95vh] flex flex-col items-center justify-center">
        {/* Top Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <a
            href={imageUrl}
            download="ssupp_photo.jpg"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors"
            title="Download Image"
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        <img
          src={imageUrl}
          alt={caption || 'Photo'}
          className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
        />

        {caption && (
          <div className="mt-4 px-6 py-2 rounded-full bg-slate-900/90 text-slate-200 text-sm font-medium border border-slate-800 max-w-xl text-center">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};
