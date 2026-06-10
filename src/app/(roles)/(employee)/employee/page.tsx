'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckSquare, 
  Receipt, 
  ClipboardList, 
  Send,
  CheckCircle2
} from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
}

interface ReimbursementItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  createdAt: string;
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [reimbursements, setReimbursements] = useState<ReimbursementItem[]>([]);

  // Reimbursement Form State
  const [claimTitle, setClaimTitle] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimCategory, setClaimCategory] = useState('Travel');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Populate mock employee-specific details
    setTasks([
      {
        id: 'TSK-201',
        title: 'Revamp website landing page animations',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        dueDate: '2026-06-12',
      },
      {
        id: 'TSK-202',
        title: 'Set up ad slots and track click-through metrics',
        priority: 'MEDIUM',
        status: 'OPEN',
        dueDate: '2026-06-15',
      },
      {
        id: 'TSK-198',
        title: 'Optimize Tailwind/NextJS image loading performance',
        priority: 'LOW',
        status: 'COMPLETED',
        dueDate: '2026-06-08',
      },
    ]);

    setReimbursements([
      {
        id: 'RMB-501',
        title: 'B2B Client Lunch with TechFlow Solutions',
        amount: 2800,
        category: 'Meals & Entertainment',
        status: 'APPROVED',
        createdAt: '2026-06-03',
      },
      {
        id: 'RMB-498',
        title: 'AWS Hosting & Server Credits',
        amount: 8500,
        category: 'Software/SaaS',
        status: 'PENDING',
        createdAt: '2026-05-28',
      },
    ]);
  }, []);

  const handleApplyReimbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTitle || !claimAmount) return;

    setIsSubmittingClaim(true);
    setClaimSuccess(false);

    // Simulate API call
    setTimeout(() => {
      const newClaim: ReimbursementItem = {
        id: `RMB-${Math.floor(100 + Math.random() * 900)}`,
        title: claimTitle,
        amount: parseFloat(claimAmount),
        category: claimCategory,
        status: 'PENDING',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setReimbursements([newClaim, ...reimbursements]);
      setClaimTitle('');
      setClaimAmount('');
      setIsSubmittingClaim(false);
      setClaimSuccess(true);

      setTimeout(() => setClaimSuccess(false), 3000);
    }, 800);
  };

  const getStatusBadge = (status: ReimbursementItem['status']) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/10 text-amber-400">Pending</span>;
      case 'APPROVED':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-500/10 text-blue-400">Approved</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500/10 text-red-400">Rejected</span>;
      case 'PAID':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/10 text-emerald-400">Paid</span>;
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Welcome Banner */}
        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-white/5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2 text-indigo-500 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>Internal Employee Workspace</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Welcome back, {user?.fullName || 'Teammate'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl leading-relaxed">
              Stay updated with your assigned development tasks, manage your project reimbursements, or request updates from administrative managers.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">My Active Tasks</p>
              <h3 className="text-3xl font-black mt-2 text-indigo-500">
                {tasks.filter((t) => t.status !== 'COMPLETED').length}
              </h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <CheckSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Pending Claims</p>
              <h3 className="text-3xl font-black mt-2 text-amber-500">
                {reimbursements.filter((r) => r.status === 'PENDING').length}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <Receipt className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Assigned Requests</p>
              <h3 className="text-3xl font-black mt-2 text-purple-500">4</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Task Tracker & Reimbursement Claims */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Checklist */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Assigned Checklist</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium font-mono">3 Tasks Listed</span>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#1a1a1a] hover:border-indigo-500/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'COMPLETED'}
                      readOnly
                      className="rounded border-gray-300 dark:border-white/20 text-indigo-500 focus:ring-indigo-500 w-4 h-4 cursor-pointer bg-white dark:bg-[#111]"
                    />
                    <div className="space-y-0.5">
                      <p className={`font-semibold text-sm ${task.status === 'COMPLETED' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-mono font-bold text-indigo-500 dark:text-indigo-400">{task.id}</span>
                        <span>•</span>
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    task.priority === 'HIGH' ? 'bg-red-500/10 text-red-500 dark:text-red-400' :
                    task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400' :
                    'bg-gray-500/10 text-gray-500 dark:text-gray-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reimbursement Claim Form */}
          <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="border-b border-gray-100 dark:border-white/10 pb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Claim Reimbursement</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Submit expenditures for review</p>
            </div>

            <form onSubmit={handleApplyReimbursement} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title / Item Description</label>
                <input
                  type="text"
                  value={claimTitle}
                  onChange={(e) => setClaimTitle(e.target.value)}
                  placeholder="e.g. Hostinger Web Server Renewal"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-medium text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount (INR)</label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-medium text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</label>
                  <select
                    value={claimCategory}
                    onChange={(e) => setClaimCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-medium cursor-pointer text-gray-900 dark:text-white"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Meals & Entertainment">Meals & Ent.</option>
                    <option value="Software/SaaS">Software/SaaS</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingClaim}
                className="w-full h-11 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] active:scale-[0.98] transition-all disabled:opacity-75 disabled:active:scale-100 cursor-pointer"
              >
                {isSubmittingClaim ? 'Submitting...' : 'Submit Claim Request'}
                <Send className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {claimSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="p-3 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                    <span>Claim submitted successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Past Claims Table */}
        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reimbursement History</h3>
          <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Claim ID</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm font-medium">
                {reimbursements.map((rmb) => (
                  <tr key={rmb.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group">
                    <td className="py-4 px-4 font-mono text-indigo-500 dark:text-indigo-400 font-bold">{rmb.id}</td>
                    <td className="py-4 px-4 text-gray-900 dark:text-gray-200">{rmb.title}</td>
                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">₹{rmb.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{rmb.category}</td>
                    <td className="py-4 px-4">{getStatusBadge(rmb.status)}</td>
                    <td className="py-4 px-4 text-right text-gray-500 dark:text-gray-400 font-mono text-xs">{rmb.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
