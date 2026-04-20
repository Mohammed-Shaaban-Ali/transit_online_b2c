import FlightBookingPage from "@/components/pages/flights-test/FlightBookingPage";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";

export default async function page() {
  return (
    <section className="relative flex min-h-screen flex-col md:bg-primary">
      <div className="h-[76px]">
        <NewNavbar />
      </div>{" "}
      <FlightBookingPage />
    </section>
  );
}
