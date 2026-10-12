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
      {
        protocol: "https",
        hostname: "ak-d.tripcdn.com",
      },
      {
        protocol: "https",
        hostname: "dimg04.tripcdn.com",
      },
      {
        protocol: "https",
        hostname: "gp-aroya-cruise.oss-me-central-1.aliyuncs.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
