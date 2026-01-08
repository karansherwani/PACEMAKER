'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/progress.module.css';

interface GradeComponent {
    id: string;
    name: string;
    weight: number;
    score: number | null;
    completed: boolean;
}

interface Course {
    id: string;
    name: string;
    components: GradeComponent[];
}

const GRADE_THRESHOLDS = [
    { grade: 'A', min: 90 },
    { grade: 'B', min: 80 },
    { grade: 'C', min: 70 },
    { grade: 'D', min: 60 },
    { grade: 'E', min: 0 },
];

const DEFAULT_COMPONENTS: GradeComponent[] = [
    { id: '1', name: 'Midterm 1', weight: 25, score: null, completed: false },
    { id: '2', name: 'Midterm 2', weight: 25, score: null, completed: false },
    { id: '3', name: 'Homework', weight: 20, score: null, completed: false },
    { id: '4', name: 'Attendance', weight: 5, score: null, completed: false },
    { id: '5', name: 'Final Exam', weight: 25, score: null, completed: false },
];

export default function ProgressPage() {
    const router = useRouter();
    const [studentName, setStudentName] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [newCourseName, setNewCourseName] = useState('');
    const [showAddCourse, setShowAddCourse] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const name = localStorage.getItem('studentName');
        if (!name) {
            router.push('/');
            return;
        }
        setStudentName(name);

        // Load saved courses from localStorage
        const savedCourses = localStorage.getItem('savedCourses');
        if (savedCourses) {
            const parsed = JSON.parse(savedCourses);
            setCourses(parsed);
        }
    }, [router]);

    const saveCourses = (updatedCourses: Course[]) => {
        setCourses(updatedCourses);
        localStorage.setItem('savedCourses', JSON.stringify(updatedCourses));
    };

    const addNewCourse = () => {
        if (!newCourseName.trim()) return;

        const newCourse: Course = {
            id: String(Date.now()),
            name: newCourseName.trim(),
            components: [...DEFAULT_COMPONENTS.map(c => ({ ...c, id: String(Date.now()) + c.id }))],
        };

        const updatedCourses = [...courses, newCourse];
        saveCourses(updatedCourses);
        setSelectedCourse(newCourse);
        setNewCourseName('');
        setShowAddCourse(false);
    };

    const deleteCourse = (courseId: string) => {
        const updatedCourses = courses.filter(c => c.id !== courseId);
        saveCourses(updatedCourses);
        if (selectedCourse?.id === courseId) {
            setSelectedCourse(null);
        }
    };

    const updateComponent = (componentId: string, field: keyof GradeComponent, value: number | boolean | null) => {
        if (!selectedCourse) return;

        const updatedComponents = selectedCourse.components.map(c =>
            c.id === componentId ? { ...c, [field]: value } : c
        );

        const updatedCourse = { ...selectedCourse, components: updatedComponents };
        setSelectedCourse(updatedCourse);

        const updatedCourses = courses.map(c =>
            c.id === selectedCourse.id ? updatedCourse : c
        );
        saveCourses(updatedCourses);
    };

    const addComponent = () => {
        if (!selectedCourse) return;

        const newComponent: GradeComponent = {
            id: String(Date.now()),
            name: 'New Component',
            weight: 0,
            score: null,
            completed: false,
        };

        const updatedCourse = {
            ...selectedCourse,
            components: [...selectedCourse.components, newComponent],
        };
        setSelectedCourse(updatedCourse);

        const updatedCourses = courses.map(c =>
            c.id === selectedCourse.id ? updatedCourse : c
        );
        saveCourses(updatedCourses);
    };

    const updateComponentName = (componentId: string, name: string) => {
        if (!selectedCourse) return;

        const updatedComponents = selectedCourse.components.map(c =>
            c.id === componentId ? { ...c, name } : c
        );

        const updatedCourse = { ...selectedCourse, components: updatedComponents };
        setSelectedCourse(updatedCourse);

        const updatedCourses = courses.map(c =>
            c.id === selectedCourse.id ? updatedCourse : c
        );
        saveCourses(updatedCourses);
    };

    // Calculate grades for selected course
    const components = selectedCourse?.components || [];
    const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
    const completedComponents = components.filter(c => c.completed && c.score !== null);
    const completedWeight = completedComponents.reduce((sum, c) => sum + c.weight, 0);
    const earnedPoints = completedComponents.reduce((sum, c) => sum + (c.score ?? 0), 0);
    const currentGrade = completedWeight > 0 ? (earnedPoints / completedWeight) * 100 : 0;
    const finalWeight = components.find(c => !c.completed)?.weight || 0;

    const calculateNeededScore = (targetPoints: number): number => {
        if (finalWeight === 0) return 0;
        const pointsNeeded = targetPoints - earnedPoints;
        return (pointsNeeded / finalWeight) * 100;
    };

    const getGradeColor = (needed: number): string => {
        if (needed <= 0) return '#22c55e';
        if (needed <= 60) return '#22c55e';
        if (needed <= 80) return '#eab308';
        if (needed <= 100) return '#f97316';
        return '#ef4444';
    };

    const getStatusText = (needed: number): string => {
        if (needed <= 0) return 'Already secured! 🎉';
        if (needed > 100) return 'Keep pushing! 💪';
        if (needed <= 60) return 'Very doable! ✓';
        if (needed <= 80) return 'You can do it! ✨';
        return 'You got this! 🚀';
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
                    <a href="/placements">My Courses</a>
                    <a href="/mentoring">Mentoring</a>
                </nav>
                <button className={styles.headerCta} onClick={() => router.push('/dashboard')}>
                    ← Back
                </button>
            </header>

            {/* HERO SECTION */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Calculate Your Grades</h1>
                    <p className={styles.heroSubtext}>
                        Track your progress and calculate what you need on your final exams to achieve your target grades.
                    </p>
                </div>
            </section>

            <main className={styles.main}>
                <div className={styles.welcomeCard}>
                    <h1>Hi {studentName}! 👋</h1>
                    <p>Select a course or add a new one to calculate your grades</p>
                </div>

                {/* Course Selection */}
                {/* Add Course Section */}
                <section className={styles.inputSection}>
                    <div className={styles.addCourseContainer}>
                        <h2>Manage Courses</h2>
                        {showAddCourse ? (
                            <div className={styles.addCourseForm}>
                                <input
                                    type="text"
                                    value={newCourseName}
                                    onChange={(e) => setNewCourseName(e.target.value)}
                                    placeholder="e.g., MATH 464"
                                    className={styles.courseInput}
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && addNewCourse()}
                                />
                                <button className={styles.saveBtn} onClick={addNewCourse}>Save</button>
                                <button className={styles.cancelBtn} onClick={() => setShowAddCourse(false)}>Cancel</button>
                            </div>
                        ) : (
                            <button
                                className={styles.addCourseBtn}
                                onClick={() => setShowAddCourse(true)}
                            >
                                + Add New Course
                            </button>
                        )}
                    </div>
                </section>

                {/* Course List Section */}
                <section className={styles.inputSection}>
                    <h2>Your Saved Courses</h2>
                    {courses.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No courses added yet. Add a course above to get started!</p>
                        </div>
                    ) : (
                        <div className={styles.coursesList}>
                            {courses.map((course) => {
                                const courseComponents = course.components;
                                const compWeight = courseComponents.filter(c => c.completed && c.score !== null).reduce((sum, c) => sum + c.weight, 0);
                                const earned = courseComponents.filter(c => c.completed && c.score !== null).reduce((sum, c) => sum + (c.score ?? 0), 0);
                                const grade = compWeight > 0 ? (earned / compWeight) * 100 : 0;
                                const isExpanded = selectedCourse?.id === course.id;

                                return (
                                    <div
                                        key={course.id}
                                        className={`${styles.courseItemRow} ${isExpanded ? styles.expanded : ''}`}
                                    >
                                        {/* Course header with name and grade */}
                                        <div
                                            className={styles.courseHeaderRow}
                                            onClick={() => setSelectedCourse(isExpanded ? null : course)}
                                        >
                                            <div className={styles.courseNameSection}>
                                                <span className={styles.expandIcon}>
                                                    {isExpanded ? '▼' : '▶'}
                                                </span>
                                                <span className={styles.courseName}>{course.name}</span>
                                                {/* <span className={styles.gradeHint}>Needs calculated% for an &quot;A&quot;</span> */}
                                            </div>
                                            <div className={styles.gradeSection}>
                                                <span className={styles.finalGrade}>{grade.toFixed(1)}%</span>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteCourse(course.id);
                                                    }}
                                                    title="Delete course"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subsections (components) */}
                                        {isExpanded && (
                                            <div className={styles.subsectionsContainer}>
                                                {courseComponents.map((comp) => (
                                                    <div key={comp.id} className={styles.subsectionRow}>
                                                        <div className={styles.subsectionName}>
                                                            <input
                                                                type="text"
                                                                value={comp.name}
                                                                onChange={(e) => updateComponentName(comp.id, e.target.value)}
                                                                className={styles.subsectionNameInput}
                                                            />
                                                        </div>
                                                        <div className={styles.subsectionDetails}>
                                                            <div className={styles.subsectionField}>
                                                                <label>Weight: </label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    value={comp.weight}
                                                                    onChange={(e) => updateComponent(comp.id, 'weight', Number(e.target.value))}
                                                                    className={styles.subsectionInput}
                                                                />
                                                                <span>%</span>
                                                            </div>
                                                            <div className={styles.subsectionField}>
                                                                <label>Score: </label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={comp.weight}
                                                                    step="0.1"
                                                                    value={comp.score ?? ''}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value === '' ? null : Number(e.target.value);
                                                                        updateComponent(comp.id, 'score', value);
                                                                    }}
                                                                    disabled={!comp.completed}
                                                                    placeholder="Enter"
                                                                    className={styles.subsectionInput}
                                                                />
                                                                <span>pts</span>
                                                            </div>
                                                            <div className={styles.subsectionField}>
                                                                <label className={styles.checkboxLabel}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={comp.completed}
                                                                        onChange={(e) => updateComponent(comp.id, 'completed', e.target.checked)}
                                                                    />
                                                                    Done
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button className={styles.addSubsectionBtn} onClick={addComponent}>
                                                    + Add Component
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Grade Calculator for Selected Course */}
                {selectedCourse && (
                    <>
                        <section className={styles.inputSection}>
                            <h2>{selectedCourse.name} - Grade Components</h2>
                            <p className={styles.hint}>
                                Total weight should equal 100%. Current: <strong>{totalWeight}%</strong>
                                {totalWeight !== 100 && <span className={styles.warning}> (adjust weights!)</span>}
                            </p>

                            <div className={styles.componentsList}>
                                {components.map((comp) => (
                                    <div key={comp.id} className={styles.componentRow}>
                                        <div className={styles.componentName}>
                                            <input
                                                type="text"
                                                value={comp.name}
                                                onChange={(e) => updateComponentName(comp.id, e.target.value)}
                                                className={styles.nameInput}
                                            />
                                        </div>
                                        <div className={styles.componentWeight}>
                                            <label>Weight %</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={comp.weight}
                                                onChange={(e) => updateComponent(comp.id, 'weight', Number(e.target.value))}
                                            />
                                        </div>
                                        <div className={styles.componentScore}>
                                            <label>Points</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max={comp.weight}
                                                step="0.1"
                                                value={comp.score ?? ''}
                                                onChange={(e) => {
                                                    const value = e.target.value === '' ? null : Number(e.target.value);
                                                    updateComponent(comp.id, 'score', value);
                                                }}
                                                disabled={!comp.completed}
                                                placeholder="Enter score"
                                            />
                                        </div>
                                        <div className={styles.componentCompleted}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={comp.completed}
                                                    onChange={(e) => updateComponent(comp.id, 'completed', e.target.checked)}
                                                />
                                                Completed
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className={styles.addBtn} onClick={addComponent}>
                                + Add Component
                            </button>
                        </section>

                        {/* Results Section */}
                        <section className={styles.resultsSection}>
                            <h2>{selectedCourse.name} - Grade Analysis</h2>

                            <div className={styles.currentGrade}>
                                <div className={styles.gradeCircle}>
                                    <span className={styles.gradeNumber}>{currentGrade.toFixed(1)}%</span>
                                    <span className={styles.gradeLabel}>Current Grade</span>
                                </div>
                                <p>Based on {completedWeight}% of coursework completed</p>
                            </div>

                            <h3>What You Need on the Final ({finalWeight}% of grade)</h3>

                            <div className={styles.targetGrid}>
                                {GRADE_THRESHOLDS.map((threshold) => {
                                    const neededPercent = calculateNeededScore(threshold.min);
                                    const rawPointsNeeded = threshold.min - earnedPoints;
                                    const hasScores = earnedPoints > 0;

                                    return (
                                        <div
                                            key={threshold.grade}
                                            className={styles.targetCard}
                                            style={{ borderColor: hasScores ? getGradeColor(neededPercent) : '#ddd' }}
                                        >
                                            <div className={styles.targetGrade}>{threshold.grade}</div>
                                            <div className={styles.targetMin}>{threshold.min}+</div>

                                            {hasScores ? (
                                                <>
                                                    <div
                                                        className={styles.neededScore}
                                                        style={{ color: getGradeColor(neededPercent) }}
                                                    >
                                                        {rawPointsNeeded <= 0
                                                            ? '0'
                                                            : rawPointsNeeded > finalWeight
                                                                ? `>${finalWeight}`
                                                                : rawPointsNeeded.toFixed(1)
                                                        } / {finalWeight} pts
                                                    </div>
                                                    <div className={styles.neededPercent}>
                                                        ({neededPercent <= 0
                                                            ? '0%'
                                                            : neededPercent > 100
                                                                ? '>100%'
                                                                : `${neededPercent.toFixed(1)}%`
                                                        } on final)
                                                    </div>
                                                    <div className={styles.statusText}>{getStatusText(neededPercent)}</div>
                                                </>
                                            ) : (
                                                <div className={styles.enterScores}>Enter your scores above</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </>
                )}

                {!selectedCourse && courses.length === 0 && (
                    <section className={styles.inputSection}>
                        <div className={styles.emptyState}>
                            <p>No courses added yet. Click &quot;+ Add Course&quot; to get started!</p>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
