import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Copy,
  Check,
  Download,
  RefreshCw,
  Info,
} from 'lucide-react';

export const Day08Tool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [textInput, setTextInput] = useState<string>('Antigravity Pair Programming & Daily Commits');
  const [dataUri, setDataUri] = useState<string>('');
  const [fileName, setFileName] = useState<string>('sample-text.txt');
  const [fileType, setFileType] = useState<string>('text/plain');
  const [fileSize, setFileSize] = useState<number>(44);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Decoder state
  const [decodeInput, setDecodeInput] = useState<string>('');
  const [decodedText, setDecodedText] = useState<string>('');
  const [decodedImageSrc, setDecodedImageSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Encode Text
  const handleEncodeText = (txt: string) => {
    setTextInput(txt);
    if (!txt) {
      setDataUri('');
      setFileSize(0);
      return;
    }
    const encoded = btoa(unescape(encodeURIComponent(txt)));
    setDataUri(`data:text/plain;charset=utf-8;base64,${encoded}`);
    setFileName('encoded-text.txt');
    setFileType('text/plain');
    setFileSize(new Blob([txt]).size);
  };

  // Encode File from input or drop
  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileType(file.type || 'application/octet-stream');
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      setDataUri(res);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Decode Action
  const handleDecode = (raw: string) => {
    setDecodeInput(raw);
    if (!raw.trim()) {
      setDecodedText('');
      setDecodedImageSrc(null);
      return;
    }

    try {
      // Check if it's a data URI
      if (raw.startsWith('data:image')) {
        setDecodedImageSrc(raw);
        setDecodedText('');
        return;
      }

      // Try base64 decoding
      const cleanBase64 = raw.includes(',') ? raw.split(',')[1] : raw;
      const decoded = decodeURIComponent(escape(atob(cleanBase64.trim())));
      setDecodedText(decoded);
      setDecodedImageSrc(null);
    } catch {
      // Fallback: If decoding fails as text, it might be raw image base64
      setDecodedText('');
      setDecodedImageSrc(`data:image/png;base64,${raw.trim()}`);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadFile = (content: string, name: string) => {
    const link = document.createElement('a');
    link.href = content;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isImage = fileType.startsWith('image/');
  const rawBase64 = dataUri.includes(',') ? dataUri.split(',')[1] : dataUri;
  const base64CharLength = rawBase64.length;
  const overheadPercent = fileSize > 0 ? (((base64CharLength - fileSize) / fileSize) * 100).toFixed(1) : '33.3';

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              mode === 'encode'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Encoder (File & Text to Base64)
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              mode === 'decode'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Decoder (Base64 to File / Text)
          </button>
        </div>
        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">RFC 4648 Compliant</span>
      </div>

      {mode === 'encode' ? (
        <div className="space-y-5">
          {/* File Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-emerald-500/10 text-slate-400 group-hover:text-emerald-400 mx-auto flex items-center justify-center transition-colors mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-200 group-hover:text-white">
              Drag & Drop any image or document here, or click to browse
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, SVG, WebP, JSON, TXT, PDF</p>
          </div>

          {/* Quick text input option */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Or Encode Direct Plaintext String:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => handleEncodeText(e.target.value)}
                placeholder="Type text to instantly encode..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
              />
              <button
                onClick={() => handleEncodeText(textInput)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-xl transition-colors"
              >
                Encode
              </button>
            </div>
          </div>

          {/* Result & Metrics Card */}
          {dataUri && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              {/* Metrics strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Source File</span>
                  <p className="font-semibold text-slate-200 truncate">{fileName}</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Original Size</span>
                  <p className="font-mono font-bold text-cyan-400">{(fileSize / 1024).toFixed(2)} KB</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Base64 Length</span>
                  <p className="font-mono font-bold text-amber-400">{base64CharLength} chars</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Encoding Overhead</span>
                  <p className="font-mono font-bold text-emerald-400">+{overheadPercent}%</p>
                </div>
              </div>

              {/* Image Preview if applicable */}
              {isImage && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-4">
                  <img
                    src={dataUri}
                    alt="Uploaded thumbnail preview"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-700 shadow-md"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Visual Preview Loaded
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      MIME: <code className="text-emerald-400">{fileType}</code>
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => copyToClipboard(dataUri, 'uri')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                >
                  {copiedType === 'uri' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'uri' ? 'Copied Data URI!' : 'Copy Full Data URI'}
                </button>

                <button
                  onClick={() => copyToClipboard(rawBase64, 'raw')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                >
                  {copiedType === 'raw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'raw' ? 'Copied Raw!' : 'Copy Raw Base64'}
                </button>

                <button
                  onClick={() => downloadFile(dataUri, `decoded-${fileName}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Save Reconstructed File
                </button>
              </div>

              {/* Snippet preview */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 font-mono">Payload Preview (First 200 chars):</span>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300/80 overflow-x-auto break-all">
                  {dataUri.slice(0, 200)}...
                </pre>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Decoder Panel */
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Paste Base64 or Data URI
              </label>
              <button
                onClick={() =>
                  handleDecode(
                    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAydjIwTTIgMTJoMjAiLz48L3N2Zz4='
                  )
                }
                className="text-[11px] text-emerald-400 hover:underline"
              >
                Load Sample SVG
              </button>
            </div>
            <textarea
              rows={4}
              value={decodeInput}
              onChange={(e) => handleDecode(e.target.value)}
              placeholder="Paste data:image/png;base64,... or raw base64 string here..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 outline-none focus:border-emerald-500 break-all resize-y"
            />
          </div>

          {/* Decoded results */}
          {decodedImageSrc && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" /> Decoded Image Output
              </h4>
              <div className="p-4 bg-slate-950 rounded-lg flex items-center justify-center">
                <img
                  src={decodedImageSrc}
                  alt="Decoded output"
                  className="max-h-48 rounded border border-slate-800 shadow-md"
                />
              </div>
            </div>
          )}

          {decodedText && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <h4 className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" /> Decoded Text Content
                </h4>
                <button
                  onClick={() => copyToClipboard(decodedText, 'decoded')}
                  className="text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedType === 'decoded' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'decoded' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                {decodedText}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Educational Callout */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-200">Why does Base64 increase file size by ~33%?</strong> Base64 encodes 3 bytes
          (24 bits) of binary data into 4 ASCII characters (6 bits each). Because 4 characters are used to represent 3
          bytes, the data footprint increases by exactly $4 / 3 = 133.3\%$.
        </p>
      </div>
    </div>
  );
};
