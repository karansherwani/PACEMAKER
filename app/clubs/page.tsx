'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/clubs.module.css';

interface Club {
    id: string;
    name: string;
    category: string;
    description: string;
    members: number;
    meetingTime: string;
}

interface Event {
    id: string;
    title: string;
    category: string;
    date: string;
    time: string;
    location: string;
    description: string;
}

const CLUBS: Club[] = [
    { id: '1', name: 'AI & Machine Learning Club', category: 'Technology', description: 'Explore artificial intelligence and build ML projects together', members: 156, meetingTime: 'Thursdays 6PM' },
    { id: '2', name: 'Data Science Society', category: 'Technology', description: 'Learn data analysis, visualization, and statistical modeling', members: 89, meetingTime: 'Wednesdays 5PM' },
    { id: '3', name: 'Women in STEM', category: 'Professional', description: 'Empowering women in science, technology, engineering and math', members: 234, meetingTime: 'Tuesdays 7PM' },
    { id: '4', name: 'Entrepreneurship Club', category: 'Business', description: 'Turn your ideas into startups with like-minded innovators', members: 178, meetingTime: 'Mondays 6PM' },
    { id: '5', name: 'Hiking & Outdoors Club', category: 'Recreation', description: 'Explore Arizona trails and enjoy nature with fellow hikers', members: 312, meetingTime: 'Saturdays 8AM' },
    { id: '6', name: 'Photography Club', category: 'Arts', description: 'Capture moments and learn photography techniques', members: 67, meetingTime: 'Fridays 4PM' },
    { id: '7', name: 'Finance & Investment Club', category: 'Business', description: 'Learn about stocks, crypto, and personal finance', members: 145, meetingTime: 'Wednesdays 7PM' },
    { id: '8', name: 'Robotics Team', category: 'Technology', description: 'Design and build robots for competitions', members: 52, meetingTime: 'Mon/Wed 5PM' },
    { id: '9', name: 'Community Service League', category: 'Service', description: 'Give back to the Tucson community through volunteer work', members: 198, meetingTime: 'Various' },
    { id: '10', name: 'Debate Society', category: 'Academic', description: 'Sharpen your argumentation and public speaking skills', members: 76, meetingTime: 'Tuesdays 6PM' },
];

const EVENTS: Event[] = [
    { id: '1', title: 'Tech Career Fair', category: 'Professional', date: 'Jan 15, 2025', time: '10AM - 4PM', location: 'Student Union', description: 'Meet recruiters from top tech companies' },
    { id: '2', title: 'Hackathon: AI Edition', category: 'Technology', date: 'Jan 20-21, 2025', time: '48 hours', location: 'Gould-Simpson', description: 'Build AI-powered solutions in 48 hours' },
    { id: '3', title: 'Resume Workshop', category: 'Professional', date: 'Jan 18, 2025', time: '2PM - 4PM', location: 'Career Services', description: 'Get your resume reviewed by industry professionals' },
    { id: '4', title: 'Outdoor Movie Night', category: 'Social', date: 'Jan 22, 2025', time: '7PM', location: 'Mall Lawn', description: 'Watch a movie under the stars' },
    { id: '5', title: 'Startup Pitch Competition', category: 'Business', date: 'Jan 25, 2025', time: '5PM - 8PM', location: 'McClelland Hall', description: 'Pitch your startup idea to win prizes' },
    { id: '6', title: 'Study Abroad Info Session', category: 'Academic', date: 'Jan 28, 2025', time: '3PM', location: 'Modern Languages', description: 'Learn about international opportunities' },
];

const CATEGORIES = ['All', 'Technology', 'Professional', 'Business', 'Academic', 'Recreation', 'Arts', 'Service', 'Social'];

export default function ClubsPage() {
    const router = useRouter();
    const [studentName, setStudentName] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>(['All']);
    const [activeTab, setActiveTab] = useState<'clubs' | 'events'>('clubs');

    useEffect(() => {
        const name = localStorage.getItem('studentName');
        if (!name) {
            router.push('/');
            return;
        }
        setStudentName(name);
    }, [router]);

    const toggleInterest = (category: string) => {
        if (category === 'All') {
            setSelectedInterests(['All']);
        } else {
            const newInterests = selectedInterests.includes(category)
                ? selectedInterests.filter(i => i !== category)
                : [...selectedInterests.filter(i => i !== 'All'), category];
            setSelectedInterests(newInterests.length === 0 ? ['All'] : newInterests);
        }
    };

    const filteredClubs = selectedInterests.includes('All')
        ? CLUBS
        : CLUBS.filter(club => selectedInterests.includes(club.category));

    const filteredEvents = selectedInterests.includes('All')
        ? EVENTS
        : EVENTS.filter(event => selectedInterests.includes(event.category));

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => router.push('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <div>
                    <div className={styles.logo}>🎪 Clubs & Events</div>
                    <p className={styles.subtitle}>Discover opportunities based on your interests</p>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.welcomeCard}>
                    <h1>Hi {studentName}! 👋</h1>
                    <p>Find clubs and events that match your interests to enhance your college experience</p>
                </div>

                {/* Interest Filter */}
                <section className={styles.filterSection}>
                    <h2>Filter by Interest</h2>
                    <div className={styles.interestTags}>
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                className={`${styles.interestTag} ${selectedInterests.includes(category) ? styles.selected : ''}`}
                                onClick={() => toggleInterest(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'clubs' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('clubs')}
                    >
                        Clubs ({filteredClubs.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'events' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('events')}
                    >
                        Upcoming Events ({filteredEvents.length})
                    </button>
                </div>

                {/* Clubs List */}
                {activeTab === 'clubs' && (
                    <section className={styles.listSection}>
                        <div className={styles.clubsGrid}>
                            {filteredClubs.map(club => (
                                <div key={club.id} className={styles.clubCard}>
                                    <span className={styles.categoryBadge}>{club.category}</span>
                                    <h3>{club.name}</h3>
                                    <p className={styles.description}>{club.description}</p>
                                    <div className={styles.clubMeta}>
                                        <span>👥 {club.members} members</span>
                                        <span>📅 {club.meetingTime}</span>
                                    </div>
                                    <button className={styles.joinBtn}>Join Club</button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Events List */}
                {activeTab === 'events' && (
                    <section className={styles.listSection}>
                        <div className={styles.eventsGrid}>
                            {filteredEvents.map(event => (
                                <div key={event.id} className={styles.eventCard}>
                                    <div className={styles.eventDate}>
                                        <span className={styles.eventDay}>{event.date.split(' ')[1]?.replace(',', '')}</span>
                                        <span className={styles.eventMonth}>{event.date.split(' ')[0]}</span>
                                    </div>
                                    <div className={styles.eventInfo}>
                                        <span className={styles.categoryBadge}>{event.category}</span>
                                        <h3>{event.title}</h3>
                                        <p className={styles.description}>{event.description}</p>
                                        <div className={styles.eventMeta}>
                                            <span>🕐 {event.time}</span>
                                            <span>📍 {event.location}</span>
                                        </div>
                                    </div>
                                    <button className={styles.rsvpBtn}>RSVP</button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
