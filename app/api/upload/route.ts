import { NextRequest, NextResponse } from 'next/server';
import { parseTranscriptPDF } from '../../lib/pdfParser';
import connectToDatabase from '@/app/lib/mongodb';
import User from '@/app/models/User';

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

        // Save to MongoDB if userId is provided
        if (userId) {
            try {
                await connectToDatabase();

                // Transform courses to MongoDB format
                const transcriptCourses = transcript.courses.map((c: { course: string; description?: string; grade: string; credits?: number; term?: string }) => ({
                    courseNumber: c.course,
                    courseName: c.description || '',
                    grade: c.grade,
                    credits: c.credits || 3,
                    term: c.term || 'Unknown',
                }));

                // Update or create user with transcript
                await User.findOneAndUpdate(
                    { email: userId.toLowerCase() },
                    {
                        $set: { transcript: transcriptCourses },
                    },
                    { upsert: true, new: true }
                );

                console.log(`✅ Transcript saved for user: ${userId}`);
            } catch (dbError) {
                console.error('Database save error:', dbError);
                // Continue even if DB save fails - still return parsed data
            }
        }

        return NextResponse.json({
            success: true,
            courses: transcript.courses,
            totalCourses: transcript.courses.length,
            savedToDatabase: !!userId,
        });

    } catch (error) {
        console.error('PDF parsing error:', error);
        return NextResponse.json(
            { error: 'Failed to process transcript: ' + (error as Error).message },
            { status: 500 }
        );
    }
}

// GET - Retrieve saved transcript for a user
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await User.findOne({ email: userId.toLowerCase() });

        if (!user || !user.transcript || user.transcript.length === 0) {
            return NextResponse.json({
                hasTranscript: false,
                courses: [],
            });
        }

        // Transform back to frontend format
        const courses = user.transcript.map((c: { courseNumber: string; courseName: string; grade: string; credits: number; term: string }) => ({
            course: c.courseNumber,
            description: c.courseName,
            grade: c.grade,
            credits: c.credits,
            term: c.term,
        }));

        return NextResponse.json({
            hasTranscript: true,
            courses,
            totalCourses: courses.length,
        });
    } catch (error) {
        console.error('Transcript fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transcript' },
            { status: 500 }
        );
    }
}
