import Link from "next/link";

export default function Author({
  name,
  id,
  isAgency,
}: {
  name: string;
  id: string;
  isAgency: boolean;
}) {
  return (
    <Link
      href={`/community/profile/${isAgency ? "a-" : ""}${id}`}
      className="hover:underline hover:decoration-primary decoration-2 underline-offset-2"
    >
      <span className="font-medium text-gray-800 dark:text-gray-200">
        {name}
      </span>
    </Link>
  );
}
