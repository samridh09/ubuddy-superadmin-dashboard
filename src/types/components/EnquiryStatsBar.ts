export interface StatItem {
    label: string;
    value: number;
    color: string;
}

export interface EnquiryStatsBarProps {
    total: number;
    pending: number;
    followUp: number;
    converted: number;
    rejected: number;
    className?: string;
}
