'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (!name) {
      router.push('/');
      return;
    }
    // Clean up name if it starts with "Student " (legacy format)
    const cleanName = name.startsWith('Student ') ? name.replace('Student ', '') : name;
    setStudentName(cleanName);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.logo}>🎓 PaceMatch</div>
          <p className={styles.subtitle}>Smart Course Pacing</p>
        </div>
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>{studentName.charAt(0).toUpperCase()}</div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <h1>Welcome back, {studentName}! 👋</h1>
          <p>Let's find the right course pace for you</p>
        </div>

        <div className={styles.optionsGrid}>
          <div className={styles.optionCard}>
            <div className={styles.optionIcon}>📋</div>
            <h3>Use My Grades</h3>
            <p>Upload transcript or connect UAccess to find your optimal pace</p>
            <button className={styles.actionBtn} onClick={() => router.push('/placements')}>
              Find My Pace
            </button>
          </div>

          <div className={styles.optionCard}>
            <div className={styles.optionIcon}>✏️</div>
            <h3>Take Assessment Quiz</h3>
            <p>Complete our diagnostic quiz to determine your ideal pace</p>
            <button className={styles.actionBtn} onClick={() => router.push('/quiz')}>
              Begin Quiz
            </button>
          </div>

          <div className={styles.optionCard}>
            <div className={styles.optionIcon}>📊</div>
            <h3>Calculate Grades</h3>
            <p>Track your courses and calculate final exam scores needed</p>
            <button className={styles.actionBtn} onClick={() => router.push('/progress')}>
              Grade Calculator
            </button>
          </div>

          <div className={styles.optionCard}>
            <div className={styles.optionIcon}>🎪</div>
            <h3>Clubs & Events</h3>
            <p>Discover clubs and events based on your interests</p>
            <button className={styles.actionBtn} onClick={() => router.push('/clubs')}>
              Explore
            </button>
          </div>
        </div>

        {/* Available Batches Section */}
        <div className={styles.batchSection}>
          <h2 className={styles.batchTitle}>Available Course Tracks</h2>
          <p className={styles.batchSubtitle}>Choose the pace that fits your learning style</p>

          <div className={styles.batchGrid}>
            <div className={styles.batchCard}>
              <div className={styles.batchIcon}>⚡</div>
              <h3>Fast Track</h3>
              <div className={styles.batchDetails}>
                <p><strong>Duration:</strong> 7 Weeks</p>
                <p><strong>Best for:</strong> Strong prerequisites</p>
              </div>
              <p className={styles.batchDesc}>Accelerated learning for students ready to move fast</p>
            </div>

            <div className={styles.batchCard}>
              <div className={styles.batchIcon}>📚</div>
              <h3>Standard Track</h3>
              <div className={styles.batchDetails}>
                <p><strong>Duration:</strong> 14 Weeks</p>
                <p><strong>Best for:</strong> Most students</p>
              </div>
              <p className={styles.batchDesc}>Balanced pace for comfortable learning</p>
            </div>

            <div className={styles.batchCard}>
              <div className={styles.batchIcon}>🎯</div>
              <h3>Supported Track</h3>
              <div className={styles.batchDetails}>
                <p><strong>Duration:</strong> Full Semester</p>
                <p><strong>Best for:</strong> Extra support needed</p>
              </div>
              <p className={styles.batchDesc}>Includes tutoring and additional resources</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
