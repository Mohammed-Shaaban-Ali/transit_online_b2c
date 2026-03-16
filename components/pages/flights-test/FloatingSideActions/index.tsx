"use client";

import { useEffect, useState } from "react";
import {
  IoArrowUpOutline,
  IoHeadsetOutline,
  IoPhonePortraitOutline,
} from "react-icons/io5";

type Props = {};

function FloatingSideActions({}: Props) {
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
    <div className="fixed right-6 bottom-[10%] z-50">
      <div className="flex flex-col gap-1.5">
        {hasScrolled && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex h-16 w-16 items-center justify-center rounded-md bg-blue-500 text-white
             transition-colors duration-200 hover:bg-[#2454dc] cursor-pointer"
          >
            <IoArrowUpOutline className="size-8" />
          </button>
        )}

        <button
          type="button"
          aria-label="Support"
          className="flex h-16 w-16 items-center justify-center rounded-md bg-blue-500 text-white
           transition-colors duration-200 hover:bg-[#2454dc] cursor-pointer"
        >
          <IoHeadsetOutline className="size-8" />
        </button>

        <button
          type="button"
          aria-label="App"
          className="flex h-16 w-16 items-center justify-center rounded-md bg-blue-500 text-white
           transition-colors duration-200 hover:bg-[#2454dc] cursor-pointer"
        >
          <IoPhonePortraitOutline className="size-8" />
        </button>
      </div>
    </div>
  );
}

export default FloatingSideActions;
