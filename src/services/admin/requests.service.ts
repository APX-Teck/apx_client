import apiClient from "@/lib/api/axios";

export type RequestStatus = "NEW" | "IN_REVIEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type RequestPriority = "LOW" | "MEDIUM" | "HIGH";

export interface ServiceRequest {
  id: string | number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  serviceType: string;
  status: RequestStatus;
  priority: RequestPriority;
  assignedTo?: string;
  createdAt: string;
}

export interface RequestFormData {
  label: string;
  value: string;
}

export interface RequestAttachment {
  id: string | number;
  fileName: string;
  url: string;
  fileSize: string;
}

export interface PaymentRecord {
  id: string | number;
  amount: number;
  status: "PENDING" | "SENT" | "PAID" | "FAILED";
  date: string;
}

export interface ServiceRequestDetail extends ServiceRequest {
  customerPhone: string;
  formData: RequestFormData[];
  attachments: RequestAttachment[];
  internalNotes?: string;
  paymentHistory: PaymentRecord[];
  assignedToId?: number;
}

export const requestsService = {
  getRequests: async (): Promise<ServiceRequest[]> => {
    try {
      const response = await apiClient.get("/service/request/all");
      const requests = response.data?.data?.data || [];
      return requests.map((req: any) => ({
        id: req.id,
        customerId: req.customerId || req.customer?.id,
        customerName: req.customer?.fullName || "Unknown",
        customerEmail: req.customer?.email || "",
        serviceType: req.service?.name || "Unknown",
        status: req.status,
        priority: req.priority,
        assignedTo: req.assignedTo?.fullName || undefined,
        createdAt: req.createdAt,
      }));
    } catch (error) {
      console.error("Failed to fetch requests", error);
      return [];
    }
  },

  getRequestDetail: async (id: string | number): Promise<ServiceRequestDetail | null> => {
    try {
      const response = await apiClient.get(`/service/request/admin/${id}`);
      const req = response.data?.data;
      if (!req) return null;

      const formData = (req.requestData || []).map((rd: any) => ({
        label: rd.field?.fieldLabel || rd.fieldKey,
        value: rd.fieldValue,
      }));

      const attachments = (req.fileUploads || []).map((fu: any) => ({
        id: fu.id,
        fileName: fu.fileName,
        url: fu.fileUrl,
        fileSize: fu.fileSize ? `${(fu.fileSize / 1024 / 1024).toFixed(2)} MB` : "Unknown",
      }));

      const paymentHistory = (req.payments || []).map((p: any) => ({
        id: p.id,
        amount: p.amountPaid || p.negotiatedAmount || 0,
        status: p.status,
        date: p.paidAt || p.createdAt,
      }));

      return {
        id: req.id,
        customerId: req.customerId || req.customer?.id,
        customerName: req.customer?.fullName || "Unknown",
        customerEmail: req.customer?.email || "",
        customerPhone: req.customer?.phone || "—",
        serviceType: req.service?.name || "Unknown",
        status: req.status,
        priority: req.priority,
        assignedTo: req.assignedTo?.fullName || undefined,
        assignedToId: req.assignedTo?.id,
        createdAt: req.createdAt,
        formData,
        attachments,
        internalNotes: req.internalNotes || "",
        paymentHistory,
      };
    } catch (error) {
      console.error("Failed to fetch request detail", error);
      return null;
    }
  },

  updateRequestStatus: async (id: string | number, status: RequestStatus): Promise<any> => {
    try {
      const response = await apiClient.patch(`/service/request/status/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error("Failed to update request status", error);
      throw error;
    }
  },

  assignRequest: async (id: string | number, assignedToId: number, priority?: RequestPriority): Promise<any> => {
    try {
      const response = await apiClient.patch(`/service/request/assign/${id}`, { assignedToId, priority });
      return response.data;
    } catch (error) {
      console.error("Failed to assign request", error);
      throw error;
    }
  },

  updateInternalNotes: async (id: string | number, internalNotes: string): Promise<any> => {
    try {
      const response = await apiClient.patch(`/service/request/notes/${id}`, { internalNotes });
      return response.data;
    } catch (error) {
      console.error("Failed to update internal notes", error);
      throw error;
    }
  }
};
