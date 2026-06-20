import z from 'zod';

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
      .regex(/\d/, 'Password must contain at least 1 number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    recaptchaToken: z.string().min(1, 'Please complete the reCAPTCHA to verify you are human'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
