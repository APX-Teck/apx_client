export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  tags: string[];
  status: string;
  publishedAt: string | null;
  createdAt: string;
  views?: number;
  authorDesignation?: string | null;
  authorBio?: string | null;
  author?: {
    fullName: string;
    profilePhotoUrl?: string | null;
    profile?: { profilePhotoUrl: string | null };
  };
  _count?: {
    likes: number;
    comments: number;
  };
  category?: {
    id?: number;
    name: string;
    slug: string;
  };
}

export interface BlogComment {
  id: number;
  postId: number;
  commentText: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  user: {
    fullName: string;
    profilePhotoUrl?: string | null;
    profile?: { profilePhotoUrl: string | null };
  };
}
