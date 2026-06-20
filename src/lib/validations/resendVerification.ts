import z from 'zod';

export const resendSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Email is required').email('Invalid email format'),
  recaptchaToken: z.string().min(1, 'Please complete the reCAPTCHA to verify you are human'),
});

export type ResendFormValues = z.infer<typeof resendSchema>;
