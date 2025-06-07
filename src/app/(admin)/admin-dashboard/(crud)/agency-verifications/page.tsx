import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/auth";
import { getTranslations } from "next-intl/server";
import getQueryClient, { queryKeys } from "@/lib/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import agencyVerificationOptions from "./_components/query-option";
import AgencyVerificationList from "./_components/list";

async function AgencyVerificationPage() {
  const session = await getSession();
  const t = await getTranslations();
  const queryClient = getQueryClient();

  if (!session?.user) {
    return <div>{t("ERROR_MESSAGES.NOT_AUTHENTICATED")}</div>;
  }

  void queryClient.prefetchQuery(
    agencyVerificationOptions({
      appId: "",
      query: "",
    })
  );

  return (
    <>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-3xl font-semibold">
          {t("AGENCY_VERIFICATIONS.HEADER")}
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AgencyVerificationList />
        </HydrationBoundary>
      </div>
    </>
  );
}

export default AgencyVerificationPage;
