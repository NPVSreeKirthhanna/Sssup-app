import React, { useState } from 'react';
import { User } from '../types';
import { Plus, X, CirclePlus, Sparkles, Send, Eye } from 'lucide-react';

interface StatusItem {
  id: string;
  userId: string;
  imageUrl?: string;
  text?: string;
  timestamp: number;
}

interface Props {
  currentUser: User;
  friends: User[];
}

export const UpdatesTab: React.FC<Props> = ({ currentUser, friends }) => {
  const [statuses, setStatuses] = useState<StatusItem[]>([
    {
      id: 'st_1',
      userId: 'usr_alex',
      text: 'Working on WhatsApp E2EE crypto protocols! 🚀🔒',
      timestamp: Date.now() - 3600000 * 2,
    },
    {
      id: 'st_2',
      userId: 'usr_sam',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      text: 'Coffee and coding session ☕',
      timestamp: Date.now() - 3600000 * 4,
    },
    {
      id: 'st_3',
      userId: 'usr_maria',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
      text: 'Weekend getaway views 🏔️',
      timestamp: Date.now() - 3600000 * 6,
    },
  ]);

  const [activeStory, setActiveStory] = useState<StatusItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStatusText, setNewStatusText] = useState('');
  const [newStatusImage, setNewStatusImage] = useState('');

  const handlePostStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusText.trim() && !newStatusImage.trim()) return;

    const newStatus: StatusItem = {
      id: `st_${Date.now()}`,
      userId: currentUser.id,
      text: newStatusText.trim(),
      imageUrl: newStatusImage.trim() || undefined,
      timestamp: Date.now(),
    };

    setStatuses([newStatus, ...statuses]);
    setNewStatusText('');
    setNewStatusImage('');
    setShowAddModal(false);
  };

  const myStatus = statuses.find((s) => s.userId === currentUser.id);

  return (
    <div className="flex-1 bg-[#111b21] overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100">Updates</h2>
        <p className="text-xs text-slate-400 mt-0.5">Share photos and text statuses that expire after 24 hours</p>
      </div>

      {/* My Status Card */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1f2c34] border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt="My Status"
              className={`w-14 h-14 rounded-full object-cover border-2 ${
                myStatus ? 'border-[#00a884]' : 'border-slate-700'
              }`}
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="absolute bottom-0 right-0 p-1 rounded-full bg-[#00a884] text-slate-950 font-bold border-2 border-[#1f2c34] shadow-md"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-sm">My Status</h4>
            <p className="text-xs text-slate-400">
              {myStatus ? 'Tap to view or add new update' : 'Tap plus to add status update'}
            </p>
          </div>
        </div>

        {myStatus && (
          <button
            onClick={() => setActiveStory(myStatus)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-[#00a884] font-semibold transition-colors"
          >
            View Status
          </button>
        )}
      </div>

      {/* Recent Updates List */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Status Updates</h3>
        <div className="space-y-3">
          {friends.map((friend) => {
            const friendStatus = statuses.find((s) => s.userId === friend.id);
            if (!friendStatus) return null;

            return (
              <button
                key={friend.id}
                onClick={() => setActiveStory(friendStatus)}
                className="w-full flex items-center gap-4 p-3.5 rounded-2xl bg-[#1f2c34]/60 hover:bg-[#1f2c34] border border-slate-800/80 transition-all text-left group"
              >
                <div className="relative p-0.5 rounded-full border-2 border-[#00a884]">
                  <img
                    src={friend.avatarUrl}
                    alt={friend.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-100 text-sm group-hover:text-[#00a884] transition-colors">
                    {friend.displayName}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {friendStatus.text || 'Photo status update'}
                  </p>
                </div>
                <span className="text-[11px] text-slate-500">
                  {new Date(friendStatus.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Status Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#1f2c34] p-6 rounded-2xl shadow-2xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Add Status Update</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status Text</label>
                <textarea
                  rows={3}
                  value={newStatusText}
                  onChange={(e) => setNewStatusText(e.target.value)}
                  placeholder="What's taking up space in your head today?"
                  className="w-full p-3 bg-[#111b21] text-slate-100 text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-[#00a884]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Photo URL (Optional)</label>
                <input
                  type="text"
                  value={newStatusImage}
                  onChange={(e) => setNewStatusImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#111b21] text-slate-100 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-[#00a884]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00a884] hover:bg-[#008f70] text-slate-950 font-bold text-xs rounded-xl shadow-lg"
                >
                  Post Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Story Full Screen Viewer */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
          <div className="relative w-full max-w-lg h-[80vh] bg-[#111b21] rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800 shadow-2xl">
            {/* Top progress bar */}
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent space-y-3 z-10">
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#00a884] w-full animate-in slide-in-from-left duration-3000" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={friends.find((f) => f.id === activeStory.userId)?.avatarUrl || currentUser.avatarUrl}
                    alt="Author"
                    className="w-10 h-10 rounded-full object-cover border border-[#00a884]"
                  />
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      {friends.find((f) => f.id === activeStory.userId)?.displayName || currentUser.displayName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">Status Update</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1 rounded-full text-white hover:bg-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              {activeStory.imageUrl && (
                <img
                  src={activeStory.imageUrl}
                  alt="Status visual"
                  className="max-h-[50vh] object-contain rounded-xl mb-4"
                />
              )}
              {activeStory.text && (
                <p className="text-xl font-medium text-white max-w-md leading-relaxed">
                  {activeStory.text}
                </p>
              )}
            </div>

            {/* Bottom reply bar */}
            <div className="p-4 bg-black/60 flex items-center gap-3 z-10">
              <input
                type="text"
                placeholder="Reply to status..."
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white text-xs rounded-full border border-slate-700 focus:outline-none focus:border-[#00a884]"
              />
              <button
                onClick={() => setActiveStory(null)}
                className="p-2.5 rounded-full bg-[#00a884] text-slate-950 font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
