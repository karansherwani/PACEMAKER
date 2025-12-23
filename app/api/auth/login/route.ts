import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { university, authMethod, email, netId, password } = body;

    // Validate required fields
    if (!password) {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      );
    }

    if (authMethod === 'email' && !email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    if (authMethod === 'netid' && !netId) {
      return NextResponse.json(
        { message: 'NetID is required' },
        { status: 400 }
      );
    }

    // MOCK RESPONSE - Accept ANY credentials for demo
    const mockResponse = {
      success: true,
      token: 'auth_token_' + Date.now(),
      fullName: authMethod === 'email'
        ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
        : netId.charAt(0).toUpperCase() + netId.slice(1),
      email: email || netId + '@arizona.edu',
      studentId: 'A00' + Math.random().toString().slice(2, 8),
      classes: [
        {
          code: 'MATH 201',
          name: 'Calculus II',
          credits: 4,
          grade: 'A-',
          professor: 'Dr. Sarah Chen',
        },
        {
          code: 'PHYS 151',
          name: 'Physics I',
          credits: 4,
          grade: 'B+',
          professor: 'Prof. John Williams',
        },
        {
          code: 'CSE 120',
          name: 'Data Structures',
          credits: 3,
          grade: 'A',
          professor: 'Dr. Michael Johnson',
        },
      ],
      grades: [
        { courseCode: 'MATH 201', grade: 'A-' },
        { courseCode: 'PHYS 151', grade: 'B+' },
        { courseCode: 'CSE 120', grade: 'A' },
      ],
    };

    return NextResponse.json(mockResponse, { status: 200 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
