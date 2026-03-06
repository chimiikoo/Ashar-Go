'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Rocket, Loader2 } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';
import { useAuth } from '@/lib/auth-context';
import { getApiUrl } from '@/lib/api';

export default function LoginPage() {
    const { t } = useLocale();
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Введите email и пароль');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(getApiUrl('/api/auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Ошибка входа');
            }

            login(data.token, data.user);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Ошибка сервера при входе');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 16px 40px', background: '#0a0a0a' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '440px' }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#a3e635', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Rocket style={{ width: '22px', height: '22px', color: '#0a0a0a' }} />
                        </div>
                        <span style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>
                            Ashar<span style={{ color: '#a3e635' }}>-go</span>
                        </span>
                    </Link>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', marginTop: '16px' }}>{t.auth.login}</h1>
                    <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>Войдите в свой аккаунт</p>
                </div>

                {/* Card */}
                <div style={{
                    borderRadius: '20px',
                    background: '#141414',
                    border: '1px solid #2a2a2a',
                    padding: '32px',
                }}>
                    {error && (
                        <div style={{
                            marginBottom: '20px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            color: '#ef4444',
                            fontSize: '14px',
                            textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '8px', fontWeight: 500 }}>
                                {t.auth.email}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    background: '#1e1e1e',
                                    border: '1px solid #333',
                                    color: '#fff',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#a3e635'}
                                onBlur={(e) => e.target.style.borderColor = '#333'}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '8px', fontWeight: 500 }}>
                                {t.auth.password}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Введите пароль"
                                    style={{
                                        width: '100%',
                                        padding: '14px 48px 14px 16px',
                                        borderRadius: '12px',
                                        background: '#1e1e1e',
                                        border: '1px solid #333',
                                        color: '#fff',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#a3e635'}
                                    onBlur={(e) => e.target.style.borderColor = '#333'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#666',
                                        padding: '4px',
                                        display: 'flex',
                                    }}
                                >
                                    {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password */}
                        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                            <button type="button" style={{ background: 'none', border: 'none', color: '#a3e635', fontSize: '13px', cursor: 'pointer' }}>
                                {t.auth.forgotPassword}
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '12px',
                                background: '#a3e635',
                                color: '#0a0a0a',
                                fontSize: '16px',
                                fontWeight: 600,
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'opacity 0.2s, transform 0.1s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            {loading ? <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> : t.auth.login}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
                        <span style={{ fontSize: '12px', color: '#666' }}>{t.auth.orContinueWith}</span>
                        <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
                    </div>

                    {/* Google */}
                    <button style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid #2a2a2a',
                        background: 'transparent',
                        color: '#ccc',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                    }}>
                        <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        {t.auth.google}
                    </button>

                    {/* Register link */}
                    <p style={{ textAlign: 'center', fontSize: '14px', color: '#888', marginTop: '20px' }}>
                        {t.auth.noAccount}{' '}
                        <Link href="/auth/register" style={{ color: '#a3e635', textDecoration: 'none', fontWeight: 500 }}>
                            {t.auth.register}
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
