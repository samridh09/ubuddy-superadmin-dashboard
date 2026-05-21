export type StudentStatus = 'Active' | 'Inactive' | 'Terminated';

export interface StudentDirectoryRecord {
  id: number;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  gender: string;
  contactNumber: string;
  status: StudentStatus;
}

export interface StudentStatusRecord {
  id: number;
  name: string;
  rollNo: string;
  class: string;
  status: StudentStatus;
}

export interface StudentPromoteRecord {
  id: number;
  name: string;
  rollNo: string;
  currentClass: string;
  result: string;
  decision: 'Promote' | 'Detain' | null;
}

export interface StudentExRecord {
  id: number;
  name: string;
  admittedOn: string;
  terminatedOn: string;
  terminatedBy: string;
}

export interface StudentExportField {
  id: string;
  label: string;
}

export const STUDENT_DIRECTORY_DATA: StudentDirectoryRecord[] = [
  { id: 1, name: 'AARAV SHARMA', rollNo: '1', class: '10', section: 'A', gender: 'Male',   contactNumber: '+91 99999-00101', status: 'Active' },
  { id: 2, name: 'ANAYA SINGH',  rollNo: '2', class: '10', section: 'A', gender: 'Female', contactNumber: '+91 99999-00102', status: 'Active' },
  { id: 3, name: 'ZOYA KHAN',    rollNo: '3', class: '10', section: 'B', gender: 'Female', contactNumber: '+91 99999-00103', status: 'Inactive' },
  { id: 4, name: 'ROHAN VERMA',  rollNo: '4', class: '9',  section: 'A', gender: 'Male',   contactNumber: '+91 99999-00104', status: 'Active' },
  { id: 5, name: 'PRIYA MEHTA',  rollNo: '5', class: '9',  section: 'B', gender: 'Female', contactNumber: '+91 99999-00105', status: 'Active' },
];

export const STUDENT_STATUS_DATA: StudentStatusRecord[] = [
  { id: 1, name: 'AARAV SHARMA', rollNo: 'R-001', class: '10-A', status: 'Active' },
  { id: 2, name: 'ANAYA SINGH',  rollNo: 'R-002', class: '10-A', status: 'Active' },
  { id: 3, name: 'ZOYA KHAN',    rollNo: 'R-003', class: '10-B', status: 'Inactive' },
  { id: 4, name: 'ROHAN VERMA',  rollNo: 'R-004', class: '9-A',  status: 'Active' },
  { id: 5, name: 'PRIYA MEHTA',  rollNo: 'R-005', class: '9-B',  status: 'Active' },
];

export const STUDENT_PROMOTE_DATA: StudentPromoteRecord[] = [
  { id: 1, name: 'AARAV SHARMA', rollNo: 'R-001', currentClass: '10-A', result: 'Pass', decision: 'Promote' },
  { id: 2, name: 'ANAYA SINGH',  rollNo: 'R-002', currentClass: '10-A', result: 'Fail', decision: null },
  { id: 3, name: 'ZOYA KHAN',    rollNo: 'R-003', currentClass: '10-B', result: 'Pass', decision: 'Promote' },
  { id: 4, name: 'ROHAN VERMA',  rollNo: 'R-004', currentClass: '9-A',  result: 'Pass', decision: null },
  { id: 5, name: 'PRIYA MEHTA',  rollNo: 'R-005', currentClass: '9-B',  result: 'Fail', decision: 'Detain' },
];

export const STUDENT_EX_DATA: StudentExRecord[] = [
  { id: 1, name: 'RAHUL GUPTA', admittedOn: '10/01/2023', terminatedOn: '15/03/2026', terminatedBy: 'Admin' },
  { id: 2, name: 'SNEHA PATEL', admittedOn: '05/11/2022', terminatedOn: '20/02/2026', terminatedBy: 'Admin' },
];

export const STUDENT_EXPORT_FIELDS: StudentExportField[] = [
  { id: 'name',          label: 'Student Name' },
  { id: 'rollNo',        label: 'Roll No.' },
  { id: 'class',         label: 'Class' },
  { id: 'section',       label: 'Section' },
  { id: 'gender',        label: 'Gender' },
  { id: 'contactNumber', label: 'Contact Number' },
  { id: 'status',        label: 'Profile Status' },
];
