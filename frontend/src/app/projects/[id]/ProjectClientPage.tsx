'use client';

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Share2, Bookmark, Clock, Users, ArrowLeft,
    MessageCircle, Bell, CheckCircle, Shield,
    Briefcase, Cpu, GraduationCap, HeartHandshake, Palette,
    Zap, Award, TrendingUp, Send, Dumbbell, Activity, Leaf
} from 'lucide-react';
import type { ProjectCategory } from '@/types';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { mockProjects, mockComments, mockUpdates, formatCurrency, getProgress, getDaysLeft } from '@/lib/data';

type Tab = 'about' | 'rewards' | 'comments' | 'updates';

const categoryMeta: Record<ProjectCategory, {
    icon: React.ElementType; bg: string; accent: string; glow: string; label: string;
}> = {
    technology: { icon: Cpu, bg: 'linear-gradient(135deg, #0a1628 0%, #0d2448 100%)', accent: '#3b82f6', glow: 'rgba(59,130,246,0.25)', label: 'Технологии' },
    education: { icon: GraduationCap, bg: 'linear-gradient(135deg, #130a28 0%, #24104a 100%)', accent: '#8b5cf6', glow: 'rgba(139,92,246,0.25)', label: 'Образование' },
    business: { icon: Briefcase, bg: 'linear-gradient(135deg, #1e1003 0%, #3d2006 100%)', accent: '#f59e0b', glow: 'rgba(245,158,11,0.25)', label: 'Бизнес' },
    social: { icon: HeartHandshake, bg: 'linear-gradient(135deg, #041510 0%, #083d28 100%)', accent: '#10b981', glow: 'rgba(16,185,129,0.25)', label: 'Социальное' },
    creative: { icon: Palette, bg: 'linear-gradient(135deg, #18040f 0%, #40082a 100%)', accent: '#ec4899', glow: 'rgba(236,72,153,0.25)', label: 'Творчество' },
    sport: { icon: Dumbbell, bg: 'linear-gradient(135deg, #1e0e04 0%, #3d1e08 100%)', accent: '#f97316', glow: 'rgba(249,115,22,0.25)', label: 'Спорт' },
    health: { icon: Activity, bg: 'linear-gradient(135deg, #041618 0%, #083538 100%)', accent: '#06b6d4', glow: 'rgba(6,182,212,0.25)', label: 'Здоровье' },
    ecology: { icon: Leaf, bg: 'linear-gradient(135deg, #051a04 0%, #0a3d08 100%)', accent: '#22c55e', glow: 'rgba(34,197,94,0.25)', label: 'Экология' },
};

