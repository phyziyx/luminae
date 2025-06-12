import getQueryClient, { queryKeys } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

async function updateVerificationStatus(
  requestId: string,
  newStatus: "APPROVED" | "REJECTED"
) {
  const response = await fetch(`/api/agency/verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: requestId, status: newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to update verification status");
  }

  return response.json();
}

export function useUpdateVerificationStatus() {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      newStatus,
    }: {
      requestId: string;
      newStatus: "APPROVED" | "REJECTED";
    }) => updateVerificationStatus(requestId, newStatus),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.admin.verification.all],
      });
    },
  });
}
