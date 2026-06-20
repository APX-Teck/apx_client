import { useState, useEffect, useRef } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

export function useServiceRequestLogic(serviceId: number, serviceSlug: string) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm();
  const { setValue, reset } = form;

  // Load saved form values if returning from auth redirect
  useEffect(() => {
    const saved = sessionStorage.getItem('saved_request_form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([key, val]) => {
          setValue(key, val);
        });
        // Scroll directly to form for convenience
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 800);
      } catch (err) {
        console.error('Failed to restore form inputs', err);
      }
    }
  }, [setValue]);

  const onSubmit = async (values: FieldValues) => {
    setErrorMessage('');
    setIsSubmitSuccess(false);

    if (!values.recaptchaToken) {
      setErrorMessage('Please complete the reCAPTCHA to verify you are human.');
      return;
    }

    // Authentication Gate Check
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // Save form state in sessionStorage to prevent data loss
      sessionStorage.setItem('saved_request_form', JSON.stringify(values));
      // Redirect to login page
      router.push(`/login?redirect=/services/${serviceSlug}`);
      return;
    }

    setIsSubmitting(true);

    // Construct Multi-part FormData
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (key === 'recaptchaToken') return; // Do not send recaptchaToken via FormData unless backend expects it
      
      if (val instanceof FileList) {
        if (val.length > 0) {
          formData.append(key, val[0]);
        }
      } else {
        formData.append(key, String(val));
      }
    });

    try {
      const res = await api.submitServiceRequest(serviceId, formData);
      if (res.success) {
        setIsSubmitSuccess(true);
        sessionStorage.removeItem('saved_request_form');
        reset();
      } else {
        setErrorMessage(res.message || 'Failed to submit request.');
      }
    } catch {
      setErrorMessage('Connection failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    formRef,
    isSubmitSuccess,
    isSubmitting,
    errorMessage,
    form,
    onSubmit,
    scrollToForm,
  };
}
