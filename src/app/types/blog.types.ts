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
  author?: {
    fullName: string;
    profilePhotoUrl: string | null;
  };
}

export interface BlogComment {
  id: number;
  postId: number;
  commentText: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user: {
    fullName: string;
    profilePhotoUrl: string | null;
  };
}
