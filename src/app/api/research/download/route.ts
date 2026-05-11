import { NextRequest, NextResponse } from 'next/server';
import { generateResearchPaperDocx } from '@/lib/researchPaperDocxGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paper, format, chartImage, diagramImage } = body;

    if (!paper || !paper.title) {
      return NextResponse.json(
        { error: 'Paper data is required' },
        { status: 400 }
      );
    }

    const buffer = await generateResearchPaperDocx(paper, format, chartImage, diagramImage);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${paper.title
          .replace(/[^a-z0-9]/gi, '-')
          .toLowerCase()}-research-paper.docx"`,
      },
    });
  } catch (error) {
    console.error('Research Download API Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
