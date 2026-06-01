"use client";

import { useState } from "react";
import FilterCheckboxRow from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection/ShowFareFilters/FilterCheckboxRow";

export default function StaticFiltersPanel() {
  return (
    <>
      <StaticFilterSection title="Popular Filters for Shanghai">
        {[
          "China travel essentials",
          "Nanjing Road Pedestrian Street",
          "Hotel",
          "Breakfast included",
          "Great 9+",
          "2 beds",
          "Free cancellation",
          "Jing'an District",
          "Within 1 km",
          "Pool",
        ].map((item) => (
          <StaticCheckboxRow key={item} label={item} />
        ))}
      </StaticFilterSection>

      <StaticFilterSection title="Diamond rating">
        {[2, 3, 4, 5].map((count) => (
          <StaticCheckboxRowWithIcon
            key={count}
            icon={
              <span className="flex items-center gap-0.5">
                {Array.from({ length: count }).map((_, i) => (
                  <DiamondIcon key={i} />
                ))}
              </span>
            }
          />
        ))}
      </StaticFilterSection>

      <StaticFilterSection title="Location">
        <StaticRadioGroup
          initialCount={3}
          items={[
            "The Bund",
            "Nanjing Road Pedestrian Street",
            "People's Square",
            "Pudong",
            "Lujiazui",
            "Hongqiao",
          ].map((s) => ({ key: s, label: s }))}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Meals">
        <StaticRadioGroup
          items={[
            "Breakfast included",
            "Dinner included",
            "Breakfast & Dinner Included",
            "All Meals Included",
            "All-inclusive (snacks included)",
          ].map((s) => ({ key: s, label: s }))}
          initialCount={3}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Bed Type">
        <StaticRadioGroup
          initialCount={3}
          items={[
            "1 double bed",
            "2 beds",
            "1 single bed",
            "King bed",
            "Twin beds",
          ].map((s) => ({ key: s, label: s }))}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Room features">
        <StaticRadioGroup
          initialCount={3}
          items={[
            "Family room",
            "Suite",
            "Oceanview room",
            "Balcony",
            "gita.com Parent-child Room",
            "Lake view room",
            "Loft",
            "Room With Projector",
            "Japanese-style rooms",
            "Mountain view room",
            "Private villa",
            "Mahjong/Games Room",
            "Room With Waterbed",
            "Room With Round Bed",
            "gita.com Cinema Room",
            "Deep Sleep Themed Room",
            "Bed in dormitory",
          ].map((s) => ({ key: s, label: s }))}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Room packages">
        <StaticCheckboxList
          initialCount={3}
          items={[
            "All packages",
            "Buffet dinner package",
            "Room upgrade package",
            "Honeymoon package",
            "Spa package",
          ]}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Guest Rating">
        <StaticCheckboxList
          initialCount={3}
          items={[
            "Pleasant 6+",
            "Good 7+",
            "Very Good 8+",
            "Excellent 9+",
            "Perfect 10",
          ]}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Property facilities & services">
        <StaticCheckboxList
          initialCount={3}
          items={[
            "Pool",
            "Gym",
            "Laundry room",
            "Spa",
            "Restaurant",
            "Bar",
            "Parking",
            "Airport shuttle",
          ]}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Room facilities & services">
        <StaticCheckboxList
          initialCount={3}
          items={[
            "Bathtub",
            "Washing machine",
            "Private bathroom",
            "Air conditioning",
            "Minibar",
            "Safe",
          ]}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Opening/renovation time">
        <StaticCheckboxList
          items={["Within 6 months", "Within 1 year", "Within 2 years"]}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Property Features">
        <StaticCheckboxList
          initialCount={3}
          items={[
            "Great views",
            "Family-friendly",
            "Scenic nightscapes",
            "Beachfront",
            "Adults only",
            "Boutique",
          ]}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Guest Impressions">
        <StaticCheckboxList
          initialCount={3}
          items={[
            "Ideal location",
            "Lots to do",
            "Sparkling clean",
            "Comfy beds",
            "Great breakfast",
            "Friendly staff",
          ]}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Room Size">
        <StaticRadioGroup
          items={["≥ 25m²", "≥ 30m²", "≥ 55m²"].map((s) => ({
            key: s,
            label: s,
          }))}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Payment">
        <StaticRadioGroup
          initialCount={3}
          items={[
            "Prepay Online",
            "Book now, pay later",
            "Pay at Hotel",
            "Pay by points",
          ].map((s) => ({ key: s, label: s }))}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Booking Policy">
        <StaticCheckboxList
          items={["Instant confirmation", "Free cancellation"]}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Discounts">
        <StaticCheckboxList items={["Extra gita Coin Rewards"]} />
      </StaticFilterSection>

      <StaticFilterSection title="Brand">
        <StaticCheckboxList
          initialCount={3}
          items={[
            "24K Hotel",
            "7Days Inn",
            "7 Premium",
            "Accor",
            "Hilton",
            "Marriott",
            "IHG",
            "Wyndham",
          ]}
        />
      </StaticFilterSection>

      <StaticFilterSection title="Reviews">
        <StaticCheckboxList items={["500+", "200+", "100+"]} />
      </StaticFilterSection>

      <StaticFilterSection title="Accessibility">
        <StaticCheckboxList
          initialCount={3}
          items={[
            "Assistive listening devices",
            "Handrails on stairs",
            "Handrails in hallways",
            "Wheelchair accessible",
            "Elevator",
          ]}
        />
      </StaticFilterSection>
    </>
  );
}

function StaticFilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-300 pb-4 mb-4">
      <div className="mb-1.5">
        <h4 className="text-[16px] font-semibold">{title}</h4>
      </div>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function StaticCheckboxList({
  items,
  initialCount = 3,
}: {
  items: string[];
  initialCount?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, initialCount);
  const hasMore = items.length > initialCount;
  return (
    <>
      {visible.map((item) => (
        <StaticCheckboxRow key={item} label={item} />
      ))}
      {hasMore && (
        <ToggleBtn expanded={showAll} onToggle={() => setShowAll((v) => !v)} />
      )}
    </>
  );
}

function StaticCheckboxRow({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <FilterCheckboxRow
      label={label}
      checked={checked}
      onCheckedChange={() => setChecked((v) => !v)}
    />
  );
}

function StaticCheckboxRowWithIcon({ icon }: { icon: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  return (
    <FilterCheckboxRow
      label=""
      checked={checked}
      onCheckedChange={() => setChecked((v) => !v)}
      icon={icon}
    />
  );
}

function StaticRadioGroup({
  items,
  initialCount,
}: {
  items: { label: React.ReactNode; key: string }[];
  initialCount?: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const limit = initialCount ?? items.length;
  const visible = showAll ? items : items.slice(0, limit);
  const hasMore = items.length > limit;
  return (
    <>
      {visible.map((item) => (
        <label
          key={item.key}
          onClick={() =>
            setSelected((prev) => (prev === item.key ? null : item.key))
          }
          className="flex cursor-pointer font-normal items-center gap-2 rounded-md px-2 py-1.5 text-[14px] hover:bg-white transition-colors"
        >
          <span
            className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected === item.key ? "border-gray-900" : "border-gray-400"
            }`}
          >
            {selected === item.key && (
              <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
            )}
          </span>
          <span>{item.label}</span>
        </label>
      ))}
      {hasMore && (
        <ToggleBtn expanded={showAll} onToggle={() => setShowAll((v) => !v)} />
      )}
    </>
  );
}

function ToggleBtn({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-2 flex items-center gap-1 text-[14px] font-medium text-gray-900 underline hover:no-underline px-2"
    >
      {expanded ? <>Show Less</> : <>Show More</>}
    </button>
  );
}

function DiamondIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="#f59e0b"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L2 9l10 13L22 9 12 2z" />
    </svg>
  );
}
