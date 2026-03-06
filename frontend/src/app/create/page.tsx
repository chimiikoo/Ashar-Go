'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, Rocket, Gift, Info, Loader2, CheckCircle2,
    Briefcase, Cpu, GraduationCap, HeartHandshake, Palette,
    Dumbbell, Activity, Leaf,
    ArrowLeft, Sparkles, Target, Calendar,
    Zap, ChevronRight,
} from 'lucide-react';
import { useLocale } from '@/lib/locale-context';
import { useAuth } from '@/lib/auth-context';
import MediaUploader from '@/components/projects/MediaUploader';
import type { ProjectCategory } from '@/types';
import { getApiUrl } from '@/lib/api';

/* ─── Shared styles ─── */
const inp: React.CSSProperties = {
    width: '100%', padding: '14px 16px', borderRadius: '14px',
    background: '#111', border: '1px solid #222',
    color: '#fff', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
};
const label: React.CSSProperties = {
    display: 'block', fontSize: '11px', color: '#666',
    marginBottom: '8px', fontWeight: 700,
    letterSpacing: '1px', textTransform: 'uppercase',
};
const card: React.CSSProperties = {
    borderRadius: '20px', background: '#0d0d0d',
    border: '1px solid #1a1a1a', padding: '28px',
    marginBottom: '20px',
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(163,230,53,0.5)';
    e.target.style.boxShadow = '0 0 0 3px rgba(163,230,53,0.06)';
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#222';
    e.target.style.boxShadow = 'none';
};

const CATEGORIES: { id: ProjectCategory; label: string; icon: React.ElementType; color: string; emoji: string }[] = [
    { id: 'business', label: 'Бизнес', icon: Briefcase, color: '#f59e0b', emoji: '💼' },
    { id: 'technology', label: 'Технологии', icon: Cpu, color: '#3b82f6', emoji: '💻' },
    { id: 'education', label: 'Образование', icon: GraduationCap, color: '#8b5cf6', emoji: '🎓' },
    { id: 'social', label: 'Социальное', icon: HeartHandshake, color: '#10b981', emoji: '🤝' },
    { id: 'creative', label: 'Творчество', icon: Palette, color: '#ec4899', emoji: '🎨' },
    { id: 'sport', label: 'Спорт', icon: Dumbbell, color: '#f97316', emoji: '🏋️' },
    { id: 'health', label: 'Здоровье', icon: Activity, color: '#06b6d4', emoji: '💊' },
    { id: 'ecology', label: 'Экология', icon: Leaf, color: '#22c55e', emoji: '🌿' },
];

const STEPS = ['Основное', 'Категория', 'Цель & Сроки', 'Награды', 'Публикация'];

