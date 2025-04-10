import { memo, useMemo } from "react";
import { Avatar as _Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AvatarProps {
  profileImage: string;
  name: string;
}

const Avatar = memo(function Avatar({ profileImage, name }: AvatarProps) {
  const initials = useMemo(
    () =>
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase(),
    [name]
  );

  return (
    <_Avatar className="h-20 w-20 border-2 border-white dark:border-gray-800 shadow-sm">
      <AvatarImage src={profileImage} alt={name} />
      <AvatarFallback className="bg-primary dark:bg-primary-light text-white dark:text-gray-900">
        {initials}
      </AvatarFallback>
    </_Avatar>
  );
});

export default Avatar;
