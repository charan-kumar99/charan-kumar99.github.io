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
        const apiKey = process.env.GEMINI_API_KEY || 'YOUR_NEW_API_KEY_HERE';
        const { jobDescription, experience } = req.body;

        if (!jobDescription || !experience) {
            return res.status(400).json({ error: 'Missing jobDescription or experience data' });
        }

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
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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

        if (!response.ok) {
            console.error('Gemini error:', data);
            return res.status(response.status).json(data);
        }

        const parts = data.candidates?.[0]?.content?.parts || [];
        const replyText = parts.map(p => p.text).join('').trim();

        // Parse reply text to make sure it's valid JSON
        let parsedResult;
        try {
            parsedResult = JSON.parse(replyText);
        } catch (e) {
            console.warn("Gemini output was not valid JSON, returning fallback parser", e);
            // Try cleaning up any markdown code block wrap if the model ignored instructions
            const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedResult = JSON.parse(cleaned);
        }

        return res.status(200).json(parsedResult);
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
