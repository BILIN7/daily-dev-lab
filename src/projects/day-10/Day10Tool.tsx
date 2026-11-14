import React, { useState, useMemo } from 'react';
import {
  Lock,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';

export const Day10Tool: React.FC = () => {
  const [password, setPassword] = useState<string>('Tr0ub4dor&3#Elite2026!');
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Generator Config
  const [genLength, setGenLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);

  // Cryptographic Secure Random Generator
  const generatePassword = () => {
    let charset = '';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

    const array = new Uint32Array(genLength);
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < genLength; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
  };

  // Entropy and Strength Analytics
  const analytics = useMemo(() => {
    const len = password.length;
    if (len === 0) {
      return {
        entropy: 0,
        poolSize: 0,
        crackTime: 'Instant',
        scoreLabel: 'Empty',
        scoreColor: 'text-slate-500',
        barColor: 'bg-slate-700',
        percent: 0,
        hasLower: false,
        hasUpper: false,
        hasNum: false,
        hasSym: false,
      };
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSym = /[^a-zA-Z0-9]/.test(password);

    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNum) poolSize += 10;
    if (hasSym) poolSize += 33;

    // Shannon Entropy: E = L * log2(R)
    const entropy = +(len * Math.log2(poolSize || 1)).toFixed(1);

    // Crack Time estimation assuming 10 Billion guesses/sec (Modern High-end GPU cluster)
    // Combinations = poolSize ^ len
    const guessesPerSecond = 10_000_000_000;
    const totalCombinations = Math.pow(poolSize, len);
    const seconds = totalCombinations / 2 / guessesPerSecond;

    let crackTime = '';
    if (seconds < 1) crackTime = 'Instant (< 1 sec)';
    else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
    else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
    else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
    else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
    else if (seconds < 31536000 * 100) crackTime = `${Math.round(seconds / 31536000)} years`;
    else if (seconds < 31536000 * 1_000_000)
      crackTime = `${Math.round(seconds / 31536000 / 1000)} thousand years`;
    else if (seconds < 31536000 * 1_000_000_000)
      crackTime = `${Math.round(seconds / 31536000 / 1_000_000)} million years`;
    else crackTime = 'Trillions of centuries (Uncrackable)';

    let scoreLabel = 'Very Weak';
    let scoreColor = 'text-rose-500';
    let barColor = 'bg-rose-500';
    let percent = 20;

    if (entropy >= 80) {
      scoreLabel = 'Military Grade (Very Strong)';
      scoreColor = 'text-emerald-400';
      barColor = 'bg-emerald-500';
      percent = 100;
    } else if (entropy >= 60) {
      scoreLabel = 'Strong';
      scoreColor = 'text-cyan-400';
      barColor = 'bg-cyan-500';
      percent = 80;
    } else if (entropy >= 45) {
      scoreLabel = 'Moderate';
      scoreColor = 'text-amber-400';
      barColor = 'bg-amber-400';
      percent = 55;
    } else if (entropy >= 28) {
      scoreLabel = 'Weak';
      scoreColor = 'text-orange-400';
      barColor = 'bg-orange-500';
      percent = 35;
    }

    return {
      entropy,
      poolSize,
      crackTime,
      scoreLabel,
      scoreColor,
      barColor,
      percent,
      hasLower,
      hasUpper,
      hasNum,
      hasSym,
    };
  }, [password]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Password Input & Action Strip */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-400" /> Password Input & Live Auditor
          </label>
          <span className="text-[11px] text-slate-400">
            Length: <strong className="text-white font-mono">{password.length}</strong> chars
          </span>
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-2.5 focus-within:border-emerald-500 transition-all">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or generate a password..."
            className="flex-1 bg-transparent px-2 text-sm sm:text-base font-mono text-emerald-300 outline-none"
          />

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <button
              onClick={() => setShowPassword((prev) => !prev)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            <button
              onClick={copyPassword}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Strength Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-medium">Strength Rating:</span>
          <span className={`font-bold ${analytics.scoreColor}`}>{analytics.scoreLabel}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${analytics.barColor}`}
            style={{ width: `${analytics.percent}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Shannon Entropy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Shannon Entropy
            </span>
            <span className="text-[10px] font-mono text-slate-500">Bits</span>
          </div>
          <p className="text-xl font-mono font-bold text-amber-400">{analytics.entropy} bits</p>
          <p className="text-[10px] text-slate-500">Character Pool: {analytics.poolSize} unique glyphs</p>
        </div>

        {/* Crack Time */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Est. Offline Crack Time
            </span>
            <span className="text-[10px] font-mono text-slate-500">10 GH/s GPU</span>
          </div>
          <p className="text-sm font-semibold text-cyan-300 truncate">{analytics.crackTime}</p>
          <p className="text-[10px] text-slate-500">Brute-force exhaustion baseline</p>
        </div>

        {/* Character Pool Diversity */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
          <span className="text-[11px] text-slate-400">Diversity Check</span>
          <div className="flex flex-wrap gap-1">
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                analytics.hasLower ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-950 text-slate-600'
              }`}
            >
              a-z
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                analytics.hasUpper ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-950 text-slate-600'
              }`}
            >
              A-Z
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                analytics.hasNum ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-950 text-slate-600'
              }`}
            >
              0-9
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                analytics.hasSym ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-950 text-slate-600'
              }`}
            >
              !@#
            </span>
          </div>
        </div>
      </div>

      {/* Built-in Cryptographic Generator */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> CSPRNG Password Generator
          </h4>
          <button
            onClick={generatePassword}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Generate Secure Password
          </button>
        </div>

        {/* Sliders and Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Length Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Target Length</span>
              <span className="font-mono text-emerald-400">{genLength} characters</span>
            </div>
            <input
              type="range"
              min="8"
              max="40"
              value={genLength}
              onChange={(e) => setGenLength(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="accent-emerald-500"
              />
              <span className="text-slate-300">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="accent-emerald-500"
              />
              <span className="text-slate-300">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="accent-emerald-500"
              />
              <span className="text-slate-300">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="accent-emerald-500"
              />
              <span className="text-slate-300">Symbols (!@#$)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
