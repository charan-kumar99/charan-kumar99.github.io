

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
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    let particleColor, lineBaseColor, lineOpacityMultiplier;
    switch (theme) {
        case 'light':
            particleColor = 'rgba(0, 119, 204, 0.6)';
            lineBaseColor = 'rgba(0, 119, 204, ';
            lineOpacityMultiplier = 0.25;
            break;
        case 'cyberpunk':
            particleColor = 'rgba(255, 0, 127, 0.5)';
            lineBaseColor = 'rgba(255, 0, 127, ';
            lineOpacityMultiplier = 0.2;
            break;
        case 'emerald':
            particleColor = 'rgba(16, 185, 129, 0.5)';
            lineBaseColor = 'rgba(16, 185, 129, ';
            lineOpacityMultiplier = 0.2;
            break;
        default:
            particleColor = 'rgba(0, 212, 255, 0.5)';
            lineBaseColor = 'rgba(0, 212, 255, ';
            lineOpacityMultiplier = 0.2;
            break;
    }

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
const scrollProgressBar = document.getElementById('scrollProgressBar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);

    if (scrollProgressBar) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgressBar.style.width = scrollPercent + '%';
    }
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

// Palette / Theme handling: supports 4 palettes with localStorage persistence
const PALETTES = {
    dark:      { name: 'Neo-Cyan',  icon: '🌊' },
    cyberpunk: { name: 'Cyberpunk', icon: '🌆' },
    emerald:   { name: 'Emerald',   icon: '🌿' },
    light:     { name: 'Light Pro', icon: '☀️' }
};

function applyPalette(name) {
    document.documentElement.setAttribute('data-theme', name);
    localStorage.setItem('theme', name);
    const icon = document.getElementById('themeIcon');
    if (icon && PALETTES[name]) {
        icon.textContent = PALETTES[name].icon;
    }
    // Update active swatch
    document.querySelectorAll('.palette-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.palette === name);
    });
    closePalettePanel();
}

function togglePalettePanel() {
    const panel = document.getElementById('palettePanel');
    if (panel) panel.classList.toggle('open');
}

function closePalettePanel() {
    const panel = document.getElementById('palettePanel');
    if (panel) panel.classList.remove('open');
}

// Close palette panel on outside click
document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('paletteWrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        closePalettePanel();
    }
});


(function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    applyPalette(saved);
})();

const SYSTEM_PROMPT = `You are a friendly AI assistant embedded in Charan Kumar's portfolio website.
You answer questions about Charan Kumar — his skills, projects, experience, education, and contact info.
IMPORTANT: When someone asks about a technology, framework, or concept (e.g. "what is microservices?", "what is Blazor?", "what is REST API?"), ALWAYS start with how Charan specifically uses it in his work, then give a brief technical explanation. The context must be Charan's experience first, not a generic definition.
Only decline questions that are completely unrelated to Charan or his tech stack (e.g. cooking recipes, politics, etc).
Note: If asked about Redis, explicitly state that Charan uses Redis caching at his current company, AGREMATE, and clarify that he did not use it at NTSIPL.

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
Languages spoken: English, Hindi, Kannada, Tulu (mother tongue is Tulu)

PROFESSIONAL SUMMARY
Versatile .NET Developer currently building scalable property management APIs at AGREMATE Private Limited using Clean Architecture, Docker, Redis cache, and Swagger. Previously developed critical RTGS/NEFT payment processing systems using Microservices Architecture at NTSIPL, serving multiple banks. Proven expertise in full-stack development, Clean Architecture, microservices-based application design, database management across PostgreSQL, MySQL, Oracle Database, SQL Server, and Redis, REST API development, Docker containerization, API versioning, globalization, and .NET version migration.

EDUCATION
- **MCA** — MIT, Jaipur (Online) — **Nov 2025 – Present**
- **BCA** — Udupi College of Professional Studies, Mangalore University — **Sep 2022 – Jun 2025** — CGPA: **6.17**
  Add-on Courses (3-Year Program alongside BCA) in Cyber Security, Artificial Intelligence & Big Data Analytics:
    Year 1: Certificate Course | Year 2: Diploma Course | Year 3: Advanced Diploma Course
- **Pre-University (12th)** — St Cecily's Composite PU College, Udupi — **Jul 2020 – Apr 2022** — 67.71%
- **10th Standard** — Volakadu Government High School, Udupi — **Apr 2019 – Jun 2020** — 68%

WORK EXPERIENCE
- **Software Developer (Hybrid)** — AGREMATE Private Limited (**Jun 2026 – Present**)
  Building scalable backend APIs and automated workflows for India's smart property management platform (www.agremate.com).
  AGREMATE bridges the gap between property and software with digital rental agreements, automated payments, community management for gated communities, PG owners, and individual landlords.
  Developing RESTful APIs using **ASP.NET Core** with **Clean Architecture** patterns.
  Containerizing applications using **Docker** for consistent development, testing, and deployment.
  Implementing API documentation with **Swagger** (OpenAPI) for seamless frontend-backend integration.
  Working with **SQL Server**, **Entity Framework Core**, **Redis** (caching layer), and **Azure** cloud services for the multi-tenant platform.
- **.NET Developer (Onsite)** — Net Tech Services India Private Limited (NTSIPL) (**Dec 2025 – Jun 2026**)
  Development on RTGS/NEFT banking project for major Banks and Vendors using **Microservices Architecture**.
  Working with microservices-based architecture for building scalable, independently deployable banking services with service-to-service communication and API gateway patterns.
  Contributed to CTS (Cheque Truncation System), AML (Anti-Money Laundering), and User Management systems.
  Full-stack with ASP.NET Core, Blazor, Razor Pages. Database management across PostgreSQL, MySQL, Oracle Database, and SQL Server.
  REST APIs, CRUD operations, API globalization, .NET version migration (6→8).
  Testing, debugging, Azure DevOps CI/CD deployment. Tools: Visual Studio 2022, Postman, DBeaver, FTP/SFTP.
- **Trainee Developer (Onsite)** — NTSIPL (**Sep 2025 – Dec 2025**)
  Gained hands-on experience in ASP.NET Core enterprise development in the financial domain.
  Contributed features, resolved bugs, collaborated with senior developers.

SKILLS
- Languages   : **C#**, **Java**, **JavaScript**, **C**, **Python**, HTML5, CSS3, Dart
- Frameworks  : **ASP.NET Core (.NET 6 & .NET 8)**, **Blazor**, **Razor Pages**, React, **Flutter**, Bootstrap 5, **Flask**, Chart.js, **Entity Framework Core**
- Databases   : **PostgreSQL**, **MySQL**, **Oracle Database**, **SQL Server**, SQLite, **Redis**
- Tools       : **Azure DevOps** (including Repos, Boards, Pipelines), GitHub, Visual Studio 2022, VS Code, Postman, DBeaver, **Docker**, **Swagger**, **Firebase**, **Razorpay**, **Vercel Serverless**, **localStorage**, **Web Speech API**, **HTML5 Canvas**
- API & Arch  : **REST APIs**, **Clean Architecture**, **Microservices Architecture**, **CI/CD Pipelines**, API Versioning, API Globalization, .NET Migration (6→8)
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
5. **DueZy** — Premium Bill & EMI Reminder Mobile App (Flutter, Dart, Firebase Firestore, Firebase Auth, Local Notifications, SharedPreferences) — Designed to track education loans, EMIs, and bills.
   GitHub: https://github.com/charan-kumar99/DueZy
6. **Advanced Developer Portfolio** — Immersive Next.js/React portfolio featuring 3D visuals (Three.js, React Three Fiber), GSAP, WakaTime metrics, and GROQ/Gemini AI chat assistant.
   GitHub: https://github.com/charan-kumar99/Advanced-Portfolio
   Live: https://advanced-portfolio-sandy.vercel.app/
7. **Migration Master** — High-Performance PostgreSQL Database Migration Tool in C# (.NET 8) featuring bulk binary COPY protocol ('COPY FROM STDIN'), topological dependency sorting with Kahn's Algorithm, full schema/constraint replication, identity sequence syncing, and interactive Spectre.Console CLI.
   GitHub: https://github.com/charan-kumar99/Migration-Master
8. **RTGS/NEFT Banking System** — Enterprise payment system built on Microservices Architecture (ASP.NET Core, Microservices, PostgreSQL, MySQL, Oracle Database, Azure DevOps, REST APIs, SFTP/FTP, IIS Hosting, Blazor, Razor Pages, .NET 6 & .NET 8) — Proprietary (built at NTSIPL)

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
- Charan works as a **Software Developer** building the backend APIs using **Clean Architecture**, **Docker**, **Swagger**, **ASP.NET Core**, **SQL Server**, **Entity Framework Core**, and **Redis** caching.

MICROSERVICES EXPERTISE (from previous role at NTSIPL)
Charan worked extensively with **Microservices Architecture** at NTSIPL.
- The RTGS/NEFT banking system was built on a **microservices-based architecture** where each banking service (RTGS, NEFT, CTS, AML, User Management) was an independently deployable microservice.
- He worked with **service-to-service communication**, **API gateway patterns**, and **database-per-service** design.
- Each microservice had its own database (PostgreSQL, MySQL, or Oracle) enabling independent scaling and deployment.
- Microservices were built using **ASP.NET Core (.NET 6 & .NET 8)** with **REST APIs** for inter-service communication.
- Deployment was managed through **Azure DevOps** CI/CD pipelines for each microservice independently.

CURRENT FOCUS: Building **scalable property management APIs** at **AGREMATE** using **Clean Architecture**, **Docker**, and **Redis** caching while pursuing **MCA**.

PORTFOLIO FEATURES & EASTER EGGS (Tell users about these if they ask about the website)
- **Developer CLI Terminal**: There is a hidden matrix-style terminal drawer! Users can open it by clicking the 💻 icon in the top navbar or pressing the Backtick (\`) key. They can type commands like 'help', 'skills', 'projects', and 'contact' to interact with the site.
- **AI Voice Assistant**: This chat box supports Voice Input (with a live audio waveform visualizer) and Text-to-Speech playback!
- **Projects Simulator**: There is an interactive projects simulator on the page that lets users test out Orion Voice Assistant and DevLens right from the browser.
- **Theme Palette**: Users can change the website's color theme (Cyberpunk, Emerald, Neo-Cyan, Light Pro) using the palette icon in the navbar.`;

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
        keywords: ['migration master', 'migration-master', 'migrationmaster', 'postgres migration', 'database migration'],
        title: 'Migration Master',
        sub: 'PostgreSQL Migration Tool in C#',
        github: 'https://github.com/charan-kumar99/Migration-Master',
        tags: ['C#', '.NET 8', 'PostgreSQL', 'Binary COPY', 'Spectre.Console'],
        icon: '🚀'
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
        { icon: '🚀', text: 'Tell me about Migration Master' },
        { icon: '🔍', text: 'What is DevLens?' },
        { icon: '💰', text: 'Tell me about Money Mate' },
        { icon: '🎤', text: 'What is Orion AI Assistant?' }
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
    localStorage.removeItem('chat_history');
    chatMessages.innerHTML = '';
    suggSetIndex++;          
    renderSuggestions();
    renderWelcome();
    chatInputEl.value = '';
    chatInputEl.style.height = '22px';
    chatInputEl.style.overflowY = 'hidden';
    chatInputEl.focus();
}

function saveChatHistory() {
    localStorage.setItem('chat_history', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
        try {
            chatHistory = JSON.parse(saved);
            chatMessages.innerHTML = '';
            if (chatHistory.length === 0) {
                renderSuggestions();
                renderWelcome();
            } else {
                chatSuggEl.style.display = 'none'; // Hide suggestions if history exists
                chatHistory.forEach(msg => {
                    appendMessage(msg.role === 'assistant' ? 'bot' : 'user', msg.content);
                });
            }
        } catch (e) {
            console.error('Failed to parse chat history:', e);
            chatHistory = [];
            renderSuggestions();
            renderWelcome();
        }
    } else {
        renderSuggestions();
        renderWelcome();
    }
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
}

