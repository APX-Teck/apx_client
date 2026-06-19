import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/lib/axios';

export const useProfileSettingsLogic = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await api.updateProfile(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
        // Optionally update the auth context user if needed, though it will update on reload
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to update profile.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    formData,
    handleInputChange,
    handleSave,
    isSubmitting,
    message,
  };
};
