import type { Staff, StaffFilters, StaffFormConfig, StaffLog } from '@/types/staff';
import { API_ENDPOINTS } from '@/lib/api';
import { transformApiStaffList, transformApiStaffToStaff } from '@/lib/utils/staff-api-transformer';
import axiosClient from '@/lib/axios';

// Mock data for development (fallback)
const mockStaff: Staff[] = [
  {
    id: '1',
    employeeId: '12101',
    name: 'John Doe',
    gender: 'Male',
    mobileNumber: '9876543210',
    email: 'john.doe@school.com',
    staffType: 'Teaching',
    dob: '1985-06-15',
    maritalStatus: 'Married',
    address: '123 Main Street, City',
    dateOfJoining: '2020-04-01',
    designation: 'Senior Teacher',
    qualification: 'M.Ed',
    experience: '10 years',
    status: 'ACTIVE',
    createdAt: '2020-04-01T00:00:00Z',
    updatedAt: '2020-04-01T00:00:00Z',
  },
  {
    id: '2',
    employeeId: '12102',
    name: 'Jane Smith',
    gender: 'Female',
    mobileNumber: '9876543211',
    email: 'jane.smith@school.com',
    staffType: 'Non-Teaching',
    dob: '1990-08-20',
    maritalStatus: 'Single',
    address: '456 Park Avenue, City',
    dateOfJoining: '2021-06-15',
    designation: 'Administrative Officer',
    qualification: 'MBA',
    experience: '5 years',
    status: 'ACTIVE',
    createdAt: '2021-06-15T00:00:00Z',
    updatedAt: '2021-06-15T00:00:00Z',
  },
  {
    id: '3',
    employeeId: '12103',
    name: 'Robert Johnson',
    gender: 'Male',
    mobileNumber: '9876543212',
    email: 'robert.j@school.com',
    staffType: 'Teaching',
    dob: '1988-03-10',
    maritalStatus: 'Married',
    address: '789 Oak Street, City',
    dateOfJoining: '2019-08-01',
    designation: 'Mathematics Teacher',
    qualification: 'M.Sc Mathematics',
    experience: '8 years',
    status: 'INACTIVE',
    createdAt: '2019-08-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

const mockLogs: StaffLog[] = [];

function updateMockStaffRecord(id: string, updates: Partial<Staff>): Staff | null {
  const index = mockStaff.findIndex((staff) => staff.id === id);
  if (index === -1) {
    return null;
  }

  const updatedStaff = {
    ...mockStaff[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockStaff[index] = updatedStaff;
  return updatedStaff;
}

// Form configuration for schools
let mockFormConfig: StaffFormConfig = {
  schoolId: 'school-1',
  selectedFields: [
    'name', 'gender', 'mobileNumber', 'email', 'staffType',
    'dob', 'maritalStatus', 'address', 'dateOfJoining',
    'designation', 'qualification', 'experience', 'remarks'
  ],
  updatedAt: new Date().toISOString(),
};

/**
 * Staff Service using Axios with Auth Interceptors
 */
export const staffService = {
  // Get all staff with filtering
  async getStaff(filters?: StaffFilters): Promise<Staff[]> {
    try {
      const { data: responseData } = await axiosClient.get(API_ENDPOINTS.staff.base, {
        params: {
          gender: filters?.gender,
          staffType: filters?.staffType,
          status: filters?.status,
          search: filters?.search,
        },
      });

      const apiStaffList = Array.isArray(responseData.data?.data)
        ? responseData.data.data
        : Array.isArray(responseData.data)
          ? responseData.data
          : Array.isArray(responseData)
            ? responseData
            : [];

      return transformApiStaffList(apiStaffList);
    } catch (error) {
      console.error('Error fetching staff, using mock data:', error);
      return this.getMockStaff(filters);
    }
  },

  // Mock staff data fallback
  getMockStaff(filters?: StaffFilters): Staff[] {
    let filtered = [...mockStaff];
    if (filters?.gender) filtered = filtered.filter(s => s.gender === filters.gender);
    if (filters?.staffType) filtered = filtered.filter(s => s.staffType === filters.staffType);
    if (filters?.status) filtered = filtered.filter(s => s.status === filters.status);
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.employeeId.includes(search) ||
        s.mobileNumber.includes(search)
      );
    }
    return filtered;
  },

  // Get staff by ID
  async getStaffById(id: string): Promise<Staff | null> {
    try {
      const { data: result } = await axiosClient.get(`${API_ENDPOINTS.staff.base}/${id}`);
      const staffData = result.data?.data || result.data || result;
      return transformApiStaffToStaff(staffData);
    } catch {
      return mockStaff.find(s => s.id === id) || null;
    }
  },

  // Get staff by Employee ID
  async getStaffByEmployeeId(employeeId: string): Promise<Staff | null> {
    return mockStaff.find(s => s.employeeId === employeeId) || null;
  },

  // Create new staff
  async createStaff(formData: FormData): Promise<Staff> {
    const { data: result } = await axiosClient.post(API_ENDPOINTS.staff.base, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const createdStaff = result.data || result;
    mockStaff.push(createdStaff);
    return createdStaff;
  },

  // Update staff
  async updateStaff(id: string, formData: FormData): Promise<Staff | null> {
    const { data: result } = await axiosClient.put(`${API_ENDPOINTS.staff.base}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const updatedStaff = result.data || result;
    const index = mockStaff.findIndex(s => s.id === id);
    if (index !== -1) mockStaff[index] = updatedStaff;
    return updatedStaff;
  },

  // Activate/Deactivate staff
  async toggleStaffStatus(id: string, currentStatus: Staff['status']): Promise<Staff | null> {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const { data: result } = await axiosClient.patch(API_ENDPOINTS.staff.status(id), { status: newStatus });
    const responseData = result.data?.data || result.data || result;

    let updatedStaff;
    if (responseData && responseData.profile) {
      updatedStaff = transformApiStaffToStaff(responseData);
    } else {
      updatedStaff = { id, status: newStatus } as Staff;
    }

    updateMockStaffRecord(id, updatedStaff);
    return updatedStaff;
  },

  // Terminate staff
  async terminateStaff(id: string, remarks: string): Promise<Staff | null> {
    const { data: result } = await axiosClient.patch(API_ENDPOINTS.staff.status(id), {
      status: 'TERMINATED',
      remark: remarks
    });
    const responseData = result.data?.data || result.data || result;

    let updatedStaff;
    if (responseData && responseData.profile) {
      updatedStaff = transformApiStaffToStaff(responseData);
    } else {
      updatedStaff = { id, status: 'TERMINATED' } as Staff;
    }

    updateMockStaffRecord(id, updatedStaff);
    return updatedStaff;
  },

  // Get ex-staff (terminated)
  async getExStaff(): Promise<Staff[]> {
    return mockStaff.filter(s => s.status === 'TERMINATED');
  },

  // Get staff logs
  async getStaffLogs(staffId?: string): Promise<StaffLog[]> {
    return staffId ? mockLogs.filter(log => log.staffId === staffId) : mockLogs;
  },

  // Form configuration methods
  async getFormConfig(): Promise<StaffFormConfig> {
    return mockFormConfig;
  },

  async updateFormConfig(schoolId: string, selectedFields: string[]): Promise<StaffFormConfig> {
    mockFormConfig = { schoolId, selectedFields, updatedAt: new Date().toISOString() };
    return mockFormConfig;
  },

  // Export staff data
  async exportStaff(filters?: StaffFilters, selectedFields?: string[]): Promise<Staff[]> {
    const staff = await this.getStaff(filters);
    if (!selectedFields || selectedFields.length === 0) return staff;
    return staff.map(s => {
      const filtered: Partial<Staff> = { id: s.id, employeeId: s.employeeId };
      selectedFields.forEach(field => {
        if (field in s) (filtered as any)[field] = s[field as keyof Staff];
      });
      return filtered as Staff;
    });
  },

  // Delete staff
  async deleteStaff(id: string): Promise<boolean> {
    try {
      await axiosClient.delete(`${API_ENDPOINTS.staff.base}/${id}`);
      const index = mockStaff.findIndex(s => s.id === id);
      if (index !== -1) mockStaff.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Error deleting staff, using mock:', error);
      const index = mockStaff.findIndex(s => s.id === id);
      if (index !== -1) {
        mockStaff.splice(index, 1);
        return true;
      }
      return false;
    }
  },

  // Generate relieving letter
  async generateRelievingLetter(staffId: string): Promise<string> {
    const staff = mockStaff.find(s => s.id === staffId);
    if (!staff || staff.status !== 'TERMINATED') {
      throw new Error('Can only generate relieving letter for terminated staff');
    }
    return `Relieving letter for ${staff.name} (${staff.employeeId})`;
  },
};
