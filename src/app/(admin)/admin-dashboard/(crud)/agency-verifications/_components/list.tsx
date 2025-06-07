"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import agencyVerificationOptions from "./query-option";

function AgencyVerificationList() {
  const { data } = useSuspenseQuery(
    agencyVerificationOptions({
      appId: "",
      query: "",
    })
  );

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default AgencyVerificationList;
