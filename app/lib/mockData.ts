export interface CourseGrade {
    course: string;
    description: string;
    grade: string;
    credits: number;
    term: string;
}

export const MOCK_GRADES: CourseGrade[] = [
    // Fall 2023
    { course: 'AREC 150C3', description: 'Global Economy of Food', grade: 'A', credits: 3, term: 'Fall 2023' },
    { course: 'CSC 110', description: 'Computer Programming I', grade: 'B', credits: 4, term: 'Fall 2023' },
    { course: 'ENGL 106', description: 'Fnd Wrt Engl Additional Lang', grade: 'A', credits: 3, term: 'Fall 2023' },
    { course: 'MATH 125', description: 'Calculus I', grade: 'A', credits: 3, term: 'Fall 2023' },
    { course: 'PFFP 150B2', description: 'Personal Finance Foundations', grade: 'A', credits: 3, term: 'Fall 2023' },
    { course: 'UNIV 101', description: 'Intro to General Ed Experience', grade: 'A', credits: 1, term: 'Fall 2023' },
    { course: 'GAME 251', description: 'Intro to Game Design', grade: 'W', credits: 3, term: 'Fall 2023' },
    // Spring 2024
    { course: 'ACCT 200', description: 'Intro to Financial Acct', grade: 'A', credits: 3, term: 'Spring 2024' },
    { course: 'CSC 120', description: 'Intro to Computer Prog II', grade: 'B', credits: 4, term: 'Spring 2024' },
    { course: 'CSC 144', description: 'Discrete Math for Comp Sci I', grade: 'B', credits: 3, term: 'Spring 2024' },
    { course: 'ECON 200', description: 'Basic Economic Issues', grade: 'A', credits: 3, term: 'Spring 2024' },
    { course: 'ENGL 107', description: 'Fnd Wrt Engl Additional Lang', grade: 'A', credits: 3, term: 'Spring 2024' },
    { course: 'MATH 129', description: 'Calculus II', grade: 'A', credits: 3, term: 'Spring 2024' },
    // Fall 2024
    { course: 'CSC 210', description: 'Software Development', grade: 'E', credits: 4, term: 'Fall 2024' },
    { course: 'CSC 244', description: 'Discrete Math for Comp Sci II', grade: 'A', credits: 3, term: 'Fall 2024' },
    { course: 'ENGL 108', description: 'Fnd Wrt Engl Additional Lang', grade: 'A', credits: 3, term: 'Fall 2024' },
    { course: 'ENVS 210', description: 'Environmental Essentials', grade: 'A', credits: 3, term: 'Fall 2024' },
    { course: 'MATH 313', description: 'Intro to Linear Algebra', grade: 'A', credits: 3, term: 'Fall 2024' },
    // Spring 2025
    { course: 'CHEM 151', description: 'General Chemistry I', grade: 'A', credits: 4, term: 'Spring 2025' },
    { course: 'DATA 363', description: 'Intro to Statistical Methods', grade: 'B', credits: 3, term: 'Spring 2025' },
    { course: 'DNC 101', description: 'Dance Appreciation', grade: 'A', credits: 3, term: 'Spring 2025' },
    { course: 'EAS 160A1', description: 'The World of Buddhism', grade: 'A', credits: 3, term: 'Spring 2025' },
    { course: 'ISTA 322', description: 'Data Engineering', grade: 'B', credits: 3, term: 'Spring 2025' },
    { course: 'MATH 223', description: 'Vector Calculus', grade: 'B', credits: 4, term: 'Spring 2025' },
    // Fall 2025 (Current)
    { course: 'CSC 337', description: 'Web Programming', grade: 'A', credits: 3, term: 'Fall 2025' },
    { course: 'DATA 201', description: 'Foundations of Data Science', grade: 'C', credits: 3, term: 'Fall 2025' },
    { course: 'DATA 375', description: 'Intro to Statistcal Computing', grade: 'A', credits: 3, term: 'Fall 2025' },
    { course: 'MATH 464', description: 'Theory of Probability', grade: 'A', credits: 3, term: 'Fall 2025' },
    { course: 'MATH 323', description: 'Formal Math Reasoning', grade: 'B', credits: 3, term: 'Fall 2025' },
    { course: 'MATH 355', description: 'Analysis of Ordinary Differential Equations', grade: 'A', credits: 3, term: 'Fall 2025' },
    { course: 'univ 301', description: 'General Education Portfolio', grade: 'A', credits: 1, term: 'Fall 2025' },
];
