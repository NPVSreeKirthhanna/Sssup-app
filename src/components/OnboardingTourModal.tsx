import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Lock,
  Camera,
  Smile,
  Mic,
  Phone,
  Video,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  X
} from 'lucide-react';

interface Props {
  userName: string;
  onFinishTour: () => void;
}

interface TourStep {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
  points: { title: string; desc: string }[];
  highlightTip: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Profile & DP Customization',
    subtitle: 'Setup your avatar and public profile identity',
    icon: <Camera className="w-8 h-8 text-[#00a884]" />,
    badge: 'Step 1 of 5',
    points: [
      { title: 'Upload Photo DP', desc: 'Click your avatar at the bottom sidebar to upload a custom profile picture or select from high quality presets.' },
      { title: 'Choose @Username', desc: 'Your unique @username is how friends find and request you on Ssupp.' },
      { title: 'RSA E2EE Public Key', desc: 'Ssupp automatically generates a 2048-bit Web Crypto keypair for private message decryption.' },
    ],
    highlightTip: 'Tip: You can edit your bio status or copy your public key anytime from Profile Settings.',
  },
  {
    title: 'Instagram-Style @Username Requests',
    subtitle: 'Connect securely with friends before chatting',
    icon: <UserPlus className="w-8 h-8 text-[#00a884]" />,
    badge: 'Step 2 of 5',
    points: [
      { title: 'Search @Username', desc: 'Click the + icon in the header to search any user by their exact @username handle.' },
      { title: 'Send Intro Request', desc: 'Add an optional introductory greeting message when sending a friend request.' },
      { title: 'Accept & Unlock Chat', desc: 'Review incoming requests under the Requests tab. Accepting unlocks end-to-end encrypted chat.' },
    ],
    highlightTip: 'Tip: Incoming requests show a green badge counter on the sidebar.',
  },
  {
    title: 'End-to-End Encryption & Contact Naming',
    subtitle: 'Maximum privacy and WhatsApp contact organization',
    icon: <Lock className="w-8 h-8 text-[#00a884]" />,
    badge: 'Step 3 of 5',
    points: [
      { title: 'RSA-OAEP + AES-256 E2EE', desc: 'All text messages are encrypted on your device before sending over the network.' },
      { title: '60-Digit Security Code', desc: 'Click "Verify Code" in the chat header to verify safety numbers and scan QR codes with contacts.' },
      { title: 'Save Contact Names', desc: 'Click the pencil icon in the chat header to save friends with custom names (e.g. Alex Bestie, Work) just like WhatsApp!' },
    ],
    highlightTip: 'Tip: Saved contact names are private to your device and customize your chat list view.',
  },
  {
    title: 'Rich Media, Voice Notes & Gemini AI',
    subtitle: 'Express yourself with photos, stickers, and audio',
    icon: <Sparkles className="w-8 h-8 text-amber-400" />,
    badge: 'Step 4 of 5',
    points: [
      { title: 'Send Photos & Lightbox', desc: 'Attach photos with optional captions and tap images for full-screen lightbox zoom & download.' },
      { title: 'Real Voice Notes', desc: 'Hold or tap the mic icon to record voice messages with waveform playback and 1.5x/2x speed controls.' },
      { title: 'Gemini AI Custom Stickers', desc: 'Use the sticker drawer to type any prompt (e.g. "Coding cat") and generate custom AI stickers!' },
    ],
    highlightTip: 'Tip: Tap AI Smart Reply chips above the chat bar for 1-click contextual responses.',
  },
  {
    title: 'WebRTC Voice & Video Calls',
    subtitle: 'High-definition encrypted calling directly in your browser',
    icon: <Video className="w-8 h-8 text-[#00a884]" />,
    badge: 'Step 5 of 5',
    points: [
      { title: 'Instant Audio & Video Line', desc: 'Click the Phone or Video icon in any chat header to start a call with your camera and mic.' },
      { title: 'In-Call Controls', desc: 'Toggle microphone mute, video stream, flip camera, share screen, or inspect call duration clock.' },
      { title: 'Calls History Log', desc: 'View completed, incoming, or missed calls under the Calls tab.' },
    ],
    highlightTip: 'Tip: Ssupp calls are fully end-to-end encrypted with zero server recording.',
  },
];

export const OnboardingTourModal: React.FC<Props> = ({ userName, onFinishTour }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = TOUR_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onFinishTour();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#111b21] text-slate-100 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col">
        {/* Progress header bar */}
        <div className="p-6 bg-[#1f2c34] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#111b21] border border-slate-700/80 shadow-md">
              {step.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00a884] text-slate-950 font-mono">
                  {step.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">Welcome {userName}!</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mt-0.5">{step.title}</h2>
            </div>
          </div>

          <button
            onClick={onFinishTour}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-8 space-y-6 flex-1 overflow-y-auto max-h-[60vh]">
          <p className="text-xs text-slate-300 font-medium">{step.subtitle}</p>

          <div className="space-y-4">
            {step.points.map((pt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#1f2c34]/70 border border-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-[#00a884]/20 text-[#00a884] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#00a884]/40">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">{pt.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Highlight Tip Card */}
          <div className="p-3.5 rounded-2xl bg-[#00a884]/10 border border-[#00a884]/30 text-xs text-emerald-300 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00a884] shrink-0" />
            <span>{step.highlightTip}</span>
          </div>
        </div>

        {/* Navigation Controls Footer */}
        <div className="p-6 bg-[#1f2c34] border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onFinishTour}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Skip Tour
          </button>

          {/* Indicators */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStepIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentStepIndex
                    ? 'w-6 bg-[#00a884]'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              <span>{isLastStep ? 'Got It! Start Messaging' : 'Next Step'}</span>
              {isLastStep ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
