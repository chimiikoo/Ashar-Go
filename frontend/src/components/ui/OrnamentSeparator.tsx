'use client';

export default function OrnamentSeparator() {
    return (
        <div style={{
            width: '100%',
            maxWidth: '1000px',
            margin: '40px auto',
            position: 'relative',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #2a2a2a 20%, #2a2a2a 80%, transparent)'
        }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#0a0a0a',
                padding: '0 16px',
                display: 'flex',
                gap: '8px'
            }}>
                <svg width="24" height="24" viewBox="0 0 40 40" opacity="0.4">
                    <path d="M20 0l4 4h-8l4-4zM0 20l4 4v-8l-4 4zM40 20l-4-4v8l4-4zM20 40l-4-4h8l-4 4z" fill="#a3e635" />
                </svg>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#a3e635', alignSelf: 'center', opacity: 0.6 }} />
                <svg width="24" height="24" viewBox="0 0 40 40" opacity="0.4">
                    <path d="M20 0l4 4h-8l4-4zM0 20l4 4v-8l-4 4zM40 20l-4-4v8l4-4zM20 40l-4-4h8l-4 4z" fill="#a3e635" />
                </svg>
            </div>
        </div>
    );
}
