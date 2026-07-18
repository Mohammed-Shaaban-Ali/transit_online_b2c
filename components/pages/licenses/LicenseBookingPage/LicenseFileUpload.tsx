"use client";

import { useRef } from "react";
import { CloudUpload, Camera, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

const MAX_FILE_SIZE_MB = 10;

interface LicenseFileUploadProps {
  id: string;
  label: string;
  hint: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  variant?: "cloud" | "camera";
  disabled?: boolean;
}

export default function LicenseFileUpload({
  id,
  label,
  hint,
  value,
  onChange,
  error,
  variant = "cloud",
  disabled = false,
}: LicenseFileUploadProps) {
  const t = useTranslations("LicenseBooking");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error(t("validation.invalidFileType"));
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(t("validation.fileTooLarge", { size: MAX_FILE_SIZE_MB }));
      return false;
    }
    return true;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (!file) return;
    if (!validateFile(file)) return;
    onChange(file);
  };

  const clearFile = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(null);
  };

  const Icon = variant === "camera" ? Camera : CloudUpload;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-14 font-semibold text-slate-800">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 transition-colors",
          error
            ? "border-red-400 bg-red-50/50"
            : value
              ? "border-primary/40 bg-primary/5"
              : "border-gray-300 bg-gray-50 hover:border-primary/40 hover:bg-primary/5",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <Icon className="h-7 w-7 text-primary" strokeWidth={1.75} />
        {value ? (
          <div className="flex max-w-full items-center gap-2">
            <span className="truncate text-13 font-medium text-slate-700">
              {value.name}
            </span>
            <span
              role="button"
              tabIndex={0}
              onClick={clearFile}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") clearFile(e as unknown as React.MouseEvent);
              }}
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm hover:text-red-500"
              aria-label={t("removeFile")}
            >
              <X className="h-3.5 w-3.5" />
            </span>
          </div>
        ) : (
          <span className="text-13 text-slate-500">{hint}</span>
        )}
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(",")}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      {error ? <p className="text-12 text-red-500">{error}</p> : null}
    </div>
  );
}
