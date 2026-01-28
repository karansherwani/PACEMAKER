import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import User from '@/app/models/User';

// GET - Retrieve user profile
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
            // Return empty profile for new users
            return NextResponse.json({
                fullName: '',
                dateOfBirth: '',
                studentId: '',
                address: '',
                profilePicture: '',
            });
        }

        return NextResponse.json({
            fullName: user.profile?.fullName || '',
            dateOfBirth: user.profile?.dateOfBirth || '',
            studentId: user.profile?.studentId || '',
            address: user.profile?.address || '',
            profilePicture: user.profile?.profilePicture || '',
        });
    } catch (error) {
        console.error('Profile GET error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve profile' },
            { status: 500 }
        );
    }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, fullName, dateOfBirth, studentId, address, profilePicture } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Find user or create new one
        const user = await User.findOneAndUpdate(
            { email: userId.toLowerCase() },
            {
                $set: {
                    'profile.fullName': fullName || '',
                    'profile.dateOfBirth': dateOfBirth || '',
                    'profile.studentId': studentId || '',
                    'profile.address': address || '',
                    'profile.profilePicture': profilePicture || '',
                },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            profile: {
                fullName: user.profile?.fullName || '',
                dateOfBirth: user.profile?.dateOfBirth || '',
                studentId: user.profile?.studentId || '',
                address: user.profile?.address || '',
                profilePicture: user.profile?.profilePicture || '',
            },
        });
    } catch (error) {
        console.error('Profile PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
