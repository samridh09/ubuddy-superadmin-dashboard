import React from "react";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    id?: string;
    sortable?: boolean;
    sortFn?: (a: T, b: T) => number;
    cell?: (row: T) => React.ReactNode;
    className?: string;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
}
