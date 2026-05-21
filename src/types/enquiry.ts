export type EnquiryStatus = 'PENDING' | 'CONVERTED' | 'REJECTED' | 'NEW' | 'FOLLOW_UP' | 'CLOSED';

export interface Enquirer {
  id?: string;
  name: string;
  relation: string;
  relation_other?: string;
  contact_number: string;
  alternate_contact_number?: string;
}

export interface EnquiryVisit {
  id?: string;
  enquirer_id: string;
  enquirer_name?: string;
  notes: string;
  follow_up_date?: string;
  created_at?: string;
}

export interface ActionLog {
  id?: string;
  action: string;
  performed_by?: string;
  performed_by_name?: string;
  details?: string;
  timestamp: string;
}

export interface FollowUp {
  id?: string;
  date: string;
  notes?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'MISSED';
  created_at?: string;
}

export interface Enquiry {
  id: string;
  student_name: string;
  session_id: string;
  class_id: string;
  gender: string;
  dateOfBirth?: string;
  father_name?: string;
  mother_name?: string;
  last_class?: string;
  last_school?: string;
  address?: string;
  source: string;
  source_other?: string;
  notes?: string;
  status: EnquiryStatus;
  is_starred: boolean;
  is_archived: boolean;
  archived_at?: string;
  follow_up_date?: string;
  school_id: string;
  created_at: string;
  updated_at: string;
  primary_enquirer?: Enquirer;
  enquiries?: Enquirer[];
  visits?: EnquiryVisit[];
  follow_ups?: FollowUp[];
  action_logs?: ActionLog[];
}

export interface CreateEnquiryPayload {
  student_name: string;
  session_id: string;
  class_id: string;
  gender: string;
  dateOfBirth?: string;
  father_name?: string;
  mother_name?: string;
  last_class?: string;
  last_school?: string;
  address?: string;
  source: string;
  source_other?: string;
  notes?: string;
  follow_up_date?: string;
  primary_enquirer: Omit<Enquirer, 'id'>;
}

export interface AddVisitPayload {
  enquirer_id: string;
  notes: string;
  follow_up_date?: string;
}

export interface AddEnquirerPayload {
  relation: string;
  relation_other?: string;
  name: string;
  contact_number: string;
  alternate_contact_number?: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matches?: Array<{
    id: string;
    student_name: string;
    contact_number: string;
    class_id: string;
    status: EnquiryStatus;
    created_at: string;
  }>;
}

export interface EnquiryFilters {
  status?: EnquiryStatus | '';
  is_starred?: boolean;
  is_archived?: boolean;
  search?: string;
}
