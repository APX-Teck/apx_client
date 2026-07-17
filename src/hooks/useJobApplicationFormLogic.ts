import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const jobApplicationSchema = z.object({
  jobId: z.number().optional(), // Adding jobId just in case we need it, though form uses roles
  fullName: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters.' })
    .max(50, { message: 'Full name must not exceed 50 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits.' })
    .max(15, { message: 'Phone number must not exceed 15 digits.' }),
  role: z.string().min(1, { message: 'Please select a role you are applying for.' }),
  portfolio: z.string().url({ message: 'Please provide a valid URL for your portfolio/resume.' }).optional().or(z.literal('')),
  message: z
    .string()
    .min(20, { message: 'Please write at least 20 characters detailing your experience.' })
    .max(1000, { message: 'Message must not exceed 1000 characters.' }),
  recaptchaToken: z.string().min(1, { message: 'Please verify that you are not a robot.' }),
  website: z.string().optional(), // Honeypot field
});

export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;

import { publicJobService } from '@/services/public/job.service';

export function useJobApplicationFormLogic() {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: '',
      portfolio: '',
      message: '',
      recaptchaToken: '',
      website: '',
    },
  });

  const { reset } = form;

  const onSubmit = async (data: JobApplicationFormValues) => {
    // Honeypot check
    if (data.website) {
      console.warn('Bot detected via honeypot.');
      return; // Silent fail for bots
    }

    try {
      setErrorMessage(null);
      
      const payload = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        currentRole: data.role, // Mapping role to currentRole or applying role
        linkedinUrl: data.portfolio, // Portfolio is mapped to linkedinUrl or resumeUrl in backend, but let's use linkedinUrl
        message: data.message,
        source: 'Website Career Page',
        jobId: 1, // Currently hardcoded to 1 or we need a generic jobId for open applications
      };

      await publicJobService.createApplication(payload);
      
      setIsSubmitSuccess(true);
      reset(); // Clear form
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitSuccess(false);
      }, 5000);

    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Something went wrong. Please try again later.'
      );
    }
  };

  return {
    form,
    onSubmit,
    isSubmitSuccess,
    errorMessage,
    isSubmitting: form.formState.isSubmitting,
  };
}
