'use client';

import { useState } from 'react';
import { compressImage, formatFileSize } from '@/lib/utils/staff-formatting';
import ImageCropper from '@/components/ui/ImageCropper';
import { StepDocumentsProps } from "@/types/components/StepDocuments";

export function StepDocuments({ selectedFields, onFileChange, onAlert }: StepDocumentsProps) {
  const [fileInfos, setFileInfos] = useState<Record<string, { name: string; size: string; status: string }>>({});
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Type validation
    const allowedTypes = e.target.accept.split(',');
    if (!allowedTypes.some(type => file.type === type || (type === 'image/jpeg' && file.type === 'image/jpg'))) {
      if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
         onAlert?.('Invalid file type. Please upload PDF or image (JPEG/PNG).');
         e.target.value = '';
         return;
      }
    }

    setFileInfos(prev => ({
      ...prev,
      [name]: { name: file.name, size: formatFileSize(file.size), status: 'Analyzing...' }
    }));

    let finalFile: File | Blob = file;

    // Auto-shrink for images
    if (file.type.startsWith('image/')) {
      try {
        setFileInfos(prev => ({
          ...prev,
          [name]: { ...prev[name], status: 'Reducing size...' }
        }));
        finalFile = await compressImage(file);
        setFileInfos(prev => ({
          ...prev,
          [name]: { ...prev[name], size: formatFileSize(finalFile.size), status: 'Ready (Local)' }
        }));
      } catch (err) {
        console.error('Compression failed:', err);
        setFileInfos(prev => ({
          ...prev,
          [name]: { ...prev[name], status: 'Error' }
        }));
      }
    } else {
      // Size validation for non-images (PDFs)
      if (file.size > 2 * 1024 * 1024) {
        onAlert?.('File size exceeds 2MB limit.');
        e.target.value = '';
        setFileInfos(prev => {
          const newState = { ...prev };
          delete newState[name];
          return newState;
        });
        return;
      }
      setFileInfos(prev => ({
        ...prev,
        [name]: { ...prev[name], status: 'Ready (Local)' }
      }));
    }

    if (onFileChange) {
      onFileChange(name, finalFile);
    }
  };

  const renderFileField = (label: string, name: string, accept: string, description: string) => (
    <div className="space-y-1.5 p-4 border border-neutral-200 rounded-xl bg-neutral-50/50 hover:bg-white transition-colors">
      <label className="text-sm font-semibold text-[#0F172A] block">
        {label}
      </label>
      <p className="text-xs text-neutral-500 mb-2">
        {description}
      </p>
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={(e) => handleFileChange(e, name)}
        className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0F172A]/10 file:text-[#0F172A] hover:file:bg-[#0F172A]/20 transition-all cursor-pointer"
      />
      {fileInfos[name] && (
        <div className="mt-3 p-2 bg-white rounded-lg border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-[10px] font-bold text-neutral-700 truncate mb-1">
            {fileInfos[name].name}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-neutral-400 font-medium">Size: {fileInfos[name].size}</span>
            <span className={`text-[9px] font-black uppercase tracking-tighter ${fileInfos[name].status === 'Error' ? 'text-red-500' : 'text-green-600'}`}>
              {fileInfos[name].status}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4 pb-2 border-b border-neutral-100 flex items-center">
          <span className="bg-[#0F172A]/10 text-[#0F172A] w-6 h-6 rounded-md flex items-center justify-center mr-2">
            3
          </span>
          Documents & File Uploads
        </h3>
        
        <div className="mb-6 p-4 bg-[#0F172A]/5 border border-[#0F172A]/10 rounded-xl">
          <p className="text-xs text-[#0F172A] font-medium leading-relaxed">
            <span className="font-black underline mr-1">NOTE:</span> 
            Files selected below are stored locally on your device for now. They will only be sent to the school servers when you click 
            <span className="font-black px-1 mx-1 border border-[#0F172A]/20 rounded italic bg-white text-[10px]">Complete Onboarding</span> 
            at the bottom of this page.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Photo — Always present (Auto) */}
          <div className="space-y-1.5 p-4 border border-neutral-200 rounded-xl bg-neutral-50/50 hover:bg-white transition-colors sm:col-span-2 lg:col-span-1">
            <label className="text-sm font-semibold text-[#0F172A] block">Profile Photo <span className="text-red-500">*</span></label>
            <p className="text-xs text-neutral-500 mb-2">JPEG/PNG · Max 5 MB</p>
            <ImageCropper
              value={profilePhoto}
              onChange={(file) => {
                setProfilePhoto(file);
                if (file && onFileChange) onFileChange('profileImageUrl', file);
              }}
              aspectRatio={1}
              circularCrop
              previewShape="circle"
              maxSizeMB={5}
              outputSize={400}
              label="Upload Profile Photo"
              hint="Drag & drop or click to browse"
            />
          </div>

          {/* Resume — Always present (Auto) */}
          {renderFileField('Resume', 'resumeUrl', 'application/pdf', 'PDF, max 2MB')}

          {/* Custom Optional Documents */}
          {selectedFields.aadhaarUrl && renderFileField('Aadhaar Card', 'aadhaarUrl', 'application/pdf,image/jpeg,image/png,image/jpg', 'PDF/JPEG/PNG, max 2MB')}
          {selectedFields.panUrl && renderFileField('PAN Card', 'panUrl', 'application/pdf,image/jpeg,image/png,image/jpg', 'PDF/JPEG/PNG, max 2MB')}
          {selectedFields.bankPassbookUrl && renderFileField('Bank Passbook', 'bankPassbookUrl', 'application/pdf,image/jpeg,image/png,image/jpg', 'PDF/JPEG/PNG, max 2MB')}
          {selectedFields.bankChequeUrl && renderFileField('Bank Cheque', 'bankChequeUrl', 'application/pdf,image/jpeg,image/png,image/jpg', 'PDF/JPEG/PNG, max 2MB')}
          {selectedFields.x_marksheetUrl && renderFileField('X Marksheet', 'x_marksheetUrl', 'application/pdf,image/jpeg,image/png,image/jpg', 'PDF/JPEG/PNG, max 2MB')}
          {selectedFields.xii_marksheetUrl && renderFileField('XII Marksheet', 'xii_marksheetUrl', 'application/pdf,image/jpeg,image/png,image/jpg', 'PDF/JPEG/PNG, max 2MB')}
          {selectedFields.graduation_marksheetUrl && renderFileField('Graduation Marksheet', 'graduation_marksheetUrl', 'application/pdf,image/jpeg,image/png,image/jpg', 'PDF/JPEG/PNG, max 2MB')}
          {selectedFields.pg_marksheetUrl && renderFileField('P.G. Marksheet', 'pg_marksheetUrl', 'application/pdf,image/jpeg,image/png,image/jpg', 'PDF/JPEG/PNG, max 2MB')}
        </div>
      </div>
    </div>
  );
}
