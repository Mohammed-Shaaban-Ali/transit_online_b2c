"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CRUISE_PORT_OPTIONS,
  CRUISE_REGION_OPTIONS,
} from "@/constants/cruiseOptions";
import type { CruiseRegionCode } from "@/types/cruiseTypes";

type RegionProps = {
  value: CruiseRegionCode | "";
  onChange: (value: CruiseRegionCode | "") => void;
  error?: string;
  mobileStyle?: boolean;
};

type PortProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  mobileStyle?: boolean;
};

function OptionList({
  options,
  value,
  onSelect,
}: {
  options: { code: string; label: string }[];
  value: string;
  onSelect: (code: string) => void;
}) {
  return (
    <div className="max-h-72 space-y-2 overflow-y-auto p-1">
      {options.map((option) => {
        const selected = option.code === value;
        return (
          <button
            key={option.code || "all"}
            type="button"
            onClick={() => onSelect(option.code)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border px-3 py-3 text-start text-sm font-medium transition-colors",
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-gray-200 bg-white text-gray-800 hover:border-primary/40",
            )}
          >
            <span>{option.label}</span>
            {selected && <Check className="size-4 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

export function CruiseRegionPopover({
  value,
  onChange,
  error,
  mobileStyle = false,
}: RegionProps) {
  const t = useTranslations("CruiseSearchForm");
  const [open, setOpen] = useState(false);

  const options = useMemo(
    () =>
      CRUISE_REGION_OPTIONS.map((option) => ({
        code: option.code,
        label: t(`regions.${option.labelKey}`),
      })),
    [t],
  );

  const selectedLabel =
    options.find((option) => option.code === value)?.label ||
    t("regions.allRegions");

  return (
    <div className="relative min-w-0 flex-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {mobileStyle ? (
            <button
              type="button"
              className="flex h-[54px] w-full items-center gap-2.5 px-1 text-start"
            >
              <MapPin size={18} className="shrink-0 text-gray-600" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] leading-none text-gray-500">
                  {t("regionLabel")}
                </p>
                <p className="mt-0.5 truncate text-[15px] font-medium text-black">
                  {selectedLabel}
                </p>
              </div>
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            </button>
          ) : (
            <button
              type="button"
              className={cn(
                "flex h-[58px] w-full items-center gap-3 rounded-sm border px-3 text-start transition-colors hover:border-primary/40",
                error ? "border-red-400" : "border-gray-300",
              )}
            >
              <MapPin size={20} className="shrink-0 text-gray-600" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] leading-none text-gray-500">
                  {t("regionLabel")}
                </p>
                <p className="mt-1 truncate text-[15px] font-medium text-black">
                  {selectedLabel}
                </p>
              </div>
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-[min(100vw-32px,360px)] rounded-md border border-gray-200 bg-white p-3 shadow-xl"
        >
          <p className="mb-3 text-sm font-semibold text-gray-900">
            {t("selectRegion")}
          </p>
          <OptionList
            options={options}
            value={value}
            onSelect={(code) => {
              onChange(code as CruiseRegionCode | "");
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function CruisePortPopover({
  value,
  onChange,
  error,
  mobileStyle = false,
}: PortProps) {
  const t = useTranslations("CruiseSearchForm");
  const [open, setOpen] = useState(false);

  const options = useMemo(
    () =>
      CRUISE_PORT_OPTIONS.map((option) => ({
        code: option.code,
        label: t(`ports.${option.labelKey}`),
      })),
    [t],
  );

  const selectedLabel =
    options.find((option) => option.code === value)?.label ||
    t("ports.allPorts");

  return (
    <div className="relative min-w-0 flex-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {mobileStyle ? (
            <button
              type="button"
              className="flex h-[54px] w-full items-center gap-2.5 px-1 text-start"
            >
              <MapPin size={18} className="shrink-0 text-gray-600" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] leading-none text-gray-500">
                  {t("portLabel")}
                </p>
                <p className="mt-0.5 truncate text-[15px] font-medium text-black">
                  {selectedLabel}
                </p>
              </div>
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            </button>
          ) : (
            <button
              type="button"
              className={cn(
                "flex h-[58px] w-full items-center gap-3 rounded-sm border px-3 text-start transition-colors hover:border-primary/40",
                error ? "border-red-400" : "border-gray-300",
              )}
            >
              <MapPin size={20} className="shrink-0 text-gray-600" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] leading-none text-gray-500">
                  {t("portLabel")}
                </p>
                <p className="mt-1 truncate text-[15px] font-medium text-black">
                  {selectedLabel}
                </p>
              </div>
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-[min(100vw-32px,360px)] rounded-md border border-gray-200 bg-white p-3 shadow-xl"
        >
          <p className="mb-3 text-sm font-semibold text-gray-900">
            {t("selectPort")}
          </p>
          <OptionList
            options={options}
            value={value}
            onSelect={(code) => {
              onChange(code);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
