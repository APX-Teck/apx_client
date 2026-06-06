export interface Testimonial {
  id: number;
  clientName: string;
  clientBusiness: string | null;
  clientWebsite: string | null;
  clientLogoUrl: string | null;
  clientPhotoUrl: string | null;
  rating: number;
  feedback: string;
  projectType: string | null;
  isVerified: boolean;
  isPublished: boolean;
}
