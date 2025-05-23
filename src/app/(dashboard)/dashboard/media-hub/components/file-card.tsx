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

interface FileCardProps {
  file: AgencyFile;
  view: "grid" | "list";
}

export function FileCard({ file, view = "list" }: FileCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActionPending, setActionPending] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [isRenameDialogOpen, setRenameDialogOpen] = useState(false);

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

  const renameFile = async (key: string, newName: string) => {
    setActionPending(true);

    try {
      const response = await fetch("/api/agency/rename", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename file");
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "File renamed successfully",
        });
      } else {
        throw new Error(data.error || "Failed to rename file");
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to rename file",
      });
    }

    setActionPending(false);
  };

  const handleRenameClick = () => {
    setRenameDialogOpen(true);
    setNewName(file.name);
  };

  const handleRenameSubmit = async () => {
    if (newName.trim() && newName !== file.name) {
      await renameFile(file.key, newName.trim());
    }
    setRenameDialogOpen(false);
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
        {/* {file.key === "image" ? (
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
        )} */}
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
            {new Date(file.createdAt).toLocaleDateString()}
          </p>
        </div>

        <AnimatePresence>
          {(isHovered || view === "list") && (
            <motion.div
              className={cn("flex items-center gap-2 justify-end")}
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
                  <DropdownMenuItem
                    onClick={() => downloadFile(file.key)}
                    disabled={isActionPending}
                  >
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleRenameClick}
                    disabled={isActionPending}
                  >
                    Rename
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={isActionPending}
                    onClick={() => deleteFile(file.key)}
                    className="text-red-500 dark:text-red-400"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isRenameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter new file name"
            />
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              style={{
                display: "grid",
                gridTemplateAreas: "stack",
              }}
              onClick={handleRenameSubmit}
              disabled={isActionPending}
            >
              <p
                style={{
                  gridArea: "stack",
                }}
                className={cn({
                  hidden: isActionPending,
                  visible: !isActionPending,
                })}
              >
                Save
              </p>
              <LoadingSpinner
                style={{
                  gridArea: "stack",
                }}
                className={cn({
                  hidden: !isActionPending,
                  visible: isActionPending,
                })}
              />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
