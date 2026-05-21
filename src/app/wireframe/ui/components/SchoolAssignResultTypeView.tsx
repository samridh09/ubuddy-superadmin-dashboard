'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import {
  PageWrapper, PageHeader, DataTable, Table, THead, TBody, Th, Td, Tr, PrimaryButton
} from './ui';
import { ClassResultType, SchoolAssignResultTypeViewProps } from '@/types';

const CLASSES = [
  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th",
  "11th PCM", "11th PCB", "11th Commerce", "11th Arts"
];

export const SchoolAssignResultTypeView: React.FC<SchoolAssignResultTypeViewProps> = ({ 
  schoolName, 
  schoolId, 
  sessionId 
}) => {
  const router = useRouter();
  const base = useBasePath();
  const [data, setData] = useState<ClassResultType[]>(
    CLASSES.map(c => ({ className: c, type: c === '1st' ? 'Grade' : 'Marking' }))
  );

  const setType = (className: string, type: 'Grade' | 'Marking') => {
    setData(data.map(item => item.className === className ? { ...item, type } : item));
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Assign Result Type"
        showBack
        onBack={() => router.push(`${base}/school/manage-sessions/module/result?schoolId=${schoolId}&sessionId=${sessionId}`)}
      />

      <div className="max-w-4xl mx-auto">
        <DataTable>
          <Table fixed={true}>
            <THead>
              <Th className="pl-12 w-[300px]">Class</Th>
              <Th className="w-full">Result Type</Th>
            </THead>
            <TBody>
              {data.map((item, index) => (
                <Tr key={item.className} index={index}>
                  <Td className="pl-12 py-5">
                    <span className="text-[14px] font-bold text-blue-900 tracking-tight">
                      {item.className}
                    </span>
                  </Td>
                  <Td className="py-5">
                    <div className="flex items-center gap-8">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name={`type-${item.className}`}
                            checked={item.type === 'Grade'}
                            onChange={() => setType(item.className, 'Grade')}
                            className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:border-blue-600 transition-all"
                          />
                          <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                        <span className={`text-[13px] font-bold transition-colors ${item.type === 'Grade' ? 'text-blue-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                          Grade
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name={`type-${item.className}`}
                            checked={item.type === 'Marking'}
                            onChange={() => setType(item.className, 'Marking')}
                            className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:border-blue-600 transition-all"
                          />
                          <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                        <span className={`text-[13px] font-bold transition-colors ${item.type === 'Marking' ? 'text-blue-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                          Marking
                        </span>
                      </label>
                    </div>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
          
          <div className="p-8 border-t border-gray-100 flex justify-end">
            <PrimaryButton className="h-12 px-10 text-[15px] shadow-none">
              Submit
            </PrimaryButton>
          </div>
        </DataTable>
      </div>
    </PageWrapper>
  );
};
