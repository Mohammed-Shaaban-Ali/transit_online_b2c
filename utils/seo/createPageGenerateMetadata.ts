import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "./buildPageMetadata";
import type { PageSeoKey } from "./pages";

type LocaleParams = { locale?: string };

/** Factory for static page `generateMetadata` exports. */
export function createPageGenerateMetadata(
  page: PageSeoKey,
  path?: string,
  indexable?: boolean,
) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<LocaleParams>;
  }): Promise<Metadata> {
    const resolved = await params;
    const locale = resolved.locale || (await getLocale());
    return buildPageMetadata({ locale, page, path, indexable });
  };
}
