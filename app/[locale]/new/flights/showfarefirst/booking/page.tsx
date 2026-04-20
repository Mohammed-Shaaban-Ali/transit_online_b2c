import FlightBookingPage from "@/components/pages/flights-test/FlightBookingPage";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";

export default async function page() {
  return (
    <section className="relative  md:bg-primary">
      <div className="h-16"></div>

      <FlightBookingPage />
    </section>
  );
}
