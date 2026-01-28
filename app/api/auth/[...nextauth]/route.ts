import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/app/lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        // Google OAuth Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        // Credentials Provider (Email/Password)
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
                isSignup: { label: 'Is Signup', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                try {
                    await connectToDatabase();

                    const user = await User.findOne({ email: credentials.email.toLowerCase() });

                    // Handle signup
                    if (credentials.isSignup === 'true') {
                        if (user) {
                            throw new Error('An account with this email already exists');
                        }

                        // Hash password and create new user
                        const hashedPassword = await bcrypt.hash(credentials.password, 12);
                        const newUser = await User.create({
                            email: credentials.email.toLowerCase(),
                            password: hashedPassword,
                            authProvider: 'credentials',
                            profile: { fullName: '' },
                        });

                        return {
                            id: newUser._id.toString(),
                            email: newUser.email,
                            name: newUser.profile?.fullName || '',
                        };
                    }

                    // Handle signin
                    if (!user) {
                        throw new Error('Invalid email or password');
                    }

                    // Check password
                    const isValid = await bcrypt.compare(credentials.password, user.password || '');
                    if (!isValid) {
                        throw new Error('Invalid email or password');
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.profile?.fullName || '',
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    throw error;
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth',
        error: '/auth',
    },
    callbacks: {
        async signIn({ user, account }) {
            // Handle Google OAuth sign in
            if (account?.provider === 'google') {
                try {
                    await connectToDatabase();

                    // Check if user exists, if not create
                    const existingUser = await User.findOne({ email: user.email?.toLowerCase() });

                    if (!existingUser) {
                        await User.create({
                            email: user.email?.toLowerCase(),
                            authProvider: 'google',
                            profile: { fullName: user.name || '' },
                        });
                    }
                } catch (error) {
                    console.error('Google sign-in error:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            if (account) {
                token.provider = account.provider;
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
