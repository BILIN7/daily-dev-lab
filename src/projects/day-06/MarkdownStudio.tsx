import React, { useState, useMemo } from 'react';
import { FileText, Eye, Copy, Check, Clock, BookOpen } from 'lucide-react';

const INITIAL_MD = `# 🚀 Day 06: Markdown Studio & Metrics

Welcome to **DailyDevLab**! An interactive suite of tools and algorithms designed for daily engineering habits.

### Key Capabilities
- Real-time Markdown rendering
- Live word & character counters
- Estimated reading time (average 200 wpm)
- Zero external backend dependencies

> *"Small daily improvements over time lead to stunning results."*

### Sample Code Block
\`\`\`typescript
interface DeveloperStreak {
  commits: number;
  continuousDays: number;
  reputation: 'Elite';
}
\`\`\`

- [x] Write clean modular code
- [x] Push daily commits with Conventional Commit specs
- [x] Showcase real applications to recruiters
`;

export const MarkdownStudio: React.FC = () => {
  const [content, setContent] = useState<string>(INITIAL_MD);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const trimmed = content.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = content.length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return { words, chars, readTimeMinutes };
  }, [content]);

  // Simple Markdown to HTML parser for standard formats (headers, bold, italics, quotes, lists, code)
  const renderedHtml = useMemo(() => {
    let html = content
      // Escape basic html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-950 p-3 rounded-lg font-mono text-emerald-300 text-xs overflow-x-auto my-2 border border-slate-800"><code>$1</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">$1</code>');
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-100 mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-100 mt-4 mb-2 pb-1 border-b border-slate-800">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-slate-100 mt-2 mb-3 pb-2 border-b border-slate-800">$1</h1>');
    // Blockquotes
    html = html.replace(/^\&gt;\s*(.*$)/gim, '<blockquote class="border-l-4 border-emerald-500 pl-3 italic text-slate-300 my-2">$1</blockquote>');
    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>');
    // Unordered lists
    html = html.replace(/^\-\s*(.*$)/gim, '<li class="ml-4 list-disc text-slate-300">$1</li>');
    // Line breaks
    html = html.replace(/\n\n/g, '<p class="my-2 text-slate-300 leading-relaxed"></p>');
    html = html.replace(/\n/g, '<br/>');

    return html;
  }, [content]);

  const copyMarkdown = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Words: <strong className="text-white">{stats.words}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Characters: <strong className="text-white">{stats.chars}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Read Time: <strong className="text-white">~{stats.readTimeMinutes} min</strong></span>
          </div>
        </div>

        <button
          onClick={copyMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Raw Markdown'}
        </button>
      </div>

      {/* Editor & Preview Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Markdown Input
          </label>
          <textarea
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 outline-none focus:border-emerald-500 transition-all resize-y"
          />
        </div>

        {/* Live Preview */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> Live HTML Preview
          </label>
          <div
            className="w-full h-[326px] bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-y-auto text-xs text-slate-200"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      </div>
    </div>
  );
};
