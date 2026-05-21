import { 
  LayoutDashboard, ClipboardList, UserPlus, Briefcase, 
  CalendarDays, CreditCard, Award, DollarSign, 
  Truck, Shield, Building2, Bell, Mail, Image, 
  ClipboardCheck, BookOpen, Clock, TrendingUp, Settings 
} from 'lucide-react';
import { DashboardModule } from '../services/dashboard-service';

const UD = '/dashboard/schooladmin/under-development';

export const SCHOOL_ADMIN_MODULES: Record<string, DashboardModule> = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'School dashboard overview',
    icon: 'LayoutDashboard',
    route: '/dashboard/schooladmin',
    permissions: ['READ'],
    hasAccess: false,
    group: 'core',
  },

  'student-inquiry': {
    id: 'student-inquiry',
    name: 'Student Inquiry',
    description: 'Manage student inquiries',
    icon: 'ClipboardList',
    route: '/dashboard/schooladmin/student-enquiries',
    permissions: ['READ', 'WRITE'],
    hasAccess: false,
    group: 'communication',
  },

  student: {
    id: 'student',
    name: 'Student',
    description: 'Manage students',
    icon: 'UserPlus',
    route: '/wireframe/ui/student',
    permissions: ['READ', 'WRITE', 'UPDATE', 'DELETE'],
    hasAccess: false,
    group: 'students',
  },

  staff: {
    id: 'staff',
    name: 'Staff',
    description: 'Manage staff members',
    icon: 'Briefcase',
    route: '/wireframe/ui/staff',
    permissions: ['READ', 'WRITE', 'UPDATE', 'DELETE'],
    hasAccess: false,
    group: 'staff',
  },

  'exam-time-table': {
    id: 'exam-time-table',
    name: 'Exam Time Table',
    description: 'Manage exam timetables',
    icon: 'CalendarDays',
    route: '/wireframe/ui/timetable',
    permissions: ['READ', 'WRITE', 'UPDATE'],
    hasAccess: false,
    group: 'academics',
  },

  'admin-card': {
    id: 'admin-card',
    name: 'Admin Card',
    description: 'Manage admin cards',
    icon: 'CreditCard',
    route: UD,
    permissions: ['READ', 'WRITE'],
    hasAccess: false,
    group: 'academics',
  },

  result: {
    id: 'result',
    name: 'Result',
    description: 'Manage results',
    icon: 'Award',
    route: '/dashboard/schooladmin/result',
    permissions: ['READ', 'WRITE', 'EXPORT'],
    hasAccess: false,
    group: 'academics',
  },

  fee: {
    id: 'fee',
    name: 'Fee',
    description: 'Manage fee collection',
    icon: 'DollarSign',
    route: UD,
    permissions: ['READ', 'WRITE', 'UPDATE', 'EXPORT'],
    hasAccess: false,
    group: 'finance',
  },

  transportation: {
    id: 'transportation',
    name: 'Transportation',
    description: 'Manage transportation',
    icon: 'Truck',
    route: UD,
    permissions: ['READ', 'WRITE', 'UPDATE'],
    hasAccess: false,
    group: 'operations',
  },

  'staff-permission': {
    id: 'staff-permission',
    name: 'Staff Permission',
    description: 'Manage staff permissions',
    icon: 'Shield',
    route: UD,
    permissions: ['READ', 'WRITE', 'UPDATE'],
    hasAccess: false,
    group: 'staff',

    subModules: [
      {
        id: 'staff-permission-result',
        name: 'Result',
        description: 'Staff permission for results',
        icon: 'Award',
        route: '/wireframe/ui/result',
        permissions: ['READ', 'WRITE'],
        hasAccess: false,
      },

      {
        id: 'student-pic',
        name: 'Student Pic',
        description: 'Staff permission for student pictures',
        icon: 'Image',
        route: '/wireframe/ui/student-pic',
        permissions: ['READ', 'WRITE'],
        hasAccess: false,
      },

      {
        id: 'staff-student-inquiry',
        name: 'Student Inquiry',
        description: 'Staff permission for student inquiries',
        icon: 'Mail',
        route: '/wireframe/ui/student-enquiry',
        permissions: ['READ', 'WRITE'],
        hasAccess: false,
      },

      {
        id: 'staff-attendance',
        name: 'Attendance',
        description: 'Staff permission for attendance',
        icon: 'ClipboardCheck',
        route: '/wireframe/ui/attendance',
        permissions: ['READ', 'WRITE'],
        hasAccess: false,
      },

      {
        id: 'staff-homework',
        name: 'Homework',
        description: 'Staff permission for homework',
        icon: 'BookOpen',
        route: '/wireframe/ui/homework',
        permissions: ['READ', 'WRITE'],
        hasAccess: false,
      },
    ],
  },

  'sub-admin': {
    id: 'sub-admin',
    name: 'Sub Admin',
    description: 'Manage sub-admins',
    icon: 'Building2',
    route: '/dashboard/schooladmin/sub-admin',
    permissions: ['READ', 'WRITE', 'UPDATE', 'DELETE'],
    hasAccess: false,
    group: 'staff',
  },

  notifications: {
    id: 'notifications',
    name: 'Notifications',
    description: 'Manage notifications',
    icon: 'Bell',
    route: UD,
    permissions: ['READ', 'WRITE'],
    hasAccess: false,
    group: 'communication',
  },

  certificates: {
    id: 'certificates',
    name: 'Certificates',
    description: 'Manage certificates',
    icon: 'Award',
    route: UD,
    permissions: ['READ', 'WRITE'],
    hasAccess: false,
    group: 'academics',
  },

  'staff-enquiry': {
    id: 'staff-enquiry',
    name: 'Staff Enquiry',
    description: 'Manage staff enquiries',
    icon: 'Mail',
    route: UD,
    permissions: ['READ', 'WRITE'],
    hasAccess: false,
    group: 'communication',
  },

  'annual-calendar': {
    id: 'annual-calendar',
    name: 'Annual Calendar',
    description: 'Manage annual calendar',
    icon: 'CalendarDays',
    route: UD,
    permissions: ['READ', 'WRITE'],
    hasAccess: false,
    group: 'academics',
  },

  attendance: {
    id: 'attendance',
    name: 'Attendance',
    description: 'Manage attendance',
    icon: 'ClipboardCheck',
    route: '/dashboard/schooladmin/attendance',
    permissions: ['READ', 'WRITE', 'EXPORT'],
    hasAccess: false,
    group: 'academics',
  },

  syllabus: {
    id: 'syllabus',
    name: 'Syllabus',
    description: 'Manage syllabus',
    icon: 'List',
    route: UD,
    permissions: ['READ', 'WRITE'],
    hasAccess: false,
    group: 'academics',
  },

  homework: {
    id: 'homework',
    name: 'Homework',
    description: 'Manage homework',
    icon: 'BookOpen',
    route: UD,
    permissions: ['READ', 'WRITE'],
    hasAccess: false,
    group: 'academics',
  },

  'daily-schedule': {
    id: 'daily-schedule',
    name: 'Daily Schedule',
    description: 'Manage daily schedule',
    icon: 'Clock',
    route: UD,
    permissions: ['READ', 'WRITE'],
    hasAccess: false,
    group: 'academics',
  },

  'course-progress': {
    id: 'course-progress',
    name: 'Course Progress',
    description: 'View course progress',
    icon: 'TrendingUp',
    route: UD,
    permissions: ['READ', 'EXPORT'],
    hasAccess: false,
    group: 'academics',
  },

  settings: {
    id: 'settings',
    name: 'Settings',
    description: 'Manage school settings',
    icon: 'Settings',
    route: UD,
    permissions: ['READ', 'WRITE', 'UPDATE'],
    hasAccess: false,
    group: 'operations',
  },
};
