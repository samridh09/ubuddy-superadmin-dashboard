import { PaginationMeta } from '@/types/pagination';
export interface PaginationBarProps {
    pagination: PaginationMeta;
    onPageChange: (page: number) => void;
}
