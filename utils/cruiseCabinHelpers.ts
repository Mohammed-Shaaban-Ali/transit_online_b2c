import type {
  CruiseCabinGuestSlot,
  CruiseCabinsMultipleCategoryRequest,
  CruiseCabinsMultipleRequest,
  CruiseCategoriesCabinRequest,
  CruiseCategoriesRequest,
  CruiseGuestType,
  CruiseSearchFormState,
} from "@/types/cruiseTypes";

export const CRUISE_DEFAULT_FARE_CODE = "BESTPRICE";

export function createCruiseGuestSlots(
  adults: number,
  children: number,
  infants: number,
): CruiseCabinGuestSlot[] {
  const slots: CruiseCabinGuestSlot[] = [];

  for (let i = 0; i < adults; i += 1) {
    slots.push({
      id: `ADT-${i + 1}`,
      type: "ADT",
      index: i + 1,
      cabinIndex: 0,
    });
  }
  for (let i = 0; i < children; i += 1) {
    slots.push({
      id: `CHD-${i + 1}`,
      type: "CHD",
      index: i + 1,
      cabinIndex: 0,
    });
  }
  for (let i = 0; i < infants; i += 1) {
    slots.push({
      id: `INF-${i + 1}`,
      type: "INF",
      index: i + 1,
      cabinIndex: 0,
    });
  }

  return slots;
}

export function getMaxCruiseCabinCount(adults: number) {
  return Math.max(1, adults);
}

export function redistributeCruiseGuestSlots(
  slots: CruiseCabinGuestSlot[],
  cabinCount: number,
): CruiseCabinGuestSlot[] {
  const safeCabinCount = Math.max(1, cabinCount);
  const next = slots.map((slot) => ({
    ...slot,
    cabinIndex: Math.min(slot.cabinIndex, safeCabinCount - 1),
  }));

  const adults = next.filter((slot) => slot.type === "ADT");

  // Place one adult in each cabin first.
  adults.forEach((adult, index) => {
    const target = next.find((slot) => slot.id === adult.id);
    if (!target) return;
    target.cabinIndex = index < safeCabinCount ? index : 0;
  });

  // Ensure every cabin has at least one adult.
  for (let cabinIndex = 0; cabinIndex < safeCabinCount; cabinIndex += 1) {
    const hasAdult = next.some(
      (slot) => slot.type === "ADT" && slot.cabinIndex === cabinIndex,
    );
    if (hasAdult) continue;

    const donor = next.find((slot) => {
      if (slot.type !== "ADT") return false;
      const adultsInCabin = next.filter(
        (entry) => entry.type === "ADT" && entry.cabinIndex === slot.cabinIndex,
      ).length;
      return adultsInCabin > 1;
    });

    if (donor) {
      donor.cabinIndex = cabinIndex;
    }
  }

  return next;
}

export function assignGuestToCabin(
  slots: CruiseCabinGuestSlot[],
  guestId: string,
  cabinIndex: number,
): CruiseCabinGuestSlot[] | null {
  const next = slots.map((slot) =>
    slot.id === guestId ? { ...slot, cabinIndex } : { ...slot },
  );

  const cabinCount =
    Math.max(...next.map((slot) => slot.cabinIndex), 0) + 1 || 1;

  for (let i = 0; i < cabinCount; i += 1) {
    const adultsInCabin = next.filter(
      (slot) => slot.type === "ADT" && slot.cabinIndex === i,
    ).length;
    const guestsInCabin = next.filter((slot) => slot.cabinIndex === i).length;
    if (guestsInCabin > 0 && adultsInCabin < 1) {
      return null;
    }
  }

  return next;
}

export function slotsToCabinGuestPayload(
  slots: CruiseCabinGuestSlot[],
  cabinCount: number,
): CruiseCategoriesCabinRequest[] {
  return Array.from({ length: cabinCount }, (_, cabinIndex) => {
    const cabinSlots = slots.filter((slot) => slot.cabinIndex === cabinIndex);
    const counts: Record<CruiseGuestType, number> = {
      ADT: 0,
      CHD: 0,
      INF: 0,
    };

    cabinSlots.forEach((slot) => {
      counts[slot.type] += 1;
    });

    const guests = (Object.keys(counts) as CruiseGuestType[])
      .filter((type) => counts[type] > 0)
      .map((type) => ({ type, quantity: counts[type] }));

    return { guests };
  });
}

export function buildCruiseCategoriesRequest(params: {
  voyageId: string;
  shipCode: string;
  fareCode?: string;
  slots: CruiseCabinGuestSlot[];
  cabinCount: number;
}): CruiseCategoriesRequest {
  return {
    voyageId: params.voyageId,
    shipCode: params.shipCode,
    fareCode: params.fareCode || CRUISE_DEFAULT_FARE_CODE,
    cabins: slotsToCabinGuestPayload(params.slots, params.cabinCount),
  };
}

