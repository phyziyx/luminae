import { memo, useMemo } from "react";
import { Avatar as _Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarProps {
  profileImage: string;
  name?: string;
  className?: string;
}

const Avatar = memo(function Avatar({
  profileImage,
  name,
  className,
}: AvatarProps) {
  const initials = useMemo(() => {
    if (!name || typeof name !== "string") return "U"; // fallback to "U" if no name
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0]?.toUpperCase() ?? "U"
      : (parts[0][0] + parts[1][0]).toUpperCase();
  }, [name]);

  return (
    <_Avatar
      className={cn(
        "flex items-center justify-center h-20 w-20 border-2 border-white dark:border-gray-800 shadow-sm",
        className
      )}
    >
      <AvatarImage src={profileImage} alt={name ?? "User"} />
      <AvatarFallback className="bg-primary/10 dark:bg-primary-light/20 text-primary dark:text-primary-light">
        {initials}
      </AvatarFallback>
    </_Avatar>
  );
});

export default Avatar;
