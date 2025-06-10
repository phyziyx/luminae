import VerificationRequestItem from "./verification-request-item";

interface VerificationRequest {
  id: number;
  name: string;
  email: string;
  message: string;
  dateSubmitted: string;
  status: "pending" | "verified" | "rejected";
  attachment?: {
    name: string;
    size: number;
    url: string;
  } | null;
}

interface VerificationRequestListProps {
  requests: VerificationRequest[];
  onStatusChange: (
    requestId: number,
    newStatus: "verified" | "rejected"
  ) => void;
}

export default function VerificationRequestList({
  requests,
  onStatusChange,
}: VerificationRequestListProps) {
  if (requests.length === 0) {
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
