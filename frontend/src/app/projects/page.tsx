'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, X, Briefcase, Cpu, GraduationCap,
    HeartHandshake, Palette, LayoutGrid, SlidersHorizontal,
    TrendingUp, Flame, Clock4, Star, ChevronDown,
    Dumbbell, Activity, Leaf
} from 'lucide-react';
import { useLocale } from '@/lib/locale-context';
import { mockProjects } from '@/lib/data';
import ProjectCard from '@/components/projects/ProjectCard';
import type { ProjectCategory } from '@/types';

type SortOption = 'newest' | 'popular' | 'endingSoon' | 'mostFunded';

const categoryConfig = [
    { id: 'all' as const, icon: LayoutGrid, color: '#a3e635', label: 'Все' },
    { id: 'business' as const, icon: Briefcase, color: '#f59e0b', label: 'Бизнес' },
    { id: 'technology' as const, icon: Cpu, color: '#3b82f6', label: 'Технологии' },
    { id: 'education' as const, icon: GraduationCap, color: '#8b5cf6', label: 'Образование' },
    { id: 'social' as const, icon: HeartHandshake, color: '#10b981', label: 'Социальные' },
    { id: 'creative' as const, icon: Palette, color: '#ec4899', label: 'Творчество' },
    { id: 'sport' as const, icon: Dumbbell, color: '#f97316', label: 'Спорт' },
    { id: 'health' as const, icon: Activity, color: '#06b6d4', label: 'Здоровье' },
    { id: 'ecology' as const, icon: Leaf, color: '#22c55e', label: 'Экология' },
];

const sortIcons: Record<SortOption, React.ElementType> = {
    popular: Flame,
    newest: Star,
    endingSoon: Clock4,
    mostFunded: TrendingUp,
};

