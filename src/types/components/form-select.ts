export interface FormSelectOption {
    value: string;
    label: string;
}

export interface FormSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    options: FormSelectOption[];
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    name?: string;
}
