"use client";

import { useMemo, useState } from "react";
import { UseFormReturn, useFormState } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { RiUserLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { FaMinus, FaPlus } from "react-icons/fa";
import type { HotelsTestFormValues } from "./HotelsTestHotelSearchForm";

const MAX_ROOMS = 8;
const MAX_GUESTS_PER_ROOM = 8;

type Room = { AdultsCount: number; KidsAges: number[] };

function distributeAdults(rooms: Room[], targetTotal: number): Room[] {
  const n = rooms.length;
  if (n === 0) return rooms;
  const caps = rooms.map((r) => MAX_GUESTS_PER_ROOM - r.KidsAges.length);
  const maxSum = caps.reduce((a, b) => a + b, 0);
  const minSum = n;
  let t = Math.max(minSum, Math.min(targetTotal, maxSum));
  let remaining = t - n;
  const adults = rooms.map(() => 1);
  for (let i = 0; i < n && remaining > 0; i++) {
    const canAdd = caps[i] - 1;
    const add = Math.min(remaining, canAdd);
    adults[i] += add;
    remaining -= add;
  }
  return rooms.map((r, i) => ({ ...r, AdultsCount: adults[i] }));
}

type Props = {
  form: UseFormReturn<HotelsTestFormValues>;
};

function StepperRow({
  label,
  hint,
  value,
  onDec,
  onInc,
  decDisabled,
  incDisabled,
}: {
  label: string;
  hint?: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  decDisabled: boolean;
  incDisabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-2.5 last:pb-2">
      <div className="min-w-0 flex gap-2 items-center">
        <p className="text-[14px]  leading-tight ">{label}</p>
        {hint ? (
          <p className="mt-1 text-[11px] leading-snug text-black/50">{hint}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onDec}
          disabled={decDisabled}
          className={cn(
            "flex size-6 items-center justify-center rounded-full border  leading-none transition-colors",
            decDisabled
              ? "cursor-not-allowed border-gray-300 bg-white text-gray-300"
              : "border-primary text-primary hover:bg-primary hover:text-white",
          )}
          aria-label="Decrease"
        >
          <FaMinus className="size-2.5" />
        </button>
        <span className="min-w-[30px] text-center text-[14px]  tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={onInc}
          disabled={incDisabled}
          className={cn(
            "flex size-6 items-center justify-center rounded-full border  leading-none transition-colors",
            incDisabled
              ? "cursor-not-allowed border-gray-300 bg-white text-gray-300"
              : "border-primary text-primary hover:bg-primary hover:text-white",
          )}
          aria-label="Increase"
        >
          <FaPlus className="size-2.5" />
        </button>
      </div>
    </div>
  );
}

function OccupancySteppersPopover({ form }: Props) {
  const t = useTranslations("HotelsTestPage.HotelSearchForm");
  const th = useTranslations("Components.HotelSearchBox.hero");
  const tg = useTranslations("Components.HotelSearchBox.GuestSearch");
  const [open, setOpen] = useState(false);
  const { watch, setValue, control } = form;
  const { errors } = useFormState({ control });
  const roomsMsg = errors.rooms?.message as string | undefined;
  const rooms = watch("rooms") || [{ AdultsCount: 2, KidsAges: [] }];

  const roomCount = rooms.length;
  const totalAdults = useMemo(
    () => rooms.reduce((s, r) => s + r.AdultsCount, 0),
    [rooms],
  );
  const totalChildren = useMemo(
    () => rooms.reduce((s, r) => s + r.KidsAges.length, 0),
    [rooms],
  );

  const maxAdultsPossible = rooms.reduce(
    (s, r) => s + (MAX_GUESTS_PER_ROOM - r.KidsAges.length),
    0,
  );
  const minAdultsPossible = roomCount;

  const maxChildrenForFirst = Math.max(
    0,
    MAX_GUESTS_PER_ROOM - (rooms[0]?.AdultsCount ?? 1),
  );

  const summary = th("occupancySummary", {
    rooms: roomCount,
    roomsWord: roomCount === 1 ? tg("room") : tg("rooms"),
    adults: totalAdults,
    adultsLabel: tg("adultsLabel"),
    children: totalChildren,
    childrenLabel: tg("childrenNoun"),
  });

  const setRoomsCount = (next: number) => {
    const n = Math.max(1, Math.min(MAX_ROOMS, next));
    const prev = watch("rooms") || [{ AdultsCount: 2, KidsAges: [] }];
    if (n === prev.length) return;
    if (n > prev.length) {
      const added = Array.from({ length: n - prev.length }, () => ({
        AdultsCount: 1,
        KidsAges: [] as number[],
      }));
      setValue("rooms", [...prev, ...added]);
      return;
    }
    setValue("rooms", prev.slice(0, n));
  };

  const setAdultsTotal = (target: number) => {
    const prev = watch("rooms") || [{ AdultsCount: 2, KidsAges: [] }];
    setValue("rooms", distributeAdults(prev, target));
  };

  const setChildrenTotal = (target: number) => {
    const prev = [...(watch("rooms") || [{ AdultsCount: 2, KidsAges: [] }])];
    const r0 = { ...prev[0] };
    const maxKids = MAX_GUESTS_PER_ROOM - r0.AdultsCount;
    const n = Math.max(0, Math.min(target, maxKids));
    r0.KidsAges = Array.from({ length: n }, (_, i) => r0.KidsAges[i] ?? 0);
    prev[0] = r0;
    setValue("rooms", prev);
  };

  return (
    <div className="relative flex  min-w-0 flex-1 flex-col self-stretch">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-full  w-full min-w-0 flex-1 items-center gap-3 px-3.5 py-2 text-start  sm:px-2",
              "rounded-md border-0 bg-transparent transition-colors duration-150",
              "hover:bg-primary/10 data-[state=open]:bg-primary/10",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/25",
            )}
          >
            <RiUserLine
              className="size-[18px] shrink-0 text-neutral-900 sm:size-5"
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-[15px] font-bold leading-snug text-slate-900 sm:text-[16px]">
              {summary}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[300px]  bg-white p-0",
            "rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.06)]",
          )}
        >
          <div className=" px-5 pt-2 pb-0">
            <StepperRow
              label={t("rooms")}
              value={roomCount}
              decDisabled={roomCount <= 1}
              incDisabled={roomCount >= MAX_ROOMS}
              onDec={() => setRoomsCount(roomCount - 1)}
              onInc={() => setRoomsCount(roomCount + 1)}
            />
            <StepperRow
              label={t("adults")}
              hint={t("adultsHint")}
              value={totalAdults}
              decDisabled={totalAdults <= minAdultsPossible}
              incDisabled={totalAdults >= maxAdultsPossible}
              onDec={() => setAdultsTotal(totalAdults - 1)}
              onInc={() => setAdultsTotal(totalAdults + 1)}
            />
            <StepperRow
              label={t("children")}
              hint={t("childrenHint")}
              value={totalChildren}
              decDisabled={totalChildren <= 0}
              incDisabled={totalChildren >= maxChildrenForFirst}
              onDec={() => setChildrenTotal(totalChildren - 1)}
              onInc={() => setChildrenTotal(totalChildren + 1)}
            />
          </div>
          <div className="flex justify-end p-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md bg-primary px-6 py-2.5 text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              {t("done")}
            </button>
          </div>
        </PopoverContent>
      </Popover>
      {roomsMsg ? (
        <p className="mt-1 px-3.5 text-xs font-medium text-red-500">{roomsMsg}</p>
      ) : null}
    </div>
  );
}

export default OccupancySteppersPopover;
