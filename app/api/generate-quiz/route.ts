import { NextRequest, NextResponse } from 'next/server';
import { generateQuizForCourse } from '@/app/lib/quizGenerator';
import { hasUserAttemptedQuiz } from '@/app/lib/db';

export async function POST(request: NextRequest) {
    try {
        // Get data from request
        const { courseNumber, courseName, difficulty } = await request.json();
        const userId = request.headers.get('x-user-email');

        if (!userId || !courseNumber || !courseName) {
            return NextResponse.json(
                { error: 'Missing required fields: x-user-email header, courseNumber, courseName' },
                { status: 400 }
            );
        }

        // For now, use a simple check - implement proper JWT/auth in production
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized - No valid token' },
                { status: 401 }
            );
        }

        // Check if user already attempted this quiz
        const hasAttempted = await hasUserAttemptedQuiz(userId, courseNumber);

        if (hasAttempted) {
            return NextResponse.json(
                { error: 'You have already completed this quiz' },
                { status: 403 }
            );
        }

        // Generate unique quiz
        const quiz = await generateQuizForCourse(
            userId,
            courseNumber,
            courseName,
            difficulty || 'medium'
        );

        return NextResponse.json({
            success: true,
            quiz: quiz,
            generatedAt: new Date().toISOString(),
            note: 'Questions are unique to your user ID'
        });

    } catch (error) {
        console.error('Quiz API error:', error);
        let errorMessage = (error as Error).message;

        if (errorMessage.includes('API key not valid')) {
            errorMessage = 'System Configuration Error: Invalid API Key. Please check server logs.';
        }

        return NextResponse.json(
            {
                error: 'Failed to generate quiz',
                details: errorMessage
            },
            { status: 500 }
        );
    }
}

// Add a GET method for debugging
export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: 'active',
        message: 'Quiz generation API is running',
        note: 'Use POST method with userId, courseNumber, courseName'
    });
}