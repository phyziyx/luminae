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
import { AgencyFile } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { FileIcon } from "./file-icon";
import { ImageIcon } from "lucide-react";

interface FileCardProps {
  file: AgencyFile;
  view: "grid" | "list";
}

const getFileSize = (size: number) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${
    ["B", "KB", "MB", "GB"][i]
  }`;
};

export function FileCard({ file, view = "list" }: FileCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActionPending, setActionPending] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  const downloadFile = async (key: string) => {
    setActionPending(true);

    try {
      const response = await fetch("/api/agency/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const data = await response.json();

      if (data.success && data.url) {
        // Open the URL in a new tab
        window.open(data.url, "_blank");

        toast({
          title: "Success",
          description: "File download started",
        });
      } else {
        throw new Error(data.error || "Failed to generate download URL");
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to download file",
      });
    }

    setActionPending(false);
  };

  const deleteFile = async (key: string) => {
    setActionPending(true);

    try {
      const response = await fetch("/api/agency/upload", {
        method: "DELETE",
        body: JSON.stringify({ key }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      const data = await response.json();
      toast({
        title: data.success ? "Success" : "Error",
        description: data.success
          ? "File deleted successfully"
          : "Failed to delete file",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
      });
    }

    setActionPending(false);
  };

  const handleDeleteClick = (key: string) => {
    setFileToDelete(key);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (fileToDelete) {
      await deleteFile(fileToDelete);
    }
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl overflow-hidden",
        view === "grid" ? "w-full" : "w-full flex items-center"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={view === "grid" ? "w-full" : "w-1/4 h-20"}>
        {file.key === "image" ? (
          <div className="relative w-full h-full">
            <ImageIcon
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
          "p-3 justify-between",
          view === "grid"
            ? "flex justify-between flex-col h-[5.5rem]"
            : "flex-1 flex justify-between items-center"
        )}
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-slate-800 dark:text-slate-200 truncate">
            {file.name}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {new Date(file.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {getFileSize(file.size)}
          </p>
        </div>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AnimatePresence>
            {(isHovered || view === "list") && (
              <motion.div
                className={cn("flex items-center gap-2 justify-end")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={"secondary"}
                      className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
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
                      {/* <span className="sr-only">Open menu</span> */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem
                      onClick={() => downloadFile(file.key)}
                      disabled={isActionPending}
                    >
                      Download
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      disabled={isActionPending}
                      onClick={() => handleDeleteClick(file.key)}
                      className="text-red-500 dark:text-red-400"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </AnimatePresence>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this file? This action cannot be
              undone.
            </p>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} disabled={isActionPending}>
                {isActionPending ? <LoadingSpinner /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
