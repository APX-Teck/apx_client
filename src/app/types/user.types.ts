export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isEmailVerified?: boolean;
  passwordHash?: string;
}

export interface TeamMember {
  id: number;
  fullName: string;
  designation: string | null;
  profilePhotoUrl: string | null;
  linkedInUrl?: string | null;
}
