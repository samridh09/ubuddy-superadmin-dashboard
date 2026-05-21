"use client";

import React, { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";
import { 
  PageWrapper, 
  PageHeader, 
  SecondaryButton, 
  PrimaryButton, 
  ErrorBanner 
} from "@/app/wireframe/ui/components/ui";
import { createConfigAdmin } from "@/lib/services/config-admin-service";
import { toast } from "react-toastify";
import { ConfigAdminFormData, ConfigAdminFormError } from "@/types/config-admin-form";
import { CONFIG_ADMIN_FIELDS } from "@/constants/config-admin-fields";
import { formatPhoneNumber } from "@/constants/config-admin-form";
import { validateConfigAdminField } from "@/lib/validation/config-admin-validation";
import { 
  TextInput, 
  SelectInput, 
  DatePickerInput, 
  TextAreaInput,
  FieldLabel
} from "@/components/forms/FormComponents";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDateForApi(isoDate: string): string {
  if (!isoDate) return "";
  const [yyyy, mm, dd] = isoDate.split("-");
  return `${dd}-${mm}-${yyyy}`;
}

export const ConfigAdminCreateView = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<ConfigAdminFormData>({
    name: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    email: "",
    remarks: "",
    username: "",
  });

  const [errors, setErrors] = useState<ConfigAdminFormError>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicture(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFieldChange = (name: keyof ConfigAdminFormData, value: any) => {
    let finalValue = value;

    // Auto-format phone numbers
    if (name === 'mobileNumber' || name === 'alternateMobileNumber') {
      finalValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    // Validate on change if there was an error
    if (errors[name]) {
      const error = validateConfigAdminField(name, finalValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof ConfigAdminFormData) => {
    const error = validateConfigAdminField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors: ConfigAdminFormError = {};
    let hasErrors = false;

    CONFIG_ADMIN_FIELDS.forEach(field => {
      const error = validateConfigAdminField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    if (hasErrors) return;

    setLoading(true);
    setApiError("");

    try {
      await createConfigAdmin({
        name: formData.name,
        gender: formData.gender,
        designation: "Configuration Admin", // Default as required by API
        dateOfBirth: formData.dateOfBirth ? formatDateForApi(formData.dateOfBirth) : "",
        mobileNumber: formData.mobileNumber.replace(/\D/g, ''),
        alternateMobileNumber: formData.alternateMobileNumber.replace(/\D/g, '') || undefined,
        email: formData.email || undefined,
        remarks: formData.remarks || undefined,
        username: formData.username,
        profileImageUrl: profilePicture || undefined,
        assigned_school_ids: [],
      });

      toast.success("Configuration admin created successfully");
      router.push("/super-admin/configuration-admin");
    } catch (err: any) {
      const axiosMsg = err?.response?.data?.message;
      setApiError(axiosMsg || err?.message || "Failed to create configuration admin.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = useMemo(() => {
    const requiredFields: (keyof ConfigAdminFormData)[] = ['name', 'gender', 'mobileNumber', 'username'];
    const hasRequired = requiredFields.every(field => !!formData[field]);
    const noErrors = Object.values(errors).every(error => !error);
    return hasRequired && noErrors;
  }, [formData, errors]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <PageWrapper>
      <PageHeader title="Create Configuration Admin" showBack />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 animate-in slide-in-from-bottom-4 duration-500 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)]">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            Profile Information
          </p>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Photo Upload Section */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <FieldLabel label="Profile Photo" />
              <div
                onClick={() => !previewUrl && fileInputRef.current?.click()}
                className={`w-32 h-32 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden ${
                  previewUrl
                    ? "border-blue-200 cursor-default p-0"
                    : "border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer"
                }`}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400">
                      <Upload size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload</span>
                  </>
                )}
              </div>
              {previewUrl && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                >
                  <X size={10} /> Remove
                </button>
              )}
              {!previewUrl && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-widest"
                >
                  Choose File
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Config-Driven Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {CONFIG_ADMIN_FIELDS.map((field) => {
                const commonProps = {
                  key: field.name,
                  label: field.label,
                  placeholder: field.placeholder,
                  required: field.required,
                  error: errors[field.name],
                  onBlur: () => handleBlur(field.name),
                };

                switch (field.type) {
                  case 'select':
                    return (
                      <SelectInput
                        {...commonProps}
                        options={field.options || []}
                        value={formData[field.name] as string}
                        onValueChange={(val) => handleFieldChange(field.name, val)}
                      />
                    );
                  case 'date':
                    return (
                      <DatePickerInput
                        {...commonProps}
                        value={formData[field.name] as string}
                        onChange={(iso) => handleFieldChange(field.name, iso)}
                      />
                    );
                  case 'textarea':
                    return (
                      <TextAreaInput
                        {...commonProps}
                        className="md:col-span-2"
                        value={formData[field.name] as string}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        maxChar={300}
                        rows={3}
                      />
                    );
                  default:
                    return (
                      <TextInput
                        {...commonProps}
                        type={field.type}
                        value={formData[field.name] as string}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      />
                    );
                }
              })}
            </div>
          </div>
        </div>

        {apiError && <ErrorBanner message={apiError} onDismiss={() => setApiError("")} />}

        <div className="flex justify-end gap-4 pt-4 pb-12 animate-in slide-in-from-bottom-4 duration-500 delay-150">
          <SecondaryButton type="button" onClick={() => router.back()} disabled={loading} className="px-8 py-3.5 rounded-2xl">
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
            className="px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest"
          >
            {loading && <Loader2 size={14} className="animate-spin mr-2" />}
            {loading ? "Creating..." : "Create Config Admin"}
          </PrimaryButton>
        </div>
      </div>
    </PageWrapper>
  );
};
