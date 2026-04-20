"use client";

import { ChevronRight, Circle } from "lucide-react";
import ProtectionBenefitItem from "./ProtectionBenefitItem";

const protectionBenefits = [
  { label: "Changes", imageSrc: "/images/Changes.webp" },
  { label: "Cancellations", imageSrc: "/images/Cancellations.webp" },
];

export default function CheckedBaggageProtection() {
  return (
    <section className="mt-2">
      <h3 className="mb-3 text-28 font-bold leading-none ">
        Checked baggage protection
      </h3>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h4 className="mb-3 text-[16px] font-semibold leading-none text-slate-900">
          Checked baggage protection
        </h4>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="max-w-[860px] text-[14px] leading-relaxed text-gray-600">
            <span className="mr-2 text-primary">✓</span>
            Your checked baggage will be protected throughout your flight. If
            your baggage is lost, please report it within 24 hours of your
            flight&apos;s arrival. We&apos;ll track your lost baggage for 96
            hours. If we are unable to find it, you&apos;ll be compensated{" "}
            <span className="font-semibold text-primary">
              US$1,000.00.
            </span>{" "}
            <button
              type="button"
              className="inline-flex items-center gap-1 font-medium text-primary"
            >
              View more
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 self-end md:self-start">
            <p className="text-[14px] text-slate-700">
              <span className="font-semibold text-primary">US$5.00</span>/person
            </p>
            <button
              type="button"
              aria-label="Select checked baggage protection"
            >
              <Circle size={20} className="text-primary" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {protectionBenefits.map((benefit) => (
            <ProtectionBenefitItem
              key={benefit.label}
              label={benefit.label}
              imageSrc={benefit.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
