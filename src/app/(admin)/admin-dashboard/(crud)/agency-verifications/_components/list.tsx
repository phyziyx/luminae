"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import agencyVerificationOptions from "./query-option";
import { startTransition, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import VerificationRequestList from "./verification-request-list";
import { useUpdateVerificationStatus } from "./mutations";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function AgencyVerificationList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "ALL" | "APPROVED" | "REJECTED" | "PENDING"
  >("ALL");

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { isFetching, data } = useSuspenseQuery(
    agencyVerificationOptions({
      query: debouncedSearchTerm,
      page,
      filter,
    })
  );

  const { mutateAsync } = useUpdateVerificationStatus();

  return (
    <div>
      <div className="flex items-center mb-4 gap-4">
        <Input
          type="text"
          placeholder="Search by agency ID or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full bg-white dark:bg-gray-800"
        />

        <Select
          value={filter}
          onValueChange={(e) =>
            startTransition(() => setFilter(e as typeof filter))
          }
        >
          <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 dark:text-gray-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        style={{
          opacity: isFetching ? 0.5 : 1,
        }}
      >
        <VerificationRequestList
          requests={data.items}
          onStatusChange={(requestId, newStatus) => {
            mutateAsync({
              requestId,
              newStatus,
            });
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={() => {
            startTransition(() => setPage((prev) => Math.max(prev - 1, 1)));
          }}
          disabled={page === 1 || isFetching}
          className="px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </Button>

        <span>
          {data.items.length} / {data.meta.total} records
        </span>

        <span>
          <strong>Page:</strong> {page} / {data.meta.totalPages}
        </span>

        {data.meta.totalPages > 0 && (
          <span>
            <strong>Showing:</strong> {data.items[0].id} -{" "}
            {data.items[data.items.length - 1].id} of {data.meta.total} records
          </span>
        )}

        <Button
          onClick={() => {
            startTransition(() =>
              setPage((prev) => Math.min(prev + 1, data.meta.totalPages))
            );
          }}
          disabled={page === data.meta.totalPages || isFetching}
          className="px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default AgencyVerificationList;
