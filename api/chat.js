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
        const apiKey = process.env.OPENROUTER_API_KEY || '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';
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://charan-kumar99.github.io',
                'X-Title': "Charan Kumar's Portfolio"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('OpenRouter error:', data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
