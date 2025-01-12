"use client";

import CustomModal from "@/components/site/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { PlusCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import LaneCreateForm from "./lane-container/lane-form";
import { KanbanProvider } from "./kanban-provider";

export default function CreateLaneButton({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const t = useTranslations();
  const { openModal } = useModal();

  return (
    <Button
      variant={"default"}
      onClick={() => {
        openModal(
          <CustomModal
            title={t("KANBAN.CREATE_LANE_TITLE")}
            caption={t("KANBAN.CREATE_LANE_CAPTION")}
          >
            <KanbanProvider workspaceId={workspaceId}>
              <LaneCreateForm
                data={{
                  id: workspaceId,
                  name: "",
                  colour: "AA00AA",
                }}
              />
            </KanbanProvider>
          </CustomModal>
        );
      }}
    >
      <PlusCircleIcon /> <div className="md:block hidden">Create a Lane</div>
    </Button>
  );
}
