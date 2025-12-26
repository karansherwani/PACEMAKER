import { Question } from '../quizData';

export const math122b: Question[] = [
    { q: 'What is the derivative of sin(x)?', options: ['cos(x)', '-cos(x)', 'tan(x)', 'sec(x)'], correct: 0 },
    { q: 'Evaluate: lim(x->0) sin(x)/x', options: ['0', '1', 'infinity', 'undefined'], correct: 1 },
    { q: 'What is the integral of 1/x?', options: ['ln|x| + C', 'x^2/2 + C', '1/x^2 + C', 'e^x + C'], correct: 0 },
    { q: 'What rule handles the derivative of a composition of functions?', options: ['Product Rule', 'Chain Rule', 'Quotient Rule', 'Power Rule'], correct: 1 },
    { q: 'Find the derivative of x^3', options: ['3x^2', 'x^2', '3x', 'x^3/3'], correct: 0 },
];
