import { UserRole } from '@/types/user';
import React from "react";

export interface RequirePermissionProps {
    /** Module name the user must have access to */
    module?: string;
    /** Specific action required (defaults to "READ") */
    action?: 'READ' | 'WRITE' | 'UPDATE' | 'MANAGE' | 'EXPORT';
    /** Alternatively, gate by role(s) */
    roles?: UserRole[];
    children: React.ReactNode;
}