export default function ProjectsPage() {
    const { t } = useLocale();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<ProjectCategory | 'all'>('all');
    const [sort, setSort] = useState<SortOption>('popular');
    const [showSort, setShowSort] = useState(false);

    const sortOptions: { id: SortOption; label: string }[] = [
        { id: 'popular', label: t.catalog.popular },
        { id: 'newest', label: t.catalog.newest },
        { id: 'endingSoon', label: t.catalog.endingSoon },
        { id: 'mostFunded', label: t.catalog.mostFunded },
    ];

    const filteredProjects = useMemo(() => {
        let filtered = [...mockProjects];
        if (search) {
            const lower = search.toLowerCase();
            filtered = filtered.filter(
                (p) => p.title.toLowerCase().includes(lower) || p.shortDescription.toLowerCase().includes(lower)
            );
        }
        if (category !== 'all') filtered = filtered.filter((p) => p.category === category);
        switch (sort) {
            case 'newest': filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
            case 'popular': filtered.sort((a, b) => b.likes - a.likes); break;
            case 'endingSoon': filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()); break;
            case 'mostFunded': filtered.sort((a, b) => b.currentAmount - a.currentAmount); break;
        }
        return filtered;
    }, [search, category, sort]);

    const currentSort = sortOptions.find(s => s.id === sort);
    const SortIcon = sortIcons[sort];

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingBottom: '120px' }}>
            <style>{`
                .cat-btn:hover { border-color: var(--cat-color) !important; color: var(--cat-color) !important; }
                .projects-grid {
                    display: grid;
                    gap: 20px;
                    grid-template-columns: repeat(2, 1fr);
                }
                @media (min-width: 640px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 900px) { .projects-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (min-width: 1200px) { .projects-grid { grid-template-columns: repeat(4, 1fr); } }
                .search-input:focus { border-color: rgba(163,230,53,0.5) !important; box-shadow: 0 0 0 3px rgba(163,230,53,0.08) !important; }
            `}</style>

            {/* ── HERO HEADER ── */}
            <div style={{
                position: 'relative',
                padding: '110px 24px 56px',
                background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
                borderBottom: '1px solid #181818',
                overflow: 'hidden',
            }}>
                {/* BG decoration */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: `
                        linear-gradient(rgba(163,230,53,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(163,230,53,0.025) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }} />
                <div style={{
                    position: 'absolute', top: '-60px', left: '30%',
                    width: '500px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(163,230,53,0.06) 0%, transparent 70%)',
                    filter: 'blur(60px)', pointerEvents: 'none',
                }} />

                <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        {/* Badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '5px 14px', borderRadius: '20px',
                            background: 'rgba(163,230,53,0.07)', border: '1px solid rgba(163,230,53,0.18)',
                            fontSize: '11px', color: '#a3e635', letterSpacing: '2px',
                            textTransform: 'uppercase', fontWeight: 600, marginBottom: '20px',
                        }}>
                            <Flame style={{ width: '11px', height: '11px' }} />
                            Каталог проектов
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(28px, 5vw, 52px)',
                            fontWeight: 900, color: '#ffffff',
                            marginBottom: '14px', letterSpacing: '-0.03em', lineHeight: 1.1,
                        }}>
                            {t.catalog.title}
                        </h1>
                        <p style={{ fontSize: '15px', color: '#666', maxWidth: '520px', marginBottom: '36px', lineHeight: 1.6 }}>
                            {t.catalog.subtitle}
                        </p>

                        {/* Search */}
                        <div style={{ position: 'relative', maxWidth: '520px' }}>
                            <div style={{
                                position: 'absolute', left: '16px', top: '50%',
                                transform: 'translateY(-50%)', pointerEvents: 'none',
                            }}>
                                <Search style={{ width: '18px', height: '18px', color: '#555' }} />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t.catalog.search}
                                className="search-input"
                                style={{
                                    width: '100%', height: '52px',
                                    paddingLeft: '48px', paddingRight: search ? '48px' : '20px',
                                    borderRadius: '16px',
                                    background: '#111',
                                    border: '1px solid #232323',
                                    color: '#ffffff', fontSize: '15px', outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.25s ease',
                                }}
                            />
                            {search && (
                                <button onClick={() => setSearch('')} style={{
                                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none',
                                    color: '#555', cursor: 'pointer', padding: '4px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <X style={{ width: '16px', height: '16px' }} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 24px 0' }}>

                {/* ── CATEGORY TABS ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', marginBottom: '28px' }}
                >
                    {categoryConfig.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = category === cat.id;
                        return (
                            <button
                                key={cat.id}
                                className="cat-btn"
                                onClick={() => setCategory(cat.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 18px', borderRadius: '14px', whiteSpace: 'nowrap',
                                    background: isActive ? cat.color : '#111',
                                    border: `1px solid ${isActive ? cat.color : '#222'}`,
                                    color: isActive ? '#0a0a0a' : '#888',
                                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    ['--cat-color' as string]: cat.color,
                                }}
                            >
                                <Icon style={{ width: '15px', height: '15px', color: isActive ? '#0a0a0a' : cat.color, flexShrink: 0 }} />
                                {cat.id === 'all' ? t.catalog.all : t.categories[cat.id as ProjectCategory]}
                            </button>
                        );
                    })}
                </motion.div>

                {/* ── CONTROLS ROW ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '28px', gap: '12px', flexWrap: 'wrap',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#555' }}>Найдено</span>
                        <span style={{
                            padding: '2px 10px', borderRadius: '10px',
                            background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)',
                            color: '#a3e635', fontSize: '13px', fontWeight: 700,
                        }}>
                            {filteredProjects.length}
                        </span>
                        <span style={{ fontSize: '13px', color: '#555' }}>проектов</span>
                    </div>

                    {/* Sort dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowSort(!showSort)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '9px 16px', borderRadius: '12px',
                                background: '#111', border: '1px solid #222',
                                color: '#ddd', fontSize: '13px', fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s ease',
                            }}
                        >
                            <SlidersHorizontal style={{ width: '14px', height: '14px', color: '#a3e635' }} />
                            <SortIcon style={{ width: '13px', height: '13px', color: '#a3e635' }} />
                            {currentSort?.label}
                            <ChevronDown style={{ width: '13px', height: '13px', color: '#555', transform: showSort ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>

                        <AnimatePresence>
                            {showSort && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    style={{
                                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                        minWidth: '200px', borderRadius: '16px',
                                        background: '#111', border: '1px solid #222',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                        overflow: 'hidden', zIndex: 100,
                                    }}
                                >
                                    {sortOptions.map((opt) => {
                                        const Ico = sortIcons[opt.id];
                                        const isActive = sort === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => { setSort(opt.id); setShowSort(false); }}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                                    padding: '12px 16px', background: isActive ? 'rgba(163,230,53,0.08)' : 'transparent',
                                                    border: 'none', color: isActive ? '#a3e635' : '#888',
                                                    fontSize: '13px', fontWeight: isActive ? 700 : 500,
                                                    cursor: 'pointer', textAlign: 'left',
                                                    transition: 'all 0.15s ease',
                                                    borderLeft: isActive ? '2px solid #a3e635' : '2px solid transparent',
                                                }}
                                            >
                                                <Ico style={{ width: '14px', height: '14px' }} />
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── GRID ── */}
                <AnimatePresence mode="wait">
                    {filteredProjects.length > 0 ? (
                        <motion.div
                            key={`${category}-${sort}-${search}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="projects-grid"
                        >
                            {filteredProjects.map((project, index) => (
                                <ProjectCard key={project.id} project={project} index={index} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                textAlign: 'center', padding: '100px 20px',
                                background: '#0e0e0e', borderRadius: '24px',
                                border: '1px solid #1a1a1a',
                            }}
                        >
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '20px',
                                background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.12)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px',
                            }}>
                                <Search style={{ width: '28px', height: '28px', color: '#a3e635', opacity: 0.6 }} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                                Ничего не найдено
                            </h3>
                            <p style={{ fontSize: '14px', color: '#555' }}>
                                Попробуйте изменить запрос или категорию
                            </p>
                            <button
                                onClick={() => { setSearch(''); setCategory('all'); }}
                                style={{
                                    marginTop: '24px', padding: '10px 24px', borderRadius: '12px',
                                    background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)',
                                    color: '#a3e635', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                Сбросить фильтры
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
