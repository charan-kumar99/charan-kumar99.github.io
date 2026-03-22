/* ================================================================
   PORTFOLIO + AI CHATBOT  —  script.js
   Complete, self-contained. No external dependencies.
================================================================ */


/* ----------------------------------------------------------------
   PARTICLE ANIMATION
---------------------------------------------------------------- */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const PARTICLE_COUNT = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.2 - dist / 500) + ')';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


/* ----------------------------------------------------------------
   SMOOTH SCROLLING
---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


/* ----------------------------------------------------------------
   NAVBAR SCROLL EFFECT
---------------------------------------------------------------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
});


/* ----------------------------------------------------------------
   SCROLL FADE-IN ANIMATIONS
---------------------------------------------------------------- */
const scrollObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.fade-in').forEach(el => scrollObserver.observe(el));


/* ----------------------------------------------------------------
   MOBILE MENU
---------------------------------------------------------------- */
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}
function closeMenu() {
    document.getElementById('navLinks').classList.remove('active');
}


/* ----------------------------------------------------------------
   TYPEWRITER EFFECT — HERO SUBTITLE
---------------------------------------------------------------- */
const heroSubtitle = document.querySelector('.hero-subtitle');
const subtitleText = heroSubtitle.textContent;
heroSubtitle.textContent = '';
let charIndex = 0;

setTimeout(() => {
    function typeWriter() {
        if (charIndex < subtitleText.length) {
            heroSubtitle.textContent += subtitleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();
}, 1500);


/* ================================================================
   AI CHATBOT
================================================================ */

/* ---- API Config ---- */
const API_ENDPOINT = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') 
    ? 'http://localhost:8000/api/chat' 
    // If hosted on GitHub Pages, we must point explicitly to the Vercel backend Production URL
    : 'https://charan-kumar99-github-io.vercel.app/api/chat';

/* ---- System Prompt ---- */
const SYSTEM_PROMPT = `You are a friendly AI assistant embedded in Charan Kumar's portfolio website.
You ONLY answer questions about Charan Kumar. Politely decline anything unrelated.

FORMATTING RULES — follow strictly:
- Use **bold** (markdown asterisks) for important words: names, technologies, roles, dates, key facts.
- Use bullet points (- item) for any list of 2 or more items.
- Keep answers SHORT and CLEAN — max 5 lines total. No long paragraphs.
- Lead with the most important fact first.
- Never repeat the question back to the user.
- For out-of-scope questions reply exactly: "I'm not sure about that. Please check the portfolio sections for more details."

ABOUT CHARAN KUMAR
==================
Name : Charan Kumar
Role : Full-Stack Developer / ASP.NET Core Developer

EDUCATION
- **MCA** — MIT, Jaipur (Online) — Currently Pursuing, Expected **2027**
- **BCA** — Udupi College of Professional Studies, Mangalore University, **2022–2025**
  Add-on courses: Cybersecurity, Artificial Intelligence, Big Data Analytics

WORK EXPERIENCE
- **ASP.NET Core Developer** — NetTech Solutions Pvt. Ltd. (**Dec 2025 – Present**)
  Leads RTGS/NEFT banking projects for Indian Bank, Sirsi Bank, Naval Bank, Hanumanth Nagar Bank.
  Full-stack: frontend, backend, database design, testing, debugging, Azure DevOps deployment.
- **Trainee Developer** — NetTech Solutions Pvt. Ltd. (**Sep 2025 – Dec 2025**)
  Learned ASP.NET Core, contributed features, fixed bugs, worked with senior devs.

SKILLS
- Languages  : **C#**, **Java**, **Python**, **JavaScript**, Dart, HTML5, CSS3
- Frameworks : **ASP.NET Core**, **Flask**, Flutter
- Databases  : **PostgreSQL**, **MySQL**, **Oracle**, SQL Server, SQLite
- Tools      : **Azure DevOps**, GitHub, Visual Studio 2022, VS Code, Postman, DBeaver
- Other      : **REST APIs**, SQLAlchemy, Chart.js, Bootstrap

PROJECTS
1. **Money Mate** — Personal finance manager (Python, Flask, SQLite, Chart.js, Bootstrap 5)
   GitHub: https://github.com/charan-kumar99/Money_Mate
2. **Orion AI Assistant** — Voice-controlled web assistant (Python, Flask, JS, Google TTS)
   GitHub: https://github.com/charan-kumar99/Orion
3. **Cricket Performance Analyzer** — Browser analytics tool (HTML5, CSS3, JS, Chart.js)
   GitHub: https://github.com/charan-kumar99/Cricket-Performance-Analyzer
4. **DevLens** — AI-Powered GitHub Repository Analysis (ASP.NET Core, React, GitHub Tokens, Gemini API, SQLite, D3.js)
   GitHub: https://github.com/charan-kumar99/DevLens
5. **RTGS/NEFT Banking System** — Enterprise payment system (ASP.NET Core, PostgreSQL, MySQL, Oracle, Azure DevOps) — Proprietary
6. **Portfolio Website** — This portfolio (HTML, CSS, JS)

CONTACT
- Email    : charansuvarna99@gmail.com
- Location : **Udupi, Karnataka, India**
- LinkedIn : https://www.linkedin.com/in/charan-kumar-9b20a8378
- GitHub   : https://github.com/charan-kumar99
- Languages spoken: English, Hindi, Kannada, Tulu

CURRENT FOCUS: Building **AI-powered applications** and **enterprise banking systems**`;


/* ---- State ---- */
let chatHistory = [];
let isChatOpen = false;
let isLoading = false;

/* ---- DOM refs ---- */
const chatWindowEl = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const chatInputEl = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatSuggEl = document.getElementById('chatSuggestions');
const chatBubbleEl = document.getElementById('chatBubble');


/* ================================================================
   SUGGESTION SETS — 5 rotating sets of 4 questions each
================================================================ */
const SUGGESTION_SETS = [
    [
        { icon: '💡', text: "What are Charan's skills?" },
        { icon: '🚀', text: 'Tell me about his projects' },
        { icon: '💼', text: 'What is his current role?' },
        { icon: '📬', text: 'How to contact him?' }
    ],
    [
        { icon: '🎓', text: "What is Charan's education?" },
        { icon: '🏦', text: 'Tell me about the banking project' },
        { icon: '🐍', text: 'Does he know Python?' },
        { icon: '🌍', text: 'Where is he located?' }
    ],
    [
        { icon: '⚙️', text: 'What frameworks does he use?' },
        { icon: '🗄️', text: 'Which databases does he work with?' },
        { icon: '☁️', text: 'Does he use Azure or DevOps?' },
        { icon: '🤖', text: 'What is his current focus?' }
    ],
    [
        { icon: '🔗', text: "What is Charan's GitHub profile?" },
        { icon: '📱', text: 'Has he built any mobile apps?' },
        { icon: '🏅', text: 'How long has he been working?' },
        { icon: '🔒', text: 'What is the RTGS/NEFT project?' }
    ],
    [
        { icon: '🔥', text: 'What is Money Mate?' },
        { icon: '🎤', text: 'Tell me about Orion AI Assistant' },
        { icon: '🏏', text: 'What is the Cricket Analyzer?' },
        { icon: '🔍', text: 'What is DevLens?' }
    ]
];

let suggSetIndex = 0;

function renderSuggestions() {
    const set = SUGGESTION_SETS[suggSetIndex % SUGGESTION_SETS.length];
    chatSuggEl.innerHTML = '';
    set.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = item.icon + ' ' + item.text;
        btn.onclick = () => sendSuggestion(item.text);
        chatSuggEl.appendChild(btn);
    });
    chatSuggEl.style.display = 'flex';
}


