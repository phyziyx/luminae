import TagBadge from "./tag-badge";

export function TagsPreview({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagBadge text={tag} key={tag} variant="default" />
      ))}
    </div>
  );
}
