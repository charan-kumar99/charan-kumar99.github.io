

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
    draw(color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const particleColor = isLight ? 'rgba(0, 119, 204, 0.6)' : 'rgba(0, 212, 255, 0.5)';
    const lineBaseColor = isLight ? 'rgba(0, 119, 204, ' : 'rgba(0, 212, 255, ';
    const lineOpacityMultiplier = isLight ? 0.25 : 0.2;

    particles.forEach((p, i) => {
        p.update();
        p.draw(particleColor);
        for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.strokeStyle = lineBaseColor + (lineOpacityMultiplier - dist / 500) + ')';
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

let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
});

const scrollObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.fade-in').forEach(el => scrollObserver.observe(el));

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}
function closeMenu() {
    document.getElementById('navLinks').classList.remove('active');
}
document.addEventListener('click', e => {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.menu-toggle');
    if (
        navLinks &&
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)
    ) {
        closeMenu();
    }
});

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

const API_ENDPOINT = 'https://charan-kumar99-github-io.vercel.app/api/chat';

// Theme handling: respects prefers-color-scheme and persists in localStorage
function applyTheme(name) {
    document.documentElement.setAttribute('data-theme', name);
    localStorage.setItem('theme', name);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = name === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const current = localStorage.getItem('theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

(function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);
})();

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
Versatile .NET Developer currently building scalable property management APIs at AGREMATE Private Limited using Clean Architecture, Docker, and Swagger. Previously developed critical RTGS/NEFT payment processing systems using Microservices Architecture at NTSIPL, serving multiple banks. Proven expertise in full-stack development, Clean Architecture, microservices-based application design, database management across PostgreSQL, MySQL, Oracle Database, and SQL Server, REST API development, Docker containerization, API versioning, globalization, and .NET version migration.

EDUCATION
- **MCA** — MIT, Jaipur (Online) — **Nov 2025 – Present**
- **BCA** — Udupi College of Professional Studies, Mangalore University — **Sep 2022 – Jun 2025** — CGPA: **6.17**
  Add-on Courses (3-Year Program alongside BCA) in Cyber Security, Artificial Intelligence & Big Data Analytics:
    Year 1: Certificate Course | Year 2: Diploma Course | Year 3: Advanced Diploma Course
- **Pre-University (12th)** — St Cecily's Composite PU College, Udupi — **Jul 2020 – Apr 2022** — 67.71%
- **10th Standard** — Volakadu Government High School, Udupi — **Apr 2019 – Jun 2020** — 68%

WORK EXPERIENCE
- **.NET Developer** — AGREMATE Private Limited (**Jun 2026 – Present**)
  Building scalable backend APIs and automated workflows for India's smart property management platform (www.agremate.com).
  AGREMATE bridges the gap between property and software with digital rental agreements, automated payments, community management for gated communities, PG owners, and individual landlords.
  Developing RESTful APIs using **ASP.NET Core** with **Clean Architecture** patterns.
  Containerizing applications using **Docker** for consistent development, testing, and deployment.
  Implementing API documentation with **Swagger** (OpenAPI) for seamless frontend-backend integration.
  Working with **SQL Server**, **Entity Framework Core**, and **Azure** cloud services for the multi-tenant platform.
- **.NET Developer** — Net Tech Services India Private Limited (NTSIPL) (**Dec 2025 – Jun 2026**)
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
- Frameworks  : **ASP.NET Core (.NET 6 & .NET 8)**, **Blazor**, **Razor Pages**, React, Bootstrap 5, **Flask**, Chart.js, **Entity Framework Core**
- Databases   : **PostgreSQL**, **MySQL**, **Oracle Database**, **SQL Server**, SQLite
- Tools       : **Azure DevOps**, GitHub, Visual Studio 2022, VS Code, Postman, DBeaver, **Docker**, **Swagger**
- API & Arch  : **REST APIs**, **Clean Architecture**, **Microservices Architecture**, API Versioning, API Globalization, .NET Migration (6→8)
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
5. **RTGS/NEFT Banking System** — Enterprise payment system built on Microservices Architecture (ASP.NET Core, Microservices, PostgreSQL, MySQL, Oracle Database, Azure DevOps, REST APIs) — Proprietary (built at NTSIPL)

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

