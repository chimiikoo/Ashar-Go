'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Rocket, Loader2, User, Mail, Lock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';
import { useAuth } from '@/lib/auth-context';
import { getApiUrl } from '@/lib/api';

function FloatingOrb({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
    return (
        <motion.div
            style={{
                position: 'absolute', left: x, top: y,
                width: size, height: size, borderRadius: '50%',
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                filter: 'blur(40px)', pointerEvents: 'none',
            }}
            animate={{ y: [0, -30, 0], scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
        />
    );
}

const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
const strengthLabels = ['Слабый', 'Средний', 'Хороший', 'Сильный'];

function getPasswordStrength(pwd: string) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
}

export default function RegisterPage() {
    const { t } = useLocale();
    const router = useRouter();
    const { login } = useAuth();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(0); // 0 = form, 1 = success

    const strength = getPasswordStrength(password);
    const passwordMatch = confirmPassword && password === confirmPassword;

    // Particle trail on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[] = [];
        let raf: number;

        const addParticle = (x: number, y: number) => {
            if (Math.random() > 0.3) return;
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5 - 1,
                life: 0, maxLife: 60 + Math.random() * 40,
                size: 2 + Math.random() * 3
            });
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy; p.life++;
                if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
                const alpha = (1 - p.life / p.maxLife) * 0.6;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(163,230,53,${alpha})`;
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };
        draw();

        const handleMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            addParticle(e.clientX - rect.left, e.clientY - rect.top);
        };
        window.addEventListener('mousemove', handleMove);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', handleMove); };
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) { setError(t.auth.passwordsDoNotMatch); return; }
        if (strength < 2) { setError('Пароль слишком слабый'); return; }
        try {
            setLoading(true);
            const res = await fetch(getApiUrl('/api/auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');
            login(data.token, data.user);
            setStep(1);
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = (focused: boolean, valid?: boolean): React.CSSProperties => ({
        width: '100%', padding: '14px 16px 14px 48px',
        borderRadius: '14px', background: '#0e0e0e',
        border: `1px solid ${valid ? 'rgba(34,197,94,0.4)' : focused ? 'rgba(163,230,53,0.4)' : '#1e1e1e'}`,
        color: '#fff', fontSize: '15px', outline: 'none',
        boxSizing: 'border-box', transition: 'all 0.25s ease',
        boxShadow: focused ? `0 0 0 3px ${valid ? 'rgba(34,197,94,0.08)' : 'rgba(163,230,53,0.08)'}` : 'none',
    });

    const [focusedField, setFocusedField] = useState('');

    return (
        <div style={{
            minHeight: '100vh', background: '#080808',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '80px 16px 40px', position: 'relative', overflow: 'hidden',
        }}>
            {/* Particle canvas */}
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />

            {/* Decorative orbs */}
            <FloatingOrb x="5%" y="20%" size={300} delay={0} color="rgba(163,230,53,0.08)" />
            <FloatingOrb x="70%" y="60%" size={250} delay={2} color="rgba(59,130,246,0.06)" />
            <FloatingOrb x="40%" y="80%" size={200} delay={4} color="rgba(139,92,246,0.05)" />

            {/* Background grid */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(163,230,53,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(163,230,53,0.02) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
            }} />

            <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}
            >
                <AnimatePresence mode="wait">
                    {step === 0 ? (
                        <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '28px' }}>
                                    <div style={{
                                        width: '46px', height: '46px', borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 8px 24px rgba(163,230,53,0.3)',
                                    }}>
                                        <Rocket style={{ width: '22px', height: '22px', color: '#0a0a0a' }} />
                                    </div>
                                    <span style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
                                        Ashar<span style={{ color: '#a3e635' }}>-go</span>
                                    </span>
                                </Link>

                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '5px 14px', borderRadius: '20px',
                                    background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.15)',
                                    fontSize: '11px', color: '#a3e635', letterSpacing: '2px',
                                    textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px',
                                }}>
                                    <Sparkles style={{ width: '11px', height: '11px' }} />
                                    Регистрация
                                </div>

                                <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', marginBottom: '8px', letterSpacing: '-0.03em' }}>
                                    Создайте аккаунт
                                </h1>
                                <p style={{ fontSize: '13px', color: '#555' }}>
                                    Уже есть аккаунт?{' '}
                                    <Link href="/auth/login" style={{ color: '#a3e635', textDecoration: 'none', fontWeight: 600 }}>
                                        Войти
                                    </Link>
                                </p>
                            </div>

                            {/* Card */}
                            <div style={{
                                borderRadius: '24px', background: '#0d0d0d',
                                border: '1px solid #1a1a1a',
                                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                                overflow: 'hidden',
                                position: 'relative',
                            }}>
                                {/* Top glow */}
                                <div style={{
                                    height: '2px',
                                    background: 'linear-gradient(to right, transparent, rgba(163,230,53,0.5), transparent)',
                                }} />

                                <div style={{ padding: '28px' }}>
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginBottom: '20px' }}
                                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                style={{
                                                    padding: '12px 16px', borderRadius: '12px',
                                                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                                    color: '#ef4444', fontSize: '13px', fontWeight: 500,
                                                    display: 'flex', gap: '8px', alignItems: 'flex-start',
                                                }}
                                            >
                                                ⚠️ {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={handleRegister}>
                                        {/* Name */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                                Имя
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#444', pointerEvents: 'none' }} />
                                                <input
                                                    type="text" value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    onFocus={() => setFocusedField('name')}
                                                    onBlur={() => setFocusedField('')}
                                                    placeholder="Айбек Токтосунов"
                                                    required
                                                    style={inputStyle(focusedField === 'name', name.length > 1)}
                                                />
                                                {name.length > 1 && (
                                                    <CheckCircle2 style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#22c55e' }} />
                                                )}
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                                Email
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#444', pointerEvents: 'none' }} />
                                                <input
                                                    type="email" value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField('')}
                                                    placeholder="aybekm@example.com"
                                                    required
                                                    style={inputStyle(focusedField === 'email', /\S+@\S+\.\S+/.test(email))}
                                                />
                                                {/\S+@\S+\.\S+/.test(email) && (
                                                    <CheckCircle2 style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#22c55e' }} />
                                                )}
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                                Пароль
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#444', pointerEvents: 'none' }} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField('')}
                                                    placeholder="Минимум 8 символов"
                                                    required
                                                    style={{ ...inputStyle(focusedField === 'password'), paddingRight: '48px' }}
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                                                    color: '#444', display: 'flex',
                                                }}>
                                                    {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                                                </button>
                                            </div>

                                            {/* Strength meter */}
                                            {password && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '10px' }}>
                                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                                                        {[1, 2, 3, 4].map(i => (
                                                            <div key={i} style={{
                                                                flex: 1, height: '3px', borderRadius: '2px',
                                                                background: i <= strength ? strengthColors[strength - 1] : '#1e1e1e',
                                                                transition: 'background 0.3s ease',
                                                            }} />
                                                        ))}
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ fontSize: '11px', color: strengthColors[strength - 1] || '#555' }}>
                                                            {strengthLabels[strength - 1] || 'Введите пароль'}
                                                        </span>
                                                        <span style={{ fontSize: '11px', color: '#444' }}>{password.length} символов</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Confirm password */}
                                        <div style={{ marginBottom: '24px' }}>
                                            <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                                Подтвердить пароль
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#444', pointerEvents: 'none' }} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={e => setConfirmPassword(e.target.value)}
                                                    onFocus={() => setFocusedField('confirm')}
                                                    onBlur={() => setFocusedField('')}
                                                    placeholder="Повторите пароль"
                                                    required
                                                    style={inputStyle(focusedField === 'confirm', !!passwordMatch)}
                                                />
                                                {confirmPassword && (
                                                    passwordMatch
                                                        ? <CheckCircle2 style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#22c55e' }} />
                                                        : <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>✗</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                width: '100%', padding: '16px',
                                                borderRadius: '16px', border: 'none',
                                                background: loading ? '#555' : 'linear-gradient(135deg, #a3e635, #7bc820)',
                                                color: '#0a0a0a', fontSize: '15px', fontWeight: 800,
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                transition: 'all 0.25s ease',
                                                boxShadow: loading ? 'none' : '0 8px 24px rgba(163,230,53,0.3)',
                                                position: 'relative', overflow: 'hidden',
                                            }}
                                        >
                                            {!loading && (
                                                <div style={{
                                                    position: 'absolute', inset: 0,
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)',
                                                }} />
                                            )}
                                            {loading
                                                ? <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                                                : <><Rocket style={{ width: '17px', height: '17px' }} /> Создать аккаунт <ArrowRight style={{ width: '15px', height: '15px' }} /></>
                                            }
                                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
                                {['Бесплатно', 'Без скрытых комиссий', 'Безопасно'].map((text, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <CheckCircle2 style={{ width: '12px', height: '12px', color: '#a3e635' }} />
                                        <span style={{ fontSize: '11px', color: '#555' }}>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            style={{ textAlign: 'center', padding: '60px 20px' }}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    boxShadow: '0 16px 48px rgba(163,230,53,0.4)',
                                }}
                            >
                                <CheckCircle2 style={{ width: '40px', height: '40px', color: '#0a0a0a' }} />
                            </motion.div>
                            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Добро пожаловать!</h2>
                            <p style={{ fontSize: '14px', color: '#666' }}>Перенаправляем в ваш кабинет...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
