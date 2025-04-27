"use client";

import { motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Tab {
  id: string;
  label: string;
}

interface TabsMenuProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export function TabsMenu({ tabs, activeTab, setActiveTab }: TabsMenuProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 sticky top-16 z-20">
      <LayoutGroup>
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "px-4 py-1.5 h-auto rounded-full text-sm font-medium whitespace-nowrap relative",
                activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-full -z-10"
                  layoutId="activeTabPill"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {tab.label}
            </Button>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
