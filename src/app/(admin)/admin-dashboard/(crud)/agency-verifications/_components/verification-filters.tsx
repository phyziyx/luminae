"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface VerificationRequest {
  id: number;
  name: string;
  email: string;
  message: string;
  dateSubmitted: string;
  status: "pending" | "verified" | "rejected";
  attachment: {
    name: string;
    size: number;
    url: string;
  } | null;
}

interface VerificationFiltersProps {
  requests: VerificationRequest[];
  onFilteredRequestsChange: (filteredRequests: VerificationRequest[]) => void;
}

export default function VerificationFilters({
  requests,
  onFilteredRequestsChange,
}: VerificationFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    let filtered = [...requests];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (req) =>
          req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.dateSubmitted).getTime();
      const dateB = new Date(b.dateSubmitted).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    onFilteredRequestsChange(filtered);
  }, [
    requests,
    searchQuery,
    statusFilter,
    sortOrder,
    onFilteredRequestsChange,
  ]);

  return (
    <Card className="mb-6 overflow-hidden bg-white dark:bg-gray-800 shadow-soft">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 dark:border-gray-700 focus-visible:ring-primary dark:focus-visible:ring-primary-light dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[140px] border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Showing "X" results, remove if you think it's unncessary or a hassle */}

        {/* <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Showing {requests.length} request{requests.length !== 1 ? "s" : ""}
        </div> */}
      </CardContent>
    </Card>
  );
}
