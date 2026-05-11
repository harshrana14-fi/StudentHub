import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.length < 255) {
      return NextResponse.json(
        { 
          error: 'Input too short', 
          details: `The AI detector requires a minimum of 255 characters to provide an accurate analysis. Current length: ${text?.length || 0} characters.` 
        },
        { status: 400 }
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional AI Content Detector. Analyze the provided text for linguistic patterns, perplexity, and burstiness typical of LLMs (like GPT-4, Claude, Llama). Return ONLY a JSON object with: { \"aiScore\": number (0-100), \"humanScore\": number (0-100), \"isAI\": boolean, \"confidence\": number (0-1), \"analysis\": string (detailed technical explanation) }."
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq API Error:', err);
      throw new Error('Analysis engine failed');
    }

    const result = await response.json();
    const data = JSON.parse(result.choices[0].message.content);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('AI Detector API Error:', error);
    return NextResponse.json(
      { error: 'AI Detection failed', details: error.message },
      { status: 500 }
    );
  }
}
