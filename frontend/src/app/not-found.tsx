'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// Kyrgyz ornament SVG pattern
function OrnamentPattern({ opacity = 0.15 }: { opacity?: number }) {
    return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity }}>
            <g stroke="#a3e635" strokeWidth="1.2">
                <polygon points="60,20 90,60 60,100 30,60" fill="none" />
                <polygon points="60,35 78,60 60,85 42,60" fill="none" />
                <path d="M20,20 L35,20 L35,35" fill="none" strokeLinecap="round" />
                <path d="M100,20 L85,20 L85,35" fill="none" strokeLinecap="round" />
                <path d="M20,100 L35,100 L35,85" fill="none" strokeLinecap="round" />
                <path d="M100,100 L85,100 L85,85" fill="none" strokeLinecap="round" />
                <line x1="60" y1="20" x2="60" y2="10" />
                <line x1="60" y1="100" x2="60" y2="110" />
                <line x1="20" y1="60" x2="10" y2="60" />
                <line x1="100" y1="60" x2="110" y2="60" />
                <polygon points="60,5 64,10 60,15 56,10" fill="#a3e635" fillOpacity="0.4" />
                <polygon points="60,105 64,110 60,115 56,110" fill="#a3e635" fillOpacity="0.4" />
                <polygon points="5,60 10,56 15,60 10,64" fill="#a3e635" fillOpacity="0.4" />
                <polygon points="105,60 110,56 115,60 110,64" fill="#a3e635" fillOpacity="0.4" />
            </g>
        </svg>
    );
}

// Terminal log lines shown on monitor screen
const LOG_LINES = [
    '> loading page.tsx...',
    '> ERROR: module not found',
    '> stack trace: 0x00404',
    '> retrying connection...',
    '> ping: request timeout',
    '> status: 404 NOT FOUND',
];

function useTypingEffect(lines: string[], speed = 40) {
    const [displayed, setDisplayed] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState(0);
    const [currentChar, setCurrentChar] = useState(0);

    useEffect(() => {
        if (currentLine >= lines.length) return;
        if (currentChar < lines[currentLine].length) {
            const t = setTimeout(() => {
                setDisplayed(prev => {
                    const next = [...prev];
                    next[currentLine] = (next[currentLine] || '') + lines[currentLine][currentChar];
                    return next;
                });
                setCurrentChar(c => c + 1);
            }, speed);
            return () => clearTimeout(t);
        } else {
            const t = setTimeout(() => {
                setCurrentLine(l => l + 1);
                setCurrentChar(0);
            }, 300);
            return () => clearTimeout(t);
        }
    }, [currentLine, currentChar, lines, speed]);

    return displayed;
}

// Matrix rain canvas
function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01アシャル';
        const fontSize = 13;
        const cols = Math.floor(canvas.width / fontSize);
        const drops: number[] = Array(cols).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(10,10,10,0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(163,230,53,0.4)';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillStyle = `rgba(163,230,53,${Math.random() * 0.3 + 0.05})`;
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none' }} />;
}

