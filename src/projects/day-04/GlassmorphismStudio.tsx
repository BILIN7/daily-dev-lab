import React, { useState } from 'react';
import { Copy, Check, Sliders, Palette, Layers } from 'lucide-react';

export const GlassmorphismStudio: React.FC = () => {
  const [blur, setBlur] = useState<number>(16);
  const [opacity, setOpacity] = useState<number>(25);
  const [borderOpacity, setBorderOpacity] = useState<number>(30);
  const [borderRadius, setBorderRadius] = useState<number>(24);
  const [tint, setTint] = useState<string>('rgba(255, 255, 255');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const glassStyle: React.CSSProperties = {
    background: `${tint}, ${opacity / 100})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid ${tint}, ${borderOpacity / 100})`,
    borderRadius: `${borderRadius}px`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  };

  const cssCode = `/* Glassmorphism CSS */
background: ${tint}, ${(opacity / 100).toFixed(2)});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: 1px solid ${tint}, ${(borderOpacity / 100).toFixed(2)});
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;

  const tailwindCode = `<!-- Tailwind CSS Equivalent -->
<div className="backdrop-blur-[${blur}px] bg-white/[${(opacity / 100).toFixed(
    2
  )}] border border-white/[${(borderOpacity / 100).toFixed(
    2
  )}] rounded-[${borderRadius}px] shadow-2xl p-6">
  <!-- Content here -->
</div>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Settings / Controls Column */}
      <div className="lg:col-span-5 space-y-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Controls & Glass Tokens
        </h4>

        {/* Blur */}
        <div className="bg-slate-900/70 border border-slate-800 p-3 rounded-xl space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Backdrop Blur</span>
            <span className="font-mono text-emerald-400">{blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Opacity */}
        <div className="bg-slate-900/70 border border-slate-800 p-3 rounded-xl space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Surface Opacity</span>
            <span className="font-mono text-cyan-400">{opacity}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="80"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Border Opacity */}
        <div className="bg-slate-900/70 border border-slate-800 p-3 rounded-xl space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Border Outline Opacity</span>
            <span className="font-mono text-purple-400">{borderOpacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="70"
            value={borderOpacity}
            onChange={(e) => setBorderOpacity(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        {/* Border Radius */}
        <div className="bg-slate-900/70 border border-slate-800 p-3 rounded-xl space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Corner Radius</span>
            <span className="font-mono text-amber-400">{borderRadius}px</span>
          </div>
          <input
            type="range"
            min="4"
            max="48"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Color Tint Presets */}
        <div className="bg-slate-900/70 border border-slate-800 p-3 rounded-xl space-y-2">
          <label className="text-xs text-slate-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-pink-400" /> Tint Tone
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'White / Frost', val: 'rgba(255, 255, 255' },
              { label: 'Obsidian Dark', val: 'rgba(15, 23, 42' },
              { label: 'Emerald Glow', val: 'rgba(16, 185, 129' },
              { label: 'Cyber Violet', val: 'rgba(139, 92, 246' },
            ].map((t) => (
              <button
                key={t.label}
                onClick={() => setTint(t.val)}
                className={`text-[11px] py-1.5 px-1 rounded-lg border text-center transition-all ${
                  tint === t.val
                    ? 'border-emerald-500 bg-slate-800 text-white font-medium'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Canvas & Output Code */}
      <div className="lg:col-span-7 space-y-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" /> Interactive Preview
        </h4>

        {/* Artistic Wallpaper container */}
        <div className="relative h-72 rounded-2xl overflow-hidden p-6 flex items-center justify-center bg-gradient-to-tr from-violet-600 via-indigo-600 to-rose-500">
          {/* Decorative shapes behind */}
          <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-amber-400/80 blur-xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-cyan-400/80 blur-xl animate-pulse" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-pink-500/60 blur-lg" />

          {/* The Glass Component */}
          <div
            style={glassStyle}
            className="relative z-10 w-full max-w-sm p-6 text-white space-y-3 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide uppercase opacity-80">
                Glassmorphism Pro
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80" />
            </div>
            <p className="text-base font-bold leading-tight drop-shadow-sm">
              Modern translucent UI with real-time blur reflection.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs opacity-90 border-t border-white/20">
              <span>Backdrop: {blur}px</span>
              <span>Opacity: {opacity}%</span>
            </div>
          </div>
        </div>

        {/* Code Snippets Export Tabs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-300">Generated Code</span>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(cssCode, 'css')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
              >
                {copiedType === 'css' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Copy CSS
              </button>
              <button
                onClick={() => copyToClipboard(tailwindCode, 'tw')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
              >
                {copiedType === 'tw' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Copy Tailwind
              </button>
            </div>
          </div>
          <pre className="p-3 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-36">
            {cssCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
