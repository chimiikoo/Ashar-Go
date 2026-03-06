'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, HeartHandshake } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';

// Particle system
function useParticles(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 3,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 5,
        opacity: 0.1 + Math.random() * 0.5,
    }));
}

// Kyrgyz ornament SVG
function KyrgyzOrn({ size = 160, opacity = 0.12, rotate = 0 }: { size?: number; opacity?: number; rotate?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ opacity, transform: `rotate(${rotate}deg)` }}>
            <g stroke="#a3e635" strokeWidth="1">
                <polygon points="60,10 100,60 60,110 20,60" fill="none" />
                <polygon points="60,25 85,60 60,95 35,60" fill="none" />
                <polygon points="60,40 75,60 60,80 45,60" fill="rgba(163,230,53,0.08)" />
                <line x1="60" y1="10" x2="60" y2="0" /><line x1="60" y1="110" x2="60" y2="120" />
                <line x1="10" y1="60" x2="0" y2="60" /><line x1="110" y1="60" x2="120" y2="60" />
                <polygon points="60,0 63,5 60,10 57,5" fill="#a3e635" fillOpacity="0.5" />
                <polygon points="60,110 63,115 60,120 57,115" fill="#a3e635" fillOpacity="0.5" />
                <polygon points="0,60 5,57 10,60 5,63" fill="#a3e635" fillOpacity="0.5" />
                <polygon points="110,60 115,57 120,60 115,63" fill="#a3e635" fillOpacity="0.5" />
                <path d="M20,20 L30,20 L30,30" fill="none" strokeLinecap="round" />
                <path d="M100,20 L90,20 L90,30" fill="none" strokeLinecap="round" />
                <path d="M20,100 L30,100 L30,90" fill="none" strokeLinecap="round" />
                <path d="M100,100 L90,100 L90,90" fill="none" strokeLinecap="round" />
            </g>
        </svg>
    );
}

