'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/locale-context';
import { Briefcase, Cpu, GraduationCap, HeartHandshake, Palette, Dumbbell, Activity, Leaf } from 'lucide-react';
import type { ProjectCategory } from '@/types';

const categories: { id: ProjectCategory; icon: React.ElementType; color: string }[] = [
    { id: 'business', icon: Briefcase, color: '#f59e0b' },
    { id: 'technology', icon: Cpu, color: '#3b82f6' },
    { id: 'education', icon: GraduationCap, color: '#8b5cf6' },
    { id: 'social', icon: HeartHandshake, color: '#10b981' },
    { id: 'creative', icon: Palette, color: '#ec4899' },
    { id: 'sport', icon: Dumbbell, color: '#f97316' },
    { id: 'health', icon: Activity, color: '#06b6d4' },
    { id: 'ecology', icon: Leaf, color: '#22c55e' },
];

export default function Categories() {
    const { t } = useLocale();

    return (
        <section style={{ padding: '80px 0', background: '#0e0e0e', position: 'relative' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '48px' }}
                >
                    <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                        {t.sections.categories}
                    </h2>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>Найдите проекты по интересам</p>
                    <div style={{ width: '48px', height: '3px', background: '#a3e635', borderRadius: '4px', margin: '0 auto' }} />
                </motion.div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                    {categories.map((cat, index) => {
                        const Icon = cat.icon;
                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                whileHover={{ y: -5 }}
                            >
                                <Link
                                    href={`/projects?category=${cat.id}`}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        width: '160px', padding: '32px 16px',
                                        borderRadius: '24px', background: '#141414', border: '1px solid #222',
                                        textDecoration: 'none', transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                                    }}
                                >
                                    {/* Subtle Ornament Decoration */}
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                                        <svg width="60" height="60" viewBox="0 0 100 100">
                                            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill={cat.color} />
                                        </svg>
                                    </div>

                                    <div style={{
                                        width: '60px', height: '60px', borderRadius: '16px',
                                        background: `${cat.color}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                                        border: `1px solid ${cat.color}30`
                                    }}>
                                        <Icon style={{ width: '28px', height: '28px', color: cat.color }} />
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '4px' }}>
                                        {t.categories[cat.id]}
                                    </span>
                                    <span style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Проекты
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
