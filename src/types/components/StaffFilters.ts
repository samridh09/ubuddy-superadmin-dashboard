import { Gender, StaffType, StaffStatus } from '@/types/staff';
export interface StaffFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filterGender: Gender | '';
    onGenderChange: (value: Gender | '') => void;
    filterStaffType: StaffType | '';
    onStaffTypeChange: (value: StaffType | '') => void;
    filterStatus: StaffStatus | '';
    onStatusChange: (value: StaffStatus | '') => void;
    showStatusFilter?: boolean;
    showSearch?: boolean;
    className?: string;
}
