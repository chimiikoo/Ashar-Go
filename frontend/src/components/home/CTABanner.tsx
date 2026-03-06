'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Rocket, Zap } from 'lucide-react';

// Kyrgyz ornament mini
function MiniOrn({ opacity = 0.2 }: { opacity?: number }) {
    return (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ opacity }}>
            <g stroke="#a3e635" strokeWidth="1">
                <polygon points="40,8 64,40 40,72 16,40" fill="none" />
                <polygon points="40,20 54,40 40,60 26,40" fill="none" />
                <polygon points="40,32 48,40 40,48 32,40" fill="rgba(163,230,53,0.1)" />
                <line x1="40" y1="8" x2="40" y2="0" /><line x1="40" y1="72" x2="40" y2="80" />
                <line x1="8" y1="40" x2="0" y2="40" /><line x1="72" y1="40" x2="80" y2="40" />
            </g>
        </svg>
    );
}

export default function CTABanner() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hovered, setHovered] = useState(false);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let frame = 0;
        let raf: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const t = frame * 0.012;
            for (let i = 0; i < 3; i++) {
                const x = canvas.width * (0.2 + i * 0.3);
                const y = canvas.height * 0.5 + Math.sin(t + i * 1.2) * 30;
                const g = ctx.createRadialGradient(x, y, 0, x, y, 120 + i * 30);
                g.addColorStop(0, `rgba(163,230,53,${0.08 + i * 0.015})`);
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x, y, 150, 0, Math.PI * 2);
                ctx.fill();
            }
            frame++;
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);

    return (
        <section
            onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMouseX((e.clientX - rect.left - rect.width / 2) * 0.02);
                setMouseY((e.clientY - rect.top - rect.height / 2) * 0.02);
            }}
            style={{ padding: '80px 24px', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}
        >
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div style={{
                        borderRadius: '28px',
                        border: '1px solid rgba(163,230,53,0.2)',
                        background: 'linear-gradient(135deg, rgba(163,230,53,0.04) 0%, rgba(163,230,53,0.01) 100%)',
                        backdropFilter: 'blur(20px)',
                        padding: 'clamp(40px, 6vw, 72px) clamp(32px, 6vw, 80px)',
                        textAlign: 'center',
                        position: 'relative', overflow: 'hidden',
                        transform: `translate(${mouseX}px, ${mouseY}px)`,
                        transition: 'transform 0.3s ease',
                    }}>
                        {/* Inner glow top */}
                        <div style={{
                            position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
                            background: 'linear-gradient(to right, transparent, rgba(163,230,53,0.6), transparent)',
                        }} />

                        {/* Ornaments */}
                        <div style={{ position: 'absolute', top: '16px', left: '16px', opacity: 0.15 }}><MiniOrn /></div>
                        <div style={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.15, transform: 'scaleX(-1)' }}><MiniOrn /></div>
                        <div style={{ position: 'absolute', bottom: '16px', left: '16px', opacity: 0.1, transform: 'scaleY(-1)' }}><MiniOrn /></div>
                        <div style={{ position: 'absolute', bottom: '16px', right: '16px', opacity: 0.1, transform: 'scale(-1)' }}><MiniOrn /></div>

                        {/* Rocket icon */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                width: '68px', height: '68px', borderRadius: '20px',
                                background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 28px',
                                boxShadow: '0 12px 40px rgba(163,230,53,0.4)',
                            }}
                        >
                            <Rocket style={{ width: '30px', height: '30px', color: '#0a0a0a' }} />
                        </motion.div>

                        <h2 style={{
                            fontSize: 'clamp(26px, 5vw, 48px)',
                            fontWeight: 900, color: '#fff',
                            marginBottom: '16px',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.1,
                        }}>
                            Воплоти идею в{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #a3e635, #c8f56a)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>жизнь</span>
                        </h2>

                        <p style={{
                            fontSize: 'clamp(14px, 2vw, 17px)',
                            color: '#777', maxWidth: '480px', margin: '0 auto 36px',
                            lineHeight: 1.7,
                        }}>
                            У тебя есть идея, которая может изменить жизни людей в Кыргызстане? Запусти проект прямо сейчас — без лишних сложностей.
                        </p>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link
                                href="/create"
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                                    padding: '16px 34px', borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                                    color: '#0a0a0a', fontWeight: 800, fontSize: '15px',
                                    textDecoration: 'none',
                                    transform: hovered ? 'translateY(-3px) scale(1.03)' : 'scale(1)',
                                    transition: 'all 0.25s ease',
                                    boxShadow: hovered ? '0 16px 48px rgba(163,230,53,0.45)' : '0 8px 24px rgba(163,230,53,0.25)',
                                    position: 'relative', overflow: 'hidden',
                                }}
                            >
                                <span style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
                                }} />
                                <Zap style={{ width: '16px', height: '16px' }} />
                                Запустить проект
                                <ArrowRight style={{ width: '16px', height: '16px' }} />
                            </Link>
                            <Link href="/projects" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                padding: '16px 34px', borderRadius: '16px',
                                background: 'transparent',
                                color: '#ccc', fontWeight: 600, fontSize: '15px',
                                textDecoration: 'none',
                                border: '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.25s ease',
                            }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(163,230,53,0.3)';
                                    (e.currentTarget as HTMLAnchorElement).style.color = '#a3e635';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
                                    (e.currentTarget as HTMLAnchorElement).style.color = '#ccc';
                                }}
                            >
                                Смотреть проекты
                            </Link>
                        </div>

                        {/* Stats strip */}
                        <div style={{
                            display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap',
                            marginTop: '40px', paddingTop: '32px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            {[
                                { n: '5 мин', label: 'до запуска проекта' },
                                { n: '0%', label: 'комиссии за публикацию' },
                                { n: '24/7', label: 'поддержка платформы' },
                            ].map((s, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#a3e635', lineHeight: 1 }}>{s.n}</div>
                                    <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
