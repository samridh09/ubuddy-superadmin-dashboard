'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Archive,
  CalendarDays,
  History,
  UserPlus,
  Phone,
  Loader2,
  Clock,
  FileText,
  Edit3,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { DateInput, formatDateDisplay } from '@/components/ui/date-input';
import { enquiryService } from '@/lib/services/enquiry-service';
import type { Enquiry, AddVisitPayload, AddEnquirerPayload, ActionLog, EnquiryStatus } from '@/types/enquiry';
import type { AcademicClass } from '@/lib/services/academic-service';
import type { Session } from '@/lib/services/session-service';
import { Props } from "@/types/components/EnquiryDetailsDrawer";

const STATUS_OPTIONS: { value: EnquiryStatus; label: string; color: string }[] = [
  { value: 'PENDING', label: 'Pending', color: 'text-amber-600' },
  { value: 'NEW', label: 'New', color: 'text-blue-600' },
  { value: 'FOLLOW_UP', label: 'Follow Up', color: 'text-purple-600' },
  { value: 'CONVERTED', label: 'Converted', color: 'text-green-600' },
  { value: 'REJECTED', label: 'Rejected', color: 'text-red-600' },
];

function getStatusBadgeClass(status: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    NEW: 'bg-blue-100 text-blue-700',
    FOLLOW_UP: 'bg-purple-100 text-purple-700',
    CONVERTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CLOSED: 'bg-gray-200 text-gray-700',
  };
  return map[status] || 'bg-gray-200 text-gray-700';
}

