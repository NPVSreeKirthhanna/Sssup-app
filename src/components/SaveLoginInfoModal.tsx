import React from 'react';
import { BookmarkCheck, Shield, Lock, X } from 'lucide-react';

interface Props {
  displayName: string;
  avatarUrl: string;
  onConfirmSaveInfo: () => void;
  onSkipSaveInfo: () => void;
}

export const SaveLoginInfoModal: React.FC<Props> = ({
  displayName,
  avatarUrl,
  onConfirmSaveInfo,
  onSkipSaveInfo,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1f2c34] text-slate-100 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col p-6 space-y-5 text-center">
        {/* User DP Badge */}
        <div className="relative mx-auto">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-20 h-20 rounded-full object-cover border-4 border-[#00a884] shadow-xl mx-auto"
          />
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#00a884] text-slate-950 font-bold shadow-md">
            <BookmarkCheck className="w-4 h-4" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-100">Save Your Login Info?</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed px-2">
            We can save your Ssupp login credentials for <strong className="text-slate-200">{displayName}</strong> on this browser so you won't need to re-login next time.
          </p>
        </div>

        {/* Info Pill */}
        <div className="p-3 rounded-2xl bg-[#111b21] border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2 text-left">
          <Shield className="w-4 h-4 text-[#00a884] shrink-0" />
          <span>Your Web Crypto E2EE keys remain securely stored in this browser session.</span>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onConfirmSaveInfo}
            className="w-full py-3 rounded-2xl bg-[#00a884] hover:bg-[#008f70] text-slate-950 font-bold text-sm shadow-lg transition-all active:scale-95"
          >
            Save Info
          </button>
          <button
            onClick={onSkipSaveInfo}
            className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};
