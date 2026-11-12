import React, { useState, useMemo } from 'react';
import { Clock, Calendar, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';

interface CronPreset {
  label: string;
  expression: string;
  description: string;
}

const CRON_PRESETS: CronPreset[] = [
  { label: 'Every 15 Minutes', expression: '*/15 * * * *', description: 'Runs every 15 minutes around the clock' },
  { label: 'Every Hour', expression: '0 * * * *', description: 'At minute 0 of every hour' },
  { label: 'Daily at Midnight', expression: '0 0 * * *', description: 'Every single midnight (00:00 UTC)' },
  { label: 'Weekdays at 9:00 AM', expression: '0 9 * * 1-5', description: 'Monday through Friday morning work hours' },
  { label: 'Every Sunday at 2 AM', expression: '0 2 * * 0', description: 'Weekly backup / maintenance window' },
  { label: '1st Day of Month', expression: '0 0 1 * *', description: 'Monthly billing or audit runs' },
];

function humanizeCron(cron: string): { text: string; error: string | null } {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      text: '',
      error: `Standard cron expressions require 5 parts (found ${parts.length}): [min] [hour] [day-of-month] [month] [day-of-week]`,
    };
  }

  const [min, hour, dom, mon, dow] = parts;

  try {
    let summary = 'Runs ';

    // Minute & Hour handling
    if (min === '*' && hour === '*') {
      summary += 'every minute';
    } else if (min.startsWith('*/') && hour === '*') {
      const step = min.replace('*/', '');
      summary += `every ${step} minutes`;
    } else if (hour.startsWith('*/') && min === '0') {
      const step = hour.replace('*/', '');
      summary += `every ${step} hours`;
    } else if (hour !== '*' && min !== '*') {
      const h = parseInt(hour, 10);
      const m = parseInt(min, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m.toString().padStart(2, '0');
      summary += `at ${displayH}:${displayM} ${ampm}`;
    } else if (hour === '*' && min !== '*') {
      summary += `at minute ${min} of every hour`;
    }

    // Day of Month handling
    if (dom !== '*') {
      summary += `, on day ${dom} of the month`;
    }

    // Month handling
    if (mon !== '*') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mIdx = parseInt(mon, 10);
      summary += ` in ${months[mIdx - 1] || 'month ' + mon}`;
    }

    // Day of Week handling
    if (dow !== '*') {
      if (dow === '1-5') {
        summary += `, Monday through Friday`;
      } else if (dow === '0,6' || dow === '6,0') {
        summary += `, on weekends`;
      } else {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const dayName = days[parseInt(dow, 10)] || `day-of-week ${dow}`;
        summary += `, on ${dayName}`;
      }
    }

    return { text: summary + '.', error: null };
  } catch (err: unknown) {
    return { text: '', error: 'Could not parse expression' };
  }
}

export const CronExplainer: React.FC = () => {
  const [expression, setExpression] = useState<string>('0 9 * * 1-5');
  const [copied, setCopied] = useState<boolean>(false);

  const parsed = useMemo(() => humanizeCron(expression), [expression]);

  const parts = useMemo(() => {
    const split = expression.trim().split(/\s+/);
    return [
      { name: 'Minute', val: split[0] || '-', range: '0-59' },
      { name: 'Hour', val: split[1] || '-', range: '0-23' },
      { name: 'Day of Month', val: split[2] || '-', range: '1-31' },
      { name: 'Month', val: split[3] || '-', range: '1-12' },
      { name: 'Day of Week', val: split[4] || '-', range: '0-6 (Sun-Sat)' },
    ];
  }, [expression]);

  const copyExpr = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
        </span>
        {CRON_PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setExpression(p.expression)}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300 flex justify-between">
          <span>Cron Expression (5 parts)</span>
          <button
            onClick={copyExpr}
            className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[11px]"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </label>
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-3 focus-within:border-emerald-500/80 transition-all">
          <Clock className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="* * * * *"
            className="flex-1 bg-transparent text-emerald-300 font-mono text-lg font-bold outline-none placeholder-slate-600"
          />
        </div>
      </div>

      {/* Five Parts Dissection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {parts.map((p, i) => (
          <div
            key={i}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center space-y-1"
          >
            <p className="text-[11px] text-slate-400 font-medium truncate">{p.name}</p>
            <p className="text-base font-mono font-bold text-slate-100">{p.val}</p>
            <p className="text-[10px] text-slate-500 font-mono">{p.range}</p>
          </div>
        ))}
      </div>

      {/* Human Explanation Output */}
      {parsed.error ? (
        <div className="bg-rose-950/40 border border-rose-900/50 rounded-xl p-4 flex items-center gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{parsed.error}</span>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border border-emerald-500/30 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Calendar className="w-4 h-4" /> Plain English Translation
          </div>
          <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
            "{parsed.text}"
          </p>
        </div>
      )}
    </div>
  );
};
