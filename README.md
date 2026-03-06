# 🚀 Ashar-go — Краудфандинг платформа Кыргызстана

![Ashar-go](https://img.shields.io/badge/Ashar--go-Crowdfunding-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

> Цифровая реализация кыргызской традиции «ашар» — коллективной помощи

## 📖 О проекте

**Ashar-go** — это онлайн-платформа краудфандинга для рынка Кыргызстана, где люди могут:
- 🚀 Запускать проекты
- 💰 Собирать средства
- 🤝 Поддерживать идеи других
- 📈 Развивать локальный бизнес и социальные инициативы

### Типы краудфандинга
- ✅ **Reward-based** — поддержка за вознаграждение
- ✅ **Donation-based** — благотворительность
- 🔜 Equity-based (в разработке)
- 🔜 Debt-based (в разработке)

## 🛠 Технологический стек

### Frontend
- **Next.js 16** — SSR, SEO оптимизация
- **React 19** — UI компоненты
- **TailwindCSS 4** — стилизация
- **Framer Motion** — анимации
- **Lucide React** — иконки

### Backend
- **Node.js** + **Express.js** — API сервер
- **Prisma ORM** — работа с базой данных
- **PostgreSQL 16** — база данных
- **JWT** — аутентификация
- **Zod** — валидация данных
- **Multer** — загрузка файлов

## 🚀 Быстрый старт

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Откройте http://localhost:3000

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Настройте DATABASE_URL в .env
npx prisma migrate dev
npm run dev
```

API доступен на http://localhost:4000

### Docker (полный стек)

```bash
docker-compose up -d
```

## 📁 Структура проекта

```
ashar-go/
├── frontend/          # Next.js приложение
│   └── src/
│       ├── app/       # Страницы (App Router)
│       ├── components/# React компоненты
│       ├── lib/       # Утилиты, переводы
│       └── types/     # TypeScript типы
├── backend/           # Express.js API
│   └── src/
│       ├── routes/    # API роуты
│       ├── middleware/ # Auth middleware
│       └── index.ts   # Entry point
├── docker-compose.yml
└── README.md
```

## 🌍 Локализация

Поддерживаемые языки:
- 🇷🇺 Русский
- 🇰🇬 Кыргызский
- 🇬🇧 English

## 📄 Страницы

| Страница | Путь | Описание |
|----------|------|----------|
| Главная | `/` | Hero, проекты, категории, статистика |
| Каталог | `/projects` | Поиск и фильтрация проектов |
| Проект | `/projects/:id` | Детали проекта с наградами |
| Создание | `/create` | Форма создания проекта |
| Вход | `/auth/login` | Авторизация |
| Регистрация | `/auth/register` | Регистрация |
| Дашборд | `/dashboard` | Личный кабинет |

## 📡 API Endpoints

| Method | Endpoint | Описание |
|--------|----------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET | `/api/projects` | Список проектов |
| GET | `/api/projects/:id` | Детали проекта |
| POST | `/api/projects` | Создать проект |
| POST | `/api/projects/:id/like` | Лайк |
| POST | `/api/projects/:id/comments` | Комментарий |
| GET | `/api/users/me` | Мой профиль |
| POST | `/api/upload` | Загрузка файла |

## 📜 Лицензия

MIT © 2026 Ashar-go
