'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../styles/results.module.css';

const SECTIONS = {
  'fast-track': {
    name: 'Fast Track ⚡',
    duration: '7 Weeks',
    meetings: 'MWF 8:00-9:30 AM',
    professor: 'Dr. Sarah Chen',
  },
  standard: {
    name: 'Standard Track 📚',
    duration: '10-12 Weeks',
    meetings: 'MWF 1:00-2:30 PM',
    professor: 'Prof. John Smith',
  },
  supported: {
    name: 'Supported Track 🎯',
    duration: 'Full Semester',
    meetings: 'MWF 3:00-4:30 PM + Tutoring',
    professor: 'Dr. Maria Garcia',
  },
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const score = searchParams.get('score') || '0';
  const recommended = searchParams.get('section') || 'standard';
  const [selected, setSelected] = useState(recommended);

  const handleEnroll = () => {
    alert(`✅ Enrolled in ${SECTIONS[selected as keyof typeof SECTIONS].name}!`);
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quiz Complete! ✓</h2>
        <p>Your Score: <strong>{score}%</strong></p>
      </div>

      <h3 className={styles.selectTitle}>Choose Your Section:</h3>

      <div className={styles.sectionGrid}>
        {Object.entries(SECTIONS).map(([key, sec]) => (
          <div
            key={key}
            className={`${styles.sectionCard} ${
              selected === key ? styles.selected : ''
            } ${key === recommended ? styles.recommended : ''}`}
            onClick={() => setSelected(key)}
          >
            {key === recommended && <span className={styles.badge}>Recommended</span>}
            <h4>{sec.name}</h4>
            <div className={styles.detail}>
              <strong>Duration:</strong> {sec.duration}
            </div>
            <div className={styles.detail}>
              <strong>Times:</strong> {sec.meetings}
            </div>
            <div className={styles.detail}>
              <strong>Professor:</strong> {sec.professor}
            </div>
          </div>
        ))}
      </div>

      <button 
        className={styles.enrollBtn}
        onClick={handleEnroll}
      >
        Enroll in Selected Section
      </button>

      <button 
        className={styles.backBtn}
        onClick={() => router.push('/dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
