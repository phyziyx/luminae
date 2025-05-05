"use server";

// import { stripe } from "@/lib/stripe";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Pricing from "./components/pricing";
import Testimonials from "./components/testimonials";

import PackageManager from "@/lib/managers/packageManager";
import { getSession } from "@/lib/auth/auth";
import Hero from "./components/hero";
import TrustedBy from "./components/trustedby";
import VerticalTimeline from "./components/timeline";

// This is a server-side component, which means it is rendered on the server and handled by Next.js internally.
// We can perform server-side operations over here and then pass the information off to the clients as props...
export default async function Page() {
  const session = await getSession();

  const packages = await PackageManager.getPackages();
  const userId = session?.user?.id;

  return (
    <main className="h-full">
      {/* Hero Section */}
      <Navigation user={!!userId} />

      <Hero />

      <TrustedBy />

      <VerticalTimeline />

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
