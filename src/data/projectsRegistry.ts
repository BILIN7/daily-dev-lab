import type { ProjectDay } from '../types';
import { RegexSandbox } from '../projects/day-01/RegexSandbox';
import { JwtInspector } from '../projects/day-02/JwtInspector';
import { SortingVisualizer } from '../projects/day-03/SortingVisualizer';
import { GlassmorphismStudio } from '../projects/day-04/GlassmorphismStudio';
import { CronExplainer } from '../projects/day-05/CronExplainer';
import { MarkdownStudio } from '../projects/day-06/MarkdownStudio';
import { Day07Tool } from '../projects/day-07/Day07Tool';
import { Day08Tool } from '../projects/day-08/Day08Tool';

export const PROJECTS_REGISTRY: ProjectDay[] = [
  {
    day: 1,
    id: 'day-01-regex-sandbox',
    title: 'Regex Interactive Visualizer & Matcher',
    tagline: 'Test regular expressions in real-time with group capture and execution metrics',
    category: 'Utility',
    date: 'Day 1',
    difficulty: 'Intermediate',
    tags: ['RegExp', 'Regex Engine', 'Parser', 'Text Processing'],
    complexity: {
      time: 'O(N) to O(2^N)',
      space: 'O(M) captures',
    },
    keyTakeaway:
      'Understanding regex back-tracking risks and how flag combinations (g, i, m, s) affect stateful execution in JS.',
    description:
      'An interactive regular expression sandbox that evaluates expressions dynamically against custom text samples, captures sub-groups, handles syntax exceptions, and measures microsecond execution times.',
    component: RegexSandbox,
    codeSnippet: `// Regex Evaluation with match groups and metrics
const regex = new RegExp(pattern, flags);
const matches: MatchResult[] = [];
let match;
while ((match = regex.exec(testString)) !== null) {
  matches.push({ match: match[0], index: match.index, groups: match.slice(1) });
  if (match.index === regex.lastIndex) regex.lastIndex++;
}`,
  },
  {
    day: 2,
    id: 'day-02-jwt-inspector',
    title: 'Client-Side JWT Token Inspector',
    tagline: 'Zero-network base64url decoder, header claims parser, and token expiration check',
    category: 'Security & Auth',
    date: 'Day 2',
    difficulty: 'Intermediate',
    tags: ['JWT', 'Security', 'Base64URL', 'Auth', 'RFC 7519'],
    complexity: {
      time: 'O(N) string decode',
      space: 'O(N) parsed JSON',
    },
    keyTakeaway:
      'JWT tokens are encoded, NOT encrypted by default. Sensitive data must never be stored in plaintext claims.',
    description:
      'A client-side JSON Web Token parser that inspects header algorithms, payload expiration dates (iat/exp), and signature structure without sending private credentials across the network.',
    component: JwtInspector,
    codeSnippet: `// Base64URL safe decoding
function base64UrlDecode(str: string) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  while (output.length % 4) output += '=';
  return decodeURIComponent(
    atob(output).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  );
}`,
  },
  {
    day: 3,
    id: 'day-03-sorting-visualizer',
    title: 'Sorting Algorithm Step Visualizer',
    tagline: 'Watch Bubble, Selection, and Insertion sorts step-by-step with comparison tracking',
    category: 'Algorithm Visualizer',
    date: 'Day 3',
    difficulty: 'Intermediate',
    tags: ['Algorithms', 'Sorting', 'Data Structures', 'Async/Await'],
    complexity: {
      time: 'O(N²) Bubble/Selection, O(N log N) Best',
      space: 'O(1) in-place',
    },
    keyTakeaway:
      'State-driven animation in React using async delay promises allows decoupled rendering of algorithmic step counters.',
    description:
      'Interactive visualizer comparing bubble sort, selection sort, and insertion sort with dynamic array sizing, speed sliders, comparisons, and swap metrics.',
    component: SortingVisualizer,
    codeSnippet: `// Step-by-step stateful bubble sort loop
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n - i - 1; j++) {
    setComparingIndices([j, j + 1]);
    await sleep(speed);
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      setArray([...arr]);
    }
  }
}`,
  },
  {
    day: 4,
    id: 'day-04-glassmorphism-studio',
    title: 'CSS Glassmorphism & Shadow Studio',
    tagline: 'Real-time backdrop blur, surface reflection generator, and 1-click Tailwind export',
    category: 'CSS & UI Studio',
    date: 'Day 4',
    difficulty: 'Beginner',
    tags: ['CSS', 'Tailwind', 'Backdrop-Filter', 'Design Tokens'],
    complexity: {
      time: 'O(1)',
      space: 'O(1)',
    },
    keyTakeaway:
      'Hardware-accelerated CSS backdrop-filter works best when pairing translucent borders with soft ambient drop-shadows.',
    description:
      'An interactive design studio to configure backdrop blur, surface opacities, border highlights, and color tints over dynamic vibrant gradients with instant CSS/Tailwind code export.',
    component: GlassmorphismStudio,
    codeSnippet: `/* Glassmorphism CSS Formula */
background: rgba(255, 255, 255, 0.25);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`,
  },
  {
    day: 5,
    id: 'day-05-cron-explainer',
    title: 'Cron Expression Parser & Humanizer',
    tagline: 'Translates 5-part crontab syntax into clear conversational English',
    category: 'Utility',
    date: 'Day 5',
    difficulty: 'Intermediate',
    tags: ['Cron', 'DevOps', 'Time', 'Automation'],
    complexity: {
      time: 'O(1)',
      space: 'O(1)',
    },
    keyTakeaway:
      'Crontab field semantics: minute (0-59), hour (0-23), day-of-month (1-31), month (1-12), day-of-week (0-6).',
    description:
      'Parses cron expressions into readable English sentences with breakdown cards for each time part and quick presets for common scheduling patterns.',
    component: CronExplainer,
    codeSnippet: `// Parse cron segment values
const [min, hour, dom, mon, dow] = cron.trim().split(/\\s+/);
if (min.startsWith('*/')) {
  const step = min.replace('*/', '');
  summary += 'every ' + step + ' minutes';
}`,
  },
  {
    day: 6,
    id: 'day-06-markdown-studio',
    title: 'Markdown Live Studio & Reading Metrics',
    tagline: 'Dual-pane live markdown editor with word count, character count, and read time',
    category: 'Web API & Parsers',
    date: 'Day 6',
    difficulty: 'Intermediate',
    tags: ['Markdown', 'Parser', 'Text Editor', 'Metrics'],
    complexity: {
      time: 'O(N) regex parse',
      space: 'O(N) HTML string',
    },
    keyTakeaway:
      'Regex-based markdown tokenizers provide snappy single-component previews without heavy external dependencies.',
    description:
      'A dual-pane markdown live editor featuring live HTML compilation, word and character statistics, estimated reading time, and one-click raw markdown copy.',
    component: MarkdownStudio,
    codeSnippet: `// Words and reading time calculation
const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
const readTimeMinutes = Math.max(1, Math.ceil(words / 200));`,
  },
  {
    day: 7,
    id: 'day-07-url-slugifier-meta-tag-generator',
    title: 'URL Slugifier & Meta Tag Generator',
    tagline: 'Daily engineering challenge and interactive utility for Day 7',
    category: 'Utility',
    date: 'Day 7',
    difficulty: 'Intermediate',
    tags: ['Day7', 'Utility'],
    complexity: {
      time: 'O(1)',
      space: 'O(1)',
    },
    keyTakeaway: 'Built Day 7 milestone demonstrating modular architecture and clean state handling.',
    description: 'Daily engineering challenge and interactive utility for Day 7',
    component: Day07Tool,
    codeSnippet: `// Day 7: URL Slugifier & Meta Tag Generator implementation\nexport const Day07Tool = () => { ... };`,
  },
  {
    day: 8,
    id: 'day-08-base64-file-image-studio',
    title: 'Base64 File & Image Studio',
    tagline: 'Drag-and-drop file encoder, image previewer, and Base64-to-binary decoder',
    category: 'Utility',
    date: 'Day 8',
    difficulty: 'Intermediate',
    tags: ['Base64', 'FileReader', 'Blob', 'RFC 4648', 'Assets'],
    complexity: {
      time: 'O(N) file streaming',
      space: 'O(N) 33% expanded buffer',
    },
    keyTakeaway: 'Base64 encodes 3 binary bytes into 4 ASCII characters, resulting in an exact 33.3% payload size expansion.',
    description: 'An interactive dual-mode file and image studio to encode media to Data URIs, compute file size tax, and decode Base64 back into viewable files.',
    component: Day08Tool,
    codeSnippet: `// File to Base64 Data URI via FileReader API
const reader = new FileReader();
reader.onload = (e) => {
  const dataUri = e.target?.result as string;
  setDataUri(dataUri);
};
reader.readAsDataURL(file);`,
  },
];
