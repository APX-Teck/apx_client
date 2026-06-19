import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { usersService, Role } from '@/services/admin/users.service';
import { rolesService } from '@/services/admin/roles.service';

const userSchema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
  email: z.string().email('Invalid email address format'),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,15}$/, 'Invalid phone number format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleId: z.string().min(1, 'Please assign a role'),
  isActive: z.boolean().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  joiningDate: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIfscCode: z.string().optional(),
  bankName: z.string().optional(),
  upiId: z.string().optional(),
});

export const useCreateUserLogic = (initialRoles: Role[]) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    roleId: '',
    isActive: true,
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    employeeId: '',
    department: '',
    designation: '',
    joiningDate: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    upiId: '',
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRoleData, setNewRoleData] = useState({ name: '', description: '' });
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  useEffect(() => {
    if (roles.length > 0 && !formData.roleId) {
      setFormData((prev) => ({ ...prev, roleId: String(roles[0].id) }));
    }
  }, [roles, formData.roleId]);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingRole(true);
    try {
      const formattedName = newRoleData.name.toUpperCase().replace(/\s+/g, '_');
      await rolesService.createRole({
        name: formattedName,
        description: newRoleData.description,
      });

      const updatedRoles = await usersService.getRoles();
      setRoles(updatedRoles);

      const newlyAdded = updatedRoles.find((r) => r.name === formattedName);
      if (newlyAdded) {
        setFormData((prev) => ({ ...prev, roleId: String(newlyAdded.id) }));
      }

      setIsRoleModalOpen(false);
      setNewRoleData({ name: '', description: '' });
    } catch (error: any) {
      alert(error?.response?.data?.message || error.message || 'Failed to create role');
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zod Validation
    const validationResult = userSchema.safeParse(formData);
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
      // Optional: scroll to top or first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await usersService.createUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password || undefined,
        roleId: formData.roleId ? parseInt(formData.roleId) : undefined,
        isActive: formData.isActive,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        pincode: formData.pincode || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        employeeId: formData.employeeId || undefined,
        department: formData.department || undefined,
        designation: formData.designation || undefined,
        joiningDate: formData.joiningDate || undefined,
        bankAccountName: formData.bankAccountName || undefined,
        bankAccountNumber: formData.bankAccountNumber || undefined,
        bankIfscCode: formData.bankIfscCode || undefined,
        bankName: formData.bankName || undefined,
        upiId: formData.upiId || undefined,
      });
      router.push('/admin/users');
      router.refresh();
    } catch (error: any) {
      console.error('Failed to create user', error);
      alert(
        error?.response?.data?.message ||
          'Failed to create user. Please check the inputs and try again.'
      );
      setIsSubmitting(false);
    }
  };

  const selectedRole = roles.find((r) => r.id === Number(formData.roleId));
  const isEmployee = selectedRole && selectedRole.name !== 'CUSTOMER';

  return {
    router,
    formData,
    roles,
    isSubmitting,
    isRoleModalOpen,
    setIsRoleModalOpen,
    newRoleData,
    setNewRoleData,
    isCreatingRole,
    handleCreateRole,
    handleInputChange,
    handleSubmit,
    isEmployee,
    errors,
  };
};
