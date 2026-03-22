const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const GEMINI_API_KEY = 'AIzaSyBOHl7Z_phtJyvncr-kaXfkWh_CpcWbWBQ';

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
    // Handle API proxy
    if (req.url === '/api/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const requestData = JSON.parse(body);
                const { messages } = requestData;
                
                console.log('📤 Sending request to Gemini...');
                console.log('Messages count:', messages.length);
                
                // Convert messages to Gemini format
                const systemMessage = messages.find(m => m.role === 'system');
                const contents = [];
                
                // Add system message as first user message if exists
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
                
                // Add other messages
                messages
                    .filter(m => m.role !== 'system')
                    .forEach(m => {
                        contents.push({
                            role: m.role === 'assistant' ? 'model' : 'user',
                            parts: [{ text: m.content }]
                        });
                    });
                
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
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
                
                // Convert to OpenAI format
                const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
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

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // Serve static files
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
