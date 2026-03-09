import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { projects, likes, comments, users, createId } from '../db';

const router = Router();

function withAuthor(project: any) {
    const author = users.find(u => u.id === project.authorId);
    const projectLikes = likes.filter(l => l.projectId === project.id);
    const projectComments = comments.filter(c => c.projectId === project.id);
    return {
        ...project,
        author: author ? { id: author.id, name: author.name, avatarUrl: author.avatarUrl } : null,
        rewards: [],
        _count: { likes: projectLikes.length, pledges: 0, comments: projectComments.length },
    };
}

// GET /api/projects
router.get('/', async (req, res) => {
    try {
        const { category, status = 'ACTIVE', sort = 'popular', search, page = '1', limit = '12' } = req.query;

        let filtered = projects.filter(p => {
            if (status) {
                if (p.status !== status) return false;
            } else {
                if (p.status !== 'ACTIVE') return false; // По умолчанию только активные
            }
            if (category && p.category !== (category as string).toUpperCase()) return false;
            if (search) {
                const s = (search as string).toLowerCase();
                return p.title.toLowerCase().includes(s) || p.shortDescription.toLowerCase().includes(s);
            }
            return true;
        });

        if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        else if (sort === 'endingSoon') filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        else if (sort === 'mostFunded') filtered.sort((a, b) => b.currentAmount - a.currentAmount);
        else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

        res.json({
            projects: paginated.map(withAuthor),
            pagination: { total: filtered.length, page: pageNum, limit: limitNum, totalPages: Math.ceil(filtered.length / limitNum) },
        });
    } catch (error) {
        console.error('List projects error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/projects/popular
router.get('/popular', async (_req, res) => {
    try {
        const active = projects.filter(p => p.status === 'ACTIVE');
        const sorted = active.sort((a, b) => {
            const aLikes = likes.filter(l => l.projectId === a.id).length;
            const bLikes = likes.filter(l => l.projectId === b.id).length;
            return bLikes - aLikes;
        }).slice(0, 6);
        res.json(sorted.map(withAuthor));
    } catch (error) {
        console.error('Popular projects error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
    try {
        const project = projects.find(p => p.id === req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const projectComments = comments.filter(c => c.projectId === project.id).map(c => {
            const user = users.find(u => u.id === c.userId);
            return { ...c, user: user ? { id: user.id, name: user.name, avatarUrl: user.avatarUrl } : null };
        });
        res.json({ ...withAuthor(project), comments: projectComments, updates: [] });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/projects
router.post('/', authenticateToken, async (req: any, res) => {
    try {
        const schema = z.object({
            title: z.string().min(3).max(100),
            shortDescription: z.string().min(10).max(200),
            description: z.string().min(50),
            category: z.enum(['BUSINESS', 'TECHNOLOGY', 'EDUCATION', 'SOCIAL', 'CREATIVE', 'SPORT', 'HEALTH', 'ECOLOGY']),
            goalAmount: z.number().positive(),
            fundingType: z.enum(['ALL_OR_NOTHING', 'FLEXIBLE']),
            projectType: z.enum(['REWARD', 'DONATION']).optional(),
            deadline: z.string(),
            coverImage: z.string(), // Обязательная обложка
            videoUrl: z.string().url(), // Обязательное видео (YouTube)
            gallery: z.array(z.string()).max(5).optional(), // До 5 дополнительных фото
        });

        const data = schema.parse(req.body);
        const project = {
            id: createId(),
            ...data,
            projectType: req.body.projectType || 'REWARD',
            authorId: req.user.userId,
            currentAmount: 0,
            gallery: data.gallery || [],
            coverImage: data.coverImage,
            videoUrl: data.videoUrl,
            status: 'PENDING_REVIEW' as const, // Проект уходит на одобрение модератору
            createdAt: new Date().toISOString(),
        };
        projects.push(project);
        res.status(201).json(project);
    } catch (err: any) {
        res.status(400).json({ error: err.message || 'Ошибка создания проекта' });
    }
});

// POST /api/projects/:id/like
router.post('/:id/like', authenticateToken, async (req: any, res) => {
    try {
        const existingIndex = likes.findIndex(l => l.userId === req.user.userId && l.projectId === req.params.id);
        if (existingIndex !== -1) {
            likes.splice(existingIndex, 1);
            return res.json({ liked: false });
        }
        likes.push({ id: createId(), userId: req.user.userId, projectId: req.params.id });
        res.json({ liked: true });
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/projects/:id/comments
router.post('/:id/comments', authenticateToken, async (req: any, res) => {
    try {
        const schema = z.object({ content: z.string().min(1).max(1000) });
        const { content } = schema.parse(req.body);

        const user = users.find(u => u.id === req.user.userId);
        const comment = {
            id: createId(),
            userId: req.user.userId,
            projectId: req.params.id,
            content,
            createdAt: new Date().toISOString(),
        };
        comments.push(comment);
        res.status(201).json({ ...comment, user: user ? { id: user.id, name: user.name, avatarUrl: user.avatarUrl } : null });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Comment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ── PUT /api/projects/:id/approve — Одобрение (ADMIN) ─────────────────
router.put('/:id/approve', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Недостаточно прав' });
        }
        const project = projects.find(p => p.id === req.params.id);
        if (!project) return res.status(404).json({ error: 'Проект не найден' });

        project.status = 'ACTIVE';
        res.json({ message: 'Проект успешно одобрен', project });
    } catch (err: any) {
        res.status(500).json({ error: 'Ошибка при одобрении проекта' });
    }
});

// ── PUT /api/projects/:id/reject — Отклонение (ADMIN) ──────────────────
router.put('/:id/reject', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Недостаточно прав' });
        }
        const project = projects.find(p => p.id === req.params.id);
        if (!project) return res.status(404).json({ error: 'Проект не найден' });

        project.status = 'REJECTED';
        res.json({ message: 'Проект отклонен', project });
    } catch (err: any) {
        res.status(500).json({ error: 'Ошибка при отклонении проекта' });
    }
});

export default router;
