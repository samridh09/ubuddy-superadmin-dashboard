import { ConfigAdminRecord } from '@/types';

export const MOCK_ADMIN_NAMES: Record<string, string> = {
  '1': 'SAMRIDH SATNALIKA',
  '2': 'ANISHA GUPTA',
  '3': 'ROHAN MEHTA',
  '4': 'PRIYA SHARMA',
  '5': 'VIKRAM SINGH',
};

export interface MockHistoryChange {
  fieldName: string;
  oldValue: string;
  newValue: string;
}

export interface MockHistoryEntry {
  id: string;
  action: string;
  changes: MockHistoryChange[];
  createdAt: string;
  performedBy: { id: string; name: string };
}

export const MOCK_CONFIG_ADMIN_HISTORY: MockHistoryEntry[] = [
  {
    id: 'h1',
    action: 'PROFILE_UPDATED',
    changes: [
      { fieldName: 'mobileNumber', oldValue: '0790000000', newValue: '0790324653' },
      { fieldName: 'designation', oldValue: 'Admin', newValue: 'Configuration Admin' },
    ],
    createdAt: '2026-05-04T10:00:00Z',
    performedBy: { id: 'sa-1', name: 'Super Admin' },
  },
  {
    id: 'h2',
    action: 'STATUS_CHANGED',
    changes: [
      { fieldName: 'status', oldValue: 'Inactive', newValue: 'Active' },
    ],
    createdAt: '2026-04-20T09:30:00Z',
    performedBy: { id: 'sa-1', name: 'Super Admin' },
  },
  {
    id: 'h3',
    action: 'CREATED',
    changes: [],
    createdAt: '2026-01-01T10:00:00Z',
    performedBy: { id: 'sa-1', name: 'Super Admin' },
  },
];

export const MOCK_ADMINS: ConfigAdminRecord[] = [
  { id: '1', username: 'samridh',  name: 'SAMRIDH SATNALIKA', contact: '0790324653', role: 'Config Admin', status: 'Active',     lastLogin: '04/05/2026 12:15PM', lastLogout: '04/05/2026 01:30PM', duration: '1h 15m', createdOn: '01/01/2026 10:00AM', createdBy: 'Super Admin' },
  { id: '2', username: 'anisha',   name: 'ANISHA GUPTA',       contact: '0987654321', role: 'Config Admin', status: 'Active',     lastLogin: '04/05/2026 11:00AM', lastLogout: '04/05/2026 11:45AM', duration: '45m',     createdOn: '02/01/2026 09:30AM', createdBy: 'Super Admin' },
  { id: '3', username: 'rohan',    name: 'ROHAN MEHTA',        contact: '0112233445', role: 'Config Admin', status: 'Inactive',   lastLogin: '03/05/2026 04:20PM', lastLogout: '03/05/2026 05:00PM', duration: '40m',     createdOn: '05/01/2026 11:15AM', createdBy: 'Super Admin' },
  { id: '4', username: 'priya',    name: 'PRIYA SHARMA',       contact: '0556677889', role: 'Config Admin', status: 'Terminated', lastLogin: '28/04/2026 09:00AM', lastLogout: '28/04/2026 09:10AM', duration: '10m',     createdOn: '10/01/2026 02:00PM', createdBy: 'Super Admin', terminatedOn: '04/05/2026 10:00AM', terminatedBy: 'Super Admin' },
  { id: '5', username: 'vikram',   name: 'VIKRAM SINGH',       contact: '0443322110', role: 'Config Admin', status: 'Active',     lastLogin: '04/05/2026 08:30AM', lastLogout: '—',                  duration: 'In Progress', createdOn: '15/01/2026 03:45PM', createdBy: 'Super Admin' },
];
