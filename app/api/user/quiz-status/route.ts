import { NextRequest, NextResponse } from 'next/server';
import { hasUserAttemptedQuiz } from '../../../lib/db';

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('userId');
    const courseId = request.nextUrl.searchParams.get('courseId');

    if (!userId || !courseId) {
        return NextResponse.json({ error: 'Missing userId or courseId' }, { status: 400 });
    }

    const taken = await hasUserAttemptedQuiz(userId, courseId);
    return NextResponse.json({ taken });
}

export async function POST(request: NextRequest) {
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
