import { Suspense } from "react";
import HotelsTestDetailsContent from "@/components/pages/hotels-test/HotelsTestDetailsContent";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";

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
    <>
      <NewNavbar />
      <Suspense fallback={<DetailsFallback />}>
        <HotelsTestDetailsContent />
      </Suspense>
    </>
  );
}
