import { AgencyVerificationRequest } from "@/lib/types";
import VerificationRequestItem from "./verification-request-item";

interface VerificationRequestListProps {
  requests: AgencyVerificationRequest[];
  onStatusChange: (
    requestId: string,
    newStatus: "APPROVED" | "REJECTED"
  ) => void;
}

export default function VerificationRequestList({
  requests,
  onStatusChange,
}: VerificationRequestListProps) {
  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-gray-800 p-12 text-center shadow-soft">
        <div className="mb-4 text-4xl">📋</div>
        <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
          No requests found
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          No verification requests match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <VerificationRequestItem
          key={request.id}
          request={request}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
