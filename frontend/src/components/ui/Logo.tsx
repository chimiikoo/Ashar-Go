'use client';

import { HelpingHand } from 'lucide-react';

export default function Logo({ size = 36, color = '#a3e635' }: { size?: number, color?: string }) {
    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Background Ornament Decoration */}
            <svg
                width={size * 1.5}
                height={size * 1.5}
                viewBox="0 0 100 100"
                style={{ position: 'absolute', opacity: 0.2, zIndex: 0 }}
            >
                <path
                    d="M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                />
            </svg>

            <div style={{
                width: size,
                height: size,
                borderRadius: size / 4,
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                boxShadow: `0 0 20px ${color}40`
            }}>
                <HelpingHand style={{ width: size * 0.6, height: size * 0.6, color: '#000' }} />
            </div>
        </div>
    );
}
