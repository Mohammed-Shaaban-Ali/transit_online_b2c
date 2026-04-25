import Image from "next/image";
import React from "react";
import supportIllustration from "@/public/images/Customer support.png";

type Props = {};

function CustomerSupport({}: Props) {
  const supportQuestions = [
    "How do I complete a pending payment?",
    "Was my payment completed successfully?",
    "Why couldn't I pay with my credit card?",
    "Get help with something else",
  ];

  return (
    <section className="rounded bg-white px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-24 font-bold leading-none ">Customer support</h3>

          <div className="flex items-center gap-2 text-15 text-gray-500 font-normal leading-tight ">
            <span className="inline-flex h-5 w-5 ">
              <img
                src="https://ak-d.tripcdn.com/images/0AS5f120008whj34f2145.png"
                alt="Support in approx. 30s"
                className="h-5 w-5 object-contain"
              />{" "}
            </span>
            <p>Support in approx. 30s</p>
          </div>
        </div>

        <Image
          src={supportIllustration}
          alt="Customer support"
          width={88}
          height={72}
          className="h-[72px] w-[88px] object-contain"
          priority
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {supportQuestions.map((question) => (
          <button
            key={question}
            type="button"
            className="group flex h-[56px] items-center justify-between bg-gray-100
             px-5 text-left text-16 text-gray-900 transition-colors duration-200 hover:bg-primary/10"
          >
            <span>{question}</span>

            <span className="text-gray-900 transition-colors duration-200 group-hover:text-primary">
              <svg
                className="h-4 w-4 group-hover:hidden"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <svg
                className="hidden h-4 w-4 group-hover:block"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 13V11C4 6.58 7.58 3 12 3C16.42 3 20 6.58 20 11V13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M4 13H6.5C7.05 13 7.5 13.45 7.5 14V17.5C7.5 18.05 7.05 18.5 6.5 18.5H5.5C4.67 18.5 4 17.83 4 17V13Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M20 13H17.5C16.95 13 16.5 13.45 16.5 14V17.5C16.5 18.05 16.95 18.5 17.5 18.5H18.5C19.33 18.5 20 17.83 20 17V13Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CustomerSupport;
