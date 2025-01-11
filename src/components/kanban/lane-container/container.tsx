import { Lane } from "@prisma/client";
import { useCollapse } from "../collapse-provider";
import LaneContainerHeader from "./header";
import LaneContainerBody from "./body";
import LaneContainerFooter from "./footer";

export default function LaneContainer({ lane }: { lane: Lane }) {
  const { getCollapseState } = useCollapse();

  const collapsed = getCollapseState(lane.id);

  if (collapsed) {
    // w-12
    return (
      <div className="transition-all ease-in-out duration-300 flex items-center">
        <LaneContainerHeader
          id={lane.id}
          colour={lane.colour}
          name={lane.name}
        />
      </div>
    );
  }

  return (
    <div className="transition-all ease-in-out duration-300 bg-slate-200/50 dark:white/50 h-full rounded-lg gap-0 p-0 space-x-0 space-y-0 flex flex-col mb-2">
      <LaneContainerHeader id={lane.id} colour={lane.colour} name={lane.name} />
      <LaneContainerBody laneId={lane.id} />
      <LaneContainerFooter />
    </div>
  );
}
