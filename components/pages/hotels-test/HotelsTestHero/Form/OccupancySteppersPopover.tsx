"use client";

import { useEffect, useMemo, useState } from "react";
import { UseFormReturn, useFormState } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { RiUserLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { FaMinus, FaPlus } from "react-icons/fa";
import type { HotelsTestFormValues } from "./HotelsTestHotelSearchForm";

const MAX_ROOMS = 8;
const MAX_GUESTS_PER_ROOM = 8;

type Room = { AdultsCount: number; KidsAges: number[] };

type Props = {
  form: UseFormReturn<HotelsTestFormValues>;
};

function OccupancyStepper({
  value,
  onDec,
  onInc,
  decDisabled,
  incDisabled,
  ariaDecrease,
  ariaIncrease,
}: {
  value: number;
  onDec: () => void;
  onInc: () => void;
  decDisabled: boolean;
  incDisabled: boolean;
  ariaDecrease: string;
  ariaIncrease: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={onDec}
        disabled={decDisabled}
        className={cn(
          "flex size-7 items-center justify-center rounded-full border leading-none transition-colors",
          decDisabled
            ? "cursor-not-allowed border-gray-300 bg-white text-gray-300"
            : "border-primary text-primary hover:bg-primary hover:text-white",
        )}
        aria-label={ariaDecrease}
      >
        <FaMinus className="size-2.5" />
      </button>
      <span className="min-w-[28px] text-center text-[14px] font-semibold tabular-nums text-slate-700">
        {value}
      </span>
      <button
        type="button"
        onClick={onInc}
        disabled={incDisabled}
        className={cn(
          "flex size-7 items-center justify-center rounded-full border leading-none transition-colors",
          incDisabled
            ? "cursor-not-allowed border-gray-300 bg-white text-gray-300"
            : "border-primary text-primary hover:bg-primary hover:text-white",
        )}
        aria-label={ariaIncrease}
      >
        <FaPlus className="size-2.5" />
      </button>
    </div>
  );
}

type TranslateFn = (
  key: string,
  values?: Record<string, string | number>,
) => string;

type RoomCardProps = {
  room: Room;
  index: number;
  rooms: Room[];
  setRooms: (next: Room[]) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  tg: TranslateFn;
  tAria: TranslateFn;
};

function RoomCard({
  room,
  index,
  rooms,
  setRooms,
  onRemove,
  canRemove,
  tg,
  tAria,
}: RoomCardProps) {
  const totalGuestsInRoom = room.AdultsCount + room.KidsAges.length;
  const canAddAdult = totalGuestsInRoom < MAX_GUESTS_PER_ROOM;
  const canAddChild = totalGuestsInRoom < MAX_GUESTS_PER_ROOM;

  const handleAdultChange = (value: number) => {
    const capped = Math.max(
      1,
      Math.min(value, MAX_GUESTS_PER_ROOM - room.KidsAges.length),
    );
    const newRooms = [...rooms];
    newRooms[index] = { ...room, AdultsCount: capped };
    setRooms(newRooms);
  };

  const handleChildChange = (value: number) => {
    const maxChildren = MAX_GUESTS_PER_ROOM - room.AdultsCount;
    const newCount = Math.max(0, Math.min(value, maxChildren));
    const newKidsAges =
      newCount > room.KidsAges.length
        ? [...room.KidsAges, ...Array(newCount - room.KidsAges.length).fill(0)]
        : room.KidsAges.slice(0, newCount);

    const newRooms = [...rooms];
    newRooms[index] = { ...room, KidsAges: newKidsAges };
    setRooms(newRooms);
  };

  const handleAgeChange = (childIndex: number, age: number) => {
    const newKidsAges = [...room.KidsAges];
    newKidsAges[childIndex] = age;
    const newRooms = [...rooms];
    newRooms[index] = { ...room, KidsAges: newKidsAges };
    setRooms(newRooms);
  };

  return (
    <div
      className={cn(
        "pb-4",
        index < rooms.length - 1 && "mb-4 border-b border-gray-200",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h6 className="text-base font-semibold text-neutral-700">
          {tg("roomNo", { number: index + 1 })}
        </h6>
        {canRemove ? (
          <button
            type="button"
            className="cursor-pointer rounded px-2 py-0.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
            onClick={() => onRemove(index)}
          >
            {tg("removeRoom")}
          </button>
        ) : null}
      </div>

      <div className="mb-2 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="flex w-full items-center justify-between gap-3">
          <span className="whitespace-nowrap text-sm font-medium text-slate-600">
            {tg("adults")}
          </span>
          <OccupancyStepper
            value={room.AdultsCount}
            decDisabled={room.AdultsCount <= 1}
            incDisabled={!canAddAdult}
            onDec={() => handleAdultChange(Math.max(1, room.AdultsCount - 1))}
            onInc={() => handleAdultChange(room.AdultsCount + 1)}
            ariaDecrease={tAria("decreaseQuantity")}
            ariaIncrease={tAria("increaseQuantity")}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-3">
          <span className="whitespace-nowrap text-sm font-medium text-slate-600">
            {tg("children")}
          </span>
          <OccupancyStepper
            value={room.KidsAges.length}
            decDisabled={room.KidsAges.length === 0}
            incDisabled={!canAddChild}
            onDec={() =>
              handleChildChange(Math.max(0, room.KidsAges.length - 1))
            }
            onInc={() => handleChildChange(room.KidsAges.length + 1)}
            ariaDecrease={tAria("decreaseQuantity")}
            ariaIncrease={tAria("increaseQuantity")}
          />
        </div>
      </div>

      {room.KidsAges.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
          {room.KidsAges.map((age: number, idx: number) => (
            <div key={idx} className="mb-1">
              <label className="mb-1 block text-xs text-gray-500">
                {tg("childAge", { number: idx + 1 })}
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={age}
                onChange={(e) =>
                  handleAgeChange(idx, Number.parseInt(e.target.value, 10))
                }
              >
                {Array.from({ length: 18 }, (_, i) => (
                  <option key={i} value={i}>
                    {i} {i === 1 ? tg("year") : tg("years")} {tg("old")}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : null}
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
  const rawRooms = watch("rooms");
  const rooms =
    rawRooms && rawRooms.length > 0
      ? rawRooms
      : [{ AdultsCount: 2, KidsAges: [] as number[] }];

  useEffect(() => {
    if (!open) return;
    if (!rawRooms?.length) {
      setValue("rooms", [{ AdultsCount: 2, KidsAges: [] }]);
    }
  }, [open, rawRooms, setValue]);

  const setRooms = (next: Room[]) => {
    setValue("rooms", next);
  };

  const roomCount = rooms.length;
  const totalAdults = useMemo(
    () => rooms.reduce((s, r) => s + r.AdultsCount, 0),
    [rooms],
  );
  const totalChildren = useMemo(
    () => rooms.reduce((s, r) => s + r.KidsAges.length, 0),
    [rooms],
  );

  const summary = th("occupancySummary", {
    rooms: roomCount,
    roomsWord: roomCount === 1 ? tg("room") : tg("rooms"),
    adults: totalAdults,
    adultsLabel: tg("adultsLabel"),
    children: totalChildren,
    childrenLabel: tg("childrenNoun"),
  });

  const addRoom = () => {
    if (rooms.length >= MAX_ROOMS) return;
    setRooms([...rooms, { AdultsCount: 2, KidsAges: [] }]);
  };

  const removeRoom = (index: number) => {
    if (rooms.length <= 1) return;
    setRooms(rooms.filter((_, idx) => idx !== index));
  };

  return (
    <div className="relative flex min-w-0 flex-1 flex-col self-stretch">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-full w-full min-w-0 flex-1 items-center gap-3 px-3.5 py-2 text-start sm:px-2",
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
            "z-50 w-[min(100vw-24px,380px)] max-w-[520px] bg-white p-0",
            "rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.06)]",
          )}
        >
          <div
            className="max-h-[min(70vh,250px)] overflow-y-auto px-5 pt-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {rooms.map((room, index) => (
              <RoomCard
                key={index}
                room={room}
                index={index}
                rooms={rooms}
                setRooms={setRooms}
                onRemove={removeRoom}
                canRemove={rooms.length > 1}
                tg={tg}
                tAria={t}
              />
            ))}

            {/* <div className="mx-auto flex items-center justify-center py-3">
              <Button
                type="button"
                variant="outline-primary"
                size="icon"
                className="size-10 rounded-full"
                onClick={addRoom}
                disabled={rooms.length >= MAX_ROOMS}
                aria-label={t("addRoom")}
              >
                <FaPlus className="size-4" />
              </Button>
            </div> */}
          </div>
          <div className="flex justify-between items-center gap-2 border-t border-gray-100 p-4">
            <Button
              type="button"
              variant="outline-primary"
              // size="icon"
              // className="size-10 rounded-full"
              onClick={addRoom}
              disabled={rooms.length >= MAX_ROOMS}
              aria-label={t("addRoom")}
              size={"lg"}
              className=" text-[14px] font-bold  "
            >
              <FaPlus className="size-4" />
              {t("addRoom")}
            </Button>
            <Button
              size="lg"
              type="button"
              onClick={() => setOpen(false)}
              className="bg-primary px-6 py-2.5 text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              {t("done")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {roomsMsg ? (
        <p className="mt-1 px-3.5 text-xs font-medium text-red-500">
          {roomsMsg}
        </p>
      ) : null}
    </div>
  );
}

export default OccupancySteppersPopover;
