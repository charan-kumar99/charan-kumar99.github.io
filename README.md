# charan-kumar99.github.io

Personal portfolio & resume website for **Charan Kumar** — .NET Developer | Full-Stack Developer.
Built with HTML, CSS, and JavaScript — featuring an AI-powered support chatbot.

---

## Features

- Animated particle background (Canvas API)
- Responsive navigation with mobile hamburger menu
- Hero section with typewriter effect
- Sections: About, Skills (6 categories), Projects, Experience (timeline), Education, Certifications & Training, Activities & Interests, Contact
- **AI Support Chatbot** powered by Google Gemini API

---

## AI Chatbot

Floating button at bottom-right opens the chat window.

- Answers questions about Charan Kumar only
- Bold formatting and bullet points in AI responses
- 12 rotating suggestion sets (48 unique questions) — randomized on page load, rotates on New Chat
- Typing indicator while AI responds
- Chat window stays below the navbar at all times
- Smooth icon animation on the bubble (chat icon ↔ X)
- Fallback message for out-of-scope questions
- Mobile responsive

**API:** Google Gemini → `gemini-2.5-flash`

---

## File Structure

```
├── index.html    — Full portfolio HTML + chatbot UI
├── style.css     — All styles (portfolio + chatbot)
├── script.js     — All JS (particles, nav, animations, chatbot)
├── server.js     — Local dev server with Gemini API proxy
├── api/chat.js   — Vercel serverless function for production API
├── vercel.json   — Vercel deployment configuration
├── Ai.png        — AI chat bubble icon
└── README.md     — This file
```

---

## Run Locally

```bash
# Set your Gemini API key and start the dev server
$env:GEMINI_API_KEY="YOUR_KEY_HERE"; node server.js

# Opens at http://localhost:8000/
```

---

## Deploy to GitHub Pages + Vercel

1. Push all files to the root of `charan-kumar99.github.io` repo (`main` branch)
2. GitHub Pages auto-serves `index.html` for the portfolio
3. Vercel handles the `/api/chat` endpoint for the AI chatbot in production
4. Live at: `https://charan-kumar99.github.io`

---

© 2025–2026 Charan Kumar