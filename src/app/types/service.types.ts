export interface ServiceField {
  id: number;
  serviceId: number;
  fieldLabel: string;
  fieldKey: string;
  fieldType: "TEXT" | "TEXTAREA" | "DROPDOWN" | "FILE" | "NUMBER" | "DATE" | "EMAIL" | "PHONE";
  isRequired: boolean;
  placeholder: string | null;
  options: unknown; // Parsed options array or string
  isActive: boolean;
  sortOrder: number;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  thumbnailId: string | null;
  price: string | null;
  timeline: string | null;
  isActive: boolean;
  sortOrder: number;
  fields?: ServiceField[];
}
