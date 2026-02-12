"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FaLocationDot, FaSquarePhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useTranslations } from "next-intl";
import logo from "@/public/transit_logos/transit_logo_q.png";
function Footer() {
  const t = useTranslations("Components.Footer");

  const links = [
    {
      label: t("home"),
      href: "/",
    },
    {
      label: t("hotels"),
      href: "/hotels",
    },
    {
      label: t("flights"),
      href: "/flights",
    },
  ];

  return (
    <footer className="bg-[#066e9b]">
      <section className="py-10 container grid grid-cols-1 sm:grid-cols-4 gap-10">
        <div className="col-span-1 sm:col-span-2 space-y-3">
          <Link href="/" className="w-fit">
            <Image
              src={logo}
              alt="logo"
              width={1200}
              height={1000}
              className="object-contain brightness-0 invert w-28 h-20"
            />
          </Link>
          <p className="text-15  text-white/70 max-w-[480px]">
            {t("description")}
          </p>
        </div>
        <div className="col-span-1 flex flex-col gap-7">
          <div className="flex items-center gap-1.5">
            <FaLocationDot className="size-5  text-white/70" />
            <p className="text-15 text-white/70 font-medium">{t("location")}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <FaSquarePhone className="size-5  text-white/70" />
            <p className="text-15 text-white/70 font-medium">
              +966 25 789 1566487
            </p>
          </div>{" "}
          <div className="flex items-center gap-1.5">
            <MdEmail className="size-5  text-white/70" />
            <p className="text-15 text-white/70 font-medium">
              support@travila.com{" "}
            </p>
          </div>
        </div>
        <div className="col-span-1 items-end w-full ">
          <div className=" flex sm:flex-col flex-row gap-7 w-fit  sm:ms-0">
            {links?.map((i) => (
              <Link
                href={i.href}
                key={i.label}
                className="text-16 text-white/70 font-medium hover:text-white transition-all duration-300"
              >
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
