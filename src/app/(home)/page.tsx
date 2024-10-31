"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
// import { stripe } from "@/lib/stripe";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import PreviewImage from "./components/preview";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();
  const t = await getTranslations();

  return (
    <main className="h-full">
      <Navigation user={!!userId} />
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
        <Footer />
      </section>
    </main>
  );

  return (
    <>
      <section className="h-full w-full md:pt-44 mt-[-70px] relative flex items-center justify-center flex-col ">
        {/* grid */}

        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />
        <p className="mt-48 text-center">Run your agency, in one place</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            Luminae
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-70px]">
          <Image
            src={"/assets/preview.png"}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px]">
        <h2 className="text-4xl text-center"> Choose what fits you right</h2>
        <p className="text-muted-foreground text-center">
          Our straightforward pricing plans are tailored to meet your needs. If
          {" you're"} not <br />
          ready to commit you can get started for free.
        </p>
        <div className="flex  justify-center gap-4 flex-wrap mt-6">
          {/* pricing cards */}
          <Card className={clsx("w-[300px] flex flex-col justify-between")}>
            <CardHeader>
              <CardTitle
                className={clsx({
                  "text-muted-foreground": true,
                })}
              >
                {pricingCards[0].title}
              </CardTitle>
              <CardDescription>{pricingCards[0].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">$0</span>
              <span>/ month</span>
            </CardContent>
            <CardFooter className="flex flex-col  items-start gap-4 ">
              <div>
                {pricingCards
                  .find((c) => c.title === "Starter")
                  ?.features.map((feature) => (
                    <div key={feature} className="flex gap-2">
                      <Check />
                      <p>{feature}</p>
                    </div>
                  ))}
              </div>
              <Link
                href="/agency"
                className={clsx(
                  "w-full text-center bg-primary p-2 rounded-md",
                  {
                    "!bg-muted-foreground": true,
                  }
                )}
              >
                Get Started
              </Link>
            </CardFooter>
          </Card>

          {/* {prices.data.map((card) => (
            //WIP: Wire up free product from stripe
            <Card
              key={card.nickname}
              className={clsx("w-[300px] flex flex-col justify-between", {
                "border-2 border-primary": card.nickname === "Unlimited Saas",
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx("", {
                    "text-muted-foreground": card.nickname !== "Unlimited Saas",
                  })}
                >
                  {card.nickname}
                </CardTitle>
                <CardDescription>
                  {pricingCards.find((c) => c.title === card.nickname)
                    ?.description || "UNKNOWN"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  ${card.unit_amount && card.unit_amount / 100}
                </span>
                <span className="text-muted-foreground">
                  <span>/ {card.recurring?.interval}</span>
                </span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {pricingCards
                    .find((c) => c.title === card.nickname)
                    ?.features.map((feature) => (
                      <div key={feature} className="flex gap-2">
                        <Check />
                        <p>{feature}</p>
                      </div>
                    ))}
                </div>
                <Link
                  href={`/agency?plan=${card.id}`}
                  className={clsx(
                    "w-full text-center bg-primary p-2 rounded-md",
                    {
                      "!bg-muted-foreground":
                        card.nickname !== "Unlimited Saas",
                    }
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))} */}
        </div>
        <section className="flex justify-center items-center flex-col gap-4 w-full">
          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
            <h1 className="text-2xl right-0 font-bold text-center w-full">
              LEVEL UP. FASTER.
            </h1>
          </div>
          <div className="max-w-lg flex flex-row justify-between gap-10">
            <Card className="bg-transparent border-2 border-primary">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>
                  Interested in our product? Contact our support team for a
                  package tailored to your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-row">
                  <Input type="email" placeholder="Enter your email..." />
                  <Button type="submit">Submit</Button>
                </form>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-default-900 italic">
                  Our support team contacts between 24 - 48 hours!
                </p>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section className="text-default-400 w-full h-4 relative flex items-center justify-center flex-col">
          <footer>Luminae (c) 2024</footer>
        </section>
      </section>
    </>
  );
}
