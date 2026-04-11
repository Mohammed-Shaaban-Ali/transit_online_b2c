import Navbar from "@/components/pages/new/layout/Navbar";
import Sidebar from "@/components/pages/new/layout/sidebar";
import { SidebarMiniProvider } from "@/components/pages/new/layout/sidebar-mini-context";
import Home from "@/components/pages/new/home";

type Props = {};

function page({}: Props) {
  return (
    <SidebarMiniProvider>
      <section className="relative flex  min-h-0 w-full overflow-hidden">
        <Navbar />
        <Sidebar />

        <Home />
      </section>
    </SidebarMiniProvider>
  );
}

export default page;
