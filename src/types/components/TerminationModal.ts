export interface TerminationModalProps {
    isOpen: boolean;
    staffName: string;
    onConfirm: (remarks: string) => void;
    onClose: () => void;
}
