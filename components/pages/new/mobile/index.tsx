import Service from "./Service";
import Deals from "./Deals";
import Trip from "./Trip";
import Recommended from "./Recommended";

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
