"use client";

import Image from "next/image";

const items = [
  {
    title: "Cancellations",
    description: "Cancellation policy: From US$117",
    imageSrc: "/images/Cancellations.webp",
  },
  {
    title: "Changes",
    description: "Change policy: From US$106",
    imageSrc: "/images/Changes.webp",
  },
];

export default function CancellationsChangesSection() {
  return (
    <section className="mt-2">
      <h3 className="mb-3 text-28 font-bold leading-none ">
        Cancellations & changes
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-6 py-4"
          >
            <div className="flex items-start gap-4">
              <Image
                src={item.imageSrc}
                alt={item.title}
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <div>
                <h4 className="mb-2 text-[16px] font-semibold text-[#0298B4]">
                  {item.title}
                </h4>
                <p className="text-[14px] text-slate-900">
                  {item.description}{" "}
                  <button type="button" className="font-medium text-primary">
                    Details
                  </button>
                </p>
              </div>
            </div>

            <p className="text-[14px] font-medium text-slate-500">Included</p>
          </div>
        ))}
      </div>
    </section>
  );
}
