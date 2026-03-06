import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { users } from '../db';

const router = Router();

// GET /api/users/me
router.get('/me', authenticateToken, async (req: any, res) => {
    try {
        const user = users.find(u => u.id === req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role, locale: user.locale, createdAt: user.createdAt });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/users/me
router.put('/me', authenticateToken, async (req: any, res) => {
    try {
        const { name, locale, avatarUrl } = req.body;
        const user = users.find(u => u.id === req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (name) user.name = name;
        if (locale) user.locale = locale;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
        res.json({ id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role, locale: user.locale });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const user = users.find(u => u.id === req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ id: user.id, name: user.name, avatarUrl: user.avatarUrl, createdAt: user.createdAt, projects: [] });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
