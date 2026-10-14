import { routing } from "@/i18n/routing";
import { absoluteUrl, localizedPath, SITEMAP_PATHS } from "@/utils/seo";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const lastMod = new Date().toISOString();

  const urls = SITEMAP_PATHS.flatMap((path) =>
    routing.locales.map((locale) => {
      const loc = absoluteUrl(localizedPath(locale, path));
      const changeFrequency = path === "/" ? "daily" : "weekly";
      const priority = path === "/" ? "1.0" : "0.7";

      return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
