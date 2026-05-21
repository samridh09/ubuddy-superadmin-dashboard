import React from 'react';
import { IconWrapperProps } from "@/types/components/IconWrapper";

export const IconWrapper: React.FC<IconWrapperProps> = ({
    icon,
    variant = 'primary',
    size = 'md',
    className = ''
}) => {

    const variantClasses = {
        primary: 'bg-blue-50 text-blue-600',
        success: 'bg-emerald-50 text-emerald-500',
        warning: 'bg-orange-50 text-orange-500',
        error: 'bg-red-50 text-red-500',
        info: 'bg-sky-50 text-sky-500',
        purple: 'bg-violet-50 text-violet-500',
    };

    const sizeClasses = {
        sm: 'h-8 w-8 text-sm rounded-lg',
        md: 'h-10 w-10 text-[18px] rounded-[10px]',
        lg: 'h-12 w-12 text-2xl rounded-xl',
    };

    return (
        <div className={`flex items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
            {icon}
        </div>
    );
};
