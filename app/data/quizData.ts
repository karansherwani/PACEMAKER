export interface Question {
    q: string;
    options: string[];
    correct: number;
}

export interface Course {
    id: string;
    name: string;
    prerequisite: string;
    description: string;
}

export const COURSES: Course[] = [
    {
        id: 'math355',
        name: 'Math 355',
        prerequisite: 'Math 223 - Vector Calculus',
        description: 'Analysis and Linear Algebra'
    },
    {
        id: 'csc210',
        name: 'CSC 210',
        prerequisite: 'CSC 110 - Intro to Programming',
        description: 'Software Development'
    }
];

export const QUIZZES: Record<string, Question[]> = {
    'math355': [
        { q: 'What is the gradient of f(x,y) = x² + y²?', options: ['(2x, 2y)', '(x, y)', '2x + 2y', 'Depends on z'], correct: 0 },
        { q: 'Evaluate: ∫∫ (x+y) dx dy over [0,1]x[0,1]', options: ['1', '0.5', '2', '0'], correct: 0 },
        { q: 'What is the dot product of (1, 2) and (3, 4)?', options: ['7', '11', '5', '10'], correct: 1 },
        { q: 'Find the curl of F = (y, -x, 0)', options: ['(0, 0, -2)', '(0, 0, 2)', '(1, 1, 1)', '0'], correct: 0 },
        { q: 'Which theorem relates line integrals to surface integrals?', options: ['Green\'s Theorem', 'Stokes\' Theorem', 'Divergence Theorem', 'Fundamental Theorem of Calculus'], correct: 1 },
    ],
    'csc210': [
        { q: 'What does "public static void main" mean?', options: ['Entry point', 'Class definition', 'Print statement', 'Loop'], correct: 0 },
        { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correct: 1 },
        { q: 'Which data structure follows LIFO?', options: ['Queue', 'Stack', 'List', 'Tree'], correct: 1 },
        { q: 'What keyword is used to inherit a class in Java?', options: ['implements', 'extends', 'inherits', 'super'], correct: 1 },
        { q: 'What is the default value of an int?', options: ['null', '0', 'undefined', '-1'], correct: 1 },
    ]
};
