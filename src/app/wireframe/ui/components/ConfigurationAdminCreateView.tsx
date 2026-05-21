"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBasePath } from "./use-base-path";
import { Upload, X, Loader2, User, Mail, Phone, Info } from "lucide-react";
import { DateInput } from "@/components/ui/date-input";
import { FormSelect } from "@/components/ui/form-select";
import {
  PageWrapper,
  PageHeader,
  SecondaryButton,
  PrimaryButton,
  ErrorBanner,
} from "./ui";
import { createConfigAdmin } from "@/lib/services/config-admin-service";
import { toast } from "react-toastify";
import { FORM_INPUT as INPUT, FORM_INPUT_ERROR as INPUT_ERROR } from './styles';

function formatDateForApi(isoDate: string): string {
  if (!isoDate) return "";
  const [yyyy, mm, dd] = isoDate.split("-");
  return `${dd}-${mm}-${yyyy}`;
}

function formatMobile(val: string): string {
  const d = val.replace(/\D/g, "").slice(0, 10);
  if (d.length > 6) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return d;
}

const FieldLabel = ({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) => (
  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
    {label} {required && <span className="text-red-500">*</span>}
  </label>
);

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
      {msg}
    </p>
  ) : null;

export const ConfigurationAdminCreateView = () => {
  const router = useRouter();
  const base = useBasePath();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    designation: "",
    gender: "MALE",
    dateOfBirth: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    email: "",
    remarks: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const validateField = (name: string, value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let error = "";

    switch (name) {
      case "name":
        if (!value) error = "Name is required";
        else if (value.length > 50) error = "Max 50 characters";
        else if (!/^[a-zA-Z\s'\-.]+$/.test(value))
          error = "Only letters, apostrophe, hyphen, dot";
        break;
      case "username":
        if (!value) error = "Username is required";
        else if (value.length < 6) error = "Min 6 characters";
        else if (!/^[a-zA-Z0-9_]+$/.test(value))
          error = "Letters, numbers, underscore only";
        break;
      case "designation":
        if (!value) error = "Designation is required";
        else if (value.length > 100) error = "Max 100 characters";
        break;
      case "gender":
        if (!value) error = "Gender is required";
        break;
      case "mobileNumber":
        if (!value) error = "Mobile number is required";
        else if (value.replace(/\D/g, "").length !== 10)
          error = "Enter valid 10-digit number";
        break;
      case "alternateMobileNumber":
        if (value && value.replace(/\D/g, "").length !== 10)
          error = "Enter valid 10-digit number";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!emailRegex.test(value)) error = "Enter valid email";
        break;
      case "dateOfBirth":
        if (value) {
          const dob = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (dob >= today) error = "Date of birth cannot be a future date";
        }
        break;
      case "remarks":
        if (value.length > 200) error = "Max 200 characters";
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    let filtered = value;

    if (name === "dateOfBirth") {
      setFormData((prev) => ({ ...prev, dateOfBirth: value }));
      if (errors[name]) validateField(name, value);
      return;
    } else if (name === "name") {
      filtered = value.replace(/[^a-zA-Z\s'\-.]/g, "").slice(0, 50);
    } else if (name === "username") {
      filtered = value.replace(/[^a-zA-Z0-9_]/g, "");
    } else if (name === "mobileNumber" || name === "alternateMobileNumber") {
      filtered = formatMobile(value.replace(/\D/g, "").slice(0, 10));
    } else if (name === "remarks") {
      filtered = value.slice(0, 200);
    }

    setFormData((prev) => ({ ...prev, [name]: filtered }));
    if (errors[name]) validateField(name, filtered);
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const name = e.target.name as keyof typeof formData;
    validateField(name, formData[name]);
  };

  const handleSubmit = async () => {
    const fields: (keyof typeof formData)[] = [
      "name",
      "username",
      "designation",
      "gender",
      "mobileNumber",
      "email",
    ];
    if (formData.alternateMobileNumber) fields.push("alternateMobileNumber");
    if (formData.dateOfBirth) fields.push("dateOfBirth");
    if (formData.remarks) fields.push("remarks");

    const valid = fields
      .map((f) => validateField(f, formData[f]))
      .every(Boolean);
    if (!valid) return;

    setLoading(true);
    setApiError("");

    try {
      await createConfigAdmin({
        name: formData.name,
        username: formData.username,
        designation: formData.designation,
        gender: formData.gender,
        mobileNumber: formData.mobileNumber.replace(/\D/g, ""),
        email: formData.email,
        dateOfBirth: formData.dateOfBirth
          ? formatDateForApi(formData.dateOfBirth)
          : "",
        alternateMobileNumber:
          formData.alternateMobileNumber.replace(/\D/g, "") || undefined,
        remarks: formData.remarks || undefined,
        profileImageUrl: profilePicture || undefined,
        assigned_school_ids: [],
      });

      toast.success("Configuration admin created successfully");
      router.push(`${base}/configuration-admin`);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Failed to create configuration admin.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormReady =
    formData.name.length > 0 &&
    formData.username.length >= 6 &&
    formData.designation.length > 0 &&
    formData.gender !== "" &&
    formData.mobileNumber.replace(/\D/g, "").length === 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    Object.values(errors).every((e) => e === "");

  return (
    <PageWrapper>
      <PageHeader title="New Configuration Admin" showBack />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 sm:p-12 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-4 duration-500">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10">
            Profile Information
          </p>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Photo */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <FieldLabel label="Profile Photo" />
              <div
                onClick={() => !previewUrl && fileInputRef.current?.click()}
                className={`w-36 h-36 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden ${
                  previewUrl
                    ? "border-blue-200 cursor-default p-0"
                    : "border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer"
                }`}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                      <Upload size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Upload Image
                    </span>
                  </>
                )}
              </div>
              {previewUrl && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                >
                  <X size={10} /> Remove Image
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <FieldLabel label="Full Name" required />
                  <div className="relative group/input">
                    <User
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors"
                    />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Samridh Kumar"
                      className={`${errors.name ? INPUT_ERROR : INPUT} pl-10`}
                    />
                  </div>
                  <ErrorMsg msg={errors.name} />
                </div>

                <div className="space-y-1">
                  <FieldLabel label="Username" required />
                  <div className="relative group/input">
                    <User
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors"
                    />
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. samridh_admin"
                      className={`${errors.username ? INPUT_ERROR : INPUT} pl-10`}
                    />
                  </div>
                  <ErrorMsg msg={errors.username} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <FieldLabel label="Designation" required />
                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Senior Administrator"
                    className={errors.designation ? INPUT_ERROR : INPUT}
                  />
                  <ErrorMsg msg={errors.designation} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <FieldLabel label="Gender" required />
                  <FormSelect
                    value={formData.gender}
                    onValueChange={(val) => {
                      setFormData((prev) => ({ ...prev, gender: val }));
                      validateField("gender", val);
                    }}
                    options={[
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                      { value: "OTHER", label: "Other" },
                    ]}
                    placeholder="Select gender"
                    error={!!errors.gender}
                  />
                  <ErrorMsg msg={errors.gender} />
                </div>

                <div className="space-y-1">
                  <FieldLabel label="Date of Birth" />
                  <div className="relative group/input">
                    <DateInput
                      value={formData.dateOfBirth}
                      onChange={(iso) => {
                        setFormData((prev) => ({ ...prev, dateOfBirth: iso }));
                        if (errors.dateOfBirth)
                          validateField("dateOfBirth", iso);
                      }}
                      onBlur={() =>
                        validateField("dateOfBirth", formData.dateOfBirth)
                      }
                      error={!!errors.dateOfBirth}
                      calendarDisabled={{ after: new Date() }}
                    />
                  </div>
                  <ErrorMsg msg={errors.dateOfBirth} />
                </div>

                <div className="space-y-1">
                  <FieldLabel label="Email Address" required />
                  <div className="relative group/input">
                    <Mail
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="email@example.com"
                      className={`${errors.email ? INPUT_ERROR : INPUT} pl-10`}
                    />
                  </div>
                  <ErrorMsg msg={errors.email} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <FieldLabel label="Mobile Number" required />
                  <div className="relative group/input">
                    <Phone
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors"
                    />
                    <input
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="XXXXXXXXXX"
                      className={`${errors.mobileNumber ? INPUT_ERROR : INPUT} pl-10`}
                    />
                  </div>
                  <ErrorMsg msg={errors.mobileNumber} />
                </div>

                <div className="space-y-1">
                  <FieldLabel label="Alternate Mobile" />
                  <div className="relative group/input">
                    <Phone
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors"
                    />
                    <input
                      name="alternateMobileNumber"
                      value={formData.alternateMobileNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Optional"
                      className={`${errors.alternateMobileNumber ? INPUT_ERROR : INPUT} pl-10`}
                    />
                  </div>
                  <ErrorMsg msg={errors.alternateMobileNumber} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end mb-1">
                  <FieldLabel label="Remarks" />
                  <span
                    className={`text-[10px] font-bold mb-1 ${formData.remarks.length >= 200 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {formData.remarks.length} / 200
                  </span>
                </div>
                <div className="relative group/input">
                  <Info
                    size={14}
                    className="absolute left-4 top-4 text-gray-300 group-focus-within/input:text-blue-500 transition-colors"
                  />
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Any additional notes..."
                    rows={3}
                    className={`${errors.remarks ? INPUT_ERROR : INPUT} pl-10 resize-none`}
                  />
                </div>
                <ErrorMsg msg={errors.remarks} />
              </div>
            </div>
          </div>
        </div>

        {apiError && (
          <ErrorBanner message={apiError} onDismiss={() => setApiError("")} />
        )}

        <div className="flex justify-end gap-4 pt-4 pb-12 animate-in slide-in-from-bottom-4 duration-500 delay-150">
          <SecondaryButton
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={handleSubmit}
            disabled={loading || !isFormReady}
            className="px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Creating..." : "Create Admin"}
          </PrimaryButton>
        </div>
      </div>
    </PageWrapper>
  );
};
