import TicketCard from "../ticket-card";

export default function LaneContainerBody({ laneId }: { laneId: string }) {
  return (
    <div className="w-full h-fit p-2">
      {[].map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
