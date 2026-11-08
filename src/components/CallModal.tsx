import React, { useEffect, useRef, useState } from 'react';
import { User } from '../types';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ShieldCheck,
  Volume2,
  VolumeX,
  Phone,
  Maximize2,
  Minimize2,
  Monitor
} from 'lucide-react';

interface Props {
  currentUser: User;
  contactUser: User;
  callType: 'voice' | 'video';
  isIncoming?: boolean;
  onEndCall: (durationSeconds: number) => void;
}

export const CallModal: React.FC<Props> = ({
  currentUser,
  contactUser,
  callType,
  isIncoming = false,
  onEndCall,
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>(
    isIncoming ? 'ringing' : 'ringing'
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'voice');
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [duration, setDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const ringtoneAudioCtx = useRef<AudioContext | null>(null);

  // Sound generator for authentic ringing tones
  useEffect(() => {
    let interval: any = null;
    if (callStatus === 'ringing') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          ringtoneAudioCtx.current = new AudioCtx();
          
          const playTone = () => {
            if (!ringtoneAudioCtx.current) return;
            const osc = ringtoneAudioCtx.current.createOscillator();
            const gain = ringtoneAudioCtx.current.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ringtoneAudioCtx.current.currentTime);
            gain.gain.setValueAtTime(0.08, ringtoneAudioCtx.current.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ringtoneAudioCtx.current.currentTime + 1.2);
            osc.connect(gain);
            gain.connect(ringtoneAudioCtx.current.destination);
            osc.start();
            osc.stop(ringtoneAudioCtx.current.currentTime + 1.2);
          };

          playTone();
          interval = setInterval(playTone, 3000);
        }
      } catch (err) {
        console.warn('AudioContext ringtone error:', err);
      }

      // Auto-connect after 3 seconds if outgoing
      if (!isIncoming) {
        const timeout = setTimeout(() => {
          setCallStatus('connected');
        }, 3200);
        return () => {
          clearTimeout(timeout);
          if (interval) clearInterval(interval);
        };
      }
    }

    return () => {
      if (interval) clearInterval(interval);
      if (ringtoneAudioCtx.current) {
        ringtoneAudioCtx.current.close().catch(() => {});
      }
    };
  }, [callStatus, isIncoming]);

  // Request Camera & Mic
  useEffect(() => {
    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: callType === 'video',
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Media devices access fallback:', err);
      }
    }

    startMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [callType]);

  // Call timer
  useEffect(() => {
    let timer: any = null;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    }
    setIsVideoOff(!isVideoOff);
  };

  const handleAcceptIncoming = () => {
    setCallStatus('connected');
  };

  const handleEnd = () => {
    setCallStatus('ended');
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    onEndCall(duration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b141a]/95 backdrop-blur-xl animate-in zoom-in-95 duration-200">
      {/* Container */}
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] bg-[#111b21] rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="z-20 flex items-center justify-between p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a884]/20 text-[#00a884] text-xs font-semibold border border-[#00a884]/40">
              <ShieldCheck className="w-4 h-4" />
              <span>End-to-End Encrypted</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {callType === 'video' ? 'HD Video Call' : 'Voice Call'}
            </span>
          </div>

          {callStatus === 'connected' && (
            <div className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-emerald-400 font-mono text-sm font-medium">
              {formatTime(duration)}
            </div>
          )}
        </div>

        {/* Video or Avatar Display Area */}
        <div className="relative flex-1 flex items-center justify-center p-6">
          {callType === 'video' && !isVideoOff ? (
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {/* Simulated Remote Stream or Avatar */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                <img
                  src={contactUser.avatarUrl}
                  alt={contactUser.displayName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#00a884] shadow-2xl animate-pulse"
                />
                <h3 className="mt-4 text-xl font-bold text-white">{contactUser.displayName}</h3>
                <p className="text-xs text-slate-400">@{contactUser.username}</p>
              </div>

              {/* Local User Self Video Stream */}
              <div className="absolute bottom-4 right-4 w-44 h-60 rounded-xl overflow-hidden border-2 border-[#00a884] bg-slate-950 shadow-2xl z-10">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white font-medium">
                  You ({currentUser.displayName.split(' ')[0]})
                </span>
              </div>
            </div>
          ) : (
            /* Voice Call View */
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative">
                <img
                  src={contactUser.avatarUrl}
                  alt={contactUser.displayName}
                  className="w-40 h-40 rounded-full object-cover border-4 border-[#00a884] shadow-2xl shadow-[#00a884]/20"
                />
                {callStatus === 'ringing' && (
                  <div className="absolute -inset-2 rounded-full border-2 border-[#00a884] animate-ping opacity-60" />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-100">{contactUser.displayName}</h2>
                <p className="text-sm text-[#00a884] font-medium mt-1">@{contactUser.username}</p>
                <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-widest">
                  {callStatus === 'ringing'
                    ? isIncoming
                      ? 'Incoming Ssupp Call...'
                      : 'Ringing Ssupp E2EE line...'
                    : 'End-to-End Encrypted Voice Connection'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="z-20 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-center gap-6">
          {callStatus === 'ringing' && isIncoming ? (
            /* Accept / Reject Buttons for Incoming Call */
            <div className="flex items-center gap-8">
              <button
                onClick={handleEnd}
                className="flex flex-col items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors"
              >
                <div className="p-4 rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-500 transition-transform active:scale-95">
                  <PhoneOff className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold">Decline</span>
              </button>

              <button
                onClick={handleAcceptIncoming}
                className="flex flex-col items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <div className="p-4 rounded-full bg-[#00a884] text-slate-950 shadow-lg hover:bg-[#008f70] transition-transform active:scale-95 animate-bounce">
                  <Phone className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold">Answer</span>
              </button>
            </div>
          ) : (
            /* Active Call Buttons */
            <div className="flex items-center gap-4 bg-[#1f2c34]/90 px-6 py-3 rounded-2xl border border-slate-700/60 shadow-2xl backdrop-blur-md">
              <button
                onClick={toggleMute}
                className={`p-3.5 rounded-full transition-all ${
                  isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3.5 rounded-full transition-all ${
                  isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsSpeakerOff(!isSpeakerOff)}
                className={`p-3.5 rounded-full transition-all ${
                  isSpeakerOff ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Toggle Speaker"
              >
                {isSpeakerOff ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3.5 rounded-full transition-all ${
                  isScreenSharing ? 'bg-[#00a884] text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-5 h-5" />
              </button>

              <button
                onClick={handleEnd}
                className="p-3.5 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-lg transition-all active:scale-95 ml-2"
                title="End Call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
