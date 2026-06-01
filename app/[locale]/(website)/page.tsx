import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import Home from "@/components/pages/new/home";

type Props = {};

function page({}: Props) {
  return (
    <>
      <NewNavbar isBgWhite />

      <section className="relative w-full overflow-hidden">
        <Home />
      </section>
    </>
  );
}

export default page;
