"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

interface VoucherButtonProps {
  voucherUrl?: string;
}

export default function VoucherButton({ voucherUrl }: VoucherButtonProps) {
  const t = useTranslations("MyBooking");

  if (!voucherUrl) return null;

  return (
    <a
      href={voucherUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-13 font-semibold text-primary transition-colors hover:bg-primary/10"
    >
      <Download className="h-3.5 w-3.5" />
      {t("downloadVoucher")}
    </a>
  );
}
