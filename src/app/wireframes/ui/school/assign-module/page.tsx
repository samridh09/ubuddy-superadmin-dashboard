'use client';

import React from 'react';
import { SchoolAssignModuleView } from '@/app/wireframe/ui/components/SchoolAssignModuleView';

const NISHANT_MODULES = [
  "Student enquiry",
  "Student",
  "Staff",
  "Exam time table",
  "Admit card",
  "Result",
  "Fee",
  "Transportation",
  "Certificates",
  "Staff permissions",
  "Sub admin",
  "Notifications",
  "Settings"
];

const INITIAL_ASSIGNMENTS = NISHANT_MODULES.map(module => {
  const isDefault = ["Student", "Sub admin", "Settings", "Staff", "Notifications"].includes(module);
  return {
    key: module.toLowerCase().replace(/\s+/g, '_'),
    name: module,
    isAssigned: isDefault,
    isDefault: isDefault,
  };
});

export default function AssignModulePage() {
  // In a real app, we would fetch the school name and current permissions using the ID from query params
  const schoolName = "UBUDDY School";

  return (
    <SchoolAssignModuleView
      schoolName={schoolName}
      schoolId="1"
      initialData={INITIAL_ASSIGNMENTS}
      onSave={async () => {}}
    />
  );
}
