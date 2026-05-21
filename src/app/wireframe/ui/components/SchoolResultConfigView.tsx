'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { Eye } from 'lucide-react';
import {
  PageWrapper, PageHeader, DataTable, Table, THead, TBody, Th, Td, Tr, IconButton
} from './ui';
import { ResultConfigItem, SchoolResultConfigViewProps } from '@/types';

const CONFIG_ITEMS: ResultConfigItem[] = [
  { id: '1', name: 'Assign Grade', route: 'assign-grade' },
  { id: '2', name: 'Assign Result Type', route: 'assign-result-type' },
  { id: '3', name: 'Marking Pattern', route: 'marking-pattern' },
  { id: '4', name: 'Assign Layout', route: 'assign-layout' },
];

export const SchoolResultConfigView: React.FC<SchoolResultConfigViewProps> = ({
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
        title={`${schoolName} | Result Configuration`}
        subtitle={sessionYear ? `${schoolName} | ${sessionYear}` : schoolName}
        showBack
        onBack={() => router.push(`${base}/school/manage-sessions/module?schoolId=${schoolId}&sessionId=${sessionId}`)}
      />

      {/* Configuration Table */}
      <DataTable>
        <Table fixed={true}>
          <THead>
            <Th className="pl-12 w-[600px]">Result Management</Th>
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
                    onClick={() => router.push(`${base}/school/manage-sessions/module/result/${item.route}?schoolId=${schoolId}&sessionId=${sessionId}`)}
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
