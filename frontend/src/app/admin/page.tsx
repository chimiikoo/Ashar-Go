'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users as UsersIcon,
    FolderOpen,
    BarChart3,
    Settings as SettingsIcon,
    CheckCircle,
    XCircle,
    AlertCircle,
    Shield,
    TrendingUp,
    Search,
    Mail,
    Calendar,
    Edit,
    Trash2,
    Save,
    Lock
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { mockProjects } from '@/lib/data';

export default function AdminDashboard() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Users Data
    const mockUsers = [
        { id: '1', name: 'Алексей Иванов', email: 'alex@example.com', role: 'ADMIN', joined: '2023-10-12', status: 'Active' },
        { id: '2', name: 'Бегайим Садыкова', email: 'begayim@example.com', role: 'USER', joined: '2024-01-05', status: 'Active' },
        { id: '3', name: 'Марк Цукерберг', email: 'mark@meta.com', role: 'USER', joined: '2024-02-15', status: 'Banned' },
        { id: '4', name: 'Эркин Маматов', email: 'erkin@example.com', role: 'MODERATOR', joined: '2023-12-20', status: 'Active' },
    ];

    // Settings State
    const [settings, setSettings] = useState({
        siteName: 'Ashar Go',
        commission: 5,
        maintenance: false,
        allowNewProjects: true
    });

    // Protect the route
    useEffect(() => {
        if (isAuthenticated && user?.role !== 'ADMIN') {
            // router.push('/');
        }
    }, [user, isAuthenticated, router]);

    const stats = [
        { label: 'Всего пользователей', value: '1,284', icon: UsersIcon, color: '#3b82f6', change: '+12%' },
        { label: 'Всего проектов', value: '156', icon: FolderOpen, color: '#a3e635', change: '+5%' },
        { label: 'Собрано средств', value: '12.4M', icon: TrendingUp, color: '#10b981', change: '+18%' },
        { label: 'На модерации', value: '12', icon: AlertCircle, color: '#f59e0b', change: '-2' },
    ];

    const projectsToDisplay = mockProjects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authorId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderOverview = () => (
        <>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                background: '#141414',
                                border: '1px solid #222',
                                borderRadius: '20px',
                                padding: '24px'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon style={{ width: '20px', height: '20px', color: stat.color }} />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: stat.change.startsWith('+') ? '#10b981' : '#f59e0b' }}>
                                    {stat.change}
                                </span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>{stat.label}</p>
                            <p style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Table */}
            <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '24px', padding: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>Последние проекты</h2>
                {renderProjectsTable(mockProjects.slice(0, 5))}
            </div>
        </>
    );

    const renderProjectsTable = (data: any[]) => (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #222' }}>
                        <th style={{ textAlign: 'left', padding: '12px 16px', color: '#444', fontSize: '12px', fontWeight: 600 }}>ПРОЕКТ</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', color: '#444', fontSize: '12px', fontWeight: 600 }}>АВТОР</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', color: '#444', fontSize: '12px', fontWeight: 600 }}>ЦЕЛЬ</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', color: '#444', fontSize: '12px', fontWeight: 600 }}>СТАТУС</th>
                        <th style={{ textAlign: 'right', padding: '12px 16px', color: '#444', fontSize: '12px', fontWeight: 600 }}>ДЕЙСТВИЯ</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((p, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FolderOpen style={{ width: '18px', height: '18px', color: '#a3e635' }} />
                                    </div>
                                    <div style={{ maxWidth: '200px' }}>
                                        <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                                        <p style={{ color: '#555', fontSize: '11px' }}>ID: {p.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#333' }} />
                                    <p style={{ color: '#aaa', fontSize: '14px' }}>User_{p.authorId.slice(0, 4)}</p>
                                </div>
                            </td>
                            <td style={{ padding: '16px', color: '#fff', fontSize: '14px', fontWeight: 600 }}>{p.goalAmount.toLocaleString()} сом</td>
                            <td style={{ padding: '16px' }}>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: p.status === 'active' ? '#10b98115' : '#f59e0b15',
                                    color: p.status === 'active' ? '#10b981' : '#f59e0b',
                                    border: p.status === 'active' ? '1px solid #10b98130' : '1px solid #f59e0b30'
                                }}>
                                    {p.status === 'active' ? 'Активен' : 'Черновик'}
                                </span>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#10b98120', border: 'none', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <CheckCircle style={{ width: '16px', height: '16px' }} />
                                    </button>
                                    <button style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ef444420', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <XCircle style={{ width: '16px', height: '16px' }} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderUsers = () => (
        <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Пользователи платформы</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: '#a3e635', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        Добавить модератора
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #222' }}>
                            <th style={{ textAlign: 'left', padding: '12px 16px', color: '#444', fontSize: '12px', fontWeight: 600 }}>ПОЛЬЗОВАТЕЛЬ</th>
                            <th style={{ textAlign: 'left', padding: '12px 16px', color: '#444', fontSize: '12px', fontWeight: 600 }}>РОЛЬ</th>
                            <th style={{ textAlign: 'left', padding: '12px 16px', color: '#444', fontSize: '12px', fontWeight: 600 }}>ДАТА РЕГИСТРАЦИИ</th>
                            <th style={{ textAlign: 'left', padding: '12px 16px', color: '#444', fontSize: '12px', fontWeight: 600 }}>СТАТУС</th>
                            <th style={{ textAlign: 'right', padding: '12px 16px', color: '#444', fontSize: '12px', fontWeight: 600 }}>ДЕЙСТВИЯ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockUsers.map((u, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <UsersIcon style={{ width: '18px', height: '18px', color: '#888' }} />
                                        </div>
                                        <div>
                                            <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{u.name}</p>
                                            <p style={{ color: '#555', fontSize: '11px' }}>{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ fontSize: '13px', color: u.role === 'ADMIN' ? '#a3e635' : '#888', fontWeight: 600 }}>{u.role}</span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '13px' }}>
                                        <Calendar style={{ width: '14px', height: '14px' }} />
                                        {u.joined}
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        background: u.status === 'Active' ? '#10b98115' : '#ef444415',
                                        color: u.status === 'Active' ? '#10b981' : '#ef4444',
                                        border: u.status === 'Active' ? '1px solid #10b98130' : '1px solid #ef444430'
                                    }}>
                                        {u.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#333', border: 'none', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <Edit style={{ width: '16px', height: '16px' }} />
                                        </button>
                                        <button style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ef444410', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <Trash2 style={{ width: '16px', height: '16px' }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div style={{ maxWidth: '800px' }}>
            <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '24px', padding: '32px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <SettingsIcon style={{ width: '24px', height: '24px', color: '#a3e635' }} />
                    Общие настройки
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: '#888', fontWeight: 500 }}>Название платформы</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '12px 16px', color: '#fff', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: '#888', fontWeight: 500 }}>Комиссия платформы (%)</label>
                        <input
                            type="number"
                            value={settings.commission}
                            onChange={(e) => setSettings({ ...settings, commission: parseInt(e.target.value) })}
                            style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '12px 16px', color: '#fff', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#1a1a1a', borderRadius: '16px', border: '1px solid #333' }}>
                        <div>
                            <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>Режим обслуживания</p>
                            <p style={{ color: '#666', fontSize: '12px' }}>Сделать сайт недоступным для пользователей</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, maintenance: !settings.maintenance })}
                            style={{
                                width: '40px', height: '20px', borderRadius: '20px',
                                background: settings.maintenance ? '#a3e635' : '#444',
                                position: 'relative', border: 'none', cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            <div style={{
                                width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                                position: 'absolute', top: '2px', left: settings.maintenance ? '22px' : '2px',
                                transition: 'all 0.3s'
                            }} />
                        </button>
                    </div>

                    <button style={{ background: '#a3e635', color: '#000', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Save style={{ width: '18px', height: '18px' }} />
                        Сохранить изменения
                    </button>
                </div>
            </div>

            <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '24px', padding: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Lock style={{ width: '24px', height: '24px', color: '#ef4444' }} />
                    Безопасность
                </h2>
                <button style={{ background: 'transparent', border: '1px solid #ef444450', color: '#ef4444', padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    Сбросить все сессии модераторов
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex' }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                background: '#111',
                borderRight: '1px solid #222',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#a3e635', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield style={{ width: '18px', height: '18px', color: '#000' }} />
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Админ-панель</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {[
                        { id: 'overview', label: 'Обзор', icon: BarChart3 },
                        { id: 'projects', label: 'Проекты', icon: FolderOpen },
                        { id: 'users', label: 'Пользователи', icon: UsersIcon },
                        { id: 'settings', label: 'Настройки', icon: SettingsIcon },
                    ].map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: isActive ? '#a3e63515' : 'transparent',
                                    color: isActive ? '#a3e635' : '#888',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px',
                                    fontWeight: isActive ? 600 : 500,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Icon style={{ width: '18px', height: '18px' }} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <div style={{ marginTop: 'auto', padding: '16px', background: '#1a1a1a', borderRadius: '16px', border: '1px solid #222' }}>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Вы вошли как:</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UsersIcon style={{ width: '16px', height: '16px', color: '#666' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{user?.name || 'Администратор'}</p>
                            <p style={{ fontSize: '11px', color: '#a3e635' }}>Super Admin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', marginLeft: '280px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                            {activeTab === 'overview' && 'Обзор'}
                            {activeTab === 'projects' && 'Управление проектами'}
                            {activeTab === 'users' && 'Пользователи'}
                            {activeTab === 'settings' && 'Настройки'}
                        </h1>
                        <p style={{ color: '#666', fontSize: '14px' }}>
                            {activeTab === 'overview' && 'Общая статистика и недавняя активность'}
                            {activeTab === 'projects' && 'Просмотр и модерация всех проектов на платформе'}
                            {activeTab === 'users' && 'Управление аккаунтами и ролями пользователей'}
                            {activeTab === 'settings' && 'Конфигурация сайта и параметров платформы'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#444' }} />
                            <input
                                type="text"
                                placeholder="Поиск..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    background: '#1a1a1a',
                                    border: '1px solid #222',
                                    borderRadius: '10px',
                                    padding: '10px 12px 10px 36px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    width: '240px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'projects' && (
                            <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '24px', padding: '24px' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>Все проекты</h2>
                                {renderProjectsTable(projectsToDisplay)}
                            </div>
                        )}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'settings' && renderSettings()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
