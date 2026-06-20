import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { dashboardService } from '@/services/admin/dashboard.service';
import { reimbursementsService } from '@/services/admin/reimbursements.service';

export interface TaskItem {
  id: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
}

export interface ReimbursementItem {
  id: string | number;
  title: string;
  amount: number;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  createdAt: string;
}

export const useDashboardLogic = (
  initialTasks: TaskItem[],
  initialReimbursements: ReimbursementItem[],
  initialAssignedRequests: number
) => {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [reimbursements, setReimbursements] = useState<ReimbursementItem[]>(initialReimbursements);
  const [assignedRequests, setAssignedRequests] = useState<number>(initialAssignedRequests);

  // Fetch from client side if SSR failed
  useEffect(() => {
    if (!initialTasks.length && !initialReimbursements.length && initialAssignedRequests === 0) {
      const fetchStats = async () => {
        try {
          const stats = await dashboardService.getEmployeeStats();
          if (stats) {
            setTasks(stats.tasks || []);
            setReimbursements(stats.reimbursements || []);
            setAssignedRequests(stats.assignedRequestsCount || 0);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard stats", error);
        }
      };
      fetchStats();
    }
  }, [initialTasks, initialReimbursements, initialAssignedRequests]);

  // Reimbursement Form State
  const [claimTitle, setClaimTitle] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimCategory, setClaimCategory] = useState('Travel');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const handleApplyReimbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTitle || !claimAmount) return;

    setIsSubmittingClaim(true);
    setClaimSuccess(false);

    try {
      // Assuming no file upload for now, just sending json
      const newClaim = await reimbursementsService.createReimbursement({
        title: claimTitle,
        amount: parseFloat(claimAmount),
        category: claimCategory,
      });

      if (newClaim) {
        setReimbursements([newClaim as any, ...reimbursements]);
        setClaimTitle('');
        setClaimAmount('');
        setClaimCategory('Travel');
        setClaimSuccess(true);
        toast.success('Reimbursement claimed successfully');
        setTimeout(() => setClaimSuccess(false), 3000);
      }
    } catch (error) {
      toast.error('Failed to submit reimbursement claim');
      console.error(error);
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  return {
    tasks,
    reimbursements,
    assignedRequests,
    claimTitle,
    setClaimTitle,
    claimAmount,
    setClaimAmount,
    claimCategory,
    setClaimCategory,
    isSubmittingClaim,
    claimSuccess,
    handleApplyReimbursement,
  };
};

