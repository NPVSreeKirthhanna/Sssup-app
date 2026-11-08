import React from 'react';
import { CallLog, User } from '../types';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, ShieldCheck } from 'lucide-react';

interface Props {
  currentUser: User;
  allUsers: User[];
  callLogs: CallLog[];
  onStartCall: (contactUser: User, type: 'voice' | 'video') => void;
}

export const CallsHistoryTab: React.FC<Props> = ({
  currentUser,
  allUsers,
  callLogs,
  onStartCall,
}) => {
  return (
    <div className="flex-1 bg-[#111b21] overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Calls Log</h2>
          <p className="text-xs text-slate-400 mt-0.5">End-to-End Encrypted Voice and Video Call History</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a884]/20 text-[#00a884] text-xs font-semibold border border-[#00a884]/40">
          <ShieldCheck className="w-4 h-4" />
          <span>E2EE Calls Active</span>
        </div>
      </div>

      {/* Call Log List */}
      <div className="space-y-3">
        {callLogs.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No call history yet. Start a voice or video call with a friend!
          </div>
        ) : (
          callLogs.map((log) => {
            const isCaller = log.callerId === currentUser.id;
            const otherUserId = isCaller ? log.receiverId : log.callerId;
            const otherUser = allUsers.find((u) => u.id === otherUserId);

            if (!otherUser) return null;

            return (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#1f2c34] border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={otherUser.avatarUrl}
                    alt={otherUser.displayName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm">{otherUser.displayName}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      {log.status === 'missed' ? (
                        <span className="flex items-center gap-1 text-rose-400 font-semibold">
                          <PhoneMissed className="w-3.5 h-3.5" />
                          <span>Missed call</span>
                        </span>
                      ) : isCaller ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <PhoneOutgoing className="w-3.5 h-3.5" />
                          <span>Outgoing ({log.durationSeconds}s)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-cyan-400 font-medium">
                          <PhoneIncoming className="w-3.5 h-3.5" />
                          <span>Incoming ({log.durationSeconds}s)</span>
                        </span>
                      )}
                      <span>•</span>
                      <span className="font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartCall(otherUser, 'voice')}
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-[#00a884] text-[#00a884] hover:text-slate-950 transition-colors"
                    title="Voice Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onStartCall(otherUser, 'video')}
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-[#00a884] text-[#00a884] hover:text-slate-950 transition-colors"
                    title="Video Call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
