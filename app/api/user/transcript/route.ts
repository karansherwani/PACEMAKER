import { NextRequest, NextResponse } from 'next/server';
import { getUserTranscript } from '@/app/lib/db';

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const courses = await getUserTranscript(userId);

        return NextResponse.json({ courses });
    } catch (error) {
        console.error('Error fetching transcript:', error);
        return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
    }
}
