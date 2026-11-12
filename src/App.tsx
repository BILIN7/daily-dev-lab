import { useState, useMemo } from 'react';
import {
  Flame,
  Search,
  Code2,
  Sparkles,
  Terminal,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PROJECTS_REGISTRY } from './data/projectsRegistry';
import { DAILY_IDEAS } from './data/ideas';
import type { Category, ProjectDay } from './types';

const CATEGORIES: ('All' | Category)[] = [
  'All',
  'Utility',
  'Algorithm Visualizer',
  'Security & Auth',
  'CSS & UI Studio',
  'Web API & Parsers',
];

export function App() {
  const [activeTab, setActiveTab] = useState<'projects' | 'ideas' | 'guide'>('projects');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProjectId, setActiveProjectId] = useState<string>(PROJECTS_REGISTRY[0].id);
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'takeaways'>('preview');

  const activeProject: ProjectDay = useMemo(() => {
    return (
      PROJECTS_REGISTRY.find((p) => p.id === activeProjectId) ||
      PROJECTS_REGISTRY[0]
    );
  }, [activeProjectId]);

  const filteredProjects = useMemo(() => {
    return PROJECTS_REGISTRY.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const fireCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899'],
    });
  };

  const ActiveComponent = activeProject.component;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-48 bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-violet-500/15 blur-3xl pointer-events-none -z-0" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  DailyDev<span className="text-emerald-400">Lab</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  365 Streak
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Interactive Micro-Apps, Visualizers & Daily Commit Vault
              </p>
            </div>
          </div>

          {/* Streak & Stats Capsule */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Daily Streak:</span>
              <span className="font-mono font-bold text-amber-400">
                {PROJECTS_REGISTRY.length} Days Active
              </span>
            </div>

            <button
              onClick={fireCelebration}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all"
            >
              <Award className="w-3.5 h-3.5" /> Celebrate Progress
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 border-t border-slate-800/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'projects'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Live Micro-Apps ({PROJECTS_REGISTRY.length})
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'ideas'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Idea Vault (Next {DAILY_IDEAS.length} Days)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'guide'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Daily Commit & CLI Guide
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Search and Category Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project or tag..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/80 transition-all"
                />
              </div>
            </div>

            {/* Split Layout: Project Selector Sidebar & Active Project Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Sidebar Carousel / List */}
              <div className="lg:col-span-4 space-y-3 max-h-[750px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold uppercase tracking-wider">
                  <span>Day Modules</span>
                  <span>{filteredProjects.length} Ready</span>
                </div>

                {filteredProjects.map((project) => {
                  const isSelected = project.id === activeProjectId;
                  return (
                    <div
                      key={project.id}
                      onClick={() => setActiveProjectId(project.id)}
                      className={`cursor-pointer rounded-xl p-3.5 border transition-all text-left ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50">
                          {project.date}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {project.category}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100 mb-1">
                        {project.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {project.tagline}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Project Main Interactive View */}
              <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Active Project Header */}
                <div className="p-5 border-b border-slate-800 bg-slate-950/40 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
                        {activeProject.date}
                      </span>
                      <span className="text-xs text-slate-400 px-2.5 py-1 rounded-md bg-slate-800">
                        {activeProject.category}
                      </span>
                      <span className="text-xs text-amber-400 font-medium px-2 py-0.5 rounded bg-amber-950/30 border border-amber-800/40">
                        {activeProject.difficulty}
                      </span>
                    </div>

                    {/* View Switcher: Interactive / Code / Takeaways */}
                    <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                      <button
                        onClick={() => setViewMode('preview')}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          viewMode === 'preview'
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Interactive App
                      </button>
                      <button
                        onClick={() => setViewMode('code')}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          viewMode === 'code'
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Source Code
                      </button>
                      <button
                        onClick={() => setViewMode('takeaways')}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          viewMode === 'takeaways'
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Architecture & Big-O
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {activeProject.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {activeProject.description}
                    </p>
                  </div>
                </div>

                {/* Body depending on ViewMode */}
                <div className="p-5">
                  {viewMode === 'preview' && (
                    <div>
                      <ActiveComponent />
                    </div>
                  )}

                  {viewMode === 'code' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                        <span className="font-mono">
                          src/projects/{activeProject.id.replace('day-0', 'day-')}/
                        </span>
                        <span className="text-emerald-400 font-mono text-[11px]">
                          TypeScript + React
                        </span>
                      </div>
                      <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed">
                        {activeProject.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {viewMode === 'takeaways' && (
                    <div className="space-y-4">
                      {activeProject.complexity && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                            <span className="text-[11px] text-slate-400">Time Complexity</span>
                            <p className="text-sm font-mono font-bold text-amber-400 mt-1">
                              {activeProject.complexity.time}
                            </p>
                          </div>
                          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                            <span className="text-[11px] text-slate-400">Space Complexity</span>
                            <p className="text-sm font-mono font-bold text-cyan-400 mt-1">
                              {activeProject.complexity.space}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-1.5">
                        <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" /> Key Engineering Insight
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {activeProject.keyTakeaway}
                        </p>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Tags & Topics Covered
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activeProject.tags.map((t) => (
                            <span
                              key={t}
                              className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Idea Vault (Next Days) */}
        {activeTab === 'ideas' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Curated Daily Ideas Vault
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                Never run out of things to commit! Here is a pre-curated collection of bite-sized,
                highly impressive micro-applications, algorithms, and utilities. Run{' '}
                <code className="text-emerald-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded">
                  npm run new-day
                </code>{' '}
                in your terminal to scaffold any of these in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DAILY_IDEAS.map((idea) => (
                <div
                  key={idea.day}
                  className="bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 rounded-xl p-4 space-y-3 transition-all hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/50">
                      Day {idea.day}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {idea.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{idea.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {idea.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {idea.suggestedTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Daily Commit & CLI Guide */}
        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                The Green-Profile Engineering Strategy
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Why this repository works: Tech recruiters, hiring managers, and senior engineers
                regularly look beyond the green squares to inspect your actual commit history and
                code quality. Using empty bot commits or dummy text files damages your professional
                reputation. This repository turns every commit into a genuine, functional micro-app
                or developer utility that you can discuss proudly in interviews.
              </p>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono">
                    1
                  </span>
                  Scaffold Today's Project in 10 Seconds
                </div>
                <p className="text-xs text-slate-400">
                  Run the custom CLI generator script in your terminal to automatically generate the
                  component template, register it in the registry, and prepare test files:
                </p>
                <pre className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-emerald-300 border border-slate-800 overflow-x-auto">
                  npm run new-day -- --day=7 --title="Base64 File Studio" --category="Utility"
                </pre>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-mono">
                    2
                  </span>
                  Write or Tweak the Feature
                </div>
                <p className="text-xs text-slate-400">
                  Open your newly created component in{' '}
                  <code className="text-slate-200 font-mono">src/projects/day-07/</code>, build your
                  logic, or use one of our 50+ pre-designed templates from the Idea Vault.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-purple-400">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-mono">
                    3
                  </span>
                  Commit with Standardized Conventional Commits
                </div>
                <p className="text-xs text-slate-400">
                  Stage and commit using professional conventional commit format:
                </p>
                <pre className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-purple-300 border border-slate-800 overflow-x-auto">
                  git add .
git commit -m "feat(day-07): add Base64 File Converter with instant drag-and-drop preview"
git push origin main
                </pre>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">
                    4
                  </span>
                  Automatic GitHub Pages Deployment & CI
                </div>
                <p className="text-xs text-slate-400">
                  Every time you push, the included GitHub Actions workflow automatically builds the
                  app and deploys the live version to GitHub Pages! Your live demo site is always
                  up-to-date with your latest day.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Built for consistent engineering habits & portfolio excellence.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-emerald-400">
              {PROJECTS_REGISTRY.length} / 100 Days Completed
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
