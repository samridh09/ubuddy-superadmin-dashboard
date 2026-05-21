import { Staff } from '@/types/staff';
export interface StaffTableProps {
    staff: Staff[];
    loading?: boolean;
    mode?: 'view' | 'edit' | 'active_inactive' | 'terminate' | 'ex_staff';
    onViewProfile: (staffId: string) => void;
    onEditProfile?: (staffId: string) => void;
    onToggleStatus?: (staff: Staff) => void;
    onTerminate?: (staff: Staff) => void;
}
