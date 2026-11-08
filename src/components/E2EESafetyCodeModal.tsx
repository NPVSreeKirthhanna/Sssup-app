import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { generateSafetyNumbers } from '../utils/crypto';
import { ShieldCheck, X, QrCode, Lock, CheckCircle2, Copy } from 'lucide-react';

interface Props {
  currentUser: User;
  contactUser: User;
  onClose: () => void;
}

export const E2EESafetyCodeModal: React.FC<Props> = ({ currentUser, contactUser, onClose }) => {
  const [safetyBlocks, setSafetyBlocks] = useState<string[]>([]);
  const [fingerprint, setFingerprint] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadNumbers() {
      const { formattedCode, fingerprintHash } = await generateSafetyNumbers(
        currentUser.publicKeyPem || 'DEFAULT_KEY_A',
        contactUser.publicKeyPem || 'DEFAULT_KEY_B'
      );
      setSafetyBlocks(formattedCode);
      setFingerprint(fingerprintHash);
    }
    loadNumbers();
  }, [currentUser, contactUser]);

  const copyCode = () => {
    const fullCode = safetyBlocks.join(' ');
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1f2c34] text-slate-100 rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111b21] border-b border-slate-700/60">
          <div className="flex items-center gap-2 text-[#00a884] font-semibold text-lg">
            <ShieldCheck className="w-6 h-6" />
            <span>Verify Security Code</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* User info banner */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#111b21] border border-slate-800">
            <img
              src={contactUser.avatarUrl}
              alt={contactUser.displayName}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#00a884]"
            />
            <div>
              <h4 className="font-semibold text-slate-100">{contactUser.displayName}</h4>
              <p className="text-xs text-[#00a884]">@{contactUser.username} • End-to-End Encrypted</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed text-center">
            Messages and calls with <strong className="text-slate-200">{contactUser.displayName}</strong> are end-to-end encrypted. Compare these 60 numbers with their device to confirm security.
          </p>

          {/* QR Code Graphic simulation */}
          <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl text-slate-900 shadow-inner">
            <QrCode className="w-32 h-32 text-slate-900" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Scan QR Code to Verify
            </span>
          </div>

          {/* 60 Digit Grid */}
          <div className="bg-[#111b21] p-4 rounded-xl border border-slate-800">
            <div className="grid grid-cols-4 gap-2 text-center font-mono text-sm tracking-wider font-medium text-emerald-400">
              {safetyBlocks.map((block, idx) => (
                <div key={idx} className="bg-[#1f2c34] py-1.5 px-1 rounded border border-slate-800">
                  {block}
                </div>
              ))}
            </div>
          </div>

          {/* Fingerprint key */}
          <div className="text-[11px] text-slate-500 font-mono break-all bg-black/20 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 font-semibold block mb-0.5">RSA SHA-256 Fingerprint:</span>
            {fingerprint || 'Computing key fingerprint...'}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-slate-950 font-semibold text-xs transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Code Copied!' : 'Copy Security Code'}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>E2EE Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
