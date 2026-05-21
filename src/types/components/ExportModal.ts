export interface ExportModalProps {
    isOpen: boolean;
    isExiting: boolean;
    selectedFields: Record<string, boolean>;
    exportableCustomFieldIds: string[];
    unavailableCustomFieldLabels: string[];
    exportScope: 'all' | 'current';
    currentPageCount: number;
    totalCount: number;
    isExporting?: boolean;
    onClose: () => void;
    onExport: (format: 'print' | 'pdf' | 'excel') => void;
    onExportScopeChange: (scope: 'all' | 'current') => void;
    onFieldToggle?: (id: string, checked: boolean) => void;
    onSelectAllCustom?: () => void;
    onClearCustom?: () => void;
}
