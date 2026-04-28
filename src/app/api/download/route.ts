import { NextRequest, NextResponse } from 'next/server';
import { generateDocx } from '@/lib/docxGenerator';
import { LabRecord } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { labRecord, experimentTitle, graphImageBuffer, visualOutputImageBuffer }: { 
      labRecord: LabRecord; 
      experimentTitle: string;
      graphImageBuffer?: number[] | null;
      visualOutputImageBuffer?: number[] | null;
    } = body;

    // Validate request body
    if (!labRecord || !experimentTitle) {
      return NextResponse.json(
        { error: 'Lab record and experiment title are required' },
        { status: 400 }
      );
    }

    // Generate DOCX file
    let graphBuffer: Buffer | undefined;
    if (graphImageBuffer && graphImageBuffer.length > 0) {
      graphBuffer = Buffer.from(graphImageBuffer);
    }
    
    let visualOutputBuffer: Buffer | undefined;
    if (visualOutputImageBuffer && visualOutputImageBuffer.length > 0) {
      visualOutputBuffer = Buffer.from(visualOutputImageBuffer);
    }
    
    const buffer = await generateDocx(labRecord, experimentTitle, graphBuffer, visualOutputBuffer);

    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Return file as downloadable stream
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${experimentTitle
          .replace(/[^a-z0-9]/gi, '-')
          .toLowerCase()}-lab-record.docx"`,
      },
    });
  } catch (error) {
    console.error('Download API Error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