export function summarizeCabinGuests(
  slots: CruiseCabinGuestSlot[],
  cabinIndex: number,
): { adults: number; children: number; infants: number } {
  const cabinSlots = slots.filter((slot) => slot.cabinIndex === cabinIndex);
  return {
    adults: cabinSlots.filter((slot) => slot.type === "ADT").length,
    children: cabinSlots.filter((slot) => slot.type === "CHD").length,
    infants: cabinSlots.filter((slot) => slot.type === "INF").length,
  };
}

export function getCategoryBadgeLabel(genericCode?: string | null): string {
  const code = (genericCode || "").toUpperCase();
  if (code === "I" || code === "IB") return "INTERIOR";
  if (code === "O" || code === "OB") return "OCEAN VIEW";
  if (code === "B" || code === "BA") return "BALCONY";
  if (code === "S" || code === "SU") return "SUITE";
  return code || "CABIN";
}

export function getCategoryFareAmount(
  priceInfos?: { attributesMap?: { amount?: string | null } }[],
): number {
  const fare = priceInfos?.find(
    (info) =>
      info.attributesMap?.amount &&
      !Number.isNaN(Number(info.attributesMap.amount)),
  );
  return fare?.attributesMap?.amount ? Number(fare.attributesMap.amount) : 0;
}

export function getSearchGuestTotals(
  form: Pick<CruiseSearchFormState, "adults" | "children" | "infants">,
) {
  return {
    adults: Math.max(1, form.adults),
    children: Math.max(0, form.children),
    infants: Math.max(0, form.infants),
  };
}

export function buildCruiseCabinsMultipleRequest(params: {
  voyageId: string;
  slots: CruiseCabinGuestSlot[];
  cabinCount: number;
  categoryCodesByCabin: Record<number, string>;
}): CruiseCabinsMultipleRequest {
  const guestsByCabin = slotsToCabinGuestPayload(
    params.slots,
    params.cabinCount,
  );

  const categories: CruiseCabinsMultipleCategoryRequest[] = Array.from(
    { length: params.cabinCount },
    (_, cabinIndex) => ({
      categoryCode: params.categoryCodesByCabin[cabinIndex] || "",
      guests: guestsByCabin[cabinIndex]?.guests || [],
    }),
  ).filter((entry) => Boolean(entry.categoryCode));

  return {
    voyageId: params.voyageId,
    categories,
  };
}

export function isGuaranteeCabin(
  deckNumber?: string | null,
  cabinNumber?: string | null,
) {
  return (
    deckNumber == null ||
    deckNumber === "" ||
    (cabinNumber || "").toUpperCase() === "GTY"
  );
}

export function getShipSideLabelKey(shipSide?: string | null) {
  const value = (shipSide || "").toLowerCase();
  if (value === "starboard") return "starboard";
  if (value === "port") return "port";
  return null;
}

export function getPositionInShipLabelKey(position?: string | null) {
  const value = (position || "").toLowerCase();
  if (value === "forward") return "forward";
  if (value === "aft") return "aft";
  if (value === "midship" || value === "mid-ship") return "midship";
  return null;
}

export function getUniqueDeckNumbers(
  cabinOptions: { attributesMap?: { deckNumber?: string | null } }[],
) {
  const decks = new Set<string>();
  cabinOptions.forEach((option) => {
    const deck = option.attributesMap?.deckNumber;
    if (deck != null && deck !== "") decks.add(String(deck));
  });
  return Array.from(decks).sort((a, b) => Number(a) - Number(b));
}

/** Stable guest refs: ADT then CHD then INF, preserving slot order within type. */
export function buildOrderedGuestRefs(slots: CruiseCabinGuestSlot[]) {
  const order: CruiseGuestType[] = ["ADT", "CHD", "INF"];
  const ordered = order.flatMap((type) =>
    slots.filter((slot) => slot.type === type),
  );

  return ordered.map((slot, index) => ({
    ...slot,
    guestRefNumber: index + 1,
  }));
}

export function buildCruiseBookCabinsPayload(params: {
  cabinCount: number;
  slots: CruiseCabinGuestSlot[];
  categoryCodesByCabin: Record<number, string>;
  cabinNumbersByCabin: Record<number, string>;
}) {
  const refs = buildOrderedGuestRefs(params.slots);

  return Array.from({ length: params.cabinCount }, (_, cabinIndex) => {
    const guestRefNumbers = refs
      .filter((slot) => slot.cabinIndex === cabinIndex)
      .map((slot) => slot.guestRefNumber);

    return {
      categoryCode: params.categoryCodesByCabin[cabinIndex] || "",
      cabinNumber: params.cabinNumbersByCabin[cabinIndex] || "",
      guestRefNumbers,
    };
  }).filter(
    (cabin) => cabin.categoryCode && cabin.cabinNumber && cabin.guestRefNumbers.length,
  );
}
