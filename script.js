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
You answer questions about Charan Kumar — his skills, projects, experience, education, and contact info.
IMPORTANT: When someone asks about a technology, framework, or concept (e.g. "what is microservices?", "what is Blazor?", "what is REST API?"), ALWAYS start with how Charan specifically uses it in his work, then give a brief technical explanation. The context must be Charan's experience first, not a generic definition.
Only decline questions that are completely unrelated to Charan or his tech stack (e.g. cooking recipes, politics, etc).

FORMATTING RULES — follow strictly:
- Use **bold** (markdown asterisks) for important words: names, technologies, roles, dates, key facts.
- Use bullet points (- item) for any list of 2 or more items.
- Keep answers SHORT and CLEAN — max 5 lines total. No long paragraphs.
- Lead with the most important fact first.
- Never repeat the question back to the user.
- For completely unrelated questions reply exactly: "I'm not sure about that. Please check the portfolio sections for more details."

ABOUT CHARAN KUMAR
==================
Name : Charan Kumar
Role : .NET Developer | Full-Stack Developer
Phone : +91 9380455922
Email : charansuvarna99@gmail.com
Location : Udupi, Karnataka, India
LinkedIn : https://www.linkedin.com/in/charan-kumar-9b20a8378
GitHub : https://github.com/charan-kumar99
Portfolio : https://charan-kumar99.github.io/
Languages spoken: English, Hindi, Kannada, Tulu, Tamil (mother tongue is Tulu)

PROFESSIONAL SUMMARY
Versatile .NET Developer with hands-on experience building and maintaining enterprise-grade web applications for the banking and financial sector. Currently developing critical RTGS/NEFT payment processing systems using Microservices Architecture, serving multiple banks using ASP.NET Core (.NET 6 & .NET 8), Blazor, and Razor Pages. Proven expertise in full-stack development, microservices-based application design, database management across PostgreSQL, MySQL, Oracle Database, and SQL Server, REST API development, API versioning, globalization, and .NET version migration.

EDUCATION
- **MCA** — MIT, Jaipur (Online) — **Nov 2025 – Present**
- **BCA** — Udupi College of Professional Studies, Mangalore University — **Sep 2022 – Jun 2025** — CGPA: **6.17**
  Add-on Courses (3-Year Program alongside BCA) in Cyber Security, Artificial Intelligence & Big Data Analytics:
    Year 1: Certificate Course | Year 2: Diploma Course | Year 3: Advanced Diploma Course
- **Pre-University (12th)** — St Cecily's Composite PU College, Udupi — **Jul 2020 – Apr 2022** — 67.71%
- **10th Standard** — Volakadu Government High School, Udupi — **Apr 2019 – Jun 2020** — 68%

WORK EXPERIENCE
- **.NET Developer** — Net Tech Services India Private Limited (NTSIPL) (**Dec 2025 – Present**)
  Development on RTGS/NEFT banking project for major Banks and Vendors using **Microservices Architecture**.
  Working with microservices-based architecture for building scalable, independently deployable banking services with service-to-service communication and API gateway patterns.
  Contributed to CTS (Cheque Truncation System), AML (Anti-Money Laundering), and User Management systems.
  Full-stack with ASP.NET Core, Blazor, Razor Pages. Database management across PostgreSQL, MySQL, Oracle Database, SQL Server.
  REST APIs, CRUD operations, API globalization, .NET version migration (6→8).
  Testing, debugging, Azure DevOps deployment. Tools: Visual Studio 2022, Postman, DBeaver, FTP/SFTP.
- **Trainee Developer** — NTSIPL (**Sep 2025 – Dec 2025**)
  Gained hands-on experience in ASP.NET Core enterprise development in the financial domain.
  Contributed features, resolved bugs, collaborated with senior developers.

SKILLS
- Languages   : **C#**, **Java**, **JavaScript**, **C**, **Python**, HTML5, CSS3, Dart
- Frameworks  : **ASP.NET Core (.NET 6 & .NET 8)**, **Blazor**, **Razor Pages**, React, Bootstrap 5, **Flask**, Chart.js
- Databases   : **PostgreSQL**, **MySQL**, **Oracle Database**, **SQL Server**, SQLite
- Tools       : **Azure DevOps**, GitHub, Visual Studio 2022, VS Code, Postman, DBeaver
- API & Arch  : **REST APIs**, **Microservices Architecture**, API Versioning, API Globalization, .NET Migration (6→8)
- Soft Skills : Analytical Thinking, Active Listening, Team Leadership, Fast Learner, Detail-Oriented, Collaborative

