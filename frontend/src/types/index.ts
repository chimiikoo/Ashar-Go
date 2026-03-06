export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ProjectCategory;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  coverImage: string;
  gallery: string[];
  goalAmount: number;
  currentAmount: number;
  backersCount: number;
  fundingType: 'all-or-nothing' | 'flexible';
  projectType: 'reward' | 'donation';
  status: 'draft' | 'active' | 'funded' | 'expired' | 'cancelled';
  deadline: string;
  createdAt: string;
  updatedAt: string;
  rewards: Reward[];
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  featured?: boolean;
}

export type ProjectCategory =
  | 'business'
  | 'technology'
  | 'education'
  | 'social'
  | 'creative'
  | 'sport'
  | 'health'
  | 'ecology';

export interface Reward {
  id: string;
  projectId: string;
  title: string;
  description: string;
  minAmount: number;
  quantityAvailable: number;
  quantityClaimed: number;
  imageUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'user' | 'admin' | 'moderator';
  locale: 'ru' | 'ky' | 'en';
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  projectId: string;
  content: string;
  createdAt: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Pledge {
  id: string;
  backerId: string;
  projectId: string;
  rewardId?: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  createdAt: string;
}

export interface PlatformStats {
  totalProjects: number;
  totalFunded: number;
  totalBackers: number;
  totalRaised: number;
}

export type Locale = 'ru' | 'ky' | 'en';

export interface CategoryInfo {
  id: ProjectCategory;
  icon: string;
  count: number;
}
