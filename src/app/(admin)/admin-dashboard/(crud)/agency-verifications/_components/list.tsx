"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import agencyVerificationOptions from "./query-option";
import { createColumnHelper } from "@tanstack/react-table";
import { AgencyVerification } from "@prisma/client";

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
  const { data, refetch } = useSuspenseQuery(
    agencyVerificationOptions({
      appId: "",
      query: "",
    })
  );

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default AgencyVerificationList;
