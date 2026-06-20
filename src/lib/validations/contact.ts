import * as z from 'zod';

export const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Name must be between 2 and 80 characters' })
    .max(80, { message: 'Name must be between 2 and 80 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: 'Please enter a valid 10-digit Indian phone number',
    }),
  businessName: z
    .string()
    .max(100, { message: 'Business Name can be at most 100 characters' })
    .optional(),
  serviceInterest: z.string().optional(),
  source: z.string().optional(),
  message: z
    .string()
    .min(20, { message: 'Message must be between 20 and 1000 characters' })
    .max(1000, { message: 'Message must be between 20 and 1000 characters' }),
  // Honeypot field for bot spam blocking
  website: z.string().max(100).optional(),
  recaptchaToken: z.string().min(1, 'Please complete the reCAPTCHA to verify you are human'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
