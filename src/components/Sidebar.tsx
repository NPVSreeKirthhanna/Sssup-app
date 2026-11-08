import React from 'react';
import { User, FriendRequest } from '../types';
import {
  MessageSquare,
  UserPlus,
  CircleDashed,
  PhoneCall,
  User as UserIcon,
  Users,
  Lock,
  Sparkles,
  LogOut,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';

interface Props {
  currentUser: User;
  allUsers: User[];
  requests: FriendRequest[];
  activeTab: 'chats' | 'requests' | 'updates' | 'calls' | 'settings';
  currentTheme: 'dark' | 'light';
  onSelectTab: (tab: 'chats' | 'requests' | 'updates' | 'calls' | 'settings') => void;
  onOpenProfileModal: () => void;
  onOpenRequestsModal: () => void;
  onSwitchUser: (user: User) => void;
  onOpenTour: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
  totalUnreadChats: number;
}

export const Sidebar: React.FC<Props> = ({
  currentUser,
  allUsers,
  requests,
  activeTab,
  currentTheme,
  onSelectTab,
  onOpenProfileModal,
  onOpenRequestsModal,
  onSwitchUser,
  onOpenTour,
  onToggleTheme,
  onLogout,
  totalUnreadChats,
}) => {
  const pendingIncomingRequests = requests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'pending'
  );

  return (
    <aside className="w-16 bg-[#1f2c34] dark:bg-[#1f2c34] light:bg-[#f0f2f5] flex flex-col items-center justify-between py-4 border-r border-slate-800 shrink-0 select-none">
      {/* Top Section: Navigation icons */}
      <div className="flex flex-col items-center gap-5 w-full">
        {/* App Logo */}
        <div className="relative group cursor-pointer" onClick={() => onSelectTab('chats')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#008f70] to-[#00a884] flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-[#00a884]/20">
            S
          </div>
          <span className="absolute left-14 top-2 z-50 hidden group-hover:block px-2 py-1 bg-slate-900 text-slate-100 text-[10px] font-bold rounded shadow-xl whitespace-nowrap">
            Ssupp Encrypted Messenger
          </span>
        </div>

        <div className="w-8 h-[1px] bg-slate-800 my-1" />

        {/* Chats Tab */}
        <button
          onClick={() => onSelectTab('chats')}
          className={`relative p-3 rounded-xl transition-all ${
            activeTab === 'chats'
              ? 'bg-[#111b21] text-[#00a884] shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#111b21]/60'
          }`}
          title="Chats"
        >
          <MessageSquare className="w-5 h-5" />
          {totalUnreadChats > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#00a884] text-slate-950 rounded-full text-[10px] font-bold flex items-center justify-center">
              {totalUnreadChats}
            </span>
          )}
        </button>

        {/* Instagram Username Requests Tab */}
        <button
          onClick={onOpenRequestsModal}
          className={`relative p-3 rounded-xl transition-all ${
            activeTab === 'requests'
              ? 'bg-[#111b21] text-[#00a884] shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#111b21]/60'
          }`}
          title="Username & Requests"
        >
          <UserPlus className="w-5 h-5" />
          {pendingIncomingRequests.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-400 text-slate-950 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
              {pendingIncomingRequests.length}
            </span>
          )}
        </button>

        {/* Status / Updates Tab */}
        <button
          onClick={() => onSelectTab('updates')}
          className={`relative p-3 rounded-xl transition-all ${
            activeTab === 'updates'
              ? 'bg-[#111b21] text-[#00a884] shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#111b21]/60'
          }`}
          title="Updates / Status"
        >
          <CircleDashed className="w-5 h-5" />
        </button>

        {/* Calls Tab */}
        <button
          onClick={() => onSelectTab('calls')}
          className={`relative p-3 rounded-xl transition-all ${
            activeTab === 'calls'
              ? 'bg-[#111b21] text-[#00a884] shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#111b21]/60'
          }`}
          title="Calls Log"
        >
          <PhoneCall className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Section: Profile, Theme, App Tour, User Switcher & Logout */}
      <div className="flex flex-col items-center gap-3">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-[#111b21] transition-colors"
          title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Theme`}
        >
          {currentTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-cyan-400" />}
        </button>
        {/* App Tour Icon */}
        <button
          onClick={onOpenTour}
          className="p-2.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-[#111b21] transition-colors"
          title="App Features Tour & Guide"
        >
          <HelpCircle className="w-5 h-5 text-amber-400" />
        </button>

        {/* Multi-User Switcher Drawer Dropdown (if multiple users exist) */}
        {allUsers.length > 1 && (
          <div className="relative group">
            <button
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#111b21] transition-colors"
              title="Switch User Account (Test Mode)"
            >
              <Users className="w-5 h-5 text-emerald-400" />
            </button>

            {/* User selection menu */}
            <div className="absolute left-14 bottom-0 hidden group-hover:block w-48 bg-[#1f2c34] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                Switch Active Account
              </div>
              <div className="space-y-1">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => onSwitchUser(u)}
                    className={`w-full flex items-center gap-2 p-1.5 rounded-xl text-xs transition-colors ${
                      u.id === currentUser.id
                        ? 'bg-[#00a884]/20 text-[#00a884] font-bold'
                        : 'text-slate-300 hover:bg-[#111b21]'
                    }`}
                  >
                    <img src={u.avatarUrl} alt={u.displayName} className="w-6 h-6 rounded-full object-cover" />
                    <span className="truncate">@{u.username}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current User DP / Profile button */}
        <button
          onClick={onOpenProfileModal}
          className="relative group p-0.5 rounded-full border-2 border-[#00a884] hover:scale-105 transition-transform"
          title={`Setup DP (${currentUser.displayName} @${currentUser.username})`}
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="absolute left-14 bottom-2 z-50 hidden group-hover:block px-2.5 py-1 bg-slate-900 text-slate-100 text-xs font-semibold rounded shadow-xl whitespace-nowrap">
            Setup DP & Profile (@{currentUser.username})
          </span>
        </button>

        {/* Log Out Button */}
        <button
          onClick={onLogout}
          className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Log Out"
        >
          <LogOut className="w-5 h-5 text-rose-400" />
        </button>
      </div>
    </aside>
  );
};
