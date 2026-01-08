'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/quiz.module.css';
import { getBatchRecommendation } from '@/app/lib/courseData';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hash: string;
}

interface QuizData {
  courseNumber: string;
  courseName: string;
  questions: QuizQuestion[];
  generationSeed: string;
}

interface PreviousAttempt {
  score: number;
  total: number;
  percentage: number;
  attemptDate: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [courseNumber, setCourseNumber] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [error, setError] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [previousAttempt, setPreviousAttempt] = useState<PreviousAttempt | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [preReqCourse, setPreReqCourse] = useState<{ courseNumber: string; courseName: string } | null>(null);
  const tabSwitchRef = useRef(false);

  // Get user email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedEmail) {
      router.push('/auth');
      return;
    }
    setUserEmail(storedEmail);
  }, [router]);

  // State for course data loaded from CSV
  const [courseCatalog, setCourseCatalog] = useState<Record<string, { name: string; credits: number; prereqs: string[] }>>({});

  // Load CSV and check for selected course
  useEffect(() => {
    const loadData = async () => {
      // 1. Load CSV
      try {
        const response = await fetch('/data/uofa_courses.csv');
        const text = await response.text();
        const rows = text.split('\n').slice(1);
        const catalog: Record<string, { name: string; credits: number; prereqs: string[] }> = {};

        rows.forEach(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if (cols.length >= 7) {
            const code = cols[0].trim();
            if (code) {
              const prereqs = [];
              if (cols[6] && cols[6].trim() !== 'None') prereqs.push(cols[6].trim());
              if (cols[7] && cols[7].trim() !== 'None') prereqs.push(cols[7].trim());

              catalog[code] = {
                name: cols[1].trim(),
                credits: parseFloat(cols[4]) || 3,
                prereqs: prereqs
              };
            }
          }
        });
        setCourseCatalog(catalog);

        // 2. Check for passed course
        const upgradeFor = localStorage.getItem('upgradeFor');
        if (upgradeFor) {
          const { courseCode } = JSON.parse(upgradeFor);
          setCourseNumber(courseCode);

          // Look up prereq in our new catalog
          const courseInfo = catalog[courseCode];
          if (courseInfo && courseInfo.prereqs.length > 0) {
            // For now, take the first prerequisite as the target quiz topic
            // In a clear mapping like MATH 122A -> MATH 113, this works.
            // We might need to fetch the Name of the prereq course too.
            const preReqCode = courseInfo.prereqs[0];
            const preReqName = catalog[preReqCode]?.name || 'Prerequisite Course';

            setPreReqCourse({
              courseNumber: preReqCode,
              courseName: preReqName
            });
            setQuizPhase('instructions');
          } else {
            setError(`No prerequisite assessment found for ${courseCode}`);
          }
          // Clear it so it doesn't persist forever? Maybe keep it for refresh safety.
        } else {
          // Redirect or show error if strictly no selection allowed
          // For now, we'll let it stay on "selection" but maybe show a message
          // or we can redirect to /placements
        }
      } catch (err) {
        console.error('Failed to load course data', err);
      }
    };

    loadData();
  }, [router]);

  // Handle course number change (Legacy/Fallback)
  const handleCourseNumberChange = (value: string) => {
    setCourseNumber(value.toUpperCase());
    const courseInfo = courseCatalog[value.toUpperCase()];
    if (courseInfo && courseInfo.prereqs.length > 0) {
      const preReqCode = courseInfo.prereqs[0];
      setPreReqCourse({
        courseNumber: preReqCode,
        courseName: courseCatalog[preReqCode]?.name || 'Prerequisite Course'
      });
    } else {
      setPreReqCourse(null);
    }
  };

  // Wrap handleSubmit in useCallback
  const handleSubmit = useCallback(async () => {
    if (!quizData || !userEmail) return;

    setSubmitting(true);

    try {
      const score = selectedAnswers.filter(
        (answer, idx) => answer === quizData!.questions[idx].correct
      ).length;

      const percentage = Math.round((score / quizData.questions.length) * 100);
      const batch = getBatchRecommendation(percentage);
      const questionHashes = quizData.questions.map(q => q.hash);

      // Submit to backend
      const response = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail,
        },
        body: JSON.stringify({
          courseNumber: quizData.courseNumber,
          courseName: quizData.courseName,
          score,
          total: quizData.questions.length,
          questionsUsed: questionHashes,
          tabSwitchDetected: tabSwitchRef.current,
        }),
      });

      const submitData = await response.json();

      if (!response.ok) {
        throw new Error(submitData.error);
      }

      if (tabSwitchRef.current) {
        console.warn('Tab switch detected! Quiz automatically submitted.');
      }

      // Store results with batch recommendation
      localStorage.setItem('quizResults', JSON.stringify({
        courseNumber: quizData.courseNumber,
        courseName: quizData.courseName,
        score,
        total: quizData.questions.length,
        percentage,
        batch: batch.name,
        batchDescription: batch.description,
        timestamp: new Date().toISOString(),
      }));

      // Redirect to results
      router.push(`/results?score=${score}&total=${quizData.questions.length}&percentage=${percentage}&batch=${batch.name}`);
    } catch (err) {
      setError((err as Error).message);
      console.error('Submit error:', err);
      setSubmitting(false);
    }
  }, [quizData, userEmail, selectedAnswers, router]);

  // Handle tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && quizStarted && quizData) {
        tabSwitchRef.current = true;
        handleSubmit();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [quizStarted, quizData, handleSubmit]);

  const [quizPhase, setQuizPhase] = useState<'selection' | 'instructions' | 'quiz'>('selection');

  // ... (keeping existing refs and state) ...

  // Update handleGenerateQuiz to just set loading and call API, then switch to quiz phase
  // But wait, handleGenerateQuiz currently does everything.
  // We need to split "Proceed to Instructions" and "Actually Start Quiz".

  const handleProceedToInstructions = () => {
    if (courseNumber && preReqCourse) {
      setQuizPhase('instructions');
    }
  };

  const handleStartQuiz = async () => {
    // Logic from handleGenerateQuiz
    if (!courseNumber || !preReqCourse || !userEmail) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail,
        },
        body: JSON.stringify({
          courseNumber: preReqCourse.courseNumber,
          courseName: preReqCourse.courseName,
          difficulty,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setPreviousAttempt({
            score: data.previousScore,
            total: data.totalQuestions,
            percentage: data.percentage,
            attemptDate: new Date(data.attemptDate).toLocaleDateString(),
          });
          setError('');
          setQuizPhase('selection');
          return;
        }
        throw new Error(data.error || 'Failed to generate quiz');
      }

      setQuizData(data);
      setSelectedAnswers(new Array(data.questions.length).fill(null));
      setCurrentQuestion(0);
      setShowExplanation(false);
      setQuizPhase('quiz');
      setQuizStarted(true); // Keep for compatibility if needed, but phase is better
      setPreviousAttempt(null);
      setError('');
    } catch (err) {
      const errorMsg = (err as Error).message;
      setError(errorMsg);
      console.error('Quiz generation error:', errorMsg);
    } finally {
      setLoading(false);
    }
  };




  const handleSelectAnswer = (optionIndex: number) => {
    if (showExplanation) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      handleSubmit();
    }
  };


  // Shared Header Component
  const QuizHeader = () => (
    <>
      <header className={styles.topHeader}>
        <div className={styles.headerLogo}>
          <div className={styles.logoMark}>PM</div>
          <span className={styles.logoText}>PaceMatch</span>
        </div>
        <nav className={styles.headerNav}>
          <a href="/dashboard">Dashboard</a>
          <a href="/placements">My Courses</a>
          <a href="/progress">Calculate Grades</a>
        </nav>
        <button className={styles.headerCta} onClick={() => router.push('/dashboard')}>
          ← Back
        </button>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Prerequisite Knowledge Assessment</h1>
          <p className={styles.heroSubtext}>
            Verify your readiness for upcoming courses and unlock accelerated placement options.
          </p>
        </div>
      </section>
    </>
  );

  if (!userEmail) {
    return (
      <div className={styles.container}>
        <QuizHeader />
        <main className={styles.main}>
          <div className={styles.quizForm}>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (quizPhase === 'selection') {
    return (
      <div className={styles.container}>
        <QuizHeader />
        <main className={styles.main}>
          <div className={styles.quizForm}>
            {/* Removed the header h1 here since we have a hero now */}
            <p className={styles.subtitle}>Select your upcoming course to see assessment options</p>
            <p className={styles.userInfo}>👤 {userEmail}</p>

            {previousAttempt && (
              <div className={styles.previousAttempt}>
                <h3>✅ Already Completed</h3>
                <p>
                  <strong>Score:</strong> {previousAttempt.score}/{previousAttempt.total} ({previousAttempt.percentage}%)
                </p>
                <p>
                  <strong>Date:</strong> {previousAttempt.attemptDate}
                </p>
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Select Your Upcoming Course *</label>
              <select
                value={courseNumber}
                onChange={(e) => handleCourseNumberChange(e.target.value)}
                disabled={loading || !!previousAttempt}
                required
              >
                <option value="">-- Select a Course --</option>
                {Object.entries(courseCatalog).map(([code, details]) => (
                  <option key={code} value={code}>
                    {code} - {details.name}
                  </option>
                ))}
              </select>
            </div>

            {preReqCourse && !previousAttempt && (
              <div className={styles.suggestionBox}>
                <h3>Recommended Assessment Available</h3>
                <p>Based on your selection of <strong>{courseNumber}</strong>, we recommend taking the prerequisite assessment for <strong>{preReqCourse.courseNumber}</strong>.</p>

                <div className={styles.formGroup}>
                  <label>Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    disabled={loading}
                  >
                    <option value="easy">Easy - Foundational concepts</option>
                    <option value="medium">Medium - Standard understanding</option>
                    <option value="hard">Hard - Deep mastery</option>
                  </select>
                </div>

                <button
                  className={styles.generateBtn}
                  onClick={handleProceedToInstructions}
                >
                  Take Quiz
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Phase 2: Instructions
  if (quizPhase === 'instructions') {
    return (
      <div className={styles.container}>
        <QuizHeader />
        <main className={styles.main}>
          <div className={styles.quizForm}> {/* Reuse container style */}
            <h1>âš ï¸ Academic Integrity & Instructions</h1>

            <div className={styles.instructionCard}>
              <h3>Assessment Details</h3>
              <p><strong>Topic:</strong> {preReqCourse?.courseNumber} - {preReqCourse?.courseName}</p>
              <p><strong>Questions:</strong> 10 Questions</p>
              <p><strong>Duration:</strong> ~10-15 Minutes</p>
              <p><strong>Difficulty:</strong> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
            </div>

            <div className={styles.integrityNotice}>
              <h3> Academic Integrity Notice</h3>
              <p>
                Switching tabs during the quiz will <strong>automatically submit your answers</strong>.
                Please ensure you have all materials ready before starting.
                You have only <strong>ONE</strong> attempt for this assessment.
              </p>
            </div>

            <div className={styles.actions} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className={styles.secondaryBtn}
                onClick={() => setQuizPhase('selection')}
              >
                Cancel
              </button>
              <button
                className={styles.generateBtn}
                onClick={handleStartQuiz}
                disabled={loading}
              >
                {loading ? 'â³ Generating...' : 'ðŸš€ Start Assessment'}
              </button>
            </div>


            {error && <div className={styles.error}>{error}</div>}
          </div>
        </main>
      </div>
    );
  }

  // Phase 3: Quiz (Existing Logic)
  if (!quizData) return null;

  const currentQ = quizData.questions[currentQuestion];
  const answered = selectedAnswers[currentQuestion] !== null;
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className={styles.container}>
      <QuizHeader />
      <main className={styles.main}>
        {/* Existing Quiz JSX */}
        <div className={styles.quizHeader}>
          <div className={styles.courseInfo}>
            <h2>{quizData.courseNumber}</h2>
            <p>{quizData.courseName}</p>
            <p>Question {currentQuestion + 1} of {quizData.questions.length}</p>
            <p className={styles.userInfo}>👤 {userEmail}</p>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={styles.questionCard}>
          <h3>{currentQ.question}</h3>

          <div className={styles.options}>
            {currentQ.options.map((option, idx) => (
              <label
                key={idx}
                className={`${styles.option} ${selectedAnswers[currentQuestion] === idx ? styles.selected : ''
                  } ${showExplanation && idx === currentQ.correct ? styles.correct : ''} ${showExplanation &&
                    idx !== currentQ.correct &&
                    selectedAnswers[currentQuestion] === idx
                    ? styles.incorrect
                    : ''
                  }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={idx}
                  checked={selectedAnswers[currentQuestion] === idx}
                  onChange={() => handleSelectAnswer(idx)}
                  disabled={showExplanation}
                />
                <span className={styles.optionText}>{option}</span>
                {showExplanation && idx === currentQ.correct && (
                  <span className={styles.badge}>✓ Correct</span>
                )}
                {showExplanation &&
                  idx !== currentQ.correct &&
                  selectedAnswers[currentQuestion] === idx && (
                    <span className={styles.badge}>✗ Incorrect</span>
                  )}
              </label>
            ))}
          </div>

          {showExplanation && (
            <div className={styles.explanation}>
              <h4>💡 Explanation</h4>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          <div className={styles.actions}>
            {!showExplanation && answered && (
              <button onClick={handleShowExplanation} className={styles.explainBtn}>
                Show Explanation
              </button>
            )}

            {showExplanation && (
              <button
                onClick={handleNextQuestion}
                disabled={submitting}
                className={styles.nextBtn}
              >
                {submitting
                  ? '⏳ Submitting...'
                  : currentQuestion === quizData.questions.length - 1
                    ? '✓ Submit & Get Recommendation'
                    : 'Next Question →'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.warning}>
          ⚠️ Switching tabs will auto-submit your quiz
        </div>
      </main>
    </div>
  );
}