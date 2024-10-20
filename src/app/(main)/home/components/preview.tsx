"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";

const PreviewImage = () => {
  const t = useTranslations();
  const { theme } = useTheme();

  const isLight = theme !== "dark";

  return (
    <Image
      className="rounded-lg mt-[-110px] border-2 border-blue-500 drop-shadow-xl shadow-blue-500"
      src={`/assets/preview${isLight ? "_light" : ""}.png`}
      alt={t("PREVIEW")}
      width={1200}
      height={1200}
    />
  );
};

export default PreviewImage;