export default function EnquiryDetailsDrawer({
  enquiryId,
  classMap,
  sessionMap,
  onClose,
  onUpdate,
}: Props) {
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'visits' | 'enquirers' | 'logs'>('details');

  // Form states
  const [visitNotes, setVisitNotes] = useState('');
  const [visitDate, setVisitDate] = useState('');

  // Follow-up edit
  const [editingFollowUp, setEditingFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');

  const [newEnquirer, setNewEnquirer] = useState<AddEnquirerPayload>({
    relation: 'OTHER',
    name: '',
    contact_number: '',
  });

  // Archive confirm
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const fetchDetails = async () => {
    try {
      const data = await enquiryService.getById(enquiryId);
      setEnquiry(data);
      setFollowUpDate(data.follow_up_date || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const logs = await enquiryService.getActionLogs(enquiryId);
      setActionLogs(logs);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchLogs();
  }, [enquiryId]);

  const handleStatusChange = async (newStatus: string) => {
    setActionLoading(true);
    try {
      await enquiryService.updateStatus(enquiryId, newStatus);
      await fetchDetails();
      await fetchLogs();
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStarToggle = async () => {
    if (!enquiry) return;
    setActionLoading(true);
    try {
      await enquiryService.toggleStar(enquiryId, !enquiry.is_starred);
      setEnquiry((prev) => (prev ? { ...prev, is_starred: !prev.is_starred } : prev));
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async () => {
    setActionLoading(true);
    try {
      await enquiryService.archive(enquiryId);
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      setActionLoading(false);
    }
  };

  const handleFollowUpSave = async () => {
    if (!followUpDate) return;
    setActionLoading(true);
    try {
      await enquiryService.updateFollowUp(enquiryId, followUpDate);
      await fetchDetails();
      await fetchLogs();
      setEditingFollowUp(false);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitNotes.trim()) return;

    setActionLoading(true);
    try {
      await enquiryService.addVisit(enquiryId, {
        enquirer_id: enquiry?.primary_enquirer?.name || 'Unknown',
        notes: visitNotes,
        follow_up_date: visitDate || undefined,
      });
      setVisitNotes('');
      setVisitDate('');
      await fetchDetails();
      await fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddEnquirer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnquirer.name || !newEnquirer.contact_number) return;

    setActionLoading(true);
    try {
      await enquiryService.addEnquirer(enquiryId, newEnquirer);
      setNewEnquirer({ relation: 'OTHER', name: '', contact_number: '' });
      await fetchDetails();
      await fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const getClassName = (classId: string) => {
    const cls = classMap[classId];
    if (!cls) return classId.slice(0, 8);
    return cls.display_name || `${cls.name}${cls.section ? ' - ' + cls.section : ''}`;
  };

  const getSessionName = (sessionId: string) => {
    const session = sessionMap[sessionId];
    if (!session) return sessionId.slice(0, 8);
    return session.name || `${new Date(session.start_date).getFullYear()}-${new Date(session.end_date).getFullYear()}`;
  };

  if (loading || !enquiry) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-md bg-white h-full flex items-center justify-center shadow-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${getStatusBadgeClass(enquiry.status)}`}
              >
                {enquiry.status.replace(/_/g, ' ')}
              </span>
              <button
                onClick={handleStarToggle}
                disabled={actionLoading}
                className="p-0.5 transition-colors disabled:opacity-50"
              >
                <Star
                  className={`w-4 h-4 transition-colors ${
                    enquiry.is_starred
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300 hover:text-amber-400'
                  }`}
                />
              </button>
            </div>
            <h2 className="text-[20px] font-bold text-[#0F172A]">{enquiry.student_name}</h2>
            <p className="text-[12px] text-gray-500 mt-0.5">
              {getClassName(enquiry.class_id)} · {getSessionName(enquiry.session_id)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-white shrink-0">
          <select
            value={enquiry.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={actionLoading}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12px] font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Status: {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowArchiveConfirm(true)}
            disabled={actionLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg text-[12px] font-semibold transition-colors disabled:opacity-50"
          >
            <Archive className="w-3.5 h-3.5" /> Archive
          </button>
        </div>

        {/* Archive Confirmation */}
        {showArchiveConfirm && (
          <div className="p-4 bg-red-50 border-b border-red-100 shrink-0 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-red-800">Archive this enquiry?</p>
                <p className="text-[11px] text-red-600 mt-1">
                  Archived enquiries will be automatically deleted after 30 days.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleArchive}
                    disabled={actionLoading}
                    className="px-4 py-1.5 bg-red-600 text-white text-[11px] font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Yes, Archive
                  </button>
                  <button
                    onClick={() => setShowArchiveConfirm(false)}
                    className="px-4 py-1.5 text-red-600 text-[11px] font-bold hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up Date Bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-50/50 border-b border-purple-100/50 shrink-0">
          <CalendarDays className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Follow-up:</span>
          {editingFollowUp ? (
            <div className="flex items-center gap-2 flex-1">
              <DateInput
                compact
                value={followUpDate}
                onChange={setFollowUpDate}
                calendarDisabled={{ before: new Date() }}
                className="flex-1"
              />
              <button
                onClick={handleFollowUpSave}
                disabled={actionLoading}
                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditingFollowUp(false);
                  setFollowUpDate(enquiry.follow_up_date || '');
                }}
                className="p-1 text-gray-400 hover:bg-gray-50 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[12px] font-medium text-purple-800">
                {enquiry.follow_up_date
                  ? formatDateDisplay(enquiry.follow_up_date.split('T')[0])
                  : 'Not set'}
              </span>
              <button
                onClick={() => setEditingFollowUp(true)}
                className="p-1 text-purple-400 hover:text-purple-600 hover:bg-purple-100 rounded transition-colors"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center px-4 border-b border-gray-100 shrink-0">
          {[
            { id: 'details' as const, label: 'Details' },
            { id: 'visits' as const, label: 'Visits/Notes', count: enquiry.visits?.length || 0 },
            { id: 'enquirers' as const, label: 'Contacts', count: (enquiry.enquiries?.length || 0) + 1 },
            { id: 'logs' as const, label: 'Logs', count: actionLogs.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-[12px] font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#0F172A] text-[#0F172A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id ? 'bg-[#0F172A] text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 space-y-4">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5" /> Student Info
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-gray-500">Gender</span>
                    <p className="text-[13px] font-medium text-[#0F172A] mt-0.5">{enquiry.gender}</p>
                  </div>
                  {enquiry.dateOfBirth && (
                    <div>
                      <span className="text-[11px] text-gray-500">Date of Birth</span>
                      <p className="text-[13px] font-medium text-[#0F172A] mt-0.5">
                        {formatDateDisplay(enquiry.dateOfBirth.split('T')[0])}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-[11px] text-gray-500">Source</span>
                    <p className="text-[13px] font-medium text-[#0F172A] mt-0.5">
                      {enquiry.source.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500">Enquiry Date</span>
                    <p className="text-[13px] font-medium text-[#0F172A] mt-0.5">
                      {formatDateDisplay(enquiry.created_at.split('T')[0])}
                    </p>
                  </div>
                  {enquiry.father_name && (
                    <div>
                      <span className="text-[11px] text-gray-500">Father&apos;s Name</span>
                      <p className="text-[13px] font-medium text-[#0F172A] mt-0.5">
                        {enquiry.father_name}
                      </p>
                    </div>
                  )}
                  {enquiry.mother_name && (
                    <div>
                      <span className="text-[11px] text-gray-500">Mother&apos;s Name</span>
                      <p className="text-[13px] font-medium text-[#0F172A] mt-0.5">
                        {enquiry.mother_name}
                      </p>
                    </div>
                  )}
                </div>
                {enquiry.address && (
                  <div>
                    <span className="text-[11px] text-gray-500">Address</span>
                    <p className="text-[13px] font-medium text-[#0F172A] mt-0.5">{enquiry.address}</p>
                  </div>
                )}
              </div>

              {(enquiry.last_school || enquiry.last_class) && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 space-y-4">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <History className="w-3.5 h-3.5" /> Previous Academic
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {enquiry.last_school && (
                      <div className="col-span-2">
                        <span className="text-[11px] text-gray-500">Previous School</span>
                        <p className="text-[13px] font-medium text-[#0F172A] mt-0.5">
                          {enquiry.last_school}
                        </p>
                      </div>
                    )}
                    {enquiry.last_class && (
                      <div>
                        <span className="text-[11px] text-gray-500">Previous Class</span>
                        <p className="text-[13px] font-medium text-[#0F172A] mt-0.5">
                          {enquiry.last_class}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {enquiry.notes && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Initial Notes
                  </h4>
                  <p className="text-[13px] text-gray-700 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
                    {enquiry.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="space-y-6">
              {/* Add Visit Form */}
              <form
                onSubmit={handleAddVisit}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
              >
                <h4 className="text-[13px] font-bold text-[#0F172A] mb-4">Log Interaction</h4>
                <textarea
                  required
                  rows={2}
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  placeholder="Notes from call or visit..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none mb-3"
                />
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <DateInput
                      compact
                      value={visitDate}
                      onChange={setVisitDate}
                      className="w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 bg-[#0F172A] text-white rounded-lg text-[12px] font-semibold hover:bg-[#1e293b] transition-colors disabled:opacity-50 shrink-0"
                  >
                    Save Note
                  </button>
                </div>
              </form>

              {/* Timeline */}
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {enquiry.visits?.map((visit, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F1F5F9] bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                      <History className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Interaction
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {visit.follow_up_date
                            ? formatDateDisplay(visit.follow_up_date.split('T')[0])
                            : visit.created_at
                              ? formatDateDisplay(visit.created_at.split('T')[0])
                              : 'No date'}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#0F172A]">{visit.notes}</p>
                      {visit.follow_up_date && (
                        <div className="flex items-center gap-1 mt-2 text-purple-600">
                          <CalendarDays className="w-3 h-3" />
                          <span className="text-[10px] font-semibold">
                            Follow-up: {formatDateDisplay(visit.follow_up_date.split('T')[0])}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {(!enquiry.visits || enquiry.visits.length === 0) && (
                  <div className="text-center py-8 text-[13px] text-gray-500 bg-white/50 rounded-xl border border-dashed border-gray-200">
                    No interactions logged yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'enquirers' && (
            <div className="space-y-4">
              {/* Primary Contact */}
              <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-bl-lg">
                  Primary
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0F172A]">
                      {enquiry.primary_enquirer?.name || 'Unknown'}
                    </h4>
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      {enquiry.primary_enquirer?.relation || 'Guardian'}
                    </span>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-[13px] font-medium text-gray-700">
                        {enquiry.primary_enquirer?.contact_number || 'No contact'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Contacts */}
              {enquiry.enquiries?.map((enq, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#0F172A]">{enq.name}</h4>
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        {enq.relation}
                      </span>
                      <p className="text-[13px] font-medium text-gray-700 mt-1">
                        {enq.contact_number}
                      </p>
                      {enq.alternate_contact_number && (
                        <p className="text-[12px] text-gray-500">
                          Alt: {enq.alternate_contact_number}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Contact Form */}
              <form
                onSubmit={handleAddEnquirer}
                className="bg-gray-50 rounded-xl border border-gray-200 p-4 mt-6"
              >
                <h4 className="text-[12px] font-bold text-[#0F172A] uppercase tracking-widest mb-3">
                  Add Contact Person
                </h4>
                <div className="space-y-3">
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={newEnquirer.name}
                    onChange={(e) =>
                      setNewEnquirer((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      value={newEnquirer.contact_number}
                      onChange={(e) =>
                        setNewEnquirer((prev) => ({
                          ...prev,
                          contact_number: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20"
                    />
                    <select
                      value={newEnquirer.relation}
                      onChange={(e) =>
                        setNewEnquirer((prev) => ({
                          ...prev,
                          relation: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="SELF">Self</option>
                      <option value="FATHER">Father</option>
                      <option value="MOTHER">Mother</option>
                      <option value="BROTHER">Brother</option>
                      <option value="SISTER">Sister</option>
                      <option value="UNCLE">Uncle</option>
                      <option value="AUNT">Aunt</option>
                      <option value="GUARDIAN">Guardian</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-2 bg-white border border-gray-200 text-[#0F172A] rounded-lg text-[12px] font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 mt-1"
                  >
                    Add Contact
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3">
              {actionLogs.length === 0 ? (
                <div className="text-center py-12 text-[13px] text-gray-500 bg-white/50 rounded-xl border border-dashed border-gray-200">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  No action logs yet.
                </div>
              ) : (
                actionLogs.map((log, idx) => (
                  <div
                    key={log.id || idx}
                    className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-semibold text-[#0F172A]">
                            {log.action.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(log.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {log.performed_by_name && (
                          <span className="text-[11px] text-gray-500">
                            by {log.performed_by_name}
                          </span>
                        )}
                        {log.details && (
                          <p className="text-[12px] text-gray-600 mt-1 bg-gray-50 px-2 py-1 rounded">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
