"use client";

import { useState } from "react";
import TeamMemberDetailsForm from "./team-member-details/form";
import { LoadingSpinner } from "@/components/site/loading-spinner";

interface TeamMemberDetailsProps {
  memberId: string;
}

export default function TeamMemberDetails({
  memberId,
}: TeamMemberDetailsProps) {
  // fake data over here
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    id: "123",
    name: "John Doe",
    email: "",
    workspaces: [
      { id: "abc", name: "Workspace 1" },
      { id: "abcd", name: "Workspace 2" },
      { id: "abcde", name: "Workspace 3" },
      { id: "abcdef", name: "Workspace 4" },
      { id: "abcdefg", name: "Workspace 5" },
    ],
  });

  // const { data, error } = useSWR("/api/team-member-details", {
  //   body: JSON.stringify({ memberId }),
  // });

  // if (error) return <div>Failed to load</div>
  // if (!data) return <div>Loading...</div>

  return (
    <>
      {isLoading ? <LoadingSpinner /> : <TeamMemberDetailsForm data={data} />}
    </>
  );
}
