import ExpiredDialog from "@/components/shared/ExpiredDialog";
import { useTranslations } from "next-intl";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";

type Props = { error: any };

function ErrorSection({ error }: Props) {
  const t = useTranslations("FlightDetails");

  // Check if error status is EXPIRED_FLIGHTS
  // RTK Query errors can have the status in different places
  const errorData = (error as any)?.data;

  // If expired flights, show dialog instead of error message
  if (errorData?.error_code === "EXPIRED_FLIGHTS") {
    return <ExpiredDialog isFlight={true} />;
  }

  // Regular error display
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div
        className="bg-red-100 rounded-full flex items-center justify-center mb-4"
        style={{ width: "80px", height: "80px" }}
      >
        <FaInfoCircle className="text-red-500" size={32} />
      </div>
      <h5 className="text-red-500 mb-2">{t("errorTitle")}</h5>
      <p className="text-gray-500 text-center mb-0">{t("errorDescription")}</p>
    </div>
  );
}

export default ErrorSection;
