# charan-kumar99.github.io

Personal portfolio & resume website built with HTML, CSS, and JavaScript — featuring an AI-powered support chatbot.

---

## Features

- Animated particle background (Canvas API)
- Responsive navigation with mobile hamburger menu
- Hero section with typewriter effect
- Sections: Skills, Projects, Experience (timeline), Education, Contact
- **AI Support Chatbot** powered by OpenRouter (GPT-3.5 Turbo)

---

## AI Chatbot

Floating button at bottom-right opens the chat window.

- Answers questions about Charan Kumar only
- Bold formatting and bullet points in AI responses
- 5 rotating suggestion sets (20 unique questions) — changes on every New Chat
- Typing indicator while AI responds
- Chat window stays below the navbar at all times
- Smooth icon animation on the bubble (chat icon ↔ X)
- Fallback message for out-of-scope questions
- Mobile responsive

**API:** OpenRouter → `openai/gpt-3.5-turbo`

---

## File Structure

```
├── index.html   — Full portfolio HTML + chatbot UI
├── style.css    — All styles (portfolio + chatbot)
├── script.js    — All JS (particles, nav, animations, chatbot)
└── README.md    — This file
```

---

## Deploy to GitHub Pages

1. Push all 4 files to the root of `charan-kumar99.github.io` repo (`main` branch)
2. GitHub Pages auto-serves `index.html`
3. Live at: `https://charan-kumar99.github.io`

---

## Run Locally

Open `index.html` in any browser. No build step required.

---

&copy; 2025 Charan Kumar