"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import PhoneInput from "@/components/shared/form/PhoneInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useBookTripOfferMutation,
  useGetTripDetailsQuery,
} from "@/redux/features/website/websiteApi";
import { Button } from "@/components/ui/button";

const getTripImageUrl = (img: string | null | undefined) =>
  img ? `https://gita.sa/storage/${img}` : "/images/gitalogo.png";

const bookingSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().min(1, "الإيميل مطلوب").email("صيغة الإيميل غير صحيحة"),
  phone: z.string().min(9, "رقم الهاتف يجب أن يكون 9 أرقام على الأقل"),
  phoneCountryCode: z.string().min(1),
  message: z.string().min(1, "الرسالة مطلوبة"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function TripDetailsPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const tripId = params?.id;
  const { data, isLoading } = useGetTripDetailsQuery(tripId, {
    skip: !tripId,
  });
  const [bookTripOffer, { isLoading: isSubmittingBooking }] =
    useBookTripOfferMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      phoneCountryCode: "20",
      message: "",
    },
  });

  const trip = data?.data?.[0];
  const imageUrl = getTripImageUrl(trip?.img);
  const normalizedRate = Math.max(0, Math.min(5, Number(trip?.rate ?? 0)));
  const filledStars = Math.floor(normalizedRate);

  const onSubmitBooking = async (values: BookingFormValues) => {
    if (!trip?.id) return;

    await bookTripOffer({
      offer_id: trip.id,
      name: values.name,
      email: values.email,
      phone: values.phone.replace("+", ""),
      message: values.message,
    }).unwrap();

    reset();
    setIsBookingModalOpen(false);
  };

  return (
    <>
      <NewNavbar isBgWhite />
      <section className="container mx-auto w-full max-w-[1200px]! px-3 pb-8 pt-28 md:pt-24">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 rounded-lg bg-white p-4 md:grid-cols-2">
            <div className="h-[280px] animate-pulse rounded-lg bg-gray-200 md:h-[420px]" />
            <div className="space-y-3 pt-2">
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ) : (
          <div className="relative grid grid-cols-1 items-start gap-6 md:grid-cols-2">
            <div
              className="relative md:top-5 md:sticky md:h-[calc(100vh-50px)] h-[280px] overflow-hidden rounded-xl border border-gray-200
"
            >
              <Image
                src={imageUrl}
                alt={data?.data?.[0]?.title || "trip"}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-[28px] font-bold leading-tight text-black">
                {trip?.title}
              </h1>
              <div className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-[#F5F5F5] px-3 py-1.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className={
                      index >= 5 - filledStars
                        ? "fill-[#F4B400] text-[#F4B400]"
                        : "fill-[#9CA3AF] text-[#9CA3AF]"
                    }
                  />
                ))}
              </div>
              <p className="mt-4 whitespace-pre-line text-[16px] leading-7 text-gray-700">
                {trip?.description}
              </p>
              <Button
                size="lg"
                type="button"
                onClick={() => setIsBookingModalOpen(true)}
                className="mt-6 w-[150px]"
              >
                احجز الآن
              </Button>
            </div>
          </div>
        )}
      </section>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-[min(100vw-1rem,42rem)] max-w-[calc(100vw-1rem)] rounded-xl p-5 sm:p-6"
        >
          <DialogHeader className="mb-2">
            <DialogTitle className="text-start text-xl font-bold text-black">
              احجز العرض الآن
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmitBooking)}
            className="mt-3 flex flex-col gap-4"
          >
            <FloatingLabelInput
              id="name"
              label="الاسم"
              register={register("name")}
              watchValue={watch("name")}
              error={errors.name?.message}
              containerClassName="h-[64px] border-gray-300 rounded-lg bg-white"
              inputClassName="font-medium text-slate-900"
              labelClassName="font-medium text-slate-500"
            />

            <FloatingLabelInput
              id="email"
              type="email"
              label="البريد الإلكتروني"
              register={register("email")}
              watchValue={watch("email")}
              error={errors.email?.message}
              containerClassName="h-[64px] border-gray-300 rounded-lg bg-white"
              inputClassName="font-medium text-slate-900"
              labelClassName="font-medium text-slate-500"
            />

            <div>
              <PhoneInput
                value={watch("phone")}
                label="رقم الجوال"
                error={errors.phone?.message}
                onChange={(phone, dialCode, isValid) => {
                  setValue("phone", isValid ? phone : "", {
                    shouldValidate: true,
                  });
                  setValue("phoneCountryCode", dialCode, {
                    shouldValidate: true,
                  });
                }}
              />
              <input type="hidden" {...register("phone")} />
              <input type="hidden" {...register("phoneCountryCode")} />
            </div>

            <FloatingLabelInput
              id="message"
              type="textarea"
              label="الرسالة"
              register={register("message")}
              watchValue={watch("message")}
              error={errors.message?.message}
              rows={4}
              containerClassName="min-h-[130px] border-gray-300 rounded-lg bg-white"
              inputClassName="font-medium text-slate-900"
              labelClassName="font-medium text-slate-500"
            />

            <button
              type="submit"
              disabled={isSubmittingBooking}
              className="mt-1 h-12 rounded-lg bg-primary text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingBooking ? "جارٍ الإرسال..." : "إرسال الطلب"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TripDetailsPage;
