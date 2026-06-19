import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usersService, UserDetail, Role, ModuleAccess } from '@/services/admin/users.service';

export const useUserDetailLogic = (
  userId: string,
  initialUser: UserDetail | null,
  initialPermissions: ModuleAccess[],
  initialRoles: Role[]
) => {
  const router = useRouter();

  const [user, setUser] = useState<UserDetail | null>(initialUser);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [permissions, setPermissions] = useState<ModuleAccess[]>(initialPermissions);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userData, permsData, rolesData] = await Promise.all([
          usersService.getUserDetail(userId),
          usersService.getUserPermissions(userId),
          usersService.getRoles()
        ]);
        if (isMounted) {
          if (userData) {
            setUser(userData);
            setForm({
              fullName: userData.fullName || '',
              email: userData.email || '',
              phone: userData.phone || '',
              roleId: String(userData.role?.id || ''),
              address: userData.address || '',
              city: userData.city || '',
              state: userData.state || '',
              pincode: userData.pincode || '',
              dob: userData.dob || '',
              employeeId: userData.employeeId || '',
              department: userData.department || '',
              designation: userData.designation || '',
              joiningDate: userData.joiningDate || '',
              bankAccountName: userData.bankDetails?.accountName || '',
              bankAccountNumber: userData.bankDetails?.accountNumber || '',
              bankIfscCode: userData.bankDetails?.ifsc || '',
              bankName: userData.bankDetails?.bankName || '',
              upiId: userData.bankDetails?.upiId || '',
            });
          }
          if (permsData) {
            setPermissions(permsData);
            setEditedPerms(permsData.map((p) => ({ ...p })));
          }
          if (rolesData) setRoles(rolesData);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (!initialUser && userId) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, [initialUser, userId]);

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'permissions'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isEditingPerms, setIsEditingPerms] = useState(false);
  const [isSavingPerms, setIsSavingPerms] = useState(false);
  const [editedPerms, setEditedPerms] = useState<ModuleAccess[]>(
    initialPermissions.map((p) => ({ ...p }))
  );

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Document states
  const [rejectingDocId, setRejectingDocId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [isUpdatingDoc, setIsUpdatingDoc] = useState(false);

  // Editable form state
  const [form, setForm] = useState({
    fullName: initialUser?.fullName || '',
    email: initialUser?.email || '',
    phone: initialUser?.phone || '',
    roleId: String(initialUser?.role?.id || ''),
    address: initialUser?.address || '',
    city: initialUser?.city || '',
    state: initialUser?.state || '',
    pincode: initialUser?.pincode || '',
    dob: initialUser?.dob || '',
    employeeId: initialUser?.employeeId || '',
    department: initialUser?.department || '',
    designation: initialUser?.designation || '',
    joiningDate: initialUser?.joiningDate || '',
    bankAccountName: initialUser?.bankDetails?.accountName || '',
    bankAccountNumber: initialUser?.bankDetails?.accountNumber || '',
    bankIfscCode: initialUser?.bankDetails?.ifsc || '',
    bankName: initialUser?.bankDetails?.bankName || '',
    upiId: initialUser?.bankDetails?.upiId || '',
  });

  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    if (!user) return;
    const data = await usersService.getUserDetail(user.id);
    if (data) {
      setUser(data);
      setForm({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        roleId: String(data.role?.id || ''),
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        dob: data.dob || '',
        employeeId: data.employeeId || '',
        department: data.department || '',
        designation: data.designation || '',
        joiningDate: data.joiningDate || '',
        bankAccountName: data.bankDetails?.accountName || '',
        bankAccountNumber: data.bankDetails?.accountNumber || '',
        bankIfscCode: data.bankDetails?.ifsc || '',
        bankName: data.bankDetails?.bankName || '',
        upiId: data.bankDetails?.upiId || '',
      });
    }
  }, [user]);

  const loadPermissions = useCallback(async () => {
    if (!user) return;
    const perms = await usersService.getUserPermissions(user.id);
    setPermissions(perms);
    setEditedPerms(perms.map((p) => ({ ...p })));
  }, [user]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        roleId: String(user.role?.id || ''),
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        dob: user.dob || '',
        employeeId: user.employeeId || '',
        department: user.department || '',
        designation: user.designation || '',
        joiningDate: user.joiningDate || '',
        bankAccountName: user.bankDetails?.accountName || '',
        bankAccountNumber: user.bankDetails?.accountNumber || '',
        bankIfscCode: user.bankDetails?.ifsc || '',
        bankName: user.bankDetails?.bankName || '',
        upiId: user.bankDetails?.upiId || '',
      });
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await usersService.updateUser(user.id, {
        fullName: form.fullName || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        roleId: parseInt(form.roleId) || undefined,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        dateOfBirth: form.dob,
        employeeId: form.employeeId,
        department: form.department,
        designation: form.designation,
        joiningDate: form.joiningDate,
        bankAccountName: form.bankAccountName,
        bankAccountNumber: form.bankAccountNumber,
        bankIfscCode: form.bankIfscCode,
        bankName: form.bankName,
        upiId: form.upiId,
        profilePicture: profilePictureFile || undefined,
      });
      setToast({ message: 'User updated successfully!', type: 'success' });
      setIsEditing(false);
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
      await loadUser();
    } catch {
      setToast({ message: 'Failed to update user. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!user) return;
    const action = user.isActive ? 'block' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${user.fullName}?`)) return;
    try {
      await usersService.toggleUserActive(user.id, !user.isActive);
      setToast({
        message: `User ${user.isActive ? 'blocked' : 'activated'} successfully!`,
        type: 'success',
      });
      await loadUser();
    } catch {
      setToast({ message: `Failed to ${action} user.`, type: 'error' });
    }
  };

  const handleUpdateDocumentStatus = async (
    docId: number,
    status: 'VERIFIED' | 'REJECTED',
    note?: string
  ) => {
    setIsUpdatingDoc(true);
    try {
      await usersService.updateDocumentStatus(docId, status, note);
      setToast({ message: `Document ${status.toLowerCase()} successfully!`, type: 'success' });
      setRejectingDocId(null);
      setRejectNote('');
      await loadUser();
    } catch {
      setToast({ message: `Failed to update document status.`, type: 'error' });
    } finally {
      setIsUpdatingDoc(false);
    }
  };

  const handlePermToggle = (
    moduleIndex: number,
    field: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'
  ) => {
    setEditedPerms((prev) =>
      prev.map((p, i) => (i === moduleIndex ? { ...p, [field]: !p[field] } : p))
    );
  };

  const handleCancelPerms = () => {
    setEditedPerms(permissions.map((p) => ({ ...p })));
    setIsEditingPerms(false);
  };

  const handleSavePerms = async () => {
    if (!user) return;
    setIsSavingPerms(true);
    try {
      const permsToSave = editedPerms
        .filter((p) => {
          const original = permissions.find((o) => o.module === p.module);
          if (!original) return true;
          return (
            p.canCreate !== original.canCreate ||
            p.canRead !== original.canRead ||
            p.canUpdate !== original.canUpdate ||
            p.canDelete !== original.canDelete
          );
        })
        .map((p) => ({
          module: p.module,
          canCreate: p.canCreate,
          canRead: p.canRead,
          canUpdate: p.canUpdate,
          canDelete: p.canDelete,
        }));

      if (permsToSave.length > 0) {
        await usersService.bulkGrantModuleAccess(user.id, permsToSave);
      }

      setToast({ message: 'Permissions updated successfully!', type: 'success' });
      setIsEditingPerms(false);
      await loadPermissions();
    } catch {
      setToast({ message: 'Failed to update permissions.', type: 'error' });
    } finally {
      setIsSavingPerms(false);
    }
  };

  const handleRevokeModule = async (module: string) => {
    if (!user) return;
    if (!window.confirm(`Remove override for module? User will fall back to role defaults.`))
      return;
    try {
      await usersService.revokeModuleAccess(user.id, module);
      setToast({ message: 'Override removed successfully!', type: 'success' });
      await loadPermissions();
    } catch {
      setToast({ message: 'Failed to remove override.', type: 'error' });
    }
  };

  const handleResetAllPerms = async () => {
    if (!user) return;
    if (
      !window.confirm(
        `Reset ALL overrides for ${user.fullName}? They will revert to role defaults.`
      )
    )
      return;
    try {
      await usersService.revokeAllModuleAccess(user.id);
      setToast({ message: 'All overrides reset to role defaults!', type: 'success' });
      await loadPermissions();
    } catch {
      setToast({ message: 'Failed to reset permissions.', type: 'error' });
    }
  };

  return {
    router,
    user,
    roles,
    permissions,
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    isSaving,
    isEditingPerms,
    setIsEditingPerms,
    isSavingPerms,
    editedPerms,
    toast,
    setToast,
    rejectingDocId,
    setRejectingDocId,
    rejectNote,
    setRejectNote,
    isUpdatingDoc,
    form,
    profilePicturePreview,
    setProfilePictureFile,
    setProfilePicturePreview,
    handleChange,
    handleCancel,
    handleSave,
    handleToggleActive,
    handleUpdateDocumentStatus,
    handlePermToggle,
    handleCancelPerms,
    handleSavePerms,
    handleRevokeModule,
    handleResetAllPerms,
    isLoading,
  };
};
