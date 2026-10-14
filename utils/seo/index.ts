export { getSiteUrl, absoluteUrl, localizedPath } from "./siteUrl";
export {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  PAGE_SEO,
  SITEMAP_PATHS,
  type PageSeoKey,
  type SeoLocaleCopy,
} from "./pages";
export { buildPageMetadata, buildRootMetadata } from "./buildPageMetadata";
export { createPageGenerateMetadata } from "./createPageGenerateMetadata";
export { fetchFeaturedDestinationServer } from "./fetchFeaturedDestinationServer";
export {
  buildHotelSearchMetadata,
  buildHotelDetailMetadata,
  buildHotelBookingMetadata,
} from "./hotelDynamicMeta";
export { buildFlightResultsMetadata } from "./flightDynamicMeta";
