"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FaCheck } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

type Props = {
  showSuccessDialog: boolean;
  setShowSuccessDialog: (showSuccessDialog: boolean) => void;
  isHotel?: boolean;
};

function SuccessDialog({
  showSuccessDialog,
  setShowSuccessDialog,
  isHotel = false,
}: Props) {
  const t = useTranslations("SuccessDialog");

  return (
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent
        className="max-w-md w-[95vw] md:w-auto p-0 rounded-2xl overflow-hidden"
        showCloseButton={true}
      >
        <motion.div
          className="bg-white p-6 md:p-8 flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Success Icon */}
          <motion.div className="relative mb-6" variants={itemVariants}>
            {/* Outer ring - lighter teal green */}
            <motion.div
              className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"
              variants={iconVariants}
            >
              {/* Inner circle - dark teal green */}
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                <FaCheck className="text-white text-3xl" />
              </div>
            </motion.div>
          </motion.div>

          {/* Main Message */}
          <motion.h3
            variants={itemVariants}
            className="text-24 font-bold text-black mb-3"
          >
            {isHotel ? t("roomAdded") : t("flightAdded")}
          </motion.h3>

          {/* Secondary Message */}
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-14 mb-6"
          >
            {isHotel ? t("roomMessage") : t("flightMessage")}
          </motion.p>

          {/* Go to Cart Button */}
          <motion.div
            className="w-full grid grid-cols-2 gap-2.5 mt-2"
            variants={itemVariants}
          >
            <Button
              className="col-span-1 rounded-full h-12  "
              variant="outline-primary"
              onClick={() => setShowSuccessDialog(false)}
            >
              {t("goBack")}
            </Button>
            <Link href="/cart" className="col-span-1">
              <Button
                className="w-full rounded-full h-12 "
                onClick={() => setShowSuccessDialog(false)}
              >
                {t("goToCart")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default SuccessDialog;
