import React, { useState } from 'react';
import { Sparkles, Terminal, Copy, Check } from 'lucide-react';

export const Day07Tool: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>('Hello World from Day 7!');
  const [outputVal, setOutputVal] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleProcess = () => {
    // Implement your daily challenge logic here!
    setOutputVal(`Processed [Day 7]: ${inputVal.toUpperCase()}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Day 7 Input Console
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter input here..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleProcess}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Run
          </button>
        </div>
      </div>

      {outputVal && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider">Output Result</span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-emerald-300 overflow-x-auto">
            {outputVal}
          </pre>
        </div>
      )}
    </div>
  );
};
