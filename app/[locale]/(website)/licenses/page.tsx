import LicenseBookingPage from "@/components/pages/licenses/LicenseBookingPage";
import LicenseHero from "@/components/pages/licenses/LicenseHero";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";

export default function Page() {
  return (
    <>
      <NewNavbar />

      <section className="relative">
        <LicenseHero />

        <section className="relative z-0 min-w-0 overflow-x-clip bg-white py-6 md:-mt-16 md:rounded-t-[32px] md:py-12">
          <LicenseBookingPage />
        </section>
      </section>
    </>
  );
}
