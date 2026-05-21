import { ColumnDef } from '@tanstack/react-table';
import React from "react";

export interface CapacityBadgeProps {
    label?: string;
    used: number;
    total: number;
}

export interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
}

export interface DropdownMenuItemProps {
    onClick?: () => void;
    active?: boolean;
    uppercase?: boolean;
    children: React.ReactNode;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    total?: number;
    hasMore?: boolean;
    onPageChange: (page: number) => void;
    className?: string;
}
