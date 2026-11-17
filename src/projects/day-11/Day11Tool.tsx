import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowLeftRight,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(clean)) return null;
  const fullHex = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const Day11Tool: React.FC = () => {
  const [textColor, setTextColor] = useState<string>('#10b981');
  const [bgColor, setBgColor] = useState<string>('#090d16');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Calculate Contrast Metrics
  const contrastData = useMemo(() => {
    const rgbText = hexToRgb(textColor);
    const rgbBg = hexToRgb(bgColor);

    if (!rgbText || !rgbBg) {
      return { ratio: 1, valid: false };
    }

    const lumText = getLuminance(rgbText.r, rgbText.g, rgbText.b);
    const lumBg = getLuminance(rgbBg.r, rgbBg.g, rgbBg.b);

    const lighter = Math.max(lumText, lumBg);
    const darker = Math.min(lumText, lumBg);
    const ratio = +((lighter + 0.05) / (darker + 0.05)).toFixed(2);

    return {
      ratio,
      valid: true,
      normalAA: ratio >= 4.5,
      normalAAA: ratio >= 7.0,
      largeAA: ratio >= 3.0,
      largeAAA: ratio >= 4.5,
      uiComponents: ratio >= 3.0,
    };
  }, [textColor, bgColor]);

  // Generate Harmonies based on textColor
  const harmonies = useMemo(() => {
    const rgb = hexToRgb(textColor);
    if (!rgb) return [];
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return [
      {
        name: 'Complementary',
        desc: 'Opposite on color wheel (+180°)',
        color: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      },
      {
        name: 'Analogous Warm',
        desc: 'Adjacent harmony (+30°)',
        color: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
      },
      {
        name: 'Analogous Cool',
        desc: 'Adjacent harmony (-30°)',
        color: hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l),
      },
      {
        name: 'Triadic A',
        desc: 'Triad 120° step',
        color: hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      },
      {
        name: 'Triadic B',
        desc: 'Triad 240° step',
        color: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
      },
    ];
  }, [textColor]);

  const swapColors = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Color Selectors & Swap Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        {/* Text / Foreground Color */}
        <div className="md:col-span-5 flex items-center gap-3">
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-12 h-12 rounded-xl border border-slate-700 bg-transparent cursor-pointer p-0.5 shrink-0"
          />
          <div className="flex-1 space-y-0.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Text / Foreground Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-emerald-300 outline-none focus:border-emerald-500 uppercase"
              />
              <button
                onClick={() => copyToClipboard(textColor)}
                className="text-slate-400 hover:text-white text-xs"
                title="Copy HEX"
              >
                {copiedColor === textColor ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-2 flex justify-center">
          <button
            onClick={swapColors}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-md hover:rotate-180 duration-200"
            title="Swap Text & Background Colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Background Color */}
        <div className="md:col-span-5 flex items-center gap-3">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-12 h-12 rounded-xl border border-slate-700 bg-transparent cursor-pointer p-0.5 shrink-0"
          />
          <div className="flex-1 space-y-0.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-300 outline-none focus:border-cyan-500 uppercase"
              />
              <button
                onClick={() => copyToClipboard(bgColor)}
                className="text-slate-400 hover:text-white text-xs"
                title="Copy HEX"
              >
                {copiedColor === bgColor ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WCAG Compliance Badge Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Contrast Ratio Hero Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-center items-center text-center space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Contrast Ratio
          </span>
          <p
            className={`text-3xl font-mono font-extrabold ${
              contrastData.ratio >= 7.0
                ? 'text-emerald-400'
                : contrastData.ratio >= 4.5
                ? 'text-cyan-400'
                : contrastData.ratio >= 3.0
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {contrastData.ratio}:1
          </p>
          <span className="text-[10px] text-slate-500 font-mono">WCAG 2.1 Standard</span>
        </div>

        {/* Normal Text (< 18pt) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-300">Normal Body Text</span>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Level AA (4.5:1)</span>
              {contrastData.normalAA ? (
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 font-bold">
                  <XCircle className="w-3.5 h-3.5" /> Fail
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Level AAA (7.0:1)</span>
              {contrastData.normalAAA ? (
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 font-bold">
                  <XCircle className="w-3.5 h-3.5" /> Fail
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Large Text (>= 18pt / 14pt bold) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-300">Large & Bold Text</span>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Level AA (3.0:1)</span>
              {contrastData.largeAA ? (
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 font-bold">
                  <XCircle className="w-3.5 h-3.5" /> Fail
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Level AAA (4.5:1)</span>
              {contrastData.largeAAA ? (
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 font-bold">
                  <XCircle className="w-3.5 h-3.5" /> Fail
                </span>
              )}
            </div>
          </div>
        </div>

        {/* UI Elements & Icons */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-300">UI Icons & Borders</span>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Level AA (3.0:1)</span>
              {contrastData.uiComponents ? (
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 font-bold">
                  <XCircle className="w-3.5 h-3.5" /> Fail
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500">Buttons, focus rings, graphical objects</p>
          </div>
        </div>
      </div>

      {/* Live Preview Canvas Sandbox */}
      <div
        style={{ backgroundColor: bgColor, color: textColor }}
        className="rounded-2xl p-6 sm:p-8 transition-colors border border-slate-800 shadow-xl space-y-4"
      >
        <div className="flex justify-between items-center pb-2 border-b border-current/20">
          <span className="text-xs uppercase tracking-widest font-mono font-bold opacity-80">
            Live Rendering Component Preview
          </span>
          <span className="text-xs font-mono font-bold opacity-90 px-2 py-0.5 rounded border border-current">
            {contrastData.ratio}:1 Ratio
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
          Accessible Typography & Visual Hierarchy
        </h3>

        <p className="text-sm leading-relaxed max-w-2xl opacity-90">
          Good contrast ensures legibility for people with visual impairments, color blindness, or
          users viewing displays in direct sunlight. Always verify both normal body copy and interactive accents.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            style={{ borderColor: textColor, color: textColor }}
            className="px-4 py-2 rounded-xl text-xs font-bold border-2 hover:opacity-80 transition-opacity"
          >
            Interactive Button
          </button>
          <div
            style={{ backgroundColor: textColor, color: bgColor }}
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-md"
          >
            Inverted Primary CTA
          </div>
        </div>
      </div>

      {/* Color Harmonies Strip */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Harmonic Palettes Generated from {textColor}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {harmonies.map((h) => (
            <div
              key={h.name}
              onClick={() => copyToClipboard(h.color)}
              className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer space-y-2 group transition-all"
            >
              <div
                style={{ backgroundColor: h.color }}
                className="w-full h-12 rounded-lg shadow-inner group-hover:scale-[1.02] transition-transform"
              />
              <div>
                <p className="text-xs font-semibold text-slate-200">{h.name}</p>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-0.5">
                  <span>{h.color}</span>
                  {copiedColor === h.color ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
