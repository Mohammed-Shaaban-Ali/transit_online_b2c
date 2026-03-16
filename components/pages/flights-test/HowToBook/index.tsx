"use client";

import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

type Props = {};

const howToBookItems = [
  {
    id: 1,
    title: "Fly during the working week",
    content:
      "Opting to take your flight during the working week can save you money. Flights departing over this period - especially Tuesdays and Wednesdays - are cheaper, mainly because these days are less popular to travel on.",
  },
  {
    id: 2,
    title: "Have a look at airline websites",
    content:
      'Many airline websites have made it simpler to identify the inexpensive days to fly by displaying a "calendar view" booking system. This system allows you to scan prices ranging across the week that you are searching.',
  },
  {
    id: 3,
    title: "Consider flights with less-popular departure times",
    content:
      "You may also get a bargain flight if you're willing to fly at an early hour. It may well be less expensive to fly at 6 am than at later times due to that time spot being less popular. The only problem you could face is getting to the airport at this time; make sure that public transport is running if you can't take a taxi or get a lift to the airport.",
  },
  {
    id: 4,
    title: "Find a better price on the Trip.com app",
    content:
      "This may sound like I'm stating the obvious, but you'd be surprised at the number of people who settle for a price without first shopping around and doing some research. We suggest you have a look for bargains on the Trip.com app.",
  },
  {
    id: 5,
    title: "Book early instead of waiting until the last minute",
    content:
      "Don't get fooled into thinking that last-minute deals are necessarily the best option for cheap flight tickets because they seldom are. The smart move is to book early, even as far as a year in advance if that is possible for the flight you require. Flight tickets have a tendency to be cheaper when they are first released - which is normally about a year before the flight - so have a look online as soon as the flights you want are available.",
  },
  {
    id: 6,
    title: "Use a credit card in a wiser way",
    content:
      "There are a lot of advantages to paying for a flight with a credit card. One advantage is that you are protected when you make bigger purchases. Certain credit cards will offer you air miles for each sum of money spent, thus saving you a bit more on your flight tickets.",
  },
  {
    id: 7,
    title: "Choose flights with a connection",
    content:
      "Connecting flights can often be much cheaper than direct flights. If your schedule allows, compare one-stop options and you may find major savings while still arriving comfortably at your destination.",
  },
  {
    id: 8,
    title: "Book package holidays which may offer cheap flight tickets",
    content:
      "A package deal can sometimes reduce the total cost of your flight and accommodation. Keep an eye on package offers, especially during seasonal promotions and flash sales.",
  },
  {
    id: 9,
    title: "Be aware of hidden costs of cheap flights",
    content:
      "Before booking, check baggage policies, seat selection charges, and airport transfer costs. A low fare can quickly increase with extras, so always compare the final total price.",
  },
];

function HowToBook({}: Props) {
  const [openItems, setOpenItems] = useState<number[]>([1]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  return (
    <section className="container max-w-[1200px]! mx-auto py-7">
      <h2 className="mb-6 text-[28px] font-bold leading-tight ">
        How to Book Cheap Flights?
      </h2>

      <div className="rounded-lg  bg-white px-6 py-2.5 shadow-[0px_8px_16px_0px_rgba(15,41,77,0.08)] transition-all duration-300">
        {howToBookItems.map((item, index) => {
          const isOpen = openItems.includes(item.id);

          return (
            <article
              key={item.id}
              className={
                index !== howToBookItems.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="group flex w-full items-center justify-between gap-4 py-4 text-start cursor-pointer"
              >
                <span
                  className="text-[16px] font-bold cursor-pointer 
                leading-tight text-black  group-hover:text-blue-600
                group-hover:translate-x-2 transition-all duration-300 
                "
                >
                  {item.title}
                </span>
                {isOpen ? (
                  <IoChevronUp
                    className="size-4 shrink-0 text-black/60 
                   group-hover:text-blue-600 group-hover:-translate-x-2 transition-all duration-300 
"
                  />
                ) : (
                  <IoChevronDown
                    className="size-4 shrink-0 text-black/60 
                   group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300 
"
                  />
                )}
              </button>

              {isOpen && (
                <p className="pb-4 text-[14px] leading-6 text-black/60">
                  {item.content}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default HowToBook;
