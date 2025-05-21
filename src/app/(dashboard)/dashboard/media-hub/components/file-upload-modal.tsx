"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileTypeSelector } from "./file-type-selector";
import { FileDropzone } from "./file-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { upload } from "@vercel/blob/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { toast } = useToast();

  const handleFileTypeSelect = (fileType: string) => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Here you would implement the actual file upload logic
    console.log("Uploading file:", selectedFile);

    try {
      await upload(selectedFile.name, selectedFile, {
        access: "public",
        handleUploadUrl: "/api/agency/upload",
        multipart: true,
      });

      toast({
        title: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Error uploading file",
        variant: "destructive",
      });
    }

    // Reset and close modal
    setSelectedFile(null);
    onClose();
  };

  const handleCancel = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#0B1120] backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl text-slate-900 dark:text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload New File</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <FileTypeSelector onFileTypeSelect={handleFileTypeSelect} />

          <AnimatePresence>
            {
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FileDropzone
                  onFileSelect={setSelectedFile}
                  selectedFile={selectedFile}
                />
              </motion.div>
            }
          </AnimatePresence>
        </div>

        {/* <div>{uploadProgress}%</div> */}

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={!selectedFile}
            onClick={handleUpload}
            className={`${
              selectedFile
                ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-md hover:shadow-lg"
                : ""
            }`}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
