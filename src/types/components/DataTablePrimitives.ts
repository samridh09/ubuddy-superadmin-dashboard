import React from "react";

export interface ThProps {
    children?: React.ReactNode;
    sortKey?: string;
    onSort?: (key: string) => void;
    align?: 'left' | 'center' | 'right';
    width?: string;
    className?: string;
    isFirst?: boolean;
}

export interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
    isFirst?: boolean;
}