export default function NotFound() {
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [clicked, setClicked] = useState(false);
    const [glitch, setGlitch] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const terminalLines = useTypingEffect(LOG_LINES, 35);

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            setMouseX((e.clientX / window.innerWidth - 0.5) * 20);
            setMouseY((e.clientY / window.innerHeight - 0.5) * 20);
        };
        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, []);

    // Random glitch trigger
    useEffect(() => {
        const triggerGlitch = () => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 300);
        };
        const interval = setInterval(triggerGlitch, 4000 + Math.random() * 3000);
        return () => clearInterval(interval);
    }, []);

    const particles = Array.from({ length: 10 }, (_, i) => ({
        delay: i * 0.5,
        x: (i * 10) % 95,
        size: 3 + (i % 3) * 2,
    }));

    return (
        <>
            <style>{`
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(1); opacity: 0.5; }
                    100% { transform: translateY(-100vh) scale(0.1); opacity: 0; }
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spinReverse {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes orbFloat {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(30px, -20px); }
                    66% { transform: translate(-20px, 10px); }
                }
                @keyframes glitchShift {
                    0% { clip-path: inset(0 0 90% 0); transform: translate(-4px, 0); }
                    20% { clip-path: inset(30% 0 50% 0); transform: translate(4px, 0); }
                    40% { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 0); }
                    60% { clip-path: inset(10% 0 70% 0); transform: translate(3px, 0); }
                    80% { clip-path: inset(80% 0 5% 0); transform: translate(-3px, 0); }
                    100% { clip-path: inset(0 0 90% 0); transform: translate(0, 0); }
                }
                @keyframes monitorBob {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes scanline {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
                @keyframes clickPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.04); }
                    100% { transform: scale(1); }
                }
                @keyframes errorFlash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                .btn-home:hover {
                    background: #c8f56a !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 12px 40px rgba(163,230,53,0.4) !important;
                }
                .btn-back:hover {
                    border-color: #a3e635 !important;
                    color: #a3e635 !important;
                    transform: translateY(-2px) !important;
                }
                /* Hide header and footer on 404 */
                header, footer, nav { display: none !important; }
                main { padding-top: 0 !important; }
            `}</style>

            <div
                ref={containerRef}
                style={{
                    minHeight: '100vh',
                    background: '#0a0a0a',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Matrix rain background */}
                <MatrixRain />

                {/* Subtle grid on top of matrix */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(163,230,53,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(163,230,53,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    pointerEvents: 'none',
                }} />

                {/* Glowing orbs */}
                <div style={{
                    position: 'absolute', top: '15%', left: '8%',
                    width: '320px', height: '320px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(163,230,53,0.07) 0%, transparent 70%)',
                    animation: 'orbFloat 8s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '10%', right: '8%',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(163,230,53,0.05) 0%, transparent 70%)',
                    animation: 'orbFloat 12s ease-in-out infinite reverse',
                    pointerEvents: 'none',
                }} />

                {/* Floating particles */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {particles.map((p, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${p.x}%`,
                            bottom: '-20px',
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            borderRadius: '50%',
                            background: 'rgba(163, 230, 53, 0.35)',
                            animation: `floatUp ${3.5 + p.delay}s ease-in infinite`,
                            animationDelay: `${p.delay}s`,
                        }} />
                    ))}
                </div>

                {/* Corner ornaments */}
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <OrnamentPattern opacity={0.25} />
                </div>
                <div style={{ position: 'absolute', top: '16px', right: '16px', transform: 'scaleX(-1)' }}>
                    <OrnamentPattern opacity={0.25} />
                </div>
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', transform: 'scaleY(-1)' }}>
                    <OrnamentPattern opacity={0.15} />
                </div>
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', transform: 'scale(-1)' }}>
                    <OrnamentPattern opacity={0.15} />
                </div>

                {/* Main content */}
                <div style={{
                    textAlign: 'center',
                    zIndex: 10,
                    padding: '0 24px',
                    transform: `translate(${mouseX * 0.3}px, ${mouseY * 0.3}px)`,
                    transition: 'transform 0.1s ease-out',
                }}>
                    {/* Monitor with rings */}
                    <div
                        style={{
                            position: 'relative',
                            display: 'inline-block',
                            marginBottom: '8px',
                            animation: clicked ? 'clickPulse 0.4s ease' : 'monitorBob 5s ease-in-out infinite',
                            cursor: 'pointer',
                        }}
                        onClick={() => setClicked(c => !c)}
                        title="Нажми меня 🙂"
                    >
                        {/* Spinning outer ring */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: '380px', height: '380px',
                            marginLeft: '-190px', marginTop: '-190px',
                            border: '1px solid rgba(163,230,53,0.12)',
                            borderRadius: '50%',
                            borderTopColor: 'rgba(163,230,53,0.5)',
                            animation: 'spinSlow 14s linear infinite',
                        }}>
                            {[0, 60, 120, 180, 240, 300].map(deg => (
                                <div key={deg} style={{
                                    position: 'absolute',
                                    width: '7px', height: '7px',
                                    borderRadius: '50%',
                                    background: deg === 0 ? '#a3e635' : 'rgba(163,230,53,0.5)',
                                    top: '50%', left: '50%',
                                    transformOrigin: '0 0',
                                    transform: `rotate(${deg}deg) translateX(187px) translateY(-3.5px)`,
                                    boxShadow: deg === 0 ? '0 0 8px #a3e635' : 'none',
                                }} />
                            ))}
                        </div>

                        {/* Inner dashed ring */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: '300px', height: '300px',
                            marginLeft: '-150px', marginTop: '-150px',
                            border: '1px dashed rgba(163,230,53,0.07)',
                            borderRadius: '50%',
                            animation: 'spinReverse 9s linear infinite',
                        }} />

                        {/* Mac iMac SVG */}
                        <svg
                            width="340"
                            height="300"
                            viewBox="0 0 340 300"
                            fill="none"
                            style={{
                                transform: `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)`,
                                transition: 'transform 0.15s ease-out',
                                position: 'relative',
                                zIndex: 2,
                                filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.8)) drop-shadow(0 0 40px rgba(163,230,53,0.15))',
                            }}
                        >
                            <defs>
                                <linearGradient id="screenBg" x1="0" y1="0" x2="0.3" y2="1">
                                    <stop offset="0%" stopColor="#050508" />
                                    <stop offset="100%" stopColor="#020204" />
                                </linearGradient>
                                <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4a4a4c" />
                                    <stop offset="15%" stopColor="#3a3a3c" />
                                    <stop offset="60%" stopColor="#2c2c2e" />
                                    <stop offset="100%" stopColor="#1c1c1e" />
                                </linearGradient>
                                <linearGradient id="chinGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#323234" />
                                    <stop offset="100%" stopColor="#1c1c1e" />
                                </linearGradient>
                                <linearGradient id="standGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#111" />
                                    <stop offset="30%" stopColor="#333" />
                                    <stop offset="50%" stopColor="#3a3a3a" />
                                    <stop offset="70%" stopColor="#333" />
                                    <stop offset="100%" stopColor="#111" />
                                </linearGradient>
                                <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3a3a3a" />
                                    <stop offset="50%" stopColor="#262626" />
                                    <stop offset="100%" stopColor="#141414" />
                                </linearGradient>
                                <radialGradient id="screenGlow" cx="50%" cy="55%" r="55%">
                                    <stop offset="0%" stopColor={clicked ? "rgba(163,230,53,0.15)" : "rgba(163,230,53,0.06)"} />
                                    <stop offset="100%" stopColor="transparent" />
                                </radialGradient>
                                <linearGradient id="topEdge" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
                                    <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                                </linearGradient>
                                <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
                                    <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                                <linearGradient id="screenSheen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
                                    <stop offset="40%" stopColor="transparent" />
                                    <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
                                </linearGradient>
                                <radialGradient id="bezelShadow" cx="50%" cy="0%" r="70%">
                                    <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
                                    <stop offset="100%" stopColor="transparent" />
                                </radialGradient>
                                <filter id="textGlow">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                                {/* Glitch red channel */}
                                <filter id="glitchRed">
                                    <feOffset dx="-3" dy="0" result="r" />
                                    <feFlood floodColor="red" floodOpacity="0.4" result="col" />
                                    <feComposite in="col" in2="r" operator="in" result="rg" />
                                    <feMerge><feMergeNode in="rg" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>

                            {/* Drop shadow */}
                            <ellipse cx="170" cy="232" rx="150" ry="8" fill="rgba(0,0,0,0.6)" />
                            {/* Body */}
                            <rect x="14" y="8" width="312" height="222" rx="18" fill="url(#bodyGrad)" />
                            <rect x="16" y="8" width="308" height="5" rx="4" fill="url(#topEdge)" />
                            <rect x="14" y="10" width="2.5" height="218" rx="1" fill="rgba(255,255,255,0.10)" />
                            <rect x="323.5" y="10" width="2.5" height="218" rx="1" fill="rgba(0,0,0,0.3)" />
                            <rect x="14" y="225" width="312" height="5" rx="3" fill="rgba(0,0,0,0.4)" />

                            {/* Bezel */}
                            <rect x="22" y="16" width="296" height="198" rx="12" fill="#0a0a0a" />
                            <rect x="22" y="16" width="296" height="40" rx="4" fill="url(#bezelShadow)" opacity="0.5" />
                            {/* Screen */}
                            <rect x="29" y="23" width="282" height="179" rx="6" fill="url(#screenBg)" />
                            <rect x="29" y="23" width="282" height="179" rx="6" fill="url(#screenGlow)" />
                            <rect x="29" y="23" width="282" height="179" rx="6" fill="url(#screenSheen)" />

                            {/* Menubar */}
                            <rect x="29" y="23" width="282" height="22" fill="rgba(20,20,25,0.97)" />
                            <rect x="29" y="44" width="282" height="1" fill="rgba(255,255,255,0.06)" />
                            {/* Traffic lights */}
                            <circle cx="45" cy="34" r="5" fill="#ff5f57" />
                            <circle cx="45" cy="34" r="2.5" fill="#e0443e" opacity="0.5" />
                            <circle cx="61" cy="34" r="5" fill="#ffbd2e" />
                            <circle cx="61" cy="34" r="2.5" fill="#d89e1a" opacity="0.5" />
                            <circle cx="77" cy="34" r="5" fill="#28c840" />
                            <circle cx="77" cy="34" r="2.5" fill="#1a9e2e" opacity="0.5" />

                            {/* 404 — glitch version when glitch active */}
                            {glitch ? (
                                <>
                                    <text x="167" y="90" textAnchor="middle" dominantBaseline="middle"
                                        fill="rgba(255,0,60,0.7)" fontSize="72" fontWeight="900"
                                        fontFamily="-apple-system, system-ui" letterSpacing="-4">404</text>
                                    <text x="173" y="90" textAnchor="middle" dominantBaseline="middle"
                                        fill="rgba(0,255,200,0.7)" fontSize="72" fontWeight="900"
                                        fontFamily="-apple-system, system-ui" letterSpacing="-4">404</text>
                                </>
                            ) : null}
                            {/* Shadow text */}
                            <text x="170" y="91" textAnchor="middle" dominantBaseline="middle"
                                fill="rgba(255,255,255,0.12)" fontSize="74" fontWeight="900"
                                fontFamily="-apple-system, BlinkMacSystemFont, system-ui"
                                letterSpacing="-4" dy="2">404</text>
                            {/* Main 404 */}
                            <text x="170" y="89" textAnchor="middle" dominantBaseline="middle"
                                fill={clicked ? "#a3e635" : "white"} fontSize="74" fontWeight="900"
                                fontFamily="-apple-system, BlinkMacSystemFont, system-ui"
                                letterSpacing="-4" filter="url(#textGlow)">404</text>

                            {/* Terminal lines */}
                            {terminalLines.map((line, i) => (
                                <text key={i} x="35" y={118 + i * 14}
                                    fill={i === terminalLines.length - 1 ? "#a3e635" : "rgba(163,230,53,0.5)"}
                                    fontSize="9.5"
                                    fontFamily="'SF Mono', Menlo, Monaco, monospace"
                                    fontWeight={i === terminalLines.length - 1 ? "600" : "400"}
                                >
                                    {line}{i === terminalLines.length - 1 ? '█' : ''}
                                </text>
                            ))}

                            {/* Scanline effect */}
                            <rect x="29" y="23" width="282" height="2" fill="rgba(163,230,53,0.04)"
                                style={{ animation: 'scanline 4s linear infinite' }} />

                            {/* Glass glare */}
                            <path d="M35 28 Q170 20 311 35 L311 120 Q200 90 35 130 Z" fill="url(#glare)" />
                            {/* Edge shadows */}
                            <rect x="29" y="23" width="3" height="179" fill="rgba(0,0,0,0.3)" />
                            <rect x="29" y="23" width="282" height="3" fill="rgba(0,0,0,0.2)" />

                            {/* Chin */}
                            <rect x="22" y="214" width="296" height="16" rx="0" fill="url(#chinGrad)" />
                            <rect x="14" y="228" width="312" height="2" rx="1" fill="rgba(0,0,0,0.5)" />

                            {/* Camera */}
                            <rect x="163" y="10" width="14" height="5" rx="2.5" fill="#111" stroke="#222" strokeWidth="0.5" />
                            <circle cx="170" cy="12.5" r="1.8" fill="#080808" />
                            <circle cx="170" cy="12.5" r="0.9" fill="#0d0d18" />
                            <circle cx="169.2" cy="11.8" r="0.4" fill="rgba(255,255,255,0.3)" />

                            {/* Stand neck */}
                            <path d="M145 230 L150 278 L190 278 L195 230 Z" fill="url(#standGrad)" />
                            <path d="M166 230 L167 278 L171 278 L170 230 Z" fill="rgba(255,255,255,0.08)" />
                            <path d="M145 230 L150 278 L154 278 L149 230 Z" fill="rgba(0,0,0,0.3)" />
                            <rect x="140" y="228" width="60" height="4" rx="2" fill="#111" />

                            {/* Base */}
                            <rect x="85" y="278" width="170" height="16" rx="8" fill="url(#baseGrad)" />
                            <rect x="85" y="278" width="170" height="4" rx="3" fill="rgba(255,255,255,0.08)" />
                            <ellipse cx="170" cy="295" rx="85" ry="5" fill="rgba(0,0,0,0.7)" />
                        </svg>

                        {/* Click hint */}
                        {!clicked && (
                            <div style={{
                                position: 'absolute',
                                bottom: '30px',
                                right: '-60px',
                                fontSize: '11px',
                                color: 'rgba(163,230,53,0.5)',
                                fontFamily: 'monospace',
                                animation: 'fadeInUp 1s ease 3s both',
                                whiteSpace: 'nowrap',
                            }}>
                                ← click me
                            </div>
                        )}
                        {clicked && (
                            <div style={{
                                position: 'absolute',
                                bottom: '30px',
                                right: '-80px',
                                fontSize: '11px',
                                color: '#a3e635',
                                fontFamily: 'monospace',
                                whiteSpace: 'nowrap',
                            }}>
                                ← nice try 😄
                            </div>
                        )}
                    </div>

                    {/* Ornament divider */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '12px', margin: '8px 0 22px',
                        animation: 'fadeInUp 0.8s ease 0.2s both',
                    }}>
                        <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(to right, transparent, #a3e635)' }} />
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <polygon points="12,2 16,12 12,22 8,12" fill="none" stroke="#a3e635" strokeWidth="1.5" />
                            <polygon points="12,6 15,12 12,18 9,12" fill="rgba(163,230,53,0.2)" stroke="#a3e635" strokeWidth="1" />
                        </svg>
                        <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(to left, transparent, #a3e635)' }} />
                    </div>

                    {/* Message */}
                    <div style={{ animation: 'fadeInUp 0.8s ease 0.3s both' }}>
                        <h1 style={{
                            fontSize: 'clamp(18px, 3.5vw, 24px)',
                            fontWeight: 700,
                            color: '#ffffff',
                            marginBottom: '10px',
                            letterSpacing: '-0.5px',
                        }}>
                            Бул бет табылган жок
                        </h1>
                        <p style={{
                            fontSize: '14px',
                            color: '#555',
                            maxWidth: '360px',
                            lineHeight: 1.6,
                            marginBottom: '28px',
                            fontFamily: 'monospace',
                        }}>
                            <span style={{ color: '#a3e635' }}>$</span> СТРАНИЦА ПОТЕРЯЛАСЬ В ПРОСТОРАХ КЫРГЫЗСТАНА
                        </p>
                    </div>

                    {/* Buttons */}
                    <div style={{
                        display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
                        animation: 'fadeInUp 0.8s ease 0.5s both',
                    }}>
                        <Link href="/" className="btn-home" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '13px 26px', borderRadius: '14px',
                            background: '#a3e635', color: '#0a0a0a',
                            fontWeight: 700, fontSize: '14px', textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 8px 24px rgba(163,230,53,0.25)',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            На главную
                        </Link>
                        <button onClick={() => window.history.back()} className="btn-back" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '13px 26px', borderRadius: '14px',
                            background: 'transparent', color: '#666',
                            fontWeight: 600, fontSize: '14px',
                            border: '1px solid #222', cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Назад
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
