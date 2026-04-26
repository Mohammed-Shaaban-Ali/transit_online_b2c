import React from "react";
import { AlertTriangle, CheckCircle2, Download, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  status?: "success" | "failed";
  totalAmount?: number;
  currency?: string;
  failureReason?: string | null;
};

function Payment({
  status = "success",
  totalAmount = 277.2,
  currency = "US$",
  failureReason,
}: Props) {
  const t = useTranslations("BookingDetails.Payment");
  const isSuccess = status === "success";
  const formattedAmount = `${currency}${Number(totalAmount || 0).toFixed(2)}`;

  return (
    <section className="space-y-6 bg-white px-6 py-8 rounded">
      <h3 className="text-24 font-bold leading-none ">
        {isSuccess ? t("successfulPayment") : t("failedPayment")}
      </h3>

      <div
        className={`rounded p-5 ${isSuccess ? "border border-[#d8f2e2] bg-[#f6fffa]" : "border border-[#ffd9d9] bg-[#fff7f7]"}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {isSuccess ? (
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#08a75a]" />
            ) : (
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-[#e45858]" />
            )}
            <div className="space-y-2">
              <p className="text-18 font-bold leading-none text-[#0e1a2f]">
                {isSuccess
                  ? t("paymentCompleted")
                  : t("paymentNotCompleted")}
              </p>
              <p className="text-14 font-normal leading-tight text-gray-500">
                {isSuccess
                  ? t("successDescription")
                  : failureReason ||
                    t("failureDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Payment;
