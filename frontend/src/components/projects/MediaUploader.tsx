'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, X, Play, Film, Image as ImageIcon,
    CheckCircle2, AlertCircle, Clock, FileVideo,
    Plus, Eye,
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';

interface MediaUploaderProps {
    token: string | null;
    onVideoChange: (url: string | null) => void;
    onPhotosChange: (urls: string[]) => void;
    accentColor?: string;
}

interface UploadedPhoto {
    url: string;
    preview: string;
    name: string;
    size: number;
}

export default function MediaUploader({ token, onVideoChange, onPhotosChange, accentColor = '#a3e635' }: MediaUploaderProps) {
    const [video, setVideo] = useState<{ url: string; preview: string; name: string; duration?: number } | null>(null);
    const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
    const [videoUploading, setVideoUploading] = useState(false);
    const [photosUploading, setPhotosUploading] = useState(false);
    const [videoError, setVideoError] = useState('');
    const [photoError, setPhotoError] = useState('');
    const [videoProgress, setVideoProgress] = useState(0);
    const [isDraggingVideo, setIsDraggingVideo] = useState(false);
    const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
    const [previewVideo, setPreviewVideo] = useState(false);

    const videoRef = useRef<HTMLInputElement>(null);
    const photoRef = useRef<HTMLInputElement>(null);

    // Check video duration via DOM
    const checkVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
            video.onerror = () => reject(new Error('Не удалось прочитать видео'));
            video.src = URL.createObjectURL(file);
        });
    };

    const formatDuration = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // ── Upload Video ──────────────────────────────────────────────────
    const uploadVideo = async (file: File) => {
        setVideoError('');
        if (!file.type.startsWith('video/')) {
            setVideoError('Пожалуйста, выберите видео файл (mp4, webm, mov)');
            return;
        }
        if (file.size > 150 * 1024 * 1024) {
            setVideoError('Видео слишком большое. Максимум 150MB (≈3 минуты)');
            return;
        }
        try {
            const duration = await checkVideoDuration(file);
            if (duration > 180) {
                setVideoError(`Видео слишком длинное: ${formatDuration(duration)}. Максимум 3 минуты.`);
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            setVideoUploading(true);
            setVideoProgress(0);

            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) setVideoProgress(Math.round((e.loaded / e.total) * 100));
            });

            const result = await new Promise<{ url: string }>((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                    else reject(new Error(JSON.parse(xhr.responseText)?.error || 'Ошибка загрузки'));
                };
                xhr.onerror = () => reject(new Error('Сеть недоступна'));
                xhr.open('POST', getApiUrl('/api/upload/video'));
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                xhr.send(formData);
            });

            const uploaded = { url: result.url, preview: previewUrl, name: file.name, duration };
            setVideo(uploaded);
            onVideoChange(result.url);
        } catch (err: any) {
            setVideoError(err.message || 'Ошибка загрузки видео');
        } finally {
            setVideoUploading(false);
            setVideoProgress(0);
        }
    };

    // ── Upload Photos ────────────────────────────────────────────────
    const uploadPhotos = async (files: File[]) => {
        setPhotoError('');
        const remaining = 5 - photos.length;
        if (remaining <= 0) { setPhotoError('Уже загружено максимум 5 фотографий'); return; }

        const toUpload = files.slice(0, remaining);
        const invalid = toUpload.filter(f => !f.type.startsWith('image/'));
        if (invalid.length > 0) { setPhotoError('Некоторые файлы не являются изображениями'); return; }

        setPhotosUploading(true);
        const newPhotos: UploadedPhoto[] = [];

        for (const file of toUpload) {
            try {
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
                newPhotos.push({ url: data.url, preview, name: file.name, size: file.size });
            } catch (err: any) {
                setPhotoError(`Ошибка загрузки ${file.name}: ${err.message}`);
            }
        }

        const updated = [...photos, ...newPhotos];
        setPhotos(updated);
        onPhotosChange(updated.map(p => p.url));
        setPhotosUploading(false);
    };

    const removePhoto = useCallback((idx: number) => {
        const updated = photos.filter((_, i) => i !== idx);
        setPhotos(updated);
        onPhotosChange(updated.map(p => p.url));
    }, [photos, onPhotosChange]);

    const removeVideo = useCallback(() => {
        setVideo(null);
        onVideoChange(null);
        setVideoError('');
    }, [onVideoChange]);

    const onDropVideo = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setIsDraggingVideo(false);
        const file = e.dataTransfer.files[0];
        if (file) uploadVideo(file);
    }, [token]);

    const onDropPhoto = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setIsDraggingPhoto(false);
        uploadPhotos(Array.from(e.dataTransfer.files));
    }, [photos, token]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── VIDEO SECTION ─── */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Film style={{ width: '13px', height: '13px', color: accentColor }} />
                    </div>
                    <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Видео-презентация</span>
                        <span style={{ fontSize: '11px', color: '#555', marginLeft: '8px' }}>mp4, webm, mov · до 3 минут · до 150MB</span>
                    </div>
                    <div style={{
                        marginLeft: 'auto', padding: '3px 10px', borderRadius: '20px',
                        background: video ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${video ? 'rgba(34,197,94,0.3)' : '#222'}`,
                        fontSize: '10px', fontWeight: 700,
                        color: video ? '#22c55e' : '#555',
                    }}>
                        {video ? '✓ ЗАГРУЖЕНО' : 'ОПЦИОНАЛЬНО'}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!video ? (
                        <motion.div
                            key="video-drop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onDragOver={e => { e.preventDefault(); setIsDraggingVideo(true); }}
                            onDragLeave={() => setIsDraggingVideo(false)}
                            onDrop={onDropVideo}
                            onClick={() => videoRef.current?.click()}
                            style={{
                                borderRadius: '18px', border: `2px dashed ${isDraggingVideo ? accentColor : '#222'}`,
                                background: isDraggingVideo ? `${accentColor}06` : '#0d0d0d',
                                padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
                                transition: 'all 0.25s ease',
                            }}
                        >
                            <input ref={videoRef} type="file" accept="video/*" style={{ display: 'none' }}
                                onChange={e => e.target.files?.[0] && uploadVideo(e.target.files[0])} />

                            {videoUploading ? (
                                <div>
                                    <div style={{ fontSize: '28px', marginBottom: '12px' }}>
                                        {videoProgress < 100 ? '📤' : '⚙️'}
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
                                        {videoProgress < 100 ? `Загрузка... ${videoProgress}%` : 'Обработка...'}
                                    </p>
                                    <div style={{ height: '4px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden', maxWidth: '280px', margin: '0 auto' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${videoProgress}%` }}
                                            style={{ height: '100%', background: `linear-gradient(to right, ${accentColor}, ${accentColor}80)`, borderRadius: '2px' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '16px',
                                        background: `${accentColor}10`, border: `1px solid ${accentColor}20`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 14px',
                                    }}>
                                        <FileVideo style={{ width: '24px', height: '24px', color: accentColor }} />
                                    </div>
                                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#ddd', marginBottom: '6px' }}>
                                        {isDraggingVideo ? 'Отпустите для загрузки' : 'Перетащите видео или нажмите'}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#555' }}>
                                        Покажите ваш проект в деле — это повышает доверие бэкеров
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '14px' }}>
                                        {[
                                            { icon: Clock, text: 'до 3 минут' },
                                            { icon: Upload, text: 'до 150 MB' },
                                        ].map(({ icon: Icon, text }) => (
                                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Icon style={{ width: '12px', height: '12px', color: '#555' }} />
                                                <span style={{ fontSize: '11px', color: '#555' }}>{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="video-preview"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                borderRadius: '18px', overflow: 'hidden',
                                border: `1px solid ${accentColor}30`,
                                position: 'relative',
                            }}
                        >
                            {/* Video preview modal */}
                            <AnimatePresence>
                                {previewVideo && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        style={{
                                            position: 'fixed', inset: 0, zIndex: 200,
                                            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                        onClick={() => setPreviewVideo(false)}
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                                            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '20px', overflow: 'hidden' }}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <video src={video.preview} controls autoPlay style={{ maxWidth: '80vw', maxHeight: '80vh', display: 'block' }} />
                                        </motion.div>
                                        <button onClick={() => setPreviewVideo(false)} style={{
                                            position: 'absolute', top: '20px', right: '20px',
                                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '50%', width: '40px', height: '40px',
                                            color: '#fff', cursor: 'pointer', fontSize: '18px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>×</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div style={{ position: 'relative', background: '#111' }}>
                                <video src={video.preview} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block', opacity: 0.7 }} />
                                {/* Overlay */}
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.4)',
                                }}>
                                    <button onClick={() => setPreviewVideo(true)} style={{
                                        width: '56px', height: '56px', borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
                                        border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: `0 8px 24px ${accentColor}50`,
                                        transition: 'transform 0.2s ease',
                                    }}
                                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'}
                                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
                                    >
                                        <Play style={{ width: '22px', height: '22px', color: '#0a0a0a', marginLeft: '3px' }} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: '14px 16px', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <CheckCircle2 style={{ width: '16px', height: '16px', color: '#22c55e', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#ddd', marginBottom: '2px' }}>{video.name}</p>
                                        {video.duration && (
                                            <p style={{ fontSize: '11px', color: '#555' }}>
                                                Длительность: {formatDuration(video.duration)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => setPreviewVideo(true)} style={{
                                        display: 'flex', alignItems: 'center', gap: '5px',
                                        padding: '6px 12px', borderRadius: '8px',
                                        background: `${accentColor}10`, border: `1px solid ${accentColor}25`,
                                        color: accentColor, fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                                    }}>
                                        <Eye style={{ width: '12px', height: '12px' }} />
                                        Просмотр
                                    </button>
                                    <button onClick={removeVideo} style={{
                                        display: 'flex', alignItems: 'center', gap: '5px',
                                        padding: '6px 10px', borderRadius: '8px',
                                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                        color: '#ef4444', fontSize: '11px', cursor: 'pointer',
                                    }}>
                                        <X style={{ width: '12px', height: '12px' }} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {videoError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                        marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center',
                        padding: '10px 14px', borderRadius: '12px',
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                        color: '#ef4444', fontSize: '12px',
                    }}>
                        <AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                        {videoError}
                    </motion.div>
                )}
            </div>

            {/* ── PHOTOS SECTION ── */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <ImageIcon style={{ width: '13px', height: '13px', color: '#8b5cf6' }} />
                    </div>
                    <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Дополнительные фотографии</span>
                        <span style={{ fontSize: '11px', color: '#555', marginLeft: '8px' }}>jpg, png, webp · до 5 штук</span>
                    </div>
                    <div style={{
                        marginLeft: 'auto', padding: '3px 10px', borderRadius: '20px',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid #222',
                        fontSize: '10px', fontWeight: 700, color: '#555',
                    }}>
                        {photos.length}/5
                    </div>
                </div>

                {/* Photos grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                    {photos.map((photo, idx) => (
                        <motion.div
                            key={photo.url}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                aspectRatio: '1', borderRadius: '12px', overflow: 'hidden',
                                position: 'relative', border: '1px solid #222', cursor: 'default',
                            }}
                        >
                            <img src={photo.preview} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            <div style={{
                                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)',
                                transition: 'background 0.2s ease',
                                display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '6px',
                            }}
                                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.4)'}
                                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)'}
                            >
                                <button onClick={() => removePhoto(idx)} style={{
                                    width: '22px', height: '22px', borderRadius: '50%',
                                    background: 'rgba(239,68,68,0.8)', border: 'none',
                                    color: '#fff', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, transition: 'opacity 0.2s',
                                }}
                                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
                                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0'}
                                >
                                    <X style={{ width: '11px', height: '11px' }} />
                                </button>
                            </div>
                            <div style={{
                                position: 'absolute', bottom: '4px', left: '4px',
                                background: 'rgba(0,0,0,0.6)', borderRadius: '4px',
                                padding: '2px 5px', fontSize: '9px', color: '#ccc',
                            }}>
                                {formatSize(photo.size)}
                            </div>
                        </motion.div>
                    ))}

                    {/* Add photo button */}
                    {photos.length < 5 && (
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            onClick={() => !photosUploading && photoRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setIsDraggingPhoto(true); }}
                            onDragLeave={() => setIsDraggingPhoto(false)}
                            onDrop={onDropPhoto}
                            style={{
                                aspectRatio: '1', borderRadius: '12px',
                                border: `2px dashed ${isDraggingPhoto ? '#8b5cf6' : '#222'}`,
                                background: isDraggingPhoto ? 'rgba(139,92,246,0.06)' : '#0d0d0d',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s ease', gap: '4px',
                            }}
                        >
                            <input ref={photoRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                                onChange={e => e.target.files && uploadPhotos(Array.from(e.target.files))} />
                            {photosUploading ? (
                                <div style={{ fontSize: '20px', animation: 'spin 1s linear infinite' }}>⏳</div>
                            ) : (
                                <>
                                    <Plus style={{ width: '20px', height: '20px', color: '#555' }} />
                                    <span style={{ fontSize: '10px', color: '#444', fontWeight: 600 }}>
                                        {5 - photos.length} осталось
                                    </span>
                                </>
                            )}
                        </motion.div>
                    )}
                </div>

                {photoError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                        marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center',
                        padding: '10px 14px', borderRadius: '12px',
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                        color: '#ef4444', fontSize: '12px',
                    }}>
                        <AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                        {photoError}
                    </motion.div>
                )}

                {photos.length > 0 && (
                    <p style={{ fontSize: '11px', color: '#555', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle2 style={{ width: '12px', height: '12px', color: '#22c55e' }} />
                        {photos.length} из 5 фотографий загружено
                    </p>
                )}
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
