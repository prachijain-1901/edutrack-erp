"use client";

import { useEffect } from "react";
import { useSidebarStore } from "@/store/sidebar.store";

/**
 * Handles closing the mobile sidebar when the window is resized
 * to a desktop breakpoint.
 */
export function useSidebar() {
  const store = useSidebarStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        store.closeMobile();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [store]);

  return store;
}
