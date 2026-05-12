import HotelBookingFailedPage from "@/components/pages/hotel/HotelBookingFailedPage";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";

export default async function page() {
  return (
    <div className="">
      <NewNavbar />
      <HotelBookingFailedPage />
    </div>
  );
}
