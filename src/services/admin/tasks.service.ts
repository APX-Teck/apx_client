export type TaskStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  assignedToId: number;
  assignedToName?: string; // Mock added for UI convenience
  createdById: number;
  createdByName?: string; // Mock added for UI convenience
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  completedAt: string | null;
  attachmentUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Initial Mock Data mimicking backend DB
let mockTasks: Task[] = [
  {
    id: 1,
    title: "Design Homepage Wireframes",
    description: "Create initial wireframes for the new E-Commerce website landing page.",
    assignedToId: 2,
    assignedToName: "Priya Design",
    createdById: 1,
    createdByName: "Admin",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    completedAt: null,
    attachmentUrl: null,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 2,
    title: "Review Server Architecture",
    description: "Review AWS server architecture for scaling before Black Friday.",
    assignedToId: 3,
    assignedToName: "Rahul Dev",
    createdById: 1,
    createdByName: "Admin",
    status: "OPEN",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    completedAt: null,
    attachmentUrl: "https://apxteck.s3.amazonaws.com/docs/architecture.pdf",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 3,
    title: "Onboard New Client - TechCorp",
    description: "Send out initial welcome emails and request API keys for the integration.",
    assignedToId: 4,
    assignedToName: "Sneha Sales",
    createdById: 1,
    createdByName: "Admin",
    status: "COMPLETED",
    priority: "HIGH",
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // Was due yesterday
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // Completed 2 days ago
    attachmentUrl: null,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 4,
    title: "Update Blog SEO Meta Tags",
    description: "Go through the latest 10 blog posts and ensure all meta tags are populated.",
    assignedToId: 5,
    assignedToName: "Amit Content",
    createdById: 1,
    createdByName: "Admin",
    status: "CANCELLED",
    priority: "LOW",
    dueDate: null,
    completedAt: null,
    attachmentUrl: null,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const tasksService = {
  getTasks: async (): Promise<Task[]> => {
    await delay(600);
    return [...mockTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getTaskById: async (id: number): Promise<Task | null> => {
    await delay(400);
    const task = mockTasks.find((t) => t.id === id);
    return task ? { ...task } : null;
  },

  updateTaskStatus: async (id: number, status: TaskStatus): Promise<Task> => {
    await delay(500);
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");

    const updatedTask = { 
      ...mockTasks[index], 
      status, 
      updatedAt: new Date().toISOString() 
    };

    if (status === "COMPLETED" && !updatedTask.completedAt) {
      updatedTask.completedAt = new Date().toISOString();
    }

    mockTasks[index] = updatedTask;
    return updatedTask;
  },

  updateTaskPriority: async (id: number, priority: Priority): Promise<Task> => {
    await delay(500);
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");

    const updatedTask = { 
      ...mockTasks[index], 
      priority, 
      updatedAt: new Date().toISOString() 
    };

    mockTasks[index] = updatedTask;
    return updatedTask;
  },

  deleteTask: async (id: number): Promise<{ success: boolean }> => {
    await delay(600);
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");

    mockTasks = mockTasks.filter(t => t.id !== id);
    return { success: true };
  }
};
