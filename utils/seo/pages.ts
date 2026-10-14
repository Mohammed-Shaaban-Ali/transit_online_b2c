export type SeoLocaleCopy = {
  title: string;
  description: string;
  keywords?: string[];
};

export type PageSeoKey =
  | "home"
  | "hotels"
  | "hotelsOffers"
  | "hotelDetails"
  | "hotelBooking"
  | "flights"
  | "flightsOffers"
  | "flightResults"
  | "flightBooking"
  | "cruises"
  | "cruiseBooking"
  | "trips"
  | "tripDetails"
  | "featuredDestinations"
  | "featuredDestinationDetails"
  | "licenses"
  | "login"
  | "myBooking";

type PageSeoConfig = {
  path: string;
  indexable?: boolean;
  en: SeoLocaleCopy;
  ar: SeoLocaleCopy;
};

export const SITE_NAME = "Gita";
export const DEFAULT_OG_IMAGE = "/images/gitalogo.png";

export const PAGE_SEO: Record<PageSeoKey, PageSeoConfig> = {
  home: {
    path: "/",
    en: {
      title: "Official site | Hotels, flights, cruises and travel packages",
      description:
        "Discover the world with Gita. Great deals on hotels, flights, cruises and trips — plan the perfect journey for any budget.",
      keywords: [
        "Gita",
        "hotels",
        "flights",
        "cruises",
        "travel packages",
        "book trips",
        "official site",
      ],
    },
    ar: {
      title: "الموقع الرسمي | أفضل الفنادق ورحلات الطيران والرحلات البحرية",
      description:
        "اكتشف العالم مع جيتا. توفيرات كبيرة على الفنادق ورحلات الطيران والرحلات البحرية وباقات السفر: خطط لرحلة مثالية بأي ميزانية.",
      keywords: [
        "جيتا",
        "فنادق",
        "طيران",
        "رحلات بحرية",
        "باقات سفر",
        "الموقع الرسمي",
      ],
    },
  },
  hotels: {
    path: "/hotels",
    en: {
      title: "Hotels",
      description:
        "Search and book hotels worldwide with Gita. Find top-rated stays, compare prices, and reserve your room online.",
      keywords: ["hotels", "hotel booking", "Gita hotels", "accommodation"],
    },
    ar: {
      title: "الفنادق",
      description:
        "ابحث واحجز الفنادق حول العالم مع جيتا. اعثر على أفضل الإقامات، قارن الأسعار، واحجز غرفتك أونلاين.",
      keywords: ["فنادق", "حجز فنادق", "فنادق جيتا", "إقامة"],
    },
  },
  hotelsOffers: {
    path: "/hotels-offers",
    en: {
      title: "Hotel Offers",
      description:
        "Browse exclusive hotel deals and special rates. Save on your next stay with Gita hotel offers.",
      keywords: ["hotel offers", "hotel deals", "discount hotels"],
    },
    ar: {
      title: "عروض الفنادق",
      description:
        "تصفح عروض الفنادق الحصرية والأسعار الخاصة. وفر في إقامتك القادمة مع عروض فنادق جيتا.",
      keywords: ["عروض فنادق", "خصومات فنادق", "حجوزات مخفضة"],
    },
  },
  hotelDetails: {
    path: "/hotels/details",
    en: {
      title: "Hotel Details",
      description:
        "View hotel rooms, amenities, prices, and availability. Book your stay securely with Gita.",
      keywords: ["hotel details", "hotel rooms", "book hotel"],
    },
    ar: {
      title: "تفاصيل الفندق",
      description:
        "اطلع على غرف الفندق والمرافق والأسعار والتوافر. احجز إقامتك بأمان مع جيتا.",
      keywords: ["تفاصيل فندق", "غرف فندق", "حجز فندق"],
    },
  },
  hotelBooking: {
    path: "/hotels/details",
    indexable: false,
    en: {
      title: "Hotel Booking",
      description: "Complete your hotel reservation with Gita.",
    },
    ar: {
      title: "حجز الفندق",
      description: "أكمل حجز فندقك مع جيتا.",
    },
  },
  flights: {
    path: "/flights",
    en: {
      title: "Flights",
      description:
        "Search and book flights with Gita. Compare fares, choose your preferred schedule, and fly with confidence.",
      keywords: ["flights", "flight booking", "cheap flights", "air tickets"],
    },
    ar: {
      title: "الطيران",
      description:
        "ابحث واحجز تذاكر الطيران مع جيتا. قارن الأسعار، اختر الموعد المناسب، وسافر بثقة.",
      keywords: ["طيران", "حجز طيران", "تذاكر طيران", "رحلات جوية"],
    },
  },
  flightsOffers: {
    path: "/flights-offers",
    en: {
      title: "Flight Offers",
      description:
        "Explore special flight deals and promotional fares. Find affordable tickets for your next journey with Gita.",
      keywords: ["flight offers", "flight deals", "cheap tickets"],
    },
    ar: {
      title: "عروض الطيران",
      description:
        "استكشف عروض الطيران الخاصة والأسعار الترويجية. اعثر على تذاكر مناسبة لرحلتك القادمة مع جيتا.",
      keywords: ["عروض طيران", "تذاكر مخفضة", "رحلات رخيصة"],
    },
  },
  flightResults: {
    path: "/flights/showfarefirst",
    indexable: false,
    en: {
      title: "Flight Results",
      description: "Compare flight options and continue to booking with Gita.",
    },
    ar: {
      title: "نتائج الطيران",
      description: "قارن خيارات الطيران وأكمل الحجز مع جيتا.",
    },
  },
  flightBooking: {
    path: "/flights/showfarefirst/booking",
    indexable: false,
    en: {
      title: "Flight Booking",
      description: "Complete your flight reservation with Gita.",
    },
    ar: {
      title: "حجز الطيران",
      description: "أكمل حجز تذكرة الطيران مع جيتا.",
    },
  },
  cruises: {
    path: "/cruises",
    en: {
      title: "Cruises",
      description:
        "Browse cruise packages and book unforgettable sea journeys with Gita.",
      keywords: ["cruises", "cruise booking", "cruise packages"],
    },
    ar: {
      title: "الرحلات البحرية",
      description:
        "تصفح باقات الرحلات البحرية واحجز رحلة لا تُنسى مع جيتا.",
      keywords: ["رحلات بحرية", "حجز كروز", "باقات بحرية"],
    },
  },
  cruiseBooking: {
    path: "/cruises/booking",
    indexable: false,
    en: {
      title: "Cruise Booking",
      description: "Complete your cruise reservation with Gita.",
    },
    ar: {
      title: "حجز الرحلة البحرية",
      description: "أكمل حجز رحلتك البحرية مع جيتا.",
    },
  },
  trips: {
    path: "/trips",
    en: {
      title: "Trips & Packages",
      description:
        "Discover curated trips and travel packages. Request a booking and start your adventure with Gita.",
      keywords: ["trips", "travel packages", "tour packages"],
    },
    ar: {
      title: "الرحلات والباقات",
      description:
        "اكتشف رحلات وباقات سفر مختارة. اطلب الحجز وابدأ مغامرتك مع جيتا.",
      keywords: ["رحلات", "باقات سفر", "برامج سياحية"],
    },
  },
  tripDetails: {
    path: "/trips",
    en: {
      title: "Trip Details",
      description:
        "View trip details and request your booking with Gita travel packages.",
      keywords: ["trip details", "travel package"],
    },
    ar: {
      title: "تفاصيل الرحلة",
      description:
        "اطلع على تفاصيل الرحلة واطلب حجزك مع باقات سفر جيتا.",
      keywords: ["تفاصيل رحلة", "باقة سفر"],
    },
  },
  featuredDestinations: {
    path: "/featured-destinations",
    en: {
      title: "Featured Destinations",
      description:
        "Explore featured travel destinations, guides, and inspiration for your next getaway with Gita.",
      keywords: ["destinations", "travel guides", "featured destinations"],
    },
    ar: {
      title: "الوجهات المميزة",
      description:
        "استكشف الوجهات السياحية المميزة والأدلة والإلهام لرحلتك القادمة مع جيتا.",
      keywords: ["وجهات", "أدلة سفر", "وجهات مميزة"],
    },
  },
  featuredDestinationDetails: {
    path: "/featured-destinations",
    en: {
      title: "Destination Details",
      description:
        "Learn more about this featured destination and plan your visit with Gita.",
      keywords: ["destination", "travel guide"],
    },
    ar: {
      title: "تفاصيل الوجهة",
      description:
        "تعرّف أكثر على هذه الوجهة المميزة وخطط لزيارتك مع جيتا.",
      keywords: ["وجهة", "دليل سفر"],
    },
  },
  licenses: {
    path: "/licenses",
    en: {
      title: "Licenses",
      description:
        "View Gita licenses and official travel authorizations.",
      keywords: ["licenses", "travel license"],
    },
    ar: {
      title: "التراخيص",
      description: "اطلع على تراخيص جيتا والتصاريح الرسمية للسفر.",
      keywords: ["تراخيص", "ترخيص سفر"],
    },
  },
  login: {
    path: "/login",
    indexable: false,
    en: {
      title: "Login",
      description: "Sign in to your Gita account to manage bookings.",
    },
    ar: {
      title: "تسجيل الدخول",
      description: "سجّل الدخول إلى حساب جيتا لإدارة حجوزاتك.",
    },
  },
  myBooking: {
    path: "/my-booking",
    indexable: false,
    en: {
      title: "My Bookings",
      description: "View and manage your bookings with Gita.",
    },
    ar: {
      title: "حجوزاتي",
      description: "اعرض حجوزاتك وأدرها مع جيتا.",
    },
  },
};

/** Static public paths included in sitemap (no locale prefix). */
export const SITEMAP_PATHS = [
  "/",
  "/hotels",
  "/hotels-offers",
  "/flights",
  "/flights-offers",
  "/cruises",
  "/trips",
  "/featured-destinations",
  "/licenses",
] as const;
