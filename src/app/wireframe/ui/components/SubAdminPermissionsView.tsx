'use client';

import React from 'react';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  PageWrapper, PageHeader, FilterBox, SecondaryButton,
  DataTable, Table, THead, TBody, Th, Td, Tr,
} from './ui';
import { SubAdminPermissionEntry, SubAdminPermissionsViewProps } from '@/types';

export const SubAdminPermissionsView: React.FC<SubAdminPermissionsViewProps> = ({ adminName, initialData, adminId }) => {
  const router = useRouter();
  const idParam = adminId ? `?adminId=${adminId}` : '';
  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Sub Admin Permission | View Permissions"
        showBack
        onBack={() => router.push('/dashboard/schooladmin/sub-admin')}
      />

      {/* Identity + action bar */}
      <FilterBox>
        <div className="space-y-1 flex-1 min-w-[240px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">
            Permissions assigned for
          </label>
          <div className="flex items-center gap-2.5 py-1">
            <span className="text-[15px] font-semibold tracking-tight text-blue-900">{adminName}</span>
            <span className="ml-1 px-2 py-0.5 bg-gray-50 text-[9px] font-bold text-gray-400 uppercase tracking-widest rounded border border-gray-100">
              Sub-Admin
            </span>
          </div>
        </div>
        <SecondaryButton onClick={() => router.push(`/dashboard/schooladmin/sub-admin/permissions/edit${idParam}`)}>

          <Pencil size={14} />
          Edit Permissions
        </SecondaryButton>
      </FilterBox>

      {/* Table */}
      <DataTable>
        <Table fixed>
          <THead>
            <Th width="w-[80px]"  className="pl-10">S. No.</Th>
            <Th width="w-[300px]">Module</Th>
            <Th>Permissions</Th>
          </THead>
          <TBody>
            {initialData.map((item, index) => (
              <Tr key={index} index={index}>
                <Td className="pl-10"><span className="text-[13px] font-medium text-gray-400">{index + 1}</span></Td>
                <Td><span className="text-[13px] font-semibold text-blue-900 tracking-tight">{item.module}</span></Td>
                <Td>
                  <div className="flex items-center gap-10">
                    {(['add', 'edit', 'delete', 'export'] as const).map((key) => (
                      <div key={key} className="w-[60px] flex items-center gap-2.5">
                        {item.permissions[key] ? (
                          <div className="flex items-center gap-2 animate-in fade-in duration-300">
                            <span className="text-[13px] font-semibold text-blue-900 capitalize">{key}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full opacity-20">
                            <span className="text-[13px] font-black text-gray-400 tracking-[0.2em]">---</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </DataTable>
    </PageWrapper>
  );
};
