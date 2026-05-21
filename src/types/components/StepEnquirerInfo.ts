import { CreateEnquiryPayload } from '@/types/enquiry';
type DuplicateCheckResult = any;
export interface StepEnquirerInfoProps {
    formData: CreateEnquiryPayload;
    fieldErrors: Record<string, string>;
    contactDisplay: string;
    altContactDisplay: string;
    enquirerNameLocked: boolean;
    duplicateResult: DuplicateCheckResult | null;
    duplicateDismissed: boolean;
    onDuplicateDismiss: () => void;
    onEnquirerChange: (field: 'name' | 'relation' | 'contact_number' | 'alternate_contact_number', value: string) => void;
    onInputChange: (field: keyof CreateEnquiryPayload, value: string) => void;
    inputClass: (field: string) => string;
    labelClass: string;
}
