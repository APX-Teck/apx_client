import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useUiStore } from '@/store/uiStore';
import {
  BarChart2,
  Users,
  ClipboardList,
  CreditCard,
  FileText,
  TrendingUp,
  CheckSquare,
  Receipt,
  Monitor,
  Layout,
  Settings,
  Layers,
  Shield,
  Key,
  Briefcase,
  MessageSquare,
  Box,
  Archive,
} from 'lucide-react';

export const NAV_GROUPS = [
  {
    title: 'OVERVIEW',
    items: [{ name: 'Dashboard', href: '/admin', icon: BarChart2, module: 'ALWAYS_SHOW' }],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { name: 'Users', href: '/admin/users', icon: Users, module: 'USER_ROLE_MANAGEMENT' },
      { name: 'Roles', href: '/admin/roles', icon: Shield, module: 'USER_ROLE_MANAGEMENT' },
      {
        name: 'Module Access',
        href: '/admin/permissions',
        icon: Key,
        module: 'USER_ROLE_MANAGEMENT',
      },
      {
        name: 'Service Requests',
        href: '/admin/requests',
        icon: ClipboardList,
        module: 'ORDER_PAYMENT_MANAGEMENT',
      },
      {
        name: 'Payments',
        href: '/admin/payments',
        icon: CreditCard,
        module: 'ORDER_PAYMENT_MANAGEMENT',
      },
      {
        name: 'Payment Analytics',
        href: '/admin/payments/analytics',
        icon: TrendingUp,
        module: 'ORDER_PAYMENT_MANAGEMENT',
      },
      {
        name: 'Company Assets',
        href: '/admin/company-assets',
        icon: Box,
        module: 'EMPLOYEE_MANAGEMENT',
      },
      {
        name: 'Company Vault',
        href: '/admin/company-vault',
        icon: Archive,
        module: 'EMPLOYEE_MANAGEMENT',
      },
      {
        name: 'Job Listings',
        href: '/admin/job-listings',
        icon: Briefcase,
        module: 'EMPLOYEE_MANAGEMENT',
      },
      {
        name: 'Job Applications',
        href: '/admin/job-applications',
        icon: FileText,
        module: 'EMPLOYEE_MANAGEMENT',
      },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      {
        name: 'Enquiries',
        href: '/admin/enquiries',
        icon: MessageSquare,
        module: 'LEADS_ACCESS_MANAGEMENT',
      },
      {
        name: 'Leads & CRM',
        href: '/admin/leads',
        icon: TrendingUp,
        module: 'LEADS_ACCESS_MANAGEMENT',
      },
      {
        name: 'Tasks',
        href: '/admin/tasks',
        icon: CheckSquare,
        module: 'TASK_NOTIFICATION_MANAGEMENT',
      },
      {
        name: 'Reimbursements',
        href: '/admin/reimbursements',
        icon: Receipt,
        module: 'ORDER_PAYMENT_MANAGEMENT',
      },
    ],
  },
  {
    title: 'MARKETING & CONTENT',
    items: [
      { name: 'Services', href: '/admin/services', icon: Layers, module: 'CONTENT_MANAGEMENT' },
      {
        name: 'Portfolio',
        href: '/admin/portfolio',
        icon: Briefcase,
        module: 'CONTENT_MANAGEMENT',
      },
      { name: 'Blog', href: '/admin/blog', icon: FileText, module: 'BLOG_MANAGEMENT' },
      {
        name: 'Blog Comments',
        href: '/admin/blog/comments',
        icon: MessageSquare,
        module: 'BLOG_MANAGEMENT',
      },
      {
        name: 'Advertisements',
        href: '/admin/ads',
        icon: Monitor,
        module: 'ADVERTISEMENT_MANAGEMENT',
      },
      { name: 'FAQ', href: '/admin/faq/faqs', icon: Layout, module: 'CONTENT_MANAGEMENT' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [{ name: 'Settings', href: '/admin/settings', icon: Settings, module: 'ALWAYS_SHOW' }],
  },
  {
    title: 'EMPLOYEE WORKSPACE',
    items: [{ name: 'Employee Portal', href: '/employee', icon: Layers, module: 'EMPLOYEE_ONLY' }],
  },
];

export const useSidebarLogic = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { isSidebarCollapsed, setSidebarCollapsed, isMobileSidebarOpen, setMobileSidebarOpen } =
    useUiStore();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      }
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarCollapsed, setMobileSidebarOpen]);

  const filteredGroups = useMemo(() => {
    return NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item: any) => {
        const isSuperAdminOrAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
        if (item.module === 'EMPLOYEE_ONLY') return !isSuperAdminOrAdmin;
        if (isSuperAdminOrAdmin) return true;
        if (item.module === 'ALWAYS_SHOW') return false;
        if (item.module && user?.permissions && user.permissions[item.module]) {
          const perm = user.permissions[item.module];
          return perm.canRead || perm.canUpdate || perm.canCreate || perm.canDelete;
        }
        return false;
      }),
    })).filter((group) => group.items.length > 0);
  }, [user]);

  return {
    pathname,
    user,
    logout,
    mounted,
    isSidebarCollapsed,
    setSidebarCollapsed,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    filteredGroups,
  };
};
