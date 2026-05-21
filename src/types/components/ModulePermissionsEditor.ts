import { ModulePermissions } from '@/lib/permissions';
export interface ModulePermissionsEditorProps {
    value: ModulePermissions;
    onChange: (next: ModulePermissions) => void;
    disabled?: boolean;
    moduleNames?: string[];
}
