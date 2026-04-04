"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { searchHotelsParams } from "..";
import { RiUserFill } from "react-icons/ri";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePerfectScrollbar from "@/hooks/usePerfectScrollbar";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { HotelHeroField } from "../hero/HotelHeroField";
import { cn } from "@/lib/utils";

const MAX_GUESTS_PER_ROOM = 8;

interface Room {
  AdultsCount: number;
  KidsAges: number[];
}

interface RoomCardProps {
  room: Room;
  index: number;
  form: UseFormReturn<searchHotelsParams & { searchValue?: string }>;
  onRemove: (index: number) => void;
}

const RoomCard = ({ room, index, form, onRemove }: RoomCardProps) => {
  const t = useTranslations("Components.HotelSearchBox.GuestSearch");
  const { setValue, watch } = form;
  const rooms = watch("rooms");

  const totalGuestsInRoom = room.AdultsCount + room.KidsAges.length;
  const canAddAdult = totalGuestsInRoom < MAX_GUESTS_PER_ROOM;
  const canAddChild = totalGuestsInRoom < MAX_GUESTS_PER_ROOM;

  const handleAdultChange = (value: number) => {
    const capped = Math.max(1, Math.min(value, MAX_GUESTS_PER_ROOM - room.KidsAges.length));
    const newRooms = [...rooms];
    newRooms[index] = { ...room, AdultsCount: capped };
    setValue("rooms", newRooms);
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
    setValue("rooms", newRooms);
  };

  const handleAgeChange = (childIndex: number, age: number) => {
    const newKidsAges = [...room.KidsAges];
    newKidsAges[childIndex] = age;

    const newRooms = [...rooms];
    newRooms[index] = { ...room, KidsAges: newKidsAges };
    setValue("rooms", newRooms);
  };

  return (
    <div
      className={`mb-4 pb-4 ${index < rooms.length - 1 ? "border-b border-gray-200" : ""
        }`}
    >
      <div className="flex justify-between items-center gap-2">
        <h6 className="mb-1 font-semibold text-[#636363] text-base">
          {t("roomNo", { number: index + 1 })}
        </h6>
        {rooms.length > 1 && (
          <button
            type="button"
            className="text-sm flex items-center justify-center border-0 p-0.5 px-2 rounded hover:bg-red-500/10 cursor-pointer text-red-500 transition-colors"
            onClick={() => onRemove(index)}
          >
            {t("removeRoom")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
        <div className="w-full flex justify-between items-center gap-2">
          <span className="font-medium text-[#6E7491] text-sm whitespace-nowrap">
            {t("adults")}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`text-xl font-bold flex items-center justify-center border-0 p-0 w-7 h-7 text-[#605DEC] rounded transition-colors ${room.AdultsCount <= 1
                ? "bg-gray-50 cursor-not-allowed opacity-50"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() =>
                handleAdultChange(Math.max(1, room.AdultsCount - 1))
              }
              disabled={room.AdultsCount <= 1}
            >
              −
            </button>
            <span className="font-semibold text-[#6E7491] flex items-center justify-center text-sm">
              {room.AdultsCount}
            </span>
            <button
              type="button"
              className={`text-xl font-bold flex items-center justify-center border-0 p-0 w-7 h-7 text-[#605DEC] rounded transition-colors ${!canAddAdult
                ? "bg-gray-50 cursor-not-allowed opacity-50"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() => handleAdultChange(room.AdultsCount + 1)}
              disabled={!canAddAdult}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-2">
          <span className="font-medium text-[#6E7491] text-sm whitespace-nowrap">
            {t("children")}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`text-xl font-bold flex items-center justify-center border-0 p-0 w-7 h-7 text-[#605DEC] rounded transition-colors ${room.KidsAges.length === 0
                ? "bg-gray-50 cursor-not-allowed opacity-50"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() =>
                handleChildChange(Math.max(0, room.KidsAges.length - 1))
              }
              disabled={room.KidsAges.length === 0}
            >
              −
            </button>
            <span className="font-semibold text-[#6E7491] flex items-center justify-center text-sm">
              {room.KidsAges.length}
            </span>
            <button
              type="button"
              className={`text-xl font-bold flex items-center justify-center border-0 p-0 w-7 h-7 text-[#605DEC] rounded transition-colors ${!canAddChild
                ? "bg-gray-50 cursor-not-allowed opacity-50"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() => handleChildChange(room.KidsAges.length + 1)}
              disabled={!canAddChild}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {room.KidsAges.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-3">
          {room.KidsAges.map((age: number, idx: number) => (
            <div key={idx} className="mb-2">
              <label className="block text-gray-500 mb-1 text-xs">
                {t("childAge", { number: idx + 1 })}
              </label>
              <select
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={age}
                onChange={(e) => handleAgeChange(idx, parseInt(e.target.value))}
              >
                {Array.from({ length: 18 }, (_, i) => (
                  <option key={i} value={i}>
                    {i} {i === 1 ? t("year") : t("years")} {t("old")}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface GuestSearchProps {
  form: UseFormReturn<searchHotelsParams & { searchValue?: string }>;
  variant?: "default" | "hero";
}

const GuestSearch = ({ form, variant = "default" }: GuestSearchProps) => {
  const t = useTranslations("Components.HotelSearchBox.GuestSearch");
  const th = useTranslations("Components.HotelSearchBox.hero");
  const [open, setOpen] = useState(false);
  const scrollRef = usePerfectScrollbar({
    suppressScrollX: true,
    wheelPropagation: false,
  });

  const { setValue, watch } = form;
  const rooms = watch("rooms");

  const addRoom = () => {
    setValue("rooms", [...rooms, { AdultsCount: 2, KidsAges: [] }]);
  };

  const removeRoom = (index: number) => {
    setValue(
      "rooms",
      rooms.filter((_, idx) => idx !== index)
    );
  };

  const getTotalAdults = () => {
    return rooms.reduce((total, room) => total + room.AdultsCount, 0);
  };

  const getTotalChildren = () => {
    return rooms.reduce((total, room) => total + room.KidsAges.length, 0);
  };

  const getDisplayText = () => {
    const totalAdults = getTotalAdults();
    const totalChildren = getTotalChildren();
    const totalRooms = rooms.length;
    const totalGuests = totalAdults + totalChildren;

    if (totalChildren > 0) {
      return t("guestsInRooms", {
        guests: totalGuests,
        guestLabel: totalGuests === 1 ? t("guest") : t("guests"),
        rooms: totalRooms,
        roomLabel: totalRooms === 1 ? t("room") : t("rooms"),
      });
    }
    return t("adultsInRooms", {
      adults: totalAdults,
      adultsLabel: t("adultsLabel"),
      rooms: totalRooms,
      roomLabel: totalRooms === 1 ? t("room") : t("rooms"),
    });
  };

  const getHeroDisplayText = () => {
    const totalAdults = getTotalAdults();
    const totalChildren = getTotalChildren();
    const totalRooms = rooms.length;
    return th("occupancySummary", {
      rooms: totalRooms,
      roomsWord: totalRooms === 1 ? t("room") : t("rooms"),
      adults: totalAdults,
      adultsLabel: t("adultsLabel"),
      children: totalChildren,
      childrenLabel: t("childrenNoun"),
    });
  };

  const hasValue = rooms && rooms.length > 0;
  const isActive = open || hasValue;

  return (
    <div
      className={cn(
        "relative col-span-1",
        variant === "default" && "ms-12",
        variant === "hero" && "min-w-0 flex-1"
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {variant === "hero" ? (
            <button
              type="button"
              className="w-full min-w-0 cursor-pointer text-start"
            >
              <HotelHeroField active={open}>
                <div className="flex w-full min-w-0 items-center gap-2">
                  <RiUserFill
                    size={18}
                    className="shrink-0 text-gray-500"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-gray-900">
                    {getHeroDisplayText()}
                  </span>
                </div>
              </HotelHeroField>
            </button>
          ) : (
            <div className="relative flex h-16 cursor-pointer items-center bg-transparent px-4 transition-all duration-300">
              <label
                className={`pointer-events-none absolute font-bold transition-all duration-200 ${
                  isActive
                    ? "-top-0.5 text-gray-500"
                    : "top-1/2 -translate-y-1/2 text-gray-500"
                }`}
              >
                {t("guestsAndRooms")}
              </label>
              <div className="relative flex items-center gap-0">
                <RiUserFill
                  size={16}
                  className={`absolute top-[15px] start-0 ${
                    isActive ? "text-gray-400" : "text-transparent"
                  }`}
                />
                <div
                  className={`w-full bg-transparent p-0 font-bold text-black outline-none ${
                    isActive ? "mt-4 ps-6" : ""
                  }`}
                >
                  {getDisplayText()}
                </div>
              </div>
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "p-0 shadow-2xl",
            variant === "hero"
              ? "w-[min(100vw-24px,520px)] rounded-xl border border-gray-100"
              : "w-full sm:min-w-[500px]"
          )}
          align="start"
          sideOffset={8}
        >
          <div
            className={cn(
              "custom-scrollbar rounded-lg bg-white",
              variant === "hero" ? "p-4" : "p-4"
            )}
            style={{
              maxHeight: "500px",
              position: "relative",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            ref={scrollRef}
          >
            {rooms.map((room, index) => (
              <RoomCard
                key={index}
                room={room}
                index={index}
                form={form}
                onRemove={removeRoom}
              />
            ))}

            <div className="mx-auto my-2 flex items-center justify-center">
              <Button
                variant="outline-primary"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={addRoom}
              >
                <FaPlus />
              </Button>
            </div>

            {variant === "hero" ? (
              <div className="mt-3 flex justify-end border-t border-gray-100 pt-3">
                <Button
                  type="button"
                  className="rounded-md px-6 font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {t("select")}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                className="mt-2 h-11 w-full rounded-full"
                onClick={() => setOpen(false)}
              >
                {t("select")}
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default GuestSearch;
