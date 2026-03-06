'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Users, Heart, Briefcase, Cpu, GraduationCap, HeartHandshake, Palette, ArrowUpRight, Zap, Dumbbell, Activity, Leaf } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';
import { formatCurrency, getProgress, getDaysLeft } from '@/lib/data';
import type { Project, ProjectCategory } from '@/types';

interface ProjectCardProps {
    project: Project;
    index?: number;
    compact?: boolean;
}

const categoryConfig: Record<ProjectCategory, {
    icon: React.ElementType;
    bg: string;
    accent: string;
    glow: string;
    label: string;
}> = {
    technology: { icon: Cpu, bg: 'linear-gradient(135deg, #0d1f3c, #1a3a6b)', accent: '#3b82f6', glow: 'rgba(59,130,246,0.3)', label: 'Технологии' },
    education: { icon: GraduationCap, bg: 'linear-gradient(135deg, #1a0d3c, #3d1a6b)', accent: '#8b5cf6', glow: 'rgba(139,92,246,0.3)', label: 'Образование' },
    business: { icon: Briefcase, bg: 'linear-gradient(135deg, #2d1a06, #5a3510)', accent: '#f59e0b', glow: 'rgba(245,158,11,0.3)', label: 'Бизнес' },
    social: { icon: HeartHandshake, bg: 'linear-gradient(135deg, #061a14, #0d3d28)', accent: '#10b981', glow: 'rgba(16,185,129,0.3)', label: 'Социальное' },
    creative: { icon: Palette, bg: 'linear-gradient(135deg, #2d061a, #6b0d35)', accent: '#ec4899', glow: 'rgba(236,72,153,0.3)', label: 'Творчество' },
    sport: { icon: Dumbbell, bg: 'linear-gradient(135deg, #1a0a06, #3d1e0a)', accent: '#f97316', glow: 'rgba(249,115,22,0.3)', label: 'Спорт' },
    health: { icon: Activity, bg: 'linear-gradient(135deg, #061616, #0d3535)', accent: '#06b6d4', glow: 'rgba(6,182,212,0.3)', label: 'Здоровье' },
    ecology: { icon: Leaf, bg: 'linear-gradient(135deg, #071a06, #0f3d0a)', accent: '#22c55e', glow: 'rgba(34,197,94,0.3)', label: 'Экология' },
};

