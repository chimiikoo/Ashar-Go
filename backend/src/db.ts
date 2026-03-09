// In-memory database — заменяет PostgreSQL/Prisma
// Данные хранятся в памяти и сбрасываются при перезапуске сервера

import { randomUUID } from 'crypto';

export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'USER' | 'ADMIN';
    locale: string;
    avatarUrl: string | null;
    createdAt: string;
}

export interface Project {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    category: string;
    goalAmount: number;
    currentAmount: number;
    fundingType: string;
    projectType: string;
    deadline: string;
    coverImage: string | null;
    videoUrl: string; // Ссылка на YouTube (обязательно)
    gallery: string[];
    status: 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED';
    authorId: string;
    createdAt: string;
}

export interface Like {
    id: string;
    userId: string;
    projectId: string;
}

export interface Comment {
    id: string;
    userId: string;
    projectId: string;
    content: string;
    createdAt: string;
}

// --- In-memory stores ---
export const users: User[] = [];
export const projects: Project[] = [];
export const likes: Like[] = [];
export const comments: Comment[] = [];

// --- Helpers ---
export function createId() {
    return randomUUID();
}

// Seed demo projects so the home page isn't empty
function seedProjects() {
    const demoAuthorId = createId();
    users.push({
        id: demoAuthorId,
        name: 'Ashar Demo',
        email: 'demo@ashar.go',
        passwordHash: '',
        role: 'ADMIN',
        locale: 'ru',
        avatarUrl: null,
        createdAt: new Date().toISOString(),
    });

    const categories = ['TECHNOLOGY', 'EDUCATION', 'SOCIAL', 'CREATIVE', 'BUSINESS'];
    const titles = [
        'Мобильное приложение для фермеров',
        'Онлайн-школа программирования',
        'Помощь детским домам Кыргызстана',
        'Кыргызский анимационный фильм',
        'Стартап по доставке органических продуктов',
        'Платформа для местных мастеров',
    ];

    titles.forEach((title, i) => {
        projects.push({
            id: createId(),
            title,
            shortDescription: `Описание проекта: ${title}`,
            description: `Полное описание проекта "${title}". Мы хотим изменить мир к лучшему с помощью этого замечательного проекта.`,
            category: categories[i % categories.length],
            goalAmount: (i + 1) * 50000,
            currentAmount: Math.floor((i + 1) * 50000 * Math.random() * 0.8),
            fundingType: 'FLEXIBLE',
            projectType: 'REWARD',
            deadline: new Date(Date.now() + (30 + i * 10) * 24 * 60 * 60 * 1000).toISOString(),
            coverImage: null,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            gallery: [],
            status: 'ACTIVE',
            authorId: demoAuthorId,
            createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        });
    });
}

seedProjects();
