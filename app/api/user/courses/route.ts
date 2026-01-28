import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import User from '@/app/models/User';

// GET - Retrieve user's saved courses for grade calculator
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

        if (!user) {
            return NextResponse.json({ courses: [] });
        }

        return NextResponse.json({
            courses: user.savedCourses || [],
        });
    } catch (error) {
        console.error('Courses GET error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve courses' },
            { status: 500 }
        );
    }
}

// PUT - Save user's courses for grade calculator
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, courses } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Update or create user with saved courses
        await User.findOneAndUpdate(
            { email: userId.toLowerCase() },
            { $set: { savedCourses: courses || [] } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Courses PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to save courses' },
            { status: 500 }
        );
    }
}
