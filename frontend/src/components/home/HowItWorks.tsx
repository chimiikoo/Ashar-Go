'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Share2, Banknote, ArrowRight } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';

export default function HowItWorks() {
    const { t } = useLocale();
    const [activeStep, setActiveStep] = useState<number | null>(null);

    const steps = [
        {
            icon: Lightbulb, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc,
            step: '01', color: '#3b82f6', glow: 'rgba(59,130,246,0.2)',
            detail: 'Опишите идею, поставьте цель и выберите категорию — всего за 5 минут.',
        },
        {
            icon: Share2, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc,
            step: '02', color: '#a3e635', glow: 'rgba(163,230,53,0.2)',
            detail: 'Поделитесь с друзьями и сообществом. Наша система поможет охватить аудиторию.',
        },
        {
            icon: Banknote, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc,
            step: '03', color: '#10b981', glow: 'rgba(16,185,129,0.2)',
            detail: 'Получайте поддержку и реализуйте проект. Деньги поступают напрямую.',
        },
    ];

    return (
        <section id="how-it-works" style={{ padding: '100px 0', background: '#080808', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative bg lines */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(90deg, rgba(163,230,53,0.02) 0px, rgba(163,230,53,0.02) 1px, transparent 1px, transparent 80px)',
            }} />

            {/* Center glow */}
            <div style={{
                position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
                width: '600px', height: '300px', borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(163,230,53,0.04) 0%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '72px' }}
                >
                    <div style={{
                        display: 'inline-block', padding: '6px 16px', borderRadius: '20px',
                        background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.15)',
                        fontSize: '12px', color: '#a3e635', letterSpacing: '2px',
                        textTransform: 'uppercase', fontWeight: 600, marginBottom: '20px',
                    }}>
                        Как работает Ashar-go
                    </div>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, color: '#fff', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                        {t.sections.howItWorks}
                    </h2>
                    <p style={{ fontSize: '15px', color: '#555', marginBottom: '20px' }}>Три простых шага к воплощению идеи</p>
                    <div style={{
                        width: '60px', height: '3px', margin: '0 auto',
                        background: 'linear-gradient(to right, #a3e635, #7bc820)',
                        borderRadius: '2px',
                    }} />
                </motion.div>

                {/* Steps */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    position: 'relative',
                }}>
                    {/* Connector line */}
                    <div style={{
                        position: 'absolute', top: '60px', left: '16%', right: '16%', height: '1px',
                        background: 'linear-gradient(to right, transparent, rgba(163,230,53,0.2), rgba(163,230,53,0.4), rgba(163,230,53,0.2), transparent)',
                        pointerEvents: 'none',
                        display: 'none', // shown on large screens via CSS
                    }} />

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = activeStep === index;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                onMouseEnter={() => setActiveStep(index)}
                                onMouseLeave={() => setActiveStep(null)}
                                style={{
                                    position: 'relative',
                                    borderRadius: '24px',
                                    background: isActive ? '#0f0f0f' : '#0d0d0d',
                                    border: `1px solid ${isActive ? step.color + '40' : '#1e1e1e'}`,
                                    padding: '40px 28px 36px',
                                    textAlign: 'center',
                                    cursor: 'default',
                                    transition: 'all 0.35s ease',
                                    transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
                                    boxShadow: isActive ? `0 20px 60px ${step.glow}` : 'none',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Background glow on hover */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
                                    background: `radial-gradient(ellipse at 50% 0%, ${step.glow} 0%, transparent 70%)`,
                                    opacity: isActive ? 1 : 0,
                                    transition: 'opacity 0.35s ease',
                                    pointerEvents: 'none',
                                }} />

                                {/* Step number badge */}
                                <div style={{
                                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                                    padding: '5px 18px', borderRadius: '20px',
                                    background: '#080808', border: `1px solid ${isActive ? step.color + '60' : '#222'}`,
                                    transition: 'border-color 0.3s ease',
                                }}>
                                    <span style={{ fontSize: '11px', fontWeight: 800, color: isActive ? step.color : '#a3e635', letterSpacing: '3px' }}>
                                        {step.step}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div style={{
                                    width: '72px', height: '72px', borderRadius: '20px',
                                    background: isActive ? step.color : step.color + '18',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 24px',
                                    transition: 'all 0.35s ease',
                                    boxShadow: isActive ? `0 8px 24px ${step.glow}` : 'none',
                                }}>
                                    <Icon style={{ width: '30px', height: '30px', color: isActive ? '#fff' : step.color }} />
                                </div>

                                <h3 style={{
                                    fontSize: '19px', fontWeight: 700, color: '#fff',
                                    marginBottom: '12px', letterSpacing: '-0.02em',
                                }}>
                                    {step.title}
                                </h3>
                                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.65, marginBottom: '16px' }}>
                                    {step.desc}
                                </p>

                                {/* Expanded detail on hover */}
                                <div style={{
                                    overflow: 'hidden',
                                    maxHeight: isActive ? '60px' : '0',
                                    opacity: isActive ? 1 : 0,
                                    transition: 'all 0.35s ease',
                                }}>
                                    <p style={{
                                        fontSize: '13px', color: step.color, lineHeight: 1.6,
                                        padding: '12px 0 0',
                                        borderTop: `1px solid ${step.color}20`,
                                    }}>
                                        {step.detail}
                                    </p>
                                </div>

                                {/* Arrow icon */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '6px', marginTop: '16px',
                                    color: step.color, fontSize: '12px', fontWeight: 600,
                                    opacity: isActive ? 1 : 0.3,
                                    transition: 'opacity 0.3s ease',
                                }}>
                                    Узнать больше <ArrowRight style={{ width: '13px', height: '13px' }} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
