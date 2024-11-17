import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

interface CreateWorkspaceCardProps {
  created: number;
  max: number;
}

const CreateWorkspaceCard = async ({
  created,
  max,
}: CreateWorkspaceCardProps) => {
  const t = await getTranslations();

  const isLimitReached = created >= max;

  return (
    <Card className="gap-2 max-w-sm max-h-sm bg-white">
      <CardHeader>
        <CardTitle className="flex flex-row place-content-between">
          {t("WORKSPACE_DETAILS.CREATE_A_WORKSPACE")}
          {isLimitReached ? (
            <Badge variant={"destructive"}>
              {t("WORKSPACE_DETAILS.NO_QUANTITY_LEFT")}
            </Badge>
          ) : (
            <Badge variant={"default"}>
              {t("WORKSPACE_DETAILS.QUANTITY_LEFT", {
                QUANTITY: max - created,
              })}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {t("WORKSPACE_DETAILS.CREATE_WORKSACE_DESCRIPTION")}
        </CardDescription>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant={"default"}
          disabled={isLimitReached}
          className="w-full"
        >
          {t("CREATE_WORKSPACE")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateWorkspaceCard;
