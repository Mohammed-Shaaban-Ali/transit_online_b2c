import React from "react";
import Navbar from "@/components/pages/new/layout/Navbar";
import Sidebar from "@/components/pages/new/layout/sidebar";
import { SidebarMiniProvider } from "@/components/pages/new/layout/sidebar-mini-context";

type Props = {};

function page({}: Props) {
  return (
    <SidebarMiniProvider>
      <section className="relative flex  min-h-0 w-full overflow-hidden">
        <Navbar />
        <Sidebar />

        <div
          className="relative z-0 min-h-0 flex-1 overflow-y-auto pt-[68px] ms-8 me-2.5 mt-8"
          role="main"
        >
          <div className="w-full rounded-lg  bg-green-200 h-screen" />
        </div>
      </section>
    </SidebarMiniProvider>
  );
}

export default page;
