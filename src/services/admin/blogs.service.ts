export type BlogStatus = "DRAFT" | "PUBLISHED" | "REVIWED" | "REJECTED" | "UPDATED";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  categoryId: number | null;
  category?: BlogCategory; // Expanded relation
  tags: string[];
  authorId: number;
  authorName?: string; // Expanded relation
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Initial Mock Data mimicking backend DB
let mockCategories: BlogCategory[] = [
  { id: 1, name: "Technology", slug: "technology" },
  { id: 2, name: "Business", slug: "business" },
  { id: 3, name: "Design", slug: "design" }
];

let mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Next.js Performance Optimization Tips for 2026",
    slug: "nextjs-performance-tips-2026",
    excerpt: "Learn how to squeeze every ounce of performance out of the Next.js App Router.",
    content: "<p>Full content goes here...</p>",
    coverImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    categoryId: 1,
    category: mockCategories[0],
    tags: ["Next.js", "React", "Performance"],
    authorId: 1,
    authorName: "Admin User",
    status: "PUBLISHED",
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 2,
    title: "Why SEO is Critical for Enterprise B2B SaaS",
    slug: "seo-critical-enterprise-b2b",
    excerpt: "Content marketing isn't just for B2C. Here is how B2B companies win big with organic search.",
    content: "<p>Full content goes here...</p>",
    coverImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    categoryId: 2,
    category: mockCategories[1],
    tags: ["SEO", "Marketing", "B2B"],
    authorId: 2,
    authorName: "Marketing Team",
    status: "DRAFT",
    publishedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 3,
    title: "The Rise of Micro-Animations in Modern UI",
    slug: "rise-of-micro-animations-ui",
    excerpt: "Small animations can have a massive impact on user retention and perceived application speed.",
    content: "<p>Full content goes here...</p>",
    coverImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    categoryId: 3,
    category: mockCategories[2],
    tags: ["Design", "UI/UX", "Framer Motion"],
    authorId: 3,
    authorName: "Design Studio",
    status: "REVIWED",
    publishedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const blogsService = {
  getPosts: async (): Promise<BlogPost[]> => {
    await delay(600);
    return [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPostById: async (id: number): Promise<BlogPost | null> => {
    await delay(400);
    const post = mockPosts.find((p) => p.id === id);
    return post ? { ...post } : null;
  },

  updatePostStatus: async (id: number, status: BlogStatus): Promise<BlogPost> => {
    await delay(500);
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Post not found");

    const updated = { 
      ...mockPosts[index], 
      status, 
      updatedAt: new Date().toISOString() 
    };

    if (status === "PUBLISHED" && !updated.publishedAt) {
      updated.publishedAt = new Date().toISOString();
    }

    mockPosts[index] = updated;
    return updated;
  },

  deletePost: async (id: number): Promise<{ success: boolean }> => {
    await delay(600);
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Post not found");

    mockPosts = mockPosts.filter(p => p.id !== id);
    return { success: true };
  }
};
