"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
  value: File | null | undefined;
  onChange: (file: File | null, preview: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onChange(null, "");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange(null, "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-gray-700 dark:text-gray-300">
        Featured Image (Optional)
      </Label>

      {value ? (
        <div className="relative overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          <Image
            src={value ? URL.createObjectURL(value) : "/placeholder.svg"}
            alt="Preview"
            className="w-full object-cover max-h-64"
            width={1200}
            height={600}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemoveImage}
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors ${isDragging
              ? "border-primary dark:border-primary-light bg-primary/5 dark:bg-primary-light/10"
              : "border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary-light"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Drag and drop an image, or{" "}
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-primary dark:text-primary-light hover:underline"
                >
                  browse
                </label>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports JPG, PNG, GIF up to 1MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/gif"
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
