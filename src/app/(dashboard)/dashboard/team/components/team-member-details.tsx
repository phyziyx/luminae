"use client";

import useSWR from "swr";
import TeamMemberDetailsForm from "./team-member-details/form";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import getTeamMemberDetails from "../action";

interface TeamMemberDetailsProps {
  memberId: string;
}

export default function TeamMemberDetails({
  memberId,
}: TeamMemberDetailsProps) {
  const { data, error, isLoading } = useSWR(
    ["team", memberId],
    ([, memberId]) => getTeamMemberDetails(memberId)
  );

  if (error) {
    console.log("error", error);
    return <div>Error</div>;
  }

  return (
    <>
      {isLoading ? <LoadingSpinner /> : <TeamMemberDetailsForm data={data!} />}
    </>
  );
}
