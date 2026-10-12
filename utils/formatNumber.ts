/**
 * Display locale for dates/times: Arabic labels when UI is ar,
 * always with Latin (English) digits.
 */
export function getDisplayLocale(locale: string): string {
  return locale === "ar" || locale.startsWith("ar")
    ? "ar-SA-u-nu-latn"
    : "en-US";
}

/** Format a number with Latin (English) digits only — never Arabic-Indic. */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return Number(value || 0).toLocaleString("en-US", options);
}
