'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import styles from '../styles/placements.module.css';
import { getCourses, Course, getPrerequisites } from '../lib/courseData';
import { getRecommendedBatch, PrerequisiteInfo } from '../lib/batchLogic';

type Step = 'choose' | 'upload' | 'uaccess' | 'results';

interface CourseGrade {
  course: string;
  description: string;
  grade: string;
  credits: number;
  term: string;
}

export default function PlacementsPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('choose');
  const [grades, setGrades] = useState<CourseGrade[]>([]);
  const [uploading, setUploading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Plan Next Semester state
  const [searchQuery, setSearchQuery] = useState('');
  const [plannedCourses, setPlannedCourses] = useState<Course[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get all courses for search
  const allCourses = useMemo(() => getCourses(), []);

  // Filter courses based on search query
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return allCourses.filter(c =>
      c.courseCode.toLowerCase().includes(query) ||
      c.courseName.toLowerCase().includes(query) ||
      c.department.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to 10 results
  }, [searchQuery, allCourses]);

  // Check if a prerequisite is met based on transcript grades
  const checkPrerequisite = (prereqCode: string): { met: boolean; grade: string } => {
    // Normalize course code for comparison
    const normalizedCode = prereqCode.toUpperCase().replace(/\s+/g, ' ').trim();

    // Find the course in the transcript
    const transcriptCourse = grades.find(g => {
      const gradeCode = g.course.toUpperCase().replace(/\s+/g, ' ').trim();
      return gradeCode === normalizedCode;
    });

    if (!transcriptCourse) {
      return { met: false, grade: 'N/A' };
    }

    // Check if grade is passing (not E, F, or IP)
    const passingGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'P', 'S'];
    const isPassing = passingGrades.includes(transcriptCourse.grade);

    return { met: isPassing, grade: transcriptCourse.grade };
  };

  // Get prerequisite info for a course
  const getPrereqInfo = (course: Course): PrerequisiteInfo[] => {
    const prereqs = getPrerequisites(course.courseCode);
    return prereqs.map(p => {
      const { met, grade } = checkPrerequisite(p.courseCode);
      return {
        code: p.courseCode,
        name: p.courseName,
        grade,
        met
      };
    });
  };

  // Add a course to planned list
  const addPlannedCourse = (course: Course) => {
    if (!plannedCourses.find(c => c.courseCode === course.courseCode)) {
      setPlannedCourses([...plannedCourses, course]);
    }
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Remove a course from planned list
  const removePlannedCourse = (courseCode: string) => {
    setPlannedCourses(plannedCourses.filter(c => c.courseCode !== courseCode));
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle transcript upload via API
  const handleTranscriptUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadError(null);

    // Simulate upload delay
    setTimeout(() => {
      // HARDCODED TRANSCRIPT DATA
      // This is the complete academic history matching the UI design
      const dummyGrades: CourseGrade[] = [
        // Fall 2023
        { course: 'AREC 150C3', description: 'Global Economy of Food', grade: 'A', credits: 3, term: 'Fall 2023' },
        { course: 'CSC 110', description: 'Computer Programming I', grade: 'B', credits: 4, term: 'Fall 2023' },
        { course: 'ENGL 106', description: 'Fnd Wrt Engl Additional Lang', grade: 'A', credits: 3, term: 'Fall 2023' },
        { course: 'MATH 125', description: 'Calculus I', grade: 'A', credits: 3, term: 'Fall 2023' },
        { course: 'PFFP 150B2', description: 'Personal Finance Foundations', grade: 'A', credits: 3, term: 'Fall 2023' },
        { course: 'UNIV 101', description: 'Intro to General Ed Experience', grade: 'A', credits: 1, term: 'Fall 2023' },
        // Spring 2024
        { course: 'ACCT 200', description: 'Intro to Financial Acct', grade: 'A', credits: 3, term: 'Spring 2024' },
        { course: 'CSC 120', description: 'Intro to Computer Prog II', grade: 'B', credits: 4, term: 'Spring 2024' },
        { course: 'CSC 144', description: 'Discrete Math for Comp Sci I', grade: 'B', credits: 3, term: 'Spring 2024' },
        { course: 'ECON 200', description: 'Basic Economic Issues', grade: 'A', credits: 3, term: 'Spring 2024' },
        { course: 'ENGL 107', description: 'Fnd Wrt Engl Additional Lang', grade: 'A', credits: 3, term: 'Spring 2024' },
        { course: 'MATH 129', description: 'Calculus II', grade: 'A', credits: 3, term: 'Spring 2024' },
        // Fall 2024
        { course: 'CSC 210', description: 'Software Development', grade: 'E', credits: 4, term: 'Fall 2024' },
        { course: 'CSC 244', description: 'Discrete Math for Comp Sci II', grade: 'A', credits: 3, term: 'Fall 2024' },
        { course: 'ENGL 108', description: 'Fnd Wrt Engl Additional Lang', grade: 'A', credits: 3, term: 'Fall 2024' },
        { course: 'ENVS 210', description: 'Environmental Essentials', grade: 'A', credits: 3, term: 'Fall 2024' },
        { course: 'MATH 313', description: 'Intro to Linear Algebra', grade: 'A', credits: 3, term: 'Fall 2024' },
        // Spring 2025
        { course: 'CHEM 151', description: 'General Chemistry I', grade: 'A', credits: 4, term: 'Spring 2025' },
        { course: 'DATA 363', description: 'Intro to Statistical Methods', grade: 'B', credits: 3, term: 'Spring 2025' },
        { course: 'DNC 101', description: 'Dance Appreciation', grade: 'A', credits: 3, term: 'Spring 2025' },
        { course: 'EAS 160A1', description: 'The World of Buddhism', grade: 'A', credits: 3, term: 'Spring 2025' },
        { course: 'ISTA 322', description: 'Data Engineering', grade: 'B', credits: 3, term: 'Spring 2025' },
        { course: 'MATH 223', description: 'Vector Calculus', grade: 'B', credits: 4, term: 'Spring 2025' },
        // Fall 2025 (Current)
        { course: 'CSC 337', description: 'Web Programming', grade: 'A', credits: 3, term: 'Fall 2025' },
        { course: 'DATA 201', description: 'Foundations of Data Science', grade: 'C', credits: 3, term: 'Fall 2025' },
        { course: 'DATA 375', description: 'Intro to Statistcal Computing', grade: 'A', credits: 3, term: 'Fall 2025' },
        { course: 'MATH 464', description: 'Theory of Probability', grade: 'A', credits: 3, term: 'Fall 2025' },
        { course: 'MATH 323', description: 'Formal Math Reasoning', grade: 'B', credits: 3, term: 'Fall 2025' },
        { course: 'MATH 355', description: 'Analysis of Ordinary Differential Equations', grade: 'A', credits: 3, term: 'Fall 2025' },
        { course: 'univ 301', description: 'General Education Portfolio', grade: 'A', credits: 1, term: 'Fall 2025' },
      ];

      setGrades(dummyGrades);
      setUploading(false);
      setStep('results');
    }, 1500);

    /* 
    // REAL API IMPLEMENTATION (Commented out for testing)
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Get userId from localStorage if available
      const userId = localStorage.getItem('userId') || 'demo-user';
      formData.append('userId', userId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Transform API response to grades format
      const courseGrades: CourseGrade[] = data.courses?.map((c: { course: string; grade: string; credits: number }) => ({
        course: c.course,
        grade: c.grade,
        credits: c.credits || 3,
      })) || [];

      setGrades(courseGrades);
      setStep('results');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError((error as Error).message || 'Failed to upload transcript');
    } finally {
      setUploading(false);
    }
    */
  };

  // Mock UAccess connection
  const handleUAccessConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setGrades([
        // Fall 2023
        { course: 'AREC 150C3', description: 'Global Economy of Food', grade: 'A', credits: 3, term: 'Fall 2023' },
        { course: 'CSC 110', description: 'Computer Programming I', grade: 'B', credits: 4, term: 'Fall 2023' },
        { course: 'ENGL 106', description: 'Fnd Wrt Engl Additional Lang', grade: 'A', credits: 3, term: 'Fall 2023' },
        { course: 'MATH 125', description: 'Calculus I', grade: 'A', credits: 3, term: 'Fall 2023' },
        { course: 'PFFP 150B2', description: 'Personal Finance Foundations', grade: 'A', credits: 3, term: 'Fall 2023' },
        { course: 'UNIV 101', description: 'Intro to General Ed Experience', grade: 'A', credits: 1, term: 'Fall 2023' },
        { course: 'GAME 251', description: 'Intro to Game Design', grade: 'W', credits: 3, term: 'Fall 2023' },
        // Spring 2024
        { course: 'ACCT 200', description: 'Intro to Financial Acct', grade: 'A', credits: 3, term: 'Spring 2024' },
        { course: 'CSC 120', description: 'Intro to Computer Prog II', grade: 'B', credits: 4, term: 'Spring 2024' },
        { course: 'CSC 144', description: 'Discrete Math for Comp Sci I', grade: 'B', credits: 3, term: 'Spring 2024' },
        { course: 'ECON 200', description: 'Basic Economic Issues', grade: 'A', credits: 3, term: 'Spring 2024' },
        { course: 'ENGL 107', description: 'Fnd Wrt Engl Additional Lang', grade: 'A', credits: 3, term: 'Spring 2024' },
        { course: 'MATH 129', description: 'Calculus II', grade: 'A', credits: 3, term: 'Spring 2024' },
        // Fall 2024
        { course: 'CSC 210', description: 'Software Development', grade: 'E', credits: 4, term: 'Fall 2024' },
        { course: 'CSC 244', description: 'Discrete Math for Comp Sci II', grade: 'A', credits: 3, term: 'Fall 2024' },
        { course: 'ENGL 108', description: 'Fnd Wrt Engl Additional Lang', grade: 'A', credits: 3, term: 'Fall 2024' },
        { course: 'ENVS 210', description: 'Environmental Essentials', grade: 'A', credits: 3, term: 'Fall 2024' },
        { course: 'MATH 313', description: 'Intro to Linear Algebra', grade: 'A', credits: 3, term: 'Fall 2024' },
        // Spring 2025
        { course: 'CHEM 151', description: 'General Chemistry I', grade: 'A', credits: 4, term: 'Spring 2025' },
        { course: 'DATA 363', description: 'Intro to Statistical Methods', grade: 'B', credits: 3, term: 'Spring 2025' },
        { course: 'DNC 101', description: 'Dance Appreciation', grade: 'A', credits: 3, term: 'Spring 2025' },
        { course: 'EAS 160A1', description: 'The World of Buddhism', grade: 'A', credits: 3, term: 'Spring 2025' },
        { course: 'ISTA 322', description: 'Data Engineering', grade: 'B', credits: 3, term: 'Spring 2025' },
        { course: 'MATH 223', description: 'Vector Calculus', grade: 'B', credits: 4, term: 'Spring 2025' },
        // Fall 2025 (Current)
        { course: 'CSC 337', description: 'Web Programming', grade: 'A', credits: 3, term: 'Fall 2025' },
        { course: 'DATA 201', description: 'Foundations of Data Science', grade: 'C', credits: 3, term: 'Fall 2025' },
        { course: 'DATA 375', description: 'Intro to Statistcal Computing', grade: 'A', credits: 3, term: 'Fall 2025' },
        { course: 'MATH 464', description: 'Theory of Probability', grade: 'A', credits: 3, term: 'Fall 2025' },
        { course: 'MATH 323', description: 'Formal Math Reasoning', grade: 'B', credits: 3, term: 'Fall 2025' },
        { course: 'MATH 355', description: 'Analysis of Ordinary Differential Equations', grade: 'A', credits: 3, term: 'Fall 2025' },
        { course: 'univ 301', description: 'General Education Portfolio', grade: 'A', credits: 1, term: 'Fall 2025' },
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
      {/* HEADER */}
      <header className={styles.topHeader}>
        <div className={styles.headerLogo}>
          <div className={styles.logoMark}>PM</div>
          <span className={styles.logoText}>PaceMatch</span>
        </div>
        <nav className={styles.headerNav}>
          <a href="/dashboard">Dashboard</a>
          <a href="/progress">Calculate Grades</a>
          <a href="/mentoring">Mentoring</a>
        </nav>
        <button className={styles.headerCta} onClick={() => router.push('/dashboard')}>
          ← Back
        </button>
      </header>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>My Courses</h1>
          <p className={styles.heroSubtext}>
            Upload your transcript to find your optimal course pace and get matched to the right batch for academic success.
          </p>
        </div>
      </section>

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
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Upload Your Unofficial Transcript</CardTitle>
              <CardDescription>Upload a PDF of your unofficial transcript from UAccess</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
              />

              <div className={styles.uploadArea}>
                {uploading ? (
                  <div className={styles.uploading}>
                    <div className={styles.spinner}></div>
                    <p>Analyzing transcript...</p>
                  </div>
                ) : (
                  <>
                    <div className="text-4xl mb-4">📁</div>
                    <p className="text-muted-foreground mb-4">Drag and drop your transcript here, or</p>
                    <Button onClick={triggerFileInput} variant="outline" size="lg">
                      Choose File
                    </Button>

                    {/* Selected File Display */}
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-primary/5 border border-primary rounded-lg inline-flex items-center gap-2">
                        <span className="font-medium">📄 {selectedFile.name}</span>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground mt-4">Supports: PDF, JPG, PNG</p>

                    {/* Error Display */}
                    {uploadError && (
                      <p className="text-destructive mt-2 font-medium">{uploadError}</p>
                    )}
                  </>
                )}
              </div>

              {/* Submit Button - Only show when file is selected */}
              {selectedFile && !uploading && (
                <Button
                  onClick={handleTranscriptUpload}
                  size="lg"
                  className="w-full mt-6"
                >
                  Submit Transcript
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={() => { setStep('choose'); setSelectedFile(null); setUploadError(null); }}
                className="w-full mt-4"
              >
                ← Choose different method
              </Button>
            </CardContent>
          </Card>
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
            {/* Success Banner */}
            <div className={styles.successBanner}>
              <span className={styles.successIcon}>✓</span>
              <div>
                <h3>Transcript Imported Successfully!</h3>
                <p>Found {grades.length} courses across {[...new Set(grades.map(g => g.term))].length} semesters</p>
              </div>
            </div>

            {/* Plan Next Semester Section */}
            <div className={styles.planSection}>
              <div className={styles.planHeader}>
                <div className={styles.planIcon}>◎</div>
                <div>
                  <h3>Plan Next Semester</h3>
                  <p>Add courses you&apos;re planning to take and check prerequisites</p>
                </div>
              </div>

              {/* Search Input */}
              <div className={styles.searchContainer}>
                <div className={styles.searchWrapper}>
                  <span className={styles.searchIconText}>🔍</span>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={`Search ${allCourses.length} courses (e.g., CSC 210, Chemistry)...`}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                </div>

                {/* Search Suggestions */}
                {showSuggestions && searchResults.length > 0 && (
                  <div className={styles.suggestions}>
                    {searchResults.map((course) => (
                      <button
                        key={course.courseCode}
                        className={styles.suggestionItem}
                        onClick={() => addPlannedCourse(course)}
                      >
                        <div>
                          <p className={styles.suggestionCode}>{course.courseCode}</p>
                          <p className={styles.suggestionName}>{course.courseName}</p>
                        </div>
                        <span>+</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Planned Courses List */}
              {plannedCourses.length > 0 ? (
                <div className={styles.plannedCourses}>
                  {plannedCourses.map((course) => {
                    const prereqInfo = getPrereqInfo(course);
                    const batchRec = getRecommendedBatch(prereqInfo);

                    return (
                      <div key={course.courseCode} className={styles.plannedCard}>
                        <div className={styles.plannedHeader}>
                          <div>
                            <p className={styles.plannedCode}>{course.courseCode}</p>
                            <p className={styles.plannedName}>{course.courseName}</p>
                          </div>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removePlannedCourse(course.courseCode)}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Prerequisites */}
                        {prereqInfo.length > 0 && (
                          <div className={styles.prereqList}>
                            <p className={styles.prereqTitle}>Prerequisites</p>
                            {prereqInfo.map((prereq) => (
                              <div
                                key={prereq.code}
                                className={`${styles.prereqItem} ${prereq.met ? styles.prereqMet : styles.prereqNotMet}`}
                              >
                                <div>
                                  <p className={styles.prereqCode}>{prereq.code}</p>
                                  <p className={styles.prereqName}>{prereq.name}</p>
                                </div>
                                <div className={styles.prereqStatus}>
                                  <span className={styles.prereqGrade} style={{
                                    background: prereq.met ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                                    color: prereq.met ? '#059669' : '#DC2626'
                                  }}>
                                    {prereq.grade}
                                  </span>
                                  {prereq.met ? '✓' : '✗'}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Batch Recommendation */}
                        <div className={`${styles.batchRec} ${batchRec.batchCode === 'A' ? styles.batchA :
                          batchRec.batchCode === 'B' ? styles.batchB :
                            styles.batchC
                          }`}>
                          <div>
                            <p className={styles.batchLabel}>Recommended Batch</p>
                            <p className={styles.batchName}>{batchRec.batch}</p>
                          </div>
                          {batchRec.canUpgrade && (
                            <button
                              className={styles.quizBtn}
                              onClick={() => router.push(`/quiz?course=${course.courseCode}`)}
                            >
                              📝 Take Quiz to Upgrade
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyPlan}>
                  <div style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '16px' }}>◎</div>
                  <p>Search and add courses you&apos;re planning to take next semester</p>
                  <p className={styles.emptySubtext}>We&apos;ll check prerequisites and recommend your study batch</p>
                </div>
              )}
            </div>

            {/* Academic History */}
            <h2 className={styles.sectionTitle}>↗ Your Complete Academic History</h2>

            {/* Group courses by term */}
            {['Fall 2023', 'Spring 2024', 'Fall 2024', 'Spring 2025', 'Fall 2025'].map(term => {
              const termCourses = grades.filter(g => g.term === term);
              if (termCourses.length === 0) return null;
              const isCurrentTerm = term === 'Fall 2025';

              return (
                <div key={term} className={styles.semesterCard}>
                  <div className={styles.semesterHeader}>
                    <h3>{term}</h3>
                    {isCurrentTerm && <span className={styles.currentBadge}>Current</span>}
                  </div>

                  <div className={styles.courseList}>
                    {termCourses.map((g, i) => (
                      <div key={i} className={styles.courseRow}>
                        <div className={styles.courseInfo}>
                          <span className={styles.courseCode}>{g.course}</span>
                          <span className={styles.courseDesc}>{g.description}</span>
                        </div>
                        <div className={styles.courseRight}>
                          <span className={styles.credits}>{g.credits} credits</span>
                          {g.grade === 'IP' ? (
                            <span className={styles.inProgressBadge}>In Progress</span>
                          ) : (
                            <span className={`${styles.gradeBadge} ${g.grade === 'E' ? styles.gradeE : ''}`}>
                              {g.grade}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className={styles.recommendationCard}>
              {calculateRecommendation() === 'fast' && (
                <div className={styles.trackBadge} style={{ background: '#22c55e' }}>
                  ⚡ Fast Track (7 weeks)
                </div>
              )}
              {calculateRecommendation() === 'standard' && (
                <div className={styles.trackBadge} style={{ background: '#3b82f6' }}>
                </div>
              )}
              {calculateRecommendation() === 'supported' && (
                <div className={styles.trackBadge} style={{ background: '#f97316' }}>
                  🎯 Supported Track (Full Semester + Tutoring)
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <button className={styles.enrollBtn} onClick={() => alert('✅ Enrolled successfully!')}>
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