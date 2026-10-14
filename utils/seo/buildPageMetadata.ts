import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import {
  DEFAULT_OG_IMAGE,
  PAGE_SEO,
  SITE_NAME,
  type PageSeoKey,
  type SeoLocaleCopy,
} from "./pages";
import { absoluteUrl, getSiteUrl, localizedPath } from "./siteUrl";

type BuildPageMetadataOptions = {
  locale: string;
  page?: PageSeoKey;
  path?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string | null;
  indexable?: boolean;
  /** Root layout only — sets default title + `%s | Gita` template. */
  isRoot?: boolean;
};

function pickCopy(
  locale: string,
  page: PageSeoKey | undefined,
): SeoLocaleCopy | undefined {
  if (!page) return undefined;
  const config = PAGE_SEO[page];
  return locale === "ar" ? config.ar : config.en;
}

function resolveImage(image?: string | null): string {
  if (!image) return DEFAULT_OG_IMAGE;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return image;
  return `https://gita.sa/storage/${image}`;
}

export function buildPageMetadata({
  locale,
  page,
  path,
  title,
  description,
  keywords,
  image,
  indexable,
  isRoot = false,
}: BuildPageMetadataOptions): Metadata {
  const copy = pickCopy(locale, page);
  const pageConfig = page ? PAGE_SEO[page] : undefined;
  const resolvedPath = path ?? pageConfig?.path ?? "/";
  const shouldIndex = indexable ?? pageConfig?.indexable ?? true;

  const pageTitle = title?.trim() || copy?.title || SITE_NAME;
  const pageDescription =
    description?.trim() ||
    copy?.description ||
    (locale === "ar"
      ? "احجز الفنادق والطيران والرحلات مع جيتا."
      : "Book hotels, flights, and trips with Gita.");
  const pageKeywords = keywords?.length
    ? keywords
    : copy?.keywords || [SITE_NAME];

  const canonicalPath = localizedPath(locale, resolvedPath);
  const canonical = absoluteUrl(canonicalPath);
  const ogImage = resolveImage(image);
  const ogLocale = locale === "ar" ? "ar_SA" : "en_US";
  const socialTitle =
    pageTitle === SITE_NAME ? SITE_NAME : `${SITE_NAME} | ${pageTitle}`;

  const languageAlternates = Object.fromEntries(
    routing.locales.map((loc) => [
      loc,
      absoluteUrl(localizedPath(loc, resolvedPath)),
    ]),
  );

  return {
    title: isRoot
      ? {
          default: socialTitle,
          template: `${SITE_NAME} | %s`,
        }
      : pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical,
      languages: {
        ...languageAlternates,
        "x-default": absoluteUrl(
          localizedPath(routing.defaultLocale, resolvedPath),
        ),
      },
    },
    openGraph: {
      title: socialTitle,
      description: pageDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: ogLocale,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: pageDescription,
      images: [ogImage],
    },
    robots: shouldIndex
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        }
      : {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
  };
}

/** Root/default metadata for the locale layout. */
export function buildRootMetadata(locale: string): Metadata {
  return buildPageMetadata({
    locale,
    page: "home",
    isRoot: true,
  });
}
