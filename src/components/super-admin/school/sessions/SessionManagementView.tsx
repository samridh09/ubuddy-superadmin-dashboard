'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Loader2 } from 'lucide-react';

import {
  PageWrapper,
  PageHeader,
  FilterBox,
  PrimaryButton,
  DataTable,
  Table,
  THead,
  TBody,
  Th,
  Td,
  Tr,
  EmptyRow,
  SNoTh,
} from '@/app/wireframe/ui/components/ui';
import { SkeletonTableRows } from '@/components/ui';
import { 
  Session, 
  getSessionsPage, 
  createSession, 
  updateSession, 
  deleteSession,
  CreateSessionRequest,
  UpdateSessionRequest
} from '@/lib/services/session-service';
import { formatToDisplayDate } from '@/utils/date';
import { SessionDialog, DeleteConfirmDialog } from './SessionDialogs';

interface SessionManagementViewProps {
  schoolId: string;
  schoolName: string;
}

export const SessionManagementView: React.FC<SessionManagementViewProps> = ({
  schoolId,
  schoolName,
}) => {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [dialogMode, setDialogMode] = useState<'create' | 'view' | 'edit'>('create');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | undefined>(undefined);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getSessionsPage(schoolId, 1, 100);
      setSessions(result.data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch sessions:', err);
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) {
      fetchSessions();
    }
  }, [schoolId, fetchSessions]);

  const handleCreateOpen = () => {
    setSelectedSession(undefined);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleViewOpen = (session: Session) => {
    setSelectedSession(session);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEditOpen = () => {
    setDialogMode('edit');
  };

  const handleDeleteOpen = () => {
    setIsDeleteOpen(true);
  };

  const handleDialogSubmit = async (data: CreateSessionRequest | UpdateSessionRequest) => {
    try {
      setIsSubmitting(true);
      if (dialogMode === 'create') {
        await createSession({ ...data, school_id: schoolId } as CreateSessionRequest);
      } else if (dialogMode === 'edit' && selectedSession) {
        await updateSession(selectedSession.id, data as UpdateSessionRequest);
      }
      setIsDialogOpen(false);
      fetchSessions();
    } catch (err: any) {
      alert(err.message || 'Failed to save session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSession) return;
    try {
      setIsSubmitting(true);
      await deleteSession(selectedSession.id);
      setIsDeleteOpen(false);
      setIsDialogOpen(false);
      fetchSessions();
    } catch (err: any) {
      alert(err.message || 'Failed to delete session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title={`${schoolName} | Manage Sessions`}
        showBack
        onBack={() => router.push('/super-admin/school')}
      />

      <FilterBox>
        <div className="flex-1" />
        <PrimaryButton onClick={handleCreateOpen} className="h-[46px] shadow-none gap-2">
          <Plus size={18} />
          Create Session
        </PrimaryButton>
      </FilterBox>

      <DataTable>
        <Table fixed={true}>
          <THead>
            <SNoTh />
            <Th width="w-[300px]">Academic Year</Th>
            <Th width="w-[500px]">Session Dates</Th>
            <Th width="w-[280px]" align="center">Actions</Th>
            <Th className="w-full"></Th>
          </THead>
          <TBody>
            {loading ? (
              <SkeletonTableRows rows={6} cols={[100, 300, 500, 280, 0]} />
            ) : sessions.length > 0 ? (
              sessions.map((session, index) => (
                <Tr key={session.id} index={index}>
                  <Td isFirst>
                    <span className="text-[13px] font-semibold text-gray-400">
                      {index + 1}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[14px] font-bold text-blue-900 tracking-tight whitespace-nowrap">
                      {session.name}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[13px] font-semibold text-gray-500 whitespace-nowrap">
                      {formatToDisplayDate(session.start_date)} — {formatToDisplayDate(session.end_date)}
                    </span>
                  </Td>
                  <Td align="center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => router.push(`/super-admin/school/manage-sessions/configure?schoolId=${schoolId}&sessionId=${session.id}`)}
                        className="inline-flex items-center px-8 py-2.5 bg-white border-2 border-gray-100 hover:border-blue-400 text-blue-900 text-[12px] font-bold rounded-xl transition-all duration-300 active:scale-95 shadow-none"
                      >
                        Configure
                      </button>
                      <button
                        onClick={() => handleViewOpen(session)}
                        className="inline-flex items-center gap-1.5 px-8 py-2.5 bg-white border-2 border-gray-100 hover:border-blue-400 text-blue-900 text-[12px] font-bold rounded-xl transition-all duration-300 active:scale-95 shadow-none"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </Td>
                  <Td></Td>
                </Tr>
              ))
            ) : (
              <EmptyRow colSpan={5} message={error || "No sessions found."} />
            )}
          </TBody>
        </Table>
      </DataTable>

      <SessionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        mode={dialogMode}
        initialData={selectedSession}
        onSubmit={handleDialogSubmit}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        isSubmitting={isSubmitting}
        existingSessions={sessions}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        sessionName={selectedSession?.name || ''}
        isDeleting={isSubmitting}
      />
    </PageWrapper>
  );
};
