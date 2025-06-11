import { fetchAgencyVerificationApps } from "@/lib/managers/agencyManager";
import { queryKeys } from "@/lib/react-query";
import { queryOptions } from "@tanstack/react-query";

interface AgencyVerificationOptionsProps {
  query: string;
  page: number;
  filter: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
}

const agencyVerificationOptions = ({
  query = "",
  page = 1,
  filter = "ALL",
}: AgencyVerificationOptionsProps) => {
  return queryOptions({
    queryKey: queryKeys.admin.verification.search({
      query,
      page,
      filter,
    }),
    queryFn: () => {
      return fetchAgencyVerificationApps({ query, page, filter });
    },
  });
};

export default agencyVerificationOptions;
