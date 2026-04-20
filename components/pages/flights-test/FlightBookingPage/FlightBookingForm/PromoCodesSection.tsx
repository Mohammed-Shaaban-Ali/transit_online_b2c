"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PromoCodesSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  return (
    <section className="mt-2">
      <h3 className="mb-3 text-28 font-bold ">Promo codes</h3>

      <div className="rounded-xl bg-white px-2 py-2 transition-all duration-200 ease-linear ">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-xl  bg-white px-5 text-[14px] text-[#6E7891] transition-all duration-200 ease-linear ${
            isOpen ? "h-10 border-transparent px-1" : "h-14"
          }`}
          aria-expanded={isOpen}
          aria-label="Toggle promo code form"
        >
          <span
            className={`transition-opacity duration-150 ease-linear ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          >
            Select/Enter
          </span>
          <ChevronDown
            size={20}
            className={`text-slate-500 transition-transform duration-200 ease-linear ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <div
          className={`grid overflow-hidden transition-all duration-200 ease-linear ${
            isOpen
              ? "mt-2 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <div className="pb-2">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Input
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value)}
                  placeholder="Please enter promo code"
                  className="h-14 border-[#2F67FF] bg-white px-4 text-[14px] text-slate-800 focus-visible:ring-0"
                />
                <Button
                  type="button"
                  className="h-14 min-w-[124px] rounded-md bg-[#6E7891] px-6 text-[16px] font-medium text-white hover:bg-[#5F6980]"
                >
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