window.copyCodeText = function(button) {
    const wrapper = button.closest('.code-block-wrapper');
    const code = wrapper.querySelector('code');
    if (!code) return;
    
    const textToCopy = code.innerText || code.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        button.textContent = 'Copied!';
        button.style.borderColor = 'var(--accent)';
        button.style.color = 'var(--accent)';
        setTimeout(() => {
            button.textContent = 'Copy';
            button.style.borderColor = '';
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
    });
};

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
                html += '</code></pre><button class="code-copy-btn" onclick="copyCodeText(this)">Copy</button></div>';
                inCode = false;
            } else {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (inOl) { html += '</ol>'; inOl = false; }
                const lang = line.replace('```', '').trim();
                html += `<div class="code-block-wrapper"><pre><code class="language-${lang || 'txt'}">`;
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
    if (inCode) html += '</code></pre><button class="code-copy-btn" onclick="copyCodeText(this)">Copy</button></div>';

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
    saveChatHistory();

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
        saveChatHistory();
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

function askAiQuestion(text) {
    if (isLoading) return;

    // Scroll down to the chat bubble if viewport width matches mobile (< 768px)
    if (window.innerWidth < 768) {
        const chatBubble = document.getElementById('chatBubble');
        if (chatBubble) {
            chatBubble.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Open chat window if not already open
    if (!isChatOpen) {
        toggleChat();
    }

    // Populate the question in the text area
    chatInputEl.value = text;
    autoResizeInput(chatInputEl);

    // Briefly delay sending to allow the open animation/focus to complete
    setTimeout(() => {
        sendMessage();
    }, 150);
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

(function initRadarInteractive() {
    const container = document.getElementById('radarChartContainer');
    if (!container) return;

    const svg = container.querySelector('.radar-svg');
    const dataPoly = container.querySelector('.radar-data');
    const dots = container.querySelectorAll('.radar-dot');
    const labels = container.querySelectorAll('.radar-label');
    const traitCard = document.getElementById('radarTraitCard');

    // Tooltip creation
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

    // Target coordinates
    const targetPoints = [
        { x: 200, y: 48 },   // Leadership
        { x: 341, y: 155 },  // Strategy
        { x: 298, y: 317 },  // Teamwork
        { x: 100, y: 322 },  // Endurance
        { x: 58, y: 155 }    // Technical Agility
    ];

    const centerPoint = { x: 200, y: 200 };

    // Trait narratives
    const narratives = {
        'leadership': {
            icon: '👑',
            title: 'Leadership',
            value: '95%',
            desc: 'Developed as NCC Lead Cadet and Captain of school/college sports teams. Proven track record of team organization, event planning, and guiding groups towards shared goals under pressure.'
        },
        'strategy': {
            icon: '🎯',
            title: 'Strategy & Tactics',
            value: '80%',
            desc: 'Cultivated through competitive chess and leading cricket teams. Applied in technical environments to design optimal SQL server query plans, structure microservices API topologies, and architect clean solutions.'
        },
        'teamwork': {
            icon: '🤝',
            title: 'Collaborative Teamwork',
            value: '90%',
            desc: 'Refined by collaborating on complex RTGS/NEFT payment gateway microservices. Focuses on seamless integration, documentation, and active communication within agile teams.'
        },
        'endurance': {
            icon: '⚡',
            title: 'Endurance & Grit',
            value: '88%',
            desc: 'Demonstrated by pursuing an online MCA degree from MIT Jaipur in parallel with full-time software developer employment, sustaining high performance across academic and professional duties.'
        },
        'technical agility': {
            icon: '💻',
            title: 'Technical Agility',
            value: '85%',
            desc: 'Proven ability to work fluidly across diverse databases (PostgreSQL, SQL Server, MySQL, Oracle) and migrate platforms from .NET 6 to .NET 8, adapting quickly to new architectural requirements.'
        }
    };

    // Set initial layout at center
    function setRadarCoordinates(progress) {
        const currentPoints = targetPoints.map(target => {
            const x = centerPoint.x + (target.x - centerPoint.x) * progress;
            const y = centerPoint.y + (target.y - centerPoint.y) * progress;
            return { x, y };
        });

        // Update Polygon points
        const pointsStr = currentPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
        dataPoly.setAttribute('points', pointsStr);

        // Update Dots position
        dots.forEach((dot, idx) => {
            dot.setAttribute('cx', currentPoints[idx].x.toFixed(1));
            dot.setAttribute('cy', currentPoints[idx].y.toFixed(1));
        });
    }

    // Initialize at center
    setRadarCoordinates(0);

    // Scroll trigger observer
    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateRadar();
            }
        });
    }, { threshold: 0.15 });

    observer.observe(container);

    function animateRadar() {
        const duration = 1200; // ms
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            setRadarCoordinates(easeProgress);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    // Update trait card text
    function selectTrait(labelName) {
        const key = labelName.toLowerCase().trim();
        const data = narratives[key];
        if (!data || !traitCard) return;

        // Visual flash animation
        traitCard.classList.remove('active-pulse');
        void traitCard.offsetWidth; // Reflow
        traitCard.classList.add('active-pulse');

        // Update content
        const iconEl = traitCard.querySelector('.radar-trait-icon');
        const titleEl = traitCard.querySelector('.radar-trait-title');
        const valueEl = traitCard.querySelector('.radar-trait-value');
        const descEl = traitCard.querySelector('.radar-trait-desc');

        if (iconEl) iconEl.textContent = data.icon;
        if (titleEl) titleEl.textContent = data.title;
        if (valueEl) valueEl.textContent = data.value;
        if (descEl) descEl.textContent = data.desc;

        // Set active classes on SVG elements
        dots.forEach(dot => {
            const isMatch = dot.getAttribute('data-label').toLowerCase().trim() === key;
            dot.classList.toggle('active', isMatch);
        });

        labels.forEach(label => {
            const isMatch = label.textContent.toLowerCase().trim() === key;
            label.classList.toggle('active', isMatch);
        });
    }

    // Attach click handlers
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const label = dot.getAttribute('data-label');
            selectTrait(label);
        });

        // Hover Tooltip positions
        dot.addEventListener('mouseenter', () => {
            const label = dot.getAttribute('data-label');
            const value = dot.getAttribute('data-value');
            tooltip.innerHTML = `<span style="color:var(--primary)">${label}</span>: <span style="color:var(--accent)">${value}%</span>`;
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';

            const svgRect = svg.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const cx = parseFloat(dot.getAttribute('cx'));
            const cy = parseFloat(dot.getAttribute('cy'));

            const viewBox = svg.viewBox.baseVal;
            const scaleX = svgRect.width / viewBox.width;
            const scaleY = svgRect.height / viewBox.height;
            const offsetX = svgRect.left - containerRect.left;
            const offsetY = svgRect.top - containerRect.top;

            const x = cx * scaleX + offsetX;
            const y = cy * scaleY + offsetY;

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y - 40}px`;

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

    // Also support clicking text labels
    labels.forEach(label => {
        label.style.cursor = 'pointer';
        label.addEventListener('click', () => {
            const name = label.textContent;
            selectTrait(name);
        });
    });
})();

document.addEventListener('click', e => {
    if (
        isChatOpen &&
        !chatWindowEl.contains(e.target) &&
        !chatBubbleEl.contains(e.target) &&
        !e.target.closest('.hero-chip')
    ) {
        toggleChat();
    }
});

// ===================================================================
// FEATURE: GLASSMORPHIC AVATAR 3D TILT
// ===================================================================

(function initAvatarTilt() {
    const avatar = document.getElementById('aboutAvatar');
    if (!avatar) return;
    const card = avatar.querySelector('.avatar-glass-card');
    if (!card) return;

    avatar.addEventListener('mousemove', (e) => {
        const rect = avatar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    avatar.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
})();

// ===================================================================
// FEATURE: SKILL CARD BRAND GLOW COLORS
// ===================================================================

(function initSkillGlows() {
    const glowMap = {
        'C#': '#68217A',
        'Java': '#ED8B00',
        'JavaScript': '#F7DF1E',
        'C': '#A8B9CC',
        'HTML5': '#E34F26',
        'CSS3': '#1572B6',
        'Dart': '#0175C2',
        'Python': '#3776AB',
        'ASP.NET Core (.NET 6 & .NET 8)': '#512BD4',
        'Blazor': '#512BD4',
        'Razor Pages': '#512BD4',
        'React': '#61DAFB',
        'Bootstrap 5': '#7952B3',
        'Flask': '#44A833',
        'Chart.js': '#FF6384',
        'PostgreSQL': '#4169E1',
        'MySQL': '#4479A1',
        'Oracle Database': '#F80000',
        'SQL Server': '#CC2927',
        'SQLite': '#44A8D6',
        'Redis': '#DC382D',
        'Azure DevOps': '#0078D7',
        'CI/CD Pipelines': '#00F5FF',
        'GitHub': '#6e7681',
        'Visual Studio 2022': '#5C2D91',
        'VS Code': '#007ACC',
        'Postman': '#FF6C37',
        'DBeaver': '#8A6B4D',
        'FTP / SFTP': '#00D4FF',
        'Docker': '#2496ED',
        'Swagger': '#85EA2D',
        'Firebase': '#FFCA28',
        'Razorpay': '#1075F3',
        'Vercel Serverless': '#000000',
        'localStorage': '#FF9900',
        'Web Speech API': '#10B981',
        'HTML5 Canvas': '#E34F26',
        'REST APIs': '#00D4FF',
        'Microservices Architecture': '#00D4FF',
        'Clean Architecture': '#10B981',
        'API Versioning': '#00D4FF',
        'API Globalization': '#FFB800',
        '.NET Migration (6→8)': '#512BD4',
        'Analytical Thinking': '#FF6B6B',
        'Active Listening': '#4ECDC4',
        'Team Leadership': '#FFE66D',
        'Fast Learner': '#A8E6CF',
        'Detail-Oriented': '#FF8B94',
        'Collaborative': '#DDA0DD'
    };

    document.querySelectorAll('.skill-card').forEach(card => {
        const nameEl = card.querySelector('.skill-name');
        if (!nameEl) return;
        const name = nameEl.textContent.trim();
        const color = glowMap[name];
        if (color) {
            card.style.setProperty('--glow-color', color);
        }
    });
})();

// ===================================================================
// FEATURE: INTERACTIVE WORK EXPERIENCE DRAWERS & BADGES
// ===================================================================

(function initTimelineDrawers() {
    const toggleButtons = document.querySelectorAll('.timeline-toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const drawer = btn.nextElementSibling;
            if (!drawer) return;
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            drawer.classList.toggle('expanded', !isExpanded);
            
            const textSpan = btn.querySelector('span');
            if (textSpan) {
                textSpan.textContent = isExpanded ? 'Architecture & Tech Details' : 'Hide Details';
            }
        });
    });

    const badges = document.querySelectorAll('.timeline-badge');
    badges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            const skillName = badge.getAttribute('data-skill');
            if (!skillName) return;
            
            const skillCards = document.querySelectorAll('.skill-card');
            let matchedCard = null;
            
            skillCards.forEach(card => {
                const nameEl = card.querySelector('.skill-name');
                if (nameEl) {
                    const text = nameEl.textContent.trim().toLowerCase();
                    const target = skillName.trim().toLowerCase();
                    if (text === target || text.includes(target) || target.includes(text)) {
                        matchedCard = card;
                    }
                }
            });

            if (matchedCard) {
                const skillsSection = document.getElementById('skills');
                if (skillsSection) {
                    skillsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                setTimeout(() => {
                    matchedCard.classList.remove('skill-highlight-active');
                    void matchedCard.offsetWidth; // Reflow
                    matchedCard.classList.add('skill-highlight-active');
                    
                    setTimeout(() => {
                        matchedCard.classList.remove('skill-highlight-active');
                    }, 2600);
                }, 600);
            }
        });
    });
})();

// ===================================================================
// FEATURE: PROJECTS WORKFLOW SIMULATOR
// ===================================================================

(function initProjectsSimulator() {
    const flowMetadata = {
        devlens: {
            nodes: [
                { icon: "💻", title: "Web UI Input", sub: "React Client Search" },
                { icon: "🛡️", title: "API Gateway", sub: "ASP.NET Core Router" },
                { icon: "🐙", title: "Git Wrapper", sub: "GitHub REST API client" },
                { icon: "🤖", title: "Gemini Agent", sub: "Google Gemini AI" },
                { icon: "🗄️", title: "Cache Service", sub: "SQLite Database TTL" },
                { icon: "📊", title: "Chart Engine", sub: "D3.js / Recharts" },
                { icon: "📈", title: "Visual Dashboard", sub: "Metrics Analytics UI" }
            ],
            steps: [
                {
                    nodeName: "Web UI Input",
                    desc: "User enters repository URL 'charan-kumar99/DevLens' in the search bar of the React client.",
                    logs: [
                        "INFO - Repository lookup initiated: charan-kumar99/DevLens",
                        "DEBUG - Checking inputs: url=https://github.com/charan-kumar99/DevLens",
                        "INFO - Handing request to HTTP client..."
                    ]
                },
                {
                    nodeName: "API Gateway",
                    desc: "ASP.NET Core Gateway intercepts request, performs security handshake, and routes to Git Analysis Service.",
                    logs: [
                        "SEC - SSL Handshake completed with React UI Client",
                        "SEC - API Key check: OK, CORS validation: PASSED",
                        "INFO - Routing request to internal GitHub Wrapper Service..."
                    ]
                },
                {
                    nodeName: "Git Wrapper",
                    desc: "GitHub Wrapper sends authenticated REST queries to GitHub API to scrape commits, forks, issues, and size metrics.",
                    logs: [
                        "INFO - Dispatching request to api.github.com/repos/charan-kumar99/DevLens",
                        "DEBUG - Rate limiting: 4982/5000 remaining",
                        "SUCCESS - Fetched repo details, commits history, and language files successfully."
                    ]
                },
                {
                    nodeName: "Gemini Agent",
                    desc: "Google Gemini API analyzes documentation files, scores README content, and generates risk/architectural summaries.",
                    logs: [
                        "INFO - Sending repo structure & README.md context payload to Google Gemini API",
                        "DEBUG - Invoking Gemini model gemini-1.5-flash",
                        "SUCCESS - AI Summary generated. Scoring: README=95/100, Risk=Low"
                    ]
                },
                {
                    nodeName: "Cache Service",
                    desc: "Saves analysis response into SQLite database with a 24-hour TTL timestamp to optimize repeated searches.",
                    logs: [
                        "SQL - INSERT INTO RepoCache (repo_path, payload, analyzed_at) VALUES ('charan-kumar99/DevLens', '...', datetime('now'))",
                        "DEBUG - SQLite cache written successfully",
                        "INFO - Cached record expires in 24 hours"
                    ]
                },
                {
                    nodeName: "Chart Engine",
                    desc: "D3.js and Recharts parse repository data to compute code metrics, timeline distributions, and contributor ratios.",
                    logs: [
                        "DEBUG - Aggregating file types: C#=72%, TSX=20%, CSS=5%, Others=3%",
                        "INFO - Compiling commits timeline: total_commits=142, duration=6 months",
                        "DEBUG - Generating D3 charts coordinates payload..."
                    ]
                },
                {
                    nodeName: "Visual Dashboard",
                    desc: "React dashboard renders responsive interactive charts, AI risk matrices, and comprehensive repository scores.",
                    logs: [
                        "SUCCESS - Visual Dashboard components loaded successfully",
                        "SYSTEM - Flow completed. Repository analyzed in 340ms"
                    ]
                }
            ]
        },
        moneymate: {
            nodes: [
                { icon: "👤", title: "UI Transaction", sub: "User Expense / CSV" },
                { icon: "📂", title: "Flask Route", sub: "Route Controller" },
                { icon: "🛡️", title: "Sanitizer Unit", sub: "CSRF & SQL Audit" },
                { icon: "🔄", title: "SQLAlchemy ORM", sub: "ORM Data Mapper" },
                { icon: "🗄️", title: "SQLite DB", sub: "Local Storage Node" },
                { icon: "📊", title: "Chart.js Engine", sub: "Data Visualization" },
                { icon: "🔔", title: "Alert Engine", sub: "Budget Threshold Check" }
            ],
            steps: [
                {
                    nodeName: "UI Transaction",
                    desc: "User logs a new expense (₹12,000 for rent) or imports a monthly credit card statement CSV file.",
                    logs: [
                        "INFO - Expense submission triggered: Category=Rent, Amount=12000 INR",
                        "DEBUG - File upload detected: statement_june2026.csv (size=12KB)",
                        "INFO - Packing parameters into JSON request..."
                    ]
                },
                {
                    nodeName: "Flask Route",
                    desc: "Flask Backend route parses POST request headers and initiates a transaction scope.",
                    logs: [
                        "INFO - HTTP POST /api/transactions - Request intercepted",
                        "DEBUG - User authenticated: user_id=402",
                        "INFO - Handing parameters to transaction processing unit..."
                    ]
                },
                {
                    nodeName: "Sanitizer Unit",
                    desc: "Security middleware verifies CSRF tokens and strips input strings to prevent SQL injections.",
                    logs: [
                        "SEC - CSRF token verification: PASSED",
                        "SEC - SQL Injection checks: CLEAN",
                        "INFO - Forwarding sanitized data to ORM layer..."
                    ]
                },
                {
                    nodeName: "SQLAlchemy ORM",
                    desc: "SQLAlchemy ORM maps the transaction entity schema and generates an atomic database query.",
                    logs: [
                        "INFO - Creating Transaction entity object mapping",
                        "DEBUG - Entity State: Pending, Currency: INR, Multi-currency Conversion: 1.00",
                        "INFO - Initializing Unit of Work transaction scope..."
                    ]
                },
                {
                    nodeName: "SQLite DB",
                    desc: "SQLite database commits the record, updating current account ledger balances and saving historical stats.",
                    logs: [
                        "SQL - INSERT INTO transactions (user_id, amount, category, date) VALUES (402, 12000, 'Rent', '2026-06-14')",
                        "SQL - UPDATE accounts SET balance = balance - 12000 WHERE user_id = 402",
                        "SUCCESS - Transaction committed. Database synchronized successfully."
                    ]
                },
                {
                    nodeName: "Chart.js Engine",
                    desc: "Chart.js updates expense distribution graphs, budget trackers, and monthly spending profiles on the screen.",
                    logs: [
                        "DEBUG - Aggregating categories totals: Rent=35%, Food=15%, Transport=10%, Misc=40%",
                        "INFO - Refreshing canvas chart.js instance",
                        "SUCCESS - Chart rendering completed successfully."
                    ]
                },
                {
                    nodeName: "Alert Engine",
                    desc: "Budget engine verifies thresholds. Dispatches alerts if the category limits are breached.",
                    logs: [
                        "INFO - Category check: 'Rent' threshold set to 15,000 INR",
                        "INFO - Monthly spent in 'Rent': 12,000 INR (80% of budget)",
                        "SYSTEM - Flow completed. Transaction processed successfully."
                    ]
                }
            ]
        },
        cricket: {
            nodes: [
                { icon: "🏏", title: "Match Form", sub: "Scorecard Metric Input" },
                { icon: "⚙️", title: "ES6 Calc Engine", sub: "Strike Rate Processor" },
                { icon: "💾", title: "LocalStorage", sub: "Persistent Cache" },
                { icon: "📊", title: "Chart.js compiler", sub: "Trends Visualization" },
                { icon: "💬", title: "Query Input UI", sub: "Natural Query Box" },
                { icon: "🤖", title: "Query Parser", sub: "Keyword Parser Engine" },
                { icon: "📋", title: "Stats Dashboard", sub: "Filtered Output Board" }
            ],
            steps: [
                {
                    nodeName: "Match Form",
                    desc: "User inputs player match performance stats (e.g. 84 runs off 42 balls, 2 wickets in 4 overs).",
                    logs: [
                        "INFO - Match entry form submitted",
                        "DEBUG - Inputs: batsman_runs=84, balls_faced=42, wickets=2, overs=4",
                        "INFO - Forwarding metrics to Calculation Engine..."
                    ]
                },
                {
                    nodeName: "ES6 Calc Engine",
                    desc: "Pure ES6 engine computes analytics metrics: strike rate (200.00), economy rate (6.00), and player averages.",
                    logs: [
                        "DEBUG - Calculating strike rate: (84 / 42) * 100 = 200.00",
                        "DEBUG - Calculating economy: (24 runs / 4 overs) = 6.00 RPO",
                        "INFO - Computations completed successfully."
                    ]
                },
                {
                    nodeName: "LocalStorage",
                    desc: "Serializes the performance record into JSON and saves it in LocalStorage for persistent offline access.",
                    logs: [
                        "INFO - Serializing scorecard record to JSON string...",
                        "SUCCESS - LocalStorage update: saved key 'cricket_match_104'",
                        "DEBUG - Storage size: 1.2KB / 5.0MB"
                    ]
                },
                {
                    nodeName: "Chart.js compiler",
                    desc: "Chart.js maps player trends across historic scorecards, rendering batting and bowling curves.",
                    logs: [
                        "INFO - Loading past matches records from cache...",
                        "DEBUG - Computing trend curve points (Last 5 matches: 45, 12, 84, 56, 30)",
                        "SUCCESS - Chart.js redrew performance trendline canvas."
                    ]
                },
                {
                    nodeName: "Query Input UI",
                    desc: "User enters natural query: 'Find matches where strike rate was above 180' in the query input.",
                    logs: [
                        "INFO - Query input intercepted: 'Find matches where strike rate was above 180'",
                        "INFO - Initiating semantic parser analysis..."
                    ]
                },
                {
                    nodeName: "Query Parser",
                    desc: "Local NLP-style keyword engine parses terms to identify filters ('strike rate', 'above', '180').",
                    logs: [
                        "DEBUG - Matching tokens: metric='strike_rate', operation='>', value=180",
                        "INFO - Executing filter on LocalStorage data pool",
                        "SUCCESS - 3 matches found matching filters."
                    ]
                },
                {
                    nodeName: "Stats Dashboard",
                    desc: "UI updates with filtered match cards, highlighting achievements and averages for the parsed query.",
                    logs: [
                        "INFO - Rendered 3 scorecards matching criteria",
                        "SYSTEM - Flow completed. Query processed in 12ms."
                    ]
                }
            ]
        },
        orion: {
            nodes: [
                { icon: "🎙️", title: "Voice Input", sub: "Web Speech Capture" },
                { icon: "🧠", title: "Speech Recognizer", sub: "Audio-to-Text Parser" },
                { icon: "📂", title: "Flask Route", sub: "POST Route Handler" },
                { icon: "⚙️", title: "Command Parser", sub: "Intent Classifier" },
                { icon: "⚡", title: "Task Dispatcher", sub: "Automation Hook Engine" },
                { icon: "🗣️", title: "Google TTS", sub: "Voice Synthesis API" },
                { icon: "🔊", title: "Audio Playback", sub: "Speech Response Stream" }
            ],
            steps: [
                {
                    nodeName: "Voice Input",
                    desc: "User clicks the microphone button and says, 'Orion, play music and search for .NET tutorials.'",
                    logs: [
                        "INFO - Voice capturing active. Capturing microphone input stream...",
                        "DEBUG - Sample rate: 44100Hz, status: Capturing audio buffer",
                        "INFO - Input captured. Streaming audio bytes to parser..."
                    ]
                },
                {
                    nodeName: "Speech Recognizer",
                    desc: "The Web Speech Recognition API processes the audio input, converting speech-to-text with 94% confidence.",
                    logs: [
                        "INFO - Processing speech buffer bytes...",
                        "DEBUG - Match detected: 'orion play music and search for dot net tutorials'",
                        "SUCCESS - Speech-to-Text translation confidence: 94.2%"
                    ]
                },
                {
                    nodeName: "Flask Route",
                    desc: "Sends the parsed text payload via a secure HTTP POST request to the Flask backend assistant route.",
                    logs: [
                        "INFO - HTTP POST /api/assistant/query - Request sent",
                        "DEBUG - Payload: { query: 'play music and search for dot net tutorials' }",
                        "INFO - Flask controller received request scope"
                    ]
                },
                {
                    nodeName: "Command Parser",
                    desc: "Regex and keyword parser classifies the user intent and extracts parameters (Intent: 'Play Music', Intent: 'Search').",
                    logs: [
                        "INFO - Tokenizing command query text",
                        "DEBUG - Pattern matches: Intent='music_playback', Action='search', Term='dot net tutorials'",
                        "SUCCESS - Intent classification completed successfully."
                    ]
                },
                {
                    nodeName: "Task Dispatcher",
                    desc: "Executes automation hooks: triggers a browser search query and schedules background music playback.",
                    logs: [
                        "INFO - Triggering Web Search Automation: Term='dot net tutorials'",
                        "INFO - Executing Music Player Service: play_stream=active",
                        "SUCCESS - Automated background browser tabs launched successfully."
                    ]
                },
                {
                    nodeName: "Google TTS",
                    desc: "Google TTS engine synthesizes the response ('Searching for .NET tutorials and opening music player') into an MP3 stream.",
                    logs: [
                        "INFO - Synthesizing speech text response via Google TTS API...",
                        "DEBUG - Request payload: 'Searching for .NET tutorials and opening music player'",
                        "SUCCESS - Google Speech API response: 200 OK. Audio stream ready."
                    ]
                },
                {
                    nodeName: "Audio Playback",
                    desc: "Browser receives the synthesized voice response stream and plays back the confirmation speech to the user.",
                    logs: [
                        "INFO - Playing back synthesized MP3 response stream...",
                        "SUCCESS - Audio voice playback finished.",
                        "SYSTEM - Flow completed. Speech action resolved in 410ms."
                    ]
                }
            ]
        },
        duezy: {
            nodes: [
                { icon: "📱", title: "Flutter App UI", sub: "Dashboard & Alerts" },
                { icon: "🔐", title: "Firebase Auth", sub: "Anonymous Login" },
                { icon: "☁️", title: "Firestore Service", sub: "Real-time Queries" },
                { icon: "📂", title: "Local Cache", sub: "SharedPreferences" },
                { icon: "🔔", title: "Notification Service", sub: "Local Push Scheduler" },
                { icon: "🔄", title: "Status Sync", sub: "Real-time DB Rollover" }
            ],
            steps: [
                {
                    nodeName: "Flutter App UI",
                    desc: "User launches DueZy. The app queries the local state and checks outstanding EMI payments on the glassmorphic dashboard.",
                    logs: [
                        "INFO - Launching DueZy App...",
                        "DEBUG - Loading user profile context from SharedPreferences",
                        "INFO - Building glassmorphic dashboard widgets..."
                    ]
                },
                {
                    nodeName: "Firebase Auth",
                    desc: "Authenticates the user silently using Firebase Anonymous Authentication for secure, scoped database queries.",
                    logs: [
                        "INFO - Firebase Auth check initiated",
                        "DEBUG - Checking cached credentials...",
                        "SUCCESS - Logged in anonymously. User UID: uid_4091a92e"
                    ]
                },
                {
                    nodeName: "Firestore Service",
                    desc: "Connects to Firestore via real-time streams to fetch updated bills and education loan EMI schedules.",
                    logs: [
                        "INFO - Subscribing to Firestore stream: /users/uid_4091a92e/reminders",
                        "DEBUG - Database query: where('dayStart', '<=', now.day)",
                        "SUCCESS - Fetched 3 reminders: Education Loan EMI (Due Day 15), Rent, Broadband."
                    ]
                },
                {
                    nodeName: "Local Cache",
                    desc: "Caches reminders locally using SharedPreferences to support offline reading and instant app startups.",
                    logs: [
                        "INFO - Syncing Firestore results to local SharedPreferences cache",
                        "DEBUG - Writing 3 records to local repository...",
                        "SUCCESS - Offline cache synchronized successfully."
                    ]
                },
                {
                    nodeName: "Notification Service",
                    desc: "Schedules localized reminders on the device using local notifications to alert user before the billing cycle ends.",
                    logs: [
                        "INFO - Evaluating notification queue",
                        "DEBUG - Scheduling alarm for Education Loan EMI (ID: 1) on Day 14 at 09:00 AM",
                        "SUCCESS - Local push notification registered with system alarm manager."
                    ]
                },
                {
                    nodeName: "Status Sync",
                    desc: "Triggers dynamic rollover. Once user marks EMI as paid, the app updates Firestore and resets status for the next billing cycle.",
                    logs: [
                        "INFO - User clicked 'Mark Paid' on Education Loan EMI",
                        "SQL - Firestore update: users/uid_4091a92e/reminders/edu_loan { isPaidThisCycle: true, updatedAt: Timestamp.now() }",
                        "SUCCESS - Firestore sync complete. UI updated to show updated billing status."
                    ]
                }
            ]
        },
        advportfolio: {
            nodes: [
                { icon: "🎨", title: "Next.js UI Node", sub: "React 3D Render" },
                { icon: "🧊", title: "Three.js Engine", sub: "R3F / GSAP Scroll" },
                { icon: "⚙️", title: "Stats Service", sub: "WakaTime & Git API" },
                { icon: "💬", title: "GROQ Gateway", sub: "Primary AI Prompt" },
                { icon: "🤖", title: "Gemini Sync", sub: "Fallback AI model" },
                { icon: "📡", title: "Vercel Analytics", sub: "Telemetry Tracker" }
            ],
            steps: [
                {
                    nodeName: "Next.js UI Node",
                    desc: "User requests page. Next.js App Router hydrates the responsive layout with TypeScript components.",
                    logs: [
                        "INFO - Client connection established",
                        "DEBUG - Initializing Next.js 16 context in React 19...",
                        "SUCCESS - UI elements rendered, initiating 3D viewport canvas."
                    ]
                },
                {
                    nodeName: "Three.js Engine",
                    desc: "React Three Fiber loads WebGL meshes, lights, and binds scroll events via GSAP and Framer Motion.",
                    logs: [
                        "INFO - Creating WebGLRenderer context...",
                        "DEBUG - Compiling Three.js shader pipelines",
                        "SUCCESS - 3D scene loaded. Target FPS: 60 (Low Power check: Normal)"
                    ]
                },
                {
                    nodeName: "Stats Service",
                    desc: "Queries the GitHub API and WakaTime endpoint to retrieve real-time coding hours and repository metrics.",
                    logs: [
                        "INFO - Querying api.wakatime.com/v1/users/current/stats",
                        "DEBUG - Querying api.github.com/users/charan-kumar99",
                        "SUCCESS - Coding activity retrieved: 1400+ total hours mapped."
                    ]
                },
                {
                    nodeName: "GROQ Gateway",
                    desc: "User asks chatbot a question. GROQ gateway forwards query to the primary LLaMA model.",
                    logs: [
                        "INFO - Chat request received: 'tell me about Charan's .NET experience'",
                        "DEBUG - Forwarding prompt to GROQ endpoint...",
                        "SUCCESS - Response received in 180ms."
                    ]
                },
                {
                    nodeName: "Gemini Sync",
                    desc: "If GROQ reaches quota limits, the backend triggers fallback to Google Gemini model for uninterrupted service.",
                    logs: [
                        "WARNING - GROQ primary client rate limited, switching to fallback...",
                        "DEBUG - Invoking Gemini fallback model...",
                        "SUCCESS - Gemini response completed successfully."
                    ]
                },
                {
                    nodeName: "Vercel Analytics",
                    desc: "Pipes layout vitals and interaction clicks to Vercel telemetry backend for performance scoring.",
                    logs: [
                        "INFO - Dispatching performance metrics...",
                        "DEBUG - FCP: 0.8s, LCP: 1.2s, CLS: 0.01",
                        "SYSTEM - Flow completed. Session telemetry fully synced."
                    ]
                }
            ]
        },
        migrationmaster: {
            nodes: [
                { icon: "💻", title: "Interactive CLI", sub: "Spectre.Console Engine" },
                { icon: "🔌", title: "Conn Validator", sub: "Source & Dest Handshake" },
                { icon: "🔎", title: "Schema Reader", sub: "Catalog & Constraint Inspection" },
                { icon: "🔄", title: "Kahn's Sorter", sub: "Topological Dependency Sorting" },
                { icon: "🏗️", title: "DDL Replicator", sub: "Schemas & Tables Creation" },
                { icon: "⚡", title: "Binary COPY", sub: "Npgsql Stream COPY FROM STDIN" },
                { icon: "🔒", title: "Post-Processing", sub: "PKs, FKs, Indexes & Sequence Sync" }
            ],
            steps: [
                {
                    nodeName: "Interactive CLI",
                    desc: "User launches Migration Master CLI, prompted for source and destination PostgreSQL connection strings.",
                    logs: [
                        "CLI - Initializing Spectre.Console Interactive UI...",
                        "PROMPT - Enter Source PostgreSQL Connection String",
                        "PROMPT - Enter Destination PostgreSQL Connection String"
                    ]
                },
                {
                    nodeName: "Conn Validator",
                    desc: "Migration Master tests connectivity, SSL handshake, and permissions on both source and target database instances.",
                    logs: [
                        "CONNECT - Testing connection to source database [Host: localhost, DB: source_db]",
                        "SUCCESS - Connected to source PostgreSQL instance successfully.",
                        "CONNECT - Testing connection to destination database [Host: remote, DB: target_db]",
                        "SUCCESS - Connected to destination PostgreSQL instance successfully."
                    ]
                },
                {
                    nodeName: "Schema Reader",
                    desc: "SchemaReader queries PostgreSQL system catalogs (information_schema, pg_catalog) to discover tables, columns, constraints, and sequences.",
                    logs: [
                        "QUERY - Inspecting pg_tables, pg_attribute, and pg_constraint catalog views...",
                        "DISCOVER - Found 24 database tables, 156 columns, 18 primary keys, and 32 foreign key constraints.",
                        "INFO - Calculating table row counts via pg_class tuple estimates..."
                    ]
                },
                {
                    nodeName: "Kahn's Sorter",
                    desc: "Applies Kahn's Algorithm for topological sorting to organize table copy order based on foreign key dependency trees.",
                    logs: [
                        "ALGO - Building directed acyclic graph (DAG) of table dependencies...",
                        "SORT - Applying Kahn's Algorithm for topological sorting...",
                        "SUCCESS - Table dependency tree resolved: [users -> categories -> products -> orders -> order_items]"
                    ]
                },
                {
                    nodeName: "DDL Replicator",
                    desc: "Creates required PostgreSQL schemas and base tables on target database without constraints to prepare for fast data loading.",
                    logs: [
                        "DDL - CREATE SCHEMA IF NOT EXISTS public;",
                        "DDL - Creating 24 base target tables with matching data types...",
                        "SUCCESS - Base target table structure established."
                    ]
                },
                {
                    nodeName: "Binary COPY",
                    desc: "Executes Npgsql binary copy protocol (COPY FROM STDIN) streaming raw binary tuples directly from source to destination staging tables.",
                    logs: [
                        "COPY - Setting session_replication_role = 'replica' to bypass triggers & constraints...",
                        "STREAM - Executing NpgsqlBinaryExporter -> NpgsqlBinaryImporter streaming COPY...",
                        "SUCCESS - Transferred 2,450,000 rows across 24 tables in 4.12 seconds (594,660 rows/sec)."
                    ]
                },
                {
                    nodeName: "Post-Processing",
                    desc: "Re-enables constraints, builds primary keys, foreign keys, unique indexes, and synchronizes identity sequences with max(id).",
                    logs: [
                        "DDL - Re-applying Primary Keys and Foreign Key constraints...",
                        "INDEX - Rebuilding 14 custom B-Tree & GIN indexes on target tables...",
                        "SYNC - Executing pg_get_serial_sequence & setval() to sync identity sequences...",
                        "SUMMARY - PostgreSQL Migration completed successfully! Total time: 6.84s."
                    ]
                }
            ]
        }
    };

    let activeFlow = 'devlens';
    let currentStep = -1; // -1 means initial idle state
    let isPlaying = false;
    let playInterval = null;

    const nodesContainer = document.getElementById('simulatorNodes');
    const svg = document.getElementById('simulatorSvg');
    const packet = document.getElementById('simulatorPacket');
    const activeNodeNameEl = document.getElementById('simActiveNodeName');
    const activeNodeDescEl = document.getElementById('simActiveNodeDesc');
    const terminalEl = document.getElementById('simTerminal');

    const playBtn = document.getElementById('simPlayBtn');
    const stepBtn = document.getElementById('simStepBtn');
    const resetBtn = document.getElementById('simResetBtn');

    if (!nodesContainer || !svg || !packet) return;

    // Helper to log in terminal
    function addTerminalLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logLine = document.createElement('div');
        logLine.className = `log-line ${type}`;
        logLine.textContent = `[${timestamp} ${type.toUpperCase()}] ${message}`;
        terminalEl.appendChild(logLine);
        terminalEl.scrollTop = terminalEl.scrollHeight;
    }

    // Render nodes based on selected flow
    function renderNodes() {
        nodesContainer.innerHTML = '';
        const data = flowMetadata[activeFlow];
        data.nodes.forEach((node, idx) => {
            const nodeEl = document.createElement('div');
            nodeEl.className = `sim-node node-pos-${idx}`;
            nodeEl.setAttribute('data-index', idx);
            nodeEl.title = `Click to inspect ${node.title}`;
            
            nodeEl.innerHTML = `
                <div class="sim-node-icon-wrapper">
                    <span>${node.icon}</span>
                </div>
                <div class="sim-node-title">${node.title}</div>
                <div class="sim-node-subtitle">${node.sub}</div>
            `;
            
            nodeEl.addEventListener('click', () => {
                jumpToStep(idx);
            });

            nodesContainer.appendChild(nodeEl);
        });

        // Re-draw lines
        setTimeout(drawSimulatorLines, 60);
    }

    // Draw lines connecting nodes
    function drawSimulatorLines() {
        const container = document.getElementById('simulatorMapContainer');
        if (!container || !svg) return;

        svg.innerHTML = '';
        const nodes = nodesContainer.querySelectorAll('.sim-node');
        if (nodes.length < 2) return;

        const containerRect = container.getBoundingClientRect();
        const positions = [];

        nodes.forEach(node => {
            const rect = node.getBoundingClientRect();
            const x = rect.left - containerRect.left + rect.width / 2;
            const y = rect.top - containerRect.top + rect.height / 2;
            positions.push({ x, y });
        });

        const isMobile = window.innerWidth <= 768;

        for (let i = 0; i < positions.length - 1; i++) {
            const start = positions[i];
            const end = positions[i + 1];

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            let d = '';
            if (isMobile) {
                // Vertical straight lines
                d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
            } else {
                // Desktop snake flow curved connecting lines
                if (i === 3) {
                    // Turn downwards from node 3 to node 4
                    d = `M ${start.x} ${start.y} C ${start.x + 40} ${start.y}, ${end.x + 40} ${end.y}, ${end.x} ${end.y}`;
                } else if (i >= 4) {
                    // Leftwards lines (Row 2)
                    d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
                } else {
                    // Rightwards lines (Row 1)
                    d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
                }
            }

            path.setAttribute('d', d);
            const isActiveSegment = currentStep > i;
            path.setAttribute('id', `sim-path-${activeFlow}-${i}`);
            path.setAttribute('class', `sim-svg-path path-seg-${i} ${isActiveSegment ? 'active' : ''}`);
            svg.appendChild(path);
        }
    }

    // Position packet glow
    function positionPacket(nodeIdx, animate = true) {
        const nodes = nodesContainer.querySelectorAll('.sim-node');
        const container = document.getElementById('simulatorMapContainer');
        if (!nodes[nodeIdx] || !container) return;

        const containerRect = container.getBoundingClientRect();
        const rect = nodes[nodeIdx].getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;

        if (!animate) {
            packet.style.transition = 'none';
        } else {
            packet.style.transition = 'left 0.75s cubic-bezier(0.25, 1, 0.5, 1), top 0.75s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease';
        }
        
        packet.classList.add('active');
        packet.style.left = `${x}px`;
        packet.style.top = `${y}px`;
    }

    // Shoot animated glowing particle along a curved SVG path
    function shootPathParticle(fromIdx) {
        const path = svg.querySelector(`.path-seg-${fromIdx}`);
        if (!path) return;

        const pathId = path.getAttribute('id');
        if (!pathId) return;

        // Create particle element (SVG circle)
        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        particle.setAttribute('r', '6');
        particle.setAttribute('fill', 'var(--accent)');
        particle.setAttribute('style', 'filter: drop-shadow(0 0 6px var(--accent)); pointer-events: none;');

        // Create animateMotion
        const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        anim.setAttribute('dur', '0.75s');
        anim.setAttribute('repeatCount', '1');
        anim.setAttribute('fill', 'freeze');

        // Create mpath child targeting the path ID
        const mpath = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
        mpath.setAttribute('href', `#${pathId}`);
        mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${pathId}`);

        anim.appendChild(mpath);
        particle.appendChild(anim);
        svg.appendChild(particle);

        // Auto-remove particle after animation ends
        setTimeout(() => {
            particle.remove();
        }, 800);
    }

    // Execute step
    function runStep() {
        const data = flowMetadata[activeFlow];
        const totalSteps = data.steps.length;

        if (currentStep >= totalSteps - 1) {
            // End reached, reset
            resetSimulation();
            return;
        }

        const prevStep = currentStep;
        currentStep++;

        const stepData = data.steps[currentStep];
        const nodes = nodesContainer.querySelectorAll('.sim-node');

        // Update active class on nodes
        nodes.forEach((node, idx) => {
            node.classList.remove('active');
            if (idx === currentStep) {
                node.classList.add('active');
            }
            if (idx < currentStep) {
                node.classList.add('processed');
            } else {
                node.classList.remove('processed');
            }
        });

        // Update active segment classes in SVG
        const paths = svg.querySelectorAll('.sim-svg-path');
        paths.forEach((path, idx) => {
            path.classList.toggle('active', idx < currentStep);
        });

        // Position & Animate packet
        if (prevStep === -1) {
            positionPacket(0, false);
        } else {
            positionPacket(currentStep, true);
            shootPathParticle(prevStep);
        }

        // Update Panel details
        if (activeNodeNameEl) activeNodeNameEl.textContent = `${currentStep + 1}. ${stepData.nodeName}`;
        if (activeNodeDescEl) activeNodeDescEl.textContent = stepData.desc;

        // Print Logs with tiny stagger
        stepData.logs.forEach((log, idx) => {
            setTimeout(() => {
                let logType = 'info';
                if (log.startsWith('SEC')) logType = 'system';
                else if (log.startsWith('SQL')) logType = 'db';
                else if (log.startsWith('SUCCESS') || log.startsWith('SYSTEM')) logType = 'success';
                else if (log.startsWith('ERROR')) logType = 'error';

                addTerminalLog(log, logType);
            }, idx * 180);
        });

        // Stop auto play if we reached the final step
        if (currentStep === totalSteps - 1) {
            if (isPlaying) {
                setTimeout(pauseSimulation, 1500);
            }
        }
    }

    function jumpToStep(idx) {
        pauseSimulation();
        resetSimulation(false); // reset classes and packet
        
        const data = flowMetadata[activeFlow];
        const nodes = nodesContainer.querySelectorAll('.sim-node');
        
        currentStep = idx;

        nodes.forEach((node, nodeIdx) => {
            node.classList.remove('active', 'processed');
            if (nodeIdx === idx) node.classList.add('active');
            if (nodeIdx < idx) node.classList.add('processed');
        });

        const paths = svg.querySelectorAll('.sim-svg-path');
        paths.forEach((path, pathIdx) => {
            path.classList.toggle('active', pathIdx < idx);
        });

        positionPacket(idx, false);

        const stepData = data.steps[idx];
        if (activeNodeNameEl) activeNodeNameEl.textContent = `${idx + 1}. ${stepData.nodeName}`;
        if (activeNodeDescEl) activeNodeDescEl.textContent = stepData.desc;

        addTerminalLog(`[MANUAL INSPECT] Navigating directly to component: ${stepData.nodeName}`, 'system');
        stepData.logs.forEach(log => {
            let logType = 'info';
            if (log.startsWith('SEC')) logType = 'system';
            else if (log.startsWith('SQL')) logType = 'db';
            else if (log.startsWith('SUCCESS') || log.startsWith('SYSTEM')) logType = 'success';
            addTerminalLog(log, logType);
        });
    }

    function playSimulation() {
        if (isPlaying) return;
        isPlaying = true;
        
        const playBtnText = playBtn.querySelector('.sim-btn-text') || playBtn;
        const playBtnIcon = playBtn.querySelector('.sim-btn-icon');
        if (playBtnText) playBtnText.textContent = 'Pause';
        if (playBtnIcon) playBtnIcon.textContent = '⏸';

        addTerminalLog("Auto-simulation started.", "system");

        // Run first step instantly
        runStep();

        playInterval = setInterval(() => {
            const data = flowMetadata[activeFlow];
            if (currentStep >= data.steps.length - 1) {
                resetSimulation();
                runStep();
            } else {
                runStep();
            }
        }, 2200);
    }

    // Pause
    function pauseSimulation() {
        if (!isPlaying) return;
        isPlaying = false;
        clearInterval(playInterval);
        
        const playBtnText = playBtn.querySelector('.sim-btn-text') || playBtn;
        const playBtnIcon = playBtn.querySelector('.sim-btn-icon');
        if (playBtnText) playBtnText.textContent = 'Play';
        if (playBtnIcon) playBtnIcon.textContent = '▶';

        addTerminalLog("Simulation paused.", "system");
    }

    // Reset
    function resetSimulation(clearLogs = true) {
        clearInterval(playInterval);
        isPlaying = false;
        currentStep = -1;

        const playBtnText = playBtn.querySelector('.sim-btn-text') || playBtn;
        const playBtnIcon = playBtn.querySelector('.sim-btn-icon');
        if (playBtnText) playBtnText.textContent = 'Play';
        if (playBtnIcon) playBtnIcon.textContent = '▶';

        const nodes = nodesContainer.querySelectorAll('.sim-node');
        nodes.forEach(node => {
            node.classList.remove('active', 'processed');
        });

        const paths = svg.querySelectorAll('.sim-svg-path');
        paths.forEach(path => {
            path.classList.remove('active');
        });

        packet.classList.remove('active');

        if (activeNodeNameEl) activeNodeNameEl.textContent = 'Active Component';
        if (activeNodeDescEl) activeNodeDescEl.textContent = 'Click Play or Step to begin visualization.';

        if (clearLogs) {
            terminalEl.innerHTML = '';
            addTerminalLog(`Simulator reset. Ready to run flow: ${activeFlow.toUpperCase()}`, 'system');
        }
    }

    // Attach controllers listeners
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSimulation();
        } else {
            playSimulation();
        }
    });

    stepBtn.addEventListener('click', () => {
        pauseSimulation();
        runStep();
    });

    resetBtn.addEventListener('click', () => {
        resetSimulation();
    });

    // Handle Tabs
    const tabs = document.querySelectorAll('.sim-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            activeFlow = tab.getAttribute('data-flow');
            resetSimulation();
            renderNodes();
        });
    });

    // Handle Resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            drawSimulatorLines();
            if (currentStep !== -1) {
                positionPacket(currentStep, false);
            }
        }, 150);
    });

    // Initialize layout
    renderNodes();
})();


// ===================================================================
// FEATURE: DEVELOPER TERMINAL CLI DRAWER
// ===================================================================
(function initTerminalCLI() {
    const terminalDrawer = document.getElementById('terminalDrawer');
    const toggleBtn = document.getElementById('terminalToggleBtn');
    const closeBtn = document.querySelector('.terminal-drawer-close');
    const dotCloseBtn = document.getElementById('terminalCloseBtn');
    const actualInput = document.getElementById('terminalActualInput');
    const dummyInput = document.getElementById('terminalDummyInput');
    const outputLog = document.getElementById('terminalDrawerOutput');
    const drawerBody = document.getElementById('terminalDrawerBody');

    if (!terminalDrawer || !actualInput || !dummyInput || !outputLog) return;

    // Toggle drawer
    function toggleTerminalDrawer() {
        terminalDrawer.classList.toggle('open');
        if (terminalDrawer.classList.contains('open')) {
            setTimeout(() => actualInput.focus(), 100);
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTerminalDrawer);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleTerminalDrawer);
    }
    if (dotCloseBtn) {
        dotCloseBtn.addEventListener('click', toggleTerminalDrawer);
    }

    // Toggle with hotkeys
    window.addEventListener('keydown', (e) => {
        // Toggle with backtick (`) key
        if (e.key === '`') {
            e.preventDefault();
            toggleTerminalDrawer();
        }
        // Toggle with Ctrl+Shift+T
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            toggleTerminalDrawer();
        }
    });

    // Mirror input into custom styled dummy text
    actualInput.addEventListener('input', () => {
        dummyInput.textContent = actualInput.value;
    });

    // Refocus input on click inside the body
    if (drawerBody) {
        drawerBody.addEventListener('click', () => {
            actualInput.focus();
        });
    }

    // Command responses
    const commandResponses = {
        help: `Available commands:
  help         - Show this list of available commands
  skills       - Print my current developer skill stack
  experience   - Show professional history overview
  projects     - Show key featured projects
  contact      - Display contact options
  theme [name] - Change color theme (dark, cyberpunk, emerald, light)
  neofetch     - Show system specs & profile overview
  clear        - Clear terminal lines`,

        skills: `Charan Kumar's Developer Skill Stack:
  Backend:      C#, ASP.NET Core, EF Core, Microservices Architecture, Clean Architecture, REST APIs
  Databases:    SQL Server, PostgreSQL, MySQL, Oracle Database, Redis
  DevOps/Tools: Docker, Azure DevOps, CI/CD Pipelines, Git, Postman, Swagger, Firebase, Razorpay, Vercel Serverless, localStorage, Web Speech API, HTML5 Canvas
  Frontend:     HTML5, CSS3, JavaScript (ES6+), React, Flutter, Chart.js`,

        experience: `Professional History:
  - Software Developer (Hybrid) @ AGREMATE Private Limited (Jun 2026 - Present)
    Building scalable backend REST APIs and automated property management workflows.
  - Backend Intern (Onsite) @ NTSIPL (Dec 2025 - May 2026)
    Contributed to enterprise RTGS/NEFT Microservices payment processing networks.`,

        projects: `Featured Projects:
  1. DevLens - AI GitHub Repo Analyzer (ASP.NET Core, React, Google Gemini API)
  2. Money Mate - Personal Finance Manager (Python, Flask, SQLAlchemy, Chart.js)
  3. Cricket Performance Analyzer - Sports Metrics Web App (ES6 JS, Chart.js)
  4. Orion Assistant - Speech Recognition & Google TTS Automation (Flask, JS Speech API)
  5. DueZy - Premium Flutter/Firebase Bill & EMI Reminder Mobile App
  6. Advanced Developer Portfolio - Immersive Next.js/React portfolio with 3D elements
  7. Migration Master - PostgreSQL Binary COPY Migration Tool (C#, .NET 8, Spectre.Console)
  8. Proprietary Enterprise Projects (Agremate platform, RTGS/NEFT Payment Routing)`,

        contact: `Contact Details:
  - Email:      charansuvarna99@gmail.com
  - Phone:      +91 9380455922
  - Location:   Udupi, Karnataka, India
  - GitHub:     https://github.com/charan-kumar99
  - LinkedIn:   https://www.linkedin.com/in/charan-kumar-9b20a8378
  - Advanced Portfolio: https://advanced-portfolio-sandy.vercel.app/`
    };

    // Print helper
    function appendTerminalLine(text, type = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        outputLog.appendChild(line);
        // Scroll to bottom
        if (drawerBody) {
            drawerBody.scrollTop = drawerBody.scrollHeight;
        }
    }

    // CLI History, Tab Autocomplete and Custom Command Handler
    const commandHistory = [];
    let historyIndex = -1;
    const availableCommands = ['help', 'skills', 'experience', 'projects', 'contact', 'clear', 'theme', 'neofetch'];

    actualInput.addEventListener('keydown', (e) => {
        // Tab Auto-completion
        if (e.key === 'Tab') {
            e.preventDefault();
            const inputVal = actualInput.value.trim().toLowerCase();
            if (!inputVal) return;
            const matches = availableCommands.filter(cmd => cmd.startsWith(inputVal));
            if (matches.length > 0) {
                actualInput.value = matches[0];
                dummyInput.textContent = matches[0];
            }
        }
        
        // Command History: Up Arrow
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex > 0) {
                historyIndex--;
                actualInput.value = commandHistory[historyIndex];
                dummyInput.textContent = commandHistory[historyIndex];
            }
        }
        
        // Command History: Down Arrow
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                actualInput.value = commandHistory[historyIndex];
                dummyInput.textContent = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                actualInput.value = '';
                dummyInput.textContent = '';
            }
        }
        
        // Command Execution
        else if (e.key === 'Enter') {
            const rawVal = actualInput.value;
            const command = rawVal.trim();
            const lowerCommand = command.toLowerCase();
            actualInput.value = '';
            dummyInput.textContent = '';

            // Echo input in terminal
            appendTerminalLine(`guest@charankumar:~$ ${rawVal}`, 'input-echo');

            if (command === '') {
                return;
            }

            // Save to history
            commandHistory.push(rawVal);
            historyIndex = commandHistory.length;

            if (lowerCommand === 'clear') {
                outputLog.innerHTML = '';
                appendTerminalLine("Welcome to Charan's Interactive CLI! [v1.0.0]", "system");
                appendTerminalLine("Type 'help' to see all available commands. Press ` (backtick) or click the nav button to toggle.", "system");
                const spacer = document.createElement('div');
                spacer.className = 'terminal-line spacer';
                outputLog.appendChild(spacer);
                return;
            }

            // Theme custom command handler
            if (lowerCommand.startsWith('theme')) {
                const parts = command.split(/\s+/);
                if (parts.length < 2) {
                    appendTerminalLine("Usage: theme [name]");
                    appendTerminalLine("Available themes: dark (Neo-Cyan), cyberpunk, emerald, light (Light Pro)");
                } else {
                    const themeName = parts[1].toLowerCase();
                    if (['dark', 'cyberpunk', 'emerald', 'light'].includes(themeName)) {
                        if (typeof applyPalette === 'function') {
                            applyPalette(themeName);
                            appendTerminalLine(`Successfully switched theme to '${themeName}'!`, 'success');
                        } else {
                            appendTerminalLine("Error: Theme changer not available.", 'error');
                        }
                    } else {
                        appendTerminalLine(`Unknown theme: '${themeName}'. Available: dark, cyberpunk, emerald, light`, 'error');
                    }
                }
                appendTerminalLine('', 'spacer');
                return;
            }

            // Neofetch custom command handler
            if (lowerCommand === 'neofetch') {
                const uptimeSeconds = Math.floor(performance.now() / 1000);
                const mins = Math.floor(uptimeSeconds / 60);
                const secs = uptimeSeconds % 60;
                const uptimeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

                const neofetchText = `         .----.         charan@portfolio
       .'      '.       ----------------
      /          \\      OS: Portfolio Web CLI v1.0.0
     |   .----.   |     Host: charan-kumar99.github.io
    |   /      \\   |    Kernel: Vanilla JS / HTML5 / CSS3
    |  |   .NET |  |    Uptime: ${uptimeStr}
    |   \\      /   |    Shell: Charan's Custom JS CLI
     |   '----'   |     Education: MCA Student @ MIT Jaipur
      \\          /      Role: .NET & Full-Stack Developer
       '.      .'       Backend: C# / ASP.NET Core / EF Core
         '----'         Databases: SQL Server / PostgreSQL
                        DevOps: Azure DevOps / Docker / CI-CD`;
                
                appendTerminalLine(neofetchText);
                appendTerminalLine('', 'spacer');
                return;
            }

            const response = commandResponses[lowerCommand];
            if (response) {
                appendTerminalLine(response);
            } else {
                appendTerminalLine(`Command not found: '${command}'. Type 'help' for available commands.`, 'system');
            }

            // Stagger empty spacer
            appendTerminalLine('', 'spacer');
        }
    });
})();