PROJECTS (in order)
1. **DevLens** — AI-Powered GitHub Repository Analyzer (C#, ASP.NET Core, React, GitHub API, Google Gemini API, SQLite, D3.js, Recharts)
   GitHub: https://github.com/charan-kumar99/DevLens
2. **Money Mate** — Personal Finance Management (Python, Flask, SQLite, SQLAlchemy, Chart.js, Bootstrap 5)
   GitHub: https://github.com/charan-kumar99/Money_Mate
3. **Cricket Performance Analyzer** — BCA Final Project Enhanced (HTML5, CSS3, JS ES6+, Chart.js, LocalStorage)
   GitHub: https://github.com/charan-kumar99/Cricket-Performance-Analyzer
4. **Orion** — AI-Powered Personal Voice Assistant (Python, Flask, JS, Google TTS, Speech Recognition)
   GitHub: https://github.com/charan-kumar99/Orion
5. **RTGS/NEFT Banking System** — Enterprise payment system built on Microservices Architecture (ASP.NET Core, Microservices, PostgreSQL, MySQL, Oracle Database, Azure DevOps, REST APIs) — Proprietary

CERTIFICATIONS & TRAINING
- Fast-Track Internship — Data Analytics, Web Development & Python Projects | Accolade Tech Solutions, Mangaluru (August 2024)
- Cybersecurity Training | Vijesha IT Services LLP (2024)
- AI, Big Data Analytics & Cybersecurity Training | Mangalore University (2024)
- Skill Development & Entrepreneurship Program | Udupi Grameena Buntara Sangha (2024)
- NCC 'A' Certificate | National Cadet Corps (Ministry of Defence, India)
- 10-Day NCC Camp — Training with Indian Navy & Army Officers

EXTRACURRICULAR ACTIVITIES
- **NCC** — Served as NCC Lead / Head Cadet. Received **Best Cadet Award**. 10-day camp with Indian Navy & Army officers. Holds NCC 'A' Certificate.
- **Cricket** — Active competitive player, team captain, won multiple district-level matches, plays in regular tournaments.
- **Volleyball** — District-level player, captained school and college teams, won inter-institution matches.
- **Kabaddi** — Participated at district level during school years.
- **Chess** — Regular player, practices with peers and family.
MICROSERVICES EXPERTISE
Charan works extensively with **Microservices Architecture** at his current company (NTSIPL).
- The RTGS/NEFT banking system is built on a **microservices-based architecture** where each banking service (RTGS, NEFT, CTS, AML, User Management) is an independently deployable microservice.
- He works with **service-to-service communication**, **API gateway patterns**, and **database-per-service** design.
- Each microservice has its own database (PostgreSQL, MySQL, or Oracle) enabling independent scaling and deployment.
- Microservices are built using **ASP.NET Core (.NET 6 & .NET 8)** with **REST APIs** for inter-service communication.
- Deployment is managed through **Azure DevOps** CI/CD pipelines for each microservice independently.
- Microservices architecture is an architectural style where an application is composed of small, loosely coupled, independently deployable services, each running its own process and communicating via lightweight protocols like HTTP/REST.

CURRENT FOCUS: Building **AI-powered applications** and **enterprise banking systems** with **Microservices Architecture** while pursuing **MCA**`;


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
   SUGGESTION SETS — 12 rotating sets of 4 questions each
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
        { icon: '🔥', text: 'What is Blazor?' },
        { icon: '🌍', text: 'Where is he located?' }
    ],
    [
        { icon: '⚙️', text: 'What frameworks does he use?' },
        { icon: '🧩', text: 'Does he work with microservices?' },
        { icon: '☁️', text: 'Does he use Azure or DevOps?' },
        { icon: '🎖️', text: 'Tell me about his NCC experience' }
    ],
    [
        { icon: '🔗', text: "What is Charan's GitHub profile?" },
        { icon: '📜', text: 'What certifications does he have?' },
        { icon: '🏏', text: 'Does he play cricket?' },
        { icon: '🔒', text: 'What is the RTGS/NEFT project?' }
    ],
    [
        { icon: '🔍', text: 'What is DevLens?' },
        { icon: '💰', text: 'Tell me about Money Mate' },
        { icon: '🎤', text: 'What is Orion AI Assistant?' },
        { icon: '🏏', text: 'What is the Cricket Analyzer?' }
    ],
    [
        { icon: '🎖️', text: 'What is the Best Cadet Award?' },
        { icon: '🏐', text: 'Does Charan play volleyball?' },
        { icon: '📊', text: 'What is his BCA CGPA?' },
        { icon: '🔧', text: 'What tools does he use daily?' }
    ],
    [
        { icon: '🌐', text: 'What languages does he speak?' },
        { icon: '🔄', text: 'What is .NET version migration?' },
        { icon: '🏛️', text: 'What is CTS in banking?' },
        { icon: '🧠', text: 'What are his soft skills?' }
    ],
    [
        { icon: '📱', text: 'Does he know Dart or Flutter?' },
        { icon: '🛡️', text: 'Has he done cybersecurity training?' },
        { icon: '🎓', text: 'Where did he study for BCA?' },
        { icon: '⚡', text: 'What is API versioning?' }
    ],
    [
        { icon: '🏫', text: 'Is he pursuing MCA?' },
        { icon: '💻', text: 'Does he know React?' },
        { icon: '🏅', text: 'Was he in NCC?' },
        { icon: '🗃️', text: 'Does he work with Oracle?' }
    ],
    [
        { icon: '🌍', text: 'What is API globalization?' },
        { icon: '🏏', text: 'Has he captained any sports team?' },
        { icon: '📜', text: 'What internships has he done?' },
        { icon: '🔐', text: 'What is AML in banking?' }
    ],
    [
        { icon: '♟️', text: 'Does Charan play chess?' },
        { icon: '⚙️', text: 'What is Blazor?' },
        { icon: '📄', text: 'What are Razor Pages?' },
        { icon: '🏦', text: 'Which banks does he work with?' }
    ],
    [
        { icon: '🎯', text: 'What is his current focus?' },
        { icon: '📊', text: 'What databases does he know?' },
        { icon: '🚀', text: 'Tell me about his career journey' },
        { icon: '📧', text: "What is Charan's email?" }
    ]
];

/* Randomize starting set so each page load feels fresh */
let suggSetIndex = Math.floor(Math.random() * SUGGESTION_SETS.length);

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