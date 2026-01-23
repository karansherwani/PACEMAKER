// lib/parseTranscriptPDF.ts
// Use pdf-parse v2 with the named PDFParse export
import { PDFParse } from 'pdf-parse';

export interface ParsedTranscript {
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
 * Parse a PDF transcript to extract course grades
 * Uses pdf-parse v2 API for Node.js/Next.js server environment
 */
export async function parseTranscriptPDF(buffer: Buffer): Promise<ParsedTranscript> {
    try {
        // Convert Buffer to Uint8Array for pdf-parse v2
        const uint8Array = new Uint8Array(buffer);
        // Create PDFParse instance and get text
        const pdfParser = new PDFParse({ data: uint8Array });
        const result = await pdfParser.getText();
        const text = result.text;



        // Extract Courses
        const courses: CourseGrade[] = [];
        const lines = text.split('\n');
        let currentTerm = 'Unknown Term';

        const termPattern = /(Fall|Spring|Summer|Winter)\s+(20\d{2})/i;
        // Pattern for completed courses with grades (AHRS EHRS Grade Points format)
        const coursePattern = /^([A-Z]{2,4}\s+\d{3}[A-Z0-9]{0,3})\s+(.+?)\s+(\d+\.\d{3})\s+(\d+\.\d{3})\s+([A-FW][+-]?|IP|P|S)\s+(\d+\.\d{3})/;
        const simpleCoursePattern = /([A-Z]{2,4}\s+\d{3}[A-Z0-9]{0,3})\s+(.+?)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+([A-FW][+-]?|IP|P|S)/;

        // Pattern for in-progress courses: CourseCode Description AHRS EHRS Points (no grade, EHRS=0.000)
        // Format: "CSC 210    Software Development    4.000    0.000    0.000"
        const inProgressWithPointsPattern = /^([A-Z]{2,4}\s+\d{3}[A-Z0-9]{0,3})\s+(.+?)\s+(\d+\.\d{3})\s+(0\.000)\s+(\d+\.\d{3})$/;

        // Alternative pattern for courses with just AHRS and EHRS (no points column visible)
        const inProgressPattern = /^([A-Z]{2,4}\s+\d{3}[A-Z0-9]{0,3})\s+(.+?)\s+(\d+\.?\d*)\s+(0\.000)\s*$/;

        // Generic pattern for courses with credits but no grade
        const noGradePattern = /^([A-Z]{2,4}\s+\d{3}[A-Z0-9]{0,3})\s+(.+?)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s*$/;

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Check for term header
            const termMatch = trimmedLine.match(termPattern);
            if (termMatch) {
                currentTerm = `${termMatch[1]} ${termMatch[2]}`;
                continue;
            }

            // Skip header lines and non-course lines
            if (trimmedLine.includes('Course') && trimmedLine.includes('Description')) continue;
            if (trimmedLine.includes('AHRS') || trimmedLine.includes('EHRS')) continue;
            if (trimmedLine.includes('GPA') || trimmedLine.includes('Term GPA')) continue;
            if (trimmedLine.startsWith('Course Attrib')) continue;

            // Try to match completed courses first (with grade)
            let courseMatch = trimmedLine.match(coursePattern);
            if (!courseMatch) {
                courseMatch = trimmedLine.match(simpleCoursePattern);
            }

            if (courseMatch) {
                const courseCode = courseMatch[1].trim();
                const description = courseMatch[2].trim();
                const credits = parseFloat(courseMatch[3]) || 3;
                const grade = courseMatch[5];

                if (grade && /^[A-FW][+-]?$|^IP$|^P$|^S$/.test(grade)) {
                    courses.push({
                        course: courseCode,
                        description: description,
                        grade: grade,
                        credits: credits,
                        term: currentTerm,
                    });
                }
                continue;
            }

            // Try to match in-progress courses (no grade, EHRS = 0.000)
            let inProgressMatch = trimmedLine.match(inProgressWithPointsPattern);
            if (!inProgressMatch) {
                inProgressMatch = trimmedLine.match(inProgressPattern);
            }
            if (!inProgressMatch) {
                // Check if it matches generic no-grade pattern and EHRS is 0
                const genericMatch = trimmedLine.match(noGradePattern);
                if (genericMatch && parseFloat(genericMatch[4]) === 0) {
                    inProgressMatch = genericMatch;
                }
            }

            if (inProgressMatch) {
                const courseCode = inProgressMatch[1].trim();
                const description = inProgressMatch[2].trim();
                const credits = parseFloat(inProgressMatch[3]) || 3;

                // Check if this looks like a valid course (not a header or other text)
                if (courseCode && description && description.length > 2 && !description.includes('Description')) {
                    courses.push({
                        course: courseCode,
                        description: description,
                        grade: 'IP', // In Progress
                        credits: credits,
                        term: currentTerm,
                    });
                }
            }
        }

        const uniqueCoursesMap = new Map<string, CourseGrade>();
        courses.forEach((c) => uniqueCoursesMap.set(c.course, c));

        return {
            courses: Array.from(uniqueCoursesMap.values()),
        };
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error(`Failed to parse transcript PDF: ${(error as Error).message}`);
    }
}

export async function parseTranscriptImage(_buffer: Buffer): Promise<CourseGrade[]> {
    return [];
}
