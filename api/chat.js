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

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid or missing messages array' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const COHERE_API_KEY = process.env.COHERE_API_KEY;
    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

    if (GROQ_API_KEY) {
        try {
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
                    return res.status(200).json({
                        choices: [{ message: { role: 'assistant', content: reply } }],
                        provider: 'groq'
                    });
                }
            } else {
                console.warn(`⚠️ Groq Chat API returned ${groqResponse.status}, switching to Gemini fallback...`);
            }
        } catch (groqErr) {
            console.warn('⚠️ Groq Chat API failed, switching to Gemini fallback:', groqErr.message);
        }
    }

    if (GEMINI_API_KEY) {
        try {
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
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 500
                        }
                    })
                }
            );

            if (geminiResponse.ok) {
                const geminiData = await geminiResponse.json();
                const parts = geminiData.candidates?.[0]?.content?.parts || [];
                const reply = parts.map(p => p.text).join('') || '';
                if (reply) {
                    return res.status(200).json({
                        choices: [{ message: { role: 'assistant', content: reply } }],
                        provider: 'gemini'
                    });
                }
            } else {
                console.warn(`⚠️ Gemini API returned ${geminiResponse.status}, switching to OpenRouter fallback...`);
            }
        } catch (geminiErr) {
            console.warn('⚠️ Gemini Chat API failed, switching to OpenRouter fallback:', geminiErr.message);
        }
    }

    if (OPENROUTER_API_KEY) {
        try {
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
                    return res.status(200).json({
                        choices: [{ message: { role: 'assistant', content: reply } }],
                        provider: 'openrouter'
                    });
                }
            } else {
                console.warn(`⚠️ OpenRouter API returned ${openRouterResponse.status}, switching to Cohere fallback...`);
            }
        } catch (openRouterErr) {
            console.warn('⚠️ OpenRouter Chat API failed, switching to Cohere fallback:', openRouterErr.message);
        }
    }

    if (COHERE_API_KEY) {
        try {
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
                    return res.status(200).json({
                        choices: [{ message: { role: 'assistant', content: reply } }],
                        provider: 'cohere'
                    });
                }
            } else {
                console.warn(`⚠️ Cohere API returned ${cohereResponse.status}, switching to Hugging Face fallback...`);
            }
        } catch (cohereErr) {
            console.warn('⚠️ Cohere Chat API failed, switching to Hugging Face fallback:', cohereErr.message);
        }
    }

    if (HUGGINGFACE_API_KEY) {
        try {
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
                    return res.status(200).json({
                        choices: [{ message: { role: 'assistant', content: reply } }],
                        provider: 'huggingface'
                    });
                }
            } else {
                console.warn(`⚠️ Hugging Face API returned ${hfResponse.status}, switching to Mistral fallback...`);
            }
        } catch (hfErr) {
            console.warn('⚠️ Hugging Face Chat API failed, switching to Mistral fallback:', hfErr.message);
        }
    }

    if (MISTRAL_API_KEY) {
        try {
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
                    return res.status(200).json({
                        choices: [{ message: { role: 'assistant', content: reply } }],
                        provider: 'mistral'
                    });
                }
            } else {
                console.error(`❌ Mistral API returned ${mistralResponse.status}`);
            }
        } catch (mistralErr) {
            console.error('❌ Mistral Chat API failed:', mistralErr);
        }
    }

    return res.status(500).json({ error: 'All 6 AI providers (Groq, Gemini, OpenRouter, Cohere, HuggingFace, Mistral) are unavailable.' });
}
