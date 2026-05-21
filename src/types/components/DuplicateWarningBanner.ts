export interface DuplicateMatch {
    id: string;
    student_name: string;
    contact_number: string;
    class_id: string;
    status: string;
    created_at: string;
}

export interface Props {
    matches: DuplicateMatch[];
    onDismiss: () => void;
    onViewExisting?: (id: string) => void;
}
