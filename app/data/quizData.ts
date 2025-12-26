import { csc110 } from './quizzes/csc110';
import { math122b } from './quizzes/math122b';
import { ece175 } from './quizzes/ece175';
import { chem151 } from './quizzes/chem151';

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
        id: 'csc210',
        name: 'CSC 210',
        prerequisite: 'CSC 110 - Intro to Programming',
        description: 'Software Development'
    },
    {
        id: 'math129',
        name: 'Math 129',
        prerequisite: 'Math 122B - Calculus I',
        description: 'Integral Calculus'
    },
    {
        id: 'ece275',
        name: 'ECE 275',
        prerequisite: 'ECE 175 - Programming II',
        description: 'Computer Programming II'
    },
    {
        id: 'chem152',
        name: 'CHEM 152',
        prerequisite: 'CHEM 151 - General Chemistry I',
        description: 'Chemical Principles II'
    },
    // Keeping existing ones if needed, but Math 355 was in previous file
    {
        id: 'math355',
        name: 'Math 355',
        prerequisite: 'Math 223 - Vector Calculus',
        description: 'Analysis and Linear Algebra'
    }
];

export const QUIZZES: Record<string, Question[]> = {
    'csc110': csc110,
    'math122b': math122b,
    'ece175': ece175,
    'chem151': chem151,
    'math223': [
        { q: 'What is the gradient of f(x,y) = x² + y²?', options: ['(2x, 2y)', '(x, y)', '2x + 2y', 'Depends on z'], correct: 0 },
        { q: 'Evaluate: ∫∫ (x+y) dx dy over [0,1]x[0,1]', options: ['1', '0.5', '2', '0'], correct: 0 },
        { q: 'What is the dot product of (1, 2) and (3, 4)?', options: ['7', '11', '5', '10'], correct: 1 },
        { q: 'Find the curl of F = (y, -x, 0)', options: ['(0, 0, -2)', '(0, 0, 2)', '(1, 1, 1)', '0'], correct: 0 },
        { q: 'Which theorem relates line integrals to surface integrals?', options: ['Green\'s Theorem', 'Stokes\' Theorem', 'Divergence Theorem', 'Fundamental Theorem of Calculus'], correct: 1 },
    ]
};
