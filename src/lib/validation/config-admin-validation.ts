import { CONFIG_ADMIN_PATTERNS } from '@/constants/config-admin-form';
import { ConfigAdminFormData } from '@/types/config-admin-form';

export const validateConfigAdminField = (name: keyof ConfigAdminFormData, value: any): string | undefined => {
  switch (name) {
    case 'name':
      if (!value) return 'Name is required';
      if (!CONFIG_ADMIN_PATTERNS.NAME.test(value)) return "Allow alphabets, spaces, dot (.), hyphen (-), and single apostrophe (') only";
      break;
    case 'gender':
      if (!value) return 'Gender is required';
      break;
    case 'dateOfBirth':
      if (value) {
        const dob = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dob > today) return 'Cannot select or enter a future date';
      }
      break;
    case 'mobileNumber':
      if (!value) return 'Contact number is required';
      if (!CONFIG_ADMIN_PATTERNS.PHONE.test(value.replace(/\D/g, ''))) return 'Basic phone validation (10 digits)';
      break;
    case 'alternateMobileNumber':
      if (value && !CONFIG_ADMIN_PATTERNS.PHONE.test(value.replace(/\D/g, ''))) return 'Basic phone validation (10 digits)';
      break;
    case 'email':
      if (value && !CONFIG_ADMIN_PATTERNS.EMAIL.test(value)) return 'Basic email validation';
      break;
    case 'username':
      if (!value) return 'Username is required';
      if (value.length < 6) return 'Minimum 6 characters';
      if (!/^[a-zA-Z0-9]+$/.test(value)) return 'Alphanumeric only';
      break;
    case 'remarks':
      if (value && value.length > 300) return 'Max 300 characters';
      break;
  }
  return undefined;
};
