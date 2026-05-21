import { FormFieldConfig } from "@/types/config-admin-form";
import { GENDER_OPTIONS } from "@/constants/config-admin-form";

export const CONFIG_ADMIN_FIELDS: FormFieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'e.g. Vikram Aditya',
    type: 'text',
    required: true,
  },
  {
    name: 'gender',
    label: 'Gender',
    placeholder: 'Select gender',
    type: 'select',
    required: true,
    options: GENDER_OPTIONS,
  },
  {
    name: 'dateOfBirth',
    label: 'DOB',
    type: 'date',
  },
  {
    name: 'mobileNumber',
    label: 'Contact Number',
    placeholder: 'XXXX-XXX-XXX',
    type: 'tel',
    required: true,
  },
  {
    name: 'alternateMobileNumber',
    label: 'Alternative Contact Number',
    placeholder: 'Optional',
    type: 'tel',
  },
  {
    name: 'email',
    label: 'Email Address',
    placeholder: 'email@example.com',
    type: 'email',
  },
  {
    name: 'username',
    label: 'Username',
    placeholder: 'e.g. vikram_admin',
    type: 'text',
    required: true,
  },
  {
    name: 'remarks',
    label: 'Remarks',
    placeholder: 'Any additional notes...',
    type: 'textarea',
  },
];