/* ---- Welcome screen ---- */
function renderWelcome() {
    chatMessages.innerHTML =
        '<div class="chat-welcome">' +
        '<div class="chat-welcome-emoji">👋</div>' +
        '<div class="chat-welcome-title">Hi! I\'m Charan\'s AI Assistant</div>' +
        '<div class="chat-welcome-sub">Ask me anything about Charan — his skills,<br>projects, experience, or how to reach him!</div>' +
        '</div>';
}


/* ---- Toggle open / close ---- */
function toggleChat() {
    isChatOpen = !isChatOpen;
    chatWindowEl.classList.toggle('open', isChatOpen);
    chatBubbleEl.classList.toggle('is-open', isChatOpen);

    if (isChatOpen) {
        /* First open: render suggestions + welcome */
        if (chatMessages.children.length === 0) {
            renderSuggestions();
            renderWelcome();
        }
        setTimeout(() => chatInputEl.focus(), 300);
    }
}


/* ---- New chat — advance to next suggestion set ---- */
function newChat() {
    chatHistory = [];
    chatMessages.innerHTML = '';
    suggSetIndex++;          /* rotate to next set */
    renderSuggestions();
    renderWelcome();
    chatInputEl.value = '';
    chatInputEl.style.height = '22px';
    chatInputEl.style.overflowY = 'hidden';
    chatInputEl.focus();
}


/* ================================================================
   TEXT FORMATTING HELPERS
================================================================ */

/* Escape HTML — used for USER messages (plain text) */
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
}

/* Parse markdown → safe HTML — used for BOT messages only.
   Handles: **bold**, - unordered lists, 1. ordered lists, newlines */
