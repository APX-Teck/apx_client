export interface HeroBanner {
  id: number;
  title: string | null;
  subtitle: string | null;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  mediaId: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  isActive: boolean;
  sortOrder: number;
}
