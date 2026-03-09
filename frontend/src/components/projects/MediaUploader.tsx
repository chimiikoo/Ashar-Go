'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, X, ImageIcon,
    CheckCircle2, AlertCircle,
    Plus, Eye, Layout
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';

interface MediaUploaderProps {
    token: string | null;
    onCoverChange: (url: string | null) => void;
    onGalleryChange: (urls: string[]) => void;
    accentColor?: string;
}

interface UploadedPhoto {
    url: string;
    preview: string;
    name: string;
    size: number;
}

export default function MediaUploader({
    token,
    onCoverChange,
    onGalleryChange,
    accentColor = '#a3e635'
}: MediaUploaderProps) {
    const [cover, setCover] = useState<UploadedPhoto | null>(null);
    const [gallery, setGallery] = useState<UploadedPhoto[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const coverRef = useRef<HTMLInputElement>(null);
    const galleryRef = useRef<HTMLInputElement>(null);

    const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const uploadImage = async (file: File, isCover: boolean) => {
        setError('');
        if (!file.type.startsWith('image/')) {
            setError('Пожалуйста, выберите изображение');
            return;
        }

        try {
            setUploading(true);
            const preview = URL.createObjectURL(file);
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(getApiUrl('/api/upload/image'), {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            const newPhoto = { url: data.url, preview, name: file.name, size: file.size };

            if (isCover) {
                setCover(newPhoto);
                onCoverChange(data.url);
            } else {
                const updated = [...gallery, newPhoto];
                setGallery(updated);
                onGalleryChange(updated.map(p => p.url));
            }
        } catch (err: any) {
            setError(`Ошибка загрузки: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const uploadMultiple = async (files: File[]) => {
        const remaining = 5 - gallery.length;
        if (remaining <= 0) { setError('Уже загружено максимум 5 дополнительных фотографий'); return; }

        const toUpload = files.slice(0, remaining);
        for (const file of toUpload) {
            await uploadImage(file, false);
        }
    };

    const removeCover = () => {
        setCover(null);
        onCoverChange(null);
    };

    const removeGalleryItem = (idx: number) => {
        const updated = gallery.filter((_, i) => i !== idx);
        setGallery(updated);
        onGalleryChange(updated.map(p => p.url));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* ── COVER IMAGE ── */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '10px',
                        background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Layout style={{ width: '16px', height: '16px', color: accentColor }} />
                    </div>
                    <div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Обложка проекта *</span>
                        <span style={{ fontSize: '11px', color: '#555', marginLeft: '8px' }}>Основное фото карточки</span>
                    </div>
                </div>

                {!cover ? (
                    <motion.div
                        whileHover={{ borderColor: accentColor, background: `${accentColor}05` }}
                        onClick={() => !uploading && coverRef.current?.click()}
                        style={{
                            height: '180px', borderRadius: '20px', border: '2px dashed #222',
                            background: '#0d0d0d', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            transition: 'all 0.2s ease', gap: '8px'
                        }}
                    >
                        <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], true)} />

                        <div style={{
                            width: '48px', height: '48px', borderRadius: '14px',
                            background: `${accentColor}10`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Upload style={{ width: '20px', height: '20px', color: accentColor }} />
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#666' }}>Нажмите для загрузки обложки</p>
                    </motion.div>
                ) : (
                    <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '180px', border: '1px solid #222' }}>
                        <img src={cover.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '16px'
                        }}>
                            <span style={{ fontSize: '11px', color: '#fff', opacity: 0.8 }}>{cover.name} ({formatSize(cover.size)})</span>
                            <button onClick={removeCover} style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'rgba(239,68,68,0.9)', border: 'none',
                                color: '#fff', cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <X style={{ width: '16px', height: '16px' }} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── GALLERY ── */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '10px',
                        background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <ImageIcon style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
                    </div>
                    <div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Дополнительные фото</span>
                        <span style={{ fontSize: '11px', color: '#555', marginLeft: '8px' }}>До 5 штук</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
                    {gallery.map((photo, idx) => (
                        <div key={photo.url} style={{
                            aspectRatio: '1', borderRadius: '16px', overflow: 'hidden',
                            position: 'relative', border: '1px solid #222'
                        }}>
                            <img src={photo.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button onClick={() => removeGalleryItem(idx)} style={{
                                position: 'absolute', top: '5px', right: '5px',
                                width: '22px', height: '22px', borderRadius: '50%',
                                background: 'rgba(239,68,68,0.8)', border: 'none',
                                color: '#fff', cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <X style={{ width: '12px', height: '12px' }} />
                            </button>
                        </div>
                    ))}

                    {gallery.length < 5 && (
                        <motion.div
                            whileHover={{ scale: 1.02, borderColor: '#444' }}
                            onClick={() => !uploading && galleryRef.current?.click()}
                            style={{
                                aspectRatio: '1', borderRadius: '16px', border: '2px dashed #222',
                                background: '#0d0d0d', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '4px'
                            }}
                        >
                            <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                                onChange={e => e.target.files && uploadMultiple(Array.from(e.target.files))} />
                            <Plus style={{ width: '20px', height: '20px', color: '#444' }} />
                            <span style={{ fontSize: '10px', color: '#333', fontWeight: 700 }}>{5 - gallery.length} фото</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                    padding: '12px 16px', borderRadius: '14px',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#ef4444', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center'
                }}>
                    <AlertCircle style={{ width: '16px', height: '16px' }} />
                    {error}
                </motion.div>
            )}
        </div>
    );
}
