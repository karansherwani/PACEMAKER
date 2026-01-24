'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/clubs.module.css';

interface Club {
    category_scraped_from: string;
    name: string;
    type: string;
    subcategories: string;
    url: string;
    image_url: string;
    mission: string;
    membership_benefits: string;
    membership_type: string;
    contact_info: string;
    website: string;
    registration_status: string;
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

const EVENTS: Event[] = [
    { id: '1', title: 'Tech Career Fair', category: 'Professional', date: 'Jan 15, 2025', time: '10AM - 4PM', location: 'Student Union', description: 'Meet recruiters from top tech companies' },
    { id: '2', title: 'Hackathon: AI Edition', category: 'Academic', date: 'Jan 20-21, 2025', time: '48 hours', location: 'Gould-Simpson', description: 'Build AI-powered solutions in 48 hours' },
    { id: '3', title: 'Resume Workshop', category: 'Professional', date: 'Jan 18, 2025', time: '2PM - 4PM', location: 'Career Services', description: 'Get your resume reviewed by industry professionals' },
    { id: '4', title: 'Outdoor Movie Night', category: 'Special Interest', date: 'Jan 22, 2025', time: '7PM', location: 'Mall Lawn', description: 'Watch a movie under the stars' },
    { id: '5', title: 'Startup Pitch Competition', category: 'Professional', date: 'Jan 25, 2025', time: '5PM - 8PM', location: 'McClelland Hall', description: 'Pitch your startup idea to win prizes' },
    { id: '6', title: 'Study Abroad Info Session', category: 'Academic', date: 'Jan 28, 2025', time: '3PM', location: 'Modern Languages', description: 'Learn about international opportunities' },
];

export default function ClubsPage() {
    const router = useRouter();
    const [studentName, setStudentName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
    const [activeTab, setActiveTab] = useState<'clubs' | 'events'>('clubs');
    const [clubs, setClubs] = useState<Club[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const name = localStorage.getItem('studentName');
        if (!name) {
            router.push('/');
            return;
        }
        setStudentName(name);

        // Load clubs from public folder
        fetch('/data/uofa_clubs.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load clubs data');
                }
                return response.json();
            })
            .then((data: Club[]) => {
                setClubs(data);

                // Extract unique categories from subcategories
                const uniqueCategories = new Set<string>();
                data.forEach(club => {
                    if (club.subcategories) {
                        club.subcategories.split(',').forEach(cat => {
                            const trimmed = cat.trim();
                            if (trimmed) uniqueCategories.add(trimmed);
                        });
                    }
                });

                setCategories(['All', ...Array.from(uniqueCategories).sort()]);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading clubs:', error);
                setLoading(false);
            });
    }, [router]);

    const toggleCategory = (category: string) => {
        if (category === 'All') {
            setSelectedCategories(['All']);
        } else {
            const newCategories = selectedCategories.includes(category)
                ? selectedCategories.filter(i => i !== category)
                : [...selectedCategories.filter(i => i !== 'All'), category];
            setSelectedCategories(newCategories.length === 0 ? ['All'] : newCategories);
        }
    };

    const filteredClubs = clubs.filter(club => {
        const subcats = club.subcategories?.split(',').map(s => s.trim().toLowerCase()) || [];
        const categoryMatch = selectedCategories.includes('All') || selectedCategories.some(c => subcats.includes(c.toLowerCase()));

        const searchMatch = searchQuery === '' ||
            club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            club.mission?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            club.type?.toLowerCase().includes(searchQuery.toLowerCase());

        return categoryMatch && searchMatch;
    });

    const filteredEvents = selectedCategories.includes('All')
        ? EVENTS
        : EVENTS.filter(event => selectedCategories.includes(event.category));

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
                    <a href="/progress">Calculate Grades</a>
                </nav>
                <button className={styles.headerCta} onClick={() => router.push('/dashboard')}>
                    ← Back
                </button>
            </header>

            {/* HERO SECTION */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>University of Arizona Clubs &amp; Events</h1>
                    <p className={styles.heroSubtext}>
                        Discover {clubs.length} student organizations and upcoming events that match your interests.
                    </p>
                </div>
            </section>

            <main className={styles.main}>

                

                {/* Category Filter */}
                <section className={styles.filterSection}>
                    <h2>Filter by Category</h2>
                    <div className={styles.interestTags}>
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`${styles.interestTag} ${selectedCategories.includes(category) ? styles.selected : ''}`}
                                onClick={() => toggleCategory(category)}
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

                {/* Loading State */}
                {loading && (
                    <div className={styles.loadingState}>
                        <p>Loading clubs...</p>
                    </div>
                )}

                {/* Clubs List */}
                {activeTab === 'clubs' && !loading && (
                    <section className={styles.listSection}>
                        {filteredClubs.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>No clubs found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className={styles.clubsGrid}>
                                {filteredClubs.map(club => (
                                    <div key={club.url} className={styles.clubCard}>
                                        {club.image_url && (
                                            <div className={styles.clubImage}>
                                                <img src={club.image_url} alt={`${club.name} logo`} loading="lazy" />
                                            </div>
                                        )}
                                        <div className={styles.clubHeader}>
                                            <span className={styles.categoryBadge}>{club.type || 'Student Organization'}</span>
                                           
                                        </div>
                                        <h3>{club.name}</h3>
                                        {club.subcategories && (
                                            <p className={styles.subcategories}>
                                                {club.subcategories}
                                            </p>
                                        )}
                                        <p className={styles.description}>
                                            {club.mission || 'Explore this organization to learn more about their activities and mission.'}
                                        </p>
                                        <div className={styles.clubMeta}>
                                            <span>📋 {club.membership_type || 'Lifetime membership'}</span>
                                        </div>
                                        <div className={styles.clubActions}>
                                            
                                            {club.url && (
                                                <a 
                                                    href={club.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={styles.joinBtn}
                                                >
                                                    View Details
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
