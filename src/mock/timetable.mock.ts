export interface TimetableRowData {
  id: string;
  date: string;
  day: string;
  classSubjects: Record<string, string[]>;
}

export interface TimetableModalDetail {
  id: number;
  date: string;
  subjects: string[];
}

export const TIMETABLE_SUBJECTS: string[] = [
  'Mathematics', 'Hindi', 'English', 'Science', 'Social Science', 'Computer Science', 'Sanskrit', 'G.K.',
];

export const TIMETABLE_CLASSES: string[] = [
  'Pre-Nursery', 'Nursery', 'L.K.G.', 'U.K.G.',
  'I', 'II', 'III', 'IV', 'V', 'VI',
  'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
];

export const TIMETABLE_DATES: { date: string; day: string }[] = [
  { date: '02-12-2025', day: 'TUE' },
  { date: '03-12-2025', day: 'WED' },
  { date: '04-12-2025', day: 'THU' },
  { date: '05-12-2025', day: 'FRI' },
  { date: '06-12-2025', day: 'SAT' },
  { date: '08-12-2025', day: 'MON' },
  { date: '09-12-2025', day: 'TUE' },
  { date: '10-12-2025', day: 'WED' },
  { date: '11-12-2025', day: 'THU' },
  { date: '12-12-2025', day: 'FRI' },
  { date: '13-12-2025', day: 'SAT' },
  { date: '15-12-2025', day: 'MON' },
];

export const TIMETABLE_SCHEDULE_DATA: Record<string, Record<string, string>> = {
  '02-12-2025': { 'Pre-Nursery': 'Art & Craft', 'Nursery': 'Rhymes', 'L.K.G.': 'English 1', 'U.K.G.': 'Hindi 1', 'I': 'Hindi', 'II': 'Mathematics', 'III': 'Science', 'IV': 'English', 'V': 'Social Studies', 'VI': 'Mathematics', 'VII': 'Science', 'VIII': 'English', 'IX': 'Physics', 'X': 'Mathematics', 'XI': 'Physics', 'XII': 'Chemistry' },
  '03-12-2025': { 'Pre-Nursery': 'English', 'Nursery': 'Drawing', 'L.K.G.': 'Mathematics', 'I': 'English', 'II': 'Hindi', 'III': 'Mathematics', 'IV': 'Science', 'V': 'Mathematics', 'VI': 'Science', 'VII': 'Social Studies', 'VIII': 'Mathematics', 'IX': 'Chemistry', 'X': 'Science', 'XI': 'Chemistry', 'XII': 'Physics' },
  '04-12-2025': { 'U.K.G.': 'English', 'I': 'Mathematics', 'II': 'English', 'III': 'Hindi', 'IV': 'Mathematics', 'V': 'Science', 'VI': 'English', 'VII': 'Mathematics', 'VIII': 'Science', 'IX': 'Biology', 'X': 'Social Studies', 'XI': 'Mathematics / Biology', 'XII': 'English' },
  '05-12-2025': { 'Pre-Nursery': 'Moral Science', 'Nursery': 'English', 'L.K.G.': 'Hindi 1', 'I': 'EVS', 'II': 'EVS', 'III': 'English', 'IV': 'Hindi', 'V': 'English', 'VI': 'Hindi', 'VII': 'English', 'VIII': 'Social Studies', 'IX': 'Mathematics', 'X': 'English', 'XI': 'English', 'XII': 'Mathematics / Biology' },
  '06-12-2025': { 'Pre-Nursery': 'Mathematics', 'Nursery': 'Mathematics', 'U.K.G.': 'Mathematics', 'I': 'Computer', 'II': 'Computer', 'III': 'EVS', 'IV': 'EVS', 'V': 'Hindi', 'VI': 'Social Studies', 'VII': 'Hindi', 'VIII': 'Hindi', 'IX': 'English', 'X': 'Hindi / IT', 'XI': 'Computer Science / Physical Ed', 'XII': 'Accountancy' },
  '08-12-2025': { 'L.K.G.': 'Drawing', 'U.K.G.': 'Drawing', 'I': 'G.K.', 'II': 'G.K.', 'III': 'Computer', 'IV': 'Computer', 'V': 'EVS', 'VI': 'Sanskrit', 'VII': 'Sanskrit', 'VIII': 'Sanskrit', 'IX': 'Social Studies', 'X': 'Physics', 'XI': 'Accountancy', 'XII': 'Business Studies' },
  '09-12-2025': { 'Pre-Nursery': 'Hindi', 'III': 'G.K.', 'IV': 'G.K.', 'V': 'Computer', 'VI': 'Computer', 'VII': 'Computer', 'VIII': 'Computer', 'IX': 'IT', 'X': 'Chemistry', 'XI': 'Business Studies', 'XII': 'Economics' },
  '10-12-2025': { 'Nursery': 'Hindi', 'L.K.G.': 'EVS', 'U.K.G.': 'EVS', 'V': 'G.K.', 'VI': 'G.K.', 'VII': 'G.K.', 'VIII': 'G.K.', 'IX': 'Hindi / Sanskrit', 'X': 'Biology', 'XI': 'Economics', 'XII': 'Computer Science / Physical Ed' },
  '11-12-2025': { 'I': 'Drawing', 'II': 'Drawing', 'III': 'Drawing', 'IV': 'Drawing', 'V': 'Drawing', 'VI': 'Drawing', 'VII': 'Drawing', 'VIII': 'Drawing', 'XI': 'Geography', 'XII': 'History' },
  '12-12-2025': { 'IX': 'Value Education', 'X': 'Value Education', 'XI': 'History', 'XII': 'Geography' },
  '13-12-2025': { 'VI': 'Value Education', 'VII': 'Value Education', 'VIII': 'Value Education', 'IX': 'Art Education', 'X': 'Art Education', 'XI': 'Political Science', 'XII': 'Sociology' },
  '15-12-2025': { 'IX': 'Health & Physical Ed', 'X': 'Health & Physical Ed', 'XI': 'Sociology', 'XII': 'Political Science' },
};

