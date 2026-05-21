'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { Eye, Pencil } from 'lucide-react';
import {
  PageWrapper, PageHeader, DataTable, Table, THead, TBody, Th, Td, Tr, IconButton
} from './ui';
import { BasicConfigItem, ModuleConfigItem, SchoolBasicConfigViewProps } from '@/types';
import { useAuth } from '@/providers/auth-provider';

const BASIC_CONFIG_ITEMS: BasicConfigItem[] = [
  { id: '1', name: 'Class & Section', route: 'class' },
  { id: '2', name: 'Subject', route: 'subject' },
  { id: '3', name: 'Terms', route: 'terms' },
  { id: '4', name: 'Student Form', route: 'student-form' },
  { id: '5', name: 'Staff Form', route: 'staff-form' },
];

const MODULE_CONFIG_ITEMS: ModuleConfigItem[] = [
  { id: '1', name: 'Admit Card', route: 'admit-card' },
  { id: '2', name: 'Result', route: 'result' },
  { id: '3', name: 'Transfer Certificate', route: 'transfer-certificate' },
];

export const SchoolConfigureView: React.FC<SchoolBasicConfigViewProps> = ({ 
  schoolName, 
  sessionYear, 
  schoolId, 
  sessionId 
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const base = useBasePath();

  const displayedBasicItems = user?.role === 'CONFIGURATION_ADMIN'
    ? BASIC_CONFIG_ITEMS.filter(item => ['Class & Section', 'Subject', 'Terms'].includes(item.name))
    : BASIC_CONFIG_ITEMS;

  const allItems = [
    ...displayedBasicItems.map(item => ({ ...item, section: 'Basic', icon: <Eye size={18} />, link: `${base}/school/manage-sessions/basic/${item.route}` })),
    ...MODULE_CONFIG_ITEMS.map(item => ({ ...item, section: 'Module', icon: <Pencil size={18} />, link: `${base}/school/manage-sessions/module/${item.route}` }))
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title={`${schoolName} | Configure`}
        subtitle={`${schoolName} | ${sessionYear}`}
        showBack
        onBack={() => router.push(`${base}/school/manage-sessions?schoolId=${schoolId}`)}
      />

      {/* Unified Configuration Table */}
      <DataTable>
        <Table fixed={true}>
          <THead>
            <Th className="pl-12 w-[600px]">Configuration Item</Th>
            <Th width="w-[120px]" align="center">Action</Th>
            <Th className="w-full"></Th>
          </THead>
          <TBody>
            {allItems.map((item, index) => (
              <Tr key={`${item.section}-${item.id}`} index={index}>
                <Td className="pl-12 py-8">
                  <span className="text-[15px] font-bold text-blue-900 tracking-tight">
                    {item.name}
                  </span>
                </Td>
                <Td align="center" className="py-8">
                  <IconButton 
                    variant="blue"
                    onClick={() => router.push(`${item.link}?schoolId=${schoolId}&sessionId=${sessionId}`)}
                  >
                    {item.icon}
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
