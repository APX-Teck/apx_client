export interface Portfolio {
  id: number;
  title: string;
  slug: string;
  clientName: string;
  clientLogoUrl: string | null;
  serviceType: string;
  problem: string | null;
  solution: string | null;
  results: string | null;
  coverImageUrl: string | null;
  liveUrl: string | null;
  galleryUrls: string[];
  isPublished: boolean;
  sortOrder: number;
  completedAt: string | null;
}
