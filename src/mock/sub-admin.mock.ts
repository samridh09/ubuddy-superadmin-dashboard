export interface SubAdminStatusEntry {
  id: number;
  name: string;
  username: string;
  employeeId: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Terminated';
}

export interface SubAdminTerminateEntry {
  id: number;
  name: string;
  username: string;
  employeeId: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export const MOCK_SUB_ADMIN_STATUS_DATA: SubAdminStatusEntry[] = [
  { id: 1, name: 'ANAYA DANGOLIYA', username: 'anaya.admin', employeeId: 'SUB_001', role: 'Cashier',       status: 'Active' },
  { id: 2, name: 'ANKITA LIMBU',    username: 'ankita.l',    employeeId: 'SUB_002', role: 'Accountant',    status: 'Inactive' },
  { id: 3, name: 'ATHARV MALVIYA',  username: 'atharv.m',    employeeId: 'SUB_003', role: 'Clerk',         status: 'Active' },
  { id: 4, name: 'ATHARV SINGH',    username: 'atharv.s',    employeeId: 'SUB_004', role: 'Receptionist',  status: 'Active' },
  { id: 5, name: 'BHAAVYA JAIN',    username: 'bhaavya.j',   employeeId: 'SUB_005', role: 'Coordinator',   status: 'Active' },
  { id: 6, name: 'CHAHAT SEN',      username: 'chahat.s',    employeeId: 'SUB_006', role: 'Inventory Mgr', status: 'Active' },
];

export const MOCK_SUB_ADMIN_TERMINATE_DATA: SubAdminTerminateEntry[] = [
  { id: 1, name: 'ANAYA DANGOLIYA', username: 'anaya.admin', employeeId: 'SUB_001', role: 'Cashier',       status: 'Active' },
  { id: 2, name: 'ANKITA LIMBU',    username: 'ankita.l',    employeeId: 'SUB_002', role: 'Accountant',    status: 'Inactive' },
  { id: 3, name: 'ATHARV MALVIYA',  username: 'atharv.m',    employeeId: 'SUB_003', role: 'Clerk',         status: 'Active' },
  { id: 4, name: 'ATHARV SINGH',    username: 'atharv.s',    employeeId: 'SUB_004', role: 'Receptionist',  status: 'Active' },
  { id: 5, name: 'BHAAVYA JAIN',    username: 'bhaavya.j',   employeeId: 'SUB_005', role: 'Coordinator',   status: 'Active' },
  { id: 6, name: 'CHAHAT SEN',      username: 'chahat.s',    employeeId: 'SUB_006', role: 'Inventory Mgr', status: 'Active' },
];
