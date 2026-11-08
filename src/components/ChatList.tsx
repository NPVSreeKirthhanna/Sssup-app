import React, { useState } from 'react';
import { Chat, User, Message } from '../types';
import {
  Search,
  UserPlus,
  Pin,
  CheckCheck,
  VolumeX,
  MessageSquarePlus,
  X,
  FileText
} from 'lucide-react';

interface Props {
  chats: Chat[];
  currentUser: User;
  allUsers: User[];
  savedContactNames?: Record<string, string>;
  messages?: Message[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onOpenRequestsModal: () => void;
  pendingRequestsCount: number;
}

export const ChatList: React.FC<Props> = ({
  chats,
  currentUser,
  allUsers,
  savedContactNames = {},
  messages = [],
  activeChatId,
  onSelectChat,
  onOpenRequestsModal,
  pendingRequestsCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'favorites'>('all');

  // Map participant data and matched content snippet if searching
  const processedChats = chats.map((chat) => {
    const otherUserId = chat.participantIds.find((id) => id !== currentUser.id);
    const otherUser = allUsers.find((u) => u.id === otherUserId);
    const unreadCount = chat.unreadCounts[currentUser.id] || 0;
    const savedName = otherUser ? savedContactNames[otherUser.id] : undefined;

    // Messages belonging to this chat
    const chatMessages = messages.filter((m) => m.chatId === chat.id);

    return {
      chat,
      otherUser,
      savedName,
      unreadCount,
      chatMessages,
    };
  });

  // Filter chats by query & filter mode
  const filteredChats = processedChats.filter(({ chat, otherUser, savedName, unreadCount, chatMessages }) => {
    if (!otherUser) return false;

    // Filter by Tab (Unread / Pinned)
    if (filterMode === 'unread' && unreadCount === 0) return false;
    if (filterMode === 'favorites' && !chat.isPinned) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim().replace(/^@/, '');

    // 1. Matches Username, Display Name, or Saved Contact Name
    const matchesUsername = otherUser.username.toLowerCase().includes(q);
    const matchesDisplayName = otherUser.displayName.toLowerCase().includes(q);
    const matchesSavedName = savedName ? savedName.toLowerCase().includes(q) : false;

    // 2. Matches Last Message content or media caption
    const lastMsgContent = chat.lastMessage?.content?.toLowerCase() || '';
    const lastMsgCaption = chat.lastMessage?.mediaCaption?.toLowerCase() || '';
    const matchesLastMsg = lastMsgContent.includes(q) || lastMsgCaption.includes(q);

    // 3. Matches any message in the chat history
    const matchesHistoryMsg = chatMessages.some(
      (m) =>
        m.content.toLowerCase().includes(q) ||
        (m.mediaCaption && m.mediaCaption.toLowerCase().includes(q)) ||
        (m.fileName && m.fileName.toLowerCase().includes(q))
    );

    return matchesUsername || matchesDisplayName || matchesSavedName || matchesLastMsg || matchesHistoryMsg;
  });

  return (
    <div className="w-80 md:w-96 bg-[#111b21] flex flex-col h-full border-r border-slate-800 shrink-0">
      {/* Header */}
      <div className="p-4 space-y-3 border-b border-slate-800/80 bg-[#111b21]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>Chats</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00a884]/20 text-[#00a884] font-mono border border-[#00a884]/30">
              E2EE
            </span>
          </h1>

          <div className="flex items-center gap-2">
            {/* Instagram Username requests trigger */}
            <button
              onClick={onOpenRequestsModal}
              className="relative p-2 rounded-xl bg-[#1f2c34] hover:bg-[#202c33] text-[#00a884] transition-colors"
              title="Add Contact / Instagram Username Requests"
            >
              <UserPlus className="w-4 h-4" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 text-slate-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search input to filter active chats by contact username or message content */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by @username or message content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-[#1f2c34] text-slate-100 text-xs rounded-xl placeholder-slate-400 border border-slate-700/60 focus:outline-none focus:border-[#00a884] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-100 p-0.5 rounded-full hover:bg-slate-700/60 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Interactive Filter segmented controls */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterMode === 'all'
                ? 'bg-[#00a884] text-slate-950'
                : 'bg-[#1f2c34] text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('unread')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterMode === 'unread'
                ? 'bg-[#00a884] text-slate-950'
                : 'bg-[#1f2c34] text-slate-400 hover:text-slate-200'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilterMode('favorites')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterMode === 'favorites'
                ? 'bg-[#00a884] text-slate-950'
                : 'bg-[#1f2c34] text-slate-400 hover:text-slate-200'
            }`}
          >
            Pinned
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-3">
            <MessageSquarePlus className="w-10 h-10 mx-auto text-slate-600" />
            <p className="font-semibold text-slate-300">No active chats found</p>
            <p className="text-[11px] text-slate-500">
              {searchQuery
                ? `No chats found matching "${searchQuery}"`
                : 'Search users by @username or check your pending requests.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Clear Search Filter
              </button>
            ) : (
              <button
                onClick={onOpenRequestsModal}
                className="mt-2 px-4 py-2 bg-[#00a884] text-slate-950 text-xs font-bold rounded-xl shadow-md"
              >
                Find Friends (@username)
              </button>
            )}
          </div>
        ) : (
          filteredChats.map(({ chat, otherUser, savedName, unreadCount, chatMessages }) => {
            if (!otherUser) return null;
            const isSelected = chat.id === activeChatId;
            const lastMsg = chat.lastMessage;

            // Find matching message if user typed a search query
            const q = searchQuery.toLowerCase().trim().replace(/^@/, '');
            const matchingMsg =
              q &&
              chatMessages.find(
                (m) =>
                  m.content.toLowerCase().includes(q) ||
                  (m.mediaCaption && m.mediaCaption.toLowerCase().includes(q))
              );

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 border-b border-slate-800/40 text-left transition-colors relative group ${
                  isSelected ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'
                }`}
              >
                {/* Avatar with Status indicator */}
                <div className="relative shrink-0">
                  <img
                    src={otherUser.avatarUrl}
                    alt={savedName || otherUser.displayName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700/80"
                  />
                  {otherUser.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00a884] ring-2 ring-[#111b21]" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-slate-100 text-sm truncate flex items-center gap-1.5">
                      <span>{savedName || otherUser.displayName}</span>
                      <span className="text-xs text-[#00a884] font-normal">@{otherUser.username}</span>
                      {chat.isMuted && <VolumeX className="w-3 h-3 text-slate-500 shrink-0" />}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {lastMsg
                        ? new Date(lastMsg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 text-xs text-slate-400 truncate">
                      {lastMsg && lastMsg.senderId === currentUser.id && (
                        <CheckCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}

                      {/* Display matched message content if searching */}
                      {searchQuery && matchingMsg ? (
                        <span className="truncate text-emerald-300 font-medium flex items-center gap-1">
                          <FileText className="w-3 h-3 shrink-0 text-[#00a884]" />
                          <span className="truncate">"{matchingMsg.content}"</span>
                        </span>
                      ) : (
                        <span className="truncate">
                          {lastMsg ? lastMsg.content : `No messages yet with @${otherUser.username}`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {chat.isPinned && <Pin className="w-3 h-3 text-slate-400" />}
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#00a884] text-slate-950 font-bold text-[10px]">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
