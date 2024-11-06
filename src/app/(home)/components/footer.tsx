import { getTranslations } from "next-intl/server";
import Image from "next/image";

const Footer = async () => {
  const date = new Date().getFullYear();

  const t = await getTranslations();

  return (
    <footer className="bg-muted dark:bg-muted/60 text-[#BCBCBC] text-sm py-10 text-center">
      <div className="containter">
        <div className="inline-flex relative">
          <div className="flex flex-col place-items-center rounded-lg p-2">
            <Image
              src="/assets/bulb.png"
              height={40}
              width={40}
              alt="Logo"
              className="relative"
            />
            <Image
              src="/assets/luminae_plain.png"
              height={96}
              width={96}
              alt="Logo"
              className="relative"
            />
          </div>
        </div>
        <p className="text-black mt-6">
          &copy; {date} {t("COPYRIGHT")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
