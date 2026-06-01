import Service from "./Service";
import Deals from "./Deals";
import Recommended from "./Recommended";
import Trip from "./Trip";

export default function Mobile() {
  return (
    <section className="mx-auto w-full max-w-[860px] px-5 pb-10 pt-[60px]">
      <Service />
      <Deals />
      <Trip />
      <Recommended />
    </section>
  );
}