function formatBotMessage(text) {
    /* Step 1 — escape HTML special chars */
    let t = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    /* Step 2 — bold: **text** or __text__ */
    t = t.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');

    /* Step 3 — process line-by-line to build lists */
    const lines = t.split('\n');
    let html = '';
    let inUl = false;
    let inOl = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const ulMatch = line.match(/^[-*]\s+(.+)/);
        const olMatch = line.match(/^\d+\.\s+(.+)/);

        if (ulMatch) {
            if (inOl) { html += '</ol>'; inOl = false; }
            if (!inUl) { html += '<ul class="bot-list">'; inUl = true; }
            html += '<li>' + ulMatch[1] + '</li>';
        } else if (olMatch) {
            if (inUl) { html += '</ul>'; inUl = false; }
            if (!inOl) { html += '<ol class="bot-list">'; inOl = true; }
            html += '<li>' + olMatch[1] + '</li>';
        } else {
            if (inUl) { html += '</ul>'; inUl = false; }
            if (inOl) { html += '</ol>'; inOl = false; }
            if (line.trim() === '') {
                html += '<div class="bot-spacer"></div>';
            } else {
                html += '<span class="bot-line">' + line + '</span>';
            }
        }
    }

    if (inUl) html += '</ul>';
    if (inOl) html += '</ol>';

    return html;
}


/* ---- Append message bubble ---- */
function appendMessage(role, text, isError = false) {
    /* Hide suggestion chips once user starts chatting */
    if (role === 'user') chatSuggEl.style.display = 'none';

    const wrap = document.createElement('div');
    wrap.className = 'chat-msg ' + role;

    const initials = role === 'bot' ? 'CK' : 'You';
    const errClass = isError ? ' error' : '';
    /* Bot messages get rich markdown rendering; user messages are plain escaped */
    const content = role === 'bot' ? formatBotMessage(text) : escapeHtml(text);

    wrap.innerHTML =
        '<div class="msg-avatar">' + initials + '</div>' +
        '<div class="msg-bubble' + errClass + '">' + content + '</div>';

    chatMessages.appendChild(wrap);
    scrollBottom();
}


/* ---- Typing indicator ---- */
let typingEl = null;

function showTyping() {
    typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.innerHTML =
        '<div class="msg-avatar" style="width:28px;height:28px;border-radius:50%;' +
        'background:linear-gradient(135deg,var(--primary),var(--accent));color:var(--darker);' +
        'display:flex;align-items:center;justify-content:center;font-size:0.65rem;' +
        'font-weight:700;flex-shrink:0;margin-top:2px;">CK</div>' +
        '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingEl);
    scrollBottom();
}

function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
}


/* ---- Scroll to bottom ---- */
function scrollBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


/* ---- Send message to Gemini API ---- */
async function sendMessage() {
    const text = chatInputEl.value.trim();
    if (!text || isLoading) return;

    /* Clear input */
    chatInputEl.value = '';
    chatInputEl.style.height = '22px';
    chatInputEl.style.overflowY = 'hidden';

    /* Add to UI + history */
    appendMessage('user', text);
    chatHistory.push({ role: 'user', content: text });

    /* Lock while waiting */
    isLoading = true;
    chatSendBtn.disabled = true;
    chatInputEl.disabled = true;

    showTyping();

    try {
        console.log('Sending request to Backend API');

        const messagesToSend = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...chatHistory.map(msg => ({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content }))
        ];

        const res = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: messagesToSend })
        });

        console.log('Response status:', res.status);

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            console.error('Error response:', errData);
            throw new Error(errData?.error?.message || errData?.error || 'API error ' + res.status);
        }

        const data = await res.json();
        console.log('Response data:', data);
        const reply = data?.choices?.[0]?.message?.content?.trim();
        console.log('Extracted reply:', reply);

        if (!reply) throw new Error('Empty response received.');

        hideTyping();
        appendMessage('bot', reply);
        chatHistory.push({ role: 'assistant', content: reply });

    } catch (err) {
        console.error('Chatbot error:', err);
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            endpoint: API_ENDPOINT
        });
        hideTyping();
        let errorMsg = "Sorry, I couldn't connect right now. ";
        if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
            errorMsg += "This might be a browser security issue. Check the console for details.";
        } else {
            errorMsg += "Please try again in a moment.";
        }
        appendMessage('bot', errorMsg, true);
    } finally {
        isLoading = false;
        chatSendBtn.disabled = false;
        chatInputEl.disabled = false;
        chatInputEl.focus();
    }
}


/* ---- Suggestion click ---- */
function sendSuggestion(text) {
    if (isLoading) return;
    chatInputEl.value = text;
    sendMessage();
}


/* ---- Keyboard: Enter = send, Shift+Enter = newline ---- */
function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}


/* ---- Auto-resize textarea as user types ---- */
function autoResizeInput(el) {
    el.style.height = '22px';
    const sh = el.scrollHeight;
    el.style.height = Math.min(sh, 110) + 'px';
    el.style.overflowY = sh > 110 ? 'auto' : 'hidden';
}


/* ---- Close chat when clicking outside ---- */
document.addEventListener('click', e => {
    if (
        isChatOpen &&
        !chatWindowEl.contains(e.target) &&
        !chatBubbleEl.contains(e.target)
    ) {
        toggleChat();
    }
});