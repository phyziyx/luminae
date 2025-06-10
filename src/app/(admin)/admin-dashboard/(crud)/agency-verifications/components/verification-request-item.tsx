"use client";

import { useState } from "react";
import { Download, FileText, Calendar, Mail, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VerificationActions from "./verification-actions";

interface VerificationRequest {
  id: number;
  name: string;
  email: string;
  message: string;
  dateSubmitted: string;
  status: "pending" | "verified" | "rejected";
  attachment?: {
    name: string;
    size: number;
    url: string;
  } | null;
}

interface VerificationRequestItemProps {
  request: VerificationRequest;
  onStatusChange: (
    requestId: number,
    newStatus: "verified" | "rejected"
  ) => void;
}

export default function VerificationRequestItem({
  request,
  onStatusChange,
}: VerificationRequestItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            Pending
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
            ✅ Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800">
            ❌ Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`;
    }
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-soft transition-all hover:shadow-md">
      <Accordion
        type="single"
        collapsible
        value={isExpanded ? `item-${request.id}` : ""}
        onValueChange={(value) => setIsExpanded(!!value)}
      >
        <AccordionItem value={`item-${request.id}`} className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between text-left">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {request.name}
                  </h3>
                  {getStatusBadge(request.status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {request.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(request.dateSubmitted)}
                  </span>
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 pb-6">
            <div className="space-y-6">
              <Separator className="bg-gray-200 dark:bg-gray-700" />

              {/* Full Details */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <User className="h-4 w-4" />
                      Full Name
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">
                      {request.name}
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">
                      {request.email}
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Calendar className="h-4 w-4" />
                      Date Submitted
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">
                      {formatDate(request.dateSubmitted)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FileText className="h-4 w-4" />
                      Attachment
                    </div>
                    {request.attachment ? (
                      <div className="flex items-center gap-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
                        <FileText className="h-5 w-5 text-primary dark:text-primary-light" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {request.attachment.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(request.attachment.size)}
                          </p>
                        </div>
                        <a
                          href={request.attachment.url}
                          className="flex items-center gap-1 text-sm text-primary dark:text-primary-light hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No attachment provided
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {request.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {request.status === "pending" && (
                <>
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <VerificationActions
                    requestId={request.id}
                    requestName={request.name}
                    onStatusChange={onStatusChange}
                  />
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
