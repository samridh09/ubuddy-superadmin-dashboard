import {
  Users,
  GraduationCap,
  Clock,
  ClipboardCheck,
  ClipboardList,
  Shield,
  Building2,
  BookOpen,
  CalendarDays,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/types/user';

export interface ModuleConfig {
  /** Module key matching backend module_permissions key */
  key: string;
  /** Display label */
  label: string;
  /** Short description for quick-action cards */
  description: string;
  /** Route path under /dashboard/schooladmin/ */
  route: string;
  /** Lucide icon component */
  icon: LucideIcon;
}

/**
 * All available modules in the system.
 * The `key` must match the backend `module_permissions` keys exactly.
 */
export const MODULE_CONFIG: ModuleConfig[] = [
  { key: 'attendance', label: 'Attendance', description: 'Track student attendance', route: 'attendance', icon: ClipboardCheck },
  { key: 'classes', label: 'Classes', description: 'Manage classes', route: 'classes', icon: Users },
  { key: 'sessions', label: 'Sessions', description: 'Manage academic sessions', route: 'sessions', icon: Clock },
  { key: 'subjects', label: 'Subjects', description: 'Manage subjects', route: 'subjects', icon: BookOpen },
  { key: 'timetable', label: 'Timetable', description: 'Manage class timetables', route: 'timetable', icon: CalendarDays },
  { key: 'students', label: 'Students', description: 'Manage students', route: 'students', icon: GraduationCap },
  { key: 'enquiries', label: 'Enquiries', description: 'Manage admission enquiries', route: 'student-enquiries', icon: ClipboardList },
  { key: 'user-management', label: 'Staff Management', description: 'Manage staff and users', route: 'staff', icon: Shield },
  { key: 'schools', label: 'School Admin', description: 'Manage school records', route: 'school-admins', icon: Building2 },
];

/**
 * Role-only features (not tied to module_permissions).
 * These are gated purely by the user's role.
 */
export interface RoleFeatureConfig {
  label: string;
  description: string;
  route: string;
  icon: LucideIcon;
  /** Roles allowed to access this feature */
  allowedRoles: UserRole[];
}

export const ROLE_FEATURES: RoleFeatureConfig[] = [
  {
    label: 'School Admins',
    description: 'Manage school admin accounts',
    route: 'school-admins',
    icon: Shield,
    allowedRoles: ['SCHOOL_ADMIN'],
  },
];

/**
 * Get full route for a module/feature based on user role
 */
export function getFullRoute(configRoute: string, _role?: string): string {
  return `/dashboard/schooladmin/${configRoute}`;
}

/**
 * Get the module config for a given route path.
 */
export function getModuleForRoute(pathname: string): ModuleConfig | undefined {
  // Extract the part after role prefix
  const parts = pathname.split('/');
  if (parts.length < 4) return undefined;
  const target = parts[3];
  return MODULE_CONFIG.find((m) => m.route === target);
}
