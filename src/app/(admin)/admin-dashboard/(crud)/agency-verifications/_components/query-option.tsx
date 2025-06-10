import { fetchAgencyVerificationApps } from "@/lib/managers/agencyManager";
import { queryKeys } from "@/lib/react-query";
import { queryOptions } from "@tanstack/react-query";

interface AgencyVerificationOptionsProps {
  query: string;
  page: number;
}

const agencyVerificationOptions = ({
  query = "",
  page = 1,
}: AgencyVerificationOptionsProps) => {
  return queryOptions({
    queryKey: queryKeys.admin.verification.search({
      query,
      page,
    }),
    queryFn: () => {
      return fetchAgencyVerificationApps({ query, page });
    },
  });
};

export default agencyVerificationOptions;