function ProgressRing({ progress, color, size = 36 }: { progress: number; color: string; size?: number }) {
    const r = (size - 6) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (progress / 100) * circ;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <motion.circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${circ}` }}
                whileInView={{ strokeDasharray: `${dash} ${circ}` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
            />
        </svg>
    );
}

export default function ProjectCard({ project, index = 0, compact = false }: ProjectCardProps) {
    const { t } = useLocale();
    const [hovered, setHovered] = useState(false);
    const progress = getProgress(project.currentAmount, project.goalAmount);
    const daysLeft = getDaysLeft(project.deadline);
    const cfg = categoryConfig[project.category];
    const Icon = cfg.icon;
    const urgent = daysLeft <= 7;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            style={{ height: '100%' }}
        >
            <Link href={`/projects/${project.id}`} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
                <div
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                        borderRadius: '20px',
                        background: '#0f0f0f',
                        border: `1px solid ${hovered ? cfg.accent + '40' : '#1e1e1e'}`,
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.35s ease',
                        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
                        boxShadow: hovered ? `0 20px 60px ${cfg.glow}` : '0 4px 20px rgba(0,0,0,0.3)',
                        position: 'relative',
                    }}
                >
                    {/* ── COVER ── */}
                    <div style={{
                        position: 'relative',
                        height: compact ? '120px' : '168px',
                        background: cfg.bg,
                        overflow: 'hidden',
                        flexShrink: 0,
                    }}>
                        {/* Animated grid on hover */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `linear-gradient(${cfg.accent}08 1px, transparent 1px), linear-gradient(90deg, ${cfg.accent}08 1px, transparent 1px)`,
                            backgroundSize: '24px 24px',
                            opacity: hovered ? 1 : 0,
                            transition: 'opacity 0.4s ease',
                        }} />

                        {/* Glow orb */}
                        <div style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            transform: `translate(-50%, -50%) scale(${hovered ? 1.4 : 1})`,
                            width: '120px', height: '120px',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)`,
                            transition: 'transform 0.5s ease',
                        }} />

                        {/* Center icon */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <div style={{
                                width: compact ? '44px' : '56px',
                                height: compact ? '44px' : '56px',
                                borderRadius: '16px',
                                background: cfg.accent,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 8px 24px ${cfg.glow}`,
                                transform: hovered ? 'scale(1.1) rotate(-6deg)' : 'scale(1) rotate(0deg)',
                                transition: 'transform 0.35s ease',
                            }}>
                                <Icon style={{ width: compact ? '20px' : '26px', height: compact ? '20px' : '26px', color: '#fff' }} />
                            </div>
                        </div>

                        {/* Top badges */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                            {project.featured && (
                                <span style={{
                                    padding: '3px 9px', borderRadius: '20px',
                                    background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                                    color: '#0a0a0a', fontSize: '10px', fontWeight: 800,
                                    display: 'flex', alignItems: 'center', gap: '3px',
                                }}>
                                    <Zap style={{ width: '9px', height: '9px' }} /> ТОП
                                </span>
                            )}
                            <span style={{
                                padding: '3px 9px', borderRadius: '20px',
                                background: 'rgba(0,0,0,0.5)',
                                border: `1px solid ${cfg.accent}40`,
                                color: cfg.accent, fontSize: '10px', fontWeight: 600,
                                backdropFilter: 'blur(8px)',
                            }}>
                                {cfg.label}
                            </span>
                        </div>

                        {/* Arrow on hover */}
                        <div style={{
                            position: 'absolute', top: '10px', right: '10px',
                            width: '30px', height: '30px', borderRadius: '10px',
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(8px)',
                            border: `1px solid ${cfg.accent}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? 'scale(1)' : 'scale(0.7)',
                            transition: 'all 0.3s ease',
                        }}>
                            <ArrowUpRight style={{ width: '14px', height: '14px', color: cfg.accent }} />
                        </div>

                        {/* Urgent badge */}
                        {urgent && (
                            <div style={{
                                position: 'absolute', bottom: '10px', right: '10px',
                                padding: '3px 8px', borderRadius: '10px',
                                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                                color: '#ef4444', fontSize: '10px', fontWeight: 700,
                                display: 'flex', alignItems: 'center', gap: '3px',
                            }}>
                                🔥 {daysLeft}д
                            </div>
                        )}
                    </div>

                    {/* ── CONTENT ── */}
                    <div style={{
                        padding: compact ? '12px' : '18px',
                        flexGrow: 1, display: 'flex', flexDirection: 'column',
                        position: 'relative',
                    }}>
                        {/* Top accent line */}
                        <div style={{
                            position: 'absolute', top: 0, left: '18px', right: '18px', height: '1px',
                            background: `linear-gradient(to right, transparent, ${cfg.accent}30, transparent)`,
                        }} />

                        <h3 style={{
                            fontWeight: 700, color: hovered ? '#fff' : '#e0e0e0',
                            marginBottom: '8px',
                            fontSize: compact ? '13px' : '15px',
                            lineHeight: 1.35,
                            overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            transition: 'color 0.3s ease',
                            letterSpacing: '-0.01em',
                        }}>
                            {project.title}
                        </h3>

                        {!compact && (
                            <p style={{
                                fontSize: '12px', color: '#666', marginBottom: '16px',
                                lineHeight: 1.5,
                                overflow: 'hidden', display: '-webkit-box',
                                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            }}>
                                {project.shortDescription}
                            </p>
                        )}

                        {/* Progress + ring */}
                        <div style={{ marginTop: 'auto' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between', marginBottom: '8px',
                            }}>
                                <div>
                                    <div style={{ fontSize: compact ? '13px' : '15px', fontWeight: 800, color: cfg.accent, lineHeight: 1 }}>
                                        {formatCurrency(project.currentAmount)}
                                    </div>
                                    {!compact && (
                                        <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>
                                            из {formatCurrency(project.goalAmount)}
                                        </div>
                                    )}
                                </div>
                                <ProgressRing progress={progress} color={cfg.accent} size={compact ? 30 : 38} />
                            </div>

                            {/* Progress bar */}
                            <div style={{
                                width: '100%', height: '3px',
                                background: '#1a1a1a', borderRadius: '2px',
                                overflow: 'hidden', marginBottom: '12px',
                            }}>
                                <motion.div
                                    style={{
                                        height: '100%',
                                        background: `linear-gradient(to right, ${cfg.accent}, ${cfg.accent}80)`,
                                        borderRadius: '2px',
                                        boxShadow: `0 0 6px ${cfg.accent}60`,
                                    }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${Math.min(progress, 100)}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
                                />
                            </div>

                            {/* Meta footer */}
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingTop: '10px',
                                borderTop: '1px solid #161616',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Users style={{ width: '11px', height: '11px', color: '#555' }} />
                                        <span style={{ fontSize: '11px', color: '#666', fontWeight: 500 }}>
                                            {project.backersCount}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock style={{ width: '11px', height: '11px', color: urgent ? '#ef4444' : '#555' }} />
                                        <span style={{
                                            fontSize: '11px',
                                            color: urgent ? '#ef4444' : '#666',
                                            fontWeight: 500,
                                        }}>
                                            {daysLeft}д
                                        </span>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    padding: '4px 8px', borderRadius: '8px',
                                    background: hovered ? 'rgba(239,68,68,0.08)' : 'transparent',
                                    transition: 'background 0.3s ease',
                                }}>
                                    <Heart style={{
                                        width: '11px', height: '11px',
                                        color: hovered ? '#ef4444' : '#555',
                                        fill: hovered ? '#ef4444' : 'none',
                                        transition: 'all 0.3s ease',
                                    }} />
                                    <span style={{
                                        fontSize: '11px',
                                        color: hovered ? '#ef4444' : '#666',
                                        fontWeight: 500,
                                        transition: 'color 0.3s ease',
                                    }}>
                                        {project.likes}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
