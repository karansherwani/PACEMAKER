'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/quiz.module.css';
import { QUIZZES, Question } from '../data/quizData';

export default function QuizPage() {
  const router = useRouter();

  // State for flow control
  const [courseInput, setCourseInput] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [prereqName, setPrereqName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Quiz state
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  // Get questions based on selection
  // Note: We might need to map the API returned ID to the quiz keys
  // For now, we'll try to match the ID returned from API
  const currentQuestions: Question[] = selectedCourse ? (QUIZZES[selectedCourse] || []) : [];

  useEffect(() => {
    if (!selectedCourse) return;

    const handleVisibility = () => {
      if (document.hidden) {
        alert('Quiz submitted due to tab switch.');
        submitQuiz([...answers, selected || 0]);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [answers, selected, selectedCourse]);

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseInput.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/get-prereq?course=${encodeURIComponent(courseInput)}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Course not found in our database');
        }
        throw new Error('Failed to fetch course data');
      }

      const data = await res.json();
      // Expecting { course, prerequisite, prereqId }

      // Check if we have quiz data for this prereq
      if (QUIZZES[data.prereqId]) {
        setSelectedCourse(data.prereqId);
        setPrereqName(data.prerequisite);
      } else {
        // Fallback or error if we know the prereq but don't have questions yet
        // For this demo, let's map to 'math355' if not found, or show specific error
        setError(`Prerequisite is ${data.prerequisite}, but we don't have a quiz loaded for it yet. Try 'Math 355' or 'CSC 210'.`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (selected === null) {
      alert('Please select an answer');
      return;
    }

    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (currentQ < currentQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = (finalAnswers: number[]) => {
    const score = finalAnswers.filter(
      (ans, idx) => ans === currentQuestions[idx].correct
    ).length;

    const percentage = (score / currentQuestions.length) * 100;
    let section = 'standard';

    if (percentage >= 85) section = 'fast-track';
    else if (percentage < 70) section = 'supported';

    router.push(`/results?score=${percentage.toFixed(0)}&section=${section}&course=${courseInput.toUpperCase()}`);
  };

  if (!selectedCourse) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Enter Course Code</h3>
          <p>Please enter the course code you are enrolling in (e.g., Math 355).</p>
        </div>

        <form onSubmit={handleCourseSubmit} className={styles.inputContainer}>
          <input
            type="text"
            className={styles.courseInput}
            value={courseInput}
            onChange={(e) => setCourseInput(e.target.value)}
            placeholder="e.g., Math 355"
            disabled={loading}
          />
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Start Quiz'}
          </button>
        </form>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.buttons}>
          <button
            className={styles.btnSecondary}
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentQ + 1) / currentQuestions.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{prereqName || 'Prerequisite'} Quiz</h3>
        <p>{currentQ + 1} of {currentQuestions.length}</p>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={styles.questionContainer}>
        <div className={styles.questionNum}>Question {currentQ + 1} of {currentQuestions.length}</div>
        <div className={styles.questionText}>{currentQuestions[currentQ].q}</div>

        <div className={styles.optionsList}>
          {currentQuestions[currentQ].options.map((opt, idx) => (
            <label key={idx} className={styles.optionItem}>
              <input
                type="radio"
                name="answer"
                value={idx}
                checked={selected === idx}
                onChange={() => setSelected(idx)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.btnSecondary}
          onClick={() => {
            setSelectedCourse(null);
            setCourseInput('');
            setPrereqName(null);
            setError('');
          }}
        >
          Change Course
        </button>
        <button
          className={styles.btnPrimary}
          onClick={handleNext}
        >
          {currentQ === currentQuestions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
