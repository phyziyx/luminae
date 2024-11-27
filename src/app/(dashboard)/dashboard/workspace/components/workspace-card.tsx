import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Workspace } from "@prisma/client";
import { getTranslations } from "next-intl/server";

interface WorkspaceCardProps {
  workspace: Pick<Workspace, "id" | "name" | "description">;
}

const WorkspaceCard = async ({ workspace }: WorkspaceCardProps) => {
  const t = await getTranslations();

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
        <Button variant={"default"} className="w-full">
          {t("WORKSPACE_DETAILS.VIEW")}
        </Button>
        <Button variant={"secondary"} className="w-full">
          {t("WORKSPACE_DETAILS.EDIT")}
        </Button>
        <Button variant={"destructive"} className="w-full">
          {t("WORKSPACE_DETAILS.DELETE")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkspaceCard;
