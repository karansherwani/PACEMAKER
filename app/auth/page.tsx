'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/auth.module.css';

type AuthMethod = 'email' | 'netid' | null;
type Mode = 'signin' | 'signup' | 'reset';

export default function AuthPage() {
  const router = useRouter();
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [netId, setNetId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset Password State
  const [otp, setOtp] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    const uni = localStorage.getItem('selectedUniversity');
    if (!uni) {
      router.push('/');
      return;
    }
    setSelectedUniversity(uni);
  }, [router]);

  const getUniversityInfo = (id: string) => {
    const unis: Record<string, { name: string; primaryColor: string; secondaryColor: string }> = {
      uofa: { name: 'University of Arizona', primaryColor: '#C41E3A', secondaryColor: '#003366' },
      asu: { name: 'Arizona State University', primaryColor: '#8B0000', secondaryColor: '#FFB81C' },
      uofc: { name: 'University of Colorado Boulder', primaryColor: '#CFB53B', secondaryColor: '#1E3932' },
      ucsd: { name: 'UC San Diego', primaryColor: '#0066CC', secondaryColor: '#00629B' },
      stanford: { name: 'Stanford University', primaryColor: '#B1040E', secondaryColor: '#8C1515' },
      mit: { name: 'MIT', primaryColor: '#A6192E', secondaryColor: '#8B0000' },
      harvard: { name: 'Harvard University', primaryColor: '#CE1126', secondaryColor: '#165E83' },
      berkeley: { name: 'UC Berkeley', primaryColor: '#003262', secondaryColor: '#FDB827' },
    };
    return unis[id] || { name: 'Your University', primaryColor: '#003366', secondaryColor: '#C41E3A' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          university: selectedUniversity,
          authMethod,
          email: email || undefined,
          netId: netId || undefined,
          password,
          isSignup: mode === 'signup',
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // ✅ STORE USER EMAIL FOR QUIZ PAGE
        const userEmail = email || `${netId}@${selectedUniversity}.edu`;
        localStorage.setItem('userEmail', userEmail);

        localStorage.setItem('studentName', data.fullName || data.email || netId);
        localStorage.setItem('userId', data.userId || '');
        localStorage.setItem('studentEmail', data.email || userEmail);
        localStorage.setItem('loginMethod', authMethod || 'email');
        localStorage.setItem('authToken', data.token || '');

        if (data.classes) {
          localStorage.setItem('studentClasses', JSON.stringify(data.classes));
        }
        if (data.grades) {
          localStorage.setItem('studentGrades', JSON.stringify(data.grades));
        }

        console.log('✓ Login successful. Email stored:', userEmail);

        // Small delay to ensure localStorage is saved
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please try again or contact IT support.');
      console.error('Auth Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetMessage('');

    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || undefined,
          netId: netId || undefined,
          otp: resetStep === 'verify' ? otp : undefined,
          newPassword: resetStep === 'verify' ? password : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (resetStep === 'request') {
          setResetStep('verify');
          setResetMessage(data.message);
        } else {
          setResetMessage('Password reset successfully! Please sign in.');
          setTimeout(() => {
            setMode('signin');
            setResetStep('request');
            setPassword('');
            setOtp('');
            setResetMessage('');
          }, 2000);
        }
      } else {
        setError(data.message || 'Error processing request');
      }
    } catch {
      setError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedUniversity) return null;

  const uni = getUniversityInfo(selectedUniversity);
  const cssVars = {
    '--primary-color': uni.primaryColor,
    '--secondary-color': uni.secondaryColor,
  } as React.CSSProperties;

  // Step 1: choose auth method
  if (!authMethod) {
    return (
      <div className={styles.container} style={cssVars}>
        <header className={styles.header}>
          <button
            className={styles.backBtn}
            onClick={() => {
              localStorage.removeItem('selectedUniversity');
              router.push('/');
            }}
          >
            ← Back
          </button>
          <div>
            <div className={styles.logo}>🎓 PaceMatch</div>
            <p className={styles.uniName}>{uni.name}</p>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.authCard}>
            <h1>Sign In or Create Account</h1>
            <p>Choose how you&apos;d like to authenticate</p>

            <div className={styles.methodsGrid}>
              <button className={styles.methodCard} onClick={() => setAuthMethod('email')}>
                <div className={styles.methodIcon}>📧</div>
                <h3>Email Login</h3>
                <p>Sign in with your email address</p>
                <span className={styles.arrow}>→</span>
              </button>

              <button className={styles.methodCard} onClick={() => setAuthMethod('netid')}>
                <div className={styles.methodIcon}>🎓</div>
                <h3>NetID / Student ID</h3>
                <p>Sign in with your school credentials</p>
                <span className={styles.arrow}>→</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Step 2-3: Sign In / Sign Up / Reset
  return (
    <div className={styles.container} style={cssVars}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => setAuthMethod(null)}>
          ← Back
        </button>
        <div>
          <div className={styles.logo}>🎓 PaceMatch</div>
          <p className={styles.uniName}>{uni.name}</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.authCard}>
          <h2>
            {mode === 'signin'
              ? authMethod === 'email'
                ? 'Email Sign In'
                : 'NetID Sign In'
              : mode === 'signup'
                ? authMethod === 'email'
                  ? 'Create Email Account'
                  : 'Create NetID Account'
                : 'Reset Password'}
          </h2>
          <p>
            {mode === 'signin'
              ? 'Enter your credentials to continue'
              : mode === 'signup'
                ? 'Create your account to get started'
                : 'Follow the steps to recover access'}
          </p>

          {mode === 'reset' ? (
            <form onSubmit={handleReset}>
              <div className={styles.formGroup}>
                <label>{authMethod === 'email' ? 'Email Address' : 'NetID'}</label>
                <input
                  type="text"
                  value={authMethod === 'email' ? email : netId}
                  onChange={(e) =>
                    authMethod === 'email' ? setEmail(e.target.value) : setNetId(e.target.value)
                  }
                  placeholder={authMethod === 'email' ? 'your.email@example.com' : 'e.g., jsmith'}
                  required
                  disabled={loading || resetStep === 'verify'}
                />
              </div>

              {resetStep === 'verify' && (
                <>
                  <div className={styles.formGroup}>
                    <label>Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      required
                      disabled={loading}
                    />
                    <p className={styles.fieldHint}>Check console for OTP (Demo: 123456)</p>
                  </div>
                  <div className={styles.formGroup}>
                    <label>New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New Password"
                      required
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {error && <p className={styles.error}>{error}</p>}
              {resetMessage && (
                <p
                  className={styles.success}
                  style={{ color: 'green', fontSize: '0.9rem', marginBottom: '15px' }}
                >
                  {resetMessage}
                </p>
              )}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Processing...' : resetStep === 'request' ? 'Send OTP' : 'Reset Password'}
              </button>

              <button
                type="button"
                className={styles.toggleBtn}
                style={{ marginTop: '15px', width: '100%' }}
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setResetStep('request');
                }}
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              {authMethod === 'email' ? (
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              ) : (
                <div className={styles.formGroup}>
                  <label htmlFor="netId">NetID / Student ID</label>
                  <input
                    id="netId"
                    type="text"
                    value={netId}
                    onChange={(e) => setNetId(e.target.value)}
                    placeholder="e.g., jsmith"
                    required
                    disabled={loading}
                  />
                  <p className={styles.fieldHint}>Your unique identifier at {uni.name}</p>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              )}

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={
                  loading ||
                  !password ||
                  (!email && !netId) ||
                  (mode === 'signup' && !confirmPassword)
                }
              >
                {loading
                  ? 'Processing...'
                  : mode === 'signin'
                    ? 'Sign In'
                    : 'Create Account'}
              </button>

              {mode === 'signin' && (
                <p className={styles.helpText}>
                  Forgot your password?{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode('reset');
                      setError('');
                      setResetMessage('');
                    }}
                  >
                    Reset it here
                  </a>
                </p>
              )}
            </form>
          )}

          {mode !== 'reset' && (
            <div className={styles.toggleMode}>
              <p>
                {mode === 'signin' ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      className={styles.toggleBtn}
                      onClick={() => {
                        setMode('signup');
                        setError('');
                      }}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className={styles.toggleBtn}
                      onClick={() => {
                        setMode('signin');
                        setError('');
                        setConfirmPassword('');
                      }}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
