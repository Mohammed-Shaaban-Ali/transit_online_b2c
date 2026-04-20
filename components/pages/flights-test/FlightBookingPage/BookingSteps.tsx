import React from "react";

type Props = {
  activeStep?: number;
};

function BookingSteps({ activeStep = 0 }: Props) {
  const bookingSteps = [
    "Fill in your info",
    "Choose your seat",
    "Personalize your trip",
    "Finalize your payment",
  ];

  const lastIndex = bookingSteps.length - 1;
  const lineProgressPct = Math.min(100, ((activeStep + 0.5) / lastIndex) * 100);

  return (
    <div className="relative z-10 mb-10">
      <div
        className="pointer-events-none absolute left-4 right-4 top-4 h-1"
        aria-hidden
      >
        <div className="relative h-full w-full bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${lineProgressPct}%` }}
          />
        </div>
      </div>

      <div className="relative grid grid-cols-4 gap-2">
        {bookingSteps.map((step, index) => {
          const isActive = index === activeStep;
          const isFirst = index === 0;
          const isLast = index === lastIndex;

          const columnAlign = isFirst
            ? "items-start text-left"
            : isLast
              ? "items-end text-right"
              : "items-center text-center";

          return (
            <div key={step} className={`flex min-w-0 flex-col ${columnAlign}`}>
              <span
                className={`relative z-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-12 font-semibold ${
                  isActive
                    ? "bg-primary text-white"
                    : "border border-gray-200 bg-gray-200"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`mt-2 max-w-full text-[14px] leading-snug ${
                  isActive ? " text-primary" : "text-gray-600"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookingSteps;
