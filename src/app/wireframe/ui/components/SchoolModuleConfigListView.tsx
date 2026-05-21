'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { Pencil } from 'lucide-react';
import {
  PageWrapper, PageHeader, DataTable, Table, THead, TBody, Th, Td, Tr, IconButton
} from './ui';
import { ModuleConfigItem, SchoolModuleConfigListViewProps } from '@/types';

const CONFIG_ITEMS: ModuleConfigItem[] = [
  { id: '1', name: 'Admit Card', route: 'admit-card' },
  { id: '2', name: 'Result', route: 'result' },
  { id: '3', name: 'Transfer Certificate', route: 'transfer-certificate' },
];

export const SchoolModuleConfigListView: React.FC<SchoolModuleConfigListViewProps> = ({
  schoolName,
  schoolId,
  sessionId,
  sessionYear,
}) => {
  const router = useRouter();
  const base = useBasePath();

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title={`${schoolName} | module Configuration`}
        subtitle={sessionYear ? `${schoolName} | ${sessionYear}` : schoolName}
        showBack
        onBack={() => router.push(`${base}/school/manage-sessions?schoolId=${schoolId}`)}
      />

      {/* Configuration Table */}
      <DataTable>
        <Table fixed={true}>
          <THead>
            <Th className="pl-12 w-[600px]">Module Configuration</Th>
            <Th width="w-[120px]" align="center">Action</Th>
            <Th className="w-full"></Th>
          </THead>
          <TBody>
            {CONFIG_ITEMS.map((item, index) => (
              <Tr key={item.id} index={index}>
                <Td className="pl-12 py-8">
                  <span className="text-[15px] font-bold text-blue-900 tracking-tight">
                    {item.name}
                  </span>
                </Td>
                <Td align="center" className="py-8">
                  <IconButton 
                    variant="blue"
                    onClick={() => router.push(`${base}/school/manage-sessions/module/${item.route}?schoolId=${schoolId}&sessionId=${sessionId}`)}
                  >
                    <Pencil size={18} />
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
