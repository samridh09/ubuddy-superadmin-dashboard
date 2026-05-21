import { AcademicClass } from '@/lib/services/academic-service';
import { Session } from '@/lib/services/session-service';
export interface Props {
    enquiryId: string;
    classMap: Record<string, AcademicClass>;
    sessionMap: Record<string, Session>;
    onClose: () => void;
    onUpdate: () => void;
}
