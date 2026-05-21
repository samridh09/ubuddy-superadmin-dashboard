export interface StepBasicInfoProps {
    formSelects: {
        gender: string;
        maritalStatus: string;
        staffType: string;
        };
    onSelectChange: (key: string, value: string) => void;
    isEditMode: boolean;
    dateValues?: { dob: string; dateOfJoining: string };
    onDateChange?: (key: 'dob' | 'dateOfJoining', value: string) => void;
}
