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

    const onScroll = () => {
      if (thresholdRef.current === null) return;
      const shouldStick = window.scrollY >= thresholdRef.current;
      setIsSticky(shouldStick);
    };

    const onResize = () => {
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
            ? "fixed inset-x-0 top-0 z-9999 border-b border-gray-200 bg-white backdrop-blur-sm"
            : ""
        }
      >
        <div className={isSticky ? "container max-w-[1200px]! mx-auto" : ""}>
          <StaticFlightSearchBox
            className={isSticky ? "mt-0 rounded-none p-5" : ""}
            compactActions={isSticky}
          />
        </div>
      </div>
    </div>
  );
}

export default Form;
