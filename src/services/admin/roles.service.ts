import apiClient from "@/lib/api/axios";

export interface Role {
  id: number;
  name: string;
  description: string;
  _count?: { users: number };
}

export interface PermRow {
  module: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface RolePermissionsResponse {
  roleId: number;
  roleName: string;
  permissions: PermRow[];
}

export const rolesService = {
  getRoles: async (): Promise<Role[]> => {
    try {
      const response = await apiClient.get("/role/roles?limit=100");
      const rData = response.data;
      if (Array.isArray(rData)) return rData;
      if (rData?.data && Array.isArray(rData.data)) return rData.data;
      if (rData?.data?.data && Array.isArray(rData.data.data)) return rData.data.data;
      if (rData?.roles && Array.isArray(rData.roles)) return rData.roles;
      if (rData?.data?.roles && Array.isArray(rData.data.roles)) return rData.data.roles;
      if (rData?.data?.data?.roles && Array.isArray(rData.data.data.roles)) return rData.data.data.roles;
      return [];
    } catch (error) {
      console.error("Failed to fetch roles", error);
      return [];
    }
  },

  createRole: async (data: { name: string, description: string, permissions?: PermRow[] }): Promise<any> => {
    try {
      const response = await apiClient.post("/role/roles", data);
      return response.data;
    } catch (error) {
      console.error("Failed to create role", error);
      throw error;
    }
  },

  updateRole: async (id: number, data: { name?: string, description?: string }): Promise<any> => {
    try {
      const response = await apiClient.patch(`/role/roles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to update role", error);
      throw error;
    }
  },

  deleteRole: async (id: number): Promise<any> => {
    try {
      const response = await apiClient.delete(`/role/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete role", error);
      throw error;
    }
  },

  getRolePermissions: async (roleId: number): Promise<RolePermissionsResponse | null> => {
    try {
      const response = await apiClient.get(`/role/roles/${roleId}/permissions`);
      return response.data?.data || null;
    } catch (error) {
      console.error("Failed to fetch role permissions", error);
      return null;
    }
  },

  updateRolePermissions: async (roleId: number, permissions: PermRow[]): Promise<RolePermissionsResponse | null> => {
    try {
      const response = await apiClient.post(`/role/roles/${roleId}/permissions`, { permissions });
      return response.data?.data || null;
    } catch (error) {
      console.error("Failed to update role permissions", error);
      throw error;
    }
  },

  resetRolePermissions: async (roleId: number): Promise<any> => {
    try {
      const response = await apiClient.delete(`/role/roles/${roleId}/permissions`);
      return response.data;
    } catch (error) {
      console.error("Failed to reset role permissions", error);
      throw error;
    }
  }
};
