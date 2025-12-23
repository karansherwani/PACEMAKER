// lib/quizEngine.ts

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }
  
  export interface QuizResult {
    score: number;
    percentage: number;
    suggestedSection: 'fast-track' | 'standard' | 'supported';
    confidence: number;
  }
  
  export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
      id: 1,
      question: 'What is the derivative of x³?',
      options: ['x²', '3x²', '3x³', 'x⁴'],
      correct: 1,
      explanation: 'Using power rule: d/dx(x^n) = n*x^(n-1), so d/dx(x³) = 3x²',
    },
    // ... more questions
  ];
  
  // Calculate suggestion based on score
  export function calculatePlacement(score: number): QuizResult {
    const percentage = (score / 10) * 100;
    let suggestedSection: 'fast-track' | 'standard' | 'supported';
    let confidence: number;
  
    if (percentage >= 85) {
      suggestedSection = 'fast-track';
      confidence = 0.95;
    } else if (percentage >= 70) {
      suggestedSection = 'standard';
      confidence = 0.85;
    } else {
      suggestedSection = 'supported';
      confidence = 0.75;
    }
  
    return {
      score,
      percentage,
      suggestedSection,
      confidence,
    };
  }
  
  // Check if student already took quiz
  export async function hasAlreadyTakenQuiz(
    studentId: string,
    courseId: string
  ): Promise<boolean> {
    // API call to check database
    const response = await fetch('/api/quiz/check-attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
  
    const data = await response.json();
    return data.alreadyTaken;
  }
  