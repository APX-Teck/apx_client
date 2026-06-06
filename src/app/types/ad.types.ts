export interface Ad {
  id: number;
  adType: "GOOGLE" | "CLIENT";
  clientName: string | null;
  adCode: string | null;
  bannerUrl: string | null;
  targetUrl: string | null;
  placement: "BLOG_LIST_TOP" | "BLOG_LIST_MID" | "BLOG_POST_TOP" | "BLOG_POST_MID" | "BLOG_POST_BOTTOM";
  isActive: boolean;
}
