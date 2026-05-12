"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface FinePrintCardProps {
  notes?: string[];
  initialVisibleCount?: number;
}

const DEFAULT_NOTES = [
  'To implement the relevant provisions of the "Shanghai Municipal Regulations on Domestic Waste Management" and promote the reduction of domestic waste at the source, the Shanghai Municipal Administration of Culture and Tourism has formulated the "Implementation Opinions on the Prohibition of Providing Disposable Daily Necessities in Hotel Rooms in Shanghai." Starting July 1, 2019, hotel rooms in Shanghai will no longer proactively provide disposable daily necessities such as toothbrushes, combs, bath sponges, razors, nail files, and shoe polish. Please consult your hotel if needed.',
  "Check-in time is from 14:30 and check-out is before 12:00. Early check-in and late check-out are subject to availability and may incur additional charges.",
  "Children policy: Children of any age are welcome. Children 12 years and above are considered adults at this property. To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.",
  "Pets are not allowed.",
  "The property reserves the right to pre-authorize the credit card prior to arrival.",
];

const FinePrintCard = ({
  notes = DEFAULT_NOTES,
  initialVisibleCount = 1,
}: FinePrintCardProps) => {
  const t = useTranslations("HotelBooking");
  const [expanded, setExpanded] = useState(false);

  if (!notes || notes.length === 0) return null;

  const visibleNotes = expanded ? notes : notes.slice(0, initialVisibleCount);
  const hasMore = notes.length > initialVisibleCount;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        {/* Title */}
        <h3 className="text-20 font-bold mb-3">{t("finePrint")}</h3>

        {/* Notes */}
        <ul className="space-y-3 text-14 text-gray-800 leading-relaxed">
          {visibleNotes.map((note, idx) => (
            <li
              key={idx}
              className="ps-4 relative before:content-['•'] before:absolute before:start-0 before:text-gray-800"
            >
              {note}
            </li>
          ))}
        </ul>

        {/* Show More / Show Less */}
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 text-14 text-gray-800 hover:text-primary underline underline-offset-2 transition-colors"
          >
            {expanded ? t("showLess") : t("showMore")}
          </button>
        )}
      </div>
    </div>
  );
};

export default FinePrintCard;