ABOUT AGREMATE (Current Company)
AGREMATE (www.agremate.com) is India's smart property management platform by AGREMATE Private Limited.
- It bridges the gap between property and software with digital rental agreements, automated payments, community management, and a clean UI.
- Built for **gated communities**, **PG owners**, and **individual landlords** across India.
- Features include: AI-powered digital rental agreements, AutoPay rent collection, guard app, amenity management, community notice boards, finance reports, and 25+ features.
- Charan works as a **.NET Developer** building the backend APIs using **Clean Architecture**, **Docker**, **Swagger**, **ASP.NET Core**, **SQL Server**, and **Entity Framework Core**.

MICROSERVICES EXPERTISE (from previous role at NTSIPL)
Charan worked extensively with **Microservices Architecture** at NTSIPL.
- The RTGS/NEFT banking system was built on a **microservices-based architecture** where each banking service (RTGS, NEFT, CTS, AML, User Management) was an independently deployable microservice.
- He worked with **service-to-service communication**, **API gateway patterns**, and **database-per-service** design.
- Each microservice had its own database (PostgreSQL, MySQL, or Oracle) enabling independent scaling and deployment.
- Microservices were built using **ASP.NET Core (.NET 6 & .NET 8)** with **REST APIs** for inter-service communication.
- Deployment was managed through **Azure DevOps** CI/CD pipelines for each microservice independently.

