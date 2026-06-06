export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
}

export interface ResetPasswordPayload {
  token: string;
  passwordHash: string;
}
