"use client";

import Image from "next/image";

interface ProtectionBenefitItemProps {
  label: string;
  imageSrc: string;
}

export default function ProtectionBenefitItem({
  label,
  imageSrc,
}: ProtectionBenefitItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2">
      <Image
        src={imageSrc}
        alt={label}
        width={20}
        height={20}
        className="h-5 w-5 object-contain"
      />
      <span className="text-[14px] font-medium text-slate-900">{label}</span>
    </div>
  );
}
