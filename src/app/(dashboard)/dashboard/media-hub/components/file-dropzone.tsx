"use client";

import type React from "react";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  FileIcon,
  ImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileDropzone({
  onFileSelect,
  selectedFile,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInputChange}
      />

      {!selectedFile ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
            isDragging
              ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <FileIcon className="h-10 w-10 text-slate-500 dark:text-slate-400" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Click to upload or drag and drop your file here
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            up to 10MB
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