// Animated counter
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started.current) {
                started.current = true;
                const start = Date.now();
                const dur = 2000;
                const tick = () => {
                    const p = Math.min((Date.now() - start) / dur, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    setCount(Math.floor(ease * target));
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    const fmt = count >= 1000000 ? (count / 1000000).toFixed(1) + 'M' : count >= 1000 ? (count / 1000).toFixed(1) + 'K' : count.toString();
    return <span ref={ref}>{fmt}{suffix}</span>;
}

export default function HeroSection() {
    const { t } = useLocale();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const particles = useParticles(30);

    const fullText = t.hero.title || 'Цифровой Асар — поддержи или запусти проект';

    // Typing effect for title
    useEffect(() => {
        let i = 0;
        setTypedText('');
        const interval = setInterval(() => {
            if (i <= fullText.length) {
                setTypedText(fullText.slice(0, i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 40);
        return () => clearInterval(interval);
    }, [fullText]);

    // Blinking cursor
    useEffect(() => {
        const t = setInterval(() => setShowCursor(c => !c), 530);
        return () => clearInterval(t);
    }, []);

    // Mouse parallax
    useEffect(() => {
        const h = (e: MouseEvent) => {
            setMouseX((e.clientX / window.innerWidth - 0.5) * 30);
            setMouseY((e.clientY / window.innerHeight - 0.5) * 30);
        };
        window.addEventListener('mousemove', h);
        return () => window.removeEventListener('mousemove', h);
    }, []);

    // Canvas aurora / wave background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let frame = 0;
        let raf: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const t = frame * 0.008;

            // Aurora waves
            for (let i = 0; i < 4; i++) {
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.4 + i * 0.05, `rgba(163,230,53,${0.015 + i * 0.005})`);
                gradient.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.moveTo(0, canvas.height * 0.3);
                for (let x = 0; x <= canvas.width; x += 4) {
                    const y = canvas.height * (0.35 + i * 0.08) +
                        Math.sin(x * 0.003 + t + i) * 60 +
                        Math.sin(x * 0.007 - t * 0.7 + i * 2) * 30;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();
                ctx.fillStyle = gradient;
                ctx.fill();
            }
            frame++;
            raf = requestAnimationFrame(draw);
        };

        draw();
        const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
    }, []);

    const stats = [
        { value: 156, suffix: '+', label: 'Проектов' },
        { value: 4500, suffix: '+', label: 'Бэкеров' },
        { value: 12000000, suffix: '', label: 'Сом собрано' },
    ];

    return (
        <section style={{
            minHeight: 'calc(100vh - 68px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', background: '#0a0a0a',
        }}>
            {/* Aurora canvas */}
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

            {/* Grid overlay */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(163,230,53,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(163,230,53,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
            }} />

            {/* Floating particles */}
            {particles.map(p => (
                <div key={p.id} style={{
                    position: 'absolute',
                    left: `${p.x}%`, top: `${p.y}%`,
                    width: `${p.size}px`, height: `${p.size}px`,
                    borderRadius: '50%',
                    background: '#a3e635',
                    opacity: p.opacity,
                    animation: `particleFloat ${p.duration}s ease-in-out infinite`,
                    animationDelay: `${p.delay}s`,
                    pointerEvents: 'none',
                }} />
            ))}

            {/* Glow spheres */}
            <div style={{
                position: 'absolute', top: '10%', left: '5%',
                width: '500px', height: '500px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(163,230,53,0.06) 0%, transparent 70%)',
                filter: 'blur(60px)',
                transform: `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)`,
                transition: 'transform 0.3s ease',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '10%', right: '5%',
                width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(100,180,255,0.04) 0%, transparent 70%)',
                filter: 'blur(80px)',
                transform: `translate(${-mouseX * 0.3}px, ${-mouseY * 0.3}px)`,
                transition: 'transform 0.3s ease',
                pointerEvents: 'none',
            }} />

            {/* Kyrgyz ornaments — corners */}
            <div style={{
                position: 'absolute', top: '-20px', left: '-20px',
                transform: `translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`,
                transition: 'transform 0.4s ease',
            }}>
                <KyrgyzOrn size={200} opacity={0.15} />
            </div>
            <div style={{
                position: 'absolute', top: '-20px', right: '-20px',
                transform: `scaleX(-1) translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`,
                transition: 'transform 0.4s ease',
            }}>
                <KyrgyzOrn size={200} opacity={0.15} />
            </div>
            <div style={{
                position: 'absolute', bottom: '-20px', left: '-20px',
                transform: `scaleY(-1) translate(${mouseX * 0.1}px, ${-mouseY * 0.1}px)`,
                transition: 'transform 0.4s ease',
            }}>
                <KyrgyzOrn size={160} opacity={0.08} />
            </div>
            <div style={{
                position: 'absolute', bottom: '-20px', right: '-20px',
                transform: `scale(-1) translate(${mouseX * 0.1}px, ${-mouseY * 0.1}px)`,
                transition: 'transform 0.4s ease',
            }}>
                <KyrgyzOrn size={160} opacity={0.08} />
            </div>

            {/* Spinning ring decorations */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 'min(700px, 90vw)', height: 'min(700px, 90vw)',
                marginLeft: 'calc(-1 * min(350px, 45vw))', marginTop: 'calc(-1 * min(350px, 45vw))',
                border: '1px solid rgba(163,230,53,0.04)',
                borderTopColor: 'rgba(163,230,53,0.12)',
                borderRadius: '50%',
                animation: 'heroSpin 30s linear infinite',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 'min(500px, 70vw)', height: 'min(500px, 70vw)',
                marginLeft: 'calc(-1 * min(250px, 35vw))', marginTop: 'calc(-1 * min(250px, 35vw))',
                border: '1px dashed rgba(163,230,53,0.05)',
                borderRadius: '50%',
                animation: 'heroSpin 20s linear infinite reverse',
                pointerEvents: 'none',
            }} />

            <style>{`
                @keyframes particleFloat {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: var(--op, 0.3); }
                    50% { transform: translateY(-25px) scale(1.3); opacity: calc(var(--op, 0.3) * 1.8); }
                }
                @keyframes heroSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes badgePulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(163,230,53,0.3); }
                    50% { box-shadow: 0 0 0 8px rgba(163,230,53,0); }
                }
                @keyframes lineGrow {
                    from { width: 0; }
                    to { width: 100%; }
                }
                .hero-btn-primary:hover {
                    transform: translateY(-3px) scale(1.02) !important;
                    box-shadow: 0 16px 48px rgba(163,230,53,0.4) !important;
                }
                .hero-btn-secondary:hover {
                    border-color: rgba(163,230,53,0.4) !important;
                    color: #a3e635 !important;
                    transform: translateY(-2px) !important;
                }
                .stat-card:hover {
                    border-color: rgba(163,230,53,0.3) !important;
                    transform: translateY(-4px) !important;
                    background: #111 !important;
                }
            `}</style>

            {/* Main content */}
            <div style={{
                position: 'relative', zIndex: 10,
                maxWidth: '860px', margin: '0 auto',
                padding: '100px 24px 60px',
                textAlign: 'center',
            }}>
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        padding: '10px 22px', borderRadius: '50px',
                        background: 'rgba(163,230,53,0.08)',
                        border: '1px solid rgba(163,230,53,0.2)',
                        marginBottom: '40px',
                        animation: 'badgePulse 3s ease-in-out infinite',
                        cursor: 'default',
                    }}
                >
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#a3e635',
                        boxShadow: '0 0 8px #a3e635',
                        animation: 'badgePulse 1.5s ease-in-out infinite',
                    }} />
                    <HeartHandshake style={{ width: '15px', height: '15px', color: '#a3e635' }} />
                    <span style={{ fontSize: '13px', color: '#a3e635', fontWeight: 600, letterSpacing: '0.3px' }}>
                        {t.hero.badge}
                    </span>
                </motion.div>

                {/* Typed heading */}
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    style={{
                        fontSize: 'clamp(36px, 6vw, 68px)',
                        fontWeight: 900,
                        lineHeight: 1.08,
                        marginBottom: '28px',
                        letterSpacing: '-0.04em',
                        minHeight: 'clamp(90px, 14vw, 160px)',
                    }}
                >
                    {(() => {
                        // Split the full title at a natural break — last 2 words go green
                        const words = fullText.split(' ');
                        const breakAt = Math.max(1, words.length - 2);
                        const whiteText = words.slice(0, breakAt).join(' ');
                        const greenText = words.slice(breakAt).join(' ');

                        // How much of each part has been typed
                        const whitePart = typedText.slice(0, Math.min(typedText.length, whiteText.length));
                        const greenStart = whiteText.length + 1; // +1 for space
                        const greenPart = typedText.length > greenStart
                            ? typedText.slice(greenStart, greenStart + greenText.length)
                            : '';

                        return (
                            <>
                                <span style={{ color: '#fff' }}>
                                    {whitePart}
                                    {typedText.length <= whiteText.length ? '' : ' '}
                                </span>
                                <span style={{
                                    background: 'linear-gradient(135deg, #a3e635, #c8f56a)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>
                                    {greenPart}
                                </span>
                                <span style={{
                                    color: '#a3e635',
                                    WebkitTextFillColor: '#a3e635',
                                    opacity: showCursor && typedText.length < fullText.length ? 1 : 0,
                                    transition: 'opacity 0.1s',
                                }}>|</span>
                            </>
                        );
                    })()}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    style={{
                        fontSize: 'clamp(15px, 2vw, 18px)',
                        color: '#777',
                        maxWidth: '580px', margin: '0 auto 48px',
                        lineHeight: 1.75,
                    }}
                >
                    {t.hero.subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.0 }}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '16px', flexWrap: 'wrap', marginBottom: '72px',
                    }}
                >
                    <Link href="/create" className="hero-btn-primary" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        padding: '17px 36px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                        color: '#0a0a0a', fontSize: '16px', fontWeight: 800,
                        textDecoration: 'none', transition: 'all 0.25s ease',
                        boxShadow: '0 8px 28px rgba(163,230,53,0.3)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <span style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)',
                        }} />
                        {t.hero.launchProject}
                        <ArrowRight style={{ width: '18px', height: '18px' }} />
                    </Link>

                    <Link href="/projects" className="hero-btn-secondary" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        padding: '17px 36px', borderRadius: '16px',
                        background: 'rgba(255,255,255,0.03)', color: '#ccc',
                        fontSize: '16px', fontWeight: 600, textDecoration: 'none',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.25s ease',
                    }}>
                        {t.hero.supportProject}
                    </Link>
                </motion.div>

                {/* Animated stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
                >
                    {stats.map((s, i) => (
                        <div key={i} className="stat-card" style={{
                            padding: '20px 28px', borderRadius: '18px',
                            background: '#0e0e0e', border: '1px solid #1e1e1e',
                            textAlign: 'center', transition: 'all 0.3s ease',
                            minWidth: '120px',
                        }}>
                            <div style={{
                                fontSize: 'clamp(22px, 4vw, 30px)',
                                fontWeight: 800, color: '#fff', lineHeight: 1,
                                marginBottom: '6px',
                            }}>
                                <Counter target={s.value} suffix={s.suffix} />
                            </div>
                            <div style={{
                                fontSize: '11px', color: '#555',
                                textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500,
                            }}>
                                {s.label}
                            </div>
                            <div style={{
                                width: '100%', height: '2px',
                                background: 'linear-gradient(to right, transparent, #a3e635, transparent)',
                                borderRadius: '1px', marginTop: '10px',
                                opacity: 0.4,
                                animation: 'lineGrow 1.5s ease forwards',
                                animationDelay: `${1.5 + i * 0.2}s`,
                            }} />
                        </div>
                    ))}
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1 }}
                    style={{
                        position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    }}
                >
                    <span style={{ fontSize: '11px', color: '#444', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
                    <div style={{
                        width: '22px', height: '36px', borderRadius: '11px',
                        border: '1px solid #333', display: 'flex', alignItems: 'flex-start',
                        justifyContent: 'center', padding: '4px',
                    }}>
                        <div style={{
                            width: '4px', height: '8px', borderRadius: '2px',
                            background: '#a3e635',
                            animation: 'scrollDot 2s ease-in-out infinite',
                        }} />
                    </div>
                    <style>{`
                        @keyframes scrollDot {
                            0% { transform: translateY(0); opacity: 1; }
                            100% { transform: translateY(16px); opacity: 0; }
                        }
                    `}</style>
                </motion.div>
            </div>
        </section>
    );
}
