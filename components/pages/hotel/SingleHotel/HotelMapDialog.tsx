"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latitude: number;
  longitude: number;
  title: string;
};

export default function HotelMapDialog({
  open,
  onOpenChange,
  latitude,
  longitude,
  title,
}: Props) {
  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "grid max-h-[90vh] w-[min(100vw-1rem,56rem)] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden p-0 sm:max-w-4xl",
        )}
      >
        <DialogHeader className="border-b border-gray-100 px-4 py-3 sm:px-5">
          <DialogTitle className="text-start text-base font-bold sm:text-lg">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="relative aspect-4/3 min-h-[280px] w-full sm:min-h-[400px]">
          <iframe
            title={title}
            src={src}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
