'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { TrendingUp, Users, FolderOpen, CheckCircle } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';
import { platformStats } from '@/lib/data';

function AnimatedNumber({ value }: { value: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => {
        if (value >= 1000000) return (latest / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return (latest / 1000).toFixed(1) + 'K';
        return Math.round(latest).toString();
    });
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    animate(count, value, { duration: 2.2, ease: 'easeOut' });
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [count, value]);

    return <span ref={ref}><motion.span>{rounded}</motion.span></span>;
}

export default function Stats() {
    const { t } = useLocale();

    const stats = [
        { icon: FolderOpen, value: platformStats.totalProjects, label: t.stats.totalProjects, color: '#3b82f6', glow: 'rgba(59,130,246,0.15)', bg: 'rgba(59,130,246,0.08)' },
        { icon: CheckCircle, value: platformStats.totalFunded, label: t.stats.totalFunded, color: '#10b981', glow: 'rgba(16,185,129,0.15)', bg: 'rgba(16,185,129,0.08)' },
        { icon: Users, value: platformStats.totalBackers, label: t.stats.totalBackers, color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)', bg: 'rgba(139,92,246,0.08)' },
        { icon: TrendingUp, value: platformStats.totalRaised, label: t.stats.totalRaised, color: '#a3e635', glow: 'rgba(163,230,53,0.15)', bg: 'rgba(163,230,53,0.08)' },
    ];

    return (
        <section style={{ padding: '100px 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
            {/* Neon grid */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(163,230,53,0.025) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(163,230,53,0.025) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
            }} />

            {/* Big center glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '700px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(163,230,53,0.04) 0%, transparent 70%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />

            <style>{`
                .stat-item:hover .stat-icon-wrap {
                    transform: scale(1.15) rotate(-5deg);
                }
                .stat-item:hover {
                    border-color: var(--stat-color) !important;
                    transform: translateY(-6px) !important;
                }
                .stat-item:hover .stat-bar {
                    opacity: 1 !important;
                    width: 60% !important;
                }
            `}</style>

            <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '64px' }}
                >
                    <div style={{
                        display: 'inline-block', padding: '6px 16px', borderRadius: '20px',
                        background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.15)',
                        fontSize: '12px', color: '#a3e635', letterSpacing: '2px',
                        textTransform: 'uppercase', fontWeight: 600, marginBottom: '20px',
                    }}>
                        Достижения платформы
                    </div>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, color: '#fff', marginBottom: '10px', letterSpacing: '-0.02em' }}>
                        {t.sections.stats}
                    </h2>
                    <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>Наши достижения в цифрах</p>
                    <div style={{ width: '60px', height: '3px', background: 'linear-gradient(to right, #a3e635, #7bc820)', borderRadius: '2px', margin: '0 auto' }} />
                </motion.div>

                {/* Stats grid */}
                <div style={{
                    display: 'grid', gap: '16px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                }}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                className="stat-item"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                style={{
                                    borderRadius: '24px',
                                    background: '#0d0d0d',
                                    border: '1px solid #1e1e1e',
                                    padding: '32px 24px',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.35s ease',
                                    cursor: 'default',
                                    ['--stat-color' as string]: stat.color,
                                }}
                            >
                                {/* Top glow spot */}
                                <div style={{
                                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                                    width: '100%', height: '60px',
                                    background: `radial-gradient(ellipse at 50% 0%, ${stat.glow} 0%, transparent 80%)`,
                                    pointerEvents: 'none',
                                }} />

                                {/* Icon */}
                                <div
                                    className="stat-icon-wrap"
                                    style={{
                                        width: '56px', height: '56px', borderRadius: '18px',
                                        background: stat.bg,
                                        border: `1px solid ${stat.color}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 20px',
                                        transition: 'transform 0.35s ease',
                                    }}
                                >
                                    <Icon style={{ width: '24px', height: '24px', color: stat.color }} />
                                </div>

                                {/* Number */}
                                <div style={{
                                    fontSize: 'clamp(28px, 5vw, 38px)',
                                    fontWeight: 800, color: '#fff',
                                    marginBottom: '6px', lineHeight: 1,
                                    letterSpacing: '-0.03em',
                                }}>
                                    <AnimatedNumber value={stat.value} />
                                </div>

                                {/* Label */}
                                <div style={{ fontSize: '12px', color: '#777', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {stat.label}
                                </div>

                                {/* Bottom bar */}
                                <div className="stat-bar" style={{
                                    height: '2px', borderRadius: '1px',
                                    background: `linear-gradient(to right, ${stat.color}, ${stat.color}40)`,
                                    marginTop: '20px', opacity: 0.25, width: '30%',
                                    margin: '20px auto 0',
                                    transition: 'all 0.4s ease',
                                }} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
