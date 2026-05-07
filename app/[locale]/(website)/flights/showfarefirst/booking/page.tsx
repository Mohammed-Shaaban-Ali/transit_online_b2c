import FlightBookingPage from "@/components/pages/flights-test/FlightBookingPage";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";

export default async function page() {
  return (
    <section className="relative flex min-h-screen flex-col text-sm md:bg-primary md:text-base">
      <div
        className="md:h-[76px] md:bg-transparent 
      h-[108px] bg-primary "
      >
        <NewNavbar />
      </div>
      <FlightBookingPage />
    </section>
  );
}
