"use client";

import dynamic from "next/dynamic";

const CruiseResultsSection = dynamic(() => import("./CruiseResultsSection"), {
  ssr: false,
});

function CruiseResultsContent() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-5">
      <CruiseResultsSection />
    </div>
  );
}

export default CruiseResultsContent;
