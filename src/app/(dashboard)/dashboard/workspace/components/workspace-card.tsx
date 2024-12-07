"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Workspace } from "@prisma/client";
import { WorkspaceButtons } from "./workspace-buttons";

interface WorkspaceCardProps {
  workspace: Pick<Workspace, "id" | "name" | "description">;
}

const WorkspaceCard = async ({ workspace }: WorkspaceCardProps) => {
  return (
    <Card
      key={workspace.id}
      className="flex flex-col gap-2 max-w-sm bg-white dark:bg-muted/90"
    >
      <CardHeader>
        <CardTitle className="flex flex-row place-content-between">
          {workspace.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{workspace.description}</CardDescription>
      </CardContent>
      <CardFooter className="gap-2">
        <WorkspaceButtons workspace={workspace} />
      </CardFooter>
    </Card>
  );
};

export default WorkspaceCard;
