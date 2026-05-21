import { SchoolPOCFormData } from '@/types/school';
export interface PocFormItemProps {
    poc: SchoolPOCFormData;
    index: number;
    errors: Record<string, string>;
    onRemove: (id: string) => void;
    onUpdate: (id: string, field: keyof SchoolPOCFormData, value: string) => void;
    onError: (key: string, msg: string) => void;
}
