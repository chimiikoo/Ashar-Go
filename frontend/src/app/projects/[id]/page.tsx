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

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
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
                    <Link href="/projects" style={{ color: '#a3e635', textDecoration: 'none' }}>← Вернуться к каталогу</Link>
                </div>
            </div>
        );
    }

    const _currentAmount = localCurrentAmount !== null ? localCurrentAmount : project.currentAmount;
    const _backersCount = localBackers !== null ? localBackers : project.backersCount;
    const progress = getProgress(_currentAmount, project.goalAmount);
    const daysLeft = getDaysLeft(project.deadline);
    const meta = categoryMeta[project.category];
    const CoverIcon = meta.icon;
    const urgent = daysLeft <= 7;

    const handlePledge = async (amount: number) => {
        setIsPledging(true);
        await new Promise(res => setTimeout(res, 900));
        setLocalCurrentAmount(_currentAmount + amount);
        setLocalBackers(_backersCount + 1);
        setIsPledging(false);
        setPledgeSuccess(true);
        setShowPledgeInput(false);
        setTimeout(() => setPledgeSuccess(false), 5000);
    };

    const comments = mockComments.filter((c) => c.projectId === project.id);
    const updates = mockUpdates.filter((u) => u.projectId === project.id);

    const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
        { id: 'about', label: t.project.aboutProject, icon: TrendingUp },
        { id: 'rewards', label: t.project.rewards, icon: Award, count: project.rewards.length },
        { id: 'comments', label: t.project.comments, icon: MessageCircle, count: comments.length },
        { id: 'updates', label: t.project.updates, icon: Bell, count: updates.length },
    ];

    const quickAmounts = [500, 1000, 2500, 5000];

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingBottom: '80px' }}>
            <style>{`
                .pledge-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px ${meta.glow}; }
                .tab-btn:hover { color: #fff !important; }
                .action-btn:hover { border-color: rgba(163,230,53,0.35) !important; color: #a3e635 !important; }
                .quick-amount:hover { background: ${meta.accent}20 !important; border-color: ${meta.accent}60 !important; color: ${meta.accent} !important; }
                .reward-card:hover { border-color: ${meta.accent}40 !important; transform: translateY(-3px); }
                .comment-card:hover { border-color: rgba(163,230,53,0.15) !important; }
            `}</style>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

                {/* Back link */}
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '90px 0 32px' }}>
                    <Link href="/projects" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        fontSize: '13px', color: '#555', textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        padding: '8px 14px', borderRadius: '10px',
                        border: '1px solid #1a1a1a', background: '#0e0e0e',
                    }}
                        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#a3e635'}
                        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#555'}
                    >
                        <ArrowLeft style={{ width: '15px', height: '15px' }} />
                        {t.catalog.title}
                    </Link>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 360px',
                    gap: '32px',
                    alignItems: 'start',
                }}>
                    {/* ═══════════════ LEFT COLUMN ═══════════════ */}
                    <div>
                        {/* ── COVER ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                borderRadius: '24px', overflow: 'hidden',
                                marginBottom: '32px', position: 'relative',
                            }}
                        >
                            <div style={{
                                height: '340px', background: meta.bg,
                                position: 'relative', overflow: 'hidden',
                            }}>
                                {/* Animated rings */}
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{
                                        position: 'absolute', top: '50%', left: '50%',
                                        width: `${i * 160}px`, height: `${i * 160}px`,
                                        marginLeft: `${-i * 80}px`, marginTop: `${-i * 80}px`,
                                        borderRadius: '50%',
                                        border: `1px solid ${meta.accent}${16 - i * 4}`,
                                        animation: `spinRing ${12 + i * 5}s linear infinite ${i % 2 ? 'reverse' : ''}`,
                                    }} />
                                ))}
                                <style>{`
                                    @keyframes spinRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                                    @keyframes bobIcon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                                `}</style>

                                {/* Glow */}
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '250px', height: '250px', borderRadius: '50%',
                                    background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)`,
                                    filter: 'blur(20px)',
                                }} />

                                {/* Central icon */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <div style={{
                                        width: '96px', height: '96px', borderRadius: '28px',
                                        background: meta.accent,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: `0 16px 48px ${meta.glow}`,
                                        animation: 'bobIcon 4s ease-in-out infinite',
                                    }}>
                                        <CoverIcon style={{ width: '44px', height: '44px', color: '#fff' }} />
                                    </div>
                                </div>

                                {/* Featured badge */}
                                {project.featured && (
                                    <div style={{
                                        position: 'absolute', top: '16px', left: '16px',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '5px 12px', borderRadius: '20px',
                                        background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                                        color: '#0a0a0a', fontSize: '11px', fontWeight: 800,
                                    }}>
                                        <Zap style={{ width: '11px', height: '11px' }} />
                                        FEATURED
                                    </div>
                                )}

                                {/* Category */}
                                <div style={{
                                    position: 'absolute', top: '16px', right: '16px',
                                    padding: '5px 12px', borderRadius: '20px',
                                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                                    border: `1px solid ${meta.accent}40`,
                                    color: meta.accent, fontSize: '11px', fontWeight: 600,
                                }}>
                                    {meta.label}
                                </div>

                                {/* Bottom gradient */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                                }} />
                            </div>
                        </motion.div>

                        {/* ── TITLE & META ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{ marginBottom: '32px' }}
                        >
                            {/* Funding type badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <span style={{
                                    padding: '4px 12px', borderRadius: '20px',
                                    background: `${meta.accent}15`, border: `1px solid ${meta.accent}30`,
                                    color: meta.accent, fontSize: '11px', fontWeight: 600,
                                }}>
                                    {t.categories[project.category]}
                                </span>
                                <span style={{
                                    padding: '4px 12px', borderRadius: '20px',
                                    background: '#111', border: '1px solid #222',
                                    color: '#666', fontSize: '11px', fontWeight: 500,
                                }}>
                                    {project.fundingType === 'all-or-nothing' ? t.project.allOrNothing : t.project.flexible}
                                </span>
                                {urgent && (
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '20px',
                                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                        color: '#ef4444', fontSize: '11px', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                    }}>
                                        🔥 Осталось {daysLeft}д
                                    </span>
                                )}
                            </div>

                            <h1 style={{
                                fontSize: 'clamp(24px, 4vw, 38px)',
                                fontWeight: 900, color: '#fff',
                                marginBottom: '16px', lineHeight: 1.15,
                                letterSpacing: '-0.03em',
                            }}>
                                {project.title}
                            </h1>

                            <p style={{
                                fontSize: '16px', color: '#888', lineHeight: 1.7,
                                marginBottom: '24px',
                            }}>
                                {project.shortDescription}
                            </p>

                            {/* Author card */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: '16px 20px', borderRadius: '16px',
                                background: '#0e0e0e', border: '1px solid #1e1e1e',
                            }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}80)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '18px', fontWeight: 800, color: '#0a0a0a',
                                    flexShrink: 0,
                                }}>
                                    {project.authorName.charAt(0)}
                                </div>
                                <div>
                                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{project.authorName}</p>
                                    <p style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{t.project.author}</p>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <div style={{
                                        padding: '6px 12px', borderRadius: '10px',
                                        background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.1)',
                                        fontSize: '11px', color: '#a3e635', fontWeight: 600,
                                    }}>
                                        Автор
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── TABS ── */}
                        <div style={{
                            display: 'flex', gap: '4px',
                            borderBottom: '1px solid #1a1a1a',
                            marginBottom: '28px', overflowX: 'auto',
                        }}>
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        className="tab-btn"
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '7px',
                                            padding: '12px 18px', whiteSpace: 'nowrap',
                                            background: 'none', border: 'none',
                                            borderBottom: `2px solid ${isActive ? meta.accent : 'transparent'}`,
                                            marginBottom: '-1px',
                                            color: isActive ? meta.accent : '#666',
                                            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <Icon style={{ width: '14px', height: '14px' }} />
                                        {tab.label}
                                        {tab.count !== undefined && (
                                            <span style={{
                                                padding: '1px 7px', borderRadius: '10px', fontSize: '11px',
                                                background: isActive ? `${meta.accent}20` : '#1a1a1a',
                                                color: isActive ? meta.accent : '#555',
                                                border: `1px solid ${isActive ? meta.accent + '40' : '#2a2a2a'}`,
                                            }}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* ── TAB CONTENT ── */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* ABOUT */}
                                {activeTab === 'about' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {project.description.split('\n').filter(Boolean).map((paragraph, i) => (
                                            <p key={i} style={{
                                                fontSize: '15px', color: '#888', lineHeight: 1.85,
                                                padding: '20px 24px', borderRadius: '16px',
                                                background: '#0d0d0d', border: '1px solid #181818',
                                            }}>
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* REWARDS */}
                                {activeTab === 'rewards' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {project.rewards.map((reward, idx) => {
                                            const filled = (reward.quantityClaimed / reward.quantityAvailable) * 100;
                                            return (
                                                <div
                                                    key={reward.id}
                                                    className="reward-card"
                                                    style={{
                                                        borderRadius: '20px', background: '#0d0d0d',
                                                        border: '1px solid #1e1e1e', padding: '24px 28px',
                                                        transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                                                    }}
                                                >
                                                    {/* Top accent line */}
                                                    <div style={{
                                                        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                                                        background: `linear-gradient(to right, ${meta.accent}, transparent)`,
                                                        opacity: 0.5,
                                                    }} />

                                                    {/* Number badge */}
                                                    <div style={{
                                                        position: 'absolute', top: '16px', right: '16px',
                                                        width: '28px', height: '28px', borderRadius: '8px',
                                                        background: `${meta.accent}15`, border: `1px solid ${meta.accent}30`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '11px', fontWeight: 700, color: meta.accent,
                                                    }}>
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', paddingRight: '40px' }}>
                                                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>{reward.title}</h3>
                                                        <span style={{
                                                            fontSize: '18px', fontWeight: 800, color: meta.accent,
                                                            whiteSpace: 'nowrap', marginLeft: '16px',
                                                        }}>
                                                            {formatCurrency(reward.minAmount)} {t.currency}+
                                                        </span>
                                                    </div>

                                                    <p style={{ fontSize: '14px', color: '#777', marginBottom: '20px', lineHeight: 1.6 }}>
                                                        {reward.description}
                                                    </p>

                                                    {/* Progress bar */}
                                                    <div style={{ marginBottom: '16px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                            <span style={{ fontSize: '11px', color: '#555' }}>
                                                                {reward.quantityClaimed} из {reward.quantityAvailable} {t.project.claimed}
                                                            </span>
                                                            <span style={{ fontSize: '11px', color: meta.accent }}>{Math.round(filled)}%</span>
                                                        </div>
                                                        <div style={{ height: '4px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                                                            <div style={{
                                                                height: '100%', width: `${filled}%`,
                                                                background: `linear-gradient(to right, ${meta.accent}, ${meta.accent}80)`,
                                                                borderRadius: '2px',
                                                            }} />
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handlePledge(reward.minAmount)}
                                                        disabled={isPledging}
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                            padding: '10px 22px', borderRadius: '12px',
                                                            background: meta.accent, color: '#0a0a0a',
                                                            fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            opacity: isPledging ? 0.7 : 1,
                                                        }}
                                                    >
                                                        {isPledging ? (
                                                            <span style={{
                                                                width: '14px', height: '14px', borderRadius: '50%',
                                                                border: '2px solid rgba(0,0,0,0.3)',
                                                                borderTopColor: '#0a0a0a',
                                                                animation: 'spin 0.8s linear infinite',
                                                                display: 'inline-block',
                                                            }} />
                                                        ) : <Zap style={{ width: '14px', height: '14px' }} />}
                                                        {t.project.selectReward}
                                                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* COMMENTS */}
                                {activeTab === 'comments' && (
                                    <div>
                                        {/* Comment input */}
                                        <div style={{
                                            padding: '20px', borderRadius: '18px',
                                            background: '#0d0d0d', border: '1px solid #1e1e1e',
                                            marginBottom: '20px',
                                        }}>
                                            <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                                Ваш комментарий
                                            </label>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input
                                                    type="text"
                                                    value={commentText}
                                                    onChange={e => setCommentText(e.target.value)}
                                                    placeholder="Напишите что-нибудь..."
                                                    style={{
                                                        flex: 1, padding: '12px 16px', borderRadius: '12px',
                                                        background: '#111', border: '1px solid #222',
                                                        color: '#fff', fontSize: '14px', outline: 'none',
                                                    }}
                                                />
                                                <button style={{
                                                    padding: '12px 18px', borderRadius: '12px',
                                                    background: meta.accent, border: 'none', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    <Send style={{ width: '16px', height: '16px', color: '#0a0a0a' }} />
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {comments.length > 0 ? comments.map((comment) => (
                                                <div
                                                    key={comment.id}
                                                    className="comment-card"
                                                    style={{
                                                        borderRadius: '16px', background: '#0d0d0d',
                                                        border: '1px solid #181818', padding: '18px 20px',
                                                        transition: 'border-color 0.2s ease',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                        <div style={{
                                                            width: '38px', height: '38px', borderRadius: '50%',
                                                            background: `linear-gradient(135deg, ${meta.accent}40, ${meta.accent}20)`,
                                                            border: `1px solid ${meta.accent}30`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '14px', fontWeight: 800, color: meta.accent, flexShrink: 0,
                                                        }}>
                                                            {comment.userName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#ddd' }}>{comment.userName}</p>
                                                            <p style={{ fontSize: '11px', color: '#444', marginTop: '1px' }}>{comment.createdAt}</p>
                                                        </div>
                                                    </div>
                                                    <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.65, marginLeft: '50px' }}>
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            )) : (
                                                <div style={{
                                                    textAlign: 'center', padding: '60px 20px',
                                                    background: '#0d0d0d', borderRadius: '16px',
                                                    border: '1px solid #181818',
                                                }}>
                                                    <MessageCircle style={{ width: '36px', height: '36px', color: '#333', margin: '0 auto 12px' }} />
                                                    <p style={{ color: '#555', fontSize: '14px' }}>Будьте первым, кто оставит комментарий!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* UPDATES */}
                                {activeTab === 'updates' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {updates.length > 0 ? updates.map((update, i) => (
                                            <div
                                                key={update.id}
                                                style={{
                                                    borderRadius: '18px', background: '#0d0d0d',
                                                    border: '1px solid #1e1e1e', padding: '24px',
                                                    position: 'relative', overflow: 'hidden',
                                                }}
                                            >
                                                <div style={{
                                                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                                                    background: `linear-gradient(to bottom, ${meta.accent}, ${meta.accent}20)`,
                                                }} />
                                                <div style={{ paddingLeft: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                        <div style={{
                                                            width: '28px', height: '28px', borderRadius: '8px',
                                                            background: `${meta.accent}15`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                            <Bell style={{ width: '13px', height: '13px', color: meta.accent }} />
                                                        </div>
                                                        <span style={{ fontSize: '12px', color: '#555' }}>{update.createdAt}</span>
                                                        {i === 0 && (
                                                            <span style={{
                                                                padding: '2px 8px', borderRadius: '8px',
                                                                background: `${meta.accent}15`, color: meta.accent,
                                                                fontSize: '10px', fontWeight: 700,
                                                            }}>НОВОЕ</span>
                                                        )}
                                                    </div>
                                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                                                        {update.title}
                                                    </h3>
                                                    <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.65 }}>
                                                        {update.content}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div style={{
                                                textAlign: 'center', padding: '60px 20px',
                                                background: '#0d0d0d', borderRadius: '16px',
                                                border: '1px solid #181818',
                                            }}>
                                                <Bell style={{ width: '36px', height: '36px', color: '#333', margin: '0 auto 12px' }} />
                                                <p style={{ color: '#555', fontSize: '14px' }}>Пока нет обновлений</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ═══════════════ SIDEBAR ═══════════════ */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            {/* Support card */}
                            <div style={{
                                borderRadius: '24px', background: '#0d0d0d',
                                border: '1px solid #1e1e1e', overflow: 'hidden',
                            }}>
                                {/* Colored top band */}
                                <div style={{
                                    height: '4px',
                                    background: `linear-gradient(to right, ${meta.accent}, ${meta.accent}40)`,
                                }} />

                                <div style={{ padding: '24px' }}>
                                    {/* Amount */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                                            <div>
                                                <div style={{ fontSize: '32px', fontWeight: 900, color: meta.accent, lineHeight: 1, letterSpacing: '-0.03em' }}>
                                                    {formatCurrency(_currentAmount)}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
                                                    из {formatCurrency(project.goalAmount)} {t.currency}
                                                </div>
                                            </div>
                                            <div style={{
                                                padding: '6px 12px', borderRadius: '10px',
                                                background: progress >= 100 ? 'rgba(16,185,129,0.1)' : `${meta.accent}10`,
                                                border: `1px solid ${progress >= 100 ? 'rgba(16,185,129,0.3)' : meta.accent + '30'}`,
                                                color: progress >= 100 ? '#10b981' : meta.accent,
                                                fontSize: '14px', fontWeight: 800,
                                            }}>
                                                {progress}%
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div style={{ height: '6px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                                style={{
                                                    height: '100%', borderRadius: '3px',
                                                    background: `linear-gradient(to right, ${meta.accent}, ${meta.accent}80)`,
                                                    boxShadow: `0 0 10px ${meta.accent}60`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                        {[
                                            { icon: Users, value: _backersCount, label: t.project.backers },
                                            { icon: Clock, value: `${daysLeft}`, label: t.project.daysLeft, urgent },
                                        ].map((s, i) => {
                                            const Ico = s.icon;
                                            return (
                                                <div key={i} style={{
                                                    padding: '14px', borderRadius: '14px',
                                                    background: '#111', border: `1px solid ${s.urgent ? 'rgba(239,68,68,0.2)' : '#1e1e1e'}`,
                                                    textAlign: 'center',
                                                }}>
                                                    <Ico style={{ width: '16px', height: '16px', color: s.urgent ? '#ef4444' : meta.accent, margin: '0 auto 6px' }} />
                                                    <div style={{ fontSize: '20px', fontWeight: 800, color: s.urgent ? '#ef4444' : '#fff', lineHeight: 1 }}>
                                                        {s.value}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>{s.label}</div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Success message */}
                                    <AnimatePresence>
                                        {pledgeSuccess && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, height: 0 }}
                                                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                style={{
                                                    padding: '14px 16px', borderRadius: '14px',
                                                    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
                                                    color: '#10b981', textAlign: 'center', fontSize: '13px',
                                                    fontWeight: 600, marginBottom: '12px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                }}
                                            >
                                                <CheckCircle style={{ width: '16px', height: '16px' }} />
                                                🎉 Спасибо за вашу поддержку!
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Main pledge area */}
                                    {!showPledgeInput ? (
                                        <button
                                            onClick={() => setShowPledgeInput(true)}
                                            className="pledge-btn"
                                            style={{
                                                width: '100%', padding: '16px', borderRadius: '16px',
                                                background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}cc)`,
                                                color: '#0a0a0a', fontWeight: 800, fontSize: '15px',
                                                border: 'none', cursor: 'pointer',
                                                transition: 'all 0.25s ease',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                position: 'relative', overflow: 'hidden',
                                                marginBottom: '12px',
                                            }}
                                        >
                                            <span style={{
                                                position: 'absolute', inset: 0,
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)',
                                            }} />
                                            <Zap style={{ width: '17px', height: '17px' }} />
                                            {t.project.support}
                                        </button>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            style={{ marginBottom: '12px' }}
                                        >
                                            {/* Quick amounts */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
                                                {quickAmounts.map(amt => (
                                                    <button
                                                        key={amt}
                                                        className="quick-amount"
                                                        onClick={() => setPledgeAmount(String(amt))}
                                                        style={{
                                                            padding: '8px 4px', borderRadius: '10px',
                                                            background: pledgeAmount === String(amt) ? `${meta.accent}20` : '#111',
                                                            border: `1px solid ${pledgeAmount === String(amt) ? meta.accent + '60' : '#222'}`,
                                                            color: pledgeAmount === String(amt) ? meta.accent : '#888',
                                                            fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        {amt >= 1000 ? `${amt / 1000}K` : amt}
                                                    </button>
                                                ))}
                                            </div>

                                            <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '6px' }}>
                                                Сумма (сом)
                                            </label>
                                            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                                <input
                                                    type="number"
                                                    value={pledgeAmount}
                                                    onChange={(e) => setPledgeAmount(e.target.value)}
                                                    style={{
                                                        flex: 1, padding: '11px 14px', borderRadius: '12px',
                                                        background: '#111', border: '1px solid #222',
                                                        color: '#fff', fontSize: '15px', fontWeight: 700, outline: 'none',
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handlePledge(parseFloat(pledgeAmount) || 0)}
                                                    disabled={isPledging}
                                                    style={{
                                                        padding: '11px 18px', borderRadius: '12px',
                                                        background: meta.accent, border: 'none', cursor: 'pointer',
                                                        color: '#0a0a0a', fontWeight: 800, fontSize: '13px',
                                                        minWidth: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}
                                                >
                                                    {isPledging ? (
                                                        <span style={{
                                                            width: '14px', height: '14px', borderRadius: '50%',
                                                            border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#0a0a0a',
                                                            animation: 'spin 0.8s linear infinite', display: 'inline-block',
                                                        }} />
                                                    ) : 'Внести'}
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => setShowPledgeInput(false)}
                                                style={{ width: '100%', background: 'none', border: 'none', color: '#444', fontSize: '12px', cursor: 'pointer', padding: '4px' }}
                                            >
                                                Отмена
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => setIsLiked(!isLiked)}
                                            className="action-btn"
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                padding: '11px', borderRadius: '12px',
                                                background: isLiked ? 'rgba(239,68,68,0.08)' : 'transparent',
                                                border: `1px solid ${isLiked ? 'rgba(239,68,68,0.3)' : '#1e1e1e'}`,
                                                color: isLiked ? '#ef4444' : '#666',
                                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <Heart style={{ width: '15px', height: '15px', fill: isLiked ? '#ef4444' : 'none' }} />
                                            {project.likes + (isLiked ? 1 : 0)}
                                        </button>
                                        <button
                                            onClick={() => setIsSaved(!isSaved)}
                                            className="action-btn"
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                padding: '11px', borderRadius: '12px',
                                                background: isSaved ? 'rgba(163,230,53,0.06)' : 'transparent',
                                                border: `1px solid ${isSaved ? 'rgba(163,230,53,0.3)' : '#1e1e1e'}`,
                                                color: isSaved ? '#a3e635' : '#666',
                                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <Bookmark style={{ width: '15px', height: '15px', fill: isSaved ? '#a3e635' : 'none' }} />
                                            {isSaved ? 'Сохранено' : t.project.save}
                                        </button>
                                        <button
                                            className="action-btn"
                                            style={{
                                                padding: '11px 14px', borderRadius: '12px',
                                                background: 'transparent', border: '1px solid #1e1e1e',
                                                color: '#666', cursor: 'pointer', transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <Share2 style={{ width: '15px', height: '15px' }} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Shield card */}
                            <div style={{
                                borderRadius: '18px', background: '#0d0d0d',
                                border: '1px solid #1e1e1e', padding: '18px 20px',
                                display: 'flex', alignItems: 'flex-start', gap: '14px',
                            }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Shield style={{ width: '16px', height: '16px', color: '#a3e635' }} />
                                </div>
                                <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.65 }}>
                                    Все транзакции защищены. Средства хранятся на эскроу-счёте до завершения проекта.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
