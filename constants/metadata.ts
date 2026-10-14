import type { Metadata } from "next";
import { buildRootMetadata, getSiteUrl } from "@/utils/seo";

/** @deprecated Prefer getSiteUrl() from @/utils/seo */
export const domain = getSiteUrl();

/** Fallback static metadata (locale layout uses generateMetadata). */
export const metadata: Metadata = buildRootMetadata("en");
