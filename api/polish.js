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

    const { jobDescription, experience } = req.body;

    if (!jobDescription || !experience) {
        return res.status(400).json({ error: 'Missing jobDescription or experience data' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const COHERE_API_KEY = process.env.COHERE_API_KEY;
    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

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

    // 1. Primary Attempt: Groq API
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
                    const parsedResult = JSON.parse(replyText);
                    return res.status(200).json(parsedResult);
                }
            } else {
                console.warn(`⚠️ Groq Polish API returned ${groqResponse.status}, switching to Gemini fallback...`);
            }
        } catch (groqErr) {
            console.warn('⚠️ Groq Polish API failed, switching to Gemini fallback:', groqErr.message);
        }
    }

    // 2. Secondary Attempt: Google Gemini API
    if (GEMINI_API_KEY) {
        try {
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
                const geminiData = await geminiResponse.json();
                const parts = geminiData.candidates?.[0]?.content?.parts || [];
                const replyText = parts.map(p => p.text).join('').trim();
                let parsedResult;
                try {
                    parsedResult = JSON.parse(replyText);
                } catch (e) {
                    const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
                    parsedResult = JSON.parse(cleaned);
                }
                return res.status(200).json(parsedResult);
            } else {
                console.warn(`⚠️ Gemini Polish API returned ${geminiResponse.status}, switching to OpenRouter fallback...`);
            }
        } catch (geminiErr) {
            console.warn('⚠️ Gemini Polish API failed, switching to OpenRouter fallback:', geminiErr.message);
        }
    }

    // 3. Tertiary Attempt: OpenRouter API
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
                    return res.status(200).json(parsedResult);
                }
            } else {
                console.warn(`⚠️ OpenRouter Polish API returned ${openRouterResponse.status}, switching to Cohere fallback...`);
            }
        } catch (openRouterErr) {
            console.warn('⚠️ OpenRouter Polish API failed, switching to Cohere fallback:', openRouterErr.message);
        }
    }

    // 4. Quaternary Attempt: Cohere API
    if (COHERE_API_KEY) {
        try {
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
                    return res.status(200).json(parsedResult);
                }
            } else {
                console.warn(`⚠️ Cohere Polish API returned ${cohereResponse.status}, switching to Hugging Face fallback...`);
            }
        } catch (cohereErr) {
            console.warn('⚠️ Cohere Polish API failed, switching to Hugging Face fallback:', cohereErr.message);
        }
    }

    // 5. Quinary Attempt: Hugging Face API
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
                    return res.status(200).json(parsedResult);
                }
            } else {
                console.warn(`⚠️ Hugging Face Polish API returned ${hfResponse.status}, switching to Mistral fallback...`);
            }
        } catch (hfErr) {
            console.warn('⚠️ Hugging Face Polish API failed, switching to Mistral fallback:', hfErr.message);
        }
    }

    // 6. Senary Attempt: Mistral AI API
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
                    return res.status(200).json(parsedResult);
                }
            } else {
                console.error(`❌ Mistral Polish API returned ${mistralResponse.status}`);
            }
        } catch (mistralErr) {
            console.error('❌ Mistral Polish API failed:', mistralErr);
        }
    }

    return res.status(500).json({ error: 'All 6 AI providers (Groq, Gemini, OpenRouter, Cohere, HuggingFace, Mistral) are unavailable.' });
}
