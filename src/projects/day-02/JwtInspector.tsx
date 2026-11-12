import React, { useState, useMemo } from 'react';
import { ShieldAlert, ShieldCheck, Key, Clock, Copy, Check, Info } from 'lucide-react';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMzQ1Njc4OTAiLCJuYW1lIjoiQWxleCBDb2RlciIsImFkbWluIjp0cnVlLCJpYXQiOjE3MDQxNTM2MDAsImV4cCI6MTc5ODc2MTYwMCwicm9sZXMiOlsic3VwZXJhZG1pbiIsImRldmVsb3BlciJdfQ.dGFraW5nbXlvd25zaWduYXR1cmVmb3JkZXZlbG9wbWVudHRlc3Rpbmc';

function base64UrlDecode(str: string) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('Illegal base64url string!');
  }
  return decodeURIComponent(
    atob(output)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export const JwtInspector: React.FC = () => {
  const [token, setToken] = useState<string>(SAMPLE_JWT);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const parsed = useMemo(() => {
    if (!token.trim()) {
      return { valid: false, error: 'Paste a JWT token to inspect' };
    }

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return {
        valid: false,
        error: `Invalid JWT format. Found ${parts.length} segments, expected 3 (header.payload.signature).`,
      };
    }

    try {
      const headerJson = JSON.parse(base64UrlDecode(parts[0]));
      const payloadJson = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];

      const now = Math.floor(Date.now() / 1000);
      let isExpired = false;
      let expDateStr = null;
      let remainingSec = null;

      if (payloadJson.exp) {
        isExpired = payloadJson.exp < now;
        expDateStr = new Date(payloadJson.exp * 1000).toLocaleString();
        remainingSec = payloadJson.exp - now;
      }

      let issuedAtStr = null;
      if (payloadJson.iat) {
        issuedAtStr = new Date(payloadJson.iat * 1000).toLocaleString();
      }

      return {
        valid: true,
        header: headerJson,
        payload: payloadJson,
        signature,
        isExpired,
        expDateStr,
        remainingSec,
        issuedAtStr,
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Base64 decoding failed';
      return { valid: false, error: `Malformed token encoding: ${msg}` };
    }
  }, [token]);

  const copyText = (txt: string, section: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Key className="w-4 h-4 text-emerald-400" /> Encoded JWT String
          </label>
          <button
            onClick={() => setToken(SAMPLE_JWT)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 underline"
          >
            Load Sample Token
          </button>
        </div>
        <textarea
          rows={3}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOi..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs sm:text-sm text-amber-200/90 outline-none focus:border-emerald-500 transition-all resize-y break-all"
        />
      </div>

      {parsed.error && (
        <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl p-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{parsed.error}</span>
        </div>
      )}

      {parsed.valid && parsed.header && parsed.payload && (
        <div className="space-y-4">
          {/* Status badge strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Algorithm</p>
                <p className="text-sm font-mono font-bold text-slate-200">
                  {parsed.header.alg || 'None'} ({parsed.header.typ || 'JWT'})
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  parsed.isExpired
                    ? 'bg-rose-500/10 text-rose-400'
                    : 'bg-emerald-500/10 text-emerald-400'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Expiration Status</p>
                <p
                  className={`text-sm font-semibold ${
                    parsed.isExpired ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {parsed.expDateStr
                    ? parsed.isExpired
                      ? 'Expired'
                      : 'Active / Valid'
                    : 'No Expiration (Lifetime)'}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Subject (sub)</p>
                <p className="text-sm font-mono font-bold text-slate-200 truncate max-w-[130px]">
                  {parsed.payload.sub || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Decoded columns: Header & Payload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Header Box */}
            <div className="bg-slate-900/70 border border-rose-500/30 rounded-xl overflow-hidden">
              <div className="bg-rose-950/30 px-3 py-2 border-b border-rose-900/40 flex justify-between items-center">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  Header: Algorithm & Type
                </span>
                <button
                  onClick={() =>
                    copyText(JSON.stringify(parsed.header, null, 2), 'header')
                  }
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                >
                  {copiedSection === 'header' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedSection === 'header' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 text-xs font-mono text-rose-200/90 overflow-x-auto">
                {JSON.stringify(parsed.header, null, 2)}
              </pre>
            </div>

            {/* Payload Box */}
            <div className="bg-slate-900/70 border border-purple-500/30 rounded-xl overflow-hidden">
              <div className="bg-purple-950/30 px-3 py-2 border-b border-purple-900/40 flex justify-between items-center">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  Payload: Claims & Data
                </span>
                <button
                  onClick={() =>
                    copyText(JSON.stringify(parsed.payload, null, 2), 'payload')
                  }
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                >
                  {copiedSection === 'payload' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedSection === 'payload' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 text-xs font-mono text-purple-200/90 overflow-x-auto max-h-64">
                {JSON.stringify(parsed.payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Signature Box */}
          <div className="bg-slate-900/70 border border-cyan-500/30 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Signature (HMAC / RSA Base64url)
              </span>
              <button
                onClick={() => copyText(parsed.signature || '', 'sig')}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                {copiedSection === 'sig' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedSection === 'sig' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="font-mono text-xs text-cyan-200/80 break-all bg-slate-950/60 p-2 rounded-lg border border-cyan-900/40">
              {parsed.signature}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
