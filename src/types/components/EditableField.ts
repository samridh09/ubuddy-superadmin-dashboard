export interface EditableFieldProps {
    label: string;
    value: string;
    onSave?: (val: string) => void;
    rows?: number;
    format?: (val: string) => string;
}
