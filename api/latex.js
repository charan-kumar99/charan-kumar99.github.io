function escapeLatex(str) {
    if (!str) return '';
    return String(str)
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}');
}

export function generateLatexCode(data, docType = 'resume') {
    const isCV = docType === 'cv';
    const summary = escapeLatex(data?.tailoredSummary || "Software Developer & .NET / Full-Stack Engineer with hands-on experience building enterprise-grade web applications, REST APIs, and microservices using C#, ASP.NET Core, React, and database systems across PostgreSQL, SQL Server, and Redis. Proven track record in clean architecture and automated CI/CD deployments. Currently pursuing MCA while working full-time.");

    const defaultHighlights = [
        "1+ year experience in enterprise banking systems (RTGS/NEFT, CTS, AML)",
        "Built microservices-based applications serving multiple banks",
        "Developed AI-powered GitHub analyzer (DevLens) with 40+ metrics",
        "Strong full-stack expertise in ASP.NET Core, React, and SQL"
    ];
    const highlights = data?.tailoredHighlights || defaultHighlights;
    const highlightsTex = highlights.map(h => `    \\item ${escapeLatex(h)}`).join('\n');

    const expTex = (data?.experience || []).map(job => `
\\vspace{1pt}
\\noindent
\\textbf{${escapeLatex(job.role)}} \\hfill \\textbf{${escapeLatex(job.dates || '')}} \\\\
\\textit{${escapeLatex(job.company)}}
\\vspace{-4pt}
\\begin{itemize}
    \\setlength{\\itemsep}{-2pt}
    \\setlength{\\parskip}{0pt}
    \\setlength{\\parsep}{0pt}
${(isCV ? (job.bullets || []) : (job.bullets || []).slice(0, 3)).map(b => `    \\item ${escapeLatex(b.text)}`).join('\n')}
\\end{itemize}`).join('\n');

    const lang = (data?.skills?.languages || ["C#", "JavaScript", "Java", "C", "Python"]).map(escapeLatex).join(", ");
    const fw = (data?.skills?.frameworks || ["ASP.NET Core", "Blazor", "React", "Flutter", "Razor Pages"]).map(escapeLatex).join(", ");
    const db = (data?.skills?.databases || ["PostgreSQL", "SQL Server", "MySQL", "Redis"]).map(escapeLatex).join(", ");
    const tools = (data?.skills?.tools || ["Azure DevOps", "Docker", "GitHub", "CI/CD Pipelines", "Firebase"]).map(escapeLatex).join(", ");
    const arch = (data?.skills?.architecture || ["Clean Architecture", "Microservices Architecture", "REST APIs", "System Design"]).map(escapeLatex).join(", ");

    const projTex = (isCV ? (data?.projects || []) : (data?.projects || []).slice(0, 3)).map(proj => `
\\vspace{1pt}
\\noindent
\\textbf{${escapeLatex(proj.name)}} \\\\
\\textbf{Tech:} ${proj.techStack ? proj.techStack.map(escapeLatex).join(", ") : ""}
\\vspace{-4pt}
\\begin{itemize}
    \\setlength{\\itemsep}{-2pt}
    \\setlength{\\parskip}{0pt}
    \\setlength{\\parsep}{0pt}
${(isCV ? (proj.bullets || []) : (proj.bullets || []).slice(0, 3)).map(b => `    \\item ${escapeLatex(b.text)}`).join('\n')}
\\end{itemize}
${proj.links?.github ? `\\vspace{-4pt}\n\\small \\textbf{GitHub:} \\url{${proj.links.github}}` : ''}`).join('\n');

    return `\\documentclass[10pt,letterpaper]{article}
\\usepackage[top=0.35in,bottom=0.35in,left=0.4in,right=0.4in]{geometry}
\\usepackage{ebgaramond}
\\usepackage[dvipsnames,svgnames,x11names]{xcolor}
\\usepackage{amsmath,amssymb}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{fontawesome}
\\usepackage{titlesec}
\\usepackage{parskip}

\\hypersetup{
    colorlinks=true,
    urlcolor=black,
    pdfauthor={Charan Kumar},
    pdftitle={Charan Kumar - Resume}
}

\\setlength{\\parindent}{0pt}
\\pagestyle{empty}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{4pt}{1pt}

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{CHARAN KUMAR}}\\\\[2pt]
    {\\large \\textit{Software Developer}}\\\\[4pt]
    \\small
    \\faEnvelope\\ \\href{mailto:charansuvarna99@gmail.com}{charansuvarna99@gmail.com} \\quad
    \\faPhone\\ \\href{tel:+919380455922}{+91 9380455922} \\quad
    \\faMapMarker\\ \\href{https://maps.google.com/?q=Udupi,+Karnataka,+India}{Udupi, Karnataka, India} \\quad
    \\faLinkedin\\ \\href{https://www.linkedin.com/in/charan-kumar99}{LinkedIn}\\\\[2pt]
    \\faGithub\\ \\href{https://github.com/charan-kumar99}{GitHub} \\quad
    \\faGlobe\\ \\href{https://charan-kumar99.github.io}{Portfolio}
\\end{center}

\\vspace{-8pt}

\\section{PROFESSIONAL SUMMARY}
${summary}

\\section{TECHNICAL SKILLS}
\\vspace{1pt}
\\noindent \\textbf{Languages:} ${lang} \\\\
\\textbf{Frameworks:} ${fw} \\\\
\\textbf{Databases:} ${db} \\\\
\\textbf{Tools:} ${tools} \\\\
\\textbf{Architecture \& Concepts:} ${arch}

\\section{PROFESSIONAL EXPERIENCE}
${expTex}

\\section{PROJECTS}
${projTex}

\\section{EDUCATION}
\\vspace{1pt}
\\noindent
\\textbf{Master of Computer Applications (MCA)} \\hfill \\textbf{Nov 2025 -- Present} \\\\
MIT, Jaipur (Online) | Currently pursuing MCA while working full-time.

\\vspace{2pt}
\\noindent
\\textbf{Bachelor of Computer Applications (BCA)} \\hfill \\textbf{Sep 2022 -- Jun 2025} \\\\
Udupi College of Professional Studies, Mangalore University | CGPA: 6.17 |\\\\[1pt]
\\textbf{Add-on Courses:}~Cybersecurity, Artificial Intelligence \\& Big Data Analytics.
${isCV ? `
\\vspace{2pt}
\\noindent
\\textbf{Pre-University (12th)} \\hfill \\textbf{Jul 2020 -- Apr 2022} \\\\
St Cecily's Composite PU College, Udupi | Percentage: 67.71\\%

\\vspace{2pt}
\\noindent
\\textbf{10th Standard (SSLC)} \\hfill \\textbf{Apr 2019 -- Jun 2020} \\\\
Volakadu Government High School, Udupi | Percentage: 68\\%` : ''}

\\section{CERTIFICATIONS \\& TRAINING}
\\vspace{-4pt}
\\begin{itemize}
    \\setlength{\\itemsep}{-2pt}
    \\setlength{\\parskip}{0pt}
    \\setlength{\\parsep}{0pt}
    \\item Fast-Track Internship -- Data Analytics, Web Development \\& Python Projects | Accolade Tech Solutions (2024)
    \\item Cybersecurity \\& AI Training | Mangalore University (2024)
    \\item AI, Big Data Analytics \\& Cybersecurity Training | Mangalore University (2024)
    \\item Skill Development \\& Entrepreneurship Program | Udupi Grameena Buntara Sangha (2024)
    \\item NCC 'A' Certificate | National Cadet Corps (Ministry of Defence, India)
\\end{itemize}
${isCV ? `
\\section{ACTIVITIES \\& INTERESTS}
\\vspace{-4pt}
\\begin{itemize}
    \\setlength{\\itemsep}{-2pt}
    \\setlength{\\parskip}{0pt}
    \\setlength{\\parsep}{0pt}
    \\item \\textbf{NCC Cadet Lead:} Served as Head Cadet; recipient of \\textbf{Best Cadet Award}; completed 10-day intensive training camp with Indian Navy \\& Army Officers.
    \\item \\textbf{Cricket:} Competitive player \\& team captain; led teams to victories in district-level tournaments.
    \\item \\textbf{Volleyball:} District-level player \\& college team captain; won inter-institution championships.
    \\item \\textbf{Kabaddi \\& Chess:} Participated in district-level kabaddi tournaments; regular chess player.
\\end{itemize}` : ''}

\\end{document}`;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { data, format, docType } = req.body || {};
        const isCV = docType === 'cv';
        const latexCode = generateLatexCode(data, docType);

        if (format === 'json' || req.headers.accept?.includes('application/json')) {
            return res.status(200).json({ latex: latexCode });
        }

        try {
            const compileRes = await fetch(`https://latexonline.cc/compile?text=${encodeURIComponent(latexCode)}`);
            if (compileRes.ok) {
                const pdfBuffer = await compileRes.arrayBuffer();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${isCV ? 'Charan_Kumar_CV.pdf' : 'Charan_Kumar_Resume.pdf'}"`);
                return res.status(200).send(Buffer.from(pdfBuffer));
            }
        } catch (compileErr) {
            console.warn("Server LaTeX online compiler service error:", compileErr);
        }

        return res.status(200).json({ latex: latexCode });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
