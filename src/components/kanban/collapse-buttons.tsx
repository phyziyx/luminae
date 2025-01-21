import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useKanban } from "@/providers/kanban-provider";

// NOTE: Collapse all will not work properly because it is not aware of the IDs.

export default function CollapseButtons() {
  const { collapseAll, collapseNone } = useKanban();

  return (
    <div className="flex flex-col gap-2">
      <Button variant="ghost" onClick={collapseNone}>
        <MaximizeIcon />
      </Button>
      <Button variant="ghost" onClick={collapseAll}>
        <MinimizeIcon />
      </Button>
    </div>
  );
}
