"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const fileTypes = [
  { value: "image", label: "Image" },
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "Word Document" },
  { value: "sheet", label: "Excel/CSV Sheet" },
  { value: "text", label: "Text File" },
];

interface FileTypeSelectorProps {
  onFileTypeSelect: (fileType: string) => void;
}

export function FileTypeSelector({ onFileTypeSelect }: FileTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState("");

  const handleValueChange = (value: string) => {
    setSelectedType(value);
    onFileTypeSelect(value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-type">
          What type of file would you like to upload?
        </Label>
        <Select onValueChange={handleValueChange} value={selectedType}>
          <SelectTrigger id="file-type" className="w-full">
            <SelectValue placeholder="Select file type" />
          </SelectTrigger>
          <SelectContent>
            {fileTypes.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
