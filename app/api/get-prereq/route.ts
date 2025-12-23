import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const courseQuery = searchParams.get('course');

    if (!courseQuery) {
        return NextResponse.json({ error: 'Course parameter required' }, { status: 400 });
    }

    try {
        const csvPath = path.join(process.cwd(), 'app/data/courses.csv');
        const fileContent = fs.readFileSync(csvPath, 'utf-8');

        // Parse CSV simple (assuming no commas in fields)
        const lines = fileContent.split('\n');
        // Skip header
        const dataLines = lines.slice(1).filter(line => line.trim() !== '');

        const normalizedQuery = courseQuery.toLowerCase().trim();

        // Find matching course
        // Format: Course,Prerequisite,PrereqID
        const match = dataLines.find(line => {
            const parts = line.split(',');
            if (parts.length < 3) return false;
            return parts[0].toLowerCase().trim() === normalizedQuery;
        });

        if (match) {
            const parts = match.split(',');
            return NextResponse.json({
                course: parts[0].trim(),
                prerequisite: parts[1].trim(),
                prereqId: parts[2].trim()
            });
        }

        return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    } catch (error) {
        console.error('Error reading CSV:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
