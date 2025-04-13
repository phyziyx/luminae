"use client";

import type React from "react";

import { useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Code,
  ImageIcon,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleTextareaSelect = (
    e: React.SyntheticEvent<HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectionStart(target.selectionStart);
    setSelectionEnd(target.selectionEnd);
  };

  const insertMarkdown = (
    markdownBefore: string,
    markdownAfter = "",
    defaultText = ""
  ) => {
    const newText =
      value.substring(0, selectionStart) +
      markdownBefore +
      (selectionStart === selectionEnd
        ? defaultText
        : value.substring(selectionStart, selectionEnd)) +
      markdownAfter +
      value.substring(selectionEnd);

    onChange(newText);

    // Focus back on textarea after button click
    setTimeout(() => {
      const textarea = document.getElementById(
        "content"
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();

        const newCursorPos =
          selectionStart +
          markdownBefore.length +
          (selectionStart === selectionEnd
            ? defaultText.length
            : selectionEnd - selectionStart);

        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const formatters = [
    {
      icon: <Bold className="h-4 w-4" />,
      tooltip: "Bold",
      action: () => insertMarkdown("**", "**", "bold text"),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      tooltip: "Italic",
      action: () => insertMarkdown("*", "*", "italic text"),
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      tooltip: "Strikethrough",
      action: () => insertMarkdown("~~", "~~", "strikethrough text"),
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      tooltip: "Heading 1",
      action: () => insertMarkdown("# ", "", "Heading 1"),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      tooltip: "Heading 2",
      action: () => insertMarkdown("## ", "", "Heading 2"),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      tooltip: "Heading 3",
      action: () => insertMarkdown("### ", "", "Heading 3"),
    },
    {
      icon: <List className="h-4 w-4" />,
      tooltip: "Bullet List",
      action: () => insertMarkdown("- ", "", "List item"),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      tooltip: "Numbered List",
      action: () => insertMarkdown("1. ", "", "List item"),
    },
    {
      icon: <Link className="h-4 w-4" />,
      tooltip: "Link",
      action: () => insertMarkdown("[", "](https://example.com)", "link text"),
    },
    {
      icon: <ImageIcon className="h-4 w-4" />,
      tooltip: "Image",
      action: () =>
        insertMarkdown("![", "](https://example.com/image.jpg)", "alt text"),
    },
    {
      icon: <Code className="h-4 w-4" />,
      tooltip: "Code Block",
      action: () => insertMarkdown("```\n", "\n```", "code here"),
    },
    {
      icon: <Quote className="h-4 w-4" />,
      tooltip: "Quote",
      action: () => insertMarkdown("> ", "", "quote text"),
    },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">
        Post Content
      </Label>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2">
          <TooltipProvider>
            {formatters.map((formatter, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={formatter.action}
                    className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
                  >
                    {formatter.icon}
                    <span className="sr-only">{formatter.tooltip}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{formatter.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        <Textarea
          id="content"
          placeholder="Write your post here... Markdown is supported!"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onSelect={handleTextareaSelect}
          className="min-h-[300px] border-0 focus-visible:ring-0 resize-y dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Use markdown to format your post. You can preview your post by clicking
        the Preview tab.
      </p>
    </div>
  );
}
