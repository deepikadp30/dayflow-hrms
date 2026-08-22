import { 
  LayoutDashboard, 
  Users, 
  User,
  Clock, 
  CalendarDays, 
  CreditCard, 
  Settings, 
  Building2
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['all'],
    description: 'Overview and role-personalized activity hub'
  },
  {
    id: 'directory',
    label: 'Employee Directory',
    icon: Users,
    roles: ['all'],
    description: 'Workforce list and employee details'
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: User,
    roles: ['all'],
    description: 'View and manage personal profile record'
  },
  {
    id: 'attendance',
    label: 'Attendance & Logs',
    icon: Clock,
    roles: ['all'],
    description: 'Time tracking, daily logs, and check-in history'
  },
  {
    id: 'leave',
    label: 'Leave Management',
    icon: CalendarDays,
    roles: ['all'],
    description: 'Leave requests, balances, and approval queue'
  },
  {
    id: 'payroll',
    label: 'Payroll & Compensation',
    icon: CreditCard,
    roles: ['ADMIN'],
    description: 'Salary structures, payslips, and compliance'
  },
  {
    id: 'organization',
    label: 'Organization',
    icon: Building2,
    roles: ['ADMIN'],
    description: 'Departments, designations, and team structures'
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: Settings,
    roles: ['all'],
    description: 'Account preferences and system configuration'
  }
];
