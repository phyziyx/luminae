"use server";

// import { stripe } from "@/lib/stripe";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import PreviewImage from "./components/preview";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import ImageGrid from "./components/image-grid";
import Pricing from "./components/pricing";
import Testimonials from "./components/testimonials";

export default async function Page() {
  // const prices = await stripe.prices.list({
  //   product: process.env.NEXT_PLURA_PRODUCT_ID,
  //   active: true,
  // });

  const t = await getTranslations();

  return (
    <main className="h-full">
      <Navigation />

      {/* Hero Section */}
      <section className="dark:bg-black flex flex-col items-center h-full w-full text-center justify-center px-4 lg:px-20">
        <div className="text-center text-xs flex flex-col justify-center">
          <h1 className="mt-10 text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-300 animate-highlight bg-200">
            <span>{t("MOTTO_BRIGHTEN")}</span>
            <span className="bg-radial-higlight bg-clip-text text-transparent animate-highlight bg-200">
              {t("MOTTO_WORKSPACE")}
            </span>
            <span>{t("MOTTO_SIMPLIFY")}</span>
            <span className="bg-radial-higlight bg-clip-text text-transparent animate-highlight bg-200">
              {t("MOTTO_PROCESS")}
            </span>
          </h1>
        </div>
        <div className="mt-5 w-full flex justify-center sm:flex-col sm:items-center md:flex-row relative">
          <Image
            className="w-[250px] sm:w-[350px] md:w-[550px] lg:w-[650px] xl:w-[750px]"
            src={"/assets/logo.png"}
            alt={t("LUMINAE")}
            width={1200}
            height={1200}
          />
        </div>
        <div className="mt-10 w-full flex justify-center sm:flex-col sm:items-center md:flex-row relative z-10">
          <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]">
            <PreviewImage />
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="py-16 flex flex-col gap-16 px-8 md:px-16 items-center">
          <h2 className="text-3xl font-bold text-center text-balance">
            {t("TRUSTED_BY")}
          </h2>
          <ImageGrid />
        </div>
      </section>

      <Pricing />

      <Testimonials />

      <Footer />
    </main>
  );
}
