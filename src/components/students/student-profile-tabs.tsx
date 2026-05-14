"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Student Profile Tabs
// Uses iconName strings (not component refs) so it can receive
// props safely from Server Components.
// ─────────────────────────────────────────────

export interface ProfileTab {
  id: string;
  label: string;
  iconName?: string;
}

interface StudentProfileTabsProps {
  tabs: ProfileTab[];
  children: React.ReactNode[];
  className?: string;
}

export function StudentProfileTabs({
  tabs,
  children,
  className,
}: StudentProfileTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className={cn("space-y-0", className)}>
      {/* Tab Bar */}
      <div className="relative flex gap-0 border-b border-border overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const IconComp = tab.iconName
            ? (Icons as unknown as Record<string, LucideIcon>)[tab.iconName]
            : null;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150 shrink-0",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {IconComp && (
                <IconComp className="w-4 h-4 shrink-0" />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div key={activeTab} className="animate-in fade-in-0 duration-150">
        {children[activeIndex]}
      </div>
    </div>
  );
}
