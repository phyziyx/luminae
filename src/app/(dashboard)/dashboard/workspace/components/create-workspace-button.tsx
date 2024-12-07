"use client";

import WorkspaceDetails from "@/app/(dashboard)/components/workspace-details/workspace-details";
import CustomModal from "@/components/site/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { useTranslations } from "next-intl";

export const CreateWorkspaceButton = ({ disabled }: { disabled: boolean }) => {
  const t = useTranslations();
  const { openModal } = useModal();

  return (
    <Button
      onClick={() => {
        if (disabled) return;

        openModal(
          <CustomModal
            title={t("CREATE_WORKSPACE")}
            caption={t("CREATE_WORKSPACE_CAPTION")}
          >
            <WorkspaceDetails />
          </CustomModal>
        );
      }}
      variant={"default"}
      disabled={disabled}
      className="w-full"
    >
      {t("CREATE_WORKSPACE")}
    </Button>
  );
};
