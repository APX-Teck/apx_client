export type ReimbursementStatus = "PENDING" | "APPROVED" | "REJECTED" | "PAID";

export interface Reimbursement {
  id: number;
  userId: number;
  userName?: string; // Mock added for UI convenience
  title: string;
  description: string | null;
  amount: number;
  category: string;
  receiptUrl: string | null;
  status: ReimbursementStatus;
  reviewedById: number | null;
  reviewedByName?: string; // Mock added for UI convenience
  reviewNote: string | null;
  reviewedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Initial Mock Data mimicking backend DB
let mockReimbursements: Reimbursement[] = [
  {
    id: 1,
    userId: 3,
    userName: "Rahul Dev",
    title: "AWS Certification Exam Fee",
    description: "Paid for the AWS Solutions Architect certification exam as part of my quarterly training goals.",
    amount: 150.00,
    category: "Training & Development",
    receiptUrl: "https://apxteck.s3.amazonaws.com/receipts/aws_cert.pdf",
    status: "PENDING",
    reviewedById: null,
    reviewNote: null,
    reviewedAt: null,
    paidAt: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 2,
    userId: 4,
    userName: "Sneha Sales",
    title: "Client Lunch Meeting - TechCorp",
    description: "Lunch with the VP of TechCorp to discuss the enterprise integration contract.",
    amount: 85.50,
    category: "Client Meetings",
    receiptUrl: "https://apxteck.s3.amazonaws.com/receipts/lunch_techcorp.pdf",
    status: "APPROVED",
    reviewedById: 1,
    reviewedByName: "Admin",
    reviewNote: "Approved. Please keep lunches under $100 in the future.",
    reviewedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    paidAt: null,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 3,
    userId: 5,
    userName: "Amit Content",
    title: "Grammarly Premium Subscription",
    description: "Annual subscription for the content team.",
    amount: 144.00,
    category: "Software Subscriptions",
    receiptUrl: "https://apxteck.s3.amazonaws.com/receipts/grammarly.pdf",
    status: "PAID",
    reviewedById: 1,
    reviewedByName: "Admin",
    reviewNote: "Approved.",
    reviewedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    paidAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 4,
    userId: 2,
    userName: "Priya Design",
    title: "New Ergonomic Chair",
    description: "Purchased a new office chair for home office setup.",
    amount: 350.00,
    category: "Office Equipment",
    receiptUrl: "https://apxteck.s3.amazonaws.com/receipts/chair.pdf",
    status: "REJECTED",
    reviewedById: 1,
    reviewedByName: "Admin",
    reviewNote: "Home office equipment requests must go through IT procurement first. Please return and request via the internal portal.",
    reviewedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    paidAt: null,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const reimbursementsService = {
  getReimbursements: async (): Promise<Reimbursement[]> => {
    await delay(600);
    return [...mockReimbursements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getReimbursementById: async (id: number): Promise<Reimbursement | null> => {
    await delay(400);
    const reimbursement = mockReimbursements.find((r) => r.id === id);
    return reimbursement ? { ...reimbursement } : null;
  },

  updateReimbursementStatus: async (
    id: number, 
    status: ReimbursementStatus, 
    reviewNote?: string
  ): Promise<Reimbursement> => {
    await delay(500);
    const index = mockReimbursements.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Reimbursement not found");

    const updated = { 
      ...mockReimbursements[index], 
      status, 
      updatedAt: new Date().toISOString() 
    };

    if (status === "APPROVED" || status === "REJECTED") {
      updated.reviewedById = 1; // Admin
      updated.reviewedByName = "Admin";
      updated.reviewedAt = new Date().toISOString();
      if (reviewNote !== undefined) {
        updated.reviewNote = reviewNote;
      }
    }

    if (status === "PAID" && !updated.paidAt) {
      updated.paidAt = new Date().toISOString();
    }

    mockReimbursements[index] = updated;
    return updated;
  }
};
