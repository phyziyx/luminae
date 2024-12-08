"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { deleteWorkspace } from "./actions";
import { useActionState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import CustomModal from "@/components/site/custom-modal";
import WorkspaceDetails from "@/app/(dashboard)/components/workspace-details/workspace-details";
import { useModal } from "@/providers/modal-provider";
import { Workspace } from "@prisma/client";

export const WorkspaceButtons = ({
  workspace,
}: {
  workspace: Partial<Workspace>;
}) => {
  const t = useTranslations();
  const { toast } = useToast();

  const deleteWorkspaceWithId = deleteWorkspace.bind(null, workspace.id!);
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteWorkspaceWithId,
    {
      error: "",
    }
  );

  const { openModal } = useModal();

  useEffect(() => {
    if (deleteState && deleteState.error) {
      toast({
        title: "Workspace information saved successfully",
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteState]);

  return (
    <>
      <Button
        onClick={() => {
          redirect(`/workspace/${workspace.id!}`);
        }}
        variant={"default"}
        className="w-full"
        disabled={isDeleting}
        aria-disabled={isDeleting}
      >
        {t("WORKSPACE_DETAILS.VIEW")}
      </Button>
      <Button
        onClick={() => {
          openModal(
            <CustomModal
              title={t("CREATE_WORKSPACE")}
              caption={t("CREATE_WORKSPACE_CAPTION")}
            >
              <WorkspaceDetails
                data={{
                  ...workspace,
                }}
              />
            </CustomModal>
          );
        }}
        variant={"secondary"}
        className="w-full"
        disabled={isDeleting}
        aria-disabled={isDeleting}
      >
        {t("WORKSPACE_DETAILS.EDIT")}
      </Button>
      <form className="w-full" action={deleteAction}>
        <Button
          type="submit"
          className="w-full"
          disabled={isDeleting}
          aria-disabled={isDeleting}
          variant={"destructive"}
          // onClick={deleteAction}
        >
          {isDeleting
            ? t("WORKSPACE_DETAILS.DELETING")
            : t("WORKSPACE_DETAILS.DELETE")}
        </Button>
      </form>
    </>
  );
};
