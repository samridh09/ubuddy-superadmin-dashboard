import type React from 'react';
import type { ModuleAssignment, SchoolProfileViewData, SchoolSession } from './school';
import type { SubAdminEditPermissionEntry, HistoryEntry } from './sub-admin';
import type { StudentExportField } from '../mock/student.mock';

export interface CustomSelectProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  isSmall?: boolean;
  disabled?: boolean;
}

export interface AttendanceViewProps {
  query: string;
  updateFilters: (key: string, value: string) => void;
  isAssigning: boolean;
  setIsAssigning: (val: boolean) => void;
  handleAssignClick: () => void;
  filteredData: any[];
  handleSort: (key: string) => void;
  SortIcon: ({ columnKey }: { columnKey: string }) => React.JSX.Element;
  staffList: string[];
  updateStaffMock: (id: number, val: string) => void;
  page: number;
  limit: number;
}

export interface HomeworkViewProps {
  className: string;
  section: string;
  query: string;
  updateFilters: (key: string, value: string) => void;
  isAssigning: boolean;
  setIsAssigning: (val: boolean) => void;
  handleAssignClick: () => void;
  filteredData: any[];
  handleSort: (key: string) => void;
  SortIcon: ({ columnKey }: { columnKey: string }) => React.JSX.Element;
  staffList: string[];
  updateStaffMock: (id: number, val: string) => void;
  page: number;
  limit: number;
}

export interface ResultViewProps {
  term: string;
  className: string;
  section: string;
  query: string;
  updateFilters: (key: string, value: string) => void;
  isAssigning: boolean;
  setIsAssigning: (val: boolean) => void;
  filteredData: any[];
  handleSort: (key: string) => void;
  SortIcon: ({ columnKey }: { columnKey: string }) => React.JSX.Element;
  staffList: string[];
  updateStaffMock: (id: number, val: string) => void;
  handleCancel?: () => void;
  page: number;
  limit: number;
}

export interface StudentEnquiryViewProps {
  query: string;
  updateFilters: (key: string, value: string) => void;
  statusFilter: string;
  filteredData: any[];
  handleSort: (key: string) => void;
  SortIcon: ({ columnKey }: { columnKey: string }) => React.JSX.Element;
  toggleStatus: (id: number) => void;
  handleSave: () => void;
  handleCancel: () => void;
  hasChanges: boolean;
  page: number;
  limit: number;
}

export interface StudentPicViewProps {
  query: string;
  updateFilters: (key: string, value: string) => void;
  isAssigning: boolean;
  setIsAssigning: (val: boolean) => void;
  handleAssignClick: () => void;
  filteredData: any[];
  handleSort: (key: string) => void;
  SortIcon: ({ columnKey }: { columnKey: string }) => React.JSX.Element;
  staffList: string[];
  updateStaffMock: (id: number, val: string) => void;
}

export interface ExSubAdminViewProps {
  query: string;
  updateFilters: (key: string, value: string) => void;
  data: any[];
  handleSort: (key: string) => void;
  SortIcon: ({ columnKey }: { columnKey: string }) => React.JSX.Element;
}

export interface StudentExportModalProps {
  isOpen: boolean;
  isExiting: boolean;
  selectedFields: Record<string, boolean>;
  isExporting: boolean;
  onClose: () => void;
  onExport: (format: 'print' | 'pdf' | 'excel') => void;
  onFieldToggle: (id: string, checked: boolean) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export interface StudentViewProps {
  query: string;
  statusFilter: string;
  page: number;
  limit: number;
  updateFilters: (key: string, value: string) => void;
  handleSort: (key: string) => void;
  SortIcon: ({ columnKey }: { columnKey: string }) => React.JSX.Element;
}

export interface SchoolAssignResultTypeViewProps {
  schoolName: string;
  schoolId: string;
  sessionId: string;
}

export interface SchoolBasicConfigViewProps {
  schoolName: string;
  sessionYear: string;
  schoolId: string;
  sessionId: string;
}

export interface SchoolClassSectionViewProps {
  schoolName: string;
  sessionYear: string;
  schoolId: string;
  sessionId: string;
}

export interface SchoolSubjectViewProps {
  schoolName: string;
  sessionYear: string;
  schoolId: string;
  sessionId: string;
}

export interface SchoolTermsViewProps {
  schoolName: string;
  sessionYear: string;
  schoolId: string;
  sessionId: string;
}

export interface SchoolResultConfigViewProps {
  schoolName: string;
  schoolId: string;
  sessionId: string;
  sessionYear?: string;
}

export interface SchoolModuleConfigListViewProps {
  schoolName: string;
  schoolId: string;
  sessionId: string;
  sessionYear?: string;
}

export interface SchoolAssignModuleViewProps {
  schoolName: string;
  initialData: ModuleAssignment[];
  schoolId: string;
  onSave: (assignedKeys: string[]) => Promise<void>;
}

export interface SchoolMarkingPatternViewProps {
  schoolName: string;
  schoolId: string;
  sessionId: string;
}

export interface SchoolGradeConfigViewProps {
  schoolName: string;
  schoolId: string;
  sessionId: string;
  sessionYear?: string;
}

export interface SchoolManageSessionsViewProps {
  schoolName: string;
  initialSessions: SchoolSession[];
  schoolId?: string;
}

export interface SchoolViewProfileProps {
  data: SchoolProfileViewData;
}

export interface SubAdminEditPermissionsViewProps {
  adminName: string;
  initialData: SubAdminEditPermissionEntry[];
  adminId?: string;
  schoolId?: string;
}

export interface SubAdminHistoryViewProps {
  adminName?: string;
  entries: HistoryEntry[];
}

export interface SubAdminPermissionsViewProps {
  adminName: string;
  initialData: { module: string; permissions: { add: boolean; edit: boolean; delete: boolean; export: boolean } }[];
  adminId?: string;
}

export interface SubAdminViewProps {
  query: string;
  statusFilter: string;
  updateFilters: (key: string, value: string) => void;
  handleSort: (key: string) => void;
  SortIcon: ({ columnKey }: { columnKey: string }) => React.JSX.Element;
}

export interface TimeTableViewProps {
  term: string;
  updateFilters: (key: string, value: string) => void;
  filteredData: any[];
  handleSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  page: number;
  limit: number;
}

export interface TimeTableEditViewProps {
  onBack: () => void;
}

export interface TimeTableFullViewProps {
  onBack: () => void;
  onEdit: () => void;
}

export interface TimeTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    className: string;
    term: string;
    session: string;
    details: { id: number; date: string; subjects: string[] }[];
  } | null;
  onPrevClass: () => void;
  onNextClass: () => void;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional back button — calls router.back() or onBack() */
  showBack?: boolean;
  onBack?: () => void;
  /** Slot for buttons / badges to the right of the title */
  actions?: React.ReactNode;
}

export interface SearchInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  /** Width wrapper class, e.g. "w-[340px]" or "flex-1 min-w-[200px]" */
  width?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export interface StatusBadgeProps {
  status: string;
  /** Map of status string → color class for dot (bg-*) and text (text-*) */
  colorMap?: Record<string, { dot: string; text: string }>;
}

export interface AssignedStaffCellProps {
  staffName: string;
  unassignedLabel?: string;
}

export interface SectionHeadingProps {
  icon?: React.ReactNode;
  title: string;
}

export type StudentViewMode = 'directory' | 'assign_section' | 'assign_roll' | 'assign_subjects' | 'active_inactive' | 'edit' | 'promote' | 'terminate' | 'ex';
