import ThemedImage from "@/components/site/themed-image";
import { getTranslations } from "next-intl/server";

const PreviewImage = async () => {
  const t = await getTranslations();

  return (
    <ThemedImage
      className="w-full h-auto rounded-xl object-cover"
      srcDark={`/assets/preview.png`}
      srcLight={`/assets/preview_light.png`}
      alt={t("PREVIEW")}
      width={1080}
      height={1080}
      priority
    />
  );
};

export default PreviewImage;
