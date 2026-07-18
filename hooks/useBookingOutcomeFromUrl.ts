"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

const readStoredOutcome = (
  storageKey: string,
): "success" | "failed" | null => {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(storageKey);
  return stored === "success" || stored === "failed" ? stored : null;
};

const readOutcomeFromUrl = (): "success" | "failed" | null => {
  if (typeof window === "undefined") return null;
  const successParam = new URLSearchParams(window.location.search)
    .get("success")
    ?.toLowerCase();
  if (successParam === "true") return "success";
  if (successParam === "false") return "failed";
  return null;
};

export function useBookingOutcomeFromUrl(storageKey: string) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [outcome, setOutcome] = useState<"success" | "failed">(
    () => readOutcomeFromUrl() ?? readStoredOutcome(storageKey) ?? "failed",
  );

  useEffect(() => {
    const successParam = searchParams.get("success")?.toLowerCase();

    if (successParam === "true" || successParam === "false") {
      const resolved = successParam === "true" ? "success" : "failed";
      setOutcome(resolved);
      sessionStorage.setItem(storageKey, resolved);

      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      return;
    }

    const stored = readStoredOutcome(storageKey);
    if (stored) setOutcome(stored);
  }, [searchParams, router, pathname, storageKey]);

  return outcome;
}

/** Reads `?success=` once, strips it from the URL, and does not persist across refresh. */
export function usePaymentOutcomeFromUrl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [outcome, setOutcome] = useState<"success" | "failed" | null>(null);

  useEffect(() => {
    const successParam = searchParams.get("success")?.toLowerCase();
    if (successParam !== "true" && successParam !== "false") return;

    setOutcome(successParam === "true" ? "success" : "failed");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("success");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  return outcome;
}
