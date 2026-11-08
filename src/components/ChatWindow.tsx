import React, { useEffect, useRef, useState } from 'react';
import { Message, User, Chat, Sticker } from '../types';
import {
  Phone,
  Video,
  ShieldCheck,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  CheckCheck,
  Lock,
  Image as ImageIcon,
  FileText,
  MapPin,
  Play,
  Pause,
  Sparkles,
  Download,
  Trash2,
  Reply,
  Square,
  Volume2,
  X,
  Pencil,
  UserCheck,
} from 'lucide-react';
import { StickerPickerModal } from './StickerPickerModal';
import { PhotoLightboxModal } from './PhotoLightboxModal';

interface Props {
  chat: Chat;
  currentUser: User;
  contactUser: User;
  savedContactName?: string;
  messages: Message[];
  stickers: Sticker[];
  onSendMessage: (
    content: string,
    type?: Message['type'],
    mediaUrl?: string,
    extraProps?: Partial<Message>
  ) => void;
  onReactMessage: (messageId: string, emoji: string) => void;
  onStartCall: (contact: User, type: 'voice' | 'video') => void;
  onOpenSafetyCode: () => void;
  onOpenEditContactName?: () => void;
}

export const ChatWindow: React.FC<Props> = ({
  chat,
  currentUser,
  contactUser,
  savedContactName,
  messages,
  stickers,
  onSendMessage,
  onReactMessage,
  onStartCall,
  onOpenSafetyCode,
  onOpenEditContactName,
}) => {
  const [inputText, setInputText] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);

  // Voice note recording states
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);

  // Audio player playback states per message
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<number>(1);
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch AI Smart replies from server endpoint
  useEffect(() => {
    async function fetchSmartReplies() {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.senderId !== currentUser.id) {
        try {
          const res = await fetch('/api/gemini/smart-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lastMessage: lastMsg.content,
              conversation: messages.slice(-3).map((m) => m.content).join(' | '),
            }),
          });
          const data = await res.json();
          if (data.suggestions) {
            setSmartReplies(data.suggestions);
          }
        } catch (e) {
          console.warn('Smart replies fetch error:', e);
        }
      } else {
        setSmartReplies([]);
      }
    }
    fetchSmartReplies();
  }, [messages, currentUser.id]);

  // Handle Voice Recording Start
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendMessage(`Voice message (${recordingTime}s)`, 'audio', audioUrl, {
          audioDuration: recordingTime,
        });
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
      setRecordingTime(0);

      recordTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access is required to record voice notes.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  const cancelVoiceRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      audioChunksRef.current = [];
    }
    setIsRecordingVoice(false);
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
  };

  // Image Upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSendMessage(
          file.name,
          'image',
          reader.result as string,
          { mediaCaption: inputText.trim() || undefined }
        );
        setInputText('');
        setShowAttachmentMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Audio Playback toggle
  const togglePlayAudio = (msgId: string, durationSec = 10) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(msgId);
      // Simulate finish
      setTimeout(() => {
        setPlayingAudioId(null);
      }, (durationSec * 1000) / audioPlaybackSpeed);
    }
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim(), 'text', undefined, {
      replyToMessageId: replyToMessage?.id,
    });
    setInputText('');
    setReplyToMessage(null);
    setShowStickerPicker(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#1f2c34] border-b border-slate-800/80 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={contactUser.avatarUrl}
            alt={savedContactName || contactUser.displayName}
            className="w-10 h-10 rounded-full object-cover border border-[#00a884] cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onOpenEditContactName}
            title="Click to view or edit saved contact name"
          />
          <div>
            <h2 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <span>{savedContactName || contactUser.displayName}</span>
              <span className="text-xs text-[#00a884] font-medium">@{contactUser.username}</span>
              <button
                onClick={onOpenEditContactName}
                className="p-1 rounded text-slate-400 hover:text-[#00a884] hover:bg-slate-800 transition-colors ml-1"
                title="Save / Edit Contact Name"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </h2>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00a884] animate-pulse" />
              <span>{contactUser.status === 'online' ? 'online • E2EE Encrypted' : 'offline'}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 text-slate-300">
          <button
            onClick={onOpenSafetyCode}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#111b21] hover:bg-slate-800 text-[#00a884] border border-[#00a884]/30 text-xs font-semibold transition-all"
            title="Verify 60-digit Security Code"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Verify Code</span>
          </button>

          <button
            onClick={() => onStartCall(contactUser, 'voice')}
            className="p-2 rounded-full hover:bg-slate-800 hover:text-[#00a884] transition-colors"
            title="Voice Call"
          >
            <Phone className="w-5 h-5" />
          </button>

          <button
            onClick={() => onStartCall(contactUser, 'video')}
            className="p-2 rounded-full hover:bg-slate-800 hover:text-[#00a884] transition-colors"
            title="Video Call"
          >
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* WhatsApp Background Chat Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 whatsapp-bg-dark relative">
        {/* E2EE Info Banner */}
        <div className="max-w-md mx-auto p-3 rounded-xl bg-[#182229]/90 border border-[#00a884]/30 text-center shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-center gap-1.5 text-[#00a884] text-xs font-bold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>End-to-End Encrypted Chat</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Messages and calls are end-to-end encrypted with RSA-OAEP & AES-256. No one outside of this chat, not even Ssupp, can read or listen to them.
          </p>
        </div>

        {/* Date Header */}
        <div className="flex items-center justify-center my-2">
          <span className="px-3 py-1 rounded-full bg-[#182229] text-[10px] font-mono text-slate-400 border border-slate-800">
            TODAY
          </span>
        </div>

        {/* Messages Stream */}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
            >
              <div
                className={`max-w-md sm:max-w-lg p-3 rounded-2xl shadow-md relative space-y-1.5 transition-all ${
                  isMe
                    ? 'bg-[#005c4b] text-slate-100 rounded-tr-none'
                    : 'bg-[#202c33] text-slate-100 rounded-tl-none'
                }`}
              >
                {/* Reply preview if quoted */}
                {msg.replyToMessageId && (
                  <div className="p-2 rounded-lg bg-black/20 border-l-4 border-[#00a884] text-xs text-slate-300 italic mb-1">
                    Replying to message...
                  </div>
                )}

                {/* Message Content rendering */}
                {msg.type === 'text' && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                )}

                {msg.type === 'image' && (
                  <div className="space-y-1.5">
                    <img
                      src={msg.mediaUrl}
                      alt="Attachment"
                      onClick={() => setLightboxImage(msg.mediaUrl || null)}
                      className="rounded-xl max-h-72 w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    />
                    {msg.mediaCaption && (
                      <p className="text-xs text-slate-200">{msg.mediaCaption}</p>
                    )}
                  </div>
                )}

                {msg.type === 'sticker' && (
                  <img
                    src={msg.mediaUrl}
                    alt="Sticker"
                    className="w-28 h-28 object-contain my-1"
                  />
                )}

                {msg.type === 'audio' && (
                  <div className="flex items-center gap-3 p-2 bg-black/20 rounded-xl min-w-[220px]">
                    <button
                      onClick={() => togglePlayAudio(msg.id, msg.audioDuration || 10)}
                      className="p-2.5 rounded-full bg-[#00a884] text-slate-950 font-bold hover:scale-105 transition-transform"
                    >
                      {playingAudioId === msg.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1 h-6">
                        {[40, 70, 30, 90, 60, 100, 40, 80, 50, 90, 30, 70].map((h, i) => (
                          <span
                            key={i}
                            style={{ height: `${h}%` }}
                            className={`w-1 rounded-full transition-all ${
                              playingAudioId === msg.id ? 'bg-[#00a884] animate-waveform' : 'bg-slate-400'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                        <span>{msg.audioDuration ? `0:${msg.audioDuration}` : '0:12'}</span>
                        <button
                          onClick={() => setAudioPlaybackSpeed(audioPlaybackSpeed === 1 ? 1.5 : audioPlaybackSpeed === 1.5 ? 2 : 1)}
                          className="px-1.5 py-0.5 rounded bg-black/40 hover:bg-black/60 font-bold"
                        >
                          {audioPlaybackSpeed}x
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Timestamp & Status Ticks */}
                <div className="flex items-center justify-end gap-1.5 pt-0.5 text-[10px] text-slate-300 font-mono">
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />}
                </div>

                {/* Reactions badge display */}
                {Object.keys(msg.reactions || {}).length > 0 && (
                  <div className="absolute -bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#111b21] border border-slate-700 text-xs shadow-md">
                    {Object.entries(msg.reactions).map(([emoji, users]) => (
                      <span key={emoji}>
                        {emoji} {users.length > 1 && users.length}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Hover Quick Emoji Reaction Toolbar */}
              <div
                className={`absolute top-0 ${
                  isMe ? 'right-full mr-2' : 'left-full ml-2'
                } hidden group-hover:flex items-center gap-1 bg-[#1f2c34] p-1 rounded-full border border-slate-700 shadow-xl z-10`}
              >
                {['❤️', '😂', '😮', '😢', '👍', '🔥'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onReactMessage(msg.id, emoji)}
                    className="p-1 hover:scale-125 transition-transform text-xs"
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  onClick={() => setReplyToMessage(msg)}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Reply"
                >
                  <Reply className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Smart Replies Bar */}
      {smartReplies.length > 0 && (
        <div className="px-4 py-2 bg-[#1f2c34] border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            AI Suggestions:
          </span>
          <div className="flex items-center gap-2">
            {smartReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSendMessage(reply, 'text');
                  setSmartReplies([]);
                }}
                className="px-3 py-1 rounded-full bg-[#111b21] hover:bg-[#00a884] hover:text-slate-950 text-slate-200 text-xs font-medium border border-slate-700 transition-all whitespace-nowrap active:scale-95"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reply Quote Banner if replying */}
      {replyToMessage && (
        <div className="px-4 py-2 bg-[#182229] border-t border-slate-800 flex items-center justify-between">
          <div className="border-l-4 border-[#00a884] pl-3">
            <span className="text-xs text-[#00a884] font-bold">Replying to message</span>
            <p className="text-xs text-slate-300 truncate max-w-md">{replyToMessage.content}</p>
          </div>
          <button onClick={() => setReplyToMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticker Picker Modal */}
      {showStickerPicker && (
        <StickerPickerModal
          stickers={stickers}
          onSelectSticker={(stk) => {
            onSendMessage(stk.emoji, 'sticker', stk.url);
            setShowStickerPicker(false);
          }}
          onClose={() => setShowStickerPicker(false)}
        />
      )}

      {/* Bottom Input Area */}
      <div className="p-4 bg-[#1f2c34] border-t border-slate-800/80 z-20">
        <form onSubmit={handleSendText} className="flex items-center gap-3">
          {/* Sticker & Emoji Button */}
          <button
            type="button"
            onClick={() => setShowStickerPicker(!showStickerPicker)}
            className="p-2.5 rounded-full text-slate-400 hover:text-[#00a884] hover:bg-[#111b21] transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Attachment Drawer Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2.5 rounded-full text-slate-400 hover:text-[#00a884] hover:bg-[#111b21] transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {showAttachmentMenu && (
              <div className="absolute bottom-12 left-0 w-48 bg-[#111b21] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in">
                <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-[#1f2c34] cursor-pointer">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Send Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    onSendMessage('Location Pin: 37.7749° N, 122.4194° W (San Francisco)', 'text');
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-[#1f2c34]"
                >
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Send Location</span>
                </button>
              </div>
            )}
          </div>

          {/* Text Input or Voice Recording Bar */}
          {isRecordingVoice ? (
            <div className="flex-1 flex items-center justify-between px-4 py-2 bg-[#111b21] rounded-2xl border border-rose-500/40 animate-pulse">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                <Mic className="w-4 h-4" />
                <span>Recording Voice Note: 0:{recordingTime.toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelVoiceRecording}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Send Voice
                </button>
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type an end-to-end encrypted message..."
              className="flex-1 px-4 py-3 bg-[#111b21] text-slate-100 placeholder-slate-400 text-sm rounded-2xl border border-slate-700/60 focus:outline-none focus:border-[#00a884]"
            />
          )}

          {/* Send or Voice Record Button */}
          {inputText.trim() ? (
            <button
              type="submit"
              className="p-3 rounded-2xl bg-[#00a884] hover:bg-[#008f70] text-slate-950 font-bold shadow-lg transition-transform active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            !isRecordingVoice && (
              <button
                type="button"
                onClick={startVoiceRecording}
                className="p-3 rounded-2xl bg-[#111b21] hover:bg-[#00a884] text-[#00a884] hover:text-slate-950 transition-colors shadow-md"
                title="Hold or Tap to Record Voice Note"
              >
                <Mic className="w-5 h-5" />
              </button>
            )
          )}
        </form>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <PhotoLightboxModal
          imageUrl={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
};
