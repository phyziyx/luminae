import { fetchAgencyVerificationApps } from "@/lib/managers/agencyManager";
import { queryKeys } from "@/lib/react-query";
import { queryOptions } from "@tanstack/react-query";

const agencyVerificationOptions = ({ appId = "", query = "" }) => {
  return queryOptions({
    queryKey: queryKeys.admin.verification.search({
      appId,
      query,
    }),
    queryFn: () => {
      return fetchAgencyVerificationApps({ appId });
    },
  });
};

export default agencyVerificationOptions;
