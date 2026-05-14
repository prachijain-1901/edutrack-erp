"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { NAV_ITEMS } from "@/lib/constants";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

/**
 * Generates breadcrumbs from the current pathname
 */
export function useBreadcrumbs(): BreadcrumbSegment[] {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbSegment[] = [];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Try to find a matching nav item label
      const navItem = NAV_ITEMS.find(
        (item) => item.href === currentPath || item.href === pathname
      );

      const label = navItem
        ? navItem.label
        : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      breadcrumbs.push({
        label,
        href: index < segments.length - 1 ? currentPath : undefined,
      });
    });

    return breadcrumbs;
  }, [pathname]);
}
