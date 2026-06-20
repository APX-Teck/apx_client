import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full Name must be at least 2 characters')
      .max(80, 'Full Name must be at most 80 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Full Name cannot contain numbers or special characters'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
        message: 'Phone number must be a valid 10-digit number starting with 6-9',
      }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
      .regex(/\d/, 'Password must contain at least 1 number'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
    botName: z.string().optional(), // Honeypot field
    recaptchaToken: z.string().min(1, 'Please complete the reCAPTCHA to verify you are human'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
