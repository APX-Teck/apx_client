import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
  recaptchaToken: z.string().min(1, 'Please complete the reCAPTCHA to verify you are human'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
