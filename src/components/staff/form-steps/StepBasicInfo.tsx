'use client';

import { formatMobileNumber } from '@/lib/utils/staff-formatting';
import { DateInput } from '@/components/ui/date-input';
import { StepBasicInfoProps } from "@/types/components/StepBasicInfo";

const cls = "w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all";

export function StepBasicInfo({ formSelects, onSelectChange, isEditMode, dateValues = { dob: '', dateOfJoining: '' }, onDateChange }: StepBasicInfoProps) {
  const handleMobileInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = formatMobileNumber(e.currentTarget.value);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4 pb-2 border-b border-neutral-100 flex items-center">
          <span className="bg-[#0F172A]/10 text-[#0F172A] w-6 h-6 rounded-md flex items-center justify-center mr-2">1</span>
          Basic & Identity Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Full Name <span className="text-red-500">*</span></label>
            <input name="name" type="text" required placeholder="Enter full name" pattern="^[a-zA-Z.\s\'-]+$" className={cls} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Username <span className="text-red-500">*</span></label>
            <input name="username" type="text" required readOnly={isEditMode} placeholder="Enter username"
              className={`${cls} ${isEditMode ? 'bg-neutral-100 text-neutral-500 cursor-not-allowed' : ''}`} />
            {isEditMode && <p className="text-xs text-neutral-500 mt-1">Username cannot be changed</p>}
          </div>

          {!isEditMode && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Password <span className="text-red-500">*</span></label>
              <input name="password" type="password" required placeholder="Enter password"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$" className={cls} />
              <p className="text-xs text-neutral-500 mt-1">Min 8 chars, uppercase, lowercase, number</p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Email <span className="text-red-500">*</span></label>
            <input name="email" type="email" required placeholder="email@example.com" className={cls} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Gender <span className="text-red-500">*</span></label>
            <select name="gender" value={formSelects.gender} onChange={e => onSelectChange('gender', e.target.value)} className={cls}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Date of Birth <span className="text-red-500">*</span></label>
            <DateInput
              value={dateValues.dob}
              onChange={v => onDateChange?.('dob', v)}
              calendarDisabled={{ after: new Date() }}
            />
            <input type="hidden" name="dob" value={dateValues.dob} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Mobile Number <span className="text-red-500">*</span></label>
            <input name="mobileNumber" type="tel" required placeholder="800-123-8908" maxLength={12}
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onInput={handleMobileInput} className={cls} />
            <p className="text-xs text-neutral-500 mt-1">10 digits with auto hyphens</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Alternate Mobile Number <span className="text-red-500">*</span></label>
            <input name="alternateMobileNumber" type="tel" required placeholder="800-123-8908" maxLength={12} onInput={handleMobileInput} className={cls} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Marital Status <span className="text-red-500">*</span></label>
            <select name="maritalStatus" required value={formSelects.maritalStatus} onChange={e => onSelectChange('maritalStatus', e.target.value)} className={cls}>
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="WIDOWED">Widowed</option>
              <option value="DIVORCED">Divorced</option>
              <option value="SEPARATED">Separated</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Staff Type <span className="text-red-500">*</span></label>
            <select name="staffType" value={formSelects.staffType} onChange={e => onSelectChange('staffType', e.target.value)} className={cls}>
              <option value="TEACHING">Teaching</option>
              <option value="NON_TEACHING">Non-Teaching</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Date of Joining <span className="text-red-500">*</span></label>
            <DateInput
              value={dateValues.dateOfJoining}
              onChange={v => onDateChange?.('dateOfJoining', v)}
              calendarDisabled={{ after: new Date() }}
            />
            <input type="hidden" name="dateOfJoining" value={dateValues.dateOfJoining} />
          </div>

          <div className="space-y-1 col-span-1 md:col-span-2 lg:col-span-3">
            <label className="text-xs font-semibold text-neutral-700">Address <span className="text-red-500">*</span></label>
            <textarea name="address" required rows={2} placeholder="Enter complete address" className={`${cls} resize-none`} />
          </div>

          <div className="space-y-1 col-span-1 md:col-span-2 lg:col-span-3">
            <label className="text-xs font-semibold text-neutral-700">Remarks <span className="text-red-500">*</span></label>
            <textarea name="remarks" required rows={2} placeholder="Enter any specific remarks or notes" className={`${cls} resize-none`} />
          </div>

        </div>
      </div>
    </div>
  );
}
