import { Matcher } from 'react-day-picker';
export interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: Matcher | Matcher[];
    defaultMonth?: Date;
    displayFormat?: string;
}
