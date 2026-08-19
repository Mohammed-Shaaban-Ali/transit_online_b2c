import "./globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ReduxProvider from "@/providers/redux-provider";
import { CountryProvider } from "@/providers/country-provider";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import SetToken from "@/components/layout/SetToken";
import Loading from "./loading";
import { metadata } from "@/constants/metadata";
import { COUNTRY_COOKIE } from "@/constants";
import { DEFAULT_COUNTRY } from "@/config/countries";
import { parseCountryCookie } from "@/utils/countryPath";

// export const metadata: Metadata = {
//   title: "Eficta Online B2C",
//   description: "Eficta Online B2C",
// };
export { metadata };
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Fetch API token on server side
  let apiToken = "";
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const res = await fetch(`${baseUrl}/api/app-token`, {
      cache: "no-store",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      apiToken = data.token || "";
    }
  } catch (error) {
    console.error("Failed to fetch API token:", error);
  }

  const cookieStore = await cookies();
  const country =
    parseCountryCookie(cookieStore.get(COUNTRY_COOKIE)?.value) ??
    DEFAULT_COUNTRY;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      </head>
      <body className="antialiased">
        <SetToken token={apiToken} />
        <NextIntlClientProvider>
          <ReduxProvider>
            <CountryProvider country={country}>
              <Suspense fallback={<Loading />}>
                {children}
                <Toaster
                  position="top-center"
                  richColors
                  duration={3000}
                  theme="light"
                />
              </Suspense>
            </CountryProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
