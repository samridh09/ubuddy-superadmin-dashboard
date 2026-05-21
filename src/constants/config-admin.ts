export interface ModuleAssignment {
  id: string;
  module: string;
  isAssigned: boolean;
}

export const DEFAULT_MODULE_ASSIGNMENTS: ModuleAssignment[] = [
  { id: '1', module: 'Dashboard', isAssigned: false },
  { id: '2', module: 'School Management', isAssigned: true },
  { id: '3', module: 'Configuration Admin', isAssigned: true },
  { id: '4', module: 'Manage Modules', isAssigned: true },
  { id: '5', module: 'Manage Sessions', isAssigned: true },
  { id: '6', module: 'Result Portal', isAssigned: false },
  { id: '7', module: 'Assign Module', isAssigned: true },
  { id: '8', module: 'Student Management', isAssigned: false },
];
