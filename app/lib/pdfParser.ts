// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

export interface ParsedTranscript {
    studentName: string;
    studentId: string;
    courses: CourseGrade[];
}

export interface CourseGrade {
    course: string;
    description: string;
    grade: string;
    credits: number;
    term: string;
}

/**
 * Parse a PDF transcript to extract student info and course grades
 * Uses pdf-parse library which works reliably in Node.js
 */
export async function parseTranscriptPDF(buffer: Buffer): Promise<ParsedTranscript> {
    try {
        // Parse PDF using pdf-parse
        const data = await pdfParse(buffer);
        const text = data.text;

        // 1. Extract Student Info
        // Format: Name: Karan Kumar  Student ID: 23841840
        const nameMatch = text.match(/Name:\s*([^\n]+?)(?:\s+Student ID:|$)/i);
        let studentName = nameMatch ? nameMatch[1].trim() : "";

        const idMatch = text.match(/Student ID:\s*(\d+)/i);
        const studentId = idMatch ? idMatch[1].trim() : "";

        // 2. Extract Courses
        const courses: CourseGrade[] = [];
        const lines = text.split('\n');
        let currentTerm = "Unknown Term";

        // Match term headers like "Fall 2023" or "Spring 2024"
        const termPattern = /(Fall|Spring|Summer|Winter)\s+(20\d{2})/i;

        // UofA transcript course pattern:
        // COURSE_CODE  DESCRIPTION  AHRS  EHRS  Grade  Points
        // Examples from image:
        // CSC 110  Computer Programming I  4.000  4.000  B  12.000
        // MATH 125  Calculus I  3.000  3.000  A  12.000
        const coursePattern = /^([A-Z]{2,4}\s+\d{3}[A-Z]?)\s+(.+?)\s+(\d+\.\d{3})\s+(\d+\.\d{3})\s+([A-FW][+-]?|IP|P|S)\s+(\d+\.\d{3})/;

        // Simpler pattern for lines that might have different spacing
        const simpleCoursePattern = /([A-Z]{2,4}\s+\d{3}[A-Z]?)\s+(.+?)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+([A-FW][+-]?|IP|P|S)/;

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Check for term header
            const termMatch = trimmedLine.match(termPattern);
            if (termMatch) {
                currentTerm = `${termMatch[1]} ${termMatch[2]}`;
                continue;
            }

            // Try to match course pattern
            let courseMatch = trimmedLine.match(coursePattern);
            if (!courseMatch) {
                courseMatch = trimmedLine.match(simpleCoursePattern);
            }

            if (courseMatch) {
                const courseCode = courseMatch[1].trim();
                const description = courseMatch[2].trim();
                const credits = parseFloat(courseMatch[4]) || parseFloat(courseMatch[3]) || 3;
                const grade = courseMatch[5];

                // Skip if grade is empty or invalid
                if (grade && /^[A-FW][+-]?$|^IP$|^P$|^S$/.test(grade)) {
                    courses.push({
                        course: courseCode,
                        description: description,
                        grade: grade,
                        credits: credits,
                        term: currentTerm
                    });
                }
            }
        }

        // De-duplicate courses (keep most recent)
        const uniqueCoursesMap = new Map<string, CourseGrade>();
        courses.forEach(c => uniqueCoursesMap.set(c.course, c));

        return {
            studentName,
            studentId,
            courses: Array.from(uniqueCoursesMap.values())
        };

    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error(`Failed to parse transcript PDF: ${(error as Error).message}`);
    }
}

/**
 * Image parsing placeholder
 */
export async function parseTranscriptImage(_buffer: Buffer): Promise<CourseGrade[]> {
    return [];
}
