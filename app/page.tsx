'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles/landing.module.css';

export default function LandingPage() {
  const router = useRouter();
  const [showUniSelect, setShowUniSelect] = useState(false);

  const universities = [
    { id: 'uofa', name: 'University of Arizona', logo: '🐻', color: '#C41E3A' },
    { id: 'asu', name: 'Arizona State University', logo: '🦀', color: '#8B0000' },
    { id: 'uofc', name: 'University of Colorado Boulder', logo: '⛰️', color: '#CFB53B' },
    { id: 'ucsd', name: 'UC San Diego', logo: '⚓', color: '#0066CC' },
    { id: 'stanford', name: 'Stanford University', logo: '🌲', color: '#B1040E' },
    { id: 'mit', name: 'MIT', logo: '🔬', color: '#A6192E' },
    { id: 'harvard', name: 'Harvard University', logo: '📚', color: '#CE1126' },
    { id: 'berkeley', name: 'UC Berkeley', logo: '🐻', color: '#003262' },
  ];

  const handleUniversitySelect = (uniId: string) => {
    localStorage.setItem('selectedUniversity', uniId);
    router.push('/auth');
  };

  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logo}>🎓 PaceMatch</div>
          <h1>Find Your Perfect Course Pace</h1>
          <p>Adaptive learning paths based on your grades and learning speed</p>
          <button
            className={styles.ctaButton}
            onClick={() => setShowUniSelect(true)}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className={styles.features}>
        <h2>How It Works</h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Analyze Prerequisites</h3>
            <p>We review your prerequisite grades to understand your foundation</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧠</div>
            <h3>Adaptive Learning</h3>
            <p>Get personalized course pacing based on your learning speed</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📋</div>
            <h3>Course Batches</h3>
            <p>Choose from Fast Track (7 weeks), Standard (10-12 weeks), or Supported (full semester)</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✅</div>
            <h3>Real-time Progress</h3>
            <p>Track your progress with detailed analytics and insights</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={styles.whyUs}>
        <h2>Why Choose PaceMatch?</h2>
        <div className={styles.reasonsList}>
          <div className={styles.reason}>
            <span className={styles.checkmark}>✓</span>
            <p>Integrated with your university's system (UAccess)</p>
          </div>
          <div className={styles.reason}>
            <span className={styles.checkmark}>✓</span>
            <p>Personalized learning paths for your major</p>
          </div>
          <div className={styles.reason}>
            <span className={styles.checkmark}>✓</span>
            <p>Real-time feedback and progress tracking</p>
          </div>
          <div className={styles.reason}>
            <span className={styles.checkmark}>✓</span>
            <p>Flexible course pacing to fit your schedule</p>
          </div>
        </div>
      </section>

      {/* UNIVERSITY SELECTION MODAL */}
      {showUniSelect && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowUniSelect(false)}
            >
              ✕
            </button>

            <h2>Select Your University</h2>
            <p>Choose your institution to get started</p>

            <div className={styles.universityGrid}>
              {universities.map((uni) => (
                <button
                  key={uni.id}
                  className={styles.universityCard}
                  onClick={() => handleUniversitySelect(uni.id)}
                  style={{ borderColor: uni.color }}
                >
                  <div className={styles.uniLogo}>{uni.logo}</div>
                  <div className={styles.uniName}>{uni.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}