'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/mentoring.module.css';

interface Review {
    id: number;
    user: string;
    text: string;
    rating: number;
    date: string;
}

interface TimeSlot {
    id: number;
    day: string;
    date: string;
    time: string;
}

interface Mentor {
    id: number;
    name: string;
    avatar: string;
    avatarColor: 'blue' | 'red';
    rating: number;
    reviewCount: number;
    major: string;
    bio: string;
    courses: string[];
    slotsAvailable: number;
    supportsInPerson: boolean;
    supportsOnline: boolean;
    price: number;
    reviews: Review[];
    timeSlots: TimeSlot[];
}

const MENTORS: Mentor[] = [
    {
        id: 1,
        name: "Santiago Ponce",
        avatar: "SP",
        avatarColor: 'blue',
        rating: 4.9,
        reviewCount: 127,
        major: "Senior @ UofA, Statistics major",
        bio: "Got A's in all listed courses. Love helping others succeed! Specialized in data analysis and probability.",
        courses: ["MATH 363", "MATH 466", "DATA 363"],
        slotsAvailable: 3,
        supportsInPerson: true,
        supportsOnline: true,
        price: 20,
        reviews: [
            { id: 1, user: "John D.", text: "Sarah explained complex statistical models in a way that finally clicked for me.", rating: 5, date: "Dec 28, 2024" },
            { id: 2, user: "Maria L.", text: "Super patient and very knowledgeable about MATH 466!", rating: 4.8, date: "Dec 15, 2024" }
        ],
        timeSlots: [
            { id: 1, day: "Monday", date: "Jan 13", time: "10:00 AM" },
            { id: 2, day: "Wednesday", date: "Jan 15", time: "2:00 PM" },
            { id: 3, day: "Friday", date: "Jan 17", time: "11:30 AM" }
        ]
    },
    {
        id: 2,
        name: "Karan Kumar",
        avatar: "KK",
        avatarColor: 'blue',
        rating: 4.8,
        reviewCount: 89,
        major: "Junior @ UofA, Computer Science",
        bio: "Aced all CS courses. Great at debugging and explaining code! I can help with systems programming and web dev.",
        courses: ["CSC 337", "CSC 352", "CSC 210"],
        slotsAvailable: 3,
        supportsInPerson: false,
        supportsOnline: true,
        price: 20,
        reviews: [
            { id: 1, user: "Chris P.", text: "Helped me understand pointers finally!", rating: 5, date: "Dec 12, 2024" }
        ],
        timeSlots: [
            { id: 1, day: "Tuesday", date: "Jan 7", time: "9:00 AM" },
            { id: 2, day: "Tuesday", date: "Jan 7", time: "4:00 PM" },
            { id: 3, day: "Thursday", date: "Jan 9", time: "1:00 PM" }
        ]
    },
    {
        id: 3,
        name: "Renato Garcia",
        avatar: "RG",
        avatarColor: 'blue',
        rating: 5.0,
        reviewCount: 54,
        major: "Senior @ UofA, Data Science",
        bio: "Perfect grades in data courses. Passionate about teaching! I focus on making learning interactive.",
        courses: ["DATA 201", "DATA 375", "MATH 313"],
        slotsAvailable: 3,
        supportsInPerson: true,
        supportsOnline: true,
        price: 20,
        reviews: [
            { id: 1, user: "Kevin S.", text: "The best math tutor I've ever had. So clear.", rating: 5, date: "Nov 20, 2024" }
        ],
        timeSlots: [
            { id: 1, day: "Monday", date: "Jan 6", time: "3:00 PM" },
            { id: 2, day: "Wednesday", date: "Jan 8", time: "10:00 AM" }
        ]
    },
    {
        id: 4,
        name: "Eris Peto",
        avatar: "EP",
        avatarColor: 'blue',
        rating: 4.7,
        reviewCount: 112,
        major: "Sophomore @ UofA, Math major",
        bio: "Excelled in calculus courses. Ready to help you ace your exams! I have plenty of study sheets to share.",
        courses: ["MATH 125", "MATH 129", "MATH 313"],
        slotsAvailable: 2,
        supportsInPerson: true,
        supportsOnline: false,
        price: 20,
        reviews: [
            { id: 1, user: "David G.", text: "Calculus was a nightmare until I started meeting with Michael.", rating: 5, date: "Dec 5, 2024" }
        ],
        timeSlots: [
            { id: 1, day: "Thursday", date: "Jan 9", time: "2:00 PM" },
            { id: 2, day: "Friday", date: "Jan 10", time: "4:00 PM" }
        ]
    }
];

export default function MentoringPage() {
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookedSlot, setBookedSlot] = useState<TimeSlot | null>(null);
    const [meetingType, setMeetingType] = useState<'In-Person' | 'Online'>('Online');

    const filteredMentors = MENTORS.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSelectMentor = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        // Default to Online if supported, else In-Person
        setMeetingType(mentor.supportsOnline ? 'Online' : 'In-Person');
    };

    const handleBookSlot = (slot: TimeSlot) => {
        setBookedSlot(slot);
        setShowSuccessModal(true);
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        setBookedSlot(null);
        setSelectedMentor(null);
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
                    <a href="/clubs">Clubs & Events</a>
                </nav>
                <Link href="/dashboard" className={styles.headerCta}>
                    ← Back
                </Link>
            </header>

            {/* HERO SECTION */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Book a Mentoring Session</h1>
                    <p className={styles.heroSubtext}>
                        Connect with UofA students who excelled in your courses. Fixed rate: $20 per session.
                    </p>
                </div>
            </section>

            <main className={styles.main}>
                {!selectedMentor ? (
                    <>
                        <div className={styles.searchWrapper}>
                            <div className={styles.searchInputContainer}>
                                <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by course code or mentor name..."
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.mentorsGrid}>
                            {filteredMentors.map(mentor => (
                                <div key={mentor.id} className={styles.mentorCard} onClick={() => handleSelectMentor(mentor)}>
                                    <div className={styles.mentorCardHeader}>
                                        <div className={`${styles.mentorAvatar} ${mentor.avatarColor === 'red' ? styles.mentorAvatarAlt : ''}`}>
                                            {mentor.avatar}
                                        </div>
                                        <div className={styles.mentorInfo}>
                                            <h3 className={styles.mentorName}>{mentor.name}</h3>
                                            <div className={styles.rating}>
                                                <span className={styles.starIcon}>★</span>
                                                <span>{mentor.rating}</span>
                                                <span className={styles.reviews}>({mentor.reviewCount})</span>
                                            </div>
                                        </div>
                                        <div className={styles.price}>
                                            <span className={styles.priceAmount}>${mentor.price}</span>
                                            <span className={styles.pricePeriod}>/session</span>
                                        </div>
                                    </div>
                                    <p className={styles.bio}>{mentor.major}. {mentor.bio}</p>
                                    <div className={styles.coursesList}>
                                        {mentor.courses.map(course => (
                                            <span key={course} className={styles.courseTag}>{course}</span>
                                        ))}
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <div className={styles.footerItem}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            {mentor.slotsAvailable} slots left
                                        </div>
                                        <div className={styles.footerItem}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                            </svg>
                                            {mentor.supportsInPerson && mentor.supportsOnline ? "In-Person / Online" : mentor.supportsOnline ? "Online Only" : "In-Person Only"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className={styles.bookingDetail}>
                        <div className={styles.backLink} onClick={() => setSelectedMentor(null)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Mentors
                        </div>

                        <div className={styles.detailCard}>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <div className={`${styles.mentorAvatar} ${selectedMentor.avatarColor === 'red' ? styles.mentorAvatarAlt : ''}`} style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                    {selectedMentor.avatar}
                                </div>
                                <div className={styles.mentorInfo}>
                                    <h3 className={styles.mentorName} style={{ fontSize: '1.75rem' }}>{selectedMentor.name}</h3>
                                    <div className={styles.rating} style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
                                        <span className={styles.starIcon}>★</span>
                                        <span>{selectedMentor.rating}</span>
                                        <span className={styles.reviews}>({selectedMentor.reviewCount} reviews)</span>
                                    </div>
                                    <p className={styles.bio} style={{ fontSize: '1rem', color: '#111827' }}>{selectedMentor.major}</p>
                                    <div className={styles.coursesList} style={{ border: 'none', padding: 0 }}>
                                        {selectedMentor.courses.map(course => (
                                            <span key={course} className={styles.courseTag}>{course}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.price} style={{ textAlign: 'right' }}>
                                <span className={styles.priceAmount} style={{ fontSize: '2.5rem' }}>${selectedMentor.price}</span>
                                <span className={styles.pricePeriod} style={{ fontSize: '1rem' }}>per session</span>
                                <div style={{ marginTop: '8px' }}>
                                    <span style={{
                                        background: 'rgba(12, 35, 75, 0.1)',
                                        color: 'var(--uofa-blue)',
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        fontWeight: '700'
                                    }}>Grade: A</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.bookingSection}>
                            <h2 className={styles.sectionTitle}>
                                <svg className={styles.calendarIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Available Time Slots
                            </h2>

                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ fontWeight: '600', marginBottom: '12px', color: 'var(--uofa-blue)' }}>Select Meeting Type:</p>
                                <div className={styles.meetingTypeToggle}>
                                    {selectedMentor.supportsOnline && (
                                        <button
                                            className={`${styles.typeBtn} ${meetingType === 'Online' ? styles.typeBtnActive : ''}`}
                                            onClick={() => setMeetingType('Online')}
                                        >
                                            Online (Zoom)
                                        </button>
                                    )}
                                    {selectedMentor.supportsInPerson && (
                                        <button
                                            className={`${styles.typeBtn} ${meetingType === 'In-Person' ? styles.typeBtnActive : ''}`}
                                            onClick={() => setMeetingType('In-Person')}
                                        >
                                            In-Person (Campus)
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className={styles.slotsGrid}>
                                {selectedMentor.timeSlots.map(slot => (
                                    <div key={slot.id} className={styles.slotCard} onClick={() => handleBookSlot(slot)}>
                                        <div>
                                            <div className={styles.slotDay} style={{ color: 'var(--uofa-blue)' }}>{slot.day}</div>
                                            <div className={styles.slotDate}>{slot.date}</div>
                                        </div>
                                        <div className={styles.slotTime} style={{ color: 'var(--uofa-red)' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            {slot.time}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.reviewsSection}>
                                <h2 className={styles.sectionTitle} style={{ fontSize: '1.25rem' }}>
                                    <span style={{ color: '#FBBF24' }}>★</span>
                                    Student Reviews
                                </h2>
                                {selectedMentor.reviews.map(review => (
                                    <div key={review.id} className={styles.reviewCard}>
                                        <div className={styles.reviewHeader}>
                                            <span className={styles.reviewerName}>{review.user}</span>
                                            <div className={styles.reviewStars}>
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>{i < Math.floor(review.rating) ? '★' : '☆'}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className={styles.reviewText}>{review.text}</p>
                                        <div className={styles.reviewDate}>{review.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {showSuccessModal && bookedSlot && selectedMentor && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.successIcon} style={{ background: 'rgba(12, 35, 75, 0.1)', color: 'var(--uofa-blue)' }}>✓</div>
                        <h2>Session Booked!</h2>
                        <p style={{ color: '#111827' }}>
                            You have successfully booked an <strong>{meetingType}</strong> session with <strong>{selectedMentor.name}</strong> on
                            <strong> {bookedSlot.day}, {bookedSlot.date}</strong> at <strong>{bookedSlot.time}</strong>.
                        </p>
                        <div className={styles.bursarBadge} style={{ background: 'rgba(171, 5, 32, 0.1)', color: 'var(--uofa-red)' }}>
                            $20.00 charged to Bursar Account
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#374151' }}>
                            A confirmation email with the {meetingType === 'Online' ? 'Zoom link' : 'meeting location'} has been sent to your university email.
                        </p>
                        <button className={styles.doneBtn} style={{ background: 'var(--uofa-blue)' }} onClick={handleCloseModal}>
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
