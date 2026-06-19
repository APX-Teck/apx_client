import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/lib/axios';

export const useProfileLogic = () => {
  const { user, refresh } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Full name is required.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await api.updateProfile({ fullName: fullName.trim(), phone: phone.trim() });
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Refresh user data in AuthProvider so the sidebar/header reflect updates
        await refresh().catch(() => {});
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to update profile.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    fullName,
    setFullName,
    phone,
    setPhone,
    isSubmitting,
    message,
    handleSubmit,
  };
};
