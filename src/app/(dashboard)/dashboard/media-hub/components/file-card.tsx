"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileIcon } from "./file-icon";
import Image from "next/image";

interface FileCardProps {
  file: {
    id: number;
    name: string;
    type: string;
    date: string;
    isFavorite: boolean;
    imageUrl?: string;
  };
  view: "grid" | "list";
}

export function FileCard({ file, view }: FileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl overflow-hidden",
        "border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md dark:shadow-slate-900/30",
        view === "grid" ? "w-full" : "w-full flex items-center"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -2,
        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.3)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={view === "grid" ? "w-full" : "w-1/4 h-20"}>
        {file.type === "image" ? (
          <div className="relative w-full h-full">
            <Image
              src={file.imageUrl || "/placeholder.svg"}
              alt={file.name}
              className={cn(
                "object-cover",
                view === "grid" ? "w-full h-32" : "w-full h-20"
              )}
              width={view === "grid" ? 128 : 80}
              height={view === "grid" ? 128 : 80}
            />
          </div>
        ) : (
          <div className={view === "grid" ? "h-32" : "h-20"}>
            <FileIcon type={file.type} />
          </div>
        )}
      </div>
      <div
        className={cn(
          "p-3",
          view === "grid"
            ? "flex justify-between flex-col h-[5.5rem]"
            : "flex-1 flex justify-between items-center"
        )}
      >
        <div>
          <h3 className="font-medium text-slate-800 dark:text-slate-200 truncate">
            {file.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {new Date(file.date).toLocaleDateString()}
          </p>
        </div>

        <AnimatePresence>
          {(isHovered || view === "list") && (
            <motion.div
              className={cn(
                "flex items-center gap-2 justify-end",
                view === "grid" ? "" : ""
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      width="15"
                      height="3"
                      viewBox="0 0 15 3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="1.5"
                        cy="1.5"
                        r="1.5"
                        className="fill-slate-600 dark:fill-slate-400"
                      />
                      <circle
                        cx="7.5"
                        cy="1.5"
                        r="1.5"
                        className="fill-slate-600 dark:fill-slate-400"
                      />
                      <circle
                        cx="13.5"
                        cy="1.5"
                        r="1.5"
                        className="fill-slate-600 dark:fill-slate-400"
                      />
                    </svg>
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500 dark:text-red-400">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
