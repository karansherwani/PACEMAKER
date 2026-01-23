'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/advisor.module.css';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

const QUICK_PROMPTS = [
    { icon: '📅', text: 'Help me plan my next semester' },
    { icon: '📚', text: 'What prerequisites do I need for CS courses?' },
    { icon: '🎯', text: 'Recommend courses for my major' },
    { icon: '🎓', text: 'Create a 4-year graduation plan' },
    { icon: '⏱️', text: 'Which batch is right for me?' },
];

const AI_RESPONSES: { [key: string]: string } = {
    'plan': `Great question! To help you plan your next semester effectively, I'll need to consider a few things:

**1. Current Progress:** Based on your transcript, I can see which courses you've completed and your GPA trends.

**2. Prerequisites:** I'll check which courses you're now eligible to take.

**3. Workload Balance:** I recommend taking 12-15 credits depending on your other commitments.

Would you like me to suggest specific courses, or would you prefer to tell me what areas you want to focus on?`,

    'prerequisites': `For CS courses at University of Arizona, here's a general prerequisite chain:

**Foundational Courses:**
• CSC 101 → CSC 110 → CSC 120 → CSC 210
• MATH 122A/B (Calculus) is required for most upper-division courses

**Upper Division Prerequisites:**
• CSC 210 is required for: CSC 335, CSC 345, CSC 352
• CSC 252 requires: CSC 210 + MATH 243

Based on your transcript, I can give you personalized recommendations. What specific courses are you interested in?`,

    'recommend': `Based on your academic profile, here are my top recommendations:

**High Priority:**
1. **CSC 335 - Object-Oriented Programming** - Builds on your CSC 210 foundation
2. **CSC 345 - Analysis of Algorithms** - Essential for technical interviews

**Good Additions:**
3. **MATH 313 - Linear Algebra** - Useful for AI/ML tracks
4. **CSC 352 - Systems Programming** - Great for understanding low-level concepts

Would you like me to explain why any of these would be particularly good for your goals?`,

    'graduation': `I'd be happy to help create a 4-year graduation plan! Here's a typical CS track:

**Year 1:** Foundation courses (CSC 101, 110, MATH series)
**Year 2:** Core CS courses (CSC 120, 210, 252)
**Year 3:** Upper division + electives (CSC 335, 345, 352)
**Year 4:** Specialization + capstone

📊 **Your Current Status:** Based on your transcript, you appear to be on track!

To customize this plan, tell me:
1. Any specific concentration (AI, Systems, Security)?
2. Planning to do internships?
3. Double major or minor interests?`,

    'batch': `Great question about batch placement! Let me explain the options:

**Batch A (Fast Track - 7 weeks):**
• Intensive pace for students with strong prerequisite mastery
• Requires 85%+ in prerequisite courses
• Best for: Students with solid foundations who can handle accelerated learning

**Batch B (Standard Track - Full Semester):**
• Balanced pace covering all material thoroughly
• Recommended for most students
• Can take optional quiz to qualify for Batch A

**Batch C (Supported Track - Full Semester + Tutoring):**
• Extended support with additional mentoring
• Extra tutoring sessions included
• Best for: Students who benefit from additional guidance

Based on your GPA and prerequisites, I can recommend your optimal batch. Would you like a personalized assessment?`,

    'default': `I'm here to help with your academic planning! I can assist you with:

• **Course Planning:** Suggesting courses for next semester
• **Prerequisites:** Checking what you need for specific courses  
• **Graduation Tracking:** Creating a path to graduation
• **Batch Recommendations:** Finding your optimal course pace

What would you like to explore?`
};

function getAIResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase();

    if (msg.includes('plan') && (msg.includes('semester') || msg.includes('next'))) {
        return AI_RESPONSES['plan'];
    }
    if (msg.includes('prerequisite') || msg.includes('prereq')) {
        return AI_RESPONSES['prerequisites'];
    }
    if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('should i take')) {
        return AI_RESPONSES['recommend'];
    }
    if (msg.includes('graduation') || msg.includes('4-year') || msg.includes('four year') || msg.includes('graduate')) {
        return AI_RESPONSES['graduation'];
    }
    if (msg.includes('batch') || msg.includes('track') || msg.includes('pace')) {
        return AI_RESPONSES['batch'];
    }

    return AI_RESPONSES['default'];
}

export default function AdvisorPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const name = localStorage.getItem('studentName');
        if (!name) {
            router.push('/');
            return;
        }
        const cleanName = name.startsWith('Student ') ? name.replace('Student ', '') : name;
        setStudentName(cleanName);

        // Add initial welcome message
        const welcomeMessage: Message = {
            id: 'welcome',
            role: 'ai',
            content: `Hello ${cleanName}! 👋 I'm your AI Academic Advisor. I'm here to help you plan your academic journey at University of Arizona.\n\nI can help you with:\n• Planning your next semester\n• Understanding prerequisites\n• Course recommendations\n• Creating a graduation timeline\n\nWhat would you like to explore today?`,
            timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        setLoading(false);
    }, [router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        const aiResponse: Message = {
            id: `ai-${Date.now()}`,
            role: 'ai',
            content: getAIResponse(content),
            timestamp: new Date(),
        };

        setIsTyping(false);
        setMessages(prev => [...prev, aiResponse]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputValue);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backButton} onClick={() => router.push('/dashboard')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Dashboard
                    </button>
                    <div className={styles.logo}>
                        <div className={styles.logoMark}>PM</div>
                        <span className={styles.logoText}>AI Advisor</span>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.statusIndicator}>
                        <span className={styles.statusDot}></span>
                        AI Online
                    </div>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className={styles.main}>
                <div className={styles.chatContainer}>
                    {/* Messages */}
                    <div className={styles.messagesArea}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`${styles.message} ${message.role === 'ai' ? styles.messageAi : styles.messageUser}`}
                            >
                                <div className={`${styles.avatar} ${message.role === 'ai' ? styles.avatarAi : styles.avatarUser}`}>
                                    {message.role === 'ai' ? '🤖' : studentName.charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.messageContent}>
                                    <div className={`${styles.messageBubble} ${message.role === 'ai' ? styles.messageBubbleAi : styles.messageBubbleUser}`}>
                                        {message.content.split('\n').map((line, i) => (
                                            <span key={i}>
                                                {line}
                                                {i < message.content.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </div>
                                    <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className={styles.typingIndicator}>
                                <div className={`${styles.avatar} ${styles.avatarAi}`}>🤖</div>
                                <div className={styles.typingBubble}>
                                    <span className={styles.typingDot}></span>
                                    <span className={styles.typingDot}></span>
                                    <span className={styles.typingDot}></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts */}
                    {messages.length <= 1 && (
                        <div className={styles.quickPrompts}>
                            <div className={styles.quickPromptsLabel}>Suggested Questions</div>
                            <div className={styles.promptsGrid}>
                                {QUICK_PROMPTS.map((prompt, index) => (
                                    <button
                                        key={index}
                                        className={styles.promptButton}
                                        onClick={() => handleSendMessage(prompt.text)}
                                    >
                                        <span className={styles.promptIcon}>{prompt.icon}</span>
                                        {prompt.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className={styles.inputArea}>
                        <div className={styles.inputWrapper}>
                            <textarea
                                className={styles.textInput}
                                placeholder="Ask me about course planning, prerequisites, or graduation..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                rows={1}
                            />
                            <button
                                className={styles.sendButton}
                                onClick={() => handleSendMessage(inputValue)}
                                disabled={!inputValue.trim() || isTyping}
                            >
                                <svg className={styles.sendIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                            </button>
                        </div>
                        <p className={styles.footerHint}>
                            Press Enter to send • AI responses are simulated for demo purposes
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
