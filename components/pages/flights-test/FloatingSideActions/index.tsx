"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  IoArrowUpOutline,
  IoHeadsetOutline,
  IoPhonePortraitOutline,
} from "react-icons/io5";

type Props = {
  rounded?: boolean;
};

function FloatingSideActions({ rounded }: Props) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed right-6 bottom-[10%] z-50 hidden md:block">
      <div className="flex flex-col gap-1.5">
        {hasScrolled && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-md bg-primary text-white transition-colors duration-200 hover:bg-primary/80 cursor-pointer",
              rounded && "rounded-full",
            )}
          >
            <IoArrowUpOutline className="size-8" />
          </button>
        )}

        <button
          type="button"
          aria-label="Support"
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-md bg-primary text-white  transition-colors duration-200 hover:bg-primary/80 cursor-pointer",
            rounded && "rounded-full",
          )}
        >
          <IoHeadsetOutline className="size-8" />
        </button>

        <button
          type="button"
          aria-label="App"
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-md bg-primary text-white transition-colors duration-200 hover:bg-primary/80 cursor-pointer",
            rounded && "rounded-full",
          )}
        >
          <IoPhonePortraitOutline className="size-8" />
        </button>
      </div>
    </div>
  );
}

export default FloatingSideActions;
