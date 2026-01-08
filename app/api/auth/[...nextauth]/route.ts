import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Mock user database - Replace with your real database
const users = [
    {
        id: '1',
        email: 'karan@example.com',
        name: 'Karan Kumar',
        password: 'password123',
    },
    {
        id: '2',
        email: 'student@example.com',
        name: 'Test Student',
        password: 'password123',
    },
];

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                // Find user in database
                const user = users.find(
                    u => u.email === credentials.email && u.password === credentials.password
                );

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    pages: {
        signIn: '/auth',
        error: '/auth',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
