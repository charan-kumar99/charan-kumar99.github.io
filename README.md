# charan-kumar99.github.io 🚀

Personal portfolio & resume website for **Charan Kumar** — Software Developer (.NET / Full-Stack Developer).  
Built with high-performance HTML5, Vanilla CSS, and JavaScript — featuring an AI-powered assistant, an interactive Project Workflow Simulator, a Developer CLI Terminal, and a 6-Tier AI-Powered Tailored ATS Resume Generator.

---

## 🌟 Core Features & Highlights

- **📄 AI-Powered Tailored ATS Resume Generator**: Floating glassmorphic tool on the bottom-right that accepts any Job Description (JD), runs a 6-tier AI pipeline via Gemini API to rephrase bullet points with quantitative impact metrics, tailors skills & projects, and renders clean PDF resumes on-the-fly using `jsPDF`.
- **💻 Interactive Project Workflow Simulator**: Step-by-step visual map and terminal log simulator showcasing data flows, API gateways, and database execution logic for projects including **DevLens**, **Migration Master**, **Money Mate**, **Orion**, **DueZy**, and **Advanced Portfolio**.
- **🤖 AI Support Chatbot & Voice Assistant**: Powered by the **Google Gemini API** (with Groq LLaMA 3.3 fallback), featuring voice input with real-time CSS audio visualizer, text-to-speech (TTS), smart chips, and context-trained knowledge.
- **🚀 Featured Projects Portfolio**: Showcases 9 major projects across .NET 8, C#, Python, Flask, React, Flutter, and PostgreSQL — including open-source tools like **Migration Master** and proprietary systems at **AGREMATE** and **NTSIPL**.
- **🎮 Developer CLI Drawer**: Matrix-style interactive terminal (` key or 💻 navbar icon) supporting commands like `help`, `skills`, `experience`, `projects`, `contact`, `theme`, and `neofetch`.
- **🎨 Dynamic Theme Palette**: Switch color themes instantly (Dark, Cyberpunk, Emerald, Neo-Cyan, Light Pro) with persistent localStorage state.
- **📈 SEO & Structured Data**: Built-in JSON-LD schema markup for rich Google Search indexing.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: HTML5, Vanilla CSS3 (CSS Variables, Glassmorphism, Animations), Modern ES6+ JavaScript, Chart.js, jsPDF, D3.js.
- **Backend / APIs**: Node.js, Vercel Serverless Functions (`/api/chat`, `/api/polish`), Google Gemini API, Groq LLaMA 3.3.
- **Data Source**: `resume-data.json` single-source-of-truth for experience, skills, certifications, and project metadata.

---

## 🗂️ Featured Projects Highlights

1. **Migration Master**: High-performance PostgreSQL-to-PostgreSQL database migration tool in C# (.NET 8) using PostgreSQL's native Binary COPY protocol (`COPY FROM STDIN`), Kahn's Algorithm topological dependency resolution, full schema replication, sequence syncing, and Spectre.Console interactive CLI.
2. **DevLens**: Full-stack AI repository analyzer using C#, ASP.NET Core, React, GitHub REST API, and Google Gemini API with D3.js/Recharts visual analytics.
3. **AGREMATE Platform**: Smart property management backend REST APIs built with ASP.NET Core, Clean Architecture, Docker, Swagger, SQL Server, and Redis caching.
4. **RTGS/NEFT Banking Microservices**: Enterprise payment processing services built on Microservices Architecture (.NET 6/8), serving major banks and vendors.
5. **Money Mate**: Flask & SQLite personal finance manager with multi-currency tracking and Chart.js analytics.
6. **Orion**: AI voice assistant with Speech Recognition and Google TTS automation.
7. **DueZy**: Premium Flutter & Firebase bill and EMI reminder mobile app with glassmorphic UI.
8. **Advanced Portfolio**: Next.js 15, React 19, Three.js 3D environment, Framer Motion, and GSAP animations.
9. **Cricket Performance Analyzer**: ES6 JavaScript analytics tool with custom metric engine and Chart.js visualizations.

---

## 📁 File Structure

```
├── index.html        — Portfolio HTML layout, projects grid, experience timeline & modals
├── style.css         — CSS design system, glassmorphism, themes, terminal & simulator styles
├── script.js         — Main client-side logic, AI chatbot client, simulator engine & ATS generator
├── resume-data.json  — Centralized JSON data source for resume, experience, and project details
├── server.js         — Node.js development server with local API proxies
├── api/
│   ├── chat.js       — Serverless endpoint for AI support chatbot (Groq + Gemini fallback)
│   └── polish.js     — Serverless endpoint for AI resume polishing and tailoring
├── vercel.json       — Vercel deployment & routing configuration
├── Ai.png            — Custom AI chat floating bubble icon
└── README.md         — Portfolio documentation
```

---

## ⚙️ Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/charan-kumar99/charan-kumar99.github.io.git
   cd charan-kumar99.github.io
   ```

2. Set your Google Gemini API key as an environment variable and launch the local server:
   ```powershell
   $env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"; node server.js
   ```

3. Open your browser at:
   ```
   http://localhost:8000/
   ```

---

## 🌐 Deployment

- **GitHub Pages**: Serves `index.html` as the static frontend directly from the `main` branch.
- **Vercel Serverless Functions**: Serves the backend AI endpoints (`/api/chat` and `/api/polish`).
- **Live URL**: [https://charan-kumar99.github.io](https://charan-kumar99.github.io)

---

© 2025–2026 **Charan Kumar** — Software Developer