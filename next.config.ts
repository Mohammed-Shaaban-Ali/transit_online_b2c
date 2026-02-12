import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagecontent.net",
      },
      {
        protocol: "https",
        hostname: "gita.sa",
      },
      {
        protocol: "https",
        hostname: "test-staticworldtravelink.azurewebsites.net",
      },
      {
        protocol: "https",
        hostname: "test.gita.sa",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
