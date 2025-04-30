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
  fileType: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export function FileDropzone({
  fileType,
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

  // Get accepted file types based on fileType
  const getAcceptedFileTypes = () => {
    switch (fileType) {
      case "image":
        return "image/*";
      case "pdf":
        return ".pdf";
      case "doc":
        return ".doc,.docx";
      case "sheet":
        return ".xls,.xlsx,.csv";
      case "text":
        return ".txt";
      default:
        return "";
    }
  };

  // Get icon based on fileType
  const getFileIcon = () => {
    switch (fileType) {
      case "image":
        return (
          <ImageIcon className="h-10 w-10 text-blue-500 dark:text-blue-400" />
        );
      case "pdf":
        return (
          <FileIcon className="h-10 w-10 text-red-500 dark:text-red-400" />
        );
      case "doc":
        return (
          <FileIcon className="h-10 w-10 text-blue-500 dark:text-blue-400" />
        );
      case "sheet":
        return (
          <FileSpreadsheetIcon className="h-10 w-10 text-green-500 dark:text-green-400" />
        );
      case "text":
        return (
          <FileTextIcon className="h-10 w-10 text-yellow-500 dark:text-yellow-400" />
        );
      default:
        return (
          <FileIcon className="h-10 w-10 text-slate-500 dark:text-slate-400" />
        );
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={getAcceptedFileTypes()}
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
          {getFileIcon()}
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Click to upload or drag and drop your file here
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            {fileType === "image"
              ? "PNG, JPG, GIF up to 10MB"
              : fileType === "pdf"
              ? "PDF files up to 10MB"
              : fileType === "doc"
              ? "DOC, DOCX files up to 10MB"
              : fileType === "sheet"
              ? "XLS, XLSX, CSV files up to 10MB"
              : "TXT files up to 10MB"}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center">
            {selectedFile.type.includes("image") ? (
              <div className="w-16 h-16 mr-4 rounded overflow-hidden bg-white dark:bg-slate-700">
                <Image
                  src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                />
              </div>
            ) : (
              <div className="w-16 h-16 mr-4 flex items-center justify-center bg-white dark:bg-slate-700 rounded">
                {getFileIcon()}
              </div>
            )}
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onFileSelect(null as any);
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
