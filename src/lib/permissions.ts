export const MODULES = [
  // School management
  'schools',
  'school-onboarding',
  'sessions',
  'classes',
  'subjects',
  'fee',
  'transportation',
  // Academics
  'attendance',
  'homework',
  'syllabus',
  'timetable',
  'result',
  'daily-schedule',
  'course-progress',
  'annual-calendar',
  'admit-card',
  // Admin
  'staff-management',
  'school-admin-management',
  'user-management',
  'sub-admin',
  // Communication
  'student-enquiry',
  'staff-enquiry',
  // Students
  'student-management',
  'certificates',
  'reports',
] as const;

export const CRUD_ACTIONS = ['READ', 'WRITE', 'UPDATE', 'EXPORT', 'DELETE'] as const;

export const CRUD_ACTION_LABELS: Record<CrudAction, string> = {
  READ: 'Read',
  WRITE: 'Add',
  UPDATE: 'Edit',
  EXPORT: 'Export',
  DELETE: 'Delete',
};

const CRUD_ACTION_ALIASES: Record<string, CrudAction> = {
  MANAGE: 'DELETE',
};

export type ModuleName = (typeof MODULES)[number];
export type CrudAction = (typeof CRUD_ACTIONS)[number];

export type ModulePermissions = Record<string, string[]>;

const moduleSet = new Set<string>(MODULES);
const actionSet = new Set<string>(CRUD_ACTIONS);

export const sanitizeModulePermissions = (input: ModulePermissions): ModulePermissions => {
  const normalized: ModulePermissions = {};

  for (const [moduleName, permissions] of Object.entries(input || {})) {
    if (!moduleSet.has(moduleName) || !Array.isArray(permissions)) {
      continue;
    }

    const cleaned = Array.from(
      new Set(
        permissions
          .map((permission) => String(permission).toUpperCase().trim())
          .map((permission) => CRUD_ACTION_ALIASES[permission] || permission)
          .filter((permission) => actionSet.has(permission))
      )
    );

    if (cleaned.length > 0) {
      normalized[moduleName] = cleaned;
    }
  }

  return normalized;
};

export const isValidModuleName = (value: string) => moduleSet.has(value);
export const isValidCrudAction = (value: string) => actionSet.has(CRUD_ACTION_ALIASES[String(value).toUpperCase().trim()] || String(value).toUpperCase().trim());
