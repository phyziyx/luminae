import { LoadingSpinner } from "./loading-spinner";

export default function FallbackSpinner() {
  return (
    <div className="flex items-center justify-center text-blue-500">
      <LoadingSpinner />
    </div>
  );
}
