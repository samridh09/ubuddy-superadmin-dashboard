import { Enquiry } from '@/types/enquiry';
import { AcademicClass } from '@/lib/services/academic-service';
import React from "react";

export interface EnquiryTableProps {
    enquiries: Enquiry[];
    loading?: boolean;
    classMap: Record<string, AcademicClass>;
    onRowClick: (enquiry: Enquiry) => void;
    onStarToggle: (id: string, currentStarred: boolean, e: React.MouseEvent) => void;
    emptyMessage?: string;
    onAddNew?: () => void;
}
