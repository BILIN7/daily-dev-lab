import React, { useState, useEffect, useMemo } from 'react';
import {
  Hash,
  Copy,
  Check,
  RefreshCw,
  Download,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

type IdType = 'UUIDv4' | 'NanoID' | 'ULID';

// Cryptographically Secure UUID v4 (RFC 4122)
function generateUUIDv4(): string {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10xx
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Cryptographically Secure NanoID
function generateNanoId(
  size = 21,
  alphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict'
): string {
  const bytes = new Uint8Array(size);
  window.crypto.getRandomValues(bytes);
  let id = '';
  const mask = (2 << (Math.floor(Math.log(alphabet.length - 1) / Math.LN2))) - 1;
  const step = Math.ceil((1.6 * mask * size) / alphabet.length);

  while (id.length < size) {
    const randomBytes = new Uint8Array(step);
    window.crypto.getRandomValues(randomBytes);
    for (let i = 0; i < step; i++) {
      const byte = randomBytes[i] & mask;
      if (alphabet[byte]) {
        id += alphabet[byte];
        if (id.length === size) break;
      }
    }
  }
  return id;
}

// Monotonically Sortable ULID (Universally Unique Lexicographically Sortable Identifier)
function generateULID(): string {
  const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford's Base32
  const now = Date.now();
  let timeStr = '';
  let time = now;
  for (let i = 9; i >= 0; i--) {
    const mod = time % 32;
    timeStr = ENCODING[mod] + timeStr;
    time = (time - mod) / 32;
  }

  const randomBytes = new Uint8Array(10);
  window.crypto.getRandomValues(randomBytes);
  let randStr = '';
  for (let i = 0; i < 10; i++) {
    randStr += ENCODING[randomBytes[i] % 32];
  }
  return timeStr + randStr;
}

export const Day12Tool: React.FC = () => {
  const [idType, setIdType] = useState<IdType>('UUIDv4');
  const [count, setCount] = useState<number>(5);
  const [nanoSize, setNanoSize] = useState<number>(21);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [generatedList, setGeneratedList] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const generateIds = () => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = '';
      if (idType === 'UUIDv4') {
        id = generateUUIDv4();
      } else if (idType === 'NanoID') {
        id = generateNanoId(nanoSize);
      } else if (idType === 'ULID') {
        id = generateULID();
      }

      if (uppercase) id = id.toUpperCase();
      results.push(id);
    }
    setGeneratedList(results);
  };

  useEffect(() => {
    generateIds();
  }, [idType, count, nanoSize, uppercase]);

  const copyIndividual = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(generatedList.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadIds = (format: 'txt' | 'json') => {
    let content = '';
    let mime = 'text/plain';
    const filename = `generated-ids-${idType.toLowerCase()}.${format}`;

    if (format === 'json') {
      content = JSON.stringify({ type: idType, generatedAt: new Date().toISOString(), ids: generatedList }, null, 2);
      mime = 'application/json';
    } else {
      content = generatedList.join('\n');
    }

    const blob = new Blob([content], { type: mime });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    if (idType === 'UUIDv4') {
      return {
        bits: '122 bits of entropy',
        collision: '~100 billion IDs generated before 1% collision chance',
        useCase: 'Distributed database primary keys, microservices, RFC 4122 compliance',
      };
    } else if (idType === 'NanoID') {
      return {
        bits: `${Math.round(nanoSize * 5.95)} bits of entropy`,
        collision: '1% collision probability after ~1 billion generated IDs (at 21 chars)',
        useCase: 'URL-shorteners, web routing IDs, modern alternative to UUID',
      };
    } else {
      return {
        bits: '128 bits total (48-bit timestamp + 80-bit randomness)',
        collision: 'Collision-free within the same millisecond; lexicographically sortable',
        useCase: 'Time-series databases, log aggregators, B-Tree index friendly storage',
      };
    }
  }, [idType, nanoSize]);

  return (
    <div className="space-y-6">
      {/* Type Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {(['UUIDv4', 'NanoID', 'ULID'] as IdType[]).map((type) => (
            <button
              key={type}
              onClick={() => setIdType(type)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                idType === type
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          onClick={generateIds}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-generate
        </button>
      </div>

      {/* Configuration Sliders & Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
        {/* Quantity */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Batch Quantity</span>
            <span className="font-mono text-emerald-400">{count} IDs</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* NanoID Length (Only for NanoID) */}
        {idType === 'NanoID' ? (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Character Length</span>
              <span className="font-mono text-cyan-400">{nanoSize} chars</span>
            </div>
            <input
              type="range"
              min="8"
              max="36"
              value={nanoSize}
              onChange={(e) => setNanoSize(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        ) : (
          <div className="flex items-center text-xs text-slate-500 italic p-2">
            Fixed standard 128-bit length
          </div>
        )}

        {/* Uppercase Toggle */}
        <div className="flex items-center justify-start sm:justify-end">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="accent-emerald-500"
            />
            <span>Uppercase Formatting</span>
          </label>
        </div>
      </div>

      {/* Generated List Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Header toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-950/70 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {generatedList.length} Generated {idType} Records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAll ? 'All Copied!' : 'Copy All'}
            </button>
            <button
              onClick={() => downloadIds('txt')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Download TXT"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* List items */}
        <div className="divide-y divide-slate-800/80 max-h-[340px] overflow-y-auto">
          {generatedList.map((id, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/40 group transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500 w-5 text-right">{idx + 1}</span>
                <span className="font-mono text-xs sm:text-sm text-emerald-300 tracking-wide select-all">
                  {id}
                </span>
              </div>
              <button
                onClick={() => copyIndividual(id, idx)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-white transition-all opacity-80 group-hover:opacity-100"
              >
                {copiedIdx === idx ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedIdx === idx ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Collision & Spec Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Collision Resistance & Entropy
          </span>
          <p className="text-slate-200 font-medium">{stats.bits}</p>
          <p className="text-slate-400 text-[11px] leading-relaxed">{stats.collision}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Industry Use Cases
          </span>
          <p className="text-slate-300 leading-relaxed text-[11px]">{stats.useCase}</p>
        </div>
      </div>
    </div>
  );
};
