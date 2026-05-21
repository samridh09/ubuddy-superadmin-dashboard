import type { SchoolFormState, SchoolPOCFormData } from '@/types/school';

export const INITIAL_SCHOOL_FORM: SchoolFormState = {
  schoolName: '',
  email: '',
  udiseCode: '',
  affiliationCode: '',
  principalName: '',
  principalGender: 'MALE',
  directorName: '',
  directorGender: 'MALE',
  state: '',
  city: '',
  address: '',
  website: '',
  phone: '',
  altPhone: '',
  default_admin_username: '',
  remarks: '',
};

export const createEmptyPoc = (): SchoolPOCFormData => ({
  id: Math.random().toString(36).substr(2, 9),
  name: '',
  gender: 'MALE',
  designation: '',
  contactNumber: '',
  alternateNumber: '',
  remarks: '',
});
