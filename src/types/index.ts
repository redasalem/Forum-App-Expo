export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  createdAt: string;
  stats?: {
    topics: number;
    replies: number;
  };
}

export interface Topic {
  _id: string;
  title: string;
  content: string;
  author: User;
  views: number;
  replyCount: number;
  lastActivity: string;
  timeAgo?: string;
  recentParticipants: User[];
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  _id: string;
  content: string;
  author: User;
  topic: string | Topic;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
