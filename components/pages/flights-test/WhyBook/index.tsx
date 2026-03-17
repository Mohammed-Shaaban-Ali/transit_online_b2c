"use client";

import { useState } from "react";

type Props = {};

function WhyBook({}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const collapsedText =
    "Ready to jet off? Booking a flight is the first step to an exciting getaway. However, with so many things to consider, finding cheap flights is not always the easiest of tasks. That's why, at Trip.com, we've made things simple. Letting you search and compare flights from thousands of different airlines to destinations all over the world, it's never";
  const expandedText =
    "Ready to jet off? Booking a flight is the first step to an exciting getaway. However, with so many things to consider, finding cheap flights is not always the easiest of tasks. That's why, at Trip.com, we've made things simple. Letting you search and compare flights from thousands of different airlines to destinations all over the world, it's never been easier to find flight tickets to suit you. From economy to first-class airline tickets, direct to connecting flights and return and one-way tickets, you can filter your search to suit your plans and budget. Whether it's for a long-haul family holiday, romantic weekend break, or a professional business trip, in just a few clicks you can be on your way to your chosen destination.";

  return (
    <section className="container max-w-[1200px]! mx-auto py-7">
      <h2 className="mb-6 text-[28px] font-bold leading-tight ">
        Why Book Flights with Trip.com
      </h2>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-[18px] font-bold leading-tight ">
          Flights to Suit You
        </h3>
        <p className="mt-2 text-[14px] text-black/60">
          {isExpanded ? expandedText : collapsedText}
        </p>

        {isExpanded && (
          <>
            <h3 className="mt-6 text-[18px] font-bold leading-tight ">
              Book Cheap Flights Today
            </h3>
            <p className="mt-2 text-[14px] text-black/60">
              There are plenty of other ways you can save money on flights, too.
              You can look out for our flight flash sales, sign up to price
              alerts which let you know when flight prices have dropped, and
              download the Trip.com app to get money off. Joining the Trip.com
              loyalty program also gives you access to exclusive member-only
              offers. Not only that, but you can also earn Trip Coins which can
              be redeemed on your next booking.
            </p>
          </>
        )}

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-[14px] text-primary hover:underline cursor-pointer"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhyBook;
