export type LeadStatus = "NEW" | "CONTACTED" | "INTERESTED" | "NEGOTIATING" | "CONVERTED" | "LOST";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface LeadFollowUp {
  id: number;
  leadId: number;
  doneById: number;
  doneByName?: string; // Additional field for UI convenience
  note: string;
  followedAt: string;
  nextFollowUpAt?: string | null;
}

export interface Lead {
  id: number;
  fullName: string;
  email: string | null;
  phone: string;
  businessName: string | null;
  serviceInterest: string | null;
  status: LeadStatus;
  priority: Priority;
  assignedToId: number | null;
  assignedToName?: string; // Additional field for UI convenience
  source: string | null;
  notes: string | null;
  nextFollowUpAt: string | null;
  convertedAt: string | null;
  createdAt: string;
  updatedAt: string;
  followUps?: LeadFollowUp[];
}

// Initial Mock Data mimicking backend DB
let mockLeads: Lead[] = [
  {
    id: 1,
    fullName: "Amit Sharma",
    email: "amit.sharma@example.com",
    phone: "+91 9876543210",
    businessName: "Sharma Enterprises",
    serviceInterest: "E-Commerce Development",
    status: "NEW",
    priority: "HIGH",
    assignedToId: null,
    source: "website",
    notes: "Interested in a multivendor ecommerce platform.",
    nextFollowUpAt: null,
    convertedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    followUps: []
  },
  {
    id: 2,
    fullName: "Priya Singh",
    email: "priya.design@studio.com",
    phone: "+91 8765432109",
    businessName: "Studio Priya",
    serviceInterest: "UI/UX Design",
    status: "INTERESTED",
    priority: "MEDIUM",
    assignedToId: 1,
    assignedToName: "Amol Patil",
    source: "instagram",
    notes: "Wants a portfolio website redesign.",
    nextFollowUpAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    convertedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    followUps: [
      {
        id: 101,
        leadId: 2,
        doneById: 1,
        doneByName: "Amol Patil",
        note: "Had an initial discovery call. She liked our previous work.",
        followedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        nextFollowUpAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 102,
        leadId: 2,
        doneById: 1,
        doneByName: "Amol Patil",
        note: "Sent the proposal. Waiting for response.",
        followedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        nextFollowUpAt: new Date(Date.now() + 86400000 * 2).toISOString()
      }
    ]
  },
  {
    id: 3,
    fullName: "Rahul Desai",
    email: "rahul.desai@techcorp.in",
    phone: "+91 7654321098",
    businessName: "TechCorp Solutions",
    serviceInterest: "Custom Web App",
    status: "CONVERTED",
    priority: "HIGH",
    assignedToId: 1,
    assignedToName: "Amol Patil",
    source: "google",
    notes: "Requires an internal ERP system.",
    nextFollowUpAt: null,
    convertedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    followUps: [
      {
        id: 103,
        leadId: 3,
        doneById: 1,
        doneByName: "Amol Patil",
        note: "Contract signed and advance payment received.",
        followedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        nextFollowUpAt: null
      }
    ]
  },
  {
    id: 4,
    fullName: "Sneha Patil",
    email: null,
    phone: "+91 6543210987",
    businessName: null,
    serviceInterest: "SEO Optimization",
    status: "CONTACTED",
    priority: "LOW",
    assignedToId: null,
    source: "direct",
    notes: "Called regarding SEO pricing.",
    nextFollowUpAt: new Date(Date.now() + 86400000 * 1).toISOString(),
    convertedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    followUps: []
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const leadsService = {
  getLeads: async (): Promise<Lead[]> => {
    await delay(600);
    return [...mockLeads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getLeadById: async (id: number): Promise<Lead | null> => {
    await delay(400);
    const lead = mockLeads.find((l) => l.id === id);
    return lead ? { ...lead } : null;
  },

  updateLeadStatus: async (id: number, status: LeadStatus): Promise<Lead> => {
    await delay(500);
    const index = mockLeads.findIndex((l) => l.id === id);
    if (index === -1) throw new Error("Lead not found");

    const updatedLead = { 
      ...mockLeads[index], 
      status, 
      updatedAt: new Date().toISOString() 
    };

    if (status === "CONVERTED" && !updatedLead.convertedAt) {
      updatedLead.convertedAt = new Date().toISOString();
    }

    mockLeads[index] = updatedLead;
    return updatedLead;
  },

  updateLeadPriority: async (id: number, priority: Priority): Promise<Lead> => {
    await delay(500);
    const index = mockLeads.findIndex((l) => l.id === id);
    if (index === -1) throw new Error("Lead not found");

    const updatedLead = { 
      ...mockLeads[index], 
      priority, 
      updatedAt: new Date().toISOString() 
    };

    mockLeads[index] = updatedLead;
    return updatedLead;
  },

  addFollowUp: async (leadId: number, note: string, nextFollowUpAt?: string | null): Promise<Lead> => {
    await delay(600);
    const index = mockLeads.findIndex((l) => l.id === leadId);
    if (index === -1) throw new Error("Lead not found");

    const newFollowUp: LeadFollowUp = {
      id: Math.floor(Math.random() * 10000),
      leadId,
      doneById: 1, // Mock Admin ID
      doneByName: "Admin User", // Mock Admin Name
      note,
      followedAt: new Date().toISOString(),
      nextFollowUpAt
    };

    const currentFollowUps = mockLeads[index].followUps || [];
    
    const updatedLead = {
      ...mockLeads[index],
      nextFollowUpAt: nextFollowUpAt || null,
      updatedAt: new Date().toISOString(),
      followUps: [newFollowUp, ...currentFollowUps]
    };

    mockLeads[index] = updatedLead;
    return updatedLead;
  }
};
