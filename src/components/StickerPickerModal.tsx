import React, { useState } from 'react';
import { Sticker } from '../types';
import { Smile, Sparkles, Send, X, Loader2 } from 'lucide-react';

interface Props {
  stickers: Sticker[];
  onSelectSticker: (sticker: Sticker) => void;
  onClose: () => void;
}

export const StickerPickerModal: React.FC<Props> = ({ stickers, onSelectSticker, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ai'>('all');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStickers, setGeneratedStickers] = useState<Sticker[]>([]);

  const handleGenerateSticker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-sticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });
      const data = await res.json();
      if (data.sticker) {
        setGeneratedStickers((prev) => [data.sticker, ...prev]);
        onSelectSticker(data.sticker);
      }
    } catch (err) {
      console.error('AI sticker error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="absolute bottom-16 left-4 z-40 w-80 bg-[#1f2c34] rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col h-96 animate-in slide-in-from-bottom-2 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111b21] border-b border-slate-800">
        <div className="flex items-center gap-2 text-[#00a884] font-bold text-xs">
          <Smile className="w-4 h-4" />
          <span>Ssupp Sticker Library</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-800 bg-[#1f2c34] px-4 pt-2 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'text-[#00a884] border-[#00a884]'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          Sticker Packs
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1 ${
            activeTab === 'ai'
              ? 'text-amber-400 border-amber-400'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Sticker Generator</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'all' && (
          <div className="grid grid-cols-4 gap-3">
            {stickers.map((stk) => (
              <button
                key={stk.id}
                onClick={() => onSelectSticker(stk)}
                className="p-2 rounded-xl bg-[#111b21]/60 hover:bg-[#111b21] border border-slate-800 hover:border-[#00a884] transition-all flex flex-col items-center justify-center group active:scale-95"
                title={stk.title}
              >
                <img
                  src={stk.url}
                  alt={stk.title}
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                />
              </button>
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <form onSubmit={handleGenerateSticker} className="space-y-2">
              <label className="block text-[11px] text-slate-300 font-semibold">
                Generate Custom AI Sticker with Gemini:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Party cat, Coding wizard..."
                  className="flex-1 px-3 py-2 bg-[#111b21] text-xs text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-md"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </button>
              </div>
            </form>

            {generatedStickers.length > 0 && (
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-2">
                  Generated Stickers
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {generatedStickers.map((stk) => (
                    <button
                      key={stk.id}
                      onClick={() => onSelectSticker(stk)}
                      className="p-2 rounded-xl bg-[#111b21] border border-amber-500/40 hover:border-amber-400 transition-all flex flex-col items-center justify-center group"
                    >
                      <img src={stk.url} alt={stk.title} className="w-14 h-14 object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
