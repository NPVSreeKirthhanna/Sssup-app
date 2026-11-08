import React, { useState } from 'react';
import { User } from '../types';
import { UserCheck, X, Check, Bookmark, Sparkles, User as UserIcon, RotateCcw } from 'lucide-react';

interface Props {
  contactUser: User;
  currentSavedName: string;
  onSaveContactName: (customName: string) => void;
  onClose: () => void;
}

const QUICK_NICKNAME_SUGGESTIONS = [
  'Bestie ❤️',
  'Bro 👊',
  'Work 💼',
  'Family 🏡',
  'Dev Buddy 💻',
  'Gym Partner 💪',
  'Travel Mate ✈️',
];

export const EditContactNameModal: React.FC<Props> = ({
  contactUser,
  currentSavedName,
  onSaveContactName,
  onClose,
}) => {
  const [customName, setCustomName] = useState(currentSavedName || contactUser.displayName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContactName(customName.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setCustomName(contactUser.displayName);
    onSaveContactName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1f2c34] text-slate-100 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#111b21] border-b border-slate-800">
          <div className="flex items-center gap-2 text-[#00a884] font-bold text-base">
            <UserCheck className="w-5 h-5" />
            <span>Save WhatsApp Contact Name</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Contact Card Header */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#111b21] border border-slate-800">
            <img
              src={contactUser.avatarUrl}
              alt={contactUser.displayName}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#00a884] shadow-md"
            />
            <div>
              <h4 className="font-bold text-slate-100 text-base">
                {currentSavedName || contactUser.displayName}
              </h4>
              <p className="text-xs text-[#00a884] font-medium">@{contactUser.username}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Official Name: {contactUser.displayName}
              </p>
            </div>
          </div>

          {/* Saved Name Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#00a884] uppercase tracking-wider">
              Saved Contact Name (How you see them on Ssupp)
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g., Alex Bestie, Mom, Work Buddy..."
              className="w-full px-4 py-2.5 bg-[#111b21] text-slate-100 text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-[#00a884] transition-colors"
            />
            <p className="text-[11px] text-slate-400">
              Only you will see this saved contact name in your chat list and notifications.
            </p>
          </div>

          {/* Quick Tag Suggestions */}
          <div>
            <span className="text-[11px] font-semibold text-slate-300 block mb-2">
              Quick Contact Tags:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {QUICK_NICKNAME_SUGGESTIONS.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCustomName(`${contactUser.displayName.split(' ')[0]} ${tag}`)}
                  className="px-2.5 py-1 rounded-lg bg-[#111b21] hover:bg-[#00a884] hover:text-slate-950 text-slate-300 text-xs border border-slate-700 transition-all active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-700/80">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
              title="Reset to official profile name"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Name</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{savedSuccess ? 'Saved!' : 'Save Contact'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
