"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export default function TagInput({
  value,
  onChange,
  maxTags = 5,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="tags" className="text-gray-700 dark:text-gray-300">
        Tags (Optional)
      </Label>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2">
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-1 rounded-full bg-primary/10 dark:bg-primary-light/20 px-3 py-1 text-sm text-primary dark:text-primary-light"
            >
              #{tag}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTag(index)}
                className="h-4 w-4 p-0 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary-light/30 rounded-full"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag}</span>
              </Button>
            </div>
          ))}
        </div>

        <Input
          id="tags"
          placeholder={
            value.length >= maxTags
              ? "Max tags reached"
              : "Add tags... (press Enter or comma to add)"
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          disabled={value.length >= maxTags}
          className="border-0 focus-visible:ring-0 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Add up to {maxTags} tags to help others find your post. Press Enter or
        comma to add a tag.
      </p>
    </div>
  );
}
