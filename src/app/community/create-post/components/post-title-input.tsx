"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PostTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function PostTitleInput({
  value,
  onChange,
  maxLength = 150,
}: PostTitleInputProps) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
      setCharCount(newValue.length);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
        Post Title
      </Label>

      <Input
        id="title"
        placeholder="Enter your post title..."
        value={value}
        onChange={handleChange}
        className="border-gray-200 dark:border-gray-700 focus-visible:ring-primary dark:focus-visible:ring-primary-light dark:bg-gray-800 dark:text-gray-100"
      />

      <div className="flex justify-end">
        <span
          className={`text-xs ${
            charCount > maxLength * 0.8
              ? charCount >= maxLength
                ? "text-red-500 dark:text-red-400"
                : "text-amber-500 dark:text-amber-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {charCount}/{maxLength} characters
        </span>
      </div>
    </div>
  );
}
