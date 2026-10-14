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

type Props = {
  isFlight?: boolean;
  /** Close fare/details UI so user lands on fresh search results */
  onContinue?: () => void;
};

const ExpiredDialog = ({ isFlight = true, onContinue }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const t = useTranslations("FlightDetails");
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isDialogOpen) {
      if (!isFlight) {
        router.push("/hotels");
        return;
      }
      // Drop open fare/details first, then refresh search cache
      onContinue?.();
      dispatch(baseApi.util.resetApiState());
    }
  }, [isDialogOpen, dispatch, isFlight, router, onContinue]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
      <DialogContent
        className="p-6 bg-white rounded-lg"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src={insurance}
              alt="expired flights"
              width={200}
              height={400}
              className="w-full h-full max-h-[200px] object-contain"
            />
          </div>

          <p className="text-gray-800 text mb-6 leading-relaxed">
            {t("expiredFlightsMessage")}
          </p>

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
