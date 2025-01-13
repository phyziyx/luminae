import { LoadingSpinner } from "./loading-spinner";

export default function FallbackSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen text-blue-500">
      <LoadingSpinner />
    </div>
  );
}
