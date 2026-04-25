import React from "react";
import type { FlightBookingFormValues } from "@/components/pages/flights-test/FlightBookingPage/FlightBookingForm";

type Props = {
  formData?: FlightBookingFormValues | null;
};

function ContactInformation({ formData }: Props) {
  const fullName = formData?.fullName || "MOHAMMED SHAABAN";
  const email = formData?.email || "mohammed.shaaban@gmail.com";
  const phone = formData?.phone || "+201234567890";

  return (
    <section className="space-y-6 bg-white px-6 py-8 rounded">
      <h3 className="text-24 font-bold leading-none ">Contact Information</h3>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3 ">
          <p className="text-18 leading-none font-bold">{fullName.toUpperCase()} </p>
        </div>

        <div
          className="grid grid-cols-1  gap-5 text-14 text-gray-500 font-medium leading-tight 
         md:grid-cols-[100px_1fr]"
        >
          <p className=" ">Email:</p>
          <p className="">{email}</p>

          <p className=" ">Phone:</p>
          <p className=" ">{phone}</p>
        </div>
      </div>
    </section>
  );
}

export default ContactInformation;
