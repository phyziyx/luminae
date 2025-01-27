import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function CommunityUser() {
  const t = useTranslations();

  return (
    <div className="max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        {t("COMMUNITY_FORUM.WELCOME")}
      </h2>
      <p className="text-lg mb-6 text-blue-700 dark:text-slate-100">
        {t("COMMUNITY_FORUM.COMING_SOON")}
      </p>
      <p className="text-blue-600 dark:text-slate-100">
        {t("COMMUNITY_FORUM.WORKING_HARD")}
      </p>
      <Link href="/">
        <Button className="mt-2">{t("BUTTONS.BACK_TO_HOME")}</Button>
      </Link>
    </div>
  );
}
