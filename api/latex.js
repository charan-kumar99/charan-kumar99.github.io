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

export function generateLatexCode(data) {
    const summary = escapeLatex(data?.tailoredSummary || ".NET Developer with hands-on experience building enterprise-grade banking applications (RTGS/NEFT, CTS, AML) using ASP.NET Core (.NET 6 & .NET 8) and Microservices Architecture. Skilled in full-stack development, REST APIs, and database management across PostgreSQL, MySQL, Oracle, and SQL Server. Proven ability to deliver scalable, secure systems while managing end-to-end development and deployments via Azure DevOps. Currently pursuing MCA while working full-time.");

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
${(job.bullets || []).map(b => `    \\item ${escapeLatex(b.text)}`).join('\n')}
\\end{itemize}`).join('\n');

    const lang = (data?.skills?.languages || ["C#", "Java", "JavaScript", "C", "HTML5", "CSS3", "Python"]).map(escapeLatex).join(", ");
    const fw = (data?.skills?.frameworks || ["ASP.NET Core", "Blazor", "React", "Flask"]).map(escapeLatex).join(", ");
    const db = (data?.skills?.databases || ["PostgreSQL", "MySQL", "Oracle", "SQL Server"]).map(escapeLatex).join(", ");
    const tools = (data?.skills?.tools || ["Azure DevOps", "GitHub", "Postman", "DBeaver"]).map(escapeLatex).join(", ");

    const projTex = (data?.projects || []).slice(0, 3).map(proj => `
\\vspace{1pt}
\\noindent
\\textbf{${escapeLatex(proj.name)}} \\\\
\\textbf{Tech:} ${proj.techStack ? proj.techStack.map(escapeLatex).join(", ") : ""}
\\vspace{-4pt}
\\begin{itemize}
    \\setlength{\\itemsep}{-2pt}
    \\setlength{\\parskip}{0pt}
    \\setlength{\\parsep}{0pt}
${(proj.bullets || []).map(b => `    \\item ${escapeLatex(b.text)}`).join('\n')}
\\end{itemize}
${proj.links?.github ? `\\vspace{-4pt}\n\\small \\faLink\\ \\textbf{GitHub:} \\url{${proj.links.github}}` : ''}`).join('\n');

    return `\\documentclass[10pt,letterpaper]{article}
\\usepackage[top=0.35in,bottom=0.35in,left=0.4in,right=0.4in]{geometry}
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
    {\\large \\textit{Developer}}\\\\[4pt]
    \\small
    \\faEnvelope\\ \\href{mailto:charansuvarna99@gmail.com}{charansuvarna99@gmail.com} \\quad
    \\faPhone\\ +91 9380455922 \\quad
    \\faMapMarker\\ Udupi, Karnataka, India \\quad
    \\faLinkedin\\ \\href{https://www.linkedin.com/in/charan-kumar99}{LinkedIn}\\\\[2pt]
    \\faGithub\\ \\href{https://github.com/charan-kumar99}{GitHub} \\quad
    \\faGlobe\\ \\href{https://charan-kumar99.github.io}{Portfolio}
\\end{center}

\\vspace{-8pt}

\\section{PROFESSIONAL SUMMARY}
${summary}

\\section{KEY HIGHLIGHTS}
\\vspace{-4pt}
\\begin{itemize}
    \\setlength{\\itemsep}{-2pt}
    \\setlength{\\parskip}{0pt}
    \\setlength{\\parsep}{0pt}
${highlightsTex}
\\end{itemize}

\\section{WORK EXPERIENCE}
${expTex}

\\section{EDUCATION}

\\vspace{1pt}
\\noindent
\\textbf{Master of Computer Applications (MCA)} \\hfill \\textbf{Nov 2025 -- Present} \\\\
MIT, Jaipur (Online) | Currently pursuing MCA while working full-time.

\\vspace{2pt}
\\noindent
\\textbf{Bachelor of Computer Applications (BCA)} \\hfill \\textbf{Sep 2022 -- Jun 2025} \\\\
Udupi College of Professional Studies, Mangalore University | CGPA: 6.17 |\\\\[1pt]
\\textbf{Add-on Courses:} Cybersecurity, Artificial Intelligence \\& Big Data Analytics.

\\section{SKILLS}
\\vspace{1pt}
\\noindent \\textbf{Languages:} ${lang} \\\\
\\textbf{Frameworks:} ${fw} \\\\
\\textbf{Databases:} ${db} \\\\
\\textbf{Tools:} ${tools} \\\\
\\textbf{Concepts:} Microservices, REST APIs, API Versioning, System Design

\\section{PROJECTS}
${projTex}

\\section{CERTIFICATIONS \\& TRAINING}
\\vspace{-4pt}
\\begin{itemize}
    \\setlength{\\itemsep}{-2pt}
    \\setlength{\\parskip}{0pt}
    \\setlength{\\parsep}{0pt}
    \\item Data Analytics \\& Web Dev Internship -- Accolade Tech Solutions (2024)
    \\item Cybersecurity \\& AI Training -- Mangalore University (2024)
    \\item NCC 'A' Certificate
\\end{itemize}

\\section{ACHIEVEMENTS}
\\vspace{-4pt}
\\begin{itemize}
    \\setlength{\\itemsep}{-2pt}
    \\setlength{\\parskip}{0pt}
    \\setlength{\\parsep}{0pt}
    \\item Best Cadet Award -- National Cadet Corps (NCC)
    \\item Served as Head Cadet leading school NCC unit
    \\item District-level player in Cricket and Volleyball
\\end{itemize}

\\section{LANGUAGES}
\\vspace{1pt}
English, Hindi, Kannada, Tulu

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
        const { data, format } = req.body || {};
        const latexCode = generateLatexCode(data);

        if (format === 'json' || req.headers.accept?.includes('application/json')) {
            return res.status(200).json({ latex: latexCode });
        }

        try {
            const compileRes = await fetch(`https://latexonline.cc/compile?text=${encodeURIComponent(latexCode)}`);
            if (compileRes.ok) {
                const pdfBuffer = await compileRes.arrayBuffer();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="Charan_Kumar_Resume.pdf"');
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
