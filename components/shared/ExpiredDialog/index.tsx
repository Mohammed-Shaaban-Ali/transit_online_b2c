"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import insurance from "@/public/images/insurance-hero.svg";
import Image from "next/image";
import { baseApi } from "@/redux/app/baseApi";
import { useAppDispatch } from "@/redux/app/hooks";
import { useRouter } from "@/i18n/navigation";

const ExpiredDialog = ({ isFlight = true }: { isFlight?: boolean }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const t = useTranslations("FlightDetails");
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isDialogOpen) {
      if (!isFlight) router.push("/hotels");
      else dispatch(baseApi.util.resetApiState());
    }
  }, [isDialogOpen, dispatch, isFlight, router]);
  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
      <DialogContent
        className="p-6 bg-white rounded-lg"
        onInteractOutside={(e) => {
          // Prevent closing by clicking outside
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing by pressing Escape
          e.preventDefault();
        }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Illustration - Person holding document */}
          <div className="mb-6 flex justify-center">
            <Image
              src={insurance}
              alt="expired flights"
              width={200}
              height={400}
              className="w-full h-full max-h-[200px] object-contain"
            />
          </div>

          {/* Error Message */}
          <p className="text-gray-800 text mb-6 leading-relaxed">
            {t("expiredFlightsMessage")}
          </p>

          {/* Continue Button */}
          <Button
            onClick={() => setIsDialogOpen(false)}
            className="w-full"
            size={"lg"}
          >
            {t("continue")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpiredDialog;
