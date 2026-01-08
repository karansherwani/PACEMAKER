import { NextRequest, NextResponse } from 'next/server';
import { parseTranscriptPDF } from '../../lib/pdfParser';
import { findUserById } from '../../lib/db';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse transcript
        const transcript = await parseTranscriptPDF(buffer);

        // Optional: Verify user if userId is provided and not a demo user
        if (userId && userId !== 'demo-user') {
            const user = await findUserById(userId);

            // Only verify if user exists and has matching info
            if (user) {
                // Verify Student ID matches (if both have it)
                if (transcript.studentId && user.studentId && transcript.studentId !== user.studentId) {
                    return NextResponse.json(
                        { error: `Transcript Student ID (${transcript.studentId}) does not match your profile ID (${user.studentId}).` },
                        { status: 403 }
                    );
                }

                // Verify Name matches (loose check, only if both have it)
                if (transcript.studentName && user.fullName) {
                    const transcriptNameLower = transcript.studentName.toLowerCase();
                    const userNameLower = user.fullName.toLowerCase();
                    const nameParts = userNameLower.split(' ');
                    const isMatch = nameParts.every((part: string) => transcriptNameLower.includes(part));

                    if (!isMatch) {
                        return NextResponse.json(
                            { error: `Transcript Name (${transcript.studentName}) does not match your profile name (${user.fullName}).` },
                            { status: 403 }
                        );
                    }
                }
            }
            // If user not found, just continue without verification (guest mode)
        }

        return NextResponse.json({
            success: true,
            studentName: transcript.studentName,
            studentId: transcript.studentId,
            courses: transcript.courses,
            totalCourses: transcript.courses.length,
        });

    } catch (error) {
        console.error('PDF parsing error:', error);
        return NextResponse.json(
            { error: 'Failed to process transcript: ' + (error as Error).message },
            { status: 500 }
        );
    }
}
