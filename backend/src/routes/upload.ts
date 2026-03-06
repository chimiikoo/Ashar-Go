import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const MAX_VIDEO_MB = parseInt(process.env.MAX_VIDEO_SIZE_MB || '150');
const MAX_IMAGE_MB = parseInt(process.env.MAX_IMAGE_SIZE_MB || '10');

// ── Disk storage (local fallback / Render ephemeral) ─────────────────
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${uuidv4()}${ext}`);
    },
});

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];

// ── IMAGE upload (max 10MB, only images) ─────────────────────────────
const imageUpload = multer({
    storage,
    limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (IMAGE_TYPES.includes(file.mimetype)) cb(null, true);
        else cb(new Error(`Только изображения: ${IMAGE_TYPES.join(', ')}`));
    },
});

// ── VIDEO upload (max 150MB, video only) ─────────────────────────────
const videoUpload = multer({
    storage,
    limits: { fileSize: MAX_VIDEO_MB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (VIDEO_TYPES.includes(file.mimetype)) cb(null, true);
        else cb(new Error(`Только видео: mp4, webm, ogg, mov, avi`));
    },
});

// Helper: build public URL
function buildUrl(req: any, filename: string) {
    const base = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    return `${base}/uploads/${filename}`;
}

// ── POST /api/upload/image — одиночное изображение ───────────────────
router.post('/image', authenticateToken, imageUpload.single('file'), (req: any, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Файл не получен' });
        const url = buildUrl(req, req.file.filename);
        res.json({ url, filename: req.file.filename, type: 'image' });
    } catch (err) {
        console.error('Image upload error:', err);
        res.status(500).json({ error: 'Ошибка загрузки изображения' });
    }
});

// ── POST /api/upload/images — до 5 фотографий ────────────────────────
router.post('/images', authenticateToken, imageUpload.array('files', 5), (req: any, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Файлы не получены' });
        }
        const urls = (req.files as Express.Multer.File[]).map(f => ({
            url: buildUrl(req, f.filename),
            filename: f.filename,
            originalName: f.originalname,
            size: f.size,
        }));
        res.json({ urls, count: urls.length });
    } catch (err) {
        console.error('Images upload error:', err);
        res.status(500).json({ error: 'Ошибка загрузки фотографий' });
    }
});

// ── POST /api/upload/video — видео до 3 мин (≈150MB) ─────────────────
router.post('/video', authenticateToken, videoUpload.single('file'), (req: any, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Видео не получено' });
        const url = buildUrl(req, req.file.filename);
        res.json({
            url,
            filename: req.file.filename,
            size: req.file.size,
            type: 'video',
            originalName: req.file.originalname,
        });
    } catch (err) {
        console.error('Video upload error:', err);
        res.status(500).json({ error: 'Ошибка загрузки видео' });
    }
});

// ── POST /api/upload (legacy — single image) ─────────────────────────
router.post('/', authenticateToken, imageUpload.single('file'), (req: any, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Файл не получен' });
        const url = buildUrl(req, req.file.filename);
        res.json({ url, filename: req.file.filename });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Ошибка загрузки' });
    }
});

// ── Error handler ─────────────────────────────────────────────────────
router.use((err: any, _req: any, res: any, _next: any) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'Файл слишком большой. Видео до 150MB, фото до 10MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: 'Максимум 5 фотографий за раз.' });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }
});

export default router;
