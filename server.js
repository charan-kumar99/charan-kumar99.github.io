const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_NEW_API_KEY_HERE';

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
                
                console.log('📤 Sending request to Gemini...');
                console.log('Messages count:', messages.length);
                
                const systemMessage = messages.find(m => m.role === 'system');
                const contents = [];
                
                if (systemMessage) {
                    contents.push({
                        role: 'user',
                        parts: [{ text: systemMessage.content }]
                    });
                    contents.push({
                        role: 'model',
                        parts: [{ text: 'Understood. I will follow these instructions.' }]
                    });
                }
                
                messages
                    .filter(m => m.role !== 'system')
                    .forEach(m => {
                        contents.push({
                            role: m.role === 'assistant' ? 'model' : 'user',
                            parts: [{ text: m.content }]
                        });
                    });
                
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents,
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 400
                            }
                        })
                    }
                );

                const data = await response.json();
                
                console.log('📥 Response status:', response.status);
                if (!response.ok) {
                    console.error('❌ Gemini error:', data);
                }
                
                const parts = data.candidates?.[0]?.content?.parts || [];
                const reply = parts.map(p => p.text).join('') || '';
                const openAIFormat = {
                    choices: [{
                        message: {
                            role: 'assistant',
                            content: reply
                        }
                    }]
                };
                
                res.writeHead(response.status, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify(openAIFormat));
            } catch (error) {
                console.error('❌ API Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
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
                
                console.log('📤 Sending resume polish request to Gemini...');
                
                const systemMessage = `You are an expert resume writer and recruiter. Your task is to review a job description and a candidate's work experience bullets, then slightly rephrase the bullets to align with the job description's terminology.

CRITICAL INSTRUCTIONS:
1. STRICT FACTUAL COMPLIANCE: Do NOT add, invent, exaggerate, or change any skills, technologies, numbers, dates, responsibilities, or claims that are not already explicitly stated in the candidate's original bullets.
2. Only adjust the terminology and phrasing (e.g. if the JD asks for "developing RESTful endpoints" and the bullet says "built REST APIs", rephrase it to echo "developing RESTful endpoints").
3. Preserve all numbers, tools, technologies, and achievements exactly as originally stated.
4. Output must be a valid JSON object matching the exact structure of the input experiences.
5. Do NOT include markdown code blocks (like \`\`\`json) in your text. Return ONLY the raw JSON string.

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

                const promptText = `
Job Description:
"""
${jobDescription}
"""

Original Experience Bullets:
${JSON.stringify(experience, null, 2)}

Please rephrase the bullets strictly according to the rules and return JSON.`;

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: [
                                {
                                    role: 'user',
                                    parts: [{ text: systemMessage }]
                                },
                                {
                                    role: 'model',
                                    parts: [{ text: 'Understood. I will strictly rephrase the bullets without inventing any facts and return only a JSON object matching the structure.' }]
                                },
                                {
                                    role: 'user',
                                    parts: [{ text: promptText }]
                                }
                            ],
                            generationConfig: {
                                temperature: 0.1,
                                responseMimeType: "application/json"
                            }
                        })
                    }
                );

                const data = await response.json();
                console.log('📥 Response status:', response.status);
                if (!response.ok) {
                    console.error('❌ Gemini error:', data);
                }
                
                const parts = data.candidates?.[0]?.content?.parts || [];
                const replyText = parts.map(p => p.text).join('').trim();
                
                let parsedResult;
                try {
                    parsedResult = JSON.parse(replyText);
                } catch (e) {
                    const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
                    parsedResult = JSON.parse(cleaned);
                }
                
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify(parsedResult));
            } catch (error) {
                console.error('❌ API Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error', details: error.message }));
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
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}/`);
    console.log(`📱 AI Chat is enabled with Google Gemini!\n`);
});
