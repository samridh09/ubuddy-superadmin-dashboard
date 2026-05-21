import { CreateEnquiryPayload } from '@/types/enquiry';
import { AcademicClass } from '@/lib/services/academic-service';
import { Session } from '@/lib/services/session-service';
export interface StepStudentInfoProps {
    formData: CreateEnquiryPayload;
    fieldErrors: Record<string, string>;
    classes: AcademicClass[];
    sessions: Session[];
    onInputChange: (field: keyof CreateEnquiryPayload, value: string) => void;
    onSessionChange: (sessionId: string) => void;
    inputClass: (field: string) => string;
    labelClass: string;
}
