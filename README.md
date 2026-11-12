# ⚡ DailyDevLab (CodeCraft 365)

<p align="center">
  <strong>A 100-Day Engineering Odyssey: Interactive Micro-Apps, Algorithm Visualizers & Developer Utilities</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Daily_Streak-Active-10b981?style=for-the-badge&logo=github&logoColor=white" alt="Daily Streak" />
  <img src="https://img.shields.io/badge/React-19.3-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-Fast_Builds-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 🎯 The Philosophy Behind This Repository

Many developers use automated bot scripts to artificially turn their GitHub contribution graph green. However, senior engineers and technical recruiters inspect commit logs and repository contents. Empty commits damage credibility.

**DailyDevLab** solves this by providing a **structured, high-signal habit platform**:
- Every daily commit adds a **functional, interactive web utility, visual algorithm, or developer micro-tool**.
- Every day comes with code snippets, time & space algorithmic complexity analysis, and architectural takeaways.
- Automated CI/CD automatically compiles and deploys the web app to **GitHub Pages** on every push!

---

## 🚀 Live Micro-Apps Directory

| Day | Project Name | Category | Big-O (Time / Space) | Highlights |
| :---: | :--- | :---: | :---: | :--- |
| **01** | **Regex Interactive Sandbox** | `Utility` | $O(N)$ / $O(M)$ | Real-time flags, match group breakdowns, execution timer, presets |
| **02** | **Client-Side JWT Inspector** | `Security & Auth` | $O(N)$ / $O(N)$ | Zero-network Base64URL decoder, expiration countdown, header claims |
| **03** | **Sorting Algorithm Visualizer** | `Algorithm Visualizer` | $O(N^2)$ / $O(1)$ | Bubble, Selection, Insertion sorts with speed control, step delays |
| **04** | **Glassmorphism & Shadow Studio** | `CSS & UI Studio` | $O(1)$ / $O(1)$ | Blur, opacity, dynamic wallpaper preview, 1-click Tailwind export |
| **05** | **Cron Expression Humanizer** | `Utility` | $O(1)$ / $O(1)$ | Translates 5-part crontabs into plain conversational English |
| **06** | **Markdown Studio & Metrics** | `Web API & Parsers` | $O(N)$ / $O(N)$ | Dual-pane live markdown editor with word count & reading time |
| **07** | *URL Slugifier & Meta Tag Previewer* | `Utility` | $O(N)$ / $O(N)$ | Ready to build (Scaffolded via CLI) |
| **08** | *Base64 Drag-and-Drop Studio* | `Utility` | $O(N)$ / $O(N)$ | In roadmap |
| **09** | *Binary Search Tree (BST) Visualizer* | `Algorithm Visualizer` | $O(\log N)$ / $O(N)$ | In roadmap |
| **10** | *Password Entropy & Crack Time* | `Security & Auth` | $O(N)$ / $O(1)$ | In roadmap |
| ... | *40+ More in the Idea Vault* | `Various` | - | Full roadmap inside the app |

---

## 🛠️ How to Add Today's Project in 60 Seconds

This repository includes a custom CLI generator script so you can scaffold and register your daily challenge in one command:

```bash
# 1. Run the scaffolding CLI tool
npm run new-day -- --day=7 --title="Base64 Drag-and-Drop Studio" --category="Utility"

# 2. Start the local development server
npm run dev
```

The script automatically:
1. Generates `src/projects/day-07/Day07Tool.tsx` with a starter UI template.
2. Registers the component in `src/data/projectsRegistry.ts`.
3. Outputs the exact git commit command to run.

---

## 📜 Conventional Commit Guidelines

Maintain a clean, recruiter-ready git commit history by adhering to the Conventional Commits specification:

```bash
# Adding a new day's micro-app
git add .
git commit -m "feat(day-07): implement Base64 file encoder with drag-and-drop"
git push origin main

# Bug fix or UI adjustment
git commit -m "fix(day-03): correct edge case in insertion sort animation delay"

# Documentation or takeaway update
git commit -m "docs(day-05): add crontab range syntax table and notes"
```

---

## 💻 Tech Stack & Architecture

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with modern backdrop-blur and responsive grids
- **Icons**: Lucide Icons
- **Bundler**: Vite 6+
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) with zero-config GitHub Pages deployment

---

## 🌟 Deploying to Your GitHub Pages

1. Push this repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/<your-username>/daily-dev-lab.git
   git branch -M main
   git push -u origin main
   ```
2. On GitHub, navigate to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. Every commit you push will automatically build and publish your live portfolio application!

---

<p align="center">
  Made with consistency & passion. Keep shipping daily code! 🚀
</p>
