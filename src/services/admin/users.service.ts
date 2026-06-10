import apiClient from "@/lib/api/axios";

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface UserDocument {
  id: number;
  documentType: string;
  documentLabel?: string;
  documentNumber?: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  frontFileUrl: string;
  backFileUrl?: string;
  reviewNote?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ModuleAccess {
  module: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  source: "override" | "role_default" | "denied";
}

export interface UserDetail extends User {
  address: string;
  city: string;
  state: string;
  pincode: string;
  dob: string;
  profilePhotoUrl?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  joiningDate?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    upiId: string;
  };
  documents: UserDocument[];
  permissions: ModuleAccess[];
}

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get("/auth/getAllUsers");
      return response.data?.data?.data || [];
    } catch (error) {
      console.error("Failed to fetch users", error);
      return [];
    }
  },

  getRoles: async (): Promise<Role[]> => {
    try {
      const response = await apiClient.get("/role/roles?limit=100");
      const rData = response.data;
      
      // Attempt aggressive parsing based on common backend wrapper formats
      if (Array.isArray(rData)) return rData;
      if (rData?.data && Array.isArray(rData.data)) return rData.data;
      if (rData?.data?.data && Array.isArray(rData.data.data)) return rData.data.data;
      if (rData?.roles && Array.isArray(rData.roles)) return rData.roles;
      if (rData?.data?.roles && Array.isArray(rData.data.roles)) return rData.data.roles;
      if (rData?.data?.data?.roles && Array.isArray(rData.data.data.roles)) return rData.data.data.roles;
      
      console.warn("Could not find roles array in response:", rData);
      return [];
    } catch (error) {
      console.error("Failed to fetch roles", error);
      return [];
    }
  },

  createUser: async (userData: any): Promise<any> => {
    try {
      const response = await apiClient.post("/auth/createUser", userData);
      return response.data;
    } catch (error) {
      console.error("Failed to create user", error);
      throw error;
    }
  },

  getUserDetail: async (id: string | number): Promise<UserDetail | null> => {
    try {
      const response = await apiClient.get(`/auth/getUserById/${id}`);
      const userData = response.data?.data;
      if (!userData) return null;

      // Fetch roles to map roleId to role name
      const roles = await usersService.getRoles();
      const role = roles.find(r => r.id === userData.roleId) || { id: userData.roleId, name: 'Unknown', description: '' };

      // Map backend profile structure to frontend UserDetail
      const profile = userData.profile || {};
      
      const bankDetails = profile.bankAccountNumber ? {
        accountName: profile.bankAccountName || "",
        accountNumber: profile.bankAccountNumber || "",
        ifsc: profile.bankIfscCode || "",
        bankName: profile.bankName || "",
        upiId: profile.upiId || ""
      } : undefined;

      // Map documents from backend UserDocument model
      const documents: UserDocument[] = (userData.documents || []).map((doc: any) => ({
        id: doc.id,
        documentType: doc.documentType,
        documentLabel: doc.documentLabel,
        documentNumber: doc.documentNumber,
        status: doc.status,
        frontFileUrl: doc.frontFileUrl,
        backFileUrl: doc.backFileUrl || undefined,
        reviewNote: doc.reviewNote || undefined,
        reviewedAt: doc.reviewedAt || undefined,
        createdAt: doc.createdAt,
      }));

      return {
        id: userData.id,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        role: role,
        isActive: userData.isActive,
        createdAt: userData.createdAt,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        dob: profile.dateOfBirth,
        profilePhotoUrl: profile.profilePhotoUrl || `https://ui-avatars.com/api/?name=${userData.fullName}&background=4f46e5&color=fff`,
        employeeId: profile.employeeId,
        department: profile.department,
        designation: profile.designation,
        joiningDate: profile.joiningDate,
        bankDetails: bankDetails,
        documents: documents,
        permissions: [] // Will be loaded separately via getUserPermissions
      };
    } catch (error) {
      console.error("Failed to fetch user details", error);
      return null;
    }
  },

  // ─── Module Access (resolved matrix with source: override / role_default / denied) ───
  getUserPermissions: async (userId: string | number): Promise<ModuleAccess[]> => {
    try {
      const response = await apiClient.get(`/module-access/users/${userId}/permissions`);
      const data = response.data?.data;
      return (data?.permissions || []).map((p: any) => ({
        module: p.module,
        canCreate: p.canCreate,
        canRead: p.canRead,
        canUpdate: p.canUpdate,
        canDelete: p.canDelete,
        source: p.source, // "override" | "role_default" | "denied"
      }));
    } catch (error) {
      console.error("Failed to fetch user permissions", error);
      return [];
    }
  },

  grantModuleAccess: async (userId: string | number, permission: {
    module: string; canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean;
  }): Promise<any> => {
    try {
      const response = await apiClient.post(`/module-access/users/${userId}/permissions`, permission);
      return response.data;
    } catch (error) {
      console.error("Failed to grant module access", error);
      throw error;
    }
  },

  bulkGrantModuleAccess: async (userId: string | number, permissions: {
    module: string; canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean;
  }[]): Promise<ModuleAccess[]> => {
    try {
      const response = await apiClient.post(`/module-access/users/${userId}/permissions/bulk`, { permissions });
      return response.data?.data?.permissions || [];
    } catch (error) {
      console.error("Failed to bulk grant module access", error);
      throw error;
    }
  },

  revokeModuleAccess: async (userId: string | number, module: string): Promise<any> => {
    try {
      const response = await apiClient.delete(`/module-access/users/${userId}/permissions/${module}`);
      return response.data;
    } catch (error) {
      console.error("Failed to revoke module access", error);
      throw error;
    }
  },

  revokeAllModuleAccess: async (userId: string | number): Promise<any> => {
    try {
      const response = await apiClient.delete(`/module-access/users/${userId}/permissions`);
      return response.data;
    } catch (error) {
      console.error("Failed to revoke all module access", error);
      throw error;
    }
  },

  // ─── User Update ───
  updateUser: async (id: string | number, userData: Partial<{
    fullName: string;
    email: string;
    phone: string;
    roleId: number;
    isActive: boolean;
    address: string;
    city: string;
    state: string;
    pincode: string;
    dateOfBirth: string;
    employeeId: string;
    department: string;
    designation: string;
    joiningDate: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankIfscCode: string;
    bankName: string;
    upiId: string;
    profilePicture?: File | null;
  }>): Promise<any> => {
    try {
      if (userData.profilePicture) {
        const formData = new FormData();
        Object.entries(userData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value instanceof File ? value : String(value));
          }
        });
        const response = await apiClient.put(`/auth/updateUserByAdmin/${id}`, formData);
        return response.data;
      } else {
        const response = await apiClient.put(`/auth/updateUserByAdmin/${id}`, userData);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to update user", error);
      throw error;
    }
  },

  toggleUserActive: async (id: string | number, isActive: boolean): Promise<any> => {
    try {
      const response = await apiClient.put(`/auth/updateUserByAdmin/${id}`, { isActive });
      return response.data;
    } catch (error) {
      console.error("Failed to toggle user status", error);
      throw error;
    }
  },

  updateDocumentStatus: async (documentId: number, status: "VERIFIED" | "REJECTED" | "PENDING", reviewNote?: string): Promise<any> => {
    try {
      const response = await apiClient.patch(`/document/${documentId}/status`, { status, reviewNote });
      return response.data;
    } catch (error) {
      console.error("Failed to update document status", error);
      throw error;
    }
  }
};

