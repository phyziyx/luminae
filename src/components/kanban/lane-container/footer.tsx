import { Button } from "@/components/ui/button";
import { CalendarIcon, User2Icon, Link2Icon } from "lucide-react";

export default function LaneContainerFooter() {
  return (
    <div className="rounded-bl-lg rounded-br-lg h-14 backdrop-blur-lg dark:bg-background/40 bg-slate-500/20 z-10">
      <div className="bg-white/10 h-full flex items-center p-4 justify-between cursor-grab border-t-[1px]">
        <div className="flex items-center w-full gap-2">
          <Button
            variant={"ghost"}
            className="p-2 hover:bg-transparent bg-transparent font-bold text-sm"
          >
            Add a Ticket...
          </Button>
        </div>
        <LaneContainerFooterActions />
      </div>
    </div>
  );
}

function LaneContainerFooterActions() {
  return (
    <div className="flex items-center flex-row">
      <CalendarIcon className="text-muted-foreground cursor-pointer" />
      <User2Icon className="text-muted-foreground cursor-pointer" />
      <Link2Icon className="text-muted-foreground cursor-pointer" />
    </div>
  );
}
