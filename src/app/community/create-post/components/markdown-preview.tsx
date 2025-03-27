"use client";

import { MarkdownRenderer } from "../../components/markdown-renderer";

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return <MarkdownRenderer content={content} />;
}
