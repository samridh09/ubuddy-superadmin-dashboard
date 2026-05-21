export const PATTERNS = {
  NAME: /^[a-zA-Z.\-' ]+$/,
  SCHOOL_NAME: /^[a-zA-Z0-9.\-' ]+$/,
  ALPHA: /^[a-zA-Z ]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UDISE: /^[0-9]{11}$/,
  USERNAME: /^[a-zA-Z0-9]{6,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  AADHAAR: /^[0-9]{12}$/,
} as const;

export type ValidationResult = string; // empty string = valid

export function validateSchoolField(name: string, value: string): ValidationResult {
  switch (name) {
    case 'schoolName':
      if (!value) return 'School name is required';
      if (!PATTERNS.SCHOOL_NAME.test(value)) return 'Only letters, numbers, dot, hyphen, apostrophe allowed';
      return '';
    case 'email':
      if (!value) return 'Email is required';
      if (!PATTERNS.EMAIL.test(value)) return 'Invalid email format';
      return '';
    case 'principalName':
    case 'directorName':
      if (value && !PATTERNS.NAME.test(value)) return 'Only letters, dot, hyphen, apostrophe allowed';
      return '';
    case 'state':
      if (!value) return 'State is required';
      if (!PATTERNS.ALPHA.test(value)) return 'Only alphabets allowed';
      return '';
    case 'city':
      if (!value) return 'City is required';
      if (!PATTERNS.ALPHA.test(value)) return 'Only alphabets allowed';
      return '';
    case 'address':
      if (!value) return 'Address is required';
      return '';
    case 'phone':
      if (value.replace(/\D/g, '').length !== 10) return 'Must be 10 digits';
      return '';
    case 'altPhone':
      if (value && value.replace(/\D/g, '').length !== 10) return 'Must be 10 digits';
      return '';
    case 'website':
      if (value && !PATTERNS.URL.test(value)) return 'Invalid URL';
      return '';
    case 'udiseCode':
      if (value && !PATTERNS.UDISE.test(value)) return 'Must be exactly 11 digits';
      return '';
    case 'default_admin_username':
      if (!value) return 'Username is required';
      if (!PATTERNS.USERNAME.test(value)) return 'Min 6 alphanumeric characters';
      return '';
    default:
      return '';
  }
}
