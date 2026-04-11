"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SidebarMiniContextValue = {
  isMini: boolean;
  toggleMini: () => void;
};

const SidebarMiniContext = createContext<SidebarMiniContextValue | null>(null);

export function SidebarMiniProvider({ children }: { children: ReactNode }) {
  const [isMini, setIsMini] = useState(false);
  const toggleMini = useCallback(() => {
    setIsMini((v) => !v);
  }, []);

  const value = useMemo(
    () => ({ isMini, toggleMini }),
    [isMini, toggleMini],
  );

  return (
    <SidebarMiniContext.Provider value={value}>
      {children}
    </SidebarMiniContext.Provider>
  );
}

export function useSidebarMini() {
  const ctx = useContext(SidebarMiniContext);
  if (!ctx) {
    throw new Error("useSidebarMini must be used within SidebarMiniProvider");
  }
  return ctx;
}
