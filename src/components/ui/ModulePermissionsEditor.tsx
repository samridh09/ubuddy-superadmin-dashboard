import React from 'react';
import { CRUD_ACTIONS, CRUD_ACTION_LABELS, MODULES, sanitizeModulePermissions, type ModulePermissions } from '@/lib/permissions';
import { ModulePermissionsEditorProps } from "@/types/components/ModulePermissionsEditor";

export function ModulePermissionsEditor({
  value,
  onChange,
  disabled = false,
  moduleNames,
}: ModulePermissionsEditorProps) {
  const safeValue = sanitizeModulePermissions(value || {});
  const availableModules = moduleNames && moduleNames.length > 0 ? moduleNames : [...MODULES];
  const modulePermissions = (moduleName: string) => safeValue[moduleName] || [];

  const toggleRead = (moduleName: string) => {
    const current = modulePermissions(moduleName);
    const active = current.includes('READ');
    const next: ModulePermissions = { ...safeValue };

    if (active) {
      delete next[moduleName];
    } else {
      next[moduleName] = ['READ'];
    }

    onChange(sanitizeModulePermissions(next));
  };

  const toggleAction = (moduleName: string, permission: string) => {
    if (permission === 'READ') {
      toggleRead(moduleName);
      return;
    }

    const current = modulePermissions(moduleName);
    const next: ModulePermissions = { ...safeValue };

    if (current.includes(permission)) {
      const updated = current.filter((item) => item !== permission);
      if (updated.length === 0) {
        delete next[moduleName];
      } else {
        next[moduleName] = updated.includes('READ') ? updated : ['READ', ...updated];
      }
    } else {
      next[moduleName] = Array.from(new Set(['READ', ...current, permission]));
    }

    onChange(sanitizeModulePermissions(next));
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="max-h-[60vh] overflow-auto">
        <div className="grid grid-cols-[minmax(11rem,1.2fr)_repeat(5,minmax(4.25rem,1fr))] bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider sticky top-0 z-10">
          <div className="px-3 py-3">Module</div>
          {CRUD_ACTIONS.map((permission) => (
            <div key={permission} className="px-2 py-3 text-center">
              {permission === 'READ' ? '' : CRUD_ACTION_LABELS[permission]}
            </div>
          ))}
        </div>

        <div className="divide-y divide-gray-100">
          {availableModules.map((moduleName) => (
            <div key={moduleName} className="grid grid-cols-[minmax(11rem,1.2fr)_repeat(5,minmax(4.25rem,1fr))] items-stretch">
              <div className="px-3 py-3 text-sm font-medium text-[#0F172A] capitalize">
                {moduleName.replaceAll('-', ' ')}
              </div>

              {CRUD_ACTIONS.map((permission) => {
                const checked = modulePermissions(moduleName).includes(permission);
                const isRead = permission === 'READ';

                return (
                  <div key={permission} className="px-2 py-2 flex items-center justify-center">
                    {isRead ? (
                      <button
                        type="button"
                        disabled={disabled}
                        aria-pressed={checked}
                        aria-label={`${CRUD_ACTION_LABELS[permission]} ${checked ? 'on' : 'off'}`}
                        onClick={() => toggleAction(moduleName, permission)}
                        className={`relative h-6 w-11 rounded-full border transition-colors disabled:opacity-50 ${
                          checked
                            ? 'border-emerald-600 bg-emerald-600'
                            : 'border-gray-300 bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ${
                            checked ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={disabled}
                        aria-pressed={checked}
                        onClick={() => toggleAction(moduleName, permission)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-50 ${
                          checked
                            ? 'border-[#0F172A] bg-[#0F172A] text-white'
                            : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                        aria-label={`${CRUD_ACTION_LABELS[permission]} ${checked ? 'checked' : 'unchecked'}`}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          {checked ? (
                            <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          ) : (
                            <rect x="4" y="4" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.75" />
                          )}
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
