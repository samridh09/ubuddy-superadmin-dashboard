export interface ConfigAdminFormData {
  name: string;
  gender: 'MALE' | 'FEMALE' | '';
  dateOfBirth: string;
  mobileNumber: string;
  alternateMobileNumber: string;
  email: string;
  remarks: string;
  username: string;
  profilePicture?: File | null;
}

export type ConfigAdminFormError = Partial<Record<keyof ConfigAdminFormData, string>>;

export interface FormFieldConfig {
  name: keyof ConfigAdminFormData;
  label: string;
  placeholder?: string;
  type: 'text' | 'select' | 'date' | 'textarea' | 'tel' | 'email';
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | undefined;
}
