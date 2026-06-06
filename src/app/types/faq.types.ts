export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  isPublished: boolean;
  sortOrder: number;
}
