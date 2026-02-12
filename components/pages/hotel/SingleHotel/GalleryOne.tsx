"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";
import PriceCell from "@/components/shared/PriceCell";
import StarRating from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSearchParamsData } from "@/utils/getSearchParams";
import { useTranslations } from "next-intl";

export default function GalleryOne({ hotel, nights }: any) {
  const t = useTranslations("GalleryOne");
  const [isOpen, setOpen] = useState(false);

  const limitedGallery = hotel?.gallery?.slice(0, 5) || [];
  const allImages = hotel?.gallery || [];

  if (!hotel || !limitedGallery.length) return null;

  return (
    <>
      <section className="pt-14">
        <div className="">
          {/* Hotel Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div className="flex flex-col flex-1 ">
              <div className="flex flex-col gap-0 mb-1">
                <h1 className="text-36 font-bold leading-tight">
                  {hotel?.displayName}
                </h1>
                <h2 className="text-20 font-bold ">{hotel?.displayNameAr}</h2>
              </div>
              <h3 className="text-20 text-gray-500 font-medium">
                {" "}
                {hotel?.address}
              </h3>
            </div>

            <div className="flex flex-col ">
              <PriceCell price={hotel?.price} nights={nights} />
              <StarRating rating={Number(hotel?.starRating)} />
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-3  h-[70vh] sm:h-[60vh] relative ">
            <div
              className="relative  rounded-lg bg-gray-100
            sm:col-span-2 col-span-1 w-full h-full
            "
            >
              <Image
                src={hotel?.gallery[0]}
                alt={t("hotelImageAlt", { index: 1 })}
                fill
                className="object-cover rounded-lg w-full"
              />
            </div>
            <div className="col-span-1 flex flex-col gap-3 h-full">
              <div className="relative h-full w-full ">
                <Image
                  src={hotel?.gallery[1]}
                  alt={t("hotelImageAlt", { index: 1 })}
                  fill
                  className="object-cover rounded-lg w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 h-full w-full">
                <div className="relative h-full w-full">
                  <Image
                    src={hotel?.gallery[2]}
                    alt={t("hotelImageAlt", { index: 1 })}
                    fill
                    className="object-cover rounded-lg w-full"
                  />
                </div>
                <div className="relative h-full w-full">
                  <Image
                    src={hotel?.gallery[3]}
                    alt={t("hotelImageAlt", { index: 1 })}
                    fill
                    className="object-cover rounded-lg w-full"
                  />
                  <Button
                    onClick={() => setOpen(true)}
                    className="absolute bottom-4 right-4 z-10  "
                  >
                    <EyeIcon className="w-4 h-4" />
                    {t("seeAllPhotos")}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Full Gallery Dialog */}
          <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent
              className="max-w-7xl md:min-w-[1000px] w-full max-h-[80vh] sm:max-h-[90vh] border-none
            overflow-hidden overflow-y-auto p-3
            "
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allImages.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-200"
                  >
                    <Image
                      src={image}
                      alt={t("hotelImageAlt", { index: index + 1 })}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg" />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </>
  );
}
