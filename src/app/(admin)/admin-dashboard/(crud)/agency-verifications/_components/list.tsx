"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import agencyVerificationOptions from "./query-option";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AgencyVerification } from "@prisma/client";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

const columnHelper = createColumnHelper<AgencyVerification>();
const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("agencyId", {
    header: "Agency ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => info.getValue().toISOString(),
  }),
];

function AgencyVerificationList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { isFetching, data } = useSuspenseQuery(
    agencyVerificationOptions({
      query: debouncedSearchTerm,
      page,
    })
  );

  const table = useReactTable({
    data: data.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <pre>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by agency ID or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
      </div>

      <div>{JSON.stringify(data.items, null, 2)}</div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => {
            setPage((prev) => Math.max(prev - 1, 1));
          }}
          disabled={page === 1 || isFetching}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

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

        <button
          onClick={() => {
            setPage((prev) => Math.min(prev + 1, data.meta.totalPages));
          }}
          disabled={page === data.meta.totalPages || isFetching}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </pre>
  );
}

export default AgencyVerificationList;
