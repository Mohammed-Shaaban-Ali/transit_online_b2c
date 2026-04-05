import { Suspense } from "react";
import HotelsTestDetailsContent from "@/components/pages/hotels-test/HotelsTestDetailsContent";

function DetailsFallback() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="h-10 max-w-md animate-pulse rounded-md bg-muted" />
      <div className="mt-6 h-32 w-full animate-pulse rounded-md bg-muted" />
    </section>
  );
}

export default function HotelsTestDetailsPage() {
  return (
    <Suspense fallback={<DetailsFallback />}>
      <HotelsTestDetailsContent />
    </Suspense>
  );
}
