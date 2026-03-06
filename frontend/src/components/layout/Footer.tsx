'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Rocket, ArrowRight, Mail, MapPin } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useLocale } from '@/lib/locale-context';

// Kyrgyz decorative ornament
function OrnamentSVG({ size = 40, opacity = 0.12 }: { size?: number; opacity?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
            <g stroke="#a3e635" strokeWidth="1.2">
                <polygon points="40,6 68,40 40,74 12,40" fill="none" />
                <polygon points="40,18 56,40 40,62 24,40" fill="none" />
                <polygon points="40,30 48,40 40,50 32,40" fill="rgba(163,230,53,0.08)" />
                <line x1="40" y1="0" x2="40" y2="6" /><line x1="40" y1="74" x2="40" y2="80" />
                <line x1="0" y1="40" x2="12" y2="40" /><line x1="68" y1="40" x2="80" y2="40" />
                <circle cx="40" cy="6" r="2" fill="#a3e635" /><circle cx="40" cy="74" r="2" fill="#a3e635" />
                <circle cx="12" cy="40" r="2" fill="#a3e635" /><circle cx="68" cy="40" r="2" fill="#a3e635" />
            </g>
        </svg>
    );
}

export default function Footer() {
    const { t } = useLocale();

    const columns = [
        {
            title: t.footer.platform,
            links: [
                { href: '/projects', label: t.nav.explore },
                { href: '/create', label: t.nav.create },
                { href: '/#how-it-works', label: t.nav.howItWorks },
                { href: '/dashboard', label: t.nav.dashboard },
            ],
        },
        {
            title: t.footer.company,
            links: [
                { href: '#', label: t.footer.aboutUs },
                { href: '#', label: t.footer.careers },
                { href: '#', label: t.footer.press },
                { href: '#', label: t.footer.blog },
            ],
        },
        {
            title: t.footer.support,
            links: [
                { href: '#', label: t.footer.helpCenter },
                { href: '#', label: t.footer.contactUs },
                { href: '#', label: t.footer.terms },
                { href: '#', label: t.footer.privacy },
            ],
        },
    ];

    const socials = [
        {
            href: '#', label: 'Instagram',
            icon: (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
            ),
        },
        {
            href: '#', label: 'Telegram',
            icon: (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
            ),
        },
        {
            href: '#', label: 'GitHub',
            icon: (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
            ),
        },
    ];

    return (
        <footer style={{
            background: '#080808',
            borderTop: '1px solid rgba(163,230,53,0.08)',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(163,230,53,0.015) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(163,230,53,0.015) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
            }} />
            <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '600px', height: '200px',
                background: 'radial-gradient(ellipse, rgba(163,230,53,0.04) 0%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none',
            }} />

            {/* Ornaments */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}><OrnamentSVG /></div>
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', transform: 'scaleX(-1)' }}><OrnamentSVG /></div>
            <div style={{ position: 'absolute', top: '30px', left: '5%' }}><OrnamentSVG size={28} opacity={0.07} /></div>
            <div style={{ position: 'absolute', top: '30px', right: '5%' }}><OrnamentSVG size={28} opacity={0.07} /></div>

            {/* Newsletter band */}
            <div style={{
                position: 'relative',
                borderBottom: '1px solid rgba(163,230,53,0.06)',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            flexWrap: 'wrap', gap: '24px',
                        }}
                    >
                        <div>
                            <h3 style={{ fontSize: 'clamp(16px,3vw,22px)', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                                Будьте в курсе новых проектов 🚀
                            </h3>
                            <p style={{ fontSize: '13px', color: '#555' }}>Получайте уведомления о лучших проектах из Кыргызстана</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flex: '0 0 auto' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 16px', borderRadius: '12px',
                                background: '#111', border: '1px solid #222',
                                minWidth: '240px',
                            }}>
                                <Mail style={{ width: '15px', height: '15px', color: '#555', flexShrink: 0 }} />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    style={{
                                        background: 'none', border: 'none', outline: 'none',
                                        color: '#fff', fontSize: '13px', width: '100%',
                                    }}
                                />
                            </div>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '10px 18px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #a3e635, #7bc820)',
                                color: '#0a0a0a', fontSize: '13px', fontWeight: 700,
                                border: 'none', cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}>
                                Подписаться
                                <ArrowRight style={{ width: '14px', height: '14px' }} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main footer grid */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 0', position: 'relative' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(200px, 1.5fr) repeat(3, 1fr)',
                    gap: '48px',
                }}>
                    {/* Brand column */}
                    <div>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '18px' }}>
                            <Logo size={32} />
                            <div>
                                <div style={{ fontSize: '17px', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>
                                    ASHAR<span style={{ color: '#a3e635' }}>-GO</span>
                                </div>
                                <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#444', textTransform: 'uppercase' }}>crowdfunding</div>
                            </div>
                        </Link>

                        <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.75, marginBottom: '20px', maxWidth: '240px' }}>
                            {t.footer.tagline}. Возрождаем традицию «Ашар» в цифровом мире.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                            <MapPin style={{ width: '13px', height: '13px', color: '#a3e635' }} />
                            <span style={{ fontSize: '12px', color: '#555' }}>Бишкек, Кыргызстан</span>
                        </div>

                        {/* Socials */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {socials.map(({ href, label, icon }) => (
                                <a key={label} href={href} title={label} style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: '#111', border: '1px solid #1e1e1e',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#555', textDecoration: 'none', transition: 'all 0.2s ease',
                                }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.color = '#a3e635';
                                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(163,230,53,0.25)';
                                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(163,230,53,0.06)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.color = '#555';
                                        (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1e1e1e';
                                        (e.currentTarget as HTMLAnchorElement).style.background = '#111';
                                    }}
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h4 style={{
                                fontSize: '10px', fontWeight: 700, color: '#a3e635',
                                letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px',
                            }}>
                                {col.title}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {col.links.map(({ href, label }) => (
                                    <li key={label}>
                                        <Link href={href} style={{
                                            fontSize: '13px', color: '#555', textDecoration: 'none',
                                            transition: 'color 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ddd'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#555'; }}
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{
                    marginTop: '48px', paddingTop: '24px', paddingBottom: '32px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '12px',
                }}>
                    <p style={{ fontSize: '12px', color: '#444' }}>
                        © 2026 Ashar-go. {t.footer.rights}.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#444' }}>Made with</span>
                        <Heart style={{ width: '12px', height: '12px', color: '#a3e635', fill: '#a3e635' }} />
                        <span style={{ fontSize: '12px', color: '#444' }}>in Kyrgyzstan</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Rocket style={{ width: '12px', height: '12px', color: '#a3e635' }} />
                        <span style={{ fontSize: '12px', color: '#444' }}>v1.0.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
