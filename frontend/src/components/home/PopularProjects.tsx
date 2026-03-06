'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Flame, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { mockProjects } from '@/lib/data';
import ProjectCard from '@/components/projects/ProjectCard';

export default function PopularProjects() {
    const { t } = useLocale();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollPos, setScrollPos] = useState(0);

    const popularProjects = mockProjects
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 6);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = 370;
        scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    const handleScroll = () => {
        if (scrollRef.current) setScrollPos(scrollRef.current.scrollLeft);
    };

    return (
        <section style={{ padding: '100px 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative top border */}
            <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(163,230,53,0.2), transparent)',
            }} />

            {/* Background pattern */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(163,230,53,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.02) 0%, transparent 40%)',
            }} />

            <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '5px 14px', borderRadius: '20px',
                            background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.15)',
                            fontSize: '11px', color: '#a3e635', letterSpacing: '2px',
                            textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px',
                        }}>
                            <Flame style={{ width: '12px', height: '12px' }} />
                            Популярные
                        </div>
                        <h2 style={{
                            fontSize: 'clamp(22px, 4vw, 36px)',
                            fontWeight: 800, color: '#fff',
                            marginBottom: '8px', letterSpacing: '-0.03em',
                        }}>
                            {t.sections.popularProjects}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#555' }}>Проекты, которые поддерживает больше всего людей</p>
                        <div style={{
                            width: '48px', height: '3px', marginTop: '12px',
                            background: 'linear-gradient(to right, #a3e635, #7bc820)',
                            borderRadius: '4px',
                        }} />
                    </motion.div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {[{ dir: 'left' as const, icon: ChevronLeft }, { dir: 'right' as const, icon: ChevronRight }].map(({ dir, icon: Ico }) => (
                            <button key={dir} onClick={() => scroll(dir)} style={{
                                width: '42px', height: '42px', borderRadius: '12px',
                                background: '#111', border: '1px solid #222',
                                color: '#888', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s ease',
                            }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(163,230,53,0.4)';
                                    (e.currentTarget as HTMLButtonElement).style.color = '#a3e635';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#222';
                                    (e.currentTarget as HTMLButtonElement).style.color = '#888';
                                }}
                            >
                                <Ico style={{ width: '18px', height: '18px' }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scroll container */}
                <div style={{ position: 'relative' }}>
                    {/* Left fade */}
                    <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px',
                        background: 'linear-gradient(to right, #0a0a0a, transparent)',
                        zIndex: 5, pointerEvents: 'none',
                        opacity: scrollPos > 10 ? 1 : 0, transition: 'opacity 0.3s',
                    }} />
                    {/* Right fade */}
                    <div style={{
                        position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px',
                        background: 'linear-gradient(to left, #0a0a0a, transparent)',
                        zIndex: 5, pointerEvents: 'none',
                    }} />

                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        style={{
                            display: 'flex', gap: '20px',
                            overflowX: 'auto', paddingBottom: '16px',
                            scrollSnapType: 'x mandatory',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        <style>{`.scroll-hide::-webkit-scrollbar { display: none; }`}</style>
                        {popularProjects.map((project, index) => (
                            <div key={project.id} style={{
                                width: '340px', flexShrink: 0,
                                scrollSnapAlign: 'start',
                            }}>
                                <ProjectCard project={project} index={index} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '24px' }}>
                    {popularProjects.map((_, i) => (
                        <div key={i} style={{
                            width: i === Math.round(scrollPos / 360) ? '20px' : '6px',
                            height: '6px', borderRadius: '3px',
                            background: i === Math.round(scrollPos / 360) ? '#a3e635' : '#222',
                            transition: 'all 0.3s ease',
                        }} />
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}
                >
                    <Link href="/projects" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        fontSize: '14px', color: '#a3e635', textDecoration: 'none',
                        fontWeight: 700, padding: '13px 26px', borderRadius: '14px',
                        background: 'rgba(163,230,53,0.05)',
                        border: '1px solid rgba(163,230,53,0.15)',
                        transition: 'all 0.25s ease',
                    }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(163,230,53,0.1)';
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(163,230,53,0.35)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(163,230,53,0.05)';
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(163,230,53,0.15)';
                        }}
                    >
                        <Sparkles style={{ width: '15px', height: '15px' }} />
                        {t.sections.allProjects}
                        <ArrowRight style={{ width: '15px', height: '15px' }} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
