'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { Eye } from 'lucide-react';
import {
  PageWrapper, PageHeader, DataTable, Table, THead, TBody, Th, Td, Tr, IconButton
} from './ui';
import { BasicConfigItem, SchoolBasicConfigViewProps } from '@/types';
import { useAuth } from '@/providers/auth-provider';

const CONFIG_ITEMS: BasicConfigItem[] = [
  { id: '1', name: 'Class & Section', route: 'class' },
  { id: '2', name: 'Subject', route: 'subject' },
  { id: '3', name: 'Terms', route: 'terms' },
  { id: '4', name: 'Student Form', route: 'student-form' },
  { id: '5', name: 'Staff Form', route: 'staff-form' },
];

export const SchoolBasicConfigView: React.FC<SchoolBasicConfigViewProps> = ({ 
  schoolName, 
  sessionYear, 
  schoolId, 
  sessionId 
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const base = useBasePath();

  const displayedItems = user?.role === 'CONFIGURATION_ADMIN'
    ? CONFIG_ITEMS.filter(item => ['Class & Section', 'Subject', 'Terms'].includes(item.name))
    : CONFIG_ITEMS;

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title={`${schoolName} | Basic Configuration`}
        subtitle={`${schoolName} | ${sessionYear}`}
        showBack
        onBack={() => router.push(`${base}/school/manage-sessions?schoolId=${schoolId}`)}
      />

      {/* Configuration Table */}
      <DataTable>
        <Table fixed={true}>
          <THead>
            <Th className="pl-12 w-[600px]">Basic Configuration</Th>
            <Th width="w-[120px]" align="center">Action</Th>
            <Th className="w-full"></Th>
          </THead>
          <TBody>
            {displayedItems.map((item, index) => (
              <Tr key={item.id} index={index}>
                <Td className="pl-12 py-8">
                  <span className="text-[15px] font-bold text-blue-900 tracking-tight">
                    {item.name}
                  </span>
                </Td>
                <Td align="center" className="py-8">
                  <IconButton 
                    variant="blue"
                    onClick={() => router.push(`${base}/school/manage-sessions/basic/${item.route}?schoolId=${schoolId}&sessionId=${sessionId}`)}
                  >
                    <Eye size={18} />
                  </IconButton>
                </Td>
                <Td className="py-8"></Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </DataTable>
    </PageWrapper>
  );
};
