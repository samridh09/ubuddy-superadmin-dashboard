'use client';

import { formatAadharNumber, formatPANNumber, formatMobileNumber } from '@/lib/utils/staff-formatting';
import { StepCustomFieldsProps } from "@/types/components/StepCustomFields";

export function StepCustomFields({ selectedFields }: StepCustomFieldsProps) {
  const hasAnySelectedFields = Object.values(selectedFields).some((v) => v);

  const handleAadharInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = formatAadharNumber(e.currentTarget.value);
  };

  const handlePANInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = formatPANNumber(e.currentTarget.value);
  };

  const handleMobileInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = formatMobileNumber(e.currentTarget.value);
  };

  if (!hasAnySelectedFields) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="p-12 text-center text-neutral-500 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
          <p className="text-sm font-medium">
            No custom fields enabled in settings. Click Next to continue.
          </p>
          <p className="text-xs mt-2">
            You can enable custom fields in the Settings page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-6 pb-2 border-b border-neutral-100 flex items-center">
          <span className="bg-[#0F172A]/10 text-[#0F172A] w-6 h-6 rounded-md flex items-center justify-center mr-2">
            2
          </span>
          Custom Configuration Fields
        </h3>

        <div className="space-y-10">
          {/* Family Information */}
          {(selectedFields.fatherName || selectedFields.motherName) && (
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest border-l-2 border-neutral-200 pl-3">Family Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {selectedFields.fatherName && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Father Name</label>
                    <input name="fatherName" type="text" placeholder="Enter father's name" pattern="^[a-zA-Z.\s\'-]+$" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                  </div>
                )}
                {selectedFields.motherName && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Mother Name</label>
                    <input name="motherName" type="text" placeholder="Enter mother's name" pattern="^[a-zA-Z.\s\'-]+$" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {selectedFields.emergencyContact && (
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest border-l-2 border-neutral-200 pl-3">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Contact Number</label>
                  <input name="emergencyContactNumber" type="tel" placeholder="800-123-8908" maxLength={12} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onInput={handleMobileInput} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Contact Name</label>
                  <input name="emergencyContactName" type="text" placeholder="e.g. John Doe" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Relation</label>
                  <input name="emergencyContactRelation" type="text" placeholder="e.g. Spouse / Father" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* Identification */}
          {(selectedFields.aadhaarNumber || selectedFields.panNumber) && (
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest border-l-2 border-neutral-200 pl-3">Identification</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {selectedFields.aadhaarNumber && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Aadhaar Number</label>
                    <input name="aadhaarNumber" type="text" placeholder="1234-5678-9012" maxLength={14} pattern="\\d{4}-\\d{4}-\\d{4}" onInput={handleAadharInput} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                  </div>
                )}
                {selectedFields.panNumber && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">PAN Number</label>
                    <input name="panNumber" type="text" placeholder="ABCDE1234F" maxLength={10} pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" onInput={handlePANInput} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all uppercase" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bank Details */}
          {selectedFields.bankDetails && (
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest border-l-2 border-neutral-200 pl-3">Bank Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Bank Name</label>
                  <input name="bankName" type="text" placeholder="e.g. HDFC Bank" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">IFSC Code</label>
                  <input name="ifsc" type="text" placeholder="HDFC0001234" maxLength={11} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all uppercase" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Account Holder Name</label>
                  <input name="accountHolderName" type="text" placeholder="Enter name as per bank" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                </div>
                <div className="space-y-1 lg:col-span-2">
                  <label className="text-xs font-semibold text-neutral-700">Account Number</label>
                  <input name="accountNumber" type="text" placeholder="Enter account number" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* Professional Details */}
          {(selectedFields.designation || selectedFields.experience || selectedFields.qualification) && (
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest border-l-2 border-neutral-200 pl-3">Professional Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {selectedFields.designation && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Designation</label>
                    <input name="designation" type="text" placeholder="e.g. Senior Teacher" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                  </div>
                )}
                {selectedFields.experience && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Experience</label>
                    <input name="experience" type="text" placeholder="e.g. 5+ years" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                  </div>
                )}
                {selectedFields.qualification && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Qualification</label>
                    <input name="qualification" type="text" placeholder="e.g. M.Ed., Ph.D." className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
