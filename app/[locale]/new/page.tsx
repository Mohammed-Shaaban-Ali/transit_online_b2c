import Navbar from "@/components/pages/new/layout/Navbar";
import Sidebar from "@/components/pages/new/layout/sidebar";
import { SidebarMiniProvider } from "@/components/pages/new/layout/sidebar-mini-context";
import Home from "@/components/pages/new/home";
import Mobile from "@/components/pages/new/mobile";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Menu, Search } from "lucide-react";
import logo from "@/public/transit_logos/transit_logo_q.png";
import sidebarItems from "@/components/pages/new/layout/sidebar/items";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {};

function page({}: Props) {
  return (
    <SidebarMiniProvider>
      <section className="relative flex  min-h-0 w-full overflow-hidden">
        <div className="md:hidden fixed top-0 left-0 z-50 w-full border-b border-gray-200 bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="shrink-0">
              <Image
                src={logo}
                alt="Transit"
                width={72}
                height={24}
                className="h-6 w-auto object-contain"
                priority
              />
            </Link>

            <div className="flex h-9 min-w-0 flex-1 items-center rounded-full bg-gray-100 px-3">
              <Search className="h-4 w-4 shrink-0 text-gray-500" />
              <input
                type="search"
                placeholder="Where to?"
                aria-label="Search"
                className="w-full bg-transparent px-2 text-sm text-gray-800 outline-none placeholder:text-gray-500"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-800 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88%] p-0 sm:max-w-sm">
                <div className="border-b border-gray-100 px-4 py-3">
                  <SheetTitle className="text-base">Menu</SheetTitle>
                </div>
                <nav className="max-h-[calc(100vh-56px)] overflow-y-auto py-2">
                  {sidebarItems.map((group, groupIndex) => (
                    <div key={groupIndex}>
                      {groupIndex > 0 && (
                        <div
                          className="my-2 h-px w-full bg-gray-100"
                          role="separator"
                          aria-hidden
                        />
                      )}
                      <ul className="px-2 py-1">
                        {group.map((item) => {
                          const Icon = item.icon;
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
                              >
                                <Icon
                                  className="size-5 shrink-0 text-gray-600"
                                  strokeWidth={1.75}
                                  aria-hidden
                                />
                                <span className="truncate">{item.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="md:hidden w-full">
          <Mobile />
        </div>
        <div className="hidden w-full md:block">
          <Home />
        </div>
      </section>
    </SidebarMiniProvider>
  );
}

export default page;
