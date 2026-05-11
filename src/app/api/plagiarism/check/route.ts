import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.length < 100) {
      return NextResponse.json(
        { 
          error: 'Input too short', 
          details: 'The plagiarism checker requires a minimum of 100 characters for a reliable scan.' 
        },
        { status: 400 }
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    console.log('Using Groq for Plagiarism Analysis');

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
            content: "You are a professional Plagiarism Checker. Analyze the provided text and estimate its originality. Since you cannot browse the live web in real-time, identify common phrases, academic terminology, and content that matches publicly available knowledge. Return ONLY a JSON object with: { \"score\": number (percentage of similarity, 0-100), \"wordCount\": number, \"sources\": array of { \"title\": string, \"url\": string, \"match\": number }, \"analysis\": string (detailed summary) }."
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
      console.error('Groq Plagiarism API Error:', err);
      throw new Error('Plagiarism analysis engine failed');
    }

    const result = await response.json();
    const data = JSON.parse(result.choices[0].message.content);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Plagiarism API Error:', error);
    return NextResponse.json(
      { error: 'Plagiarism check failed', details: error.message },
      { status: 500 }
    );
  }
}
