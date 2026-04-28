import { NextRequest, NextResponse } from 'next/server';
import { generateLabRecord } from '@/lib/groq';
import { GenerateRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    // Validate request body
    if (!body.experimentTitle || !body.subject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Experiment title and subject are required',
        },
        { status: 400 }
      );
    }

    // Generate lab record using Groq API
    const labRecord = await generateLabRecord(
      body.experimentTitle,
      body.subject
    );

    return NextResponse.json({
      success: true,
      data: labRecord,
    });
  } catch (error) {
    console.error('Generate API Error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
