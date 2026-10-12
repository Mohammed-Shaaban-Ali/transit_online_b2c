"use client";

import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

type Props = {
  title: string;
  backLabel: string;
  onBack: () => void;
  controller: ReactNode;
  children: ReactNode;
  nextLabel: string;
  onNext?: () => void;
  nextDisabled?: boolean;
};

function CruiseStepLayout({
  title,
  backLabel,
  onBack,
  controller,
  children,
  nextLabel,
  onNext,
  nextDisabled,
}: Props) {
  return (
    <div className="mx-auto max-w-[1200px] pb-28 lg:pb-10">
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50"
          aria-label={backLabel}
        >
          <ChevronLeft className="size-5 rtl:rotate-180" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 md:text-2xl">{title}</h2>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-3 lg:gap-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:col-span-1 lg:self-start">
          {controller}

          <button
            type="button"
            onClick={onNext}
            disabled={!onNext || nextDisabled}
            className="hidden h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
          >
            {nextLabel}
          </button>
        </aside>

        <div className="min-w-0 lg:col-span-2">{children}</div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 p-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={onNext}
          disabled={!onNext || nextDisabled}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

export default CruiseStepLayout;
