"use client";

import React, { useRef, useCallback } from "react";

import { Menu } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

import { useSidebarMini } from "../sidebar-mini-context";
import getSidebarItems from "./items";
import type { SidebarItem } from "./items";

const SIDEBAR_FULL_W = 220;

type Props = {
  className?: string;
};

function isActivePath(pathname: string, href: string) {
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

const linkRowClass = (active: boolean, disabled: boolean) =>
  cn(
    "flex items-center gap-5 ps-3.5 px-2 py-2.5 text-[15px] text-gray-900 transition-colors hover:bg-gray-100",
    active && "bg-gray-50 text-primary",
    disabled && "opacity-50 cursor-not-allowed",
  );

function ItemLabel({ item }: { item: SidebarItem }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2 truncate leading-tight font-medium">
      <span className="min-w-0 truncate">{item.label}</span>
    </span>
  );
}

function SidebarNavContent({
  showTitleAsTooltip,
  navRef,
  scrollTop,
  onScroll,
}: {
  showTitleAsTooltip: boolean;
  navRef?: React.RefObject<HTMLElement | null>;
  scrollTop?: number;
  onScroll?: (scrollTop: number) => void;
}) {
  const pathname = usePathname();
  const t = useTranslations("NewPage.sidebar");
  const sidebarItemsT = useTranslations("NewPage.sidebar.items");
  const sidebarItems = getSidebarItems(sidebarItemsT);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      onScroll?.((e.target as HTMLElement).scrollTop);
    },
    [onScroll],
  );

  const refCallback = useCallback(
    (node: HTMLElement | null) => {
      if (navRef) {
        (navRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
      if (node && scrollTop !== undefined) {
        node.scrollTop = scrollTop;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <nav
      ref={refCallback}
      className="custom-scrollbar-hover flex min-h-0 flex-1 flex-col overflow-y-auto ps-2.5 py-3"
      aria-label={t("mainNav")}
      onScroll={onScroll ? handleScroll : undefined}
    >
      {sidebarItems.map((group, groupIndex) => (
        <div key={groupIndex}>
          {groupIndex > 0 && (
            <div
              className="my-3 h-px w-full bg-gray-100"
              role="separator"
              aria-hidden
            />
          )}
          <ul className="flex flex-col gap-0.5">
            {group.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href);

              return (
                <li key={item.href}>
                  {item.disabled ? (
                    <button
                      type="button"
                      className={`${linkRowClass(active, item.disabled ?? true)} w-full`}
                    >
                      <Icon
                        className="size-[22px] shrink-0 text-gray-600"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <ItemLabel item={item} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      title={showTitleAsTooltip ? item.label : undefined}
                      className={linkRowClass(active, item.disabled ?? true)}
                    >
                      <Icon
                        className="size-[22px] shrink-0 text-gray-600"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <ItemLabel item={item} />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarHeaderToggle({ align }: { align: "start" | "center" }) {
  const { isMini, toggleMini } = useSidebarMini();
  const t = useTranslations("NewPage.navbar");

  return (
    <div
      className={cn(
        "flex h-[68px] shrink-0 items-center ps-5 border-b border-gray-200 transition-[padding,justify-content] duration-220 ease-linear",
      )}
    >
      <button
        type="button"
        aria-label={isMini ? t("expandSidebar") : t("collapseSidebar")}
        aria-pressed={isMini}
        onClick={toggleMini}
        className="relative inline-flex items-center justify-center rounded-md p-1.5 text-gray-900 transition-all hover:bg-gray-100"
      >
        <Menu className="size-5" strokeWidth={1} />
      </button>
    </div>
  );
}

function Sidebar({ className }: Props) {
  const { isMini } = useSidebarMini();
  const primaryNavRef = useRef<HTMLElement | null>(null);
  const overlayNavRef = useRef<HTMLElement | null>(null);
  const scrollTopRef = useRef(0);

  const handlePrimaryScroll = useCallback((top: number) => {
    scrollTopRef.current = top;
    if (overlayNavRef.current) overlayNavRef.current.scrollTop = top;
  }, []);

  const handleOverlayScroll = useCallback((top: number) => {
    scrollTopRef.current = top;
    if (primaryNavRef.current) primaryNavRef.current.scrollTop = top;
  }, []);

  if (!isMini) {
    return (
      <aside
        className={cn("flex h-screen min-h-0 w-[220px] flex-col ", className)}
      >
        <div className="fixed start-0 top-0 z-40 flex h-screen w-[220px] flex-col border-e border-gray-100 bg-white">
          <SidebarHeaderToggle align="start" />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <SidebarNavContent showTitleAsTooltip={false} />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "group/sidebar fixed start-0 top-0 z-40 flex h-screen min-h-0 w-16 flex-col border-e  border-gray-100 bg-white",
        className,
      )}
    >
      <SidebarHeaderToggle align="center" />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className="flex min-h-0 flex-1 flex-col"
          style={{ width: SIDEBAR_FULL_W, minWidth: SIDEBAR_FULL_W }}
        >
          <SidebarNavContent
            showTitleAsTooltip
            navRef={primaryNavRef}
            onScroll={handlePrimaryScroll}
          />
        </div>
      </div>

      {/* Expanded overlay on hover — covers both header and nav */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute start-0 top-0 bottom-0 z-50 min-h-0 flex flex-col",
          "w-0 overflow-hidden border-e border-gray-100 bg-white opacity-0",
          "transition-[width,opacity] duration-220 ease-linear",
          "group-hover/sidebar:pointer-events-auto group-hover/sidebar:w-[220px] group-hover/sidebar:opacity-100",
          "group-focus-within/sidebar:pointer-events-auto group-focus-within/sidebar:w-[220px] group-focus-within/sidebar:opacity-100",
        )}
      >
        <div className="flex h-full min-h-0 w-[220px] flex-col">
          <SidebarHeaderToggle align="start" />
          <SidebarNavContent
            showTitleAsTooltip={false}
            navRef={overlayNavRef}
            scrollTop={scrollTopRef.current}
            onScroll={handleOverlayScroll}
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
