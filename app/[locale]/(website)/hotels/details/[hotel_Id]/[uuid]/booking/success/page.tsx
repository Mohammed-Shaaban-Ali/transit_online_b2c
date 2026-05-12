import HotelBookingSuccessPage from "@/components/pages/hotel/HotelBookingSuccessPage";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";

export default async function page() {
  return (
    <div className="">
      <NewNavbar />
      <HotelBookingSuccessPage />
    </div>
  );
}
