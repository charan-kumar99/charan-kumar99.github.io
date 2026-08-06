const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

try {
    const dotenvPath = path.join(__dirname, '.env');
    if (fs.existsSync(dotenvPath)) {
        const envConfig = fs.readFileSync(dotenvPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...value] = trimmed.split('=');
                if (key && value.length > 0) {
                    process.env[key.trim()] = value.join('=').trim();
                }
            }
        });
    }
} catch (e) {
    console.warn('⚠️ Could not load local .env file:', e.message);
}

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
    if (req.url === '/api/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const requestData = JSON.parse(body);
                const { messages } = requestData;
                
                console.log('📤 Processing AI Chat Request (Messages:', messages.length, ')...');
                
                if (GROQ_API_KEY) {
                    try {
                        console.log('⚡ Calling Groq API (llama-3.3-70b-versatile)...');
                        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${GROQ_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'llama-3.3-70b-versatile',
                                messages: messages,
                                temperature: 0.7,
                                max_tokens: 500
                            })
                        });

                        if (groqResponse.ok) {
                            const groqData = await groqResponse.json();
                            const reply = groqData.choices?.[0]?.message?.content || '';
                            if (reply) {
                                console.log('✅ Groq Chat API succeeded (Tier 1 - Ultra Fast)');
                                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                                return res.end(JSON.stringify({
                                    choices: [{ message: { role: 'assistant', content: reply } }],
                                    provider: 'groq'
                                }));
                            }
                        } else {
                            console.warn(`⚠️ Groq API status ${groqResponse.status}, switching to Gemini fallback...`);
                        }
                    } catch (groqErr) {
                        console.warn('⚠️ Groq API failed, switching to Gemini fallback:', groqErr.message);
                    }
                }

                if (GEMINI_API_KEY) {
                    try {
                        console.log('🤖 Calling Gemini API fallback (gemini-2.5-flash)...');
                        const systemMessage = messages.find(m => m.role === 'system');
                        const contents = [];
                        
                        if (systemMessage) {
                            contents.push({ role: 'user', parts: [{ text: systemMessage.content }] });
                            contents.push({ role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] });
                        }
                        
                        messages
                            .filter(m => m.role !== 'system')
                            .forEach(m => {
                                contents.push({
                                    role: m.role === 'assistant' ? 'model' : 'user',
                                    parts: [{ text: m.content }]
                                });
                            });
                        
                        const geminiResponse = await fetch(
                            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contents,
                                    generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
                                })
                            }
                        );

                        if (geminiResponse.ok) {
                            const data = await geminiResponse.json();
                            const parts = data.candidates?.[0]?.content?.parts || [];
                            const reply = parts.map(p => p.text).join('') || '';
                            console.log('✅ Gemini API succeeded (Tier 2 - Secondary Fallback)');
                            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                            return res.end(JSON.stringify({
                                choices: [{ message: { role: 'assistant', content: reply } }],
                                provider: 'gemini'
                            }));
                        } else {
                            console.warn(`⚠️ Gemini API status ${geminiResponse.status}, switching to OpenRouter fallback...`);
                        }
                    } catch (geminiErr) {
                        console.warn('⚠️ Gemini API failed, switching to OpenRouter fallback:', geminiErr.message);
                    }
                }

                if (OPENROUTER_API_KEY) {
                    try {
                        console.log('🌐 Calling OpenRouter API fallback...');
                        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                                'HTTP-Referer': 'https://charan-kumar99.github.io',
                                'X-Title': 'Charan Portfolio',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'meta-llama/llama-3.3-70b-instruct:free',
                                messages: messages,
                                temperature: 0.7,
                                max_tokens: 500
                            })
                        });

                        if (openRouterResponse.ok) {
                            const openRouterData = await openRouterResponse.json();
                            const reply = openRouterData.choices?.[0]?.message?.content || '';
                            if (reply) {
                                console.log('✅ OpenRouter API succeeded (Tier 3 - Tertiary Failover)');
                                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                                return res.end(JSON.stringify({
                                    choices: [{ message: { role: 'assistant', content: reply } }],
                                    provider: 'openrouter'
                                }));
                            }
                        } else {
                            console.warn(`⚠️ OpenRouter API status ${openRouterResponse.status}, switching to Cohere fallback...`);
                        }
                    } catch (openRouterErr) {
                        console.warn('⚠️ OpenRouter API failed, switching to Cohere fallback:', openRouterErr.message);
                    }
                }

                if (COHERE_API_KEY) {
                    try {
                        console.log('🎯 Calling Cohere API fallback (command-r-plus)...');
                        const cohereMessages = messages.map(m => ({
                            role: m.role === 'assistant' ? 'assistant' : (m.role === 'system' ? 'system' : 'user'),
                            content: m.content
                        }));

                        const cohereResponse = await fetch('https://api.cohere.com/v2/chat', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${COHERE_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'command-r-plus',
                                messages: cohereMessages,
                                max_tokens: 500
                            })
                        });

                        if (cohereResponse.ok) {
                            const cohereData = await cohereResponse.json();
                            const reply = cohereData.message?.content?.[0]?.text || '';
                            if (reply) {
                                console.log('✅ Cohere API succeeded (Tier 4 - Quaternary Failover)');
                                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                                return res.end(JSON.stringify({
                                    choices: [{ message: { role: 'assistant', content: reply } }],
                                    provider: 'cohere'
                                }));
                            }
                        } else {
                            console.warn(`⚠️ Cohere API status ${cohereResponse.status}, switching to Hugging Face fallback...`);
                        }
                    } catch (cohereErr) {
                        console.warn('⚠️ Cohere API failed, switching to Hugging Face fallback:', cohereErr.message);
                    }
                }

                if (HUGGINGFACE_API_KEY) {
                    try {
                        console.log('🤗 Calling Hugging Face API fallback (Mistral-7B-Instruct)...');
                        const hfResponse = await fetch('https://router.huggingface.co/hf-inference/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'mistralai/Mistral-7B-Instruct-v0.3',
                                messages: messages,
                                max_tokens: 500
                            })
                        });

                        if (hfResponse.ok) {
                            const hfData = await hfResponse.json();
                            const reply = hfData.choices?.[0]?.message?.content || '';
                            if (reply) {
                                console.log('✅ Hugging Face API succeeded (Tier 5 - Quinary Failover)');
                                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                                return res.end(JSON.stringify({
                                    choices: [{ message: { role: 'assistant', content: reply } }],
                                    provider: 'huggingface'
                                }));
                            }
                        } else {
                            console.warn(`⚠️ Hugging Face API status ${hfResponse.status}, switching to Mistral fallback...`);
                        }
                    } catch (hfErr) {
                        console.warn('⚠️ Hugging Face API failed, switching to Mistral fallback:', hfErr.message);
                    }
                }

                if (MISTRAL_API_KEY) {
                    try {
                        console.log('🌪️ Calling Mistral AI API fallback (mistral-small-latest)...');
                        const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'mistral-small-latest',
                                messages: messages,
                                max_tokens: 500
                            })
                        });

                        if (mistralResponse.ok) {
                            const mistralData = await mistralResponse.json();
                            const reply = mistralData.choices?.[0]?.message?.content || '';
                            if (reply) {
                                console.log('✅ Mistral AI API succeeded (Tier 6 - Senary Failover)');
                                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                                return res.end(JSON.stringify({
                                    choices: [{ message: { role: 'assistant', content: reply } }],
                                    provider: 'mistral'
                                }));
                            }
                        }
                    } catch (mistralErr) {
                        console.error('❌ Mistral API failed:', mistralErr.message);
                    }
                }

                res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ error: 'All 6 AI providers unavailable.' }));
            } catch (error) {
                console.error('❌ API Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ error: 'Internal server error', details: error.message }));
            }
        });
        return;
    }

    if (req.url === '/api/polish' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const requestData = JSON.parse(body);
                const { jobDescription, experience } = requestData;
                
                console.log('📤 Processing Resume Polish Request...');

                const systemMessage = `You are an expert resume writer and recruiter. Your task is to review a job description and a candidate's work experience bullets, then slightly rephrase the bullets to align with the job description's terminology.

CRITICAL INSTRUCTIONS:
1. STRICT FACTUAL COMPLIANCE: Do NOT add, invent, exaggerate, or change any skills, technologies, numbers, dates, responsibilities, or claims that are not already explicitly stated in the candidate's original bullets.
2. Only adjust the terminology and phrasing (e.g. if the JD asks for "developing RESTful endpoints" and the bullet says "built REST APIs", rephrase it to echo "developing RESTful endpoints").
3. Preserve all numbers, tools, technologies, and achievements exactly as originally stated.
4. Output must be a valid JSON object matching the exact structure of the input experiences.
5. Return ONLY a valid JSON object.

Expected Output Format:
{
  "experience": [
    {
      "company": "Company Name",
      "role": "Role Title",
      "bullets": [
        { "text": "Rephrased bullet point 1" },
        { "text": "Rephrased bullet point 2" }
      ]
    }
  ]
}`;

                const userPrompt = `Job Description:
"""
${jobDescription}
"""

Original Experience Bullets:
${JSON.stringify(experience, null, 2)}

Please rephrase the bullets strictly according to the rules and return JSON.`;

                if (GROQ_API_KEY) {
                    try {
                        console.log('⚡ Calling Groq Polish API (llama-3.3-70b-versatile)...');
                        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${GROQ_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'llama-3.3-70b-versatile',
                                messages: [
                                    { role: 'system', content: systemMessage },
                                    { role: 'user', content: userPrompt }
                                ],
                                response_format: { type: 'json_object' },
                                temperature: 0.1
                            })
                        });

                        if (groqResponse.ok) {
                            const groqData = await groqResponse.json();
                            const replyText = groqData.choices?.[0]?.message?.content || '';
                            if (replyText) {
                                console.log('✅ Groq Polish API succeeded (Tier 1 - Fastest)');
                                const parsedResult = JSON.parse(replyText);
                                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                                return res.end(JSON.stringify(parsedResult));
                            }
                        } else {
                            console.warn(`⚠️ Groq Polish API status ${groqResponse.status}, switching to Gemini fallback...`);
                        }
                    } catch (groqErr) {
                        console.warn('⚠️ Groq Polish API failed, switching to Gemini fallback:', groqErr.message);
                    }
                }

                if (GEMINI_API_KEY) {
                    try {
                        console.log('🤖 Calling Gemini Polish API fallback...');
                        const geminiResponse = await fetch(
                            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contents: [
                                        { role: 'user', parts: [{ text: systemMessage }] },
                                        { role: 'model', parts: [{ text: 'Understood. I will strictly rephrase bullets without inventing facts.' }] },
                                        { role: 'user', parts: [{ text: userPrompt }] }
                                    ],
                                    generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
                                })
                            }
                        );

                        if (geminiResponse.ok) {
                            const data = await geminiResponse.json();
                            const parts = data.candidates?.[0]?.content?.parts || [];
                            const replyText = parts.map(p => p.text).join('').trim();
                            let parsedResult;
                            try {
                                parsedResult = JSON.parse(replyText);
                            } catch (e) {
                                const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
                                parsedResult = JSON.parse(cleaned);
                            }
                            console.log('✅ Gemini Polish API succeeded (Tier 2 - Fallback)');
                            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                            return res.end(JSON.stringify(parsedResult));
                        } else {
                            console.warn(`⚠️ Gemini Polish API status ${geminiResponse.status}, switching to OpenRouter fallback...`);
                        }
                    } catch (geminiErr) {
                        console.warn('⚠️ Gemini Polish API failed, switching to OpenRouter fallback:', geminiErr.message);
                    }
                }

                if (OPENROUTER_API_KEY) {
                    try {
                        console.log('🌐 Calling OpenRouter Polish API fallback...');
                        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                                'HTTP-Referer': 'https://charan-kumar99.github.io',
                                'X-Title': 'Charan Portfolio',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'meta-llama/llama-3.3-70b-instruct:free',
                                messages: [
                                    { role: 'system', content: systemMessage },
                                    { role: 'user', content: userPrompt }
                                ],
                                response_format: { type: 'json_object' },
                                temperature: 0.1
                            })
                        });

                        if (openRouterResponse.ok) {
                            const openRouterData = await openRouterResponse.json();
                            const replyText = openRouterData.choices?.[0]?.message?.content || '';
                            if (replyText) {
                                let parsedResult;
                                try {
                                    parsedResult = JSON.parse(replyText);
                                } catch (e) {
                                    const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
                                    parsedResult = JSON.parse(cleaned);
                                }
                                console.log('✅ OpenRouter Polish API succeeded (Tier 3 - Fallback)');
                                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                                return res.end(JSON.stringify(parsedResult));
                            }
                        } else {
                            console.warn(`⚠️ OpenRouter Polish API returned ${openRouterResponse.status}, switching to Cohere fallback...`);
                        }
                    } catch (openRouterErr) {
                        console.warn('⚠️ OpenRouter Polish API failed, switching to Cohere fallback:', openRouterErr.message);
                    }
                }

                if (COHERE_API_KEY) {
                    try {
                        console.log('🎯 Calling Cohere Polish API fallback (command-r-plus)...');
                        const cohereResponse = await fetch('https://api.cohere.com/v2/chat', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${COHERE_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'command-r-plus',
                                messages: [
                                    { role: 'system', content: systemMessage },
                                    { role: 'user', content: userPrompt }
                                ],
                                response_format: { type: 'json_object' },
                                temperature: 0.1
                            })
                        });

                        if (cohereResponse.ok) {
                            const cohereData = await cohereResponse.json();
                            const replyText = cohereData.message?.content?.[0]?.text || '';
                            if (replyText) {
                                let parsedResult;
                                try {
                                    parsedResult = JSON.parse(replyText);
                                } catch (e) {
                                    const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
                                    parsedResult = JSON.parse(cleaned);
                                }
                                console.log('✅ Cohere Polish API succeeded (Tier 4 - Fallback)');
                                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                                return res.end(JSON.stringify(parsedResult));
                            }
                        } else {
                            console.warn(`⚠️ Cohere Polish API returned ${cohereResponse.status}, switching to Hugging Face fallback...`);
                        }
                    } catch (cohereErr) {
                        console.warn('⚠️ Cohere Polish API failed, switching to Hugging Face fallback:', cohereErr.message);
                    }
                }

                if (HUGGINGFACE_API_KEY) {
                    try {
                        console.log('🤗 Calling Hugging Face Polish API fallback (Mistral-7B-Instruct)...');
                        const hfResponse = await fetch('https://router.huggingface.co/hf-inference/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'mistralai/Mistral-7B-Instruct-v0.3',
                                messages: [
                                    { role: 'system', content: systemMessage },
                                    { role: 'user', content: userPrompt }
                                ],
                                temperature: 0.1
                            })
                        });

                        if (hfResponse.ok) {
                            const hfData = await hfResponse.json();
                            const replyText = hfData.choices?.[0]?.message?.content || '';
                            if (replyText) {
                                let parsedResult;
                                try {
                                    parsedResult = JSON.parse(replyText);
                                } catch (e) {
                                    const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
                                    parsedResult = JSON.parse(cleaned);
                                }
                                console.log('✅ Hugging Face Polish API succeeded (Tier 5 - Fallback)');
                                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                                return res.end(JSON.stringify(parsedResult));
                            }
                        } else {
                            console.warn(`⚠️ Hugging Face Polish API returned ${hfResponse.status}, switching to Mistral fallback...`);
                        }
                    } catch (hfErr) {
                        console.warn('⚠️ Hugging Face Polish API failed, switching to Mistral fallback:', hfErr.message);
                    }
                }

                if (MISTRAL_API_KEY) {
                    try {
                        console.log('🌪️ Calling Mistral Polish API fallback (mistral-small-latest)...');
                        const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'mistral-small-latest',
                                messages: [
                                    { role: 'system', content: systemMessage },
                                    { role: 'user', content: userPrompt }
                                ],
                                response_format: { type: 'json_object' },
                                temperature: 0.1
                            })
                        });

                        if (mistralResponse.ok) {
                            const mistralData = await mistralResponse.json();
                            const replyText = mistralData.choices?.[0]?.message?.content || '';
                            if (replyText) {
                                let parsedResult;
                                try {
                                    parsedResult = JSON.parse(replyText);
                                } catch (e) {
                                    const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
                                    parsedResult = JSON.parse(cleaned);
                                }
                                console.log('✅ Mistral Polish API succeeded (Tier 6 - Fallback)');
                                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                                return res.end(JSON.stringify(parsedResult));
                            }
                        }
                    } catch (mistralErr) {
                        console.error('❌ Mistral Polish API failed:', mistralErr.message);
                    }
                }

                res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ error: 'All 6 AI providers unavailable.' }));
            } catch (error) {
                console.error('❌ Polish Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ error: 'Internal server error', details: error.message }));
            }
        });
        return;
    }

    if (req.url === '/api/latex' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { data, format, docType } = JSON.parse(body || '{}');
                const isCV = docType === 'cv';

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
                const tools = (data?.skills?.tools || ["Jira", "Azure DevOps", "Docker", "GitHub", "CI/CD Pipelines", "Firebase"]).map(escapeLatex).join(", ");
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
${proj.links?.github ? `\\vspace{-2pt}\n\\small \\textbf{GitHub:} \\url{${proj.links.github}}` : ''}`).join('\n');

                const latexCode = `\\documentclass[10pt,letterpaper]{article}
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

                if (format === 'json' || req.headers.accept?.includes('application/json')) {
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    return res.end(JSON.stringify({ latex: latexCode }));
                }

                // Call LaTeX compiler service to compile code directly into a PDF
                try {
                    const compileRes = await fetch(`https://latexonline.cc/compile?text=${encodeURIComponent(latexCode)}`);
                    if (compileRes.ok) {
                        const pdfBuffer = await compileRes.arrayBuffer();
                        res.writeHead(200, {
                            'Content-Type': 'application/pdf',
                            'Content-Disposition': 'attachment; filename="Charan_Kumar_Resume.pdf"',
                            'Access-Control-Allow-Origin': '*'
                        });
                        return res.end(Buffer.from(pdfBuffer));
                    }
                } catch (compileErr) {
                    console.warn("LaTeX online compiler service failed, returning JSON fallback:", compileErr);
                }

                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ latex: latexCode }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:8000/`);
    console.log(`🔒 6-Tier AI Provider Pipeline Configured:`);
    console.log(`   1️⃣ GROQ_API_KEY (Primary - Ultra Fast): ${GROQ_API_KEY ? '✅ Active' : '❌ Missing'}`);
    console.log(`   2️⃣ GEMINI_API_KEY (Secondary Fallback): ${GEMINI_API_KEY ? '✅ Active' : '❌ Missing'}`);
    console.log(`   3️⃣ OPENROUTER_API_KEY (Tertiary Failover): ${OPENROUTER_API_KEY ? '✅ Active' : '❌ Missing'}`);
    console.log(`   4️⃣ COHERE_API_KEY (Quaternary Failover): ${COHERE_API_KEY ? '✅ Active' : '❌ Missing'}`);
    console.log(`   5️⃣ HUGGINGFACE_API_KEY (Quinary Failover): ${HUGGINGFACE_API_KEY ? '✅ Active' : '❌ Missing'}`);
    console.log(`   6️⃣ MISTRAL_API_KEY (Senary Failover): ${MISTRAL_API_KEY ? '✅ Active' : '❌ Missing'}`);
});
