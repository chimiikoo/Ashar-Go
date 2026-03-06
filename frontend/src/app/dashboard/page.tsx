'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    FolderOpen, Heart, Bookmark, Settings, Plus,
    TrendingUp, Users, Activity, ArrowUpRight,
    Briefcase, Cpu, GraduationCap, HeartHandshake, Palette,
    Dumbbell, Leaf
} from 'lucide-react';
import type { ProjectCategory } from '@/types';
import { useLocale } from '@/lib/locale-context';
import { mockProjects, formatCurrency, getProgress, getDaysLeft } from '@/lib/data';

type DashboardTab = 'projects' | 'supported' | 'saved' | 'settings';

export default function DashboardPage() {
    const { t } = useLocale();
    const [activeTab, setActiveTab] = useState<DashboardTab>('projects');

    // Simulated user data
    const myProjects = mockProjects.slice(0, 3);
    const supportedProjects = mockProjects.slice(3, 6);
    const savedProjects = mockProjects.slice(5, 8);

    const tabs: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
        { id: 'projects', label: t.dashboard.myProjects, icon: FolderOpen },
        { id: 'supported', label: t.dashboard.supported, icon: Heart },
        { id: 'saved', label: t.dashboard.saved, icon: Bookmark },
        { id: 'settings', label: t.dashboard.settings, icon: Settings },
    ];

    const statCards = [
        {
            label: t.dashboard.totalRaised,
            value: `${formatCurrency(1107500)} сом`,
            icon: TrendingUp,
            color: 'text-accent',
            bg: 'from-accent/20 to-accent-hover/20',
        },
        {
            label: t.dashboard.activeProjects,
            value: '3',
            icon: Activity,
            color: 'text-blue-400',
            bg: 'from-blue-500/20 to-cyan-500/20',
        },
        {
            label: t.dashboard.totalBackers,
            value: '479',
            icon: Users,
            color: 'text-purple-400',
            bg: 'from-purple-500/20 to-pink-500/20',
        },
    ];

    const renderProjects = (projects: typeof mockProjects) => (
        <div className="space-y-4">
            {projects.map((project) => {
                const progress = getProgress(project.currentAmount, project.goalAmount);
                const daysLeft = getDaysLeft(project.deadline);
                return (
                    <Link key={project.id} href={`/projects/${project.id}`} className="block group">
                        <div className="card-hover rounded-xl bg-bg-card border border-border p-5 flex flex-col sm:flex-row gap-4">
                            {/* Mini cover */}
                            <div className="w-full sm:w-24 h-20 sm:h-24 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center flex-shrink-0">
                                {(() => {
                                    const iconMap: Record<ProjectCategory, { icon: React.ElementType; gradient: string }> = {
                                        technology: { icon: Cpu, gradient: 'from-blue-600/60 to-cyan-700/60' },
                                        education: { icon: GraduationCap, gradient: 'from-violet-600/60 to-purple-700/60' },
                                        business: { icon: Briefcase, gradient: 'from-amber-600/60 to-orange-700/60' },
                                        social: { icon: HeartHandshake, gradient: 'from-emerald-600/60 to-teal-700/60' },
                                        creative: { icon: Palette, gradient: 'from-rose-600/60 to-pink-700/60' },
                                        sport: { icon: Dumbbell, gradient: 'from-orange-600/60 to-red-700/60' },
                                        health: { icon: Activity, gradient: 'from-cyan-600/60 to-sky-700/60' },
                                        ecology: { icon: Leaf, gradient: 'from-green-600/60 to-emerald-700/60' },
                                    };
                                    const cfg = iconMap[project.category];
                                    const Icon = cfg.icon;
                                    return (
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
                                            <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-white group-hover:text-accent transition-colors truncate">
                                        {project.title}
                                    </h3>
                                    <ArrowUpRight className="w-4 h-4 text-text-muted flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-accent font-medium">
                                            {formatCurrency(project.currentAmount)} сом
                                        </span>
                                        <span className="text-xs text-text-muted">{progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-text-muted">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" />
                                        {project.backersCount} {t.project.backers}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Activity className="w-3.5 h-3.5" />
                                        {daysLeft} {t.project.daysLeft}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );

    return (
        <div className="pt-16 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent text-xl font-bold">
                            A
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{t.dashboard.title}</h1>
                            <p className="text-sm text-text-secondary">Добро пожаловать, Айбек!</p>
                        </div>
                    </div>
                    <Link href="/create" className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {t.dashboard.createProject}
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                >
                    {statCards.map((stat, i) => (
                        <div
                            key={i}
                            className="rounded-2xl bg-bg-card border border-border p-5 flex items-center gap-4"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-text-muted">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Tabs */}
                <div className="border-b border-border mb-6">
                    <div className="flex gap-1 overflow-x-auto scroll-container">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-text-secondary hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'projects' && renderProjects(myProjects)}
                    {activeTab === 'supported' && renderProjects(supportedProjects)}
                    {activeTab === 'saved' && renderProjects(savedProjects)}
                    {activeTab === 'settings' && (
                        <div className="rounded-2xl bg-bg-card border border-border p-8 max-w-lg">
                            <h3 className="text-lg font-semibold text-white mb-6">Настройки профиля</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-2">Имя</label>
                                    <input
                                        type="text"
                                        defaultValue="Айбек Касымов"
                                        className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border text-white focus:outline-none focus:border-accent/50 transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-2">Email</label>
                                    <input
                                        type="email"
                                        defaultValue="aibek@mail.kg"
                                        className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border text-white focus:outline-none focus:border-accent/50 transition-colors text-sm"
                                    />
                                </div>
                                <button className="btn-primary mt-4">Сохранить</button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
