import { LabRecord } from '@/types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are an expert lab record generator for engineering students.
First, ANALYZE the experiment to determine if it requires a graph or generates visual output.
Return ONLY valid JSON with this exact structure (no markdown, no code blocks, just pure JSON):
{
  "aim": "string",
  "theory": "string",
  "algorithm": ["step1", "step2", "step3"],
  "code": "string",
  "output": "string",
  "graphRequired": true/false,
  "graphType": "line/bar/scatter/pie" (only if graphRequired is true),
  "graphData": {
    "xAxis": "label for x-axis",
    "yAxis": "label for y-axis",
    "points": [{"x": 1, "y": 2}, {"x": 2, "y": 4}, {"x": 3, "y": 6}]
  } (only if graphRequired is true),
  "hasVisualOutput": true/false,
  "visualOutputDescription": "Description of what the code visually generates (e.g., Analog Clock with hour, minute, and second hands)" (only if hasVisualOutput is true),
  "learningOutcomes": ["outcome1", "outcome2", "outcome3", "outcome4", "outcome5"],
  "vivaQuestions": [
    {"question": "Q1", "answer": "A1"},
    {"question": "Q2", "answer": "A2"},
    {"question": "Q3", "answer": "A3"},
    {"question": "Q4", "answer": "A4"},
    {"question": "Q5", "answer": "A5"}
  ]
}
IMPORTANT REQUIREMENTS:
- ANALYZE if the experiment needs a graph (e.g., performance analysis, data visualization, sorting comparisons, etc.)
- ANALYZE if the code generates visual output (e.g., GUI applications, applets, graphics, clocks, animations, etc.)
- If graph is needed, set graphRequired to true and provide graphType and graphData
- If code generates visual output, set hasVisualOutput to true and provide visualOutputDescription
- graphData.points should have AT LEAST 5 data points with realistic values
- learningOutcomes MUST have AT LEAST 5 items
- vivaQuestions MUST have AT LEAST 5 Q&A pairs
- code should be properly formatted with line breaks (\\n) for each line
- Make content practical and educational
- Ensure all fields are present`;

export async function generateLabRecord(
  experimentTitle: string,
  subject: string
): Promise<LabRecord> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const userPrompt = `Generate a complete lab record for the experiment: "${experimentTitle}" in ${subject} subject. Make content practical for engineering students.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || `Groq API error: ${response.status}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from Groq API');
    }

    // Parse JSON with robust error handling
    let labRecord: LabRecord;
    try {
      // Try to extract JSON if wrapped in code blocks
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
      }
      labRecord = JSON.parse(jsonStr);
    } catch (parseError) {
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate required fields
    if (
      !labRecord.aim ||
      !labRecord.theory ||
      !labRecord.algorithm ||
      !labRecord.code ||
      !labRecord.output ||
      !labRecord.learningOutcomes ||
      !labRecord.vivaQuestions
    ) {
      throw new Error('Incomplete lab record data received from AI');
    }

    return labRecord;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred during lab record generation');
  }
}
