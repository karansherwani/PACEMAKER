import { NextRequest, NextResponse } from 'next/server';
import { findUser, saveUser } from '../../../lib/db';

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

    const identifier = authMethod === 'email' ? email : netId;
    const isSignup = body.isSignup; // Ensure your frontend sends this flag!

    if (isSignup) {
      if (await findUser(identifier)) {
        return NextResponse.json({ message: 'User already exists' }, { status: 409 });
      }

      const newUser = {
        id: Date.now().toString(),
        authMethod,
        identifier,
        password, // In prod, hash this
        fullName: authMethod === 'email'
          ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
          : netId.charAt(0).toUpperCase() + netId.slice(1),
        studentId: 'A00' + Math.random().toString().slice(2, 8),
      };

      await saveUser(newUser);

      // Return successful session immediately after signup
      return NextResponse.json({
        success: true,
        token: 'auth_token_' + Date.now(),
        userId: newUser.id,
        fullName: newUser.fullName,
        email: newUser.identifier + (authMethod === 'netid' ? '@arizona.edu' : ''),
        studentId: newUser.studentId,
        classes: [], // Empty for new users
        grades: [],
      }, { status: 200 });

    } else {
      // Sign In
      const user = await findUser(identifier);

      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      if (user.password !== password) {
        return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        token: 'auth_token_' + Date.now(),
        userId: user.id,
        fullName: user.fullName,
        email: user.identifier + (user.authMethod === 'netid' ? '@arizona.edu' : ''),
        studentId: user.studentId,
        // Mock classes for demo if user has none, or could persist them too
        classes: [
          { code: 'MATH 201', name: 'Calculus II', credits: 4, grade: 'A-', professor: 'Dr. Sarah Chen' },
          { code: 'PHYS 151', name: 'Physics I', credits: 4, grade: 'B+', professor: 'Prof. John Williams' }
        ],
        grades: [
          { courseCode: 'MATH 201', grade: 'A-' },
          { courseCode: 'PHYS 151', grade: 'B+' }
        ],
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
