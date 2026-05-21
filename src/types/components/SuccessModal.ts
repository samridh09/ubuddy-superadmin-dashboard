export interface SuccessModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    title?: string;
    variant?: 'success' | 'error' | 'warning' | 'info';
    autoCloseDuration?: number;
}
