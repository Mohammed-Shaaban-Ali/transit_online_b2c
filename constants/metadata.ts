import type { Metadata } from "next";

export const domain = "https://eficta-online-b2c.vercel.app/en";

export const metadata: Metadata = {
    title:
        "Transit Online B2C",
    description:
        "Transit Online B2C",

    keywords: [
        "Transit Online B2C",
    ],

    openGraph: {
        title: "Transit Online B2C",
        description:
            "Transit Online B2C",
        url: domain,
        siteName: "Transit Online B2C",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: `/transit_logos/transit_logo_q.png`,
                width: 1200,
                height: 630,
                alt: "Transit Online B2C",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Transit Online B2C",
        description:
            "Transit Online B2C",
        images: [
            {
                url: `/eficta_logos/eficta_logo-removebg-preview.png            `,
                width: 1200,
                height: 630,
                alt: "Transit Online B2C",
            },
        ],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },

    metadataBase: new URL(domain),
    alternates: {
        canonical: domain,
    },



};