// Initialize chat history persistence on load
(function() {
    if (typeof loadChatHistory === 'function') {
        loadChatHistory();
    }
})();

// ==========================================================================
// TAILORED RESUME GENERATOR INTEGRATION (Step 2, 3, 4, 5)
// ==========================================================================
(function() {
    // 1. Synonym Definitions
    const SYNONYMS = {
        "postgres": ["postgresql", "postgres", "pg", "postgre sql"],
        "postgresql": ["postgresql", "postgres", "pg", "postgre sql"],
        "dotnet": ["dotnet", ".net", "asp.net", "c#", "csharp"],
        "c#": ["c#", "csharp", "dotnet", ".net"],
        "csharp": ["c#", "csharp", "dotnet", ".net"],
        "asp.net": ["asp.net", "dotnet", ".net", "c#", "csharp", "blazor", "razor pages"],
        "sql server": ["sql server", "mssql", "microsoft sql server", "sqlserver"],
        "mssql": ["sql server", "mssql", "microsoft sql server", "sqlserver"],
        "react": ["react", "react.js", "reactjs"],
        "reactjs": ["react", "react.js", "reactjs"],
        "react.js": ["react", "react.js", "reactjs"],
        "next.js": ["next.js", "nextjs", "next"],
        "nextjs": ["next.js", "nextjs", "next"],
        "three.js": ["three.js", "threejs", "r3f", "react three fiber", "webgl"],
        "threejs": ["three.js", "threejs", "r3f", "react three fiber", "webgl"],
        "javascript": ["javascript", "js", "es6", "ecmascript"],
        "js": ["javascript", "js", "es6"],
        "typescript": ["typescript", "ts"],
        "ts": ["typescript", "ts"],
        "azure devops": ["azure devops", "azure", "devops", "ci/cd", "ci-cd"],
        "ci/cd": ["ci/cd", "ci-cd", "pipelines", "pipeline", "github actions", "devops"],
        "pipelines": ["ci/cd", "ci-cd", "pipelines", "pipeline", "github actions", "devops"],
        "docker": ["docker", "containerization", "containers", "containerized"],
        "containers": ["docker", "containerization", "containers", "containerized"],
        "rest api": ["rest api", "restful", "apis", "api", "web api", "webapis", "endpoints"],
        "apis": ["rest api", "restful", "apis", "api", "web api", "webapis"],
        "api": ["rest api", "restful", "apis", "api", "web api", "webapis"],
        "microservices": ["microservices", "microservice", "distributed systems"],
        "clean architecture": ["clean architecture", "onion architecture", "hexagonal architecture", "ddd"],
        "ef core": ["ef core", "entity framework", "entity framework core", "orm"],
        "entity framework": ["ef core", "entity framework", "entity framework core", "orm"]
    };

    // 2. Load resume-data.json
    let resumeData = null;
    async function loadResumeData() {
        if (resumeData) return resumeData;
        try {
            const response = await fetch('./resume-data.json');
            if (!response.ok) throw new Error('Failed to load resume data.');
            resumeData = await response.json();
            return resumeData;
        } catch (error) {
            console.error('Error loading resume data:', error);
            alert('Could not load resume data. Please try again.');
            return null;
        }
    }

    // Helper: Match a tag within the JD text
    function matchTag(text, tag) {
        const term = tag.toLowerCase();
        
        if (term === "c#" || term === "csharp") {
            return text.includes("c#") || text.includes("csharp");
        }
        if (term === ".net" || term === "dotnet") {
            return text.includes(".net") || text.includes("dotnet");
        }
        
        // Escape characters except spaces
        const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Word boundaries check matching characters
        const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#\\.\\-+])` + escaped + `(?:$|[^a-zA-Z0-9_#\\.\\-+])`, 'i');
        return regex.test(text);
    }

    // 3. Extract keywords based on tags & synonyms
    function extractKeywords(jdText) {
        const jdLower = jdText.toLowerCase();
        const foundKeywords = new Set();
        
        // All known tags in resume
        const allTags = [
            "asp.net core", ".net", "backend", "api", "property management", "automation", "workflow", "c#", 
            "clean architecture", "design patterns", "docker", "containerization", "deployment", "devops", 
            "swagger", "openapi", "api documentation", "testing", "sql server", "ef core", "redis", "caching", 
            "azure", "multi-tenant", "database", "banking", "rtgs", "neft", "microservices", "payment processing", 
            "service-to-service", "api gateway", "scalability", "cts", "aml", "user management", "blazor", 
            "razor pages", "fullstack", "web applications", "postgresql", "mysql", "oracle database", 
            "query optimization", "rest api", "crud", "globalization", ".net migration", "api versioning", 
            "ci/cd", "azure devops", "git", "version control", "enterprise application", "financial", 
            "feature development", "bug fixing", "collaboration", "best practices", "security", "react", 
            "sqlite", "metrics", "gemini api", "ai", "google gemini", "d3.js", "recharts", "visualization", 
            "performance", "python", "flask", "chart.js", "finance", "sqlalchemy", "csv", "sql injection", 
            "javascript", "cricket", "analytics", "localstorage", "natural language", "academic", "final project", 
            "speech recognition", "voice assistant", "tts", "web interface", "flutter", "dart", "mobile app", 
            "dashboard", "glassmorphism", "firebase", "firestore", "sharedpreferences", "local notifications", 
            "push alerts", "scheduling", "next.js", "three.js", "ai assistant", "framer motion", "tailwind css", 
            "gsap", "webgl", "react three fiber", "groq api", "ai chat", "wakatime api", "sftp", "ftp", "iis", 
            "razorpay", "payment gateway", "integration", "c", "java", "html5", "css3", "bootstrap 5"
        ];
        
        for (const tag of allTags) {
            if (matchTag(jdLower, tag)) {
                foundKeywords.add(tag);
                const syns = SYNONYMS[tag];
                if (syns) syns.forEach(s => foundKeywords.add(s));
            }
        }
        
        // Scan other synonym keys
        for (const key in SYNONYMS) {
            if (matchTag(jdLower, key)) {
                SYNONYMS[key].forEach(s => foundKeywords.add(s));
            }
        }
        
        return foundKeywords;
    }

    // 4. Role Title Guesser
    function guessRoleTitle(jdText) {
        const lines = jdText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const patterns = [
            /\b(\.?net\s+(?:core\s+)?developer)\b/i,
            /\b(full\s*stack\s+developer)\b/i,
            /\b(backend\s+developer)\b/i,
            /\b(frontend\s+developer)\b/i,
            /\b(software\s+engineer)\b/i,
            /\b(software\s+developer)\b/i,
            /\b(web\s+developer)\b/i,
            /\b(\.?net\s+engineer)\b/i,
            /\b(c#\s+developer)\b/i
        ];
        
        for (const line of lines) {
            if (/^(?:job\s+)?(?:title|role|position|job)\s*:\s*(.+)$/i.test(line)) {
                const match = line.match(/^(?:job\s+)?(?:title|role|position|job)\s*:\s*(.+)$/i);
                if (match && match[1].trim().length > 3) {
                    return cleanTitle(match[1].trim());
                }
            }
        }
        
        for (let i = 0; i < Math.min(3, lines.length); i++) {
            for (const pattern of patterns) {
                const match = lines[i].match(pattern);
                if (match) return cleanTitle(match[1]);
            }
        }
        
        for (const pattern of patterns) {
            const match = jdText.match(pattern);
            if (match) return cleanTitle(match[1]);
        }
        
        return ".NET Developer";
    }

    function cleanTitle(title) {
        return title
            .split(/[-|–(]/)[0]
            .trim()
            .replace(/\b(hiring|immediate|vacancy|opening)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Helper to check skill overlap
    function isSkillMatched(skill, foundKeywords) {
        const lower = skill.toLowerCase();
        if (foundKeywords.has(lower)) return true;
        const syns = SYNONYMS[lower];
        if (syns && syns.some(s => foundKeywords.has(s))) return true;
        return false;
    }

    // 5. Skills Reordering
    function reorderSkills(skillsList, foundKeywords) {
        return [...skillsList].sort((a, b) => {
            const aMatch = isSkillMatched(a, foundKeywords);
            const bMatch = isSkillMatched(b, foundKeywords);
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
    }

    // 6. Match JD against Resume Data
    function matchResumeData(data, foundKeywords) {
        const result = JSON.parse(JSON.stringify(data)); // Deep clone

        // Reorder skills lists
        for (const category in result.skills) {
            result.skills[category] = reorderSkills(result.skills[category], foundKeywords);
        }

        // Score and filter work experience bullets
        result.experience = result.experience.map(job => {
            // Score each bullet
            const scoredBullets = job.bullets.map((b, index) => {
                let score = 0;
                b.tags.forEach(t => {
                    if (foundKeywords.has(t.toLowerCase())) {
                        score += 2;
                    }
                });
                return { bullet: b, score, originalIndex: index };
            });

            // Sort by score desc, keeping high match at top, but if scores are equal keep chronological order
            scoredBullets.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.originalIndex - b.originalIndex;
            });

            // Select top 3-4 bullets
            const limit = job.company.includes("AGREMATE") ? 4 : 4;
            const selectedScored = scoredBullets.slice(0, limit);

            // Re-sort selected back to their original index order (preserve sequence)
            selectedScored.sort((a, b) => a.originalIndex - b.originalIndex);

            return {
                ...job,
                bullets: selectedScored.map(sb => sb.bullet)
            };
        });

        // Score and filter projects (select top 2-3)
        const scoredProjects = result.projects.map((proj, index) => {
            let score = 0;
            proj.techStack.forEach(t => {
                if (isSkillMatched(t, foundKeywords)) score += 3;
            });
            proj.bullets.forEach(b => {
                b.tags.forEach(t => {
                    if (foundKeywords.has(t.toLowerCase())) score += 1;
                });
            });
            return { project: proj, score, originalIndex: index };
        });
        scoredProjects.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.originalIndex - b.originalIndex;
        });

        // Take top 3 projects, fallback to default order (first 3) if no matches
        const selectedScoredProjects = scoredProjects.slice(0, 3);
        // Sort back to keep portfolio relative order
        selectedScoredProjects.sort((a, b) => a.originalIndex - b.originalIndex);
        result.projects = selectedScoredProjects.map(sp => sp.project);

        return result;
    }

    // 7. Client-Side jsPDF Generator (Matches User's Exact Serif Template with Clickable Links)
    function generatePdfResume(data, filenameRole) {
        // Create document: portrait, points, letter (612pt x 792pt)
        const doc = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
        
        let currentY = 36;
        const marginX = 36;
        const pageWidth = 612;
        const pageHeight = 792;
        const printableWidth = 540;

        function checkPageSpace(heightNeeded) {
            if (currentY + heightNeeded > pageHeight - 36) {
                doc.addPage();
                currentY = 36;
            }
        }

        function drawClickableLink(text, url, x, y, options = {}) {
            doc.text(text, x, y, options);
            const textWidth = doc.getTextWidth(text);
            let startX = x;
            if (options.align === 'center') {
                startX = x - textWidth / 2;
            } else if (options.align === 'right') {
                startX = x - textWidth;
            }
            const fontSize = doc.getFontSize();
            doc.link(startX, y - fontSize + 2, textWidth, fontSize + 2, { url: url });
            return textWidth;
        }

        // --- TITLE / HEADER BLOCK ---
        doc.setFont('times', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text("CHARAN KUMAR", pageWidth / 2, currentY, { align: 'center' });
        currentY += 16;

        doc.setFont('times', 'italic');
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        doc.text("Developer", pageWidth / 2, currentY, { align: 'center' });
        currentY += 16;

        // Vector Icon Drawing Helpers (100% Crisp Vector Graphics - No Garbled Emoji Text)
        function drawEnvelope(x, y) {
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.6);
            doc.rect(x, y - 6.5, 9, 6.5);
            doc.line(x, y - 6.5, x + 4.5, y - 3);
            doc.line(x + 4.5, y - 3, x + 9, y - 6.5);
        }

        function drawPhone(x, y) {
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.75);
            doc.line(x + 1, y - 7, x + 3.5, y - 7);
            doc.line(x + 3.5, y - 7, x + 3.5, y - 4.5);
            doc.line(x + 3.5, y - 4.5, x + 5.5, y - 2.5);
            doc.line(x + 5.5, y - 2.5, x + 7.5, y - 2.5);
            doc.line(x + 7.5, y - 2.5, x + 7.5, y);
        }

        function drawPin(x, y) {
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.6);
            doc.circle(x + 3.5, y - 4.5, 2.5);
            doc.line(x + 3.5, y - 2, x + 3.5, y);
        }

        function drawLinkedInBox(x, y) {
            doc.setFillColor(0, 0, 0);
            doc.rect(x, y - 7, 7.5, 7.5, 'F');
            doc.setFont('times', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(255, 255, 255);
            doc.text("in", x + 1.2, y - 1.2);
            doc.setTextColor(0, 0, 0);
            doc.setFont('times', 'normal');
            doc.setFontSize(9);
        }

        function drawGitIcon(x, y) {
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.75);
            doc.circle(x + 4, y - 4, 3);
            doc.circle(x + 4, y - 4, 1);
        }

        function drawLinkChain(x, y) {
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.75);
            doc.line(x, y - 4, x + 7, y - 4);
            doc.circle(x + 2, y - 4, 1.8);
            doc.circle(x + 5, y - 4, 1.8);
        }

        // Contact info row 1: email, phone, location, LinkedIn
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);

        const emailStr = "charansuvarna99@gmail.com";
        const phoneStr = "+91 9380455922";
        const locStr = "Udupi, Karnataka, India";
        const liStr = "LinkedIn";
        const sep = "    ";
        const iconGap = 12;

        const w1 = iconGap + doc.getTextWidth(emailStr);
        const w2 = iconGap + doc.getTextWidth(phoneStr);
        const w3 = iconGap + doc.getTextWidth(locStr);
        const w4 = iconGap + doc.getTextWidth(liStr);
        const wSep = doc.getTextWidth(sep);

        const totalRow1W = w1 + wSep + w2 + wSep + w3 + wSep + w4;
        let startX1 = (pageWidth - totalRow1W) / 2;

        // Mail
        drawEnvelope(startX1, currentY);
        drawClickableLink(emailStr, "mailto:charansuvarna99@gmail.com", startX1 + iconGap, currentY);
        startX1 += w1;
        doc.text(sep, startX1, currentY);
        startX1 += wSep;

        // Phone
        drawPhone(startX1, currentY);
        drawClickableLink(phoneStr, "tel:+919380455922", startX1 + iconGap, currentY);
        startX1 += w2;
        doc.text(sep, startX1, currentY);
        startX1 += wSep;

        // Location
        drawPin(startX1, currentY);
        doc.text(locStr, startX1 + iconGap, currentY);
        startX1 += w3;
        doc.text(sep, startX1, currentY);
        startX1 += wSep;

        // LinkedIn
        drawLinkedInBox(startX1, currentY);
        drawClickableLink(liStr, "https://www.linkedin.com/in/charan-kumar-9b20a8378", startX1 + iconGap, currentY);
        currentY += 14;

        // Contact info row 2: GitHub, Portfolio
        const ghStr = "GitHub";
        const portStr = "Portfolio";
        const wGh = iconGap + doc.getTextWidth(ghStr);
        const wPort = iconGap + doc.getTextWidth(portStr);
        const totalRow2W = wGh + wSep + wPort;
        let startX2 = (pageWidth - totalRow2W) / 2;

        drawGitIcon(startX2, currentY);
        drawClickableLink(ghStr, "https://github.com/charan-kumar99", startX2 + iconGap, currentY);
        startX2 += wGh;
        doc.text(sep, startX2, currentY);
        startX2 += wSep;

        drawLinkChain(startX2, currentY);
        drawClickableLink(portStr, "https://charan-kumar99.github.io", startX2 + iconGap, currentY);
        currentY += 18;

        // --- PROFESSIONAL SUMMARY ---
        drawSectionHeader("PROFESSIONAL SUMMARY");

        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(20, 20, 20);
        
        const summaryText = ".NET Developer with hands-on experience building enterprise-grade banking applications (RTGS/NEFT, CTS, AML) using ASP.NET Core (.NET 6 & .NET 8) and Microservices Architecture. Skilled in full-stack development, REST APIs, and database management across PostgreSQL, MySQL, Oracle, and SQL Server. Proven ability to deliver scalable, secure systems while managing end-to-end development and deployments via Azure DevOps. Currently pursuing MCA while working full-time.";
        const wrappedSummary = doc.splitTextToSize(summaryText, printableWidth);
        wrappedSummary.forEach(line => {
            checkPageSpace(11.5);
            doc.text(line, marginX, currentY);
            currentY += 11.5;
        });
        currentY += 4;

        // --- KEY HIGHLIGHTS ---
        drawSectionHeader("KEY HIGHLIGHTS");
        drawBulletPoint("1+ year experience in enterprise banking systems (RTGS/NEFT, CTS, AML)");
        drawBulletPoint("Built microservices-based applications serving multiple banks");
        drawBulletPoint("Developed AI-powered GitHub analyzer (DevLens) with 40+ metrics");
        drawBulletPoint("Strong full-stack expertise in ASP.NET Core, React, and SQL");
        currentY += 4;

        // --- WORK EXPERIENCE ---
        drawSectionHeader("WORK EXPERIENCE");

        data.experience.forEach(job => {
            checkPageSpace(28);
            doc.setFont('times', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(job.role, marginX, currentY);
            
            doc.setFont('times', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            const dateStr = job.dates || "";
            const rightWidth = doc.getTextWidth(dateStr);
            doc.text(dateStr, pageWidth - marginX - rightWidth, currentY);
            currentY += 12;

            doc.setFont('times', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(0, 0, 0);
            doc.text(job.company, marginX, currentY);
            currentY += 12;

            job.bullets.forEach(bullet => {
                drawBulletPoint(bullet.text);
            });
            currentY += 5;
        });

        // --- EDUCATION ---
        drawSectionHeader("EDUCATION");

        // MCA
        checkPageSpace(24);
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Master of Computer Applications (MCA)", marginX, currentY);
        
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        const mcaDate = "Nov 2025 – Present";
        doc.text(mcaDate, pageWidth - marginX - doc.getTextWidth(mcaDate), currentY);
        currentY += 12;

        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);
        doc.text("MIT, Jaipur (Online) | Currently pursuing MCA while working full-time.", marginX, currentY);
        currentY += 15;

        // BCA
        checkPageSpace(32);
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Bachelor of Computer Applications (BCA)", marginX, currentY);
        
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        const bcaDate = "Sep 2022 – Jun 2025";
        doc.text(bcaDate, pageWidth - marginX - doc.getTextWidth(bcaDate), currentY);
        currentY += 12;

        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);
        doc.text("Udupi College of Professional Studies, Mangalore University | CGPA: 6.17 |", marginX, currentY);
        currentY += 12;

        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const labelAddon = "Add-on Courses: ";
        doc.text(labelAddon, marginX, currentY);

        doc.setFont('times', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text("Cybersecurity, Artificial Intelligence & Big Data Analytics.", marginX + doc.getTextWidth(labelAddon), currentY);
        currentY += 8;

        // --- SKILLS ---
        drawSectionHeader("SKILLS");

        const skillsFormat = [
            { label: "Languages:", list: data.skills && data.skills.languages ? data.skills.languages.join(", ") : "C#, Java, JavaScript, C, HTML5, CSS3, Dart, Python" },
            { label: "Frameworks:", list: data.skills && data.skills.frameworks ? data.skills.frameworks.join(", ") : "ASP.NET Core, Flutter, Blazor, React, Flask" },
            { label: "Databases:", list: data.skills && data.skills.databases ? data.skills.databases.join(", ") : "PostgreSQL, MySQL, Oracle, SQL Server, Firebase" },
            { label: "Tools:", list: data.skills && data.skills.tools ? data.skills.tools.slice(0, 10).join(", ") : "Azure DevOps, GitHub, Postman, DBeaver" },
            { label: "Concepts:", list: "Microservices, REST APIs, API Versioning, System Design" }
        ];

        skillsFormat.forEach(skillLine => {
            checkPageSpace(13);
            doc.setFont('times', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const labelText = skillLine.label + " ";
            doc.text(labelText, marginX, currentY);
            
            const labelW = doc.getTextWidth(labelText);
            doc.setFont('times', 'normal');
            doc.setTextColor(30, 30, 30);
            doc.text(skillLine.list, marginX + labelW, currentY);
            currentY += 12;
        });
        currentY += 4;

        // --- PROJECTS ---
        drawSectionHeader("PROJECTS");

        data.projects.slice(0, 3).forEach(project => {
            checkPageSpace(26);
            doc.setFont('times', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(project.name, marginX, currentY);
            currentY += 12;
            
            doc.setFont('times', 'bold');
            doc.setFontSize(9);
            const techLabel = "Tech: ";
            doc.text(techLabel, marginX, currentY);
            
            doc.setFont('times', 'normal');
            doc.setTextColor(40, 40, 40);
            const techText = project.techStack.join(", ");
            doc.text(techText, marginX + doc.getTextWidth(techLabel), currentY);
            currentY += 12;

            project.bullets.forEach(bullet => {
                drawBulletPoint(bullet.text);
            });

            if (project.links && project.links.github) {
                checkPageSpace(12);
                doc.setFont('times', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(0, 0, 0);
                const ghLabel = "GitHub: ";
                doc.text(ghLabel, marginX, currentY);
                
                const labelW = doc.getTextWidth(ghLabel);
                doc.setFont('times', 'normal');
                doc.setTextColor(30, 30, 30);
                drawClickableLink(project.links.github, project.links.github, marginX + labelW, currentY);
                currentY += 12;
            }
            currentY += 4;
        });

        // --- CERTIFICATIONS & TRAINING ---
        drawSectionHeader("CERTIFICATIONS & TRAINING");
        drawBulletPoint("Data Analytics & Web Dev Internship – Accolade Tech Solutions (2024)");
        drawBulletPoint("Cybersecurity & AI Training – Mangalore University (2024)");
        drawBulletPoint("NCC 'A' Certificate");
        currentY += 4;

        // --- ACHIEVEMENTS ---
        drawSectionHeader("ACHIEVEMENTS");
        drawBulletPoint("Best Cadet Award – National Cadet Corps (NCC)");
        drawBulletPoint("Served as Head Cadet leading school NCC unit");
        drawBulletPoint("District-level player in Cricket and Volleyball");
        currentY += 4;

        // --- LANGUAGES ---
        drawSectionHeader("LANGUAGES");
        checkPageSpace(13);
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(20, 20, 20);
        doc.text("English, Hindi, Kannada, Tulu", marginX, currentY);
        currentY += 12;

        // Helper: Section Divider Line
        function drawSectionHeader(title) {
            checkPageSpace(26);
            currentY += 6;
            doc.setFont('times', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(0, 0, 0);
            doc.text(title, marginX, currentY);
            
            currentY += 3;
            doc.setLineWidth(0.75);
            doc.setDrawColor(0, 0, 0);
            doc.line(marginX, currentY, pageWidth - marginX, currentY);
            currentY += 13;
        }

        // Helper: Bullet point wrapper
        function drawBulletPoint(text) {
            doc.setFont('times', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(20, 20, 20);
            
            const bulletSymbol = "•";
            const indent = 12;
            const wrappedLines = doc.splitTextToSize(text, printableWidth - indent);
            const lineHeight = 11.5;
            const heightNeeded = wrappedLines.length * lineHeight;
            
            checkPageSpace(heightNeeded);
            doc.text(bulletSymbol, marginX + 3, currentY);
            
            wrappedLines.forEach((line, index) => {
                doc.text(line, marginX + indent, currentY + (index * lineHeight));
            });
            
            currentY += heightNeeded + 2;
        }

        // Clean filename safely: keep alphanumeric & spaces, remove dots/symbols, then join with underscores
        let sanitizedRole = filenameRole
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_');

        if (!sanitizedRole || sanitizedRole.length < 2) {
            sanitizedRole = "NET_Developer";
        }

        const filename = "Charan_Kumar_Resume.pdf";

        // Save file using jsPDF built-in save (bypasses Chrome's Blob URL UUID naming bug)
        try {
            doc.save(filename);
        } catch (e) {
            console.warn("jsPDF doc.save failed, falling back to Data URI download:", e);
            const dataUrl = doc.output('datauristring');
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = dataUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                if (document.body.contains(a)) {
                    document.body.removeChild(a);
                }
            }, 1000);
        }
    }

    // 8. Event Bindings & Modal Functionality
    document.addEventListener("DOMContentLoaded", () => {
        const resumeModal = document.getElementById("resumeModal");
        const floatingBtn = document.getElementById("floatingResumeBtn");
        const navBtn = document.getElementById("navTailoredResumeBtn");
        const heroBtn = document.getElementById("heroTailoredResumeBtn");
        const closeBtn = document.getElementById("closeResumeModal");
        const cancelBtn = document.getElementById("cancelResumeBtn");
        const generateBtn = document.getElementById("generateResumeBtn");
        const jdInput = document.getElementById("jobDescriptionInput");
        const aiToggle = document.getElementById("aiEnhanceToggle");
        const loadingOverlay = document.getElementById("resumeLoadingOverlay");

        // Clear any legacy cooldown timestamp from previous runs
        try {
            localStorage.removeItem("resume_cooldown_timestamp");
        } catch (e) {}

        // Open modal
        const openModal = async (e) => {
            e.preventDefault();
            generateBtn.disabled = false;
            if (aiToggle) aiToggle.checked = true;
            
            resumeModal.classList.add("open");
            jdInput.focus();
            
            // Pre-fetch resume data
            await loadResumeData();
        };

        if (floatingBtn) floatingBtn.addEventListener("click", openModal);
        if (navBtn) navBtn.addEventListener("click", openModal);
        if (heroBtn) heroBtn.addEventListener("click", openModal);

        // Close modal
        const closeModal = () => {
            resumeModal.classList.remove("open");
            jdInput.value = "";
        };

        if (closeBtn) closeBtn.addEventListener("click", closeModal);
        if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

        // Loading Overlay steps animation controller
        function showStep(stepNum) {
            for (let i = 1; i <= 5; i++) {
                const el = document.getElementById(`loadingStep${i}`);
                if (el) el.style.display = i === stepNum ? "block" : "none";
            }
        }

        // Generate Resume Action handler
        generateBtn.addEventListener("click", async () => {
            const jdText = jdInput.value.trim();
            if (!jdText) {
                alert("Please paste a job description first.");
                jdInput.focus();
                return;
            }

            // Step 1: Active Loading
            loadingOverlay.classList.add("active");
            showStep(1);

            try {
                // Wait briefly for smooth loader transitions
                await new Promise(r => setTimeout(r, 600));
                
                // Step 2: Extract keywords and match
                showStep(2);
                const keywords = extractKeywords(jdText);
                const roleTitle = guessRoleTitle(jdText);
                const sourceData = await loadResumeData();
                
                if (!sourceData) {
                    throw new Error("Could not load source resume data.");
                }

                let finalData = matchResumeData(sourceData, keywords);
                
                // Step 3: LLM Polish (if toggled)
                if (aiToggle.checked) {
                    showStep(3);
                    try {
                        const polishResponse = await fetch('./api/polish', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                jobDescription: jdText,
                                experience: finalData.experience.map(j => ({
                                    company: j.company,
                                    role: j.role,
                                    bullets: j.bullets.map(b => ({ text: b.text }))
                                }))
                            })
                        });

                        if (polishResponse.ok) {
                            const polishedJson = await polishResponse.json();
                            if (polishedJson && polishedJson.experience) {
                                // Overwrite experience bullets in matched data with rephrased bullets
                                finalData.experience = finalData.experience.map(originalJob => {
                                    const polishedJob = polishedJson.experience.find(pj => pj.company === originalJob.company);
                                    if (polishedJob && polishedJob.bullets) {
                                        return {
                                            ...originalJob,
                                            bullets: originalJob.bullets.map((b, bIdx) => {
                                                const polishedB = polishedJob.bullets[bIdx];
                                                return {
                                                    text: polishedB ? polishedB.text : b.text,
                                                    tags: b.tags
                                                };
                                            })
                                        };
                                    }
                                    return originalJob;
                                });
                            }
                        } else {
                            console.warn("AI Polishing endpoint failed, falling back to local matches.", await polishResponse.text());
                        }
                    } catch (aiErr) {
                        console.error("AI Polish failed, using matched resume copy:", aiErr);
                    }
                }

                // Step 4: Render PDF
                showStep(4);
                await new Promise(r => setTimeout(r, 400));
                generatePdfResume(finalData, roleTitle);

                // Step 5: Complete & Download
                showStep(5);
                await new Promise(r => setTimeout(r, 400));
                
                // Close modal
                loadingOverlay.classList.remove("active");
                closeModal();
            } catch (error) {
                console.error("Generator failed:", error);
                alert("An error occurred during resume generation. Please try again.");
                loadingOverlay.classList.remove("active");
            }
        });
    });
})();