CURRENT FOCUS: Building **scalable property management APIs** at **AGREMATE** using **Clean Architecture** & **Docker** while pursuing **MCA**`;

let chatHistory = [];
let isChatOpen = false;
let isLoading = false;

// Voice API & Speech variables
let isTtsEnabled = localStorage.getItem('chat_tts') === 'true';
let isRecording = false;
let recognition = null;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecording = true;
        updateMicButtonState(true);
        chatInputEl.placeholder = "Listening...";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInputEl.value = transcript;
        autoResizeInput(chatInputEl);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopRecording();
        if (event.error === 'not-allowed') {
            alert("Microphone permission denied. Please allow microphone access in your browser settings.");
        }
    };

    recognition.onend = () => {
        stopRecording();
        if (chatInputEl.value.trim()) {
            sendMessage();
        }
    };
} else {
    console.warn("Speech recognition is not supported in this browser.");
}

function toggleSpeech() {
    if (!recognition) {
        alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
        return;
    }
    if (isRecording) {
        recognition.stop();
    } else {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start speech recognition:", e);
        }
    }
}

function stopRecording() {
    isRecording = false;
    updateMicButtonState(false);
    chatInputEl.placeholder = "Ask about Charan...";
}

function updateMicButtonState(recording) {
    const micBtn = document.getElementById('chatMicBtn');
    if (micBtn) {
        if (recording) {
            micBtn.classList.add('recording');
        } else {
            micBtn.classList.remove('recording');
        }
    }
}

function toggleTts() {
    isTtsEnabled = !isTtsEnabled;
    localStorage.setItem('chat_tts', isTtsEnabled);
    updateTtsIcon();
    if (!isTtsEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

function updateTtsIcon() {
    const icon = document.getElementById('chatTtsIcon');
    const btn = document.getElementById('chatTtsBtn');
    if (icon && btn) {
        icon.textContent = isTtsEnabled ? '🔊' : '🔇';
        btn.title = isTtsEnabled ? 'Mute Speech Output' : 'Enable Speech Output';
        btn.classList.toggle('active', isTtsEnabled);
    }
}

function speakText(text) {
    if (!isTtsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    let cleanText = text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[-*]\s+/g, '')
        .replace(/^\d+\.\s+/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural')));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
}

// Rich Cards Registry & Helper
const PROJECT_CARDS_DATA = [
    {
        keywords: ['devlens'],
        title: 'DevLens',
        sub: 'AI GitHub Repository Analyzer',
        github: 'https://github.com/charan-kumar99/DevLens',
        tags: ['C#', 'ASP.NET Core', 'React', 'Gemini API'],
        icon: '🔍'
    },
    {
        keywords: ['money mate', 'moneymate'],
        title: 'Money Mate',
        sub: 'Personal Finance Web App',
        github: 'https://github.com/charan-kumar99/Money_Mate',
        tags: ['Python', 'Flask', 'SQLite', 'Chart.js'],
        icon: '💰'
    },
    {
        keywords: ['cricket performance', 'cricket analyzer'],
        title: 'Cricket Performance Analyzer',
        sub: 'Sports Performance Analytics',
        github: 'https://github.com/charan-kumar99/Cricket-Performance-Analyzer',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js'],
        icon: '🏏'
    },
    {
        keywords: ['orion'],
        title: 'Orion',
        sub: 'AI-Powered Personal Voice Assistant',
        github: 'https://github.com/charan-kumar99/Orion',
        tags: ['Python', 'Flask', 'Speech Recog', 'Google TTS'],
        icon: '🎙️'
    },
    {
        keywords: ['rtgs/neft', 'banking system', 'payment processing'],
        title: 'RTGS/NEFT Banking System',
        sub: 'Enterprise Microservices Project',
        proprietary: true,
        tags: ['ASP.NET Core', 'Microservices', 'PostgreSQL', 'Oracle'],
        icon: '🏦'
    }
];

const CONTACT_CARDS_DATA = [
    {
        keywords: ['email', 'gmail', 'mail charan', 'contact'],
        title: 'Email Charan',
        val: 'charansuvarna99@gmail.com',
        link: 'mailto:charansuvarna99@gmail.com',
        icon: '✉️',
        btnText: 'Send Email'
    },
    {
        keywords: ['linkedin', 'linkedin profile'],
        title: 'LinkedIn',
        val: 'charan-kumar-9b20a8378',
        link: 'https://www.linkedin.com/in/charan-kumar-9b20a8378',
        icon: '🔗',
        btnText: 'Connect on LinkedIn'
    },
    {
        keywords: ['github profile', 'github repo', 'github account'],
        title: 'GitHub',
        val: 'charan-kumar99',
        link: 'https://github.com/charan-kumar99',
        icon: '🐙',
        btnText: 'Follow on GitHub'
    }
];

function generateRichCardsHTML(text) {
    const lowerText = text.toLowerCase();
    let html = '';
    let cardCount = 0;
    const maxCards = 2;

    PROJECT_CARDS_DATA.forEach(proj => {
        const matches = proj.keywords.some(kw => lowerText.includes(kw));
        if (matches && cardCount < maxCards) {
            const tagSpans = proj.tags.map(t => `<span class="card-tag">${t}</span>`).join('');
            const actionButton = proj.proprietary 
                ? `<span class="card-proprietary-label">🔒 Proprietary Enterprise Project</span>`
                : `<a href="${proj.github}" target="_blank" class="card-action-btn"><i class="fa-brands fa-github"></i> View Code</a>`;
            
            html += `
            <div class="rich-card">
                <div class="rich-card-header">
                    <span class="rich-card-icon">${proj.icon}</span>
                    <div class="rich-card-title-group">
                        <div class="rich-card-title">${proj.title}</div>
                        <div class="rich-card-sub">${proj.sub}</div>
                    </div>
                </div>
                <div class="rich-card-tags">${tagSpans}</div>
                <div class="rich-card-actions">${actionButton}</div>
            </div>
            `;
            cardCount++;
        }
    });

    // Match contacts if room left
    CONTACT_CARDS_DATA.forEach(c => {
        const matches = c.keywords.some(kw => lowerText.includes(kw));
        if (matches && cardCount < maxCards) {
            html += `
            <div class="rich-card">
                <div class="rich-card-header">
                    <span class="rich-card-icon">${c.icon}</span>
                    <div class="rich-card-title-group">
                        <div class="rich-card-title">${c.title}</div>
                        <div class="rich-card-sub">${c.val}</div>
                    </div>
                </div>
                <div class="rich-card-actions">
                    <a href="${c.link}" target="_blank" class="card-action-btn primary-btn">${c.btnText}</a>
                </div>
            </div>
            `;
            cardCount++;
        }
    });

    return html;
}

// Trigger initial speaker toggle update
setTimeout(updateTtsIcon, 100);

const chatWindowEl = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const chatInputEl = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatSuggEl = document.getElementById('chatSuggestions');
const chatBubbleEl = document.getElementById('chatBubble');

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

function renderWelcome() {
    chatMessages.innerHTML =
        '<div class="chat-welcome">' +
        '<div class="chat-welcome-emoji">👋</div>' +
        '<div class="chat-welcome-title">Hi! I\'m Charan\'s AI Assistant</div>' +
        '<div class="chat-welcome-sub">Ask me anything about Charan — his skills,<br>projects, experience, or how to reach him!</div>' +
        '</div>';
}

function toggleChat() {
    isChatOpen = !isChatOpen;
    chatWindowEl.classList.toggle('open', isChatOpen);
    chatBubbleEl.classList.toggle('is-open', isChatOpen);

    if (!isChatOpen && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    if (isChatOpen) {
        
        if (chatMessages.children.length === 0) {
            renderSuggestions();
            renderWelcome();
        }
        setTimeout(() => chatInputEl.focus(), 300);
    }
}

function newChat() {
    chatHistory = [];
    chatMessages.innerHTML = '';
    suggSetIndex++;          
    renderSuggestions();
    renderWelcome();
    chatInputEl.value = '';
    chatInputEl.style.height = '22px';
    chatInputEl.style.overflowY = 'hidden';
    chatInputEl.focus();
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
}

function formatBotMessage(text) {
    const lines = text.split('\n');
    let html = '';
    let inUl = false;
    let inOl = false;
    let inCode = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.trim().startsWith('```')) {
            if (inCode) {
                html += '</code></pre>';
                inCode = false;
            } else {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (inOl) { html += '</ol>'; inOl = false; }
                const lang = line.replace('```', '').trim();
                html += `<pre><code class="language-${lang || 'txt'}">`;
                inCode = true;
            }
            continue;
        }

        if (inCode) {
            const escapedLine = line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
            html += escapedLine + '\n';
            continue;
        }

        let t = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

        t = t.replace(/`([^`\n]+)`/g, '<code>$1</code>');
        t = t.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
        t = t.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');

        const ulMatch = t.match(/^[-*]\s+(.+)/);
        const olMatch = t.match(/^\d+\.\s+(.+)/);

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
            if (t.trim() === '') {
                html += '<div class="bot-spacer"></div>';
            } else {
                html += '<span class="bot-line">' + t + '</span>';
            }
        }
    }

    if (inUl) html += '</ul>';
    if (inOl) html += '</ol>';

    const cardsHtml = generateRichCardsHTML(text);
    if (cardsHtml) {
        html += '<div class="rich-cards-container">' + cardsHtml + '</div>';
    }

    return html;
}

function appendMessage(role, text, isError = false) {
    
    if (role === 'user') chatSuggEl.style.display = 'none';

    const wrap = document.createElement('div');
    wrap.className = 'chat-msg ' + role;

    const initials = role === 'bot' ? 'CK' : 'You';
    const errClass = isError ? ' error' : '';
    
    const content = role === 'bot' ? formatBotMessage(text) : escapeHtml(text);

    wrap.innerHTML =
        '<div class="msg-avatar">' + initials + '</div>' +
        '<div class="msg-bubble' + errClass + '">' + content + '</div>';

    chatMessages.appendChild(wrap);
    scrollBottom();
}

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

function scrollBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const text = chatInputEl.value.trim();
    if (!text || isLoading) return;

    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    chatInputEl.value = '';
    chatInputEl.style.height = '22px';
    chatInputEl.style.overflowY = 'hidden';

    appendMessage('user', text);
    chatHistory.push({ role: 'user', content: text });

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
        speakText(reply);

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

function sendSuggestion(text) {
    if (isLoading) return;
    chatInputEl.value = text;
    sendMessage();
}

function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function autoResizeInput(el) {
    el.style.height = '22px';
    const sh = el.scrollHeight;
    el.style.height = Math.min(sh, 110) + 'px';
    el.style.overflowY = sh > 110 ? 'auto' : 'hidden';
}


// ===================================================================
// FEATURE: PROJECT TAG FILTERING
// ===================================================================

(function initProjectFilters() {
    const filtersContainer = document.getElementById('projectFilters');
    if (!filtersContainer) return;

    const pills = filtersContainer.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.project-card[data-tags]');

    filtersContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;

        // Update active pill
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;

        cards.forEach((card, i) => {
            const tags = card.dataset.tags || '';
            const show = filter === 'all' || tags.split(',').includes(filter);

            // Stagger the animation
            card.style.transitionDelay = show ? `${i * 0.06}s` : '0s';

            if (show) {
                card.classList.remove('filter-hidden');
                // Ensure fade-in visible state is preserved
                card.classList.add('visible');
            } else {
                card.classList.add('filter-hidden');
            }
        });

        // Clear delays after animation
        setTimeout(() => {
            cards.forEach(card => card.style.transitionDelay = '');
        }, 500);
    });
})();

// ===================================================================
// FEATURE: SKILLS SEARCH & HIGHLIGHT
// ===================================================================

(function initSkillsSearch() {
    const searchInput = document.getElementById('skillsSearch');
    const clearBtn = document.getElementById('skillsSearchClear');
    if (!searchInput || !clearBtn) return;

    const skillCards = document.querySelectorAll('.skill-card');
    const categories = document.querySelectorAll('.skills-category');
    const skillsSection = document.getElementById('skills');

    // Create results count element
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'skills-search-results-count';
    resultsDiv.style.display = 'none';
    const searchWrapper = document.querySelector('.skills-search-wrapper');
    if (searchWrapper) {
        searchWrapper.insertAdjacentElement('afterend', resultsDiv);
    }

    function performSearch(query) {
        const q = query.toLowerCase().trim();

        // Show/hide clear button
        clearBtn.classList.toggle('visible', q.length > 0);

        if (!q) {
            // Reset all
            skillCards.forEach(card => {
                card.classList.remove('skill-match', 'skill-dim');
            });
            categories.forEach(cat => {
                cat.classList.remove('category-hidden');
            });
            resultsDiv.style.display = 'none';
            return;
        }

        let matchCount = 0;

        // Check each category
        categories.forEach(category => {
            const cardsInCategory = category.querySelectorAll('.skill-card');
            let categoryHasMatch = false;

            cardsInCategory.forEach(card => {
                const name = card.querySelector('.skill-name');
                const text = name ? name.textContent.toLowerCase() : '';
                const isMatch = text.includes(q);

                card.classList.toggle('skill-match', isMatch);
                card.classList.toggle('skill-dim', !isMatch);

                if (isMatch) {
                    categoryHasMatch = true;
                    matchCount++;
                }
            });

            // Hide empty categories
            category.classList.toggle('category-hidden', !categoryHasMatch);
        });

        // Update results count
        resultsDiv.innerHTML = `Found <span>${matchCount}</span> skill${matchCount !== 1 ? 's' : ''} matching "<span>${escapeHtml(q).replace(/<br>/g, '')}</span>"`;
        resultsDiv.style.display = 'block';
    }

    // Debounced search
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(searchInput.value);
        }, 150);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        performSearch('');
        searchInput.focus();
    });
})();

// ===================================================================
// FEATURE: RADAR CHART TOOLTIP
// ===================================================================

(function initRadarTooltip() {
    const container = document.getElementById('radarChartContainer');
    if (!container) return;

    const dots = container.querySelectorAll('.radar-dot');

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'radar-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        padding: 0.45rem 0.8rem;
        background: rgba(10, 14, 39, 0.92);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 10px;
        color: #e8f1ff;
        font-size: 0.82rem;
        font-weight: 600;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease, transform 0.2s ease;
        transform: translateY(5px);
        z-index: 10;
        white-space: nowrap;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    container.style.position = 'relative';
    container.appendChild(tooltip);

    dots.forEach(dot => {
        dot.addEventListener('mouseenter', (e) => {
            const label = dot.getAttribute('data-label');
            const value = dot.getAttribute('data-value');
            tooltip.innerHTML = `<span style="color:var(--primary)">${label}</span>: <span style="color:var(--accent)">${value}%</span>`;
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';

            // Position tooltip
            const svg = container.querySelector('.radar-svg');
            const svgRect = svg.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const cx = parseFloat(dot.getAttribute('cx'));
            const cy = parseFloat(dot.getAttribute('cy'));

            // Convert SVG coordinates to container coordinates
            const viewBox = svg.viewBox.baseVal;
            const scaleX = svgRect.width / viewBox.width;
            const scaleY = svgRect.height / viewBox.height;
            const offsetX = svgRect.left - containerRect.left;
            const offsetY = svgRect.top - containerRect.top;

            const x = cx * scaleX + offsetX;
            const y = cy * scaleY + offsetY;

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y - 40}px`;

            // Adjust if going off-screen right
            const tooltipRect = tooltip.getBoundingClientRect();
            if (tooltipRect.right > containerRect.right) {
                tooltip.style.left = `${x - tooltipRect.width}px`;
            }
            if (tooltipRect.left < containerRect.left) {
                tooltip.style.left = `${offsetX + 10}px`;
            }
        });

        dot.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(5px)';
        });
    });
})();

document.addEventListener('click', e => {
    if (
        isChatOpen &&
        !chatWindowEl.contains(e.target) &&
        !chatBubbleEl.contains(e.target)
    ) {
        toggleChat();
    }
});