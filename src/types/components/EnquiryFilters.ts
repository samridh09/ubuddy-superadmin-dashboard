import { EnquiryStatus } from '@/types/enquiry';
export interface EnquiryFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    activeTab: StatusTab;
    onTabChange: (tab: StatusTab) => void;
    showStarredOnly: boolean;
    onStarredToggle: () => void;
    starredCount: number;
    className?: string;
}

export type StatusTab = 'ALL' | EnquiryStatus | 'ARCHIVED';
