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

  const features = [
    {
      category: 'PLANNING',
      title: 'Calculate Grades',
      description: 'Track progress and calculate final exam targets',
      icon: '📊',
      path: '/progress'
    },
    {
      category: 'COMMUNITY',
      title: 'Clubs & Events',
      description: 'Explore interest-based clubs and campus events',
      icon: '🎪',
      path: '/clubs'
    },
    {
      category: 'SUPPORT',
      title: 'Book a Session',
      description: 'Schedule tutoring and mentoring appointments',
      icon: '🤝',
      path: '/mentoring'
    }
  ];

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>PM</div>
            <span className={styles.logoText}>PaceMatch</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{studentName.charAt(0).toUpperCase()}</div>
            <span className={styles.userEmail}>{localStorage.getItem('userEmail')}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* WELCOME SECTION */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <p className={styles.welcomeLabel}>Student Dashboard</p>
            <h1>Welcome back, {studentName}! 👋</h1>
            <p className={styles.welcomeDesc}>
              Your academic success partner. Let's find the optimal course pace for your next semester.
            </p>
          </div>
        </section>

        {/* FEATURES/OPTIONS GRID */}
        <div className={styles.sectionHeader}>
          <h2>Academic Tools</h2>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard} onClick={() => router.push('/placements')}>
            <div className={styles.featureIcon}>📋</div>
            <div className={styles.featureBody}>
              <span className={styles.featureCategory}>Placement</span>
              <h3>My Courses</h3>
              <p>Upload transcript to find your optimal course pace</p>
            </div>
            <div className={styles.featureArrow}>→</div>
          </div>

          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard} onClick={() => router.push(feature.path)}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <div className={styles.featureBody}>
                <span className={styles.featureCategory}>{feature.category}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <div className={styles.featureArrow}>→</div>
            </div>
          ))}
        </div>

        {/* BATCH INFO GRID */}
        <section className={styles.batchInfoSection}>
          <h2>Our Batch Types</h2>
          <div className={styles.batchGrid}>
            <div className={styles.batchInfoCard}>
              <span className={styles.batchBadge} style={{ background: '#0C234B' }}>Fast Track</span>
              <h3>Batch A</h3>
              <span className={styles.batchDuration}>⏱️ 7 Weeks</span>
              <p className={styles.batchDesc}>Intensive pace for students with strong prerequisite mastery.</p>
            </div>
            <div className={styles.batchInfoCard}>
              <span className={styles.batchBadge} style={{ background: '#0C234B' }}>Standard Track</span>
              <h3>Batch B</h3>
              <span className={styles.batchDuration}>⏱️ Full semester</span>
              <p className={styles.batchDesc}>Balanced pace covering all material thoroughly.</p>
            </div>
            <div className={styles.batchInfoCard}>
              <span className={styles.batchBadge} style={{ background: '#0C234B' }}>Supported Track</span>
              <h3>Batch C</h3>
              <span className={styles.batchDuration}>⏱️ Full semester + tutoring</span>
              <p className={styles.batchDesc}>Extended timeline with additional mentoring and support.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBottom}>
          © 2026 PaceMatch. University of Arizona Student Portal.
        </div>
      </footer>
    </div>
  );
}