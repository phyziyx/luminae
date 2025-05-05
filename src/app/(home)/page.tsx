"use server";

// import { stripe } from "@/lib/stripe";
import { getTranslations } from "next-intl/server";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import ImageGrid from "./components/image-grid";
import Pricing from "./components/pricing";
import Testimonials from "./components/testimonials";

import PackageManager from "@/lib/managers/packageManager";
import { getSession } from "@/lib/auth/auth";
import Hero from "./components/hero";

// This is a server-side component, which means it is rendered on the server and handled by Next.js internally.
// We can perform server-side operations over here and then pass the information off to the clients as props...
export default async function Page() {
  const session = await getSession();
  const t = await getTranslations();

  const packages = await PackageManager.getPackages();
  const userId = session?.user?.id;

  return (
    <main className="h-full">
      {/* Hero Section */}
      <Navigation user={!!userId} />

      <Hero />

      <section className="bg-primary text-primary-foreground">
        <div className="py-16 flex flex-col gap-16 px-8 md:px-16 items-center">
          <h2 className="text-3xl font-bold text-center text-balance">
            {t("TRUSTED_BY")}
          </h2>
          <ImageGrid />
        </div>
      </section>

      <Pricing
        packages={packages.map((p) => ({
          ...p,
          monthlyPrice: Number(p.monthlyPrice),
        }))}
      />

      <Testimonials />

      <Footer />
    </main>
  );
}
