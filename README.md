# charan-kumar99.github.io

Personal portfolio & resume website for **Charan Kumar** — .NET Developer | Full-Stack Developer.
Built with HTML, CSS, and JavaScript — featuring an AI-powered support chatbot, a Developer CLI, and multiple interactive Easter Eggs.

---

## 🚀 Core Features

- **Dynamic Theme Palette**: Change the website's color scheme instantly (Cyberpunk, Emerald, Neo-Cyan, Light Pro) using the palette icon in the navbar.
- **Scroll Progress Bar**: A sleek gradient progress bar along the top edge tracks your scroll depth.
- **Animated Backgrounds**: Interactive particle canvas background.
- **Comprehensive Sections**: About, Skills, Projects (including Agremate), Experience (timeline), Education, Certifications, Extracurricular Activities, Contact.
- **SEO Optimized**: Includes JSON-LD structured data schema markup for rich Google search snippets.

---

## 🤖 AI Support Chatbot & Voice Assistant

Powered by the **Google Gemini API**, this chatbot acts as a personal digital assistant representing Charan.

- **"Ask AI" Smart Chips**: Glowing chips in the Hero section let users instantly trigger popular questions for the AI.
- **Voice Input & Visualizer**: Click the microphone icon to speak your questions, complete with a live CSS audio waveform visualizer.
- **Text-to-Speech (TTS)**: Toggle the speaker icon to have the AI read its responses out loud.
- **Context-Aware Responses**: Strictly trained to answer questions about Charan's skills, experience, and projects using clean markdown formatting.
- **Rotating Suggestions**: 12 rotating question sets randomized on load to spark conversation.

---

## 🎮 Interactive Easter Eggs

- **Developer CLI Terminal**: A recruiter-favorite! Open the matrix-style terminal drawer by clicking the 💻 icon in the navbar or pressing the Backtick (\`) key. Type commands like `help`, `skills`, `experience`, `projects`, and `contact` to explore the portfolio in a retro terminal interface.
- **Interactive Projects Simulator**: A dedicated terminal simulation block showcasing the workflows of Charan's proprietary and open-source backend projects (like **Orion Assistant** and **DevLens**).

---

## 📁 File Structure

```
├── index.html    — Full portfolio HTML, UI, and markup for all components
├── style.css     — All CSS styles (animations, themes, terminal, chatbot)
├── script.js     — Client-side JS logic (terminal parser, API client, UI toggles)
├── server.js     — Local Node.js development server with API routing
├── api/chat.js   — Vercel serverless function for the production Gemini endpoint
├── vercel.json   — Vercel deployment configuration
├── Ai.png        — Custom AI chat bubble icon
└── README.md     — This file
```

---

## ⚙️ Run Locally

```bash
# Set your Gemini API key as an environment variable and start the local server
$env:GEMINI_API_KEY="YOUR_KEY_HERE"; node server.js

# The portfolio will open at http://localhost:8000/
```

---

## 🌐 Deploy to GitHub Pages + Vercel

1. Push all files to the root of your `charan-kumar99.github.io` repo (`main` branch).
2. GitHub Pages will automatically serve `index.html` as the static frontend.
3. Vercel automatically deploys the `/api/chat` endpoint to securely handle API calls to Gemini.
4. Live at: `https://charan-kumar99.github.io`

---

© 2025–2026 Charan Kumar