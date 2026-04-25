import React from "react";
import type { FlightBookingFormValues } from "@/components/pages/flights-test/FlightBookingPage/FlightBookingForm";

type Props = {
  formData?: FlightBookingFormValues | null;
};

function PassengerInformation({ formData }: Props) {
  const fallbackPassenger: FlightBookingFormValues["passengers"][number] = {
    firstName: "MOHAMMED",
    lastName: "SHAABAN",
    dateOfBirth: "2003-02-07",
    gender: "male",
    passportNumber: "323203203203023",
    nationality: "Egypt",
    passportExpiry: "",
    type: "adult",
  };

  const passengers =
    formData?.passengers && formData.passengers.length > 0
      ? formData.passengers
      : [fallbackPassenger];

  return (
    <section className="space-y-6 bg-white px-6 py-8 rounded">
      <h3 className="text-24 font-bold leading-none ">Passenger Information</h3>
      <div className="space-y-6">
        {passengers.map((passenger, index) => {
          const gender = passenger.gender
            ? `${passenger.gender.charAt(0).toUpperCase()}${passenger.gender.slice(1)}`
            : "Male";
          const type = passenger.type
            ? `${passenger.type.charAt(0).toUpperCase()}${passenger.type.slice(1)}`
            : "Adult";
          const dateOfBirth = passenger.dateOfBirth
            ? new Date(passenger.dateOfBirth).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Feb 7, 2003";

          return (
            <div
              key={`${passenger.passportNumber || "passenger"}-${index}`}
              className={`${index !== 0 ? "border-t border-dashed border-gray-200 pt-6" : ""} space-y-5`}
            >
              <div className="flex flex-wrap items-center gap-3 ">
                <p className="text-18 leading-none font-bold">
                  {index + 1}: {passenger.firstName.toUpperCase()}{" "}
                  <span className="text-14 font-normal text-gray-500 ">
                    (First name)
                  </span>{" "}
                  {passenger.lastName.toUpperCase()}{" "}
                  <span className="text-14 font-normal  text-gray-500 ">
                    (Last name)
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1  gap-2 gap-x-5 text-14 text-gray-500 font-normal  leading-tight  md:grid-cols-[120px_1fr]">
                <p className=" ">ID type:</p>
                <p className="">Passport</p>

                <p className=" ">ID number:</p>
                <p className=" ">{passenger.passportNumber || "N/A"}</p>

                <p className=" ">Nationality (country/region)</p>
                <p className=" ">{passenger.nationality || "N/A"}</p>

                <p className=" ">Gender:</p>
                <p className=" ">
                  {gender} | {type}
                </p>

                <p className=" ">Date of birth:</p>
                <p className=" ">{dateOfBirth}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PassengerInformation;
