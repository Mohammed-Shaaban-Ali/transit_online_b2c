"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FaCheck, FaPassport, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useReadPassportMutation } from "@/redux/features/flights/flightsApi";
import { mapPassportToPassengerFields } from "@/utils/mapPassportToPassengerFields";
import type {
  MappedPassportFields,
  PassportReadData,
} from "@/types/passportTypes";
import { cn } from "@/lib/utils";

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "application/pdf",
];

const MAX_FILE_SIZE_MB = 10;

interface PassportUploadProps {
  onSuccess: (
    fields: MappedPassportFields,
    rawPassport: PassportReadData,
  ) => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "compact";
}

export default function PassportUpload({
  onSuccess,
  disabled = false,
  className,
  variant = "default",
}: PassportUploadProps) {
  const t = useTranslations("PassportUpload");
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isFilled, setIsFilled] = useState(false);
  const [readPassport, { isLoading }] = useReadPassportMutation();

  const validateFile = (file: File) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error(t("invalidFileType"));
      return false;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(t("fileTooLarge", { size: MAX_FILE_SIZE_MB }));
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFileName(file.name);

    try {
      const response = await readPassport(file).unwrap();

      if (!response.success || !response.passport) {
        toast.error(response.message || t("readError"));
        return;
      }

      const fields = mapPassportToPassengerFields(response.passport);
      onSuccess(fields, response.passport);
      setIsFilled(true);
      toast.success(t("success"));
    } catch {
      toast.error(t("readError"));
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (disabled || isLoading) return;

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    await processFile(file);
  };

  const isCompact = variant === "compact";
  const compactLabel = isLoading
    ? t("uploading")
    : isFilled
      ? t("compactFilled")
      : t("compactLabel");

  return (
    <div className={cn(isCompact ? "shrink-0" : "w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(",")}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isLoading}
      />

      {isCompact ? (
        <button
          type="button"
          title={t("hint")}
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isLoading}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors",
            isFilled
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10",
            (disabled || isLoading) && "pointer-events-none opacity-60",
          )}
        >
          {isLoading ? (
            <FaSpinner className="size-3 animate-spin" />
          ) : isFilled ? (
            <FaCheck className="size-3" />
          ) : (
            <FaPassport className="size-3" />
          )}
          <span className="max-w-[120px] truncate">{compactLabel}</span>
        </button>
      ) : (
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col gap-3 rounded-lg border border-dashed border-[#d7dce3] bg-slate-50/60 p-4 md:flex-row md:items-center md:justify-between",
            (disabled || isLoading) && "pointer-events-none opacity-60",
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {isLoading ? (
                <FaSpinner className="animate-spin text-base" />
              ) : (
                <FaPassport className="text-base" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-[14px] font-semibold text-slate-900">
                {isLoading ? t("uploading") : t("title")}
              </p>
              <p className="text-[12px] text-slate-500">{t("hint")}</p>
              {selectedFileName ? (
                <p className="text-[12px] font-medium text-primary">
                  {selectedFileName}
                </p>
              ) : null}
            </div>
          </div>

          <Button
            type="button"
            variant="outline-primary"
            className="h-10 shrink-0 rounded-lg px-4 text-[14px]"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isLoading}
          >
            {isLoading ? t("uploading") : t("uploadButton")}
          </Button>
        </div>
      )}
    </div>
  );
}
