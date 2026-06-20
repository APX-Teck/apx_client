import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/axios';
import { contactSchema, ContactFormValues } from '@/lib/validations/contact';

export function useContactFormLogic() {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      businessName: '',
      serviceInterest: '',
      source: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    // Honeypot bot protection check: if filled, fail silently or block
    if (values.website) {
      console.warn('Spam Bot Detected.');
      setIsSubmitSuccess(true); // fool the bot into thinking it succeeded
      form.reset();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setIsSubmitSuccess(false);

    try {
      const { website, recaptchaToken, ...submitData } = values; // Exclude honeypot and recaptchaToken
      const res = await api.submitEnquiry(submitData);
      if (res.success) {
        setIsSubmitSuccess(true);
        form.reset();
      } else {
        setErrorMessage(res.message || 'Failed to submit enquiry.');
      }
    } catch {
      setErrorMessage('Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitSuccess,
    errorMessage,
    isSubmitting,
  };
}
