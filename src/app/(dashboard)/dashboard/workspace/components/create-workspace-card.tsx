"use server";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { CreateWorkspaceButton } from "./create-workspace-button";

interface CreateWorkspaceCardProps {
  created: number;
  max: number;
}

const CreateWorkspaceCard = async ({
  created,
  max,
}: CreateWorkspaceCardProps) => {
  const t = await getTranslations();

  const isInfinite = max === -1;
  const isLimitReached = !isInfinite && created >= max;

  return (
    <Card className="gap-2 max-w-sm max-h-sm bg-white dark:bg-muted/50">
      <CardHeader>
        <CardTitle className="flex flex-row place-content-between">
          {t("WORKSPACE_DETAILS.CREATE_A_WORKSPACE")}
          {!isInfinite &&
            (isLimitReached ? (
              <Badge variant={"destructive"}>
                {t("WORKSPACE_DETAILS.NO_QUANTITY_LEFT")}
              </Badge>
            ) : (
              <Badge variant={"default"}>
                {t("WORKSPACE_DETAILS.QUANTITY_LEFT", {
                  QUANTITY: max - created,
                })}
              </Badge>
            ))}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {t("WORKSPACE_DETAILS.CREATE_WORKSACE_DESCRIPTION")}
        </CardDescription>
      </CardContent>
      <CardFooter className="gap-2">
        <CreateWorkspaceButton disabled={isLimitReached} />
      </CardFooter>
    </Card>
  );
};

export default CreateWorkspaceCard;
