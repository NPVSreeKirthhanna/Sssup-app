import React, { useState } from 'react';
import { User } from '../types';
import { Camera, X, Check, Key, Shield, User as UserIcon, Sun, Moon, Sparkles } from 'lucide-react';
import { AvatarPickerGrid } from './AvatarPickerGrid';
import { DEFAULT_BLANK_AVATAR } from '../utils/avatars';

interface Props {
  user: User;
  currentTheme: 'dark' | 'light';
  onUpdateUser: (updated: Partial<User>) => void;
  onToggleTheme: () => void;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({
  user,
  currentTheme,
  onUpdateUser,
  onToggleTheme,
  onClose,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [about, setAbout] = useState(user.about);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // File upload for DP setup
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarUrl(DEFAULT_BLANK_AVATAR);
  };

  const handleSave = () => {
    onUpdateUser({
      displayName,
      username: username.replace('@', '').trim(),
      about,
      avatarUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(user.publicKeyPem || '');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#111b21] dark:bg-[#111b21] light:bg-white text-slate-100 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#1f2c34] border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
            <UserIcon className="w-5 h-5 text-[#00a884]" />
            <span>Profile & DP Settings</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111b21] hover:bg-slate-800 text-xs font-semibold text-amber-400 border border-slate-700 transition-colors"
              title="Toggle Light / Dark Mode"
            >
              {currentTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
              <span>{currentTheme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Current DP Preview */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <img
              src={avatarUrl}
              alt="Profile DP"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#00a884] shadow-2xl"
            />
            <span className="text-[11px] font-semibold text-[#00a884]">
              Current Display Picture (DP)
            </span>
          </div>

          {/* 12 Face Cards + 13th Gallery Upload Grid */}
          <AvatarPickerGrid
            selectedAvatarUrl={avatarUrl}
            onSelectAvatarUrl={(url) => setAvatarUrl(url)}
            onFileUpload={handleFileUpload}
            onDeleteAvatar={handleDeleteAvatar}
          />

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#00a884] mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1f2c34] text-slate-100 text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-[#00a884]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#00a884] mb-1">
                Instagram-Style Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-[#1f2c34] text-slate-100 text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-[#00a884]"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Friends will search @{username || 'username'} to send message requests.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#00a884] mb-1">
                About / Bio
              </label>
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1f2c34] text-slate-100 text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-[#00a884]"
              />
            </div>

            {/* E2EE Public Key preview */}
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 py-1"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>End-to-End Encryption RSA Key</span>
                </div>
                <span>{showKey ? 'Hide' : 'Show Key'}</span>
              </button>

              {showKey && (
                <div className="mt-2 p-3 bg-[#111b21] rounded-xl border border-slate-800 space-y-2">
                  <p className="text-[10px] text-slate-400 font-mono break-all line-clamp-3">
                    {user.publicKeyPem || 'RSA-OAEP 2048-bit Public Key'}
                  </p>
                  <button
                    type="button"
                    onClick={copyKey}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#00a884] hover:underline"
                  >
                    <Key className="w-3 h-3" />
                    <span>{copiedKey ? 'Key Copied!' : 'Copy Public Key'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1f2c34] border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-medium">
            {savedSuccess && 'Profile updated!'}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save DP & Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
