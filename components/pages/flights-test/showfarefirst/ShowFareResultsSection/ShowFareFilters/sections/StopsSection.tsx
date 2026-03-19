"use client";

import { useState } from "react";
import FilterRadioRow from "../FilterRadioRow";
import FilterSection from "../components/FilterSection";

function StopsSection() {
  const [selectedStop, setSelectedStop] = useState("one-stop");

  return (
    <FilterSection title="Stops" className="mb-4">
      <FilterRadioRow
        name="stops"
        label="1 stop or fewer"
        price="US$222"
        checked={selectedStop === "one-stop"}
        onCheckedChange={() => setSelectedStop("one-stop")}
      />
    </FilterSection>
  );
}

export default StopsSection;
