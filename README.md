# charan-kumar99.github.io 🚀

Personal portfolio & resume website for **Charan Kumar** — Software Developer | .NET Developer | Full-Stack Developer.  
Built with high-performance HTML5, Vanilla CSS, and JavaScript — featuring a 6-Tier AI-Powered Tailored ATS Resume & CV Generator, an interactive Project Workflow Simulator, a Developer CLI Terminal, and a Groq/Gemini-backed AI Support Assistant.

---

## 🤖 AI Models & Integration Architecture

The application leverages state-of-the-art Large Language Models (LLMs) via secure serverless proxy endpoints to power both interactive candidate Q&A and instant ATS resume & CV tailoring:

### 1. 💬 AI Support Chatbot & Voice Assistant (`/api/chat.js`)
- **Primary AI Engine**: **Groq LLaMA 3.3 70B Versatile** (`llama-3.3-70b-versatile`) — Delivers sub-second inference speeds for real-time candidate Q&A.
- **Secondary / Fallback Engine**: **Google Gemini 2.5 Flash** (`gemini-2.5-flash`) — Activates seamlessly if primary rate limits or network limits are met.
- **Resilience Strategy**: 6-Tier provider fallback chain (Groq, Google Gemini, OpenRouter, Cohere, HuggingFace, Mistral) ensuring 99.9% uptime.
- **Features**:
  - Voice input with live CSS audio waveform visualizer via Web Speech API.
  - Text-to-Speech (TTS) natural voice output.
  - Context-trained prompt engineering based on `resume-data.json` with knowledge of portfolio features, interactive contact links, and visitor Q&A fallbacks.
  - Smart chips and 12 randomized prompt sets.

### 2. 📄 Dual-Mode Resume & CV Generator (`/api/polish.js` & `/api/latex.js`)
- **Document Type Selection**:
  - **📄 Resume (Concise 2-Page)**: Optimized for corporate job applications, HR screening & ATS matching. Includes optional Job Description text input and an **"Enhance phrasing with AI"** toggle switch.
  - **📜 CV (Curriculum Vitae)**: Comprehensive full document containing **all 9 projects** (*DevLens*, *Money Mate*, *Cricket Analyzer*, *Orion*, *Vaulta*, *Advanced Portfolio*, *RTGS/NEFT*, *Agremate*, *Migration Master*), complete experience details, full education history (MCA, BCA, 12th PU, 10th SSLC), certifications & training, and activities & interests.
- **Server-Side LaTeX & Client-Side PDF Engines**:
  - High-precision typography modeled after FlowCV standards (EB Garamond serif, 21pt bold name, 13pt italic subtitle, 12pt section titles, 1.2pt rules).
  - Server-side LaTeX compiler (`/api/latex.js` and `latexonline.cc`) returning publication-quality PDFs, with client-side `jsPDF` fallback.

---

## 🌟 Core Features & Highlights

