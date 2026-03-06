import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { users, projects, likes, comments, createId } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ashar-go-secret-key-change-in-production';

const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);

        const existing = users.find(u => u.email === email);
        if (existing) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = {
            id: createId(),
            name,
            email,
            passwordHash,
            role: 'USER' as const,
            locale: 'ru',
            avatarUrl: null,
            createdAt: new Date().toISOString(),
        };
        users.push(user);

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, locale: user.locale, createdAt: user.createdAt },
            token,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, locale: user.locale, avatarUrl: user.avatarUrl },
            token,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

        const user = users.find(u => u.id === decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const newToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, locale: user.locale, avatarUrl: user.avatarUrl },
            token: newToken,
        });
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

export default router;
