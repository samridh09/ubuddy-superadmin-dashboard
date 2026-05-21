export interface StepDocumentsProps {
    selectedFields: Record<string, boolean>;
    onFileChange?: (name: string, file: File | Blob) => void;
    onAlert?: (message: string) => void;
}
