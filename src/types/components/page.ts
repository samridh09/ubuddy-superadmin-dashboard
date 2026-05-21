export interface SchoolData {
    id: string;
    slNo: number;
    name: string;
    uCode: string;
    city: string;
    status: 'Active' | 'Inactive';
    studentCount?: number;
    subAdminCount?: number;
    studentLimit?: number;
    subAdminLimit?: number;
}

export interface POC {
    id: string;
    name: string;
    gender: string;
    dob?: string;
    designation: string;
    contactNumber: string;
    alternateNumber: string;
    remarks: string;
}

export interface SchoolDraft {
    name: string;
    udiseCode: string;
    schoolCode: string;
    affiliationCode: string;
    principalName: string;
    principalGender: string;
    principalDob: string;
    directorName: string;
    directorGender: string;
    directorDob: string;
    state: string;
    city: string;
    address: string;
    website: string;
    phone: string;
    alternatePhone: string;
    username: string;
    remarks: string;
    pocs: POC[];
}
