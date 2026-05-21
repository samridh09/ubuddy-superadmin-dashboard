import { Staff } from '@/types/staff';
export interface StaffProfileViewProps {
    staff: Staff;
    selectedFields: Record<string, boolean>;
    onBack: () => void;
    onEdit?: () => void;
    onLastUpdate?: () => void;
}
