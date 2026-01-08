import { NextRequest, NextResponse } from 'next/server';
import { parseTranscriptPDF, ParsedTranscript } from '@/app/lib/pdfParser';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Check file type
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Only PDF files are supported' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Parse the PDF
        const transcript = await parseTranscriptPDF(buffer);

        return NextResponse.json({
            success: true,
            data: transcript
        });

    } catch (error) {
        console.error('Transcript upload error:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to parse transcript',
                success: false
            },
            { status: 500 }
        );
    }
}
