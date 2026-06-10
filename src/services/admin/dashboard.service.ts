import apiClient from "@/lib/api/axios";

export interface DashboardStats {
  customers: {
    totalCustomers: number;
    newRequestsToday: number;
    openRequests: number;
    inProgressRequests: number;
    completedRequestsThisMonth: number;
  };
  revenue: {
    pendingInvoicesAmount: number;
    revenueThisMonth: number;
    overduePaymentsCount: number;
    totalRevenueLifetime: number;
  };
  content: {
    blogPostsPublished: number;
    commentsPending: number;
    totalBlogLikes: number;
  };
  leads: {
    newLeadsThisWeek: number;
    newEnquiries: number;
    openTasks: number;
    pendingReimbursementsAmount: number;
  };
  charts: {
    requestsByStatus: { name: string; value: number; fill: string }[];
  };
  activityFeed: {
    id: string;
    type: string;
    text: string;
    createdAt: string;
    icon: string;
    color: string;
  }[];
}

export const dashboardService = {
  getAdminStats: async (): Promise<DashboardStats | null> => {
    return null;
  },
};
