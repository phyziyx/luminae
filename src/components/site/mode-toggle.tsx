import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
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
