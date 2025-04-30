import Link from "next/link";

export function PostCategoryBadge({ name }: { name: string }) {
  return (
    <Link href={`/community/${name}`}>
      <span className="rounded-full bg-primary/10 dark:bg-primary-light/20 px-3 py-1 text-xs font-medium text-primary dark:text-primary-light">
        {name}
      </span>
    </Link>
  );
}
