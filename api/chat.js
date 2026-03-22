export default async function handler(req, res) {
    // Enable CORS for all origins
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
        const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBOHl7Z_phtJyvncr-kaXfkWh_CpcWbWBQ';
        const { messages } = req.body;
        
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
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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
        
        if (!response.ok) {
            console.error('Gemini error:', data);
            return res.status(response.status).json(data);
        }

        // Convert Gemini response to OpenAI format for compatibility
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const openAIFormat = {
            choices: [{
                message: {
                    role: 'assistant',
                    content: reply
                }
            }]
        };

        return res.status(200).json(openAIFormat);
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
