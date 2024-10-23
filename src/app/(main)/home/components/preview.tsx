import ThemedImage from "@/components/site/themed-image";
import { getTranslations } from "next-intl/server";

const PreviewImage = async () => {
  const t = await getTranslations();

  return (
    <ThemedImage
      className="rounded-lg md:mt-[-110px] sm:mt-[-75px] mt-[-65px] border-2 border-blue-500 drop-shadow-xl shadow-blue-500"
      srcDark={`/assets/preview.png`}
      srcLight={`/assets/preview_light.png`}
      alt={t("PREVIEW")}
      width={1200}
      height={1200}
    />
  );
};

export default PreviewImage;