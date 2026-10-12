"use client";

import { Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CruiseHero from "@/components/pages/cruises/CruiseHero";
import { useCruiseSearchFromUrl } from "@/hooks/useCruiseSearchFromUrl";
import { useAppSelector } from "@/redux/app/hooks";
import CruiseResultsContent from "./CruiseResultsContent";

function CruisePageLayoutInner() {
  const { hasSearchParams } = useCruiseSearchFromUrl();
  const isSearchLoading = useAppSelector(
    (state) => state.cruiseSearch.isSearchLoading,
  );
  const showResults = hasSearchParams || isSearchLoading;

  return (
    <section className="relative">
      <motion.div
        layout
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <CruiseHero centered={!showResults} />
      </motion.div>

      <AnimatePresence mode="wait">
        {showResults && (
          <motion.section
            key="cruise-results"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-0 min-w-0 bg-white py-6 md:-mt-16 md:rounded-t-[32px] md:py-12"
          >
            <CruiseResultsContent />
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function CruisePageLayout() {
  return (
    <Suspense fallback={null}>
      <CruisePageLayoutInner />
    </Suspense>
  );
}