export default function CreateProjectPage() {
    const { t } = useLocale();
    const router = useRouter();
    const { user, token } = useAuth();

    const [step, setStep] = useState(0);
    const [title, setTitle] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [fullDesc, setFullDesc] = useState('');
    const [category, setCategory] = useState<ProjectCategory>('technology');
    const [goal, setGoal] = useState('');
    const [deadline, setDeadline] = useState('');
    const [fundingType, setFundingType] = useState<'all-or-nothing' | 'flexible'>('all-or-nothing');
    const [projectType, setProjectType] = useState<'reward' | 'donation'>('reward');
    const [rewards, setRewards] = useState<{ title: string; description: string; amount: string; qty: string }[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [published, setPublished] = useState(false);

    const selectedCat = CATEGORIES.find(c => c.id === category)!;

    const handleSubmit = async () => {
        if (!token) { router.push('/auth/login'); return; }
        setError('');
        if (!title || !shortDesc || !fullDesc || !goal || !deadline) {
            setError('Пожалуйста, заполните все обязательные поля'); return;
        }
        try {
            setLoading(true);
            const res = await fetch(getApiUrl('/api/projects'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title, shortDescription: shortDesc, description: fullDesc,
                    category: category.toUpperCase(),
                    goalAmount: parseFloat(goal),
                    fundingType: fundingType === 'all-or-nothing' ? 'ALL_OR_NOTHING' : 'FLEXIBLE',
                    projectType: projectType === 'reward' ? 'REWARD' : 'DONATION',
                    deadline: new Date(deadline).toISOString(),
                    videoUrl: videoUrl || undefined,
                    photos: photos.length > 0 ? photos : undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Ошибка при создании');
            setPublished(true);
            setTimeout(() => router.push('/dashboard'), 2200);
        } catch (err: any) {
            setError(err.message || 'Ошибка сети');
        } finally {
            setLoading(false);
        }
    };

    const stepValid = [
        title.length > 2 && shortDesc.length > 10 && fullDesc.length > 20,
        true,
        goal.length > 0 && deadline.length > 0,
        true,
        true,
    ];

    const canNext = stepValid[step];

    if (published) {
        return (
            <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                    style={{ textAlign: 'center' }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 20px 60px rgba(163,230,53,0.5)',
                        }}
                    >
                        <Rocket style={{ width: '48px', height: '48px', color: '#0a0a0a' }} />
                    </motion.div>
                    <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>
                        Проект запущен! 🚀
                    </h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>Перенаправляем в ваш кабинет...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#080808', position: 'relative', overflow: 'hidden' }}>
            {/* BG grid */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(163,230,53,0.018) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(163,230,53,0.018) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
            }} />
            {/* Glow */}
            <div style={{
                position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)',
                width: '800px', height: '500px',
                background: `radial-gradient(ellipse, ${selectedCat.color}08 0%, transparent 70%)`,
                filter: 'blur(60px)', pointerEvents: 'none', transition: 'background 0.6s ease',
            }} />

            {/* Sticky progress header */}
            <div style={{
                position: 'sticky', top: '66px', zIndex: 50,
                background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #111',
            }}>
                <div style={{ maxWidth: '720px', margin: '0 auto', padding: '14px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {STEPS.map((s, i) => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                                <button
                                    onClick={() => i < step && setStep(i)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '5px 10px', borderRadius: '10px',
                                        background: i === step ? `${selectedCat.color}15` : i < step ? 'rgba(163,230,53,0.06)' : 'transparent',
                                        border: `1px solid ${i === step ? selectedCat.color + '40' : i < step ? 'rgba(163,230,53,0.2)' : '#1a1a1a'}`,
                                        color: i === step ? selectedCat.color : i < step ? '#a3e635' : '#444',
                                        fontSize: '12px', fontWeight: i === step ? 700 : 500,
                                        cursor: i < step ? 'pointer' : 'default',
                                        transition: 'all 0.3s ease', whiteSpace: 'nowrap',
                                    }}
                                >
                                    {i < step ? <CheckCircle2 style={{ width: '13px', height: '13px' }} /> : (
                                        <span style={{
                                            width: '18px', height: '18px', borderRadius: '50%',
                                            background: i === step ? selectedCat.color : '#1a1a1a',
                                            color: i === step ? '#0a0a0a' : '#555',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '10px', fontWeight: 800, flexShrink: 0,
                                        }}>{i + 1}</span>
                                    )}
                                    <span className="step-label">{s}</span>
                                </button>
                                {i < STEPS.length - 1 && (
                                    <div style={{ flex: 1, height: '1px', background: i < step ? 'rgba(163,230,53,0.25)' : '#1a1a1a', minWidth: '12px' }} />
                                )}
                            </div>
                        ))}
                    </div>
                    <style>{`@media (max-width: 600px) { .step-label { display: none; } }`}</style>
                </div>
            </div>

            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>
                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '32px', textAlign: 'center' }}
                >
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '5px 14px', borderRadius: '20px',
                        background: `${selectedCat.color}10`, border: `1px solid ${selectedCat.color}30`,
                        fontSize: '11px', color: selectedCat.color, letterSpacing: '2px',
                        textTransform: 'uppercase', fontWeight: 700, marginBottom: '14px',
                        transition: 'all 0.4s ease',
                    }}>
                        <Sparkles style={{ width: '11px', height: '11px' }} />
                        Создать проект · Шаг {step + 1}/{STEPS.length}
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#fff',
                        letterSpacing: '-0.03em', marginBottom: '8px',
                    }}>
                        {STEPS[step]}
                    </h1>
                    <p style={{ fontSize: '13px', color: '#555' }}>
                        {['Расскажите о вашей идее', 'Выберите подходящую категорию', 'Установите цель и сроки', 'Настройте награды для бэкеров', 'Последний шаг!'][step]}
                    </p>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            style={{
                                padding: '12px 16px', borderRadius: '14px', marginBottom: '20px',
                                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                color: '#ef4444', fontSize: '13px',
                            }}>
                            ⚠️ {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Step content ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* STEP 0 — Basic info */}
                        {step === 0 && (
                            <>
                                {/* Cover drop */}
                                <div style={{ ...card, padding: '28px' }}>
                                    <MediaUploader
                                        token={token}
                                        onVideoChange={url => setVideoUrl(url)}
                                        onPhotosChange={urls => setPhotos(urls)}
                                        accentColor={selectedCat.color}
                                    />
                                </div>

                                <div style={card}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={label}>{t.create.projectName} *</label>
                                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                                            maxLength={80} placeholder="Например: EcoBishkek — Умные урны для сортировки"
                                            style={inp} onFocus={onFocus} onBlur={onBlur} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                            <span style={{ fontSize: '11px', color: title.length > 2 ? '#a3e635' : '#555' }}>
                                                {title.length > 2 ? '✓ Хорошее название' : ''}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#444' }}>{title.length}/80</span>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={label}>{t.create.shortDesc} *</label>
                                        <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)}
                                            maxLength={200} rows={3}
                                            placeholder="Краткое описание — отображается на карточке проекта"
                                            style={{ ...inp, resize: 'none' } as React.CSSProperties}
                                            onFocus={onFocus} onBlur={onBlur} />
                                        <p style={{ fontSize: '11px', color: '#444', marginTop: '4px', textAlign: 'right' }}>{shortDesc.length}/200</p>
                                    </div>

                                    <div>
                                        <label style={label}>{t.create.fullDesc} *</label>
                                        <textarea value={fullDesc} onChange={e => setFullDesc(e.target.value)}
                                            rows={8}
                                            placeholder="Подробно расскажите о проекте: проблема, решение, команда, план использования средств."
                                            style={{ ...inp, resize: 'vertical' } as React.CSSProperties}
                                            onFocus={onFocus} onBlur={onBlur} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* STEP 1 — Category */}
                        {step === 1 && (
                            <div style={card}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                                    {CATEGORIES.map(cat => {
                                        const isActive = category === cat.id;
                                        const Icon = cat.icon;
                                        return (
                                            <motion.button
                                                key={cat.id}
                                                type="button"
                                                whileHover={{ y: -3 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setCategory(cat.id)}
                                                style={{
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                                                    padding: '20px 12px', borderRadius: '16px',
                                                    border: isActive ? `2px solid ${cat.color}` : '1px solid #1e1e1e',
                                                    background: isActive ? `${cat.color}10` : 'transparent',
                                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                                    position: 'relative', overflow: 'hidden',
                                                }}
                                            >
                                                {isActive && (
                                                    <div style={{
                                                        position: 'absolute', inset: 0,
                                                        background: `radial-gradient(circle at 50% 100%, ${cat.color}08, transparent 60%)`,
                                                    }} />
                                                )}
                                                <div style={{
                                                    width: '48px', height: '48px', borderRadius: '14px',
                                                    background: isActive ? cat.color : `${cat.color}15`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: isActive ? `0 8px 20px ${cat.color}40` : 'none',
                                                }}>
                                                    <Icon style={{ width: '22px', height: '22px', color: isActive ? '#0a0a0a' : cat.color }} />
                                                </div>
                                                <span style={{ fontSize: '12px', fontWeight: 700, color: isActive ? cat.color : '#888' }}>
                                                    {cat.label}
                                                </span>
                                                {isActive && (
                                                    <div style={{
                                                        position: 'absolute', top: '8px', right: '8px',
                                                        width: '18px', height: '18px', borderRadius: '50%',
                                                        background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <CheckCircle2 style={{ width: '12px', height: '12px', color: '#0a0a0a' }} />
                                                    </div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                {/* Selected preview */}
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        marginTop: '20px', padding: '16px 20px', borderRadius: '14px',
                                        background: `${selectedCat.color}08`, border: `1px solid ${selectedCat.color}25`,
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                    }}
                                >
                                    <span style={{ fontSize: '24px' }}>{selectedCat.emoji}</span>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: selectedCat.color }}>
                                            {selectedCat.label}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                                            Выбранная категория
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* STEP 2 — Goal & Deadline */}
                        {step === 2 && (
                            <>
                                <div style={card}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '12px',
                                            background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <Target style={{ width: '18px', height: '18px', color: '#a3e635' }} />
                                        </div>
                                        <div>
                                            <label style={{ ...label, marginBottom: '2px' }}>{t.create.goal} (сом) *</label>
                                            <p style={{ fontSize: '11px', color: '#444', marginBottom: '10px' }}>Укажите минимальную сумму для реализации проекта</p>
                                            <input type="number" value={goal} onChange={e => setGoal(e.target.value)}
                                                placeholder="500 000" style={inp} onFocus={onFocus} onBlur={onBlur} />
                                            {goal && (
                                                <p style={{ fontSize: '12px', color: '#a3e635', marginTop: '6px' }}>
                                                    ≈ {Number(goal).toLocaleString('ru')} сом
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '12px',
                                            background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <Calendar style={{ width: '18px', height: '18px', color: '#a3e635' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ ...label, marginBottom: '2px' }}>{t.create.deadline} *</label>
                                            <p style={{ fontSize: '11px', color: '#444', marginBottom: '10px' }}>Когда заканчивается сбор средств?</p>
                                            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                                                style={{ ...inp, colorScheme: 'dark' }} onFocus={onFocus} onBlur={onBlur} />
                                        </div>
                                    </div>
                                </div>

                                {/* Funding type */}
                                <div style={card}>
                                    <label style={label}>{t.create.fundingType} *</label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {(['all-or-nothing', 'flexible'] as const).map(type => {
                                            const isActive = fundingType === type;
                                            return (
                                                <button key={type} type="button" onClick={() => setFundingType(type)} style={{
                                                    flex: 1, padding: '16px', borderRadius: '14px',
                                                    border: isActive ? '2px solid #a3e635' : '1px solid #1e1e1e',
                                                    background: isActive ? 'rgba(163,230,53,0.06)' : '#111',
                                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
                                                }}>
                                                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                                                        {type === 'all-or-nothing' ? '🎯' : '💧'}
                                                    </div>
                                                    <div style={{ fontSize: '13px', fontWeight: 700, color: isActive ? '#a3e635' : '#ccc', marginBottom: '4px' }}>
                                                        {type === 'all-or-nothing' ? 'Всё или ничего' : 'Гибкий сбор'}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.5 }}>
                                                        {type === 'all-or-nothing'
                                                            ? 'Деньги возвращаются, если цель не достигнута'
                                                            : 'Получаете собранные деньги в любом случае'}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Project type */}
                                <div style={card}>
                                    <label style={label}>{t.create.projectType} *</label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {(['reward', 'donation'] as const).map(type => {
                                            const isActive = projectType === type;
                                            return (
                                                <button key={type} type="button" onClick={() => setProjectType(type)} style={{
                                                    flex: 1, padding: '16px', borderRadius: '14px',
                                                    border: isActive ? '2px solid #a3e635' : '1px solid #1e1e1e',
                                                    background: isActive ? 'rgba(163,230,53,0.06)' : '#111',
                                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
                                                }}>
                                                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                                                        {type === 'reward' ? '🎁' : '❤️'}
                                                    </div>
                                                    <div style={{ fontSize: '13px', fontWeight: 700, color: isActive ? '#a3e635' : '#ccc', marginBottom: '4px' }}>
                                                        {type === 'reward' ? 'Вознаграждения' : 'Благотворительность'}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.5 }}>
                                                        {type === 'reward'
                                                            ? 'Бэкеры получают бонусы за поддержку'
                                                            : 'Просто собираете деньги на доброе дело'}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* STEP 3 — Rewards */}
                        {step === 3 && (
                            <div style={card}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                                            🎁 Награды
                                        </h3>
                                        <p style={{ fontSize: '12px', color: '#555' }}>Добавьте призы для ваших бэкеров</p>
                                    </div>
                                    <button type="button" onClick={() => setRewards([...rewards, { title: '', description: '', amount: '', qty: '' }])} style={{
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                        padding: '9px 16px', borderRadius: '12px',
                                        background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)',
                                        color: '#a3e635', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                    }}>
                                        <Plus style={{ width: '14px', height: '14px' }} />
                                        Добавить
                                    </button>
                                </div>

                                {rewards.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '48px 20px', borderRadius: '16px', background: '#111', border: '1px dashed #222' }}>
                                        <Gift style={{ width: '36px', height: '36px', color: '#333', margin: '0 auto 12px', display: 'block' }} />
                                        <p style={{ fontSize: '14px', color: '#555', marginBottom: '6px' }}>Нет наград</p>
                                        <p style={{ fontSize: '12px', color: '#333' }}>Награды привлекают больше бэкеров</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {rewards.map((reward, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
                                                borderRadius: '16px', background: '#111', border: '1px solid #1e1e1e', padding: '20px',
                                                position: 'relative',
                                            }}>
                                                <div style={{
                                                    position: 'absolute', top: '-1px', left: '20px', right: '20px', height: '2px',
                                                    background: `linear-gradient(to right, ${selectedCat.color}, transparent)`,
                                                    borderRadius: '0 0 2px 2px', opacity: 0.5,
                                                }} />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                                    <span style={{ fontSize: '12px', color: selectedCat.color, fontWeight: 700 }}>Награда #{i + 1}</span>
                                                    <button type="button" onClick={() => setRewards(rewards.filter((_, idx) => idx !== i))} style={{
                                                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                                                        borderRadius: '8px', color: '#ef4444', cursor: 'pointer', padding: '5px 8px',
                                                        display: 'flex', alignItems: 'center',
                                                    }}>
                                                        <X style={{ width: '13px', height: '13px' }} />
                                                    </button>
                                                </div>
                                                <div style={{ display: 'grid', gap: '10px' }}>
                                                    <input type="text" placeholder={t.create.rewardTitle} value={reward.title}
                                                        onChange={e => { const n = [...rewards]; n[i].title = e.target.value; setRewards(n); }}
                                                        style={inp} onFocus={onFocus} onBlur={onBlur} />
                                                    <textarea placeholder={t.create.rewardDesc} value={reward.description}
                                                        onChange={e => { const n = [...rewards]; n[i].description = e.target.value; setRewards(n); }}
                                                        rows={2} style={{ ...inp, resize: 'none' } as React.CSSProperties}
                                                        onFocus={onFocus} onBlur={onBlur} />
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                        <input type="number" placeholder="Сумма (сом)" value={reward.amount}
                                                            onChange={e => { const n = [...rewards]; n[i].amount = e.target.value; setRewards(n); }}
                                                            style={inp} onFocus={onFocus} onBlur={onBlur} />
                                                        <input type="number" placeholder="Кол-во" value={reward.qty}
                                                            onChange={e => { const n = [...rewards]; n[i].qty = e.target.value; setRewards(n); }}
                                                            style={inp} onFocus={onFocus} onBlur={onBlur} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 4 — Publish */}
                        {step === 4 && (
                            <div>
                                {/* Summary card */}
                                <div style={{ ...card, borderColor: 'rgba(163,230,53,0.15)', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle2 style={{ width: '16px', height: '16px', color: '#a3e635' }} />
                                        Сводка проекта
                                    </h3>
                                    {[
                                        { icon: '📝', label: 'Название', value: title || '—' },
                                        { icon: selectedCat.emoji, label: 'Категория', value: selectedCat.label },
                                        { icon: '🎯', label: 'Цель', value: goal ? `${Number(goal).toLocaleString('ru')} сом` : '—' },
                                        { icon: '📅', label: 'Дедлайн', value: deadline || '—' },
                                        { icon: '🎁', label: 'Наград', value: String(rewards.length) },
                                    ].map(row => (
                                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #141414' }}>
                                            <span style={{ fontSize: '13px', color: '#555' }}>{row.icon} {row.label}</span>
                                            <span style={{ fontSize: '13px', color: '#ccc', fontWeight: 600, maxWidth: '60%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {row.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Info */}
                                <div style={{
                                    padding: '16px 20px', borderRadius: '16px', marginBottom: '20px',
                                    background: 'rgba(163,230,53,0.04)', border: '1px solid rgba(163,230,53,0.1)',
                                    display: 'flex', gap: '14px', alignItems: 'flex-start',
                                }}>
                                    <Info style={{ width: '18px', height: '18px', color: '#a3e635', flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#a3e635', marginBottom: '4px' }}>Комиссия платформы: 5-8%</p>
                                        <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.65 }}>
                                            Ashar-go взимает комиссию только с успешно завершённых проектов. При «Всё или ничего» деньги возвращаются бэкерам если цель не достигнута.
                                        </p>
                                    </div>
                                </div>

                                {/* Publish button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !user}
                                    style={{
                                        width: '100%', padding: '18px', borderRadius: '18px', border: 'none',
                                        background: loading || !user ? '#555' : `linear-gradient(135deg, ${selectedCat.color}, ${selectedCat.color}cc)`,
                                        color: '#0a0a0a', fontSize: '16px', fontWeight: 900,
                                        cursor: loading || !user ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        boxShadow: loading || !user ? 'none' : `0 12px 36px ${selectedCat.color}40`,
                                        transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                                        marginBottom: '12px',
                                    }}
                                >
                                    {!loading && !(!user) && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }} />
                                    )}
                                    {loading
                                        ? <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                                        : <><Rocket style={{ width: '20px', height: '20px' }} /> {t.create.publish} <Zap style={{ width: '16px', height: '16px' }} /></>
                                    }
                                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                                </button>

                                <button onClick={() => { }} style={{
                                    width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #1e1e1e',
                                    background: 'transparent', color: '#666', fontSize: '14px', cursor: 'pointer',
                                }}>
                                    {t.create.saveDraft}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                {step < 4 && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        {step > 0 && (
                            <button onClick={() => setStep(s => s - 1)} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '14px 20px', borderRadius: '14px',
                                background: 'transparent', border: '1px solid #1e1e1e',
                                color: '#888', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                            }}>
                                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                                Назад
                            </button>
                        )}
                        <button
                            onClick={() => canNext && setStep(s => s + 1)}
                            disabled={!canNext}
                            style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '14px 20px', borderRadius: '14px', border: 'none',
                                background: canNext ? `linear-gradient(135deg, #a3e635, #7bc820)` : '#1a1a1a',
                                color: canNext ? '#0a0a0a' : '#444',
                                fontSize: '14px', fontWeight: 800, cursor: canNext ? 'pointer' : 'not-allowed',
                                transition: 'all 0.25s ease',
                                boxShadow: canNext ? '0 8px 24px rgba(163,230,53,0.2)' : 'none',
                            }}
                        >
                            Далее
                            <ChevronRight style={{ width: '16px', height: '16px' }} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
