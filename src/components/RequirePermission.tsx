'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldX, Lock, ArrowRight } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import SchoolAdminSidebar from '@/components/SchoolAdminSidebar';
import { MODULE_CONFIG, ROLE_FEATURES, getFullRoute } from '@/lib/modules';
import type { UserRole } from '@/types/user';
import { RequirePermissionProps } from "@/types/components/RequirePermission";

/**
 * Wraps a page/section and blocks access if the user lacks the required permission.
 */
export default function RequirePermission({ module, action = 'READ', roles, children }: RequirePermissionProps) {
  const { loading, hasPermission, canAccessModule, hasModule, isRole, user, permissions } = usePermissions();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50">
        <div className="w-12 h-12 border-4 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin" />
        <p className="mt-4 text-neutral-500 font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  // Check module permission
  const moduleAllowed = module ? (hasPermission(module, action) || canAccessModule(module)) : true;
  // Check role permission
  const roleAllowed = roles ? isRole(...roles) : true;

  if (!moduleAllowed || !roleAllowed) {
    const dashboardRoute = user?.role === 'SUB_ADMIN' ? '/dashboard/subadmin' : '/dashboard/schooladmin';
    const accessibleModules = MODULE_CONFIG.filter((mod) => hasModule(mod.key));
    const accessibleRoleFeatures = ROLE_FEATURES.filter((feature) => isRole(...feature.allowedRoles));

    return (
      <div className="min-h-screen bg-[#F1F5F9] flex overflow-hidden font-sans text-neutral-900">
        <SchoolAdminSidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <section className="bg-white border border-red-100 rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldX className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-neutral-900">Access Denied</h2>
                  <p className="text-neutral-500 mt-2">You don&apos;t have permission to access this page.</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {module ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-red-50 border border-red-100 text-red-700 rounded-full">
                        <Lock className="w-3.5 h-3.5" />
                        Required: {module} ({action})
                      </span>
                    ) : null}
                    {roles && roles.length > 0 ? (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-amber-50 border border-amber-100 text-amber-700 rounded-full">
                        Allowed roles: {roles.join(', ')}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => router.push(dashboardRoute)}
                      className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Available Access From Permissions API</h3>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Modules You Can Open</p>
                  <div className="space-y-2">
                    {accessibleModules.length > 0 ? (
                      accessibleModules.map((mod) => {
                        const route = getFullRoute(mod.route, user?.role || '');
                        return (
                          <button
                            key={mod.key}
                            onClick={() => router.push(route)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left"
                          >
                            <span className="text-sm font-medium text-neutral-800">{mod.label}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500">No modules available for your account.</p>
                    )}
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Assigned Permissions</p>
                  <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                    {permissions && Object.keys(permissions).length > 0 ? (
                      Object.entries(permissions).map(([moduleName, perms]) => (
                        <div key={moduleName} className="border border-gray-100 rounded-lg p-3">
                          <p className="text-sm font-semibold text-neutral-800 capitalize">{moduleName.replace(/-/g, ' ')}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Array.isArray(perms) && perms.length > 0 ? (
                              perms.map((perm) => (
                                <span
                                  key={`${moduleName}-${perm}`}
                                  className="px-2 py-1 text-[10px] font-semibold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-100 rounded"
                                >
                                  {perm}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">No actions assigned</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No permissions returned from the API.</p>
                    )}
                  </div>
                </div>
              </div>

              {accessibleRoleFeatures.length > 0 ? (
                <div className="mt-4 border border-gray-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Role-Based Access</p>
                  <div className="flex flex-wrap gap-2">
                    {accessibleRoleFeatures.map((feature) => {
                      const route = getFullRoute(feature.route, user?.role || '');
                      return (
                        <button
                          key={feature.route}
                          onClick={() => router.push(route)}
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {feature.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
