'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/placements.module.css';

type Step = 'choose' | 'upload' | 'uaccess' | 'results';

interface CourseGrade {
  course: string;
  grade: string;
  credits: number;
}

export default function PlacementsPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('choose');
  const [grades, setGrades] = useState<CourseGrade[]>([]);
  const [uploading, setUploading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Mock transcript upload
  const handleTranscriptUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setGrades([
        { course: 'MATH 125', grade: 'A', credits: 3 },
        { course: 'MATH 129', grade: 'A-', credits: 3 },
        { course: 'CSC 110', grade: 'B+', credits: 4 },
        { course: 'PHYS 141', grade: 'B', credits: 4 },
      ]);
      setUploading(false);
      setStep('results');
    }, 2000);
  };

  // Mock UAccess connection
  const handleUAccessConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setGrades([
        { course: 'MATH 125', grade: 'A', credits: 3 },
        { course: 'MATH 129', grade: 'A-', credits: 3 },
        { course: 'CSC 110', grade: 'B+', credits: 4 },
        { course: 'PHYS 141', grade: 'B', credits: 4 },
        { course: 'ENGL 101', grade: 'A', credits: 3 },
      ]);
      setConnecting(false);
      setStep('results');
    }, 2500);
  };

  // Calculate recommended track based on GPA
  const calculateRecommendation = () => {
    const gradePoints: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'E': 0.0, 'F': 0.0
    };

    const totalPoints = grades.reduce((sum, g) =>
      sum + (gradePoints[g.grade] || 0) * g.credits, 0);
    const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    if (gpa >= 3.5) return 'fast';
    if (gpa >= 2.5) return 'standard';
    return 'supported';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/dashboard')}>
          ← Back to Dashboard
        </button>
        <div>
          <div className={styles.logo}>📋 Find Your Pace</div>
          <p className={styles.subtitle}>Use your grades to determine the best track</p>
        </div>
      </header>

      <main className={styles.main}>
        {/* Step 1: Choose Method */}
        {step === 'choose' && (
          <div className={styles.chooseSection}>
            <h2>How would you like to provide your grades?</h2>
            <p className={styles.hint}>Choose one of the options below to get a personalized track recommendation</p>

            <div className={styles.optionsGrid}>
              <div className={styles.optionCard} onClick={() => setStep('upload')}>
                <div className={styles.optionIcon}>📄</div>
                <h3>Upload Transcript</h3>
                <p>Upload your unofficial transcript (PDF) and we'll extract your grades automatically</p>
                <span className={styles.optionAction}>Select →</span>
              </div>

              <div className={styles.optionCard} onClick={() => setStep('uaccess')}>
                <div className={styles.optionIcon}>🔗</div>
                <h3>Connect UAccess</h3>
                <p>Securely connect to your UAccess account to import grades and academic info</p>
                <span className={styles.optionAction}>Select →</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2a: Upload Transcript */}
        {step === 'upload' && (
          <div className={styles.uploadSection}>
            <h2>Upload Your Unofficial Transcript</h2>
            <p className={styles.hint}>Upload a PDF of your unofficial transcript from UAccess</p>

            <div className={styles.uploadArea}>
              {uploading ? (
                <div className={styles.uploading}>
                  <div className={styles.spinner}></div>
                  <p>Analyzing transcript...</p>
                </div>
              ) : (
                <>
                  <div className={styles.uploadIcon}>📁</div>
                  <p>Drag and drop your transcript here, or</p>
                  <button className={styles.uploadBtn} onClick={handleTranscriptUpload}>
                    Choose File
                  </button>
                  <p className={styles.formats}>Supports: PDF, JPG, PNG</p>
                </>
              )}
            </div>

            <button className={styles.backLink} onClick={() => setStep('choose')}>
              ← Choose different method
            </button>
          </div>
        )}

        {/* Step 2b: Connect UAccess */}
        {step === 'uaccess' && (
          <div className={styles.uaccessSection}>
            <h2>Connect to UAccess</h2>
            <p className={styles.hint}>Securely import your grades from UAccess</p>

            <div className={styles.uaccessCard}>
              <div className={styles.uaccessLogo}>🔐</div>
              <h3>University of Arizona</h3>
              <p>UAccess Student Portal</p>

              {connecting ? (
                <div className={styles.connecting}>
                  <div className={styles.spinner}></div>
                  <p>Connecting to UAccess...</p>
                </div>
              ) : (
                <>
                  <button className={styles.connectBtn} onClick={handleUAccessConnect}>
                    Connect with NetID
                  </button>
                  <p className={styles.securityNote}>
                    🔒 Secure connection - we never store your password
                  </p>
                </>
              )}
            </div>

            <button className={styles.backLink} onClick={() => setStep('choose')}>
              ← Choose different method
            </button>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 'results' && (
          <div className={styles.resultsSection}>
            <h2>Your Academic Summary</h2>

            <div className={styles.gradesCard}>
              <h3>Imported Grades</h3>
              <table className={styles.gradesTable}>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Grade</th>
                    <th>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, i) => (
                    <tr key={i}>
                      <td>{g.course}</td>
                      <td className={styles.gradeCell}>{g.grade}</td>
                      <td>{g.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.recommendationCard}>
              <h3>Recommended Track</h3>
              {calculateRecommendation() === 'fast' && (
                <div className={styles.trackBadge} style={{ background: '#22c55e' }}>
                  ⚡ Fast Track (7 weeks)
                </div>
              )}
              {calculateRecommendation() === 'standard' && (
                <div className={styles.trackBadge} style={{ background: '#3b82f6' }}>
                  📚 Standard Track (10-12 weeks)
                </div>
              )}
              {calculateRecommendation() === 'supported' && (
                <div className={styles.trackBadge} style={{ background: '#f97316' }}>
                  🎯 Supported Track (Full Semester)
                </div>
              )}
              <p>Based on your prerequisite grades, we recommend this track for optimal success.</p>
            </div>

            <div className={styles.actions}>
              <button className={styles.enrollBtn} onClick={() => alert('✅ Enrolled successfully!')}>
                Enroll in Recommended Track
              </button>
              <button className={styles.backLink} onClick={() => setStep('choose')}>
                Try Different Method
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
