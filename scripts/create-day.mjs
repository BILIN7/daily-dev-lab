import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Parse CLI arguments: --day=7 --title="My New Tool" --category="Utility" --tagline="..."
const args = process.argv.slice(2);
const options = {};
for (const arg of args) {
  if (arg.startsWith('--')) {
    const [key, ...rest] = arg.slice(2).split('=');
    options[key] = rest.join('=');
  }
}

// Read current registry to determine next day if not provided
const registryPath = path.join(rootDir, 'src', 'data', 'projectsRegistry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf-8');

// Find highest day number in registry
const dayMatches = [...registryContent.matchAll(/day:\s*(\d+)/g)];
const currentMaxDay = dayMatches.reduce((max, m) => Math.max(max, parseInt(m[1], 10)), 0);

const dayNumber = options.day ? parseInt(options.day, 10) : currentMaxDay + 1;
const dayPadded = String(dayNumber).padStart(2, '0');
const title = options.title || `Interactive Dev Module ${dayNumber}`;
const tagline = options.tagline || `Daily engineering challenge and interactive utility for Day ${dayNumber}`;
const category = options.category || 'Utility';
const difficulty = options.difficulty || 'Intermediate';

// Component name in PascalCase
const componentName = `Day${dayPadded}Tool`;
const projectFolderName = `day-${dayPadded}`;
const projectDir = path.join(rootDir, 'src', 'projects', projectFolderName);

if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
}

const componentFilePath = path.join(projectDir, `${componentName}.tsx`);

const componentTemplate = `import React, { useState } from 'react';
import { Sparkles, Terminal, Copy, Check } from 'lucide-react';

export const ${componentName}: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>('Hello World from Day ${dayNumber}!');
  const [outputVal, setOutputVal] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleProcess = () => {
    // Implement your daily challenge logic here!
    setOutputVal(\`Processed [Day ${dayNumber}]: \${inputVal.toUpperCase()}\`);
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
          Day ${dayNumber} Input Console
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
`;

fs.writeFileSync(componentFilePath, componentTemplate, 'utf-8');

// Update projectsRegistry.ts
let updatedRegistry = registryContent;

// 1. Add import statement
const importLine = `import { ${componentName} } from '../projects/${projectFolderName}/${componentName}';\n`;
const lastImportIdx = updatedRegistry.lastIndexOf("import {");
const endOfImports = updatedRegistry.indexOf(";\n", lastImportIdx) + 2;
updatedRegistry = updatedRegistry.slice(0, endOfImports) + importLine + updatedRegistry.slice(endOfImports);

// 2. Add entry to PROJECTS_REGISTRY array
const newEntry = `  {
    day: ${dayNumber},
    id: 'day-${dayPadded}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}',
    title: '${title.replace(/'/g, "\\'")}',
    tagline: '${tagline.replace(/'/g, "\\'")}',
    category: '${category}',
    date: 'Day ${dayNumber}',
    difficulty: '${difficulty}',
    tags: ['Day${dayNumber}', '${category}'],
    complexity: {
      time: 'O(1)',
      space: 'O(1)',
    },
    keyTakeaway: 'Built Day ${dayNumber} milestone demonstrating modular architecture and clean state handling.',
    description: '${tagline.replace(/'/g, "\\'")}',
    component: ${componentName},
    codeSnippet: \`// Day ${dayNumber}: ${title} implementation\\nexport const ${componentName} = () => { ... };\`,
  }`;

updatedRegistry = updatedRegistry.trimEnd().replace(/,?\s*\];?$/, `,\n${newEntry},\n];\n`);
fs.writeFileSync(registryPath, updatedRegistry, 'utf-8');

console.log(`\n======================================================`);
console.log(`  🎉 SUCCESS! Day ${dayNumber} Created: ${title}`);
console.log(`  📁 File: src/projects/${projectFolderName}/${componentName}.tsx`);
console.log(`  🔗 Registry: Registered in src/data/projectsRegistry.ts`);
console.log(`======================================================\n`);
console.log(`To commit today's work to your GitHub profile, run:\n`);
console.log(`  git add .`);
console.log(`  git commit -m "feat(day-${dayPadded}): add ${title.toLowerCase()}"`);
console.log(`  git push origin main\n`);
