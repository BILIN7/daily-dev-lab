import React, { useState, useMemo } from 'react';
import { Play, Copy, Check, Info, Sparkles } from 'lucide-react';

interface Preset {
  label: string;
  pattern: string;
  flags: string;
  sample: string;
  description: string;
}

const PRESETS: Preset[] = [
  {
    label: 'Email Validator',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: 'g',
    sample: 'test@example.com, invalid-email@, user.name+tag@sub.domain.org',
    description: 'Standard RFC-compliant email pattern check'
  },
  {
    label: 'IPv4 Address',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    sample: 'Router IP: 192.168.1.1, Invalid: 999.12.34.56, Localhost: 127.0.0.1',
    description: 'Matches valid 0-255 dotted decimal octets'
  },
  {
    label: 'Hex Color Code',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    flags: 'gi',
    sample: 'Brand colors: #ff007f, #3b82f6, #000, #abc1234 (invalid)',
    description: 'Matches 3 or 6 digit CSS hex color values'
  },
  {
    label: 'URL Extractor',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
    flags: 'gi',
    sample: 'Check out https://github.com/BILIN7 and http://developer.mozilla.org/en-US/docs/Web',
    description: 'Finds standard HTTP and HTTPS web URLs'
  }
];

export const RegexSandbox: React.FC = () => {
  const [pattern, setPattern] = useState<string>('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testString, setTestString] = useState<string>(
    'Contact the team at support@dailydev.io or ping dev.alex@company.org for assistance. Invalid address: john@doe.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const activeFlags = useMemo(() => {
    let str = '';
    if (flags.g) str += 'g';
    if (flags.i) str += 'i';
    if (flags.m) str += 'm';
    if (flags.s) str += 's';
    return str;
  }, [flags]);

  const { matches, error, executionTimeMs } = useMemo(() => {
    if (!pattern.trim()) {
      return { matches: [], error: null, executionTimeMs: 0 };
    }
    const start = performance.now();
    try {
      const regex = new RegExp(pattern, activeFlags);
      const results: { match: string; index: number; groups: string[] }[] = [];

      if (flags.g) {
        let match;
        let count = 0;
        while ((match = regex.exec(testString)) !== null && count < 500) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) regex.lastIndex++;
          count++;
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      const end = performance.now();
      return { matches: results, error: null, executionTimeMs: +(end - start).toFixed(2) };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid Regular Expression';
      return { matches: [], error: message, executionTimeMs: 0 };
    }
  }, [pattern, activeFlags, testString, flags.g]);

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const copyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${activeFlags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: Preset) => {
    setPattern(preset.pattern);
    setTestString(preset.sample);
    setFlags({
      g: preset.flags.includes('g'),
      i: preset.flags.includes('i'),
      m: preset.flags.includes('m'),
      s: preset.flags.includes('s'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Preset Quick Select */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Regex Input Bar */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300 flex justify-between">
          <span>Regular Expression Pattern</span>
          <span className="text-slate-400 font-mono text-[11px]">/{pattern}/{activeFlags}</span>
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 focus-within:border-emerald-500/80 transition-all">
          <span className="text-emerald-400 font-mono text-lg font-bold pl-2 select-none">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Type regex pattern here..."
            className="flex-1 bg-transparent text-emerald-300 font-mono text-sm sm:text-base outline-none placeholder-slate-600 px-1"
          />
          <span className="text-emerald-400 font-mono text-lg font-bold select-none">/</span>

          {/* Flags toggles */}
          <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
            {(['g', 'i', 'm', 's'] as const).map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                  flags[flag]
                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={`Toggle flag: ${flag}`}
              >
                {flag}
              </button>
            ))}
          </div>

          <button
            onClick={copyPattern}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {error && (
          <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-lg p-2.5 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Regex Error: {error}</span>
          </div>
        )}
      </div>

      {/* Test String */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <label className="font-medium text-slate-300">Test String & Match Highlighter</label>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Matches: <strong className="text-emerald-400">{matches.length}</strong></span>
            <span>Eval Time: <strong className="text-slate-300">{executionTimeMs}ms</strong></span>
          </div>
        </div>
        <textarea
          rows={4}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text string to test regex against..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 font-mono text-sm text-slate-200 outline-none focus:border-emerald-500/80 transition-all resize-y"
        />
      </div>

      {/* Captured Results Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-emerald-400" /> Match Results ({matches.length})
        </h4>

        {matches.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No matches found with current pattern and test string.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {matches.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-xs font-mono space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 font-bold bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-900/50">
                    Match #{idx + 1}
                  </span>
                  <span className="text-slate-500 text-[11px]">index: {m.index}</span>
                </div>
                <div className="text-slate-200 truncate bg-slate-900 px-2 py-1 rounded">
                  "{m.match}"
                </div>
                {m.groups.length > 0 && (
                  <div className="pt-1 text-[11px] text-slate-400 space-y-0.5">
                    {m.groups.map((grp, gIdx) => (
                      <div key={gIdx} className="flex gap-1.5">
                        <span className="text-amber-400">Group {gIdx + 1}:</span>
                        <span className="text-slate-300 truncate">"{grp}"</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