export default function ProjectClientPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { t } = useLocale();
    const [activeTab, setActiveTab] = useState<Tab>('about');
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showPledgeInput, setShowPledgeInput] = useState(false);
    const [pledgeAmount, setPledgeAmount] = useState('500');
    const [isPledging, setIsPledging] = useState(false);
    const [localCurrentAmount, setLocalCurrentAmount] = useState<number | null>(null);
    const [localBackers, setLocalBackers] = useState<number | null>(null);
    const [pledgeSuccess, setPledgeSuccess] = useState(false);
    const [commentText, setCommentText] = useState('');

    const project = mockProjects.find((p) => p.id === resolvedParams.id);
    if (!project) {
        return (
            <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>Проект не найден</h1>
                    <Link href="/projects" style={{ color: '#a3e635', textDecoration: 'none' }}>Вернуться в каталог</Link>
                </div>
            </div>
        );
    }

    const progress = getProgress(localCurrentAmount ?? project.currentAmount, project.goalAmount);
    const daysLeft = getDaysLeft(project.deadline);
    const meta = categoryMeta[project.category];
    const Icon = meta.icon;

    const handlePledge = () => {
        setIsPledging(true);
        setTimeout(() => {
            setIsPledging(false);
            setLocalCurrentAmount((prev) => (prev ?? project.currentAmount) + Number(pledgeAmount));
            setLocalBackers((prev) => (prev ?? project.backersCount) + 1);
            setPledgeSuccess(true);
            setTimeout(() => setPledgeSuccess(false), 5000);
        }, 1500);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: '100px' }}>
            {/* Header / Hero */}
            <div style={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: meta.bg, opacity: 0.8 }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${project.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.3,
                    filter: 'blur(20px) scale(1.1)',
                }} />

                <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
                    <Link href="/projects" style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                        fontSize: '14px', marginBottom: '24px', width: 'fit-content'
                    }}>
                        <ArrowLeft size={16} /> {t.project.backToCatalog}
                    </Link>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                        <span style={{
                            padding: '6px 12px', borderRadius: '20px',
                            background: `${meta.accent}20`, border: `1px solid ${meta.accent}40`,
                            color: meta.accent, fontSize: '12px', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <Icon size={14} /> {meta.label}
                        </span>
                        {project.featured && (
                            <span style={{
                                padding: '6px 12px', borderRadius: '20px',
                                background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.3)',
                                color: '#a3e635', fontSize: '12px', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '6px'
                            }}>
                                <Zap size={14} /> Featured
                            </span>
                        )}
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900,
                        lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.02em',
                        maxWidth: '900px'
                    }}>
                        {project.title}
                    </h1>

                    <p style={{
                        fontSize: 'clamp(16px, 1.2vw, 20px)',
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: '700px', lineHeight: 1.5,
                        marginBottom: '32px'
                    }}>
                        {project.shortDescription}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: '#111', border: '1px solid #222'
                            }} />
                            <div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{t.project.author}</div>
                                <div style={{ fontSize: '14px', fontWeight: 600 }}>{project.authorName}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    {/* Visual Media Placeholder */}
                    <div style={{
                        width: '100%', aspectRatio: '16/9', borderRadius: '24px',
                        background: '#0d0d0d', border: '1px solid #1a1a1a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '40px', overflow: 'hidden', position: 'relative'
                    }}>
                        <img src={project.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
                        }} />
                    </div>

                    {/* Tabs */}
                    <div style={{
                        display: 'flex', gap: '32px', borderBottom: '1px solid #1a1a1a',
                        marginBottom: '32px', overflowX: 'auto', paddingBottom: '2px'
                    }}>
                        {(['about', 'rewards', 'updates', 'comments'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '12px 0 16px', border: 'none', background: 'none',
                                    color: activeTab === tab ? '#a3e635' : 'rgba(255,255,255,0.5)',
                                    fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                                    position: 'relative', transition: 'color 0.2s',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {/* @ts-ignore */}
                                {t.project.tabs[tab]}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        style={{
                                            position: 'absolute', bottom: -1, left: 0, right: 0,
                                            height: '2px', background: '#a3e635'
                                        }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ minHeight: '400px' }}>
                        {activeTab === 'about' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div style={{ fontSize: '18px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-line' }}>
                                    {project.description}
                                </div>

                                <div style={{ marginTop: '48px' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>{t.project.risksTitle}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                                        {t.project.risksDesc}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'rewards' && (
                            <div style={{ display: 'grid', gap: '20px' }}>
                                {project.rewards.map((reward) => (
                                    <motion.div
                                        key={reward.id}
                                        whileHover={{ y: -5 }}
                                        style={{
                                            padding: '32px', borderRadius: '24px',
                                            background: '#0d0d0d', border: '1px solid #1a1a1a',
                                            transition: 'border-color 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <h4 style={{ fontSize: '20px', fontWeight: 700 }}>{reward.title}</h4>
                                            <div style={{ color: '#a3e635', fontWeight: 700, fontSize: '18px' }}>
                                                от {formatCurrency(reward.minAmount)} сом
                                            </div>
                                        </div>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: 1.5 }}>
                                            {reward.description}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                                                Осталось: {reward.quantityAvailable - reward.quantityClaimed} из {reward.quantityAvailable}
                                            </div>
                                            <button className="btn-primary" style={{ padding: '10px 24px' }}>
                                                Выбрать
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'comments' && (
                            <div>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                                    <input
                                        type="text"
                                        placeholder={t.project.addCommentPlaceholder}
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        style={{
                                            flex: 1, background: '#0d0d0d', border: '1px solid #1a1a1a',
                                            borderRadius: '12px', padding: '14px 20px', color: '#fff', outline: 'none'
                                        }}
                                    />
                                    <button className="btn-primary" style={{ borderRadius: '12px' }}>
                                        <Send size={18} />
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gap: '24px' }}>
                                    {mockComments.filter(c => c.projectId === project.id).map(comment => (
                                        <div key={comment.id} style={{ display: 'flex', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#111', flexShrink: 0 }} />
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                    <span style={{ fontWeight: 600 }}>{comment.userName}</span>
                                                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{comment.createdAt}</span>
                                                </div>
                                                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'updates' && (
                            <div style={{ display: 'grid', gap: '32px' }}>
                                {mockUpdates.filter(u => u.projectId === project.id).map(update => (
                                    <div key={update.id} style={{ position: 'relative', paddingLeft: '32px', borderLeft: '1px solid #1a1a1a' }}>
                                        <div style={{
                                            position: 'absolute', left: -5, top: 0,
                                            width: '9px', height: '9px', borderRadius: '50%', background: '#a3e635'
                                        }} />
                                        <div style={{ fontSize: '12px', color: '#a3e635', fontWeight: 600, marginBottom: '8px' }}>
                                            {update.createdAt}
                                        </div>
                                        <h4 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{update.title}</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{update.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div style={{ position: 'sticky', top: '100px' }}>
                        {/* Funding Card */}
                        <div style={{
                            padding: '32px', borderRadius: '24px', background: '#0d0d0d', border: '1px solid #1a1a1a',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', marginBottom: '24px'
                        }}>
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '32px', fontWeight: 900, color: '#a3e635', marginBottom: '8px' }}>
                                    {formatCurrency(localCurrentAmount ?? project.currentAmount)} сом
                                </div>
                                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                                    собрано из {formatCurrency(project.goalAmount)} сом
                                </div>

                                <div style={{ height: '8px', background: '#1a1a1a', borderRadius: '4px', margin: '24px 0 12px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        style={{ height: '100%', background: '#a3e635' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ fontWeight: 700 }}>{progress}%</span>
                                    {project.fundingType === 'all-or-nothing' && (
                                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.5 }}>
                                            {t.project.allOrNothing}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: 700 }}>{localBackers ?? project.backersCount}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                                        {t.project.backers}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: 700 }}>{daysLeft}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                                        {t.project.daysLeft}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {showPledgeInput ? (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                                            <input
                                                type="number"
                                                value={pledgeAmount}
                                                onChange={(e) => setPledgeAmount(e.target.value)}
                                                style={{
                                                    flex: 1, background: '#111', border: '1px solid #222',
                                                    borderRadius: '12px', padding: '12px', color: '#fff', outline: 'none'
                                                }}
                                            />
                                            <button
                                                onClick={handlePledge}
                                                disabled={isPledging}
                                                className="btn-primary"
                                                style={{ borderRadius: '12px' }}
                                            >
                                                {isPledging ? '...' : 'OK'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <button
                                        onClick={() => setShowPledgeInput(true)}
                                        className="btn-primary"
                                        style={{ width: '100%', padding: '18px', fontSize: '16px', fontWeight: 700, borderRadius: '16px' }}
                                    >
                                        {t.project.support}
                                    </button>
                                )}
                            </AnimatePresence>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    style={{
                                        flex: 1, padding: '14px', borderRadius: '12px',
                                        background: isLiked ? 'rgba(239, 68, 68, 0.1)' : '#111',
                                        border: `1px solid ${isLiked ? '#ef4444' : '#222'}`,
                                        color: isLiked ? '#ef4444' : '#fff', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                    }}
                                >
                                    <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                                    {project.likes + (isLiked ? 1 : 0)}
                                </button>
                                <button
                                    onClick={() => setIsSaved(!isSaved)}
                                    style={{
                                        padding: '14px', borderRadius: '12px', background: '#111', border: '1px solid #222',
                                        color: isSaved ? '#a3e635' : '#fff', cursor: 'pointer'
                                    }}
                                >
                                    <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                                </button>
                                <button style={{ padding: '14px', borderRadius: '12px', background: '#111', border: '1px solid #222', color: '#fff' }}>
                                    <Share2 size={18} />
                                </button>
                            </div>

                            {pledgeSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        marginTop: '20px', padding: '12px', borderRadius: '12px',
                                        background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.3)',
                                        color: '#a3e635', fontSize: '13px', textAlign: 'center', fontWeight: 600
                                    }}
                                >
                                    {t.project.pledgeSuccess}
                                </motion.div>
                            )}
                        </div>

                        {/* Safety Card */}
                        <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(163,230,53,0.03)', border: '1px solid rgba(163,230,53,0.1)' }}>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <Shield size={20} color="#a3e635" />
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.project.trustTitle}</div>
                            </div>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                                {t.project.trustDesc}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
