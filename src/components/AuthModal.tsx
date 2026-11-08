import React, { useState } from 'react';
import { User } from '../types';
import { createNewUserAccount } from '../utils/storage';
import {
  ShieldCheck,
  Camera,
  UserPlus,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Loader2
} from 'lucide-react';

import { AvatarPickerGrid } from './AvatarPickerGrid';
import { AVATAR_FACE_CARDS, DEFAULT_BLANK_AVATAR } from '../utils/avatars';

interface Props {
  allUsers: User[];
  onAccountCreated: (user: User) => void;
  onSelectExistingUser: (user: User) => void;
}

export const AuthModal: React.FC<Props> = ({
  allUsers,
  onAccountCreated,
  onSelectExistingUser,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('Hey there! I am using Ssupp 🔒');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_FACE_CARDS[0].url);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'switch'>(
    allUsers.length > 0 ? 'create' : 'create'
  );

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

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!displayName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanUsername = username.replace(/^@/, '').trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMsg('Username must be at least 3 characters long.');
      return;
    }

    // Check if username is taken
    const existing = allUsers.find(
      (u) => u.username.toLowerCase() === cleanUsername
    );
    if (existing) {
      setErrorMsg(`Username @${cleanUsername} is already taken. Please choose another.`);
      return;
    }

    setIsGeneratingKeys(true);
    try {
      const newUser = await createNewUserAccount(
        displayName,
        cleanUsername,
        avatarUrl,
        about
      );
      onAccountCreated(newUser);
    } catch (err: any) {
      setErrorMsg('Account creation failed. Please try again.');
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b141a] p-4">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00a884]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full max-w-lg bg-[#111b21] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="p-8 bg-[#1f2c34] text-center border-b border-slate-800 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#008f70] to-[#00a884] flex items-center justify-center text-slate-950 font-black text-2xl mx-auto shadow-xl shadow-[#00a884]/20">
            S
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Welcome to Ssupp</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            WhatsApp-style messaging with Instagram @username discovery & RSA-OAEP End-to-End Encryption
          </p>

          {allUsers.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'create'
                    ? 'bg-[#00a884] text-slate-950 shadow-md'
                    : 'bg-[#111b21] text-slate-400 hover:text-slate-200'
                }`}
              >
                Create New Account
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('switch')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'switch'
                    ? 'bg-[#00a884] text-slate-950 shadow-md'
                    : 'bg-[#111b21] text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In / Existing Accounts ({allUsers.length})
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Create Account Form */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateAccount} className="p-8 space-y-5 overflow-y-auto max-h-[65vh]">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
                {errorMsg}
              </div>
            )}

            {/* Selected DP Avatar Preview */}
            <div className="flex flex-col items-center justify-center space-y-1.5">
              <img
                src={avatarUrl}
                alt="DP Avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-[#00a884] shadow-xl"
              />
              <span className="text-[11px] font-semibold text-[#00a884]">
                Selected Display Picture (DP)
              </span>
            </div>

            {/* 12 Face Cards + 13th Gallery Upload Grid */}
            <AvatarPickerGrid
              selectedAvatarUrl={avatarUrl}
              onSelectAvatarUrl={(url) => setAvatarUrl(url)}
              onFileUpload={handleFileUpload}
              onDeleteAvatar={() => setAvatarUrl(DEFAULT_BLANK_AVATAR)}
            />

            {/* Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#00a884] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ananya Sharma, Alex Rivera..."
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1f2c34] text-slate-100 placeholder-slate-500 text-sm rounded-xl border border-slate-700/60 focus:outline-none focus:border-[#00a884]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00a884] mb-1">
                  Choose Unique @Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">@</span>
                  <input
                    type="text"
                    required
                    placeholder="ananya_s, alex_sky, dev_sam..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full pl-8 pr-4 py-2.5 bg-[#1f2c34] text-slate-100 placeholder-slate-500 text-sm rounded-xl border border-slate-700/60 focus:outline-none focus:border-[#00a884]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Friends will search @{username || 'username'} on Ssupp to send message requests.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00a884] mb-1">
                  About / Bio Status
                </label>
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1f2c34] text-slate-100 text-sm rounded-xl border border-slate-700/60 focus:outline-none focus:border-[#00a884]"
                />
              </div>
            </div>

            {/* E2EE Info banner */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#1f2c34] border border-[#00a884]/30 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-[#00a884] shrink-0" />
              <span>
                Registering automatically generates a 2048-bit Web Crypto RSA-OAEP keypair for End-to-End Encryption.
              </span>
            </div>

            <button
              type="submit"
              disabled={isGeneratingKeys}
              className="w-full py-3.5 rounded-2xl bg-[#00a884] hover:bg-[#008f70] disabled:opacity-50 text-slate-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {isGeneratingKeys ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating RSA E2EE Keys...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Create Account & Start E2EE Chat</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Switch to Existing User */}
        {activeTab === 'switch' && (
          <div className="p-8 space-y-4 overflow-y-auto max-h-[65vh]">
            <p className="text-xs text-slate-400 font-medium text-center">
              Select an existing account to sign in:
            </p>
            <div className="space-y-2">
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelectExistingUser(user)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#1f2c34] hover:bg-[#202c33] border border-slate-700/60 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className="w-11 h-11 rounded-full object-cover border border-[#00a884]"
                    />
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-[#00a884] transition-colors">
                        {user.displayName}
                      </h4>
                      <p className="text-xs text-[#00a884]">@{user.username}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-[#111b21] text-slate-300 group-hover:bg-[#00a884] group-hover:text-slate-950 transition-colors">
                    Sign In
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
