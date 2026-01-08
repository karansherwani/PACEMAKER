import { NextRequest, NextResponse } from 'next/server';
import { saveQuizAttempt } from '@/app/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { courseNumber, courseName, score, total, questionsUsed } = body;
        const userEmail = request.headers.get('x-user-email');

        if (!userEmail) {
            return NextResponse.json({ error: 'Missing user email in headers' }, { status: 400 });
        }

        if (!courseNumber || score === undefined || total === undefined) {
            return NextResponse.json({ error: 'Missing required quiz data (courseNumber, score, total)' }, { status: 400 });
        }

        // Save to JSON database
        await saveQuizAttempt(
            userEmail, // Using email as the identifier for now as per current app structure
            courseNumber,
            courseName || courseNumber,
            score,
            total,
            questionsUsed || []
        );

        return NextResponse.json({
            success: true,
            message: 'Quiz attempt saved successfully'
        });

    } catch (error) {
        console.error('Quiz submission API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to save quiz attempt',
                details: (error as Error).message
            },
            { status: 500 }
        );
    }
}
