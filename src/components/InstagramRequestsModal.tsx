import React, { useState } from 'react';
import { User, FriendRequest } from '../types';
import { Search, UserPlus, Check, X, ShieldAlert, Clock, UserCheck, Send, Sparkles } from 'lucide-react';

interface Props {
  currentUser: User;
  allUsers: User[];
  requests: FriendRequest[];
  onSendRequest: (receiverId: string, message: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onClose: () => void;
}

export const InstagramRequestsModal: React.FC<Props> = ({
  currentUser,
  allUsers,
  requests,
  onSendRequest,
  onAcceptRequest,
  onDeclineRequest,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'incoming' | 'outgoing'>('incoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('Hey! Let\'s chat on Ssupp 🔒');
  const [selectedUserForRequest, setSelectedUserForRequest] = useState<User | null>(null);

  // Incoming requests for current user
  const incomingRequests = requests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'pending'
  );

  // Outgoing requests sent by current user
  const outgoingRequests = requests.filter(
    (r) => r.senderId === currentUser.id && r.status === 'pending'
  );

  // Filter users by username or display name (excluding current user)
  const filteredUsers = allUsers.filter((u) => {
    if (u.id === currentUser.id) return false;
    const q = searchQuery.toLowerCase().replace('@', '');
    return (
      u.username.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q)
    );
  });

  const getRequestStatusForUser = (user: User) => {
    const existing = requests.find(
      (r) =>
        (r.senderId === currentUser.id && r.receiverId === user.id) ||
        (r.senderId === user.id && r.receiverId === currentUser.id)
    );

    if (!existing) return 'none';
    if (existing.status === 'accepted') return 'accepted';
    if (existing.status === 'pending') {
      return existing.senderId === currentUser.id ? 'outgoing_pending' : 'incoming_pending';
    }
    return existing.status;
  };

  const handleConfirmSendRequest = () => {
    if (selectedUserForRequest) {
      onSendRequest(selectedUserForRequest.id, greetingMessage);
      setSelectedUserForRequest(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#111b21] text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-[#1f2c34] border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <UserPlus className="w-5 h-5 text-[#00a884]" />
              <span>Ssupp Connect & Username Requests</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instagram-style username discovery with end-to-end encrypted chat approval
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-[#111b21] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`relative pb-3 px-3 text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'incoming'
                ? 'text-[#00a884] border-b-2 border-[#00a884]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Incoming Requests</span>
            {incomingRequests.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#00a884] text-slate-950 text-[10px] font-bold">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`pb-3 px-3 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'text-[#00a884] border-b-2 border-[#00a884]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search @Username</span>
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            className={`pb-3 px-3 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'outgoing'
                ? 'text-[#00a884] border-b-2 border-[#00a884]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Sent Requests</span>
            {outgoingRequests.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                {outgoingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* SEARCH TAB */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by @username or name (e.g., alex_sky, maria_vance, david_k)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1f2c34] text-slate-100 placeholder-slate-400 rounded-xl border border-slate-700/60 focus:outline-none focus:border-[#00a884] text-sm"
                />
              </div>

              <div className="space-y-2">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    No users found matching "{searchQuery}"
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                    const status = getRequestStatusForUser(user);
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#1f2c34]/60 border border-slate-800 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl}
                            alt={user.displayName}
                            className="w-11 h-11 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <h4 className="font-semibold text-slate-100 text-sm">{user.displayName}</h4>
                            <p className="text-xs text-[#00a884] font-medium">@{user.username}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{user.about}</p>
                          </div>
                        </div>

                        <div>
                          {status === 'accepted' && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Friends</span>
                            </span>
                          )}

                          {status === 'outgoing_pending' && (
                            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/30">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Requested</span>
                            </span>
                          )}

                          {status === 'incoming_pending' && (
                            <button
                              onClick={() => setActiveTab('incoming')}
                              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors"
                            >
                              Review Request
                            </button>
                          )}

                          {status === 'none' && (
                            <button
                              onClick={() => setSelectedUserForRequest(user)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-slate-950 text-xs font-bold transition-all active:scale-95 shadow-md shadow-[#00a884]/20"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Send Request</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* INCOMING REQUESTS TAB */}
          {activeTab === 'incoming' && (
            <div className="space-y-3">
              {incomingRequests.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <UserCheck className="w-10 h-10 mx-auto text-slate-600 stroke-1" />
                  <p className="text-sm font-medium">No pending incoming requests</p>
                  <p className="text-xs text-slate-500">
                    When someone searches @{currentUser.username} and sends a message request, it will appear here.
                  </p>
                </div>
              ) : (
                incomingRequests.map((req) => {
                  const sender = allUsers.find((u) => u.id === req.senderId);
                  if (!sender) return null;

                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl bg-[#1f2c34] border border-[#00a884]/40 space-y-3 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={sender.avatarUrl}
                          alt={sender.displayName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#00a884]"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-100 text-sm">{sender.displayName}</h4>
                          <p className="text-xs text-[#00a884] font-medium">@{sender.username}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{sender.about}</p>
                        </div>
                      </div>

                      {req.message && (
                        <div className="p-3 rounded-lg bg-[#111b21] border border-slate-800 text-xs text-slate-300 italic">
                          "{req.message}"
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                          onClick={() => onDeclineRequest(req.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => onAcceptRequest(req.id)}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept & Chat E2EE</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* OUTGOING REQUESTS TAB */}
          {activeTab === 'outgoing' && (
            <div className="space-y-3">
              {outgoingRequests.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  You haven't sent any pending requests.
                </div>
              ) : (
                outgoingRequests.map((req) => {
                  const receiver = allUsers.find((u) => u.id === req.receiverId);
                  if (!receiver) return null;

                  return (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#1f2c34] border border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={receiver.avatarUrl}
                          alt={receiver.displayName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <h4 className="font-semibold text-slate-100 text-sm">{receiver.displayName}</h4>
                          <p className="text-xs text-[#00a884]">@{receiver.username}</p>
                        </div>
                      </div>

                      <span className="flex items-center gap-1 text-xs text-amber-400 font-medium px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Awaiting Acceptance</span>
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Send Request Confirmation Modal Popup */}
        {selectedUserForRequest && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#1f2c34] p-6 rounded-2xl shadow-2xl border border-slate-700 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUserForRequest.avatarUrl}
                  alt={selectedUserForRequest.displayName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#00a884]"
                />
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{selectedUserForRequest.displayName}</h3>
                  <p className="text-xs text-[#00a884]">@{selectedUserForRequest.username}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Greeting Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  className="w-full p-3 bg-[#111b21] text-slate-100 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-[#00a884]"
                  placeholder="Introduce yourself..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedUserForRequest(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSendRequest}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-slate-950 font-bold text-xs shadow-lg transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
