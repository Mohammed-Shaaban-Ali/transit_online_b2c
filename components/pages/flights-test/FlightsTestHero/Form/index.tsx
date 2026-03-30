"use client";

import { useEffect, useRef, useState } from "react";
import StaticFlightSearchBox from "./StaticFlightSearchBox";

function Form() {
  const [isSticky, setIsSticky] = useState(false);
  const [reservedHeight, setReservedHeight] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const thresholdRef = useRef<number | null>(null);

  useEffect(() => {
    const calculateThreshold = () => {
      if (!formRef.current) return;
      const rect = formRef.current.getBoundingClientRect();
      thresholdRef.current = rect.top + window.scrollY;
    };

    const isMobile = () => window.innerWidth < 768;

    const onScroll = () => {
      if (isMobile()) {
        setIsSticky(false);
        return;
      }
      if (thresholdRef.current === null) return;
      const shouldStick = window.scrollY >= thresholdRef.current;
      setIsSticky(shouldStick);
    };

    const onResize = () => {
      if (isMobile()) {
        setIsSticky(false);
        return;
      }
      calculateThreshold();
      if (formRef.current) {
        setReservedHeight(formRef.current.offsetHeight);
      }
      onScroll();
    };

    calculateThreshold();
    if (formRef.current) {
      setReservedHeight(formRef.current.offsetHeight);
    }
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={isSticky ? { height: reservedHeight } : undefined}>
      <div
        ref={formRef}
        className={
          isSticky
            ? "md:fixed md:inset-x-0 md:top-0 md:z-9999 md:border-b md:border-gray-200 md:bg-white md:backdrop-blur-sm"
            : ""
        }
      >
        <div className={isSticky ? "md:container md:max-w-[1200px]! md:mx-auto" : ""}>
          <StaticFlightSearchBox
            className={isSticky ? "md:mt-0 md:rounded-none md:p-5" : ""}
            compactActions={isSticky}
          />
        </div>
      </div>
    </div>
  );
}

export default Form;
