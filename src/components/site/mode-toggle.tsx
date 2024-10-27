import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import useIsMounted from "@/hooks/use-mounted";

const ModeToggle = () => {
  const isMounted = useIsMounted();
  const { theme, setTheme } = useTheme();

  if (!isMounted) {
    return null;
  }

  const onChange = () => {
    // Note: Theme can be undefined, "light", or "dark"
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="ghost" onClick={() => onChange()}>
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ModeToggle;