export const TIMETABLE_EDIT_ROWS: TimetableRowData[] = [
  { id: '1',  date: '02-12-2025', day: 'Tue', classSubjects: { 'Pre-Nursery': ['Hindi'], 'L.K.G.': ['English', 'Science'], 'I': ['Mathematics'] } },
  { id: '2',  date: '03-12-2025', day: 'Wed', classSubjects: { 'Pre-Nursery': ['English'] } },
  { id: '3',  date: '04-12-2025', day: 'Thu', classSubjects: { 'Pre-Nursery': ['Social Science'] } },
  { id: '4',  date: '05-12-2025', day: 'Fri', classSubjects: { 'Pre-Nursery': ['Computer Science'] } },
  { id: '5',  date: '06-12-2025', day: 'Sat', classSubjects: { 'Pre-Nursery': ['Mathematics'] } },
  { id: '6',  date: '07-12-2025', day: 'Sun', classSubjects: { 'I': ['English'] } },
  { id: '7',  date: '08-12-2025', day: 'Mon', classSubjects: { 'L.K.G.': ['Mathematics'] } },
  { id: '8',  date: '09-12-2025', day: 'Tue', classSubjects: { 'Pre-Nursery': ['Sanskrit'] } },
  { id: '9',  date: '10-12-2025', day: 'Wed', classSubjects: {} },
  { id: '10', date: '11-12-2025', day: 'Thu', classSubjects: {} },
  { id: '11', date: '12-12-2025', day: 'Fri', classSubjects: {} },
  { id: '12', date: '13-12-2025', day: 'Sat', classSubjects: {} },
  { id: '13', date: '14-12-2025', day: 'Sun', classSubjects: {} },
];

export const TIMETABLE_MODAL_MOCK_DETAILS: TimetableModalDetail[] = [
  { id: 1, date: '02-12-2025', subjects: ['Hindi', 'Science', 'xcv'] },
  { id: 2, date: '03-12-2025', subjects: ['English'] },
  { id: 3, date: '04-12-2025', subjects: ['Social Science'] },
  { id: 4, date: '05-12-2025', subjects: ['Computer Science'] },
  { id: 5, date: '06-12-2025', subjects: ['Mathematics'] },
  { id: 6, date: '09-12-2025', subjects: ['Sanskrit'] },
];
