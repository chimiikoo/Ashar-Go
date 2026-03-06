'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Globe, ChevronDown, Rocket, User, Shield,
    LayoutGrid, LogOut, Settings, Compass
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useLocale } from '@/lib/locale-context';
import { useAuth } from '@/lib/auth-context';
import type { Locale } from '@/types';

const localeLabels: Record<Locale, string> = { ru: 'RU', ky: 'KY', en: 'EN' };
const localeFullNames: Record<Locale, string> = { ru: 'Русский', ky: 'Кыргызча', en: 'English' };
const localeFlags: Record<Locale, string> = { ru: '🇷🇺', ky: '🇰🇬', en: '🇺🇸' };

export default function Header() {
    const { locale, setLocale, t } = useLocale();
    const { user, isAuthenticated, logout } = useAuth();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
            if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const navLinks = [
        { href: '/projects', label: t.nav.explore, icon: Compass },
        { href: '/#how-it-works', label: t.nav.howItWorks, icon: LayoutGrid },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                    transition: 'all 0.3s ease',
                    background: scrolled
                        ? 'rgba(10,10,10,0.85)'
                        : 'rgba(10,10,10,0.6)',
                    backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
                    borderBottom: scrolled
                        ? '1px solid rgba(163,230,53,0.08)'
                        : '1px solid rgba(255,255,255,0.04)',
                    boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
                }}
            >
                <nav style={{
                    maxWidth: '1280px', margin: '0 auto',
                    padding: '0 24px',
                    height: '66px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    {/* ── Logo ── */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <motion.div whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 400 }}>
                            <Logo size={34} />
                        </motion.div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', lineHeight: 1 }}>
                            <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>
                                ASHAR<span style={{ color: '#a3e635' }}>-GO</span>
                            </span>
                            <span style={{ fontSize: '9px', letterSpacing: '3px', color: '#444', textTransform: 'uppercase', fontWeight: 500 }}>
                                crowdfunding
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop Nav links ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
                        {navLinks.map(({ href, label }) => {
                            const active = isActive(href);
                            return (
                                <Link key={href} href={href} style={{
                                    padding: '8px 14px', borderRadius: '10px',
                                    fontSize: '13px', fontWeight: 600,
                                    textDecoration: 'none', transition: 'all 0.2s ease',
                                    color: active ? '#a3e635' : '#888',
                                    background: active ? 'rgba(163,230,53,0.08)' : 'transparent',
                                    border: `1px solid ${active ? 'rgba(163,230,53,0.2)' : 'transparent'}`,
                                }}
                                    onMouseEnter={e => {
                                        if (!active) {
                                            (e.currentTarget as HTMLAnchorElement).style.color = '#ddd';
                                            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!active) {
                                            (e.currentTarget as HTMLAnchorElement).style.color = '#888';
                                            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                                        }
                                    }}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* ── Right side ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="desktop-nav">
                        {/* Admin */}
                        {user?.role === 'ADMIN' && (
                            <Link href="/admin" style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '8px 12px', borderRadius: '10px',
                                fontSize: '12px', fontWeight: 700, textDecoration: 'none',
                                color: '#a3e635', background: 'rgba(163,230,53,0.06)',
                                border: '1px solid rgba(163,230,53,0.15)',
                            }}>
                                <Shield style={{ width: '13px', height: '13px' }} />
                                Админ
                            </Link>
                        )}

                        {/* Language dropdown */}
                        <div ref={langRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 12px', borderRadius: '10px',
                                    background: langOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                                    border: '1px solid transparent',
                                    color: '#888', fontSize: '12px', fontWeight: 700,
                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                }}
                            >
                                <Globe style={{ width: '13px', height: '13px' }} />
                                <span>{localeFlags[locale]} {localeLabels[locale]}</span>
                                <ChevronDown style={{
                                    width: '12px', height: '12px',
                                    transform: langOpen ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.2s',
                                }} />
                            </button>

                            <AnimatePresence>
                                {langOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                            minWidth: '160px', borderRadius: '14px',
                                            background: '#111', border: '1px solid #222',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {(Object.keys(localeFullNames) as Locale[]).map((loc) => (
                                            <button key={loc} onClick={() => { setLocale(loc); setLangOpen(false); }} style={{
                                                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                                padding: '11px 16px', background: locale === loc ? 'rgba(163,230,53,0.08)' : 'transparent',
                                                border: 'none', borderLeft: `2px solid ${locale === loc ? '#a3e635' : 'transparent'}`,
                                                color: locale === loc ? '#a3e635' : '#888',
                                                fontSize: '13px', fontWeight: locale === loc ? 700 : 500,
                                                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                                            }}>
                                                <span style={{ fontSize: '16px' }}>{localeFlags[loc]}</span>
                                                {localeFullNames[loc]}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Divider */}
                        <div style={{ width: '1px', height: '20px', background: '#222' }} />

                        {!isAuthenticated ? (
                            <>
                                <Link href="/auth/login" style={{
                                    padding: '8px 14px', borderRadius: '10px',
                                    fontSize: '13px', fontWeight: 600, textDecoration: 'none',
                                    color: '#888', transition: 'color 0.2s ease',
                                }}
                                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#ddd'}
                                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#888'}
                                >
                                    {t.nav.login}
                                </Link>
                                <Link href="/create" style={{
                                    display: 'flex', alignItems: 'center', gap: '7px',
                                    padding: '9px 18px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                                    color: '#0a0a0a', fontSize: '13px', fontWeight: 800,
                                    textDecoration: 'none', transition: 'all 0.2s ease',
                                    position: 'relative', overflow: 'hidden',
                                    boxShadow: '0 4px 16px rgba(163,230,53,0.25)',
                                }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
                                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(163,230,53,0.4)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
                                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(163,230,53,0.25)';
                                    }}
                                >
                                    <Rocket style={{ width: '13px', height: '13px' }} />
                                    {t.nav.create}
                                </Link>
                            </>
                        ) : (
                            <div ref={userRef} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '5px 10px 5px 5px', borderRadius: '12px',
                                        background: userOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                                        border: `1px solid ${userOpen ? '#2a2a2a' : 'transparent'}`,
                                        cursor: 'pointer', transition: 'all 0.2s ease',
                                    }}
                                >
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden', flexShrink: 0,
                                    }}>
                                        {user?.avatarUrl
                                            ? <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <span style={{ fontSize: '13px', fontWeight: 800, color: '#0a0a0a' }}>{user?.name?.charAt(0)}</span>
                                        }
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#ddd', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {user?.name}
                                    </span>
                                    <ChevronDown style={{ width: '12px', height: '12px', color: '#666', transform: userOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </button>

                                <AnimatePresence>
                                    {userOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            style={{
                                                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                                minWidth: '180px', borderRadius: '14px',
                                                background: '#111', border: '1px solid #222',
                                                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a1a' }}>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{user?.name}</div>
                                                <div style={{ fontSize: '11px', color: '#555', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                                            </div>
                                            {[
                                                { href: '/dashboard', icon: LayoutGrid, label: t.nav.dashboard },
                                                { href: '/dashboard?tab=settings', icon: Settings, label: t.dashboard.settings },
                                            ].map(({ href, icon: Icon, label }) => (
                                                <Link key={href} href={href} onClick={() => setUserOpen(false)} style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                    padding: '11px 16px', textDecoration: 'none',
                                                    color: '#888', fontSize: '13px', transition: 'all 0.15s',
                                                }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#888'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                                                >
                                                    <Icon style={{ width: '14px', height: '14px' }} />
                                                    {label}
                                                </Link>
                                            ))}
                                            <button onClick={() => { logout(); setUserOpen(false); }} style={{
                                                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                                padding: '11px 16px', background: 'transparent',
                                                border: 'none', borderTop: '1px solid #1a1a1a',
                                                color: '#ef4444', fontSize: '13px', cursor: 'pointer',
                                                transition: 'all 0.15s', textAlign: 'left',
                                            }}
                                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)'}
                                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
                                            >
                                                <LogOut style={{ width: '14px', height: '14px' }} />
                                                {t.nav.logout}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* ── Mobile burger ── */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="mobile-burger"
                        style={{
                            display: 'none',
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: mobileOpen ? 'rgba(163,230,53,0.08)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${mobileOpen ? 'rgba(163,230,53,0.2)' : '#222'}`,
                            color: mobileOpen ? '#a3e635' : '#888',
                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {mobileOpen ? <X style={{ width: '18px', height: '18px' }} /> : <Menu style={{ width: '18px', height: '18px' }} />}
                    </button>
                </nav>
            </motion.header>

            <style>{`
                @media (max-width: 860px) {
                    .desktop-nav { display: none !important; }
                    .mobile-burger { display: flex !important; }
                }
            `}</style>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 90,
                            background: 'rgba(10,10,10,0.97)',
                            backdropFilter: 'blur(20px)',
                            display: 'flex', flexDirection: 'column',
                            paddingTop: '80px',
                        }}
                        onClick={() => setMobileOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.05 }}
                            style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                            onClick={e => e.stopPropagation()}
                        >
                            {navLinks.map(({ href, label, icon: Icon }, i) => (
                                <motion.div key={href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 + i * 0.05 }}>
                                    <Link href={href} onClick={() => setMobileOpen(false)} style={{
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                        padding: '16px 20px', borderRadius: '16px',
                                        background: isActive(href) ? 'rgba(163,230,53,0.08)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${isActive(href) ? 'rgba(163,230,53,0.2)' : '#1a1a1a'}`,
                                        textDecoration: 'none', color: isActive(href) ? '#a3e635' : '#ccc',
                                        fontSize: '16px', fontWeight: 600,
                                    }}>
                                        <Icon style={{ width: '18px', height: '18px' }} />
                                        {label}
                                    </Link>
                                </motion.div>
                            ))}

                            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                                {(Object.keys(localeLabels) as Locale[]).map(loc => (
                                    <button key={loc} onClick={() => setLocale(loc)} style={{
                                        flex: 1, padding: '12px', borderRadius: '12px',
                                        background: locale === loc ? 'rgba(163,230,53,0.1)' : '#111',
                                        border: `1px solid ${locale === loc ? 'rgba(163,230,53,0.3)' : '#222'}`,
                                        color: locale === loc ? '#a3e635' : '#777',
                                        fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                                    }}>
                                        {localeFlags[loc]} {localeLabels[loc]}
                                    </button>
                                ))}
                            </div>

                            {!isAuthenticated ? (
                                <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
                                    <Link href="/auth/login" onClick={() => setMobileOpen(false)} style={{
                                        flex: 1, textAlign: 'center', padding: '14px', borderRadius: '14px',
                                        background: 'transparent', border: '1px solid #222',
                                        color: '#888', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                                    }}>{t.nav.login}</Link>
                                    <Link href="/create" onClick={() => setMobileOpen(false)} style={{
                                        flex: 1, textAlign: 'center', padding: '14px', borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                                        color: '#0a0a0a', fontSize: '14px', fontWeight: 800, textDecoration: 'none',
                                    }}>{t.nav.create}</Link>
                                </div>
                            ) : (
                                <div style={{ marginTop: '8px' }}>
                                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '16px 20px', borderRadius: '16px',
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid #1a1a1a',
                                        textDecoration: 'none', color: '#ccc', marginBottom: '8px',
                                    }}>
                                        <User style={{ width: '18px', height: '18px' }} /> {t.nav.dashboard}
                                    </Link>
                                    <button onClick={() => { logout(); setMobileOpen(false); }} style={{
                                        width: '100%', padding: '14px', borderRadius: '14px',
                                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                        color: '#ef4444', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    }}>
                                        <LogOut style={{ width: '16px', height: '16px' }} /> {t.nav.logout}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
