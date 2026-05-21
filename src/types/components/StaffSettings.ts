export interface StaffSettingsProps {
    selectedFields: Record<string, boolean>;
    onFieldToggle: (fieldKey: string, checked: boolean) => void;
    onBack: () => void;
    onSave: () => void;
}
