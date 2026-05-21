import React from "react";

export interface IconWrapperProps {
    icon: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}
