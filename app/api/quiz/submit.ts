// api/quiz/submit.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { studentId, courseId, score, suggestedSection } = await request.json();

  // Save to database
  try {
    // Connect to your university database
    const result = await db.query(
      'INSERT INTO quiz_attempts (student_id, course_id, score, suggested_section) VALUES (?, ?, ?, ?)',
      [studentId, courseId, score, suggestedSection]
    );

    return NextResponse.json({ success: true, resultId: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save quiz' }, { status: 500 });
  }
}
