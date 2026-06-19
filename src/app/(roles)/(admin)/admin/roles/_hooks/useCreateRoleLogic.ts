import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { rolesService } from '@/services/admin/roles.service';

const roleSchema = z.object({
  name: z.string()
    .min(3, 'Role name must be at least 3 characters')
    .max(50, 'Role name cannot exceed 50 characters')
    .regex(/^[A-Z_]+$/, 'Role name can only contain uppercase letters and underscores'),
  description: z.string().optional(),
});

export const useCreateRoleLogic = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase().replace(/\s+/g, '_') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const validationResult = roleSchema.safeParse(formData);
    if (!validationResult.success) {
      const flatErrors = validationResult.error.flatten().fieldErrors;
      const fieldErrors: Record<string, string> = {};
      for (const key in flatErrors) {
        const errorArray = flatErrors[key as keyof typeof flatErrors];
        if (errorArray && errorArray.length > 0) {
          fieldErrors[key] = errorArray[0];
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    try {
      setIsSubmitting(true);
      await rolesService.createRole(formData);
      router.push('/admin/roles');
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Failed to create role');
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    formData,
    errors,
    serverError,
    handleChange,
    handleSubmit,
  };
};