- **📄 AI-Powered Tailored ATS Resume & CV Generator**: Floating glassmorphic pill button (**"✨ Match & Generate Resume"**) at bottom-left allowing visitors to download either a concise 2-page targeted Resume or a complete 9-project CV.
- **⚡ AI Phrasing Enhancer Toggle**: Switch labeled **"Enhance phrasing with AI"** allows visitors to disable AI bullet rephrasing while still matching job keywords.
- **📞 Interactive Contact Links**: Direct dialer link (`tel:+919380455922`) for phone number and Google Maps link for location (`Udupi, Karnataka, India`).
- **💻 Interactive Project Workflow Simulator**: Step-by-step visual map and terminal log simulator showcasing data flows, API gateways, and database execution logic for projects including **DevLens**, **Migration Master**, **Money Mate**, **Orion**, **Vaulta**, and **Advanced Portfolio**.
- **🤖 High-Z-Index AI Chatbot**: Floating chat bubble at bottom-right positioned at `z-index: 1000001` so it stays crisp and fully usable anywhere on the page—even while modal windows are open.
- **🚀 Featured Projects Portfolio**: Showcases 9 major projects across C#, .NET, ASP.NET Core, Python, Flask, React, Flutter, PostgreSQL, and SQL Server — including open-source tools like **Migration Master** and proprietary systems at **AGREMATE** and **NTSIPL**.
- **🎮 Developer CLI Shell**: Matrix-style interactive terminal drawer (` key or 💻 navbar icon) enforcing custom `ck` prefix commands (`ck help`, `ck skills`, `ck experience`, `ck projects`, `ck contact`, `ck theme`, `ck neofetch`, and `ck clear`).
- **🎨 Dynamic Theme Palette**: Switch color themes instantly (Dark, Cyberpunk, Emerald, Neo-Cyan, Light Pro) with persistent state.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: HTML5, Vanilla CSS3 (CSS Variables, Glassmorphic UI, Animations), Modern ES6+ JavaScript, Chart.js, jsPDF, D3.js.
- **Backend / APIs**: Node.js, Vercel Serverless Functions (`/api/chat`, `/api/polish`, `/api/latex`), Google Gemini 2.5 Flash, Groq LLaMA 3.3 70B.
- **Tools & DevOps**: Jira (Agile & Issue Tracking), Azure DevOps, Docker, GitHub, CI/CD Pipelines, Postman, Swagger.
- **Data Source**: `resume-data.json` single-source-of-truth for experience, skills, certifications, and project metadata.

---

## 🗂️ Featured Projects List (All 9 Included in CV)

1. **DevLens**: Full-stack AI repository analyzer using C#, ASP.NET Core, React, GitHub REST API, and Google Gemini API with D3.js/Recharts visual analytics.
2. **Money Mate**: Flask & SQLite personal finance manager with multi-currency tracking and Chart.js analytics.
3. **Cricket Performance Analyzer**: ES6 JavaScript analytics tool with custom metric engine and Chart.js visualizations.
4. **Orion**: AI voice assistant with Speech Recognition and Google TTS automation.
5. **Vaulta**: Personal & Official Document Manager — Modern, privacy-first, offline PWA with IndexedDB storage, Mozilla PDF.js viewer, Web Share API, and JSZip/jsPDF backup utilities.
6. **Advanced Portfolio**: Next.js 15, React 19, Three.js 3D environment, Framer Motion, and GSAP animations.
7. **RTGS/NEFT Banking System**: Enterprise payment processing services built on Microservices Architecture, serving major banks and vendors.
8. **Agremate**: Smart property management backend REST APIs built with ASP.NET Core, Clean Architecture, Docker, Swagger, SQL Server, and Redis caching.
9. **Migration Master**: High-performance PostgreSQL-to-PostgreSQL database migration tool in C# using PostgreSQL's native Binary COPY protocol (`COPY FROM STDIN`), Kahn's Algorithm topological dependency resolution, full schema replication, sequence syncing, and Spectre.Console interactive CLI.

---

## 📁 File Structure

```
├── index.html        — Portfolio HTML layout, projects grid, experience timeline & modals
├── style.css         — CSS design system, glassmorphism, themes, terminal & simulator styles
├── script.js         — Main client-side logic, AI chatbot client, simulator engine & PDF generator
├── resume-data.json  — Centralized JSON data source for resume, experience, and project details
├── server.js         — Node.js development server with local API proxies & LaTeX compiler
├── api/
│   ├── chat.js       — Serverless endpoint for AI support chatbot (Groq LLaMA 3.3 + Gemini 2.5 Flash fallback)
│   ├── polish.js     — Serverless endpoint for AI resume polishing and ATS tailoring
│   └── latex.js      — Serverless endpoint for LaTeX PDF compilation (EB Garamond styling)
├── vercel.json       — Vercel deployment & routing configuration
└── README.md         — Portfolio documentation
```

---

## ⚙️ Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/charan-kumar99/charan-kumar99.github.io.git
   cd charan-kumar99.github.io
   ```

2. Set your AI API keys as environment variables and launch the local server:
   ```powershell
   $env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"; $env:GROQ_API_KEY="YOUR_GROQ_API_KEY_HERE"; node server.js
   ```

3. Open your browser at:
   ```
   http://localhost:8000/
   ```

---

## 🌐 Deployment

- **GitHub Pages**: Serves `index.html` as the static frontend directly from the `main` branch.
- **Vercel Serverless Functions**: Serves backend AI endpoints (`/api/chat` and `/api/polish`).
- **Live URL**: [https://charan-kumar99.github.io](https://charan-kumar99.github.io)

---

© 2025–2026 **Charan Kumar** — Software Developer